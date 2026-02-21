import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);

    useEffect(() => {
        api.get(`/clients/${id}`).then(res => setClient(res.data))
           .catch(() => navigate('/clients'));
    }, [id, navigate]);

    if (!client) return <div className="p-5 text-center">Loading Profile...</div>;

    return (
        <div className="main-content">
            <div className="row">
                {/* Left Column: Avatar & Basic Info */}
                <div className="col-lg-4">
                    <div className="card text-center p-4 shadow-sm">
                        <div className="avatar-text avatar-xl bg-soft-primary text-primary mx-auto mb-3" style={{width: '100px', height: '100px', fontSize: '2.5rem', lineHeight: '100px'}}>
                            {client.name.charAt(0)}
                        </div>
                        <h4 className="mb-1">{client.name}</h4>
                        <p className="text-muted text-uppercase small fw-bold">{client.role}</p>
                        <div className={`badge ${client.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'} px-3 py-2`}>
                            {client.status.toUpperCase()}
                        </div>
                        <hr className="my-4" />
                        <div className="text-start">
                            <h6 className="small text-muted text-uppercase mb-3">Quick Actions</h6>
                            <Link to={`/clients/edit/${client._id}`} className="btn btn-primary w-100 mb-2">Edit Profile</Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Information */}
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Client Full Profile</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted ps-4" style={{width: '30%'}}>Email Address</td>
                                            <td className="fw-bold">{client.email || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Primary Phone</td>
                                            <td className="fw-bold">{client.phone_number}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Alternate Phone</td>
                                            <td>{client.alt_number || 'None'}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">City</td>
                                            <td>{client.city}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Preferred Language</td>
                                            <td className="text-capitalize">{client.language}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Login Type</td>
                                            <td className="text-uppercase">{client.logintype}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Registered On</td>
                                            <td>{new Date(client.createdAt).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer bg-light">
                            <small className="text-muted">Database ID: {client._id}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetails;