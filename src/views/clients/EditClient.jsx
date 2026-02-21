import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditClient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await api.get(`/clients/${id}`);
                setFormData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching client:", error);
                alert("Client not found");
                navigate('/clients');
            }
        };
        fetchClient();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/clients/${id}`, formData);
            navigate('/clients');
        } catch (err) {
            alert("Update failed. Please try again.");
        }
    };

    if (loading) return <div className="p-5 text-center">Loading Client Data...</div>;

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Edit Client: {formData.name}</h5>
                            <span className={`badge ${formData.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                {formData.status.toUpperCase()}
                            </span>
                        </div>
                        <form className="card-body" onSubmit={handleUpdate}>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" className="form-control" value={formData.phone_number}
                                        onChange={e => setFormData({...formData, phone_number: e.target.value})} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Alternate Number</label>
                                    <input type="text" className="form-control" value={formData.alt_number}
                                        onChange={e => setFormData({...formData, alt_number: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">City</label>
                                    <input type="text" className="form-control" value={formData.city}
                                        onChange={e => setFormData({...formData, city: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Language</label>
                                    <select className="form-control" value={formData.language} 
                                        onChange={e => setFormData({...formData, language: e.target.value})}>
                                        <option value="gujarati">Gujarati</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="english">English</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Account Status</label>
                                    <select className="form-control" value={formData.status} 
                                        onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button type="button" className="btn btn-light" onClick={() => navigate('/clients')}>Back</button>
                                <button type="submit" className="btn btn-success px-5">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditClient;