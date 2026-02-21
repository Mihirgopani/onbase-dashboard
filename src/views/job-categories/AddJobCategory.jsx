import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddJobCategory = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/job-categories', { name });
        navigate('/job-categories');
    };

    return (
        <div className="main-content">
            <div className="card col-md-6 mx-auto shadow-sm">
                <div className="card-header"><h5>Create Category</h5></div>
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="mb-3">
                        <label>Category Name (e.g. Construction)</label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Save Category</button>
                </form>
            </div>
        </div>
    );
};
export default AddJobCategory;