import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('en'); // 'en', 'hi', 'gu'
    const [formData, setFormData] = useState(null);
    const [files, setFiles] = useState({ cardImage: null, coverImage: null, otherImage: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, jobRes] = await Promise.all([
                    api.get('/job-categories'),
                    api.get(`/jobs/${id}`)
                ]);
                setCategories(catRes.data);
                
                // Ensure otherlang exists to prevent mapping errors
                const jobData = jobRes.data;
                if (!jobData.otherlang) jobData.otherlang = [];
                
                // Ensure we have entries for hi and gu in otherlang
                ['hi', 'gu'].forEach(l => {
                    if (!jobData.otherlang.find(o => o.lang === l)) {
                        jobData.otherlang.push({
                            lang: l, jobName: '', jobDescription: '',
                            whatYouGet: [], whatYouNotGet: [], processSteps: [], faqs: []
                        });
                    }
                });
                
                setFormData(jobData);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [id]);

    // Helper to get current content based on tab
    const getContent = () => {
        if (activeTab === 'en') return formData;
        return formData.otherlang.find(o => o.lang === activeTab);
    };

    const handleFieldChange = (field, value) => {
        if (activeTab === 'en') {
            setFormData({ ...formData, [field]: value });
        } else {
            const newOtherLang = formData.otherlang.map(o => 
                o.lang === activeTab ? { ...o, [field]: value } : o
            );
            setFormData({ ...formData, otherlang: newOtherLang });
        }
    };

    const handleArrayChange = (index, field, value, section) => {
        if (activeTab === 'en') {
            const newArray = [...formData[section]];
            if (field === null) newArray[index] = value;
            else newArray[index][field] = value;
            setFormData({ ...formData, [section]: newArray });
        } else {
            const newOtherLang = formData.otherlang.map(o => {
                if (o.lang === activeTab) {
                    const newArray = [...o[section]];
                    if (field === null) newArray[index] = value;
                    else newArray[index][field] = value;
                    return { ...o, [section]: newArray };
                }
                return o;
            });
            setFormData({ ...formData, otherlang: newOtherLang });
        }
    };

    const addRow = (section, template) => {
        if (activeTab === 'en' || section === 'pricing') {
            setFormData({ ...formData, [section]: [...(formData[section] || []), template] });
        } else {
            const newOtherLang = formData.otherlang.map(o => 
                o.lang === activeTab ? { ...o, [section]: [...(o[section] || []), template] } : o
            );
            setFormData({ ...formData, otherlang: newOtherLang });
        }
    };

    const removeRow = (index, section) => {
        if (activeTab === 'en' || section === 'pricing') {
            const newArray = formData[section].filter((_, i) => i !== index);
            setFormData({ ...formData, [section]: newArray });
        } else {
            const newOtherLang = formData.otherlang.map(o => {
                if (o.lang === activeTab) {
                    const newArray = o[section].filter((_, i) => i !== index);
                    return { ...o, [section]: newArray };
                }
                return o;
            });
            setFormData({ ...formData, otherlang: newOtherLang });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        // Global & English Top Level
        data.append('jobName', formData.jobName);
        data.append('jobDescription', formData.jobDescription);
        data.append('hindiTitle', formData.hindiTitle || '');
        data.append('gujaratiTitle', formData.gujaratiTitle || '');
        data.append('category', formData.category?._id || formData.category);
        data.append('status', formData.status);

        // English Arrays
        data.append('pricing', JSON.stringify(formData.pricing));
        data.append('processSteps', JSON.stringify(formData.processSteps));
        data.append('faqs', JSON.stringify(formData.faqs));
        data.append('whatYouGet', JSON.stringify(formData.whatYouGet));
        data.append('whatYouNotGet', JSON.stringify(formData.whatYouNotGet));

        // The Translation Array (Hindi & Gujarati)
        data.append('otherlang', JSON.stringify(formData.otherlang));

        if (files.cardImage) data.append('cardImage', files.cardImage);
        if (files.coverImage) data.append('coverImage', files.coverImage);

        try {
            await api.put(`/jobs/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/jobs');
        } catch (err) {
            alert("Error updating job");
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <div className="p-5 text-center">Loading Job Data...</div>;

    const current = getContent();

    return (
        <div className="main-content px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fs-20 fw-bold">Edit Multilingual Job</h2>
                <div className="btn-group shadow-sm">
                    {['en', 'hi', 'gu'].map(lang => (
                        <button key={lang} type="button" 
                            className={`btn btn-sm ${activeTab === lang ? 'btn-primary' : 'btn-outline-primary'}`} 
                            onClick={() => setActiveTab(lang)}>
                            {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Gujarati'}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleUpdate}>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 mb-4 p-3">
                            <h6 className="fw-bold mb-3 small text-uppercase text-muted">Global & Language Title</h6>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Display Name ({activeTab.toUpperCase()})</label>
                                <input type="text" className="form-control" value={current.jobName || ''} onChange={e => handleFieldChange('jobName', e.target.value)} required />
                            </div>
                            
                            {/* Keep quick-reference titles syncable if in English tab */}
                            {activeTab === 'en' && (
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="x-small fw-bold">Short Hindi Title</label>
                                        <input type="text" className="form-control form-control-sm" value={formData.hindiTitle || ''} onChange={e => setFormData({...formData, hindiTitle: e.target.value})} />
                                    </div>
                                    <div className="col-6">
                                        <label className="x-small fw-bold">Short Guj Title</label>
                                        <input type="text" className="form-control form-control-sm" value={formData.gujaratiTitle || ''} onChange={e => setFormData({...formData, gujaratiTitle: e.target.value})} />
                                    </div>
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Category</label>
                                <select className="form-select" value={formData.category?._id || formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="mb-3 border-top pt-2">
                                <label className="form-label small fw-bold text-primary">Media Assets (Global)</label>
                                <input type="file" className="form-control form-control-sm mb-2" onChange={e => setFiles({...files, cardImage: e.target.files[0]})} />
                                <input type="file" className="form-control form-control-sm" onChange={e => setFiles({...files, coverImage: e.target.files[0]})} />
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 mb-4 p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0 small text-uppercase text-muted">Pricing (Global)</h6>
                                <button type="button" className="btn btn-xs btn-dark" onClick={() => addRow('pricing', {timeFrame: '', price: ''})}>+ Add</button>
                            </div>
                            {formData.pricing?.map((p, i) => (
                                <div key={i} className="row g-1 mb-2">
                                    <div className="col-7"><input value={p.timeFrame} className="form-control form-control-sm" onChange={e => handleArrayChange(i, 'timeFrame', e.target.value, 'pricing')} /></div>
                                    <div className="col-3"><input value={p.price} type="number" className="form-control form-control-sm" onChange={e => handleArrayChange(i, 'price', e.target.value, 'pricing')} /></div>
                                    <div className="col-2 text-end"><button type="button" className="btn btn-sm text-danger" onClick={() => removeRow(i, 'pricing')}>×</button></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 mb-4 p-3 border-top border-4 border-primary">
                            <h6 className="fw-bold mb-3 small text-uppercase text-primary">Content: {activeTab.toUpperCase()}</h6>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea className="form-control" rows="3" value={current.jobDescription || ''} onChange={e => handleFieldChange('jobDescription', e.target.value)} required />
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">What You Get</label>
                                    {current.whatYouGet?.map((item, i) => (
                                        <div key={i} className="d-flex mb-1 gap-1">
                                            <input className="form-control form-control-sm" value={item} onChange={e => handleArrayChange(i, null, e.target.value, 'whatYouGet')} />
                                            <button type="button" className="btn btn-sm text-danger" onClick={() => removeRow(i, 'whatYouGet')}>×</button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-sm text-primary p-0" onClick={() => addRow('whatYouGet', '')}>+ Add</button>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-danger">Exclusions</label>
                                    {current.whatYouNotGet?.map((item, i) => (
                                        <div key={i} className="d-flex mb-1 gap-1">
                                            <input className="form-control form-control-sm" value={item} onChange={e => handleArrayChange(i, null, e.target.value, 'whatYouNotGet')} />
                                            <button type="button" className="btn btn-sm text-danger" onClick={() => removeRow(i, 'whatYouNotGet')}>×</button>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-sm text-primary p-0" onClick={() => addRow('whatYouNotGet', '')}>+ Add</button>
                                </div>
                            </div>

                            <h6 className="fw-bold mb-2 small text-muted">Process Steps</h6>
                            {current.processSteps?.map((s, i) => (
                                <div key={i} className="bg-light p-2 rounded mb-2 border">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="badge bg-white text-dark border small">Step {i+1}</span>
                                        <button type="button" className="btn-close" style={{scale: '0.7'}} onClick={() => removeRow(i, 'processSteps')}></button>
                                    </div>
                                    <input value={s.title} className="form-control form-control-sm mb-1 fw-bold" placeholder="Title" onChange={e => handleArrayChange(i, 'title', e.target.value, 'processSteps')} />
                                    <textarea value={s.description} className="form-control form-control-sm" rows="1" placeholder="Description" onChange={e => handleArrayChange(i, 'description', e.target.value, 'processSteps')} />
                                </div>
                            ))}
                            <button type="button" className="btn btn-sm btn-outline-dark mb-4" onClick={() => addRow('processSteps', {title: '', description: ''})}>+ Add Step</button>

                            <h6 className="fw-bold mb-2 small text-muted">FAQs</h6>
                            {current.faqs?.map((f, i) => (
                                <div key={i} className="mb-2 p-2 border-start border-3 border-info bg-light rounded">
                                    <div className="d-flex justify-content-between mb-1">
                                        <input value={f.question} placeholder="Question" className="form-control form-control-sm fw-bold border-0 bg-transparent" onChange={e => handleArrayChange(i, 'question', e.target.value, 'faqs')} />
                                        <button type="button" className="btn btn-sm text-danger" onClick={() => removeRow(i, 'faqs')}>×</button>
                                    </div>
                                    <textarea value={f.answer} placeholder="Answer" className="form-control form-control-sm border-0 bg-white" rows="1" onChange={e => handleArrayChange(i, 'answer', e.target.value, 'faqs')} />
                                </div>
                            ))}
                            <button type="button" className="btn btn-sm btn-outline-info" onClick={() => addRow('faqs', {question: '', answer: ''})}>+ Add FAQ</button>
                        </div>

                        <div className="text-end mb-5">
                            <button type="submit" className="btn btn-success px-5 fw-bold" disabled={loading}>
                                {loading ? 'Saving Changes...' : 'Save Job Content'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditJob;