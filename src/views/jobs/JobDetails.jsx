import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        api.get(`/jobs/${id}`).then(res => setJob(res.data));
    }, [id]);

    if (!job) return null;

    return (
        <div className="main-content">
            <div className="card col-md-8 mx-auto shadow-sm">
                <div className="card-header"><h5>Job Profile Details</h5></div>
                <div className="card-body">
                    <p><strong>Job Role:</strong> {job.jobName}</p>
                    <p><strong>Category:</strong> {job.category?.name || 'N/A'}</p>
                    <p><strong>Current Status:</strong> {job.status}</p>
                    <p><strong>System ID:</strong> {job._id}</p>
                    <Link to="/jobs" className="btn btn-light w-100 mt-3">Back to List</Link>
                </div>
            </div>
        </div>
    );
};
export default JobDetails;