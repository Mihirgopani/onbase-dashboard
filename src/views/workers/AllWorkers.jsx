import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllWorkers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            const response = await api.get('/workers');
            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            const onlyWorkers = data.filter(user => user.role === 'worker');
            setWorkers(onlyWorkers);
            setLoading(false);
        } catch (error) {
            console.error("API Error:", error);
            setLoading(false);
        }
    };

    const handleStatusToggle = async (workerId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setTogglingId(workerId);
        try {
            await api.put(`/workers/${workerId}/status`, { status: newStatus });
            setWorkers(workers.map(w => 
                w._id === workerId ? { ...w, status: newStatus } : w
            ));
        } catch (err) {
            alert("Failed to update worker status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this worker?")) {
            try {
                await api.delete(`/workers/${id}`);
                setWorkers(workers.filter(worker => worker._id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Could not delete worker.");
            }
        }
    };

    const filteredWorkers = workers.filter(worker => {
        const name = worker.name?.toLowerCase() || "";
        const phone = worker.phone_number || worker.phone || "";
        const workType = worker.work_type?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        return name.includes(query) || phone.includes(query) || workType.includes(query);
    });

    return (
        <div className="main-content px-4 mt-4">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fs-20 fw-bold mb-0">Worker Management</h2>
                    <p className="text-muted small mb-0">Manage and track your OnBase service workforce</p>
                </div>
                <Link to="/workers/add" className="btn btn-primary px-4 rounded-pill">
                    <i className="feather-plus me-2"></i> Add New Worker
                </Link>
            </div>

            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-pill">
                        <div className="card-body p-2 px-3 d-flex align-items-center">
                            <i className="feather-search text-muted me-2 ms-2"></i>
                            <input 
                                type="text" 
                                className="form-control border-0 shadow-none bg-transparent" 
                                placeholder="Search by name, phone, or work type..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3 border-bottom">
                    <h5 className="card-title mb-0 fw-bold">Worker List</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-uppercase small fw-bold text-muted">
                                <tr>
                                    <th className="ps-4">Worker / Work Type</th>
                                    <th>Verification</th>
                                    <th>Contact</th>
                                    <th>Status Toggle</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : filteredWorkers.map((worker) => {
                                    // Check if all documents are verified
                                    const isVerified = worker.documents?.length > 0 && 
                                                      worker.documents.every(doc => doc.verification_status === true);
                                    
                                    return (
                                        <tr key={worker._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-text avatar-md bg-soft-primary text-primary rounded-circle fw-bold">
                                                        {worker.name ? worker.name.charAt(0) : "W"}
                                                    </div>
                                                    <div>
                                                        <Link to={`/workers/details/${worker._id}`} className="fw-bold text-dark text-decoration-none d-block">
                                                            {worker.name || "Unnamed Worker"}
                                                        </Link>
                                                        <span className="badge bg-soft-info text-info small">{worker.work_type || 'General'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {isVerified ? (
                                                    <span className="badge bg-soft-success text-success"><i className="feather-check-circle me-1"></i> Verified</span>
                                                ) : (
                                                    <span className="badge bg-soft-warning text-warning"><i className="feather-clock me-1"></i> Pending Check</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="small fw-bold text-dark">{worker.phone_number || 'No Phone'}</div>
                                                <div className="small text-muted">{worker.email || 'No Email'}</div>
                                            </td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input 
                                                        className="form-check-input cursor-pointer" 
                                                        type="checkbox" 
                                                        checked={worker.status === 'active'}
                                                        disabled={togglingId === worker._id}
                                                        onChange={() => handleStatusToggle(worker._id, worker.status)}
                                                    />
                                                    <label className={`form-check-label small ms-1 fw-bold ${worker.status === 'active' ? 'text-success' : 'text-muted'}`}>
                                                        {togglingId === worker._id ? 'Updating...' : (worker.status || 'ACTIVE').toUpperCase()}
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link to={`/workers/edit/${worker._id}`} className="btn btn-sm btn-light border"><i className="feather-edit-3"></i></Link>
                                                    <button onClick={() => handleDelete(worker._id)} className="btn btn-sm btn-soft-danger border"><i className="feather-trash-2"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllWorkers;