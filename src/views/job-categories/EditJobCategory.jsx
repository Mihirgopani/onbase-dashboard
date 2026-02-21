import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditJobCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        api.get(`/job-categories/${id}`).then(res => setFormData(res.data));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        await api.put(`/job-categories/${id}`, formData);
        navigate('/job-categories');
    };

    if (!formData) return null;

    return (
        <div className="main-content">
            <div className="card col-md-6 mx-auto">
                <div className="card-header"><h5>Edit Category</h5></div>
                <form className="card-body" onSubmit={handleUpdate}>
                    <div className="mb-3"><label>Name</label><input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="mb-3"><label>Status</label>
                        <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="active">Active</option><option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100">Update Category</button>
                </form>
            </div>
        </div>
    );
};
export default EditJobCategory;