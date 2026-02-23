import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios'; 

const WorkerDetails = () => {
    const { id } = useParams();
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const res = await api.get(`/workers/${id}`);
                setWorker(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching worker details:", err);
                setLoading(false);
            }
        };
        fetchWorker();
    }, [id]);

    if (loading) return <div className="p-5 text-center">Loading Worker Profile...</div>;
    if (!worker) return <div className="p-5 text-center">Worker not found.</div>;

    // Helper to get Category Badge color
    const getCategoryColor = (cat) => {
        switch(cat) {
            case 'houseHelpers': return 'bg-danger';
            case 'industrial': return 'bg-warning text-dark';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="main-content">
            {/* Header Section */}
            <div className="page-header d-flex align-items-center justify-content-between mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <h4 className="m-0 text-uppercase fw-bold">{worker.name}</h4>
                        <span className={`badge ${getCategoryColor(worker.category)}`}>
                            {worker.category?.replace(/([A-Z])/g, ' $1').trim() || 'Worker'}
                        </span>
                    </div>
                    <div className="mt-1">
                        <span className={`badge ${worker.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'} me-2`}>
                            {worker.status?.toUpperCase()}
                        </span>
                        <span className="text-muted small">Registered: {new Date(worker.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/workers" className="btn btn-light border">Back to List</Link>
                    <Link to={`/workers/edit/${id}`} className="btn btn-warning">
                        <i className="feather-edit me-2"></i> Edit Profile
                    </Link>
                </div>
            </div>

            <div className="row">
                {/* Column 1: Profile & Experience */}
                <div className="col-xxl-4 col-lg-5">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <div className="avatar-text avatar-xl mb-3 mx-auto bg-soft-primary text-primary fw-bold" 
                                     style={{width: '80px', height: '80px', fontSize: '2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {worker.name.charAt(0)}
                                </div>
                                <h5 className="mb-1 fw-bold">{worker.name}</h5>
                                <p className="text-muted text-capitalize">{worker.work_type?.replace(/_/g, ' ')}</p>
                            </div>
                            
                            <hr />

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">Contact & Basic Info</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Primary Phone:</span>
                                    <span className="fw-bold">{worker.phone_number}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Alt Number:</span>
                                    <span>{worker.alt_number || 'None'}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Email:</span>
                                    <span className="small text-lowercase">{worker.email}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Language:</span>
                                    <span className="text-capitalize">{worker.language}</span>
                                </div>
                            </div>

                            <hr />

                            <div className="mb-0">
                                <h6 className="fw-bold mb-3">Work Profile</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Experience:</span>
                                    <span className="badge bg-soft-dark text-dark">{worker.experience || 'Not Specified'}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Preferred Area:</span>
                                    <span className="text-capitalize">{worker.work_area || worker.city}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Team Status:</span>
                                    <span className={`fw-bold ${worker.team_status === 'yes' ? 'text-info' : 'text-secondary'}`}>
                                        {worker.team_status === 'yes' ? 'Contractor (Has Team)' : 'Individual Worker'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team/Skills List */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0 fw-bold">{worker.category === 'houseHelpers' ? 'Services Offered' : 'Team Composition'}</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Skill / Service</th>
                                            <th className="text-end">{worker.team_status === 'yes' ? 'Workers' : 'Expertise'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {worker.team_members?.map((member, idx) => (
                                            <tr key={idx}>
                                                <td className="text-capitalize">{member.type.replace(/_/g, ' ')}</td>
                                                <td className="text-end fw-bold">
                                                    {worker.team_status === 'yes' ? member.workers : <i className="feather-check text-success"></i>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Details & Docs */}
                <div className="col-xxl-8 col-lg-7">
                    
                    {/* Address Card */}
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-white"><h5>Permanent Address</h5></div>
                        <div className="card-body">
                            <p className="m-0 text-dark">{worker.address || 'No full address provided'}</p>
                            <span className="text-muted small mt-2 d-block">City: {worker.city}</span>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-white"><h5>Payment & Banking</h5></div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1">Account Holder Name</label>
                                    <span className="fw-bold">{worker.payment_details?.account_holder_name || 'N/A'}</span>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1">Bank Name</label>
                                    <span className="fw-bold">{worker.payment_details?.bank_name || 'N/A'}</span>
                                </div>
                                <div className="col-md-6">
                                    <label className="text-muted small d-block mb-1">Account Number / IFSC</label>
                                    <span className="fw-bold">{worker.payment_details?.bank_account_number}</span>
                                    <span className="mx-2 text-muted">|</span>
                                    <span className="text-uppercase text-primary fw-bold">{worker.payment_details?.bank_ifsc}</span>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex gap-4">
                                        <div>
                                            <label className="text-muted small d-block mb-1">UPI ID</label>
                                            <span className="fw-bold">{worker.payment_details?.upi_id || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <label className="text-muted small d-block mb-1">GPay Number</label>
                                            <span className="fw-bold">{worker.payment_details?.gpay_number || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents List */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">KYC Verification Documents</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Document Type</th>
                                            <th>ID Number</th>
                                            <th>Status</th>
                                            <th className="text-end">Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {worker.documents?.map((doc, idx) => (
                                            <tr key={idx}>
                                                <td><span className="fw-bold text-capitalize">{doc.type.replace(/_/g, ' ')}</span></td>
                                                <td><code className="text-dark">{doc.id_number}</code></td>
                                                <td>
                                                    {doc.verification_status ? 
                                                        <span className="badge bg-success">Verified</span> : 
                                                        <span className="badge bg-warning text-dark">Pending</span>
                                                    }
                                                </td>
                                                <td className="text-end">
                                                    <div className="btn-group">
                                                        <a href={doc.url_front} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">View Front</a>
                                                        {doc.url_back && <a href={doc.url_back} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">View Back</a>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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

export default WorkerDetails;