import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const WorkerAssignment = () => {
    const { bookingId, itemIndex } = useParams();
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [locations, setLocations] = useState({ states: [], cities: [], areas: [] });
    const [allJobs, setAllJobs] = useState([]);
    const [jobCategories, setJobCategories] = useState([]);
    const [filters, setFilters] = useState({ state: "", city: "", area: "", category: "", jobName: "" });

    useEffect(() => {
        fetchInitialData();
        fetchMasterData();
    }, [bookingId, itemIndex]);

    useEffect(() => {
        if (filters.category || filters.city || filters.jobName || filters.state || filters.area) {
            fetchWorkers();
        }
    }, [filters]);

    const fetchMasterData = async () => {
        try {
            const [sRes, cRes, aRes, jRes] = await Promise.all([
                api.get('/locations/states'),
                api.get('/locations/cities'),
                api.get('/locations/areas'),
                api.get('/jobs')
            ]);
            setLocations({ 
                states: sRes.data || [], 
                cities: cRes.data || [], 
                areas: aRes.data || [] 
            });
            const jobs = jRes.data || [];
            setAllJobs(jobs);
            setJobCategories([...new Set(jobs.map(j => j.category.name))]);
        } catch (err) {
            console.error("Error fetching master data", err);
        }
    };

    const fetchInitialData = async () => {
        try {
            const bRes = await api.get(`/bookings/${bookingId}`);
            const currentBooking = bRes.data.data;
            setBooking(currentBooking);
            
            const targetItem = currentBooking.items[itemIndex];
            setFilters(prev => ({
                ...prev,
                jobName: targetItem.worker_type,
                city: currentBooking.service_address.city
            }));
        } catch (err) {
            console.error("Error fetching booking", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkers = async () => {
        try {
            const params = { ...filters, work_type: filters.jobName };
            const wRes = await api.get(`/workers`, { params });
            setWorkers(wRes.data.data || wRes.data);
        } catch (err) {
            console.error("Error fetching workers", err);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'state') setFilters(prev => ({ ...prev, state: value, city: "", area: "" }));
        else if (name === 'city') setFilters(prev => ({ ...prev, city: value, area: "" }));
        else if (name === 'category') setFilters(prev => ({ ...prev, category: value, jobName: "" }));
        else setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleAssign = async (workerId, assigneeType) => {
        setBtnLoading(`${workerId}-${assigneeType}`);
        try {
            const payload = {
                bookingId: booking._id,
                itemIndex: parseInt(itemIndex), 
                leadWorkerId: workerId,
                tasks: [{
                    work_type: booking.items[itemIndex].worker_type,
                    assignee_type: assigneeType,
                    status: 'pending'
                }]
            };
            await api.post('/assignments/create', payload);
            navigate(`/bookings/${bookingId}`);
        } catch (err) {
            alert("Assignment failed.");
        } finally {
            setBtnLoading(null);
        }
    };

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="main-content px-4 mt-4">
            <div className="row">
                {/* Sidebar Filters */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">Advanced Filters</h6>
                                <button className="btn btn-sm text-danger fw-bold" onClick={() => setFilters({state:"", city:"", area:"", category:"", jobName:""})}>Clear All</button>
                            </div>

                            {/* Job Selectors */}
                            <label className="small fw-bold text-muted text-uppercase mb-1">Job Details</label>
                            <select className="form-select mb-2" name="category" value={filters.category} onChange={handleFilterChange}>
                                <option value="">Select Category</option>
                                {jobCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <select className="form-select mb-3" name="jobName" value={filters.jobName} onChange={handleFilterChange}>
                                <option value="">Select Job Type</option>
                                {allJobs.filter(j => !filters.category || j.category.name === filters.category).map(j => (
                                    <option key={j._id} value={j.jobName}>{j.jobName}</option>
                                ))}
                            </select>

                            {/* Location Selectors */}
                            <label className="small fw-bold text-muted text-uppercase mb-1">Location</label>
                            <select className="form-select mb-2" name="state" value={filters.state} onChange={handleFilterChange}>
                                <option value="">Select State</option>
                                {locations.states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                            </select>
                            <select className="form-select mb-2" name="city" value={filters.city} onChange={handleFilterChange}>
                                <option value="">Select City</option>
                                {locations.cities.filter(c => !filters.state || c.state.name === filters.state).map(c => (
                                    <option key={c._id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <select className="form-select mb-3" name="area" value={filters.area} onChange={handleFilterChange}>
                                <option value="">Select Area</option>
                                {locations.areas.filter(a => !filters.city || a.city.name === filters.city).map(a => (
                                    <option key={a._id} value={a.name}>{a.name}</option>
                                ))}
                            </select>

                            <input type="text" className="form-control" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Worker List */}
                <div className="col-lg-8">
                    {workers.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase())).map(worker => (
                        <div key={worker._id} className="card border-0 shadow-sm mb-3">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-md bg-soft-primary text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{width: '50px', height: '50px', backgroundColor: '#eef2ff'}}>
                                            {worker.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h6 className="mb-1 fw-bold">{worker.name}</h6>
                                            <div className="small text-muted mb-2">
                                                <i className="feather-map-pin me-1"></i>{worker.city} {worker.area ? `(${worker.area})` : ''}
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                <span className="badge bg-primary-soft text-primary border-0 text-capitalize">{worker.work_type}</span>
                                                {worker.team_members?.map(tm => (
                                                    <span key={tm._id} className="badge bg-light text-dark border fw-normal">
                                                        {tm.type.replace(/_/g, ' ')}: <strong>{tm.workers}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
                                        onClick={() => handleAssign(worker._id, 'self')}
                                        disabled={btnLoading === `${worker._id}-self`}
                                    >
                                        {btnLoading === `${worker._id}-self` ? '...' : 'Assign'}
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