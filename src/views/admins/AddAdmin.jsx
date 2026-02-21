import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddAdmin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        city: '',
        language: 'english',
        role: 'admin', // Hardcoded for this view
        status: 'active'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admins', formData);
            navigate('/admins');
        } catch (err) {
            console.error(err);
            alert("Error creating admin account. Make sure email is unique.");
        }
    };

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Create System Administrator</h5>
                        </div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" placeholder="Mihir Gopani" 
                                        onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" placeholder="mihirgopani@gmail.com" 
                                        onChange={e => setFormData({...formData, email: e.target.value})} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" placeholder="adminadmin" className="form-control" 
                                        onChange={e => setFormData({...formData, password: e.target.value})} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" className="form-control" placeholder="+91 00000 00000" 
                                        onChange={e => setFormData({...formData, phone_number: e.target.value})} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">City</label>
                                    <input type="text" className="form-control" placeholder="Surat" 
                                        onChange={e => setFormData({...formData, city: e.target.value})} />
                                </div>
                            </div>
                            <div className="alert alert-soft-info border-0 small">
                                <i className="feather-info me-2"></i>
                                This user will be granted <strong>Administrative</strong> access to the dashboard.
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <button type="button" className="btn btn-light" onClick={() => navigate('/admins')}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-5">Create Admin</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAdmin;