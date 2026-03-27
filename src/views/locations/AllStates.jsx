import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AllStates = () => {
    const [states, setStates] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // New State

    useEffect(() => { fetchStates(); }, []);

    const fetchStates = async () => {
        const res = await api.get('/locations/states');
        setStates(res.data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/locations/states', { name });
            setName('');
            fetchStates();
        } catch (err) { alert("State already exists or error occurred"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this state?")) {
            await api.delete(`/locations/state/${id}`);
            fetchStates();
        }
    };

    // Filter Logic
    const filteredStates = states.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="main-content p-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3"><h5 className="mb-0">Add New State</h5></div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">State Name</label>
                                    <input type="text" className="form-control" value={name} 
                                        onChange={e => setName(e.target.value)} placeholder="e.g. Gujarat" required />
                                </div>
                                <button className="btn btn-primary w-100">Save State</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Registered States</h5>
                            <input 
                                type="text" 
                                className="form-control form-control-sm w-50" 
                                placeholder="Search state..." 
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr><th>ID</th><th>State Name</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {filteredStates.map((s, idx) => (
                                        <tr key={s._id}>
                                            <td>{idx + 1}</td>
                                            <td className="fw-bold">{s.name}</td>
                                            <td><span className="badge bg-soft-success text-success">{s.status}</span></td>
                                            <td>
                                                <button onClick={() => handleDelete(s._id)} className="btn btn-sm text-danger"><i className="feather-trash"></i></button>
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
    );
};

export default AllStates;