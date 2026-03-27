import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const AllCities = () => {
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [formData, setFormData] = useState({ name: '', state: '' });
    const [searchQuery, setSearchQuery] = useState(''); // New State

    useEffect(() => {
        api.get('/locations/states').then(res => setStates(res.data));
        fetchCities();
    }, []);

    const fetchCities = async () => {
        const res = await api.get('/locations/cities');
        setCities(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/locations/cities', formData);
        setFormData({ name: '', state: '' });
        fetchCities();
    };

    // Filter Logic
    const filteredCities = cities.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.state?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="main-content p-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3"><h5 className="mb-0">Add New City</h5></div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">State</label>
                                    <select className="form-select" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">City Name</label>
                                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ahmedabad" required />
                                </div>
                                <button className="btn btn-primary w-100">Save City</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Registered Cities</h5>
                            <input 
                                type="text" 
                                className="form-control form-control-sm w-50" 
                                placeholder="Search city or state..." 
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr><th>City</th><th>State</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {filteredCities.map(c => (
                                        <tr key={c._id}>
                                            <td className="fw-bold">{c.name}</td>
                                            <td>{c.state?.name}</td>
                                            <td><button onClick={() => api.delete(`/locations/city/${c._id}`).then(fetchCities)} className="btn btn-sm text-danger"><i className="feather-trash"></i></button></td>
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

export default AllCities;