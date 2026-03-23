import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState(null);
    const [files, setFiles] = useState({ cardImage: null, coverImage: null, otherImage: null });

    useEffect(() => {
        // Fetch Categories and Job Data
        const fetchData = async () => {
            try {
                const [catRes, jobRes] = await Promise.all([
                    api.get('/job-categories'),
                    api.get(`/jobs/${id}`)
                ]);
                setCategories(catRes.data);
                setFormData(jobRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [id]);

    const handleArrayChange = (index, field, value, section) => {
        const newArray = [...formData[section]];
        if (field === null) newArray[index] = value;
        else newArray[index][field] = value;
        setFormData({ ...formData, [section]: newArray });
    };

    const addRow = (section, template) => {
        setFormData({ ...formData, [section]: [...(formData[section] || []), template] });
    };

    const removeRow = (index, section) => {
        const newArray = formData[section].filter((_, i) => i !== index);
        setFormData({ ...formData, [section]: newArray });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('jobName', formData.jobName);
        data.append('category', formData.category?._id || formData.category);
        data.append('jobDescription', formData.jobDescription);
        data.append('status', formData.status);

        // Stringify arrays for backend parsing
        data.append('pricing', JSON.stringify(formData.pricing));
        data.append('processSteps', JSON.stringify(formData.processSteps));
        data.append('faqs', JSON.stringify(formData.faqs));
        data.append('whatYouGet', JSON.stringify(formData.whatYouGet));
        data.append('whatYouNotGet', JSON.stringify(formData.whatYouNotGet));

        if (files.cardImage) data.append('cardImage', files.cardImage);
        if (files.coverImage) data.append('coverImage', files.coverImage);
        if (files.otherImage) data.append('otherImage', files.otherImage);

        try {
            await api.put(`/jobs/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/jobs');
        } catch (err) {
            alert(err.response?.data?.error || "Error updating job");
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <div className="p-5 text-center">Loading Job Data...</div>;

    return (
        <div className="main-content px-4 py-4">
            <form className="container-fluid" onSubmit={handleUpdate}>
                <div className="row">
                    {/* Left Column */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">Basic Information & Images</h6>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Job Name</label>
                                    <input type="text" className="form-control" value={formData.jobName} onChange={e => setFormData({...formData, jobName: e.target.value})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Category</label>
                                    <select className="form-select" value={formData.category?._id || formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Status</label>
                                    <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label className="form-label small fw-bold text-primary">Update Images (Leave blank to keep current)</label>
                                    <input type="file" className="form-control mb-2" onChange={e => setFiles({...files, cardImage: e.target.files[0]})} />
                                    <input type="file" className="form-control mb-2" onChange={e => setFiles({...files, coverImage: e.target.files[0]})} />
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">Pricing Options</h6>
                                    <button type="button" className="btn btn-sm btn-dark" onClick={() => addRow('pricing', {timeFrame: '', price: ''})}>+ Add</button>
                                </div>
                                {formData.pricing?.map((p, i) => (
                                    <div key={i} className="row g-2 mb-2">
                                        <div className="col-6"><input value={p.timeFrame} placeholder="Time" className="form-control form-control-sm" onChange={e => handleArrayChange(i, 'timeFrame', e.target.value, 'pricing')} /></div>
                                        <div className="col-4"><input value={p.price} placeholder="Price" type="number" className="form-control form-control-sm" onChange={e => handleArrayChange(i, 'price', e.target.value, 'pricing')} /></div>
                                        <div className="col-2"><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeRow(i, 'pricing')}>×</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold">Job Description</h6>
                                <textarea className="form-control" rows="3" value={formData.jobDescription} onChange={e => setFormData({...formData, jobDescription: e.target.value})} required />
                            </div>
                        </div>

                        {/* Process Steps */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">Service Process</h6>
                                {formData.processSteps?.map((s, i) => (
                                    <div key={i} className="border-bottom pb-2 mb-2">
                                        <input value={s.title} className="form-control form-control-sm mb-1" placeholder="Title" onChange={e => handleArrayChange(i, 'title', e.target.value, 'processSteps')} />
                                        <textarea value={s.description} className="form-control form-control-sm" placeholder="Description" onChange={e => handleArrayChange(i, 'description', e.target.value, 'processSteps')} />
                                        <button type="button" className="btn btn-sm text-danger" onClick={() => removeRow(i, 'processSteps')}>Remove Step</button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-dark mt-2" onClick={() => addRow('processSteps', {title: '', description: ''})}>+ Add Step</button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-light px-4" onClick={() => navigate('/jobs')}>Cancel</button>
                            <button type="submit" className="btn btn-success px-5" disabled={loading}>
                                {loading ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditJob;