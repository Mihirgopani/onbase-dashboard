import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const WorkerAssignment = () => {
    const { bookingId, itemIndex } = useParams();
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState(null);
    const [allWorkers, setAllWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [locations, setLocations] = useState({ states: [], cities: [], areas: [] });
    const [allJobs, setAllJobs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [filters, setFilters] = useState({
        state: "Gujarat",
        city: "Ahmedabad", // Hardcoded baseline
        area: "",
        workCategory: "",
        workType: ""
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [sRes, cRes, aRes, jRes, bRes, wRes] = await Promise.all([
                    api.get('/locations/states'),
                    api.get('/locations/cities'),
                    api.get('/locations/areas'),
                    api.get('/jobs'),
                    api.get(`/bookings/${bookingId}`),
                    api.get('/workers')
                ]);

                const states = sRes.data || [];
                const cities = cRes.data || [];
                const areas = aRes.data || [];
                const jobs = jRes.data || [];
                const currentBooking = bRes.data?.data;
                const targetItem = currentBooking?.items[itemIndex];
                const workers = Array.isArray(wRes.data) ? wRes.data : wRes.data.data || [];

                setLocations({ states, cities, areas });
                setAllJobs(jobs);
                setCategories([...new Set(jobs.map(j => j.category?.name).filter(Boolean))]);
                setAllWorkers(workers);
                setBooking(currentBooking);

                // Logical Default Assignment
                if (currentBooking && targetItem) {
                    setFilters({
                        // 1. Check Booking -> 2. Check "Gujarat" exists in API -> 3. Take first API state
                        state: currentBooking.service_address?.state || 
                               (states.find(s => s.name === "Gujarat")?.name) || 
                               (states[0]?.name || ""),
                        
                        // 1. Check Booking -> 2. Check "Ahmedabad" exists in API -> 3. Take first API city
                        city: currentBooking.service_address?.city || 
                              (cities.find(c => c.name === "Ahmedabad")?.name) || 
                              (cities[0]?.name || ""),
                              
                        area: currentBooking.service_address?.area || "",
                        workCategory: targetItem.category_name || "",
                        workType: targetItem.worker_type || ""
                    });
                }
            } catch (err) {
                console.error("❌ Data Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [bookingId, itemIndex]);

    const filteredWorkers = useMemo(() => {
        return allWorkers.filter(worker => {
            const matchesSearch = !searchQuery || 
                worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                worker.phone_number?.includes(searchQuery);

            const matchesState = !filters.state || !worker.state || worker.state === filters.state;

            // City Mapping
            const workerCityObj = locations.cities.find(c => c._id === worker.city);
            const workerCityName = workerCityObj ? workerCityObj.name : worker.city;
            const matchesCity = !filters.city || 
                workerCityName?.toLowerCase() === filters.city.toLowerCase() ||
                worker.city === filters.city;

            // Area Mapping
            const workerAreaObj = locations.areas.find(a => a._id === worker.area);
            const workerAreaName = workerAreaObj ? workerAreaObj.name : worker.area;
            const matchesArea = !filters.area || 
                workerAreaName?.toLowerCase() === filters.area.toLowerCase() ||
                worker.area === filters.area;

            const targetSkill = filters.workType?.toLowerCase() || "";
            const normalizedSkill = targetSkill.replace(/\s+/g, '_');
            const matchesCategory = !filters.workCategory || 
                worker.work_type?.toLowerCase() === filters.workCategory.toLowerCase();

            const hasSkill = !targetSkill || 
                worker.work_type?.toLowerCase() === targetSkill ||
                worker.team_members?.some(tm => 
                    tm.type?.toLowerCase() === normalizedSkill || 
                    tm.type?.toLowerCase().replace(/_/g, ' ') === targetSkill
                );

            return matchesSearch && matchesState && matchesCity && matchesArea && matchesCategory && hasSkill;
        });
    }, [allWorkers, filters, searchQuery, locations.cities, locations.areas]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleAssign = async (workerId) => {
        setBtnLoading(workerId);
        try {
            const targetItem = booking.items[itemIndex];
            await api.post('/assignments/create', {
                bookingId: booking._id,
                itemId: targetItem._id,
                leadWorkerId: workerId,
                tasks: [{ work_type: targetItem.worker_type, status: 'pending' }]
            });
            navigate(`/bookings/${bookingId}`);
        } catch (err) {
            alert("Assignment failed");
        } finally {
            setBtnLoading(null);
        }
    };

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="main-content px-4 mt-4">
            <div className="row">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
                        <h6 className="fw-bold mb-3 text-primary">Assignment Filters</h6>
                        
                        <div className="mb-3">
                            <label className="small fw-bold text-muted text-uppercase">State</label>
                            <select className="form-select" name="state" value={filters.state} onChange={handleFilterChange}>
                                <option value="">Select State</option>
                                {locations.states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="small fw-bold text-muted text-uppercase">City</label>
                            <select className="form-select" name="city" value={filters.city} onChange={handleFilterChange}>
                                <option value="">Select City</option>
                                {locations.cities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="small fw-bold text-muted text-uppercase">Area</label>
                            <select className="form-select" name="area" value={filters.area} onChange={handleFilterChange}>
                                <option value="">Select Area</option>
                                {locations.areas.filter(a => !filters.city || a.city?.name === filters.city).map(a => (
                                    <option key={a._id} value={a.name}>{a.name}</option>
                                ))}
                            </select>
                        </div>

                        <hr />

                        <div className="mb-3">
                            <label className="small fw-bold text-muted text-uppercase">Work Category</label>
                            <select className="form-select" name="workCategory" value={filters.workCategory} onChange={handleFilterChange}>
                                <option value="">All Categories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="small fw-bold text-muted text-uppercase">Work Type (Skill)</label>
                            <select className="form-select" name="workType" value={filters.workType} onChange={handleFilterChange}>
                                <option value="">All Skills</option>
                                {allJobs.map(j => <option key={j._id} value={j.jobName}>{j.jobName}</option>)}
                            </select>
                        </div>

                        <input type="text" className="form-control" placeholder="Search name/phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">Qualified Professionals</h5>
                        <span className="badge bg-primary px-3">{filteredWorkers.length} matching</span>
                    </div>

                    {filteredWorkers.map(worker => (
                        <div key={worker._id} className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-start">
                                        <div className="avatar-md bg-soft-primary text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{width: '50px', height: '50px'}}>
                                            {worker.name?.charAt(0) || 'W'}
                                        </div>
                                        <div>
                                            <h6 className="mb-1 fw-bold">{worker.name || "Unknown"}</h6>
                                            <small className="text-muted d-block mb-2">{worker.phone_number}</small>
                                            
                                            <div className="d-flex flex-wrap gap-2">
                                                <span className="badge bg-soft-primary text-primary border text-capitalize">
                                                    {worker.work_type}
                                                </span>
                                                {worker.team_members?.map((tm, idx) => (
                                                    <span key={idx} className="badge bg-light text-dark border text-capitalize">
                                                        {tm.type?.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm px-4 rounded-pill" onClick={() => handleAssign(worker._id)} disabled={btnLoading === worker._id}>
                                        {btnLoading === worker._id ? 'Assigning...' : 'Assign'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkerAssignment;