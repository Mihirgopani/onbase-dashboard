import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const JobCategoryDetails = () => {
    const { id } = useParams();
    const [cat, setCat] = useState(null);

    useEffect(() => {
        api.get(`/job-categories/${id}`).then(res => setCat(res.data));
    }, [id]);

    if (!cat) return null;

    return (
        <div className="main-content">
            <div className="card col-md-6 mx-auto shadow-sm">
                <div className="card-header"><h5>Category Details</h5></div>
                <div className="card-body">
                    <p><strong>Name:</strong> {cat.name}</p>
                    <p><strong>Status:</strong> {cat.status}</p>
                    <p><strong>Created:</strong> {new Date(cat.createdAt).toLocaleString()}</p>
                    <Link to="/job-categories" className="btn btn-light w-100 mt-3">Back to List</Link>
                </div>
            </div>
        </div>
    );
};
export default JobCategoryDetails;