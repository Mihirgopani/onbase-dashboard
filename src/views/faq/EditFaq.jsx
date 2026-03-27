import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditFaq = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [activeLang, setActiveLang] = useState('en'); // 'en', 'hi', 'gu'
    
    const [formData, setFormData] = useState({ 
        question: '', 
        answer: '', 
        selectedCats: [],
        otherlang: [] // Will hold [{lang: 'hi', question: '', answer: ''}, {lang: 'gu', ...}]
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [catRes, faqRes] = await Promise.all([
                    api.get('/job-categories'),
                    api.get(`/faqs/${id}`)
                ]);
                setCategories(catRes.data);
                
                const data = faqRes.data;
                setFormData({
                    question: data.question || '',
                    answer: data.answer || '',
                    selectedCats: data.categories || [],
                    otherlang: data.otherlang || []
                });
            } catch (err) {
                console.error("Error loading FAQ:", err);
            }
        };
        load();
    }, [id]);

    // Helper to get or initialize language content
    const getLangContent = (langCode) => {
        if (langCode === 'en') return { question: formData.question, answer: formData.answer };
        const found = formData.otherlang.find(l => l.lang === langCode);
        return found || { question: '', answer: '' };
    };

    const handleContentChange = (field, value) => {
        if (activeLang === 'en') {
            setFormData({ ...formData, [field]: value });
        } else {
            const exists = formData.otherlang.find(l => l.lang === activeLang);
            let updatedOther;
            
            if (exists) {
                updatedOther = formData.otherlang.map(l => 
                    l.lang === activeLang ? { ...l, [field]: value } : l
                );
            } else {
                updatedOther = [...formData.otherlang, { lang: activeLang, [field]: value }];
            }
            setFormData({ ...formData, otherlang: updatedOther });
        }
    };

    const toggleCategory = (name) => {
        const updated = formData.selectedCats.includes(name) 
            ? formData.selectedCats.filter(c => c !== name) 
            : [...formData.selectedCats, name];
        setFormData({...formData, selectedCats: updated});
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/faqs/${id}`, { 
                ...formData, 
                categories: formData.selectedCats 
            });
            navigate('/faqs');
        } catch (err) {
            alert("Update failed");
        }
    };

    const currentContent = getLangContent(activeLang);

    return (
        <div className="main-content px-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fs-20 fw-bold mb-0">Edit FAQ</h2>
                
                {/* Language Switcher */}
                <div className="btn-group shadow-sm">
                    {['en', 'hi', 'gu'].map((l) => (
                        <button 
                            key={l}
                            type="button"
                            className={`btn btn-sm ${activeLang === l ? 'btn-dark' : 'btn-outline-dark'}`}
                            onClick={() => setActiveLang(l)}
                        >
                            {l === 'en' ? 'English' : l === 'hi' ? 'Hindi' : 'Gujarati'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card border-0 shadow-sm p-4">
                <div className="mb-3">
                    <label className="form-label fw-semibold text-muted small">
                        Question ({activeLang.toUpperCase()})
                    </label>
                    <input 
                        className="form-control" 
                        value={currentContent.question} 
                        onChange={e => handleContentChange('question', e.target.value)} 
                        placeholder={`Enter question in ${activeLang}`}
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label fw-semibold text-muted small">
                        Answer ({activeLang.toUpperCase()})
                    </label>
                    <textarea 
                        className="form-control" 
                        rows="5" 
                        value={currentContent.answer} 
                        onChange={e => handleContentChange('answer', e.target.value)} 
                        placeholder={`Enter answer in ${activeLang}`}
                    />
                </div>

                <label className="form-label fw-semibold text-muted small mb-2">Categories</label>
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {categories.map(c => (
                        <div key={c._id} onClick={() => toggleCategory(c.name)} 
                            className={`px-3 py-1 rounded-pill border cursor-pointer small transition-all ${formData.selectedCats.includes(c.name) ? 'bg-primary text-white border-primary' : 'bg-light text-dark'}`}>
                            {c.name}
                        </div>
                    ))}
                </div>

                <hr className="my-4 opacity-25" />

                <div className="d-flex gap-2">
                    <button className="btn btn-primary px-5 fw-bold" onClick={handleUpdate}>Update All Languages</button>
                    <button className="btn btn-light px-4" onClick={() => navigate('/faqs')}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditFaq;