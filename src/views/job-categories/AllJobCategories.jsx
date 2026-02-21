import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllJobCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/job-categories').then(res => {
            setCategories(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

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
        <div className="main-content">
            <div className="card stretch stretch-full">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="card-title">Job Categories List</h5>
                    <Link to="/job-categories/add" className="btn btn-primary btn-sm">Add New Category</Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Category Name</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center p-4">Loading Categories...</td></tr>
                                ) : categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <tr key={cat._id}>
                                            <td className="fw-bold text-dark">{cat.name}</td>
                                            <td>
                                                <span className={`badge ${cat.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'}`}>
                                                    {cat.status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link to={`/job-categories/details/${cat._id}`} className="avatar-text avatar-sm" title="View Details">
                                                        <i className="feather-eye"></i>
                                                    </Link>
                                                    <Link to={`/job-categories/edit/${cat._id}`} className="avatar-text avatar-sm" title="Edit Category">
                                                        <i className="feather-edit-3"></i>
                                                    </Link>
                                                    <button 
                                                        className="avatar-text avatar-sm text-danger border-0 bg-transparent"
                                                        onClick={() => handleDelete(cat._id)}
                                                        title="Delete Category"
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