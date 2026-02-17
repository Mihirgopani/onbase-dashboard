import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/axios';

const AllWorkers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                // Now you just use the relative path
                const response = await api.get('/workers');
                
                const onlyWorkers = response.data.filter(user => user.role === 'worker');
                setWorkers(onlyWorkers);
                setLoading(false);
            } catch (error) {
                console.error("API Error:", error);
                setLoading(false);
            }
        };

       

        fetchWorkers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this worker?")) {
            try {
                // Updated to match your new specific worker route
                await api.delete(`/workers/${id}`);
                
                // Refresh the list locally so the worker disappears from the table
                setWorkers(workers.filter(worker => worker._id !== id));
                
                // Optional: Show a success toast or alert
                console.log("Worker deleted successfully");
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Could not delete worker. Please try again.");
            }
        }
    };

    return (
        <div className="main-content">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <h5 className="card-title">Worker List</h5>
                            <Link to="/workers/add" className="btn btn-primary btn-sm">Add New Worker</Link>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="5" className="text-center p-5">Loading Workers...</td></tr>
                                        ) : workers.length > 0 ? (
                                            workers.map((worker) => (
                                                <tr key={worker._id}>
                                                    <td>
                                                    <div className="d-flex align-items-center gap-3">
        <div className="avatar-text avatar-md">{worker.name.charAt(0)}</div>
        {/* Update this line */}
        <Link to={`/workers/details/${worker._id}`} className="fw-bold text-dark">
            {worker.name}
        </Link>
    </div>
                                                    </td>
                                                    <td>{worker.email}</td>
                                                    <td>{worker.phone || 'N/A'}</td>
                                                    <td>
                                                        <span className="badge bg-soft-success text-success text-uppercase">Active</span>
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Link to={`/workers/edit/${worker._id}`} className="avatar-text avatar-sm">
                                                                <i className="feather-edit-3"></i>
                                                            </Link>
                                                            <button 
    className="avatar-text avatar-sm text-danger border-0 bg-transparent"
    onClick={() => handleDelete(worker._id)} // Add this line
    title="Delete Worker"
>
    <i className="feather-trash-2"></i>
</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="5" className="text-center p-5">No workers found in database.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllWorkers;