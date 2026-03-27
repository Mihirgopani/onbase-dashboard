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
        const query = searchQuery.toLowerCase();
        return name.includes(query) || phone.includes(query);
    });

    return (
        <div className="main-content px-4 mt-4">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fs-20 fw-bold mb-0">Worker Management</h2>
                    <p className="text-muted small mb-0">Manage and track your service workforce</p>
                </div>
                <Link to="/workers/add" className="btn btn-primary px-4 rounded-pill">
                    <i className="feather-plus me-2"></i> Add New Worker
                </Link>
            </div>

            <div className="row mb-4">
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-pill">
                        <div className="card-body p-2 px-3 d-flex align-items-center">
                            <i className="feather-search text-muted me-2 ms-2"></i>
                            <input 
                                type="text" 
                                className="form-control border-0 shadow-none bg-transparent" 
                                placeholder="Search by name or phone number..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="btn btn-link text-muted p-0 me-2" onClick={() => setSearchQuery("")}>
                                    <i className="feather-x"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm stretch stretch-full">
                <div className="card-header bg-white py-3 border-bottom">
                    <h5 className="card-title mb-0 fw-bold">Worker List</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Worker Info</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status Toggle</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : filteredWorkers.map((worker) => (
                                    <tr key={worker._id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar-text avatar-md bg-soft-primary text-primary rounded-circle fw-bold">
                                                    {worker.name.charAt(0)}
                                                </div>
                                                <Link to={`/workers/details/${worker._id}`} className="fw-bold text-dark text-decoration-none">
                                                    {worker.name}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="text-muted">{worker.email}</td>
                                        <td>{worker.phone_number || worker.phone || 'N/A'}</td>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input cursor-pointer" 
                                                    type="checkbox" 
                                                    role="switch"
                                                    checked={worker.status === 'active'}
                                                    disabled={togglingId === worker._id}
                                                    onChange={() => handleStatusToggle(worker._id, worker.status)}
                                                />
                                                <label className={`form-check-label small ms-2 fw-bold ${worker.status === 'active' ? 'text-success' : 'text-muted'}`}>
                                                    {togglingId === worker._id ? '...' : (worker.status || 'active').toUpperCase()}
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllWorkers;