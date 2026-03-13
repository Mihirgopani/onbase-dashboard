import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddJob = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ 
        jobName: '', 
        category: '', 
        status: 'active' 
    });
    const [files, setFiles] = useState({
        cardImage: null,
        coverImage: null,
        otherImage: null
    });

    useEffect(() => {
        api.get('/job-categories').then(res => setCategories(res.data));
    }, []);

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('jobName', formData.jobName);
        data.append('category', formData.category);
        data.append('status', formData.status);
        
        if (files.cardImage) data.append('cardImage', files.cardImage);
        if (files.coverImage) data.append('coverImage', files.coverImage);
        if (files.otherImage) data.append('otherImage', files.otherImage);

        try {
            await api.post('/jobs', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/jobs');
        } catch (err) { 
            alert(err.response?.data?.error || "Error saving job"); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content px-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mt-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Create New Job Role</h5>
                        </div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Select Parent Category</label>
                                    <select className="form-select" onChange={e => setFormData({...formData, category: e.target.value})} required>
                                        <option value="">-- Choose Category --</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Job Name</label>
                                    <input type="text" className="form-control" placeholder="e.g. Electrician" onChange={e => setFormData({...formData, jobName: e.target.value})} required />
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Card Image (Small Icon/UI)</label>
                                <input type="file" name="cardImage" className="form-control" onChange={handleFileChange} required accept="image/*" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Cover Image (Banner for App)</label>
                                <input type="file" name="coverImage" className="form-control" onChange={handleFileChange} required accept="image/*" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Other Image (Optional)</label>
                                <input type="file" name="otherImage" className="form-control" onChange={handleFileChange} accept="image/*" />
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button type="button" className="btn btn-light px-4" onClick={() => navigate('/jobs')}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                                    {loading ? 'Uploading...' : 'Save Job Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddJob;