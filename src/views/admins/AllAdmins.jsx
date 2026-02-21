import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admins').then(res => {
            setAdmins(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="main-content">
            <div className="card stretch stretch-full">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="card-title">Administrator Management</h5>
                    <Link to="/admins/add" className="btn btn-primary btn-sm">Add New Admin</Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Admin Name</th>
                                    <th>Email</th>
                                    <th>City</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-4">Loading Admins...</td></tr>
                                ) : admins.map(admin => (
                                    <tr key={admin._id}>
                                        <td className="fw-bold text-dark">{admin.name}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.city || 'N/A'}</td>
                                        <td><span className={`badge ${admin.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'}`}>{admin.status}</span></td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link to={`/admins/edit/${admin._id}`} className="avatar-text avatar-sm"><i className="feather-edit-3"></i></Link>
                                                <Link to={`/admins/details/${admin._id}`} className="avatar-text avatar-sm"><i className="feather-eye"></i></Link>
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
    );
};
export default AllAdmins;