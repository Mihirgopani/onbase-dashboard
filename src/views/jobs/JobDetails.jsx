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
        <div className="main-content px-4 py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header Card with Banner */}
                    <div className="card shadow-sm border-0 overflow-hidden mb-4">
                        <div style={{ height: '250px', width: '100%', backgroundColor: '#1e293b' }}>
                            {job.coverImage && (
                                <img 
                                    src={`${baseURL}${job.coverImage}`} 
                                    alt="Cover" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                                />
                            )}
                        </div>

                        <div className="card-body p-4">
                            <div className="d-flex align-items-end mb-4" style={{ marginTop: '-80px' }}>
                                <div className="bg-white p-2 rounded shadow me-4">
                                    <img 
                                        src={`${baseURL}${job.cardImage}`} 
                                        alt="Icon" 
                                        className="rounded"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="pb-2">
                                    <h2 className="fw-bold mb-1">{job.jobName}</h2>
                                    <span className="badge bg-primary px-3 py-2 mb-2">
                                        {job.category?.name || 'Service Category'}
                                    </span>
                                    <p className="text-muted mb-0"><i className="bi bi-geo-alt me-1"></i> Status: <strong className={job.status === 'active' ? 'text-success' : 'text-danger'}>{job.status.toUpperCase()}</strong></p>
                                </div>
                                <div className="ms-auto pb-2">
                                    <Link to={`/jobs/edit/${job._id}`} className="btn btn-dark px-4">
                                        Edit Service Detail
                                    </Link>
                                </div>
                            </div>

                            <hr />

                            <div className="row">
                                {/* Left Column: Description & Lists */}
                                <div className="col-md-7">
                                    <section className="mb-4">
                                        <h5 className="fw-bold">Description</h5>
                                        <p className="text-secondary" style={{ lineHeight: '1.6' }}>{job.jobDescription || "No description provided."}</p>
                                    </section>

                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <h6 className="fw-bold text-success"><i className="bi bi-check-circle-fill me-2"></i>What's Included</h6>
                                            <ul className="list-unstyled small">
                                                {job.whatYouGet?.map((item, i) => (
                                                    <li key={i} className="mb-2 text-secondary">• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <h6 className="fw-bold text-danger"><i className="bi bi-x-circle-fill me-2"></i>What's Excluded</h6>
                                            <ul className="list-unstyled small">
                                                {job.whatYouNotGet?.map((item, i) => (
                                                    <li key={i} className="mb-2 text-secondary">• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <section className="mb-4">
                                        <h5 className="fw-bold mb-3">Service Process</h5>
                                        <div className="ms-2">
                                            {job.processSteps?.map((step, i) => (
                                                <div key={i} className="d-flex mb-3">
                                                    <div className="me-3 mt-1">
                                                        <span className="badge bg-light text-dark border rounded-circle" style={{ width: '25px', height: '25px' }}>{i + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-1 fw-bold">{step.title}</h6>
                                                        <p className="small text-muted">{step.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Pricing & FAQs */}
                                <div className="col-md-5">
                                    <div className="card bg-light border-0 rounded-4 mb-4">
                                        <div className="card-body p-4">
                                            <h5 className="fw-bold mb-3">Pricing Plans</h5>
                                            {job.pricing?.map((p, i) => (
                                                <div key={i} className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 mb-2 border">
                                                    <span className="fw-semibold">{p.timeFrame}</span>
                                                    <span className="fs-5 fw-bold text-primary">₹{p.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <section>
                                        <h5 className="fw-bold mb-3">Common FAQs</h5>
                                        <div className="accordion accordion-flush border rounded" id="faqAccordion">
                                            {job.faqs?.map((faq, i) => (
                                                <div className="accordion-item" key={i}>
                                                    <h2 className="accordion-header">
                                                        <button className="accordion-button collapsed py-2 small fw-bold" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`}>
                                                            {faq.question}
                                                        </button>
                                                    </h2>
                                                    <div id={`faq${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                        <div className="accordion-body small text-muted">
                                                            {faq.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-5">
                         <Link to="/jobs" className="text-decoration-none text-muted">
                            <i className="bi bi-arrow-left me-1"></i> Back to All Services
                         </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;