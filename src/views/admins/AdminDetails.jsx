import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AdminDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        api.get(`/admins/${id}`)
            .then(res => setAdmin(res.data))
            .catch(() => navigate('/admins'));
    }, [id, navigate]);

    if (!admin) return <div className="p-5 text-center">Loading Admin Profile...</div>;

    return (
        <div className="main-content">
            <div className="row">
                <div className="col-lg-4">
                    <div className="card text-center p-4 shadow-sm">
                        <div className="avatar-text avatar-xl bg-soft-danger text-danger mx-auto mb-3" 
                             style={{width: '100px', height: '100px', fontSize: '2.5rem', lineHeight: '100px'}}>
                            {admin.name.charAt(0)}
                        </div>
                        <h4 className="mb-1">{admin.name}</h4>
                        <p className="text-muted text-uppercase small fw-bold">System Administrator</p>
                        <div className={`badge ${admin.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'} px-3 py-2`}>
                            {admin.status.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Admin Information</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted ps-4" style={{width: '30%'}}>Email</td>
                                            <td className="fw-bold">{admin.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Phone</td>
                                            <td className="fw-bold">{admin.phone_number}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">City</td>
                                            <td>{admin.city || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Language</td>
                                            <td className="text-capitalize">{admin.language}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted ps-4">Joined On</td>
                                            <td>{new Date(admin.createdAt).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer bg-light d-flex justify-content-between">
                            <small className="text-muted">UID: {admin._id}</small>
                            <Link to={`/admins/edit/${admin._id}`} className="btn btn-sm btn-primary">Edit Profile</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetails;