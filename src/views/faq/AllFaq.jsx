import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllFaq = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await api.get('/faqs');
            setFaqs(res.data);
        } catch (err) {
            console.error("Error fetching FAQs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this FAQ?")) {
            try {
                await api.delete(`/faqs/${id}`);
                setFaqs(faqs.filter(f => f._id !== id));
            } catch (err) {
                alert("Failed to delete FAQ");
            }
        }
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fs-20 fw-bold mb-0">Manage FAQs</h2>
                    <p className="text-muted small mb-0">Manage dynamic help content for all app categories</p>
                </div>
                <Link to="/faqs/add" className="btn btn-primary d-flex align-items-center">
                    <i className="feather-plus me-2"></i> Create New FAQ
                </Link>
            </div>

            <div className="p-4">
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Question</th>
                                    <th>Applied Categories</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-5">Loading...</td></tr>
                                ) : faqs.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center py-5">No FAQs found.</td></tr>
                                ) : (
                                    faqs.map((faq) => (
                                        <tr key={faq._id}>
                                            <td className="ps-4">
                                                <span className="fw-semibold text-dark">{faq.question}</span>
                                            </td>
                                            <td>
                                                {faq.categories?.map(cat => (
                                                    <span key={cat} className="badge bg-soft-primary text-primary me-1 text-uppercase">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group">
                                                    <Link to={`/faqs/details/${faq._id}`} className="btn btn-sm btn-light border"><i className="feather-eye text-primary"></i></Link>
                                                    <Link to={`/faqs/edit/${faq._id}`} className="btn btn-sm btn-light border"><i className="feather-edit text-info"></i></Link>
                                                    <button onClick={() => handleDelete(faq._id)} className="btn btn-sm btn-light border"><i className="feather-trash-2 text-danger"></i></button>
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

export default AllFaq;