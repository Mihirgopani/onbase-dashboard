import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        api.get(`/admins/${id}`).then(res => setFormData(res.data));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admins/${id}`, formData);
            navigate('/admins');
        } catch (err) { alert("Update failed"); }
    };

    if (!formData) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="main-content">
            <div className="card col-md-8 mx-auto shadow-sm">
                <div className="card-header"><h5>Edit Admin Profile</h5></div>
                <form className="card-body" onSubmit={handleUpdate}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-control" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Status</label>
                            <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-light" onClick={() => navigate('/admins')}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Update Account</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default EditAdmin;