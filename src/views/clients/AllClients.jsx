import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            // Ensure we handle different possible response structures
            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            const onlyClients = data.filter(user => user.role === 'client');
            setClients(onlyClients);
            setLoading(false);
        } catch (error) {
            console.error("API Error:", error);
            setLoading(false);
        }
    };

    const handleStatusToggle = async (clientId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setTogglingId(clientId);
        try {
            // Using PUT to match the category/job status pattern
            await api.put(`/clients/${clientId}/status`, { status: newStatus });
            setClients(clients.map(c => 
                c._id === clientId ? { ...c, status: newStatus } : c
            ));
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will remove all client data.")) {
            try {
                await api.delete(`/clients/${id}`);
                setClients(clients.filter(c => c._id !== id));
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    // Filter by name or phone number
    const filteredClients = clients.filter(client => {
        const name = client.name?.toLowerCase() || "";
        const phone = client.phone_number || "";
        const query = searchQuery.toLowerCase();
        return name.includes(query) || phone.includes(query);
    });

    return (
        <div className="main-content px-4 mt-4">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fs-20 fw-bold mb-0">Client Directory</h2>
                    <p className="text-muted small mb-0">Manage and communicate with your clients</p>
                </div>
                <Link to="/clients/add" className="btn btn-primary px-4 rounded-pill shadow-sm">
                    <i className="feather-plus me-2"></i> Add New Client
                </Link>
            </div>

            {/* Search Bar */}
            <div className="row">
                <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-pill">
                        <div className="card-body p-2 px-3 d-flex align-items-center">
                            <i className="feather-search text-muted mx-2"></i>
                            <input 
                                type="text" 
                                className="form-control border-0 shadow-none bg-transparent" 
                                placeholder="Search by name or phone number..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="btn btn-link text-muted p-0 me-2" onClick={() => setSearchQuery("")}>
                                    <i className="feather-x"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm stretch stretch-full pt-0">
                <div className="card-header bg-white border-bottom">
                    <h5 className="card-title mb-0 fw-bold">Active Clients</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Client Info</th>
                                    <th>Phone</th>
                                    <th>City & Language</th>
                                    <th>Status Toggle</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-5"><div className="spinner-border text-primary"></div></td></tr>
                                ) : filteredClients.length > 0 ? (
                                    filteredClients.map((client) => (
                                        <tr key={client._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-text avatar-md bg-soft-primary text-primary rounded-circle fw-bold">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <Link to={`/clients/details/${client._id}`} className="fw-bold text-dark text-decoration-none">
                                                            {client.name}
                                                        </Link>
                                                        <div className="small text-muted">{client.email || 'No Email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={searchQuery && client.phone_number?.includes(searchQuery) ? "bg-warning-soft px-1 rounded" : ""}>
                                                    {client.phone_number}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{client.city}</div>
                                                {/* <small className="text-muted text-capitalize">{client.language}</small> */}
                                            </td>
                                            <td>
                                                <div className="form-check form-switch">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        role="switch"
                                                        checked={client.status === 'active'}
                                                        disabled={togglingId === client._id}
                                                        onChange={() => handleStatusToggle(client._id, client.status)}
                                                    />
                                                    <label className={`form-check-label small ms-1 fw-bold ${client.status === 'active' ? 'text-success' : 'text-muted'}`}>
                                                        {togglingId === client._id ? '...' : client.status.toUpperCase()}
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link to={`/clients/edit/${client._id}`} className="btn btn-sm btn-light border" title="Edit">
                                                        <i className="feather-edit-3"></i>
                                                    </Link>
                                                    <button onClick={() => handleDelete(client._id)} className="btn btn-sm btn-soft-danger border" title="Delete">
                                                        <i className="feather-trash-2"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center p-5 text-muted">No clients matching your search.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllClients;