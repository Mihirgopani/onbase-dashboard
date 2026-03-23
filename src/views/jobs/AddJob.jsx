import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddJob = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Expanded Initial State
    const [formData, setFormData] = useState({ 
        jobName: '', 
        category: '', 
        jobDescription: '',
        status: 'active',
        pricing: [{ timeFrame: '', price: '', discountPrice: '' }],
        whatYouGet: [''],
        whatYouNotGet: [''],
        processSteps: [{ title: '', description: '' }],
        faqs: [{ question: '', answer: '' }]
    });

    const [files, setFiles] = useState({ cardImage: null, coverImage: null, otherImage: null });

    useEffect(() => {
        api.get('/job-categories').then(res => setCategories(res.data));
    }, []);

    // Generic Handlers for Arrays
    const handleArrayChange = (index, field, value, section) => {
        const newArray = [...formData[section]];
        if (field === null) newArray[index] = value; // Simple string array
        else newArray[index][field] = value; // Array of objects
        setFormData({ ...formData, [section]: newArray });
    };

    const addRow = (section, template) => {
        setFormData({ ...formData, [section]: [...formData[section], template] });
    };

    const removeRow = (index, section) => {
        const newArray = formData[section].filter((_, i) => i !== index);
        setFormData({ ...formData, [section]: newArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        // Append simple strings
        data.append('jobName', formData.jobName);
        data.append('category', formData.category);
        data.append('jobDescription', formData.jobDescription);
        data.append('status', formData.status);
        
        // Stringify complex arrays for Multer/Backend parsing
        data.append('pricing', JSON.stringify(formData.pricing));
        data.append('processSteps', JSON.stringify(formData.processSteps));
        data.append('faqs', JSON.stringify(formData.faqs));
        data.append('whatYouGet', JSON.stringify(formData.whatYouGet.filter(i => i !== '')));
        data.append('whatYouNotGet', JSON.stringify(formData.whatYouNotGet.filter(i => i !== '')));

        if (files.cardImage) data.append('cardImage', files.cardImage);
        if (files.coverImage) data.append('coverImage', files.coverImage);
        if (files.otherImage) data.append('otherImage', files.otherImage);

        try {
            await api.post('/jobs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/jobs');
        } catch (err) {
            alert(err.response?.data?.error || "Error saving job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content px-4 py-4">
            <form className="container-fluid" onSubmit={handleSubmit}>
                <div className="row">
                    {/* Left Column: Basic Info & Images */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">Basic Information</h6>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Job Name</label>
                                    <input type="text" className="form-control" onChange={e => setFormData({...formData, jobName: e.target.value})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Category</label>
                                    <select className="form-select" onChange={e => setFormData({...formData, category: e.target.value})} required>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Job Description</label>
                                    <textarea className="form-control" rows="3" onChange={e => setFormData({...formData, jobDescription: e.target.value})} required />
                                </div>

                                <h6 className="fw-bold mt-4 mb-3">Media Assets</h6>
                                <div className="mb-3">
                                    <label className="form-label small">Card Image</label>
                                    <input type="file" className="form-control" onChange={e => setFiles({...files, cardImage: e.target.files[0]})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small">Cover Banner</label>
                                    <input type="file" className="form-control" onChange={e => setFiles({...files, coverImage: e.target.files[0]})} required />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">Pricing Options</h6>
                                    <button type="button" className="btn btn-sm btn-dark" onClick={() => addRow('pricing', {timeFrame: '', price: ''})}>+ Add Rate</button>
                                </div>
                                {formData.pricing.map((p, i) => (
                                    <div key={i} className="row g-2 mb-2">
                                        <div className="col-6"><input placeholder="Time (e.g. 1 hr)" className="form-control form-control-sm" onChange={e => handleArrayChange(i, 'timeFrame', e.target.value, 'pricing')} /></div>
                                        <div className="col-4"><input placeholder="Price" type="number" className="form-control form-control-sm" onChange={e => handleArrayChange(i, 'price', e.target.value, 'pricing')} /></div>
                                        <div className="col-2"><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeRow(i, 'pricing')}>×</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Lists & Steps */}
                    <div className="col-lg-7">
                        {/* Features List */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">What You Get</h6>
                                        {formData.whatYouGet.map((item, i) => (
                                            <input key={i} className="form-control form-control-sm mb-2" value={item} onChange={e => handleArrayChange(i, null, e.target.value, 'whatYouGet')} />
                                        ))}
                                        <button type="button" className="btn btn-sm text-primary p-0" onClick={() => addRow('whatYouGet', '')}>+ Add Point</button>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">What You Not Get</h6>
                                        {formData.whatYouNotGet.map((item, i) => (
                                            <input key={i} className="form-control form-control-sm mb-2" value={item} onChange={e => handleArrayChange(i, null, e.target.value, 'whatYouNotGet')} />
                                        ))}
                                        <button type="button" className="btn btn-sm text-primary p-0" onClick={() => addRow('whatYouNotGet', '')}>+ Add Point</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Process Steps */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold mb-0">Service Process Steps</h6>
                                    <button type="button" className="btn btn-sm btn-dark" onClick={() => addRow('processSteps', {title: '', description: ''})}>+ Add Step</button>
                                </div>
                                {formData.processSteps.map((s, i) => (
                                    <div key={i} className="border-bottom pb-3 mb-3">
                                        <div className="d-flex mb-2">
                                            <input placeholder="Step Title" className="form-control form-control-sm me-2" onChange={e => handleArrayChange(i, 'title', e.target.value, 'processSteps')} />
                                            <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => removeRow(i, 'processSteps')}>Delete</button>
                                        </div>
                                        <textarea placeholder="Step Description" className="form-control form-control-sm" rows="2" onChange={e => handleArrayChange(i, 'description', e.target.value, 'processSteps')} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">Service FAQs</h6>
                                {formData.faqs.map((f, i) => (
                                    <div key={i} className="mb-3 p-2 bg-light rounded">
                                        <input placeholder="Question" className="form-control form-control-sm mb-2" onChange={e => handleArrayChange(i, 'question', e.target.value, 'faqs')} />
                                        <textarea placeholder="Answer" className="form-control form-control-sm" rows="2" onChange={e => handleArrayChange(i, 'answer', e.target.value, 'faqs')} />
                                    </div>
                                ))}
                                <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => addRow('faqs', {question: '', answer: ''})}>+ Add FAQ</button>
                            </div>
                        </div>

                        <div className="text-end">
                            <button type="button" className="btn btn-light me-2 px-4" onClick={() => navigate('/jobs')}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-5" disabled={loading}>
                                {loading ? 'Saving Job...' : 'Publish Job Role'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddJob;