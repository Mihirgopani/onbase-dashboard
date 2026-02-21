import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddClient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        alt_number: '',
        city: '',
        language: 'gujarati',
        role: 'client',
        logintype: 'otp',
        status: 'active',
        addresses: [],
        documents: [],
        team_members: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/clients', formData);
            navigate('/clients');
        } catch (err) {
            alert("Error adding client");
        }
    };

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header"><h5>Create Client Account</h5></div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" required placeholder="Mihir Client"
                                        onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" className="form-control" required placeholder="+91 00000 00000"
                                        onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" placeholder="client@gmail.com"
                                        onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">City</label>
                                    <input type="text" className="form-control" placeholder="Surat"
                                        onChange={e => setFormData({...formData, city: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Preferred Language</label>
                                    <select className="form-control" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                                        <option value="gujarati">Gujarati</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="english">English</option>
                                    </select>
                                </div>
                            </div>

                            <div className="alert alert-light border-0 small text-muted">
                                Note: Login type is set to <strong>OTP</strong> and role to <strong>Client</strong> by default.
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button type="button" className="btn btn-light" onClick={() => navigate('/clients')}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-5">Register Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClient;