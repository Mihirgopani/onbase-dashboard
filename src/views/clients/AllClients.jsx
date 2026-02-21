import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clients');
                // Ensure we only show users with the 'client' role
                const onlyClients = response.data.filter(user => user.role === 'client');
                setClients(onlyClients);
                setLoading(false);
            } catch (error) {
                console.error("API Error:", error);
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await api.delete(`/clients/${id}`);
                setClients(clients.filter(c => c._id !== id));
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="main-content">
            <div className="card stretch stretch-full">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="card-title">Client List</h5>
                    <Link to="/clients/add" className="btn btn-primary btn-sm">Add Client</Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>City</th>
                                    <th>Language</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
                                ) : clients.map((client) => (
                                    <tr key={client._id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar-text avatar-md bg-soft-primary text-primary">{client.name.charAt(0)}</div>
                                                <Link to={`/clients/details/${client._id}`} className="fw-bold text-dark">{client.name}</Link>
                                            </div>
                                        </td>
                                        <td>{client.phone_number}</td>
                                        <td>{client.city}</td>
                                        <td className="text-capitalize">{client.language}</td>
                                        <td>
                                            <span className={`badge ${client.status === 'active' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link to={`/clients/edit/${client._id}`} className="avatar-text avatar-sm"><i className="feather-edit-3"></i></Link>
                                                <button onClick={() => handleDelete(client._id)} className="avatar-text avatar-sm text-danger border-0 bg-transparent"><i className="feather-trash-2"></i></button>
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

export default AllClients;