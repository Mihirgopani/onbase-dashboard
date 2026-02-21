import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        api.get(`/jobs/${id}`).then(res => setFormData(res.data));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        await api.put(`/jobs/${id}`, formData);
        navigate('/jobs');
    };

    if (!formData) return null;

    return (
        <div className="main-content">
            <div className="card col-md-8 mx-auto">
                <div className="card-header"><h5>Edit Job Role</h5></div>
                <form className="card-body" onSubmit={handleUpdate}>
                    <div className="mb-3"><label>Job Name</label><input type="text" className="form-control" value={formData.jobName} onChange={e => setFormData({...formData, jobName: e.target.value})} /></div>
                    <div className="mb-3"><label>Status</label>
                        <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="active">Active</option><option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100">Update Job</button>
                </form>
            </div>
        </div>
    );
};
export default EditJob;