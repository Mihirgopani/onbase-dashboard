import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const ChargeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        type: 'fix',
        value: 0,
        status: 'active',
        show_info: false
    });

    useEffect(() => {
        if (isEdit) {
            fetchCharge();
        }
    }, [id]);

    const fetchCharge = async () => {
        try {
            const res = await api.get(`/charges`);
            const data = Array.isArray(res.data) ? res.data.find(c => c._id === id) : res.data;
            if (data) setFormData(data);
        } catch (err) {
            console.error("Error fetching charge", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/charges/${id}`, formData);
            } else {
                await api.post('/charges', formData);
            }
            alert(`Charge ${isEdit ? 'updated' : 'created'} successfully!`);
            navigate('/charges');
        } catch (err) {
            alert("Error saving charge details.");
        }
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4">
                <h2 className="fs-20 fw-bold">{isEdit ? 'Edit Charge' : 'Create New Charge'}</h2>
                <p className="text-muted small">Define how fees are calculated at checkout</p>
            </div>

            <div className="row p-4">
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small">Charge Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="e.g. Platform Fee, GST, Delivery"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold small">Charge Type</label>
                                        <select 
                                            className="form-select"
                                            value={formData.type}
                                            onChange={e => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option value="fix">Fixed Amount (₹)</option>
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="free">Free (Show & Strike-through)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold small">Value</label>
                                        <div className="input-group">
                                            {formData.type !== 'percentage' && <span className="input-group-text">₹</span>}
                                            <input 
                                                type="number" 
                                                className="form-control"
                                                // Value is now always editable even if "free"
                                                value={formData.value}
                                                onChange={e => setFormData({...formData, value: e.target.value})}
                                                required
                                            />
                                            {formData.type === 'percentage' && <span className="input-group-text">%</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">Status</label>
                                        <div className="d-flex gap-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="status" id="active" 
                                                    checked={formData.status === 'active'} 
                                                    onChange={() => setFormData({...formData, status: 'active'})} />
                                                <label className="form-check-label" htmlFor="active">Active</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="status" id="inactive" 
                                                    checked={formData.status === 'inactive'} 
                                                    onChange={() => setFormData({...formData, status: 'inactive'})} />
                                                <label className="form-check-label" htmlFor="inactive">Inactive</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small">App Display</label>
                                        <div className="form-check form-switch mt-1">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="showInfo"
                                                checked={formData.show_info}
                                                onChange={e => setFormData({...formData, show_info: e.target.checked})}
                                            />
                                            <label className="form-check-label" htmlFor="showInfo">Show Info (i) button</label>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4 text-light" />

                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary px-4 py-2 fw-bold">
                                        {isEdit ? 'Update Charge' : 'Save Charge'}
                                    </button>
                                    <button type="button" className="btn btn-light px-4 border" onClick={() => navigate('/charges')}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card bg-dark text-white border-0 shadow-sm p-4">
                        <h5 className="mb-3 text-primary"><i className="feather-info me-2"></i> How it works</h5>
                        <ul className="list-unstyled small mb-0">
                            <li className="mb-3">
                                <strong>Fixed/Percentage:</strong> Standard calculations added to total.
                            </li>
                            <li className="mb-3">
                                <strong>Free:</strong> Allows you to set a value (e.g., ₹50) so the app can show "₹50" crossed out and "Free" written next to it.
                            </li>
                            <li>
                                <strong>Show Info:</strong> If enabled, a small "i" icon will appear next to this charge in the app for more details.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChargeForm;