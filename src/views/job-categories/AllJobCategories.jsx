import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllJobCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        api.get('/job-categories').then(res => {
            setCategories(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    const handleStatusToggle = async (catId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setTogglingId(catId);

        try {
            // Using PUT to avoid PATCH-related CORS issues
            await api.put(`/job-categories/${catId}/status`, { status: newStatus });
            
            setCategories(categories.map(cat => 
                cat._id === catId ? { ...cat, status: newStatus } : cat
            ));
        } catch (err) {
            alert("Failed to update category status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category? This might affect linked jobs.")) {
            try {
                await api.delete(`/job-categories/${id}`);
                setCategories(categories.filter(cat => cat._id !== id));
            } catch (err) {
                alert("Error deleting category");
            }
        }
    };

    return (
        <div className="main-content px-4 mt-4">
            <div className="card border-0 shadow-sm stretch stretch-full">
                <div className="card-header bg-white py-3 d-flex align-items-center justify-content-between border-bottom">
                    <h5 className="card-title mb-0 fw-bold">Job Categories</h5>
                    <Link to="/job-categories/add" className="btn btn-primary btn-sm px-3 rounded-pill">
                        <i className="feather-plus me-1"></i> Add New Category
                    </Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Category Name</th>
                                    <th>Status Toggle</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center p-5"><div className="spinner-border text-primary spinner-border-sm"></div></td></tr>
                                ) : categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar-text avatar-sm bg-soft-info text-info rounded me-3 fw-bold">
                                                        {cat.name.charAt(0)}
                                                    </div>
                                                    <span className="fw-bold text-dark">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input 
                                                        className="form-check-input cursor-pointer" 
                                                        type="checkbox" 
                                                        role="switch"
                                                        checked={cat.status === 'active'}
                                                        disabled={togglingId === cat._id}
                                                        onChange={() => handleStatusToggle(cat._id, cat.status)}
                                                    />
                                                    <label className={`form-check-label small ms-2 fw-bold ${cat.status === 'active' ? 'text-success' : 'text-muted'}`}>
                                                        {togglingId === cat._id ? '...' : cat.status.toUpperCase()}
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link to={`/job-categories/edit/${cat._id}`} className="btn btn-light btn-sm border" title="Edit">
                                                        <i className="feather-edit-3"></i>
                                                    </Link>
                                                    <button 
                                                        className="btn btn-soft-danger btn-sm border"
                                                        onClick={() => handleDelete(cat._id)}
                                                        title="Delete"
                                                    >
                                                        <i className="feather-trash-2"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" className="text-center p-5">No categories found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllJobCategories;