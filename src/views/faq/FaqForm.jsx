import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Save, CheckCircle2 } from 'lucide-react';

const FaqForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [availableCategories, setAvailableCategories] = useState([]);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    categories: []
  });

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Categories for the Tick-marks
      const catRes = await axios.get('/api/categories');
      setAvailableCategories(catRes.data.map(c => c.name));

      // 2. Fetch FAQ data if in Edit Mode
      if (isEdit) {
        const faqRes = await axios.get(`/api/faqs/${id}`);
        setFormData({
          question: faqRes.data.question,
          answer: faqRes.data.answer,
          categories: faqRes.data.categories
        });
      }
    };
    fetchData();
  }, [id, isEdit]);

  const toggleCategory = (cat) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) await axios.put(`/api/faqs/${id}`, formData);
      else await axios.post('/api/faqs', formData);
      navigate('/faqs');
    } catch (err) { alert("Error saving FAQ"); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition">
        <ChevronLeft size={20} /> Back to List
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">{isEdit ? 'Edit FAQ' : 'Create Universal FAQ'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">The Question</label>
            <input 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="e.g. How do I track my worker?"
              value={formData.question}
              onChange={e => setFormData({...formData, question: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">The Answer</label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Detailed explanation..."
              rows="5"
              value={formData.answer}
              onChange={e => setFormData({...formData, answer: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">Display in Categories (Tick all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableCategories.map(cat => (
                <div 
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition ${
                    formData.categories.includes(cat) 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-100 bg-white text-gray-500'
                  }`}
                >
                  <span className="font-semibold">{cat}</span>
                  {formData.categories.includes(cat) && <CheckCircle2 size={18} />}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 mt-10">
            <Save size={20} /> {isEdit ? 'Update FAQ Content' : 'Publish FAQ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FaqForm;