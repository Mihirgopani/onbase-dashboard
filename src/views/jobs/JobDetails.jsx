import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);

    // Replace this with your actual production backend URL or environment variable
    const baseURL = "http://localhost:5001";

    useEffect(() => {
        api.get(`/jobs/${id}`).then(res => setJob(res.data));
    }, [id]);

    if (!job) return (
        <div className="main-content d-flex justify-content-center pt-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="main-content px-4">
            <div className="row justify-content-center mt-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 overflow-hidden">
                        
                        {/* 1. Cover Image Banner */}
                        <div style={{ height: '200px', width: '100%', backgroundColor: '#f8f9fa' }}>
                            {job.coverImage ? (
                                <img 
                                    src={`${baseURL}${job.coverImage}`} 
                                    alt="Cover" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                    No Cover Image Available
                                </div>
                            )}
                        </div>

                        <div className="card-body p-4">
                            <div className="d-flex align-items-start mb-4" style={{ marginTop: '-60px' }}>
                                {/* 2. Card Image (Profile style) */}
                                <div className="bg-white p-1 rounded shadow-sm me-3">
                                    <img 
                                        src={`${baseURL}${job.cardImage}`} 
                                        alt="Icon" 
                                        className="rounded"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Job'; }}
                                    />
                                </div>
                                <div className="mt-5 pt-2">
                                    <h3 className="fw-bold mb-0">{job.jobName}</h3>
                                    <span className="badge bg-soft-primary text-primary border px-3">
                                        {job.category?.name || 'Uncategorized'}
                                    </span>
                                </div>
                            </div>

                            <hr className="text-light" />

                            <div className="row mt-4">
                                <div className="col-md-6 mb-3">
                                    <label className="text-muted small text-uppercase fw-bold">Current Status</label>
                                    <p className="mb-0">
                                        <i className={`feather-circle me-2 ${job.status === 'active' ? 'text-success' : 'text-danger'}`}></i>
                                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="text-muted small text-uppercase fw-bold">System ID</label>
                                    <p className="mb-0 text-dark font-monospace">{job._id}</p>
                                </div>
                                
                                {/* 3. Other Image (Optional) */}
                                {job.otherImage && (
                                    <div className="col-12 mt-3">
                                        <label className="text-muted small text-uppercase fw-bold">Additional Resource Image</label>
                                        <div className="mt-2">
                                            <img 
                                                src={`${baseURL}${job.otherImage}`} 
                                                className="rounded border shadow-sm"
                                                style={{ maxWidth: '200px' }}
                                                alt="Other"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex gap-2 mt-5">
                                <Link to="/jobs" className="btn btn-light border px-4">
                                    <i className="feather-arrow-left me-2"></i>Back to List
                                </Link>
                                <Link to={`/jobs/edit/${job._id}`} className="btn btn-primary px-4">
                                    <i className="feather-edit-2 me-2"></i>Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;