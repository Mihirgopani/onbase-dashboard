import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllCharges = () => {
    const [charges, setCharges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCharges();
    }, []);

    const fetchCharges = async () => {
        try {
            const res = await api.get('/charges');
            setCharges(res.data);
        } catch (err) {
            console.error("Error fetching charges", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this charge?")) {
            try {
                await api.delete(`/charges/${id}`);
                setCharges(charges.filter(c => c._id !== id));
            } catch (err) {
                alert("Failed to delete charge");
            }
        }
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fs-20 fw-bold mb-0">Tax & Platform Charges</h2>
                    <p className="text-muted small mb-0">Configure additional fees, GST, and service charges</p>
                </div>
                <Link to="/charges/add" className="btn btn-primary d-flex align-items-center">
                    <i className="feather-plus me-2"></i> Add New Charge
                </Link>
            </div>

            <div className="p-4">
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Charge Name</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-5">Loading...</td></tr>
                                ) : charges.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-5 text-muted">No charges configured.</td></tr>
                                ) : (
                                    charges.map((c) => (
                                        <tr key={c._id}>
                                            <td className="ps-4 fw-bold text-dark">{c.name}</td>
                                            <td>
                                                <span className="badge bg-soft-info text-info text-capitalize">
                                                    {c.type}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-bold">
                                                    {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${c.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'}`}>
                                                    {c.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group">
                                                    <Link to={`/charges/edit/${c._id}`} className="btn btn-sm btn-light border">
                                                        <i className="feather-edit text-info"></i>
                                                    </Link>
                                                    <button onClick={() => handleDelete(c._id)} className="btn btn-sm btn-light border">
                                                        <i className="feather-trash-2 text-danger"></i>
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

export default AllCharges;