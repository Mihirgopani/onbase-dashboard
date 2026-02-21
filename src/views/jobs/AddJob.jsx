import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddJob = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ jobName: '', category: '', status: 'active' });

    useEffect(() => {
        api.get('/job-categories').then(res => setCategories(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', formData);
            navigate('/jobs');
        } catch (err) { alert("Error saving job"); }
    };

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header"><h5>Create New Job Role</h5></div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Select Parent Category</label>
                                <select className="form-control" onChange={e => setFormData({...formData, category: e.target.value})} required>
                                    <option value="">-- Choose Category --</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Job Name</label>
                                <input type="text" className="form-control" placeholder="e.g. Electrician" onChange={e => setFormData({...formData, jobName: e.target.value})} required />
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-light" onClick={() => navigate('/jobs')}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-4">Save Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddJob;