import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const JOB_LISTS = {
    construction: ['brick_mason', 'columns_mason', 'mason_helper', 'plaster_mason', 'reinforcement_fitter'],
    industrial: ['fabricator', 'welder', 'fitter', 'machine_operator', 'industrial_helper'],
    houseHelpers: ['cleaning', 'cooking', 'gardening', 'baby_sitting']
};

const EditWorker = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '', email: '', phone_number: '', alt_number: '', address: '', city: '',
        category: 'construction', team_status: 'no', status: 'active',
        payment_details: { bank_name: '', bank_account_number: '', bank_ifsc: '', account_holder_name: '', upi_id: '', gpay_number: '' },
        team_members: [],
        documents: []
    });

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const res = await api.get(`/workers/${id}`);
                setFormData(res.data);
                setLoading(false);
            } catch (err) {
                alert("Worker not found");
                navigate('/workers');
            }
        };
        fetchWorker();
    }, [id, navigate]);

    const toggleTeamMemberType = (type) => {
        const exists = formData.team_members.find(m => m.type === type);
        if (exists) {
            setFormData({ ...formData, team_members: formData.team_members.filter(m => m.type !== type) });
        } else {
            setFormData({ ...formData, team_members: [...formData.team_members, { type, workers: 1 }] });
        }
    };

    const updateMemberCount = (type, count) => {
        setFormData({
            ...formData,
            team_members: formData.team_members.map(m => m.type === type ? { ...m, workers: parseInt(count) || 0 } : m)
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/workers/${id}`, formData);
            navigate(`/workers/details/${id}`);
        } catch (err) {
            alert("Error updating profile");
        }
    };

    if (loading) return <div className="p-5 text-center">Loading Profile Data...</div>;

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="page-header mb-4">
                        <h4 className="fw-bold text-primary">Edit Profile: {formData.name}</h4>
                    </div>

                    <ul className="nav nav-pills nav-justified mb-4 shadow-sm bg-white rounded p-1">
                        {[1, 2, 3, 4].map(s => (
                            <li className="nav-item" key={s}>
                                <button className={`nav-link ${step === s ? 'active' : ''}`} onClick={() => setStep(s)}>Step {s}</button>
                            </li>
                        ))}
                    </ul>

                    {step === 1 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3"><label>Full Name</label><input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>Main Phone</label><input type="text" className="form-control bg-light" value={formData.phone_number} disabled /></div>
                                    <div className="col-md-6 mb-3"><label>City</label><input type="text" className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3">
                                        <label>Profile Status</label>
                                        <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                            <option value="active">Active</option><option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="btn btn-primary float-end" onClick={() => setStep(2)}>Next</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="fw-bold">Category</label>
                                    <select className="form-select" value={formData.category} 
                                        onChange={e => setFormData({...formData, category: e.target.value, team_members: [], team_status: e.target.value === 'houseHelpers' ? 'no' : formData.team_status})}>
                                        <option value="construction">Construction</option>
                                        <option value="industrial">Industrial</option>
                                        <option value="houseHelpers">House Helper</option>
                                    </select>
                                </div>

                                {formData.category !== 'houseHelpers' && (
                                    <div className="mb-4">
                                        <label className="fw-bold">Team Status</label>
                                        <div className="btn-group w-100 mt-2">
                                            <button className={`btn ${formData.team_status === 'no' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFormData({...formData, team_status: 'no', team_members: []})}>Individual</button>
                                            <button className={`btn ${formData.team_status === 'yes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFormData({...formData, team_status: 'yes'})}>Contractor</button>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="fw-bold">Assigned Services</label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {(JOB_LISTS[formData.category] || []).map(type => (
                                            <button key={type} type="button" 
                                                className={`btn btn-sm ${formData.team_members.find(m => m.type === type) ? 'btn-dark' : 'btn-outline-secondary'}`}
                                                onClick={() => (formData.team_status === 'yes' || formData.category === 'houseHelpers') ? toggleTeamMemberType(type) : setFormData({...formData, team_members: [{type, workers: 1}]})}>
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {formData.team_status === 'yes' && formData.team_members.map((m, i) => (
                                    <div key={i} className="d-flex align-items-center justify-content-between bg-light p-2 mb-2 rounded border">
                                        <span className="text-capitalize small fw-bold">{m.type.replace('_', ' ')}</span>
                                        <input type="number" className="form-control w-25" value={m.workers} onChange={e => updateMemberCount(m.type, e.target.value)} />
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(1)}>Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(3)}>Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <label className="fw-bold">Identity Docs</label>
                                {formData.documents.map((doc, idx) => (
                                    <div key={idx} className="mb-3 p-3 border rounded">
                                        <label className="text-uppercase small fw-bold">{doc.type.replace('_', ' ')}</label>
                                        <input type="text" className="form-control mt-1" value={doc.id_number} onChange={e => {
                                            let newDocs = [...formData.documents]; newDocs[idx].id_number = e.target.value; setFormData({...formData, documents: newDocs});
                                        }} />
                                    </div>
                                ))}
                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(2)}>Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(4)}>Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3"><label>Holder Name</label><input type="text" className="form-control" value={formData.payment_details?.account_holder_name} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, account_holder_name: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>Bank Name</label><input type="text" className="form-control" value={formData.payment_details?.bank_name} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_name: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>IFSC</label><input type="text" className="form-control" value={formData.payment_details?.bank_ifsc} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_ifsc: e.target.value}})} /></div>
                                    <div className="col-md-12 mb-3"><label>Account Number</label><input type="text" className="form-control" value={formData.payment_details?.bank_account_number} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_account_number: e.target.value}})} /></div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(3)}>Back</button>
                                    <button className="btn btn-warning px-5 fw-bold" onClick={handleUpdate}>Update Profile</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditWorker;