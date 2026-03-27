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

    // Helper to find specific language content from the otherlang array
    const getTranslation = (langCode) => {
        return faq.otherlang?.find(l => l.lang === langCode) || { question: 'Not provided', answer: 'No translation added yet.' };
    };

    const hindi = getTranslation('hi');
    const gujarati = getTranslation('gu');

    return (
        <div className="main-content px-4 mt-4">
            {/* Header Section */}
            <div className="d-flex align-items-center mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-light border btn-sm me-3">
                    <i className="feather-arrow-left"></i> Back
                </button>
                <h4 className="mb-0 fw-bold">FAQ Overview</h4>
                <div className="ms-auto d-flex gap-2">
                    <span className={`badge ${faq.status === 'active' ? 'bg-success' : 'bg-danger'} d-flex align-items-center px-3`}>
                        {faq.status?.toUpperCase()}
                    </span>
                    <Link to={`/faqs/edit/${id}`} className="btn btn-sm btn-info text-white">
                        <i className="feather-edit-2 me-1"></i> Edit Content
                    </Link>
                </div>
            </div>

            <div className="row">
                {/* Main Content: English (Primary) */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4 overflow-hidden">
                        <div className="card-header bg-primary text-white py-3">
                            <h6 className="mb-0 text-uppercase small fw-bold text-white">Primary Content (English)</h6>
                        </div>
                        <div className="card-body p-4">
                            <h3 className="fw-bold text-dark mb-3">{faq.question}</h3>
                            <p className="text-muted fs-16 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                                {faq.answer}
                            </p>
                        </div>
                    </div>

                    {/* Translations Grid */}
                    <div className="row">
                        {/* Hindi Translation */}
                        <div className="col-md-6">
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-header bg-light py-2">
                                    <span className="badge bg-dark">HINDI</span>
                                </div>
                                <div className="card-body">
                                    <h6 className="fw-bold">{hindi.question}</h6>
                                    <p className="text-muted small mb-0">{hindi.answer}</p>
                                </div>
                            </div>
                        </div>

                        {/* Gujarati Translation */}
                        <div className="col-md-6">
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-header bg-light py-2">
                                    <span className="badge bg-dark">GUJARATI</span>
                                </div>
                                <div className="card-body">
                                    <h6 className="fw-bold">{gujarati.question}</h6>
                                    <p className="text-muted small mb-0">{gujarati.answer}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Metadata */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3 border-bottom">
                            <h6 className="mb-0 fw-bold text-uppercase small">Target Categories</h6>
                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-wrap gap-2">
                                {faq.categories?.length > 0 ? (
                                    faq.categories.map(c => (
                                        <span key={c} className="badge bg-soft-primary text-primary border px-3 py-2">{c}</span>
                                    ))
                                ) : (
                                    <span className="text-muted small italic">No categories assigned</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 p-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Created:</span>
                            <span className="small fw-medium">{new Date(faq.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="text-muted small">Last Updated:</span>
                            <span className="small fw-medium">{new Date(faq.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqDetails;