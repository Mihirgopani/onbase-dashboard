import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditFaq = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ question: '', answer: '', selectedCats: [] });

    useEffect(() => {
        const load = async () => {
            const [catRes, faqRes] = await Promise.all([
                api.get('/job-categories'),
                api.get(`/faqs/${id}`)
            ]);
            setCategories(catRes.data);
            setFormData({
                question: faqRes.data.question,
                answer: faqRes.data.answer,
                selectedCats: faqRes.data.categories
            });
        };
        load();
    }, [id]);

    const toggleCategory = (name) => {
        const updated = formData.selectedCats.includes(name) 
            ? formData.selectedCats.filter(c => c !== name) 
            : [...formData.selectedCats, name];
        setFormData({...formData, selectedCats: updated});
    };

    const handleUpdate = async () => {
        await api.put(`/faqs/${id}`, { ...formData, categories: formData.selectedCats });
        navigate('/faqs');
    };

    return (
        <div className="main-content px-4 mt-4">
            <h2 className="fs-20 fw-bold mb-4">Edit FAQ</h2>
            <div className="card border-0 shadow-sm p-4">
                <input className="form-control mb-3" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
                <textarea className="form-control mb-4" rows="5" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} />
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {categories.map(c => (
                        <div key={c._id} onClick={() => toggleCategory(c.name)} 
                            className={`px-3 py-2 rounded-pill border cursor-pointer ${formData.selectedCats.includes(c.name) ? 'bg-info text-white' : 'bg-light'}`}>
                            {c.name}
                        </div>
                    ))}
                </div>
                <button className="btn btn-primary px-5" onClick={handleUpdate}>Update FAQ</button>
            </div>
        </div>
    );
};

export default EditFaq;