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
                // Path updated to /workers/${id} as requested
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

    return (
        <div className="main-content">
            {/* Header Section */}
            <div className="page-header d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="m-0 text-uppercase">{worker.name}</h4>
                    <div className="mt-1">
                        <span className="badge bg-soft-success text-success me-2">{worker.status}</span>
                        <span className="text-muted small">Registered on: {new Date(worker.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <Link to={`/workers/edit/${id}`} className="btn btn-warning">
                    <i className="feather-edit me-2"></i> Edit Profile
                </Link>
            </div>

            <div className="row">
                {/* Column 1: Personal & Team Info */}
                <div className="col-xxl-4 col-lg-5">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <div className="avatar-text avatar-xl mb-3 mx-auto bg-primary text-white" style={{width: '70px', height: '70px', fontSize: '1.5rem'}}>
                                    {worker.name.charAt(0)}
                                </div>
                                <h5 className="mb-1">{worker.name}</h5>
                                <p className="text-muted text-capitalize">{worker.work_type?.replace('_', ' ')}</p>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted">Phone:</span>
                                    <span className="fw-bold">{worker.phone_number}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted">City:</span>
                                    <span>{worker.city}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted">Language:</span>
                                    <span className="text-capitalize">{worker.language}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="text-muted">Team Status:</span>
                                    <span className={`badge ${worker.team_status === 'yes' ? 'bg-info' : 'bg-secondary'}`}>
                                        {worker.team_status === 'yes' ? 'Contractor' : 'Individual'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Team Members List */}
                    <div className="card">
                        <div className="card-header"><h5>Team Composition</h5></div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Skill Type</th>
                                            <th className="text-end">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {worker.team_members?.map((member) => (
                                            <tr key={member._id}>
                                                <td className="text-capitalize">{member.type.replace('_', ' ')}</td>
                                                <td className="text-end fw-bold">{member.workers}</td>
                                            </tr>
                                        ))}
                                        {worker.team_members?.length === 0 && (
                                            <tr><td colSpan="2" className="text-center py-3 text-muted">No team members added</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Documents & Payments */}
                <div className="col-xxl-8 col-lg-7">
                    {/* Payment Details */}
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-transparent"><h5>Payment Information</h5></div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1">Account Holder</label>
                                    <span className="fw-bold">{worker.payment_details?.account_holder_name || 'N/A'}</span>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1">Bank Name</label>
                                    <span className="fw-bold">{worker.payment_details?.bank_name || 'N/A'}</span>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1">Account Number</label>
                                    <span className="fw-bold text-dark" style={{letterSpacing: '1px'}}>{worker.payment_details?.bank_account_number || 'N/A'}</span>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1">IFSC Code</label>
                                    <span className="fw-bold text-uppercase">{worker.payment_details?.bank_ifsc || 'N/A'}</span>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1 text-primary">UPI ID</label>
                                    <span className="fw-bold">{worker.payment_details?.upi_id || 'N/A'}</span>
                                </div>
                                <div className="col-sm-6">
                                    <label className="text-muted small d-block mb-1 text-success">GPay Number</label>
                                    <span className="fw-bold">{worker.payment_details?.gpay_number || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents List */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">KYC Documents</h5>
                            <span className="badge bg-soft-primary text-primary">{worker.documents?.length || 0} Files</span>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Document Type</th>
                                            <th>ID Number</th>
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {worker.documents?.map((doc) => (
                                            <tr key={doc._id}>
                                                <td>
                                                    <div className="fw-bold text-capitalize">{doc.type.replace('_', ' ')}</div>
                                                </td>
                                                <td><code>{doc.id_number}</code></td>
                                                <td>
                                                    {doc.verification_status ? 
                                                        <span className="badge bg-soft-success text-success">Verified</span> : 
                                                        <span className="badge bg-soft-warning text-warning">Pending Review</span>
                                                    }
                                                </td>
                                                <td className="text-end">
                                                    <div className="btn-group btn-group-sm">
                                                        <button className="btn btn-light" title="View Front">Front</button>
                                                        {doc.type === 'aadhar_card' && <button className="btn btn-light" title="View Back">Back</button>}
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