import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState(null); // Track which job is updating

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        api.get('/jobs')
            .then(res => {
                setJobs(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleStatusToggle = async (jobId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setTogglingId(jobId);

        try {
            // Use the standard PUT route
            await api.put(`/jobs/${jobId}`, { status: newStatus });

            setJobs(jobs.map(job =>
                job._id === jobId ? { ...job, status: newStatus } : job
            ));
        } catch (err) {
            console.error("CORS or Update Error:", err);
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this job role?")) {
            try {
                await api.delete(`/jobs/${id}`);
                setJobs(jobs.filter(j => j._id !== id));
            } catch (err) {
                alert("Error deleting job.");
            }
        }
    };

    return (
        <div className="main-content px-4 mt-4">
            <div className="card border-0 shadow-sm stretch stretch-full">
                <div className="card-header bg-white py-3 d-flex align-items-center justify-content-between border-bottom">
                    <h5 className="card-title mb-0 fw-bold">Job Roles Management</h5>
                    <Link to="/jobs/add" className="btn btn-primary btn-sm px-3 rounded-pill">
                        <i className="feather-plus me-1"></i> Add New Job
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Job Role</th>
                                    <th>Category</th>
                                    <th>Status Toggle</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center p-5"><div className="spinner-border text-primary spinner-border-sm"></div></td></tr>
                                ) : jobs.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center p-5 text-muted">No jobs found.</td></tr>
                                ) : (
                                    jobs.map(job => (
                                        <tr key={job._id}>
                                            <td className="ps-4">
  <Link to={`/jobs/details/${job._id}`} className="text-decoration-none text-dark d-flex align-items-center">
    <div className="avatar avatar-sm bg-soft-primary text-primary rounded me-3 fw-bold d-flex align-items-center justify-content-center">
      {job.jobName.charAt(0)}
    </div>
    <span className="fw-bold">{job.jobName}</span>
  </Link>
</td>
                                            <td>
                                                <span className="badge bg-soft-info text-info border-0">
                                                    {job.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="form-check form-switch custom-switch">
                                                    <input
                                                        className="form-check-input cursor-pointer"
                                                        type="checkbox"
                                                        role="switch"
                                                        id={`switch-${job._id}`}
                                                        checked={job.status === 'active'}
                                                        disabled={togglingId === job._id}
                                                        onChange={() => handleStatusToggle(job._id, job.status)}
                                                    />
                                                    <label className={`form-check-label small ms-2 fw-bold ${job.status === 'active' ? 'text-success' : 'text-muted'}`}>
                                                        {togglingId === job._id ? 'Updating...' : job.status.toUpperCase()}
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link to={`/jobs/edit/${job._id}`} className="btn btn-light btn-sm border">
                                                        <i className="feather-edit-3"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        className="btn btn-soft-danger btn-sm border"
                                                    >
                                                        <i className="feather-trash-2"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllJobs;