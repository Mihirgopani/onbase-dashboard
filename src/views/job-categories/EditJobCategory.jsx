import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditJobCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [activeTab, setActiveTab] = useState('en'); // 'en', 'hi', 'gu'
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await api.get(`/job-categories/${id}`);
                setFormData(res.data);
            } catch (err) {
                console.error("Error fetching category:", err);
            }
        };
        fetchCategory();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Sending the complete object with all 3 language names
            await api.put(`/job-categories/${id}`, formData);
            navigate('/job-categories');
        } catch (err) {
            alert("Error updating category");
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <div className="p-5 text-center">Loading Category...</div>;

    return (
        <div className="main-content px-4 py-4">
            <div className="card col-md-6 mx-auto shadow-sm border-0">
                <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Edit Category</h5>
                    {/* Language Switcher */}
                    <div className="btn-group shadow-sm" style={{ scale: '0.85' }}>
                        {['en', 'hi', 'gu'].map(lang => (
                            <button 
                                key={lang} 
                                type="button" 
                                className={`btn btn-sm ${activeTab === lang ? 'btn-primary' : 'btn-outline-primary'}`} 
                                onClick={() => setActiveTab(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <form className="card-body px-4 pb-4" onSubmit={handleUpdate}>
                    {/* Multilingual Name Field */}
                    <div className="mb-3">
    <label className="form-label small fw-bold">
        Category Name ({activeTab.toUpperCase()})
    </label>
    
    {activeTab === 'en' && (
        <input 
            type="text" 
            className="form-control" 
            value={formData.name || ''} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
        />
    )}
    
    {activeTab === 'hi' && (
        <input 
            type="text" 
            className="form-control" 
            /* Changed from hindiName to hindiTitle */
            value={formData.hindiTitle || ''} 
            onChange={e => setFormData({...formData, hindiTitle: e.target.value})} 
            placeholder="श्रेणी का नाम (Hindi)" 
        />
    )}
    
    {activeTab === 'gu' && (
        <input 
            type="text" 
            className="form-control" 
            /* Changed from gujaratiName to gujaratiTitle */
            value={formData.gujaratiTitle || ''} 
            onChange={e => setFormData({...formData, gujaratiTitle: e.target.value})} 
            placeholder="કેટેગરીનું નામ (Gujarati)" 
        />
    )}
</div>

                    {/* Global Status Field */}
                    <div className="mb-4">
                        <label className="form-label small fw-bold">Status (Global)</label>
                        <select 
                            className="form-select" 
                            value={formData.status} 
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="d-flex gap-2">
                        <button 
                            type="button" 
                            className="btn btn-light border w-50" 
                            onClick={() => navigate('/job-categories')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-success w-50 shadow-sm" 
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditJobCategory;