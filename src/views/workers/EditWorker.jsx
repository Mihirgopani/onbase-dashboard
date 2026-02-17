import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditWorker = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '', email: '', phone_number: '', alt_number: '', address: '', city: '',
        role: 'worker', language: 'hindi', work_type: 'construction_worker', 
        team_status: 'no', status: 'active', experience: '', work_area: '',
        payment_details: { bank_name: '', bank_account_number: '', bank_ifsc: '', account_holder_name: '', upi_id: '', gpay_number: '' },
        team_members: [],
        documents: [
            { type: 'aadhar_card', id_number: '', url_front: null, url_back: null },
            { type: 'pan_card', id_number: '', url_front: null }
        ]
    });

    // 1. Fetch Existing Data
    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const res = await api.get(`/workers/${id}`);
                setFormData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching worker:", err);
                alert("Worker not found");
                navigate('/workers');
            }
        };
        fetchWorker();
    }, [id, navigate]);

    // 2. Helper Logic for Team Members (Same as AddWorker)
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
            team_members: formData.team_members.map(m => m.type === type ? { ...m, workers: parseInt(count) } : m)
        });
    };

    // 3. Update Function
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
                        <h4>Editing Profile: {formData.name}</h4>
                    </div>

                    {/* Progress Tabs */}
                    <ul className="nav nav-pills nav-justified mb-4 shadow-sm bg-white rounded p-1">
                        {[1, 2, 3, 4].map(s => (
                            <li className="nav-item" key={s}>
                                <button className={`nav-link ${step === s ? 'active' : ''}`} onClick={() => setStep(s)}>
                                    Step {s}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* STEP 1: PERSONAL DETAILS */}
                    {step === 1 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3"><label>Full Name</label><input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>Email</label><input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>Main Phone</label><input type="text" className="form-control" value={formData.phone_number} disabled /></div>
                                    <div className="col-md-6 mb-3"><label>Alternate Number</label><input type="text" className="form-control" value={formData.alt_number} onChange={e => setFormData({...formData, alt_number: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>City</label><input type="text" className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3">
                                        <label>Status</label>
                                        <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                            <option value="active">Active</option><option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="btn btn-primary float-end px-4" onClick={() => setStep(2)}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: WORK & TEAM (PRE-FILLED) */}
                    {step === 2 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="fw-bold">Do you have a team?</label>
                                    <div className="btn-group w-100 mt-2">
                                        <button className={`btn ${formData.team_status === 'no' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFormData({...formData, team_status: 'no', team_members: []})}>No (Individual)</button>
                                        <button className={`btn ${formData.team_status === 'yes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFormData({...formData, team_status: 'yes'})}>Yes (Contractor)</button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label>Experience</label>
                                    <select className="form-control" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}>
                                        <option value="6 month">6 Months</option><option value="1 year">1 Year</option><option value="2 year">2+ Years</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label>Services (Selected: {formData.team_members.length})</label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {['brick_mason', 'column_mason', 'plumber', 'painter'].map(type => (
                                            <button key={type} type="button" 
                                                className={`btn btn-sm ${formData.team_members.find(m => m.type === type) ? 'btn-dark' : 'btn-outline-secondary'}`}
                                                onClick={() => toggleTeamMemberType(type)}>
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {formData.team_members.map((m, i) => (
                                    <div key={i} className="d-flex align-items-center justify-content-between bg-light p-2 mb-2 rounded border">
                                        <span className="text-capitalize fw-bold">{m.type.replace('_', ' ')}</span>
                                        <div className="d-flex align-items-center">
                                            <label className="me-2 small">Workers:</label>
                                            <input type="number" className="form-control w-25" value={m.workers} onChange={e => updateMemberCount(m.type, e.target.value)} />
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(1)}>Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(3)}>Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: DOCUMENTS (PRE-FILLED) */}
                    {step === 3 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="fw-bold">Aadhar Details</label>
                                    <input type="text" className="form-control mb-3" value={formData.documents[0]?.id_number} onChange={e => {
                                        let docs = [...formData.documents]; docs[0].id_number = e.target.value; setFormData({...formData, documents: docs});
                                    }} />
                                    <div className="row">
                                        <div className="col-6"><small>Front: {formData.documents[0]?.url_front ? 'Uploaded' : 'Empty'}</small></div>
                                        <div className="col-6"><small>Back: {formData.documents[0]?.url_back ? 'Uploaded' : 'Empty'}</small></div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">PAN Details</label>
                                    <input type="text" className="form-control" value={formData.documents[1]?.id_number} onChange={e => {
                                        let docs = [...formData.documents]; docs[1].id_number = e.target.value; setFormData({...formData, documents: docs});
                                    }} />
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(2)}>Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(4)}>Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PAYMENT (PRE-FILLED) */}
                    {step === 4 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3"><label>Account Holder Name</label><input type="text" className="form-control" value={formData.payment_details?.account_holder_name} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, account_holder_name: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>Bank Name</label><input type="text" className="form-control" value={formData.payment_details?.bank_name} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_name: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>IFSC Code</label><input type="text" className="form-control" value={formData.payment_details?.bank_ifsc} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_ifsc: e.target.value}})} /></div>
                                    <div className="col-md-12 mb-3"><label>Account Number</label><input type="text" className="form-control" value={formData.payment_details?.bank_account_number} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_account_number: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>UPI ID</label><input type="text" className="form-control" value={formData.payment_details?.upi_id} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, upi_id: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>GPay Number</label><input type="text" className="form-control" value={formData.payment_details?.gpay_number} onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, gpay_number: e.target.value}})} /></div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(3)}>Back</button>
                                    <button className="btn btn-warning px-5" onClick={handleUpdate}>Update Profile</button>
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