import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5001/api/users')
            .then(res => {
                const filtered = res.data.filter(u => u.role === 'client');
                setClients(filtered);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card stretch stretch-full">
                    <div className="card-header">
                        <h5 className="card-title">Client Directory</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Client Name</th>
                                        <th>Primary Address</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map(client => (
                                        <tr key={client._id}>
                                            <td>
                                                <div className="fw-bold text-dark">{client.name}</div>
                                                <small>{client.email}</small>
                                            </td>
                                            <td>
                                                {/* Fetching primary address from your schema's array */}
                                                {client.addresses?.find(a => a.is_primary)?.address || 'No address set'}
                                            </td>
                                            <td>{client.phone_number}</td>
                                            <td><span className="badge bg-soft-primary">{client.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllClients;