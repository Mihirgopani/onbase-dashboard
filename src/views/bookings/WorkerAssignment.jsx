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

    useEffect(() => {
        fetchInitialData();
    }, [bookingId, itemIndex]);

    const fetchInitialData = async () => {
        try {
            const bRes = await api.get(`/bookings/${bookingId}`);
            const currentBooking = bRes.data;
            setBooking(currentBooking);
            
            const targetItem = currentBooking.items[itemIndex];
    
            // 1. Create a Category Map
            const categoryMap = {
                "Brick mason": "construction",
                "Lentor mason": "construction",
                "Plaster mason": "construction",
                "Columns Mason": "construction",
                "house help": "house help",
                "cleaning": "house help"
            };
    
            // 2. Determine the filter string
            // If "Brick mason" is the type, filterCategory becomes "construction"
            const filterCategory = categoryMap[targetItem.worker_type] || targetItem.worker_type;
            const targetCity = currentBooking.service_address.city;
    
            console.log("Searching for workers in category:", filterCategory);
    
            const wRes = await api.get(`/workers`, {
                params: { 
                    category: filterCategory, 
                    city: targetCity 
                }
            });
            setWorkers(wRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (workerId, assigneeType, teamMemberRefId = null) => {
        const confirmAction = window.confirm(`Assign this task to ${assigneeType === 'self' ? 'the Lead Worker' : 'a Team Member'}?`);
        if (!confirmAction) return;

        setBtnLoading(`${workerId}-${assigneeType}`);
        try {
            const payload = {
                bookingId: booking._id,
                itemIndex: itemIndex, 
                leadWorkerId: workerId,
                tasks: [{
                    work_type: booking.items[itemIndex].worker_type,
                    assignee_type: assigneeType,
                    team_member_reference_id: teamMemberRefId,
                    status: 'pending'
                }]
            };

            await api.post('/assignments/create', payload);
            alert("Worker assigned successfully!");
            navigate(`/bookings/${bookingId}`);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to assign worker.");
        } finally {
            setBtnLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="main-content d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    const targetItem = booking?.items[itemIndex];

    return (
        <div className="main-content px-4 mt-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <button onClick={() => navigate(-1)} className="btn btn-light border btn-sm me-3">
                        <i className="feather-arrow-left"></i>
                    </button>
                    <div>
                        <h4 className="mb-0 fw-bold">Assign {targetItem?.category} Staff</h4>
                        <p className="text-muted small mb-0">
                            Service: <span className="text-dark fw-bold">{targetItem?.worker_type}</span> | 
                            Location: <span className="text-dark fw-bold">{booking?.service_address?.city}</span>
                        </p>
                    </div>
                </div>
                <div className="text-end">
                    <span className="badge bg-soft-info text-info border px-3 py-2">
                        Slot: {booking?.slot?.date} ({booking?.slot?.startTime})
                    </span>
                </div>
            </div>

            <div className="row">
                {/* Sidebar Filters */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <label className="form-label fw-bold">Search Worker</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="feather-search text-muted"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 ps-0" 
                                    placeholder="Name or phone..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="p-3 bg-light rounded-3">
                                <h6 className="small fw-bold text-uppercase text-muted mb-2">Active Filters</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge bg-white text-primary border">{targetItem?.category}</span>
                                    <span className="badge bg-white text-info border">{booking?.service_address?.city}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Worker List */}
                <div className="col-lg-8">
                    {workers.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                        <div className="card border-0 shadow-sm p-5 text-center">
                            <div className="mb-3">
                                <i className="feather-user-x text-muted" style={{ fontSize: '3rem' }}></i>
                            </div>
                            <h5>No {targetItem?.category} Workers Available</h5>
                            <p className="text-muted">We couldn't find any active workers in {booking?.service_address?.city} matching this category.</p>
                            <button className="btn btn-outline-primary btn-sm mx-auto" onClick={() => navigate('/workers/create')}>
                                Add New Worker
                            </button>
                        </div>
                    ) : (
                        workers
                            .filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(worker => (
                                <div key={worker._id} className="card border-0 shadow-sm mb-3 card-hover">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar avatar-lg bg-soft-primary text-primary rounded-circle me-3 fw-bold fs-5">
                                                    {worker.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 fw-bold">{worker.name}</h6>
                                                    <div className="small text-muted mb-2">
                                                        <i className="feather-phone me-1"></i>{worker.phone_number}
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <span className="badge bg-light text-dark border-0">{worker.work_type}</span>
                                                        {worker.team_status === 'yes' && (
                                                            <span className="badge bg-soft-success text-success border-0">Has Team</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="text-end">
                                                {/* Primary Assignment (Lead) */}
                                                <button 
                                                    className="btn btn-primary btn-sm px-4 mb-2 d-block w-100"
                                                    onClick={() => handleAssign(worker._id, 'self')}
                                                    disabled={btnLoading === `${worker._id}-self`}
                                                >
                                                    {btnLoading === `${worker._id}-self` ? 'Processing...' : 'Assign Lead'}
                                                </button>

                                                {/* Team Assignment Dropdown */}
                                                {worker.team_status === 'yes' && (
                                                    <div className="btn-group w-100">
                                                        <button type="button" className="btn btn-outline-dark btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                                                            Assign Team
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                                            <li className="dropdown-header small text-uppercase">Available Members</li>
                                                            {worker.team_members
                                                                .filter(tm => tm.type === targetItem.worker_type)
                                                                .map(tm => (
                                                                    <li key={tm._id}>
                                                                        <button 
                                                                            className="dropdown-item d-flex justify-content-between align-items-center"
                                                                            onClick={() => handleAssign(worker._id, 'team_member', tm._id)}
                                                                        >
                                                                            <span>{tm.type}</span>
                                                                            <span className="badge bg-light text-muted ms-2">{tm.workers}</span>
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            }
                                                            {worker.team_members.filter(tm => tm.type === targetItem.worker_type).length === 0 && (
                                                                <li><span className="dropdown-item disabled small">No matching team type</span></li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerAssignment;