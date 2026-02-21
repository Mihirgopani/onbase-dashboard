import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/jobs').then(res => {
            setJobs(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this job role?")) {
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(j => j._id !== id));
        }
    };

    return (
        <div className="main-content">
            <div className="card stretch stretch-full">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="card-title">Job Roles List</h5>
                    <Link to="/jobs/add" className="btn btn-primary btn-sm">Add New Job</Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Job Role</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr> : 
                                jobs.map(job => (
                                    <tr key={job._id}>
                                        <td className="fw-bold text-dark">{job.jobName}</td>
                                        <td><span className="badge bg-soft-info text-info">{job.category?.name || 'Uncategorized'}</span></td>
                                        <td><span className={`badge ${job.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'}`}>{job.status}</span></td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link to={`/jobs/details/${job._id}`} className="avatar-text avatar-sm"><i className="feather-eye"></i></Link>
                                                <Link to={`/jobs/edit/${job._id}`} className="avatar-text avatar-sm"><i className="feather-edit-3"></i></Link>
                                                <button onClick={() => handleDelete(job._id)} className="avatar-text avatar-sm text-danger border-0 bg-transparent"><i className="feather-trash-2"></i></button>
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
export default AllJobs;