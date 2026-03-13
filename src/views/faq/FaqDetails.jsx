import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const FaqDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [faq, setFaq] = useState(null);

    useEffect(() => {
        api.get(`/faqs/${id}`).then(res => setFaq(res.data));
    }, [id]);

    if (!faq) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="main-content px-4 mt-4">
            <div className="d-flex align-items-center mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-light border btn-sm me-3"><i className="feather-arrow-left"></i></button>
                <h4 className="mb-0 fw-bold">FAQ Overview</h4>
                <Link to={`/faqs/edit/${id}`} className="btn btn-sm btn-outline-info ms-auto">Edit Content</Link>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4 p-4">
                        <h3 className="fw-bold text-dark mb-3">{faq.question}</h3>
                        <p className="text-muted fs-16 leading-relaxed">{faq.answer}</p>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3"><h6 className="mb-0 fw-bold text-uppercase">Target Categories</h6></div>
                        <div className="card-body">
                            <div className="d-flex flex-wrap gap-2">
                                {faq.categories?.map(c => (
                                    <span key={c} className="badge bg-soft-primary text-primary border px-3 py-2">{c}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqDetails;