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
    state: "",
    city: "",
    area: "",
    category: "",
    workType: ""
  });

  const [slotFilter, setSlotFilter] = useState({
    enabled: false,
    date: new Date().toISOString().split('T')[0],
    shift: ""
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
          api.get('/workers', {
            params: {
              filterBySlot: slotFilter.enabled ? 'true' : 'false',
              date: slotFilter.enabled ? slotFilter.date : undefined,
              shift: slotFilter.enabled && slotFilter.shift ? slotFilter.shift : undefined,
            }
          })
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

        if (currentBooking && targetItem) {
          const bookingPincode = currentBooking.service_address?.pincode;
          const matchedArea = areas.find(a => a.pincode === bookingPincode);

          const selectedWorkType = targetItem.worker_type || "";
          const matchedJob = jobs.find(j => j.jobName === selectedWorkType);
          const matchedCategory = matchedJob?.category?.name || targetItem.category_name || "";

          setFilters({
            state: matchedArea?.city?.state?.name || "Gujarat",
            city: matchedArea?.city?.name || "Ahmedabad",
            area: matchedArea?._id || "",
            category: matchedCategory,
            workType: selectedWorkType
          });

          // ✅ Default slot date to booking date if available
          if (currentBooking.booking_date) {
            setSlotFilter(prev => ({
              ...prev,
              date: currentBooking.booking_date.split('T')[0]
            }));
          }
        }

      } catch (err) {
        console.error("❌ Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingId, itemIndex, slotFilter.enabled, slotFilter.date, slotFilter.shift]);

  const filteredWorkers = useMemo(() => {
    const normalize = (str) => str?.toLowerCase()?.replace(/\s+/g, '_');
    const targetSkill = normalize(filters.workType);

    return allWorkers.filter(worker => {
      const matchesSearch =
        !searchQuery ||
        worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.phone_number?.includes(searchQuery);

      const workerCityObj = locations.cities.find(c => c._id === worker.city);
      const workerState = workerCityObj?.state?.name || '';
      const matchesState = !filters.state || filters.state === workerState;

      const workerCityName = workerCityObj?.name;
      const matchesCity = !filters.city || workerCityName === filters.city;

      const matchesArea = !filters.area || worker.area === filters.area;

      const matchesCategory =
        !filters.category ||
        worker.work_type?.toLowerCase() === filters.category.toLowerCase();

      const hasSkill =
        !targetSkill ||
        worker.work_type?.toLowerCase() === targetSkill ||
        worker.team_members?.some(tm => normalize(tm.type) === targetSkill);

      return matchesSearch && matchesState && matchesCity && matchesArea && matchesCategory && hasSkill;
    });

  }, [allWorkers, filters, searchQuery, locations]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };

      if (name === 'workType' && value) {
        const selectedJob = allJobs.find(job => job.jobName === value);
        if (selectedJob?.category?.name) {
          updatedFilters.category = selectedJob.category.name;
        }
      }

      if (name === 'city') {
        updatedFilters.area = "";
      }

      return updatedFilters;
    });
  };

  const handleAssign = async (workerId) => {
    setBtnLoading(workerId);
    try {
      const targetItem = booking.items[itemIndex];

      await api.post('/assignments/create', {
        bookingId: booking._id,
        itemId: targetItem._id,
        leadWorkerId: workerId,
        tasks: [
          {
            work_type: targetItem.worker_type,
            status: 'assigned',
            assignee_type: 'self',
            team_member_reference_id: null
          }
        ]
      });

      navigate(`/bookings/${bookingId}`);
    } catch (err) {
      console.error("Assignment Error:", err.response?.data || err);
      alert("Assignment failed: " + (err.response?.data?.message || err.message));
    } finally {
      setBtnLoading(null);
    }
  };

  const isHouseHelp = filters.category?.toLowerCase() === 'house-help';

  if (loading) return (
    <div className="text-center p-5">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="main-content px-4 mt-4">
      <div className="row">

        {/* Filters */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
            <h6 className="fw-bold mb-3 text-primary">Assignment Filters</h6>

            {/* STATE */}
            <div className="mb-3">
              <label className="small fw-bold">State</label>
              <select className="form-select" name="state" value={filters.state} onChange={handleFilterChange}>
                <option value="">Select State</option>
                {locations.states.map(s => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* CITY */}
            <div className="mb-3">
              <label className="small fw-bold">City</label>
              <select className="form-select" name="city" value={filters.city} onChange={handleFilterChange}>
                <option value="">Select City</option>
                {locations.cities
                  .filter(c => !filters.state || c.state?.name === filters.state)
                  .map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
              </select>
            </div>

            {/* AREA */}
            <div className="mb-3">
              <label className="small fw-bold">Area</label>
              <select className="form-select" name="area" value={filters.area} onChange={handleFilterChange}>
                <option value="">All Areas</option>
                {locations.areas
                  .filter(a => !filters.city || a.city?.name === filters.city)
                  .map(a => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.pincode})
                    </option>
                  ))}
              </select>
            </div>

            <hr />

            {/* CATEGORY */}
            <div className="mb-3">
              <label className="small fw-bold">Job Category</label>
              <select className="form-select" name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* SKILL */}
            <div className="mb-3">
              <label className="small fw-bold">Work Type (Skill)</label>
              <select className="form-select" name="workType" value={filters.workType} onChange={handleFilterChange}>
                <option value="">All Skills</option>
                {allJobs.map(j => (
                  <option key={j._id} value={j.jobName}>{j.jobName}</option>
                ))}
              </select>
            </div>

            {/* SEARCH */}
            <input
              type="text"
              className="form-control"
              placeholder="Search name/phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <hr />

            {/* ✅ SLOT AVAILABILITY FILTER */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <label className="small fw-bold mb-0">Filter by Availability</label>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="slotToggle"
                    checked={slotFilter.enabled}
                    onChange={e => setSlotFilter(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                </div>
              </div>

              {slotFilter.enabled && (
                <>
                  {/* DATE */}
                  <div className="mb-2">
                    <label className="small text-muted">Job Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={slotFilter.date}
                      onChange={e => setSlotFilter(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  {/* SHIFT — only for house-help */}
                  {isHouseHelp && (
                    <div className="mb-2">
                      <label className="small text-muted">Shift</label>
                      <select
                        className="form-select form-select-sm"
                        value={slotFilter.shift}
                        onChange={e => setSlotFilter(prev => ({ ...prev, shift: e.target.value }))}
                      >
                        <option value="">Any Shift</option>
                        <option value="morning">Morning</option>
                        <option value="noon">Noon</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>
                  )}

                  <div className="alert alert-info py-2 px-3 small mb-0">
                    Showing workers available on <strong>{slotFilter.date}</strong>
                    {slotFilter.shift && (
                      <> · <strong className="text-capitalize">{slotFilter.shift}</strong> shift</>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Worker List */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Qualified Professionals</h5>
            <span className="badge bg-primary px-3">{filteredWorkers.length} matching</span>
          </div>

          {filteredWorkers.length === 0 && (
            <div className="text-center text-muted py-5">
              <i className="fas fa-user-slash fa-2x mb-3"></i>
              <p>No workers match the current filters.</p>
            </div>
          )}

          {filteredWorkers.map(worker => {
            const workerAreaName = locations.areas.find(a => a._id === worker.area)?.name || '';
            const workerCityObj = locations.cities.find(c => c._id === worker.city);
            const workerCityName = workerCityObj?.name || '';

            return (
              <div key={worker._id} className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-start">
                      <div
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold text-primary bg-soft-primary"
                        style={{ width: '50px', height: '50px', fontSize: '18px', flexShrink: 0 }}
                      >
                        {worker.name?.charAt(0)?.toUpperCase() || 'W'}
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">{worker.name || "Unknown"}</h6>
                        <small className="text-muted d-block">{worker.phone_number}</small>
                        {(workerCityName || workerAreaName) && (
                          <small className="text-muted d-block mb-2">
                            📍 {[workerAreaName, workerCityName].filter(Boolean).join(', ')}
                          </small>
                        )}
                        <div className="d-flex flex-wrap gap-2 mt-1">
                          <span className="badge bg-soft-primary text-primary border text-capitalize">
                            {worker.work_type}
                          </span>
                          {worker.team_members?.map((tm, idx) => (
                            <span key={idx} className="badge bg-light text-dark border text-capitalize">
                              {tm.type?.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>

                        {/* ✅ Slot availability badges */}
                        {worker.slot && (
                          <div className="mt-2 d-flex flex-wrap gap-1">
                            {(worker.slot.work_type === 'construction' || worker.slot.work_type === 'industrial') && (
                              <span className="badge bg-success text-white">
                                ✅ Available on {worker.slot.date}
                              </span>
                            )}
                            {worker.slot.work_type === 'house-help' && worker.slot.shifts?.map(shift => (
                              <span key={shift} className="badge bg-success bg-opacity-10 text-success border text-capitalize">
                                🕐 {shift}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm px-4 rounded-pill"
                      onClick={() => handleAssign(worker._id)}
                      disabled={btnLoading === worker._id}
                    >
                      {btnLoading === worker._id ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : 'Assign'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkerAssignment;