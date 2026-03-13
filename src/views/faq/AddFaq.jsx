import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddFaq = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        selectedCats: []
    });

    useEffect(() => {
        api.get('/job-categories').then(res => setCategories(res.data));
    }, []);

    const toggleCategory = (catName) => {
        setFormData(prev => ({
            ...prev,
            selectedCats: prev.selectedCats.includes(catName)
                ? prev.selectedCats.filter(c => c !== catName)
                : [...prev.selectedCats, catName]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.selectedCats.length === 0) return alert("Select at least one category");
        try {
            await api.post('/faqs', {
                question: formData.question,
                answer: formData.answer,
                categories: formData.selectedCats
            });
            navigate('/faqs');
        } catch (err) { alert("Error creating FAQ"); }
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4">
                <h2 className="fs-20 fw-bold">Create New FAQ</h2>
            </div>
            <div className="row p-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label small fw-bold">The Question</label>
                                <input type="text" className="form-control" placeholder="Enter question..." 
                                    onChange={e => setFormData({...formData, question: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">The Answer</label>
                                <textarea className="form-control" rows="6" placeholder="Provide detailed answer..."
                                    onChange={e => setFormData({...formData, answer: e.target.value})}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3"><h5>Display in Categories</h5></div>
                        <div className="card-body">
                            <div className="d-flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <div key={cat._id} onClick={() => toggleCategory(cat.name)}
                                        className={`px-3 py-2 rounded-3 border cursor-pointer ${formData.selectedCats.includes(cat.name) ? 'bg-primary text-white' : 'bg-light'}`}>
                                        <small className="fw-bold">{cat.name}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white py-3"><h5 className="mb-0">Publishing</h5></div>
                        <div className="card-body">
                            <p className="text-muted small">This FAQ will be visible to users in all selected categories instantly.</p>
                            <button className="btn btn-primary w-100 fw-bold" onClick={handleSubmit}>Save FAQ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFaq;