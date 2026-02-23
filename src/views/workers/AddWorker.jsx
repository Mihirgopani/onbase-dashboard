import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const JOB_LISTS = {
    construction: ['brick_mason', 'columns_mason', 'mason_helper', 'plaster_mason', 'reinforcement_fitter'],
    industrial: ['fabricator', 'welder', 'fitter', 'machine_operator', 'industrial_helper'],
    houseHelpers: ['cleaning', 'cooking', 'gardening', 'baby_sitting']
};

const AddWorker = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); 
    
    const [formData, setFormData] = useState({
        name: '', email: '', phone_number: '', alt_number: '', address: '', city: '',
        role: 'worker', language: 'hindi', category: 'construction',
        work_type: '', team_status: 'no', status: 'active',
        experience: '', work_area: '',
        payment_details: { bank_name: '', bank_account_number: '', bank_ifsc: '', account_holder_name: '', upi_id: '', gpay_number: '' },
        team_members: [], 
        documents: [
            { type: 'aadhar_card', id_number: '', url_front: null, url_back: null },
            { type: 'pan_card', id_number: '', url_front: null }
        ]
    });

    const handlePhoneCheck = () => setStep(1);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Clean payload: ensure work_type is set to the first selected service
            const finalPayload = {
                ...formData,
                work_type: formData.team_members.length > 0 ? formData.team_members[0].type : formData.work_type
            };
            await api.post('/workers', finalPayload);
            navigate('/workers');
        } catch (err) {
            alert("Error saving profile");
        }
    };

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    
                    {step > 0 && (
                        <div className="d-flex justify-content-between mb-4 px-3">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`badge ${step === s ? 'bg-primary' : 'bg-light text-dark'} p-2 px-3`}>Step {s}</div>
                            ))}
                        </div>
                    )}

                    {step === 0 && (
                        <div className="card text-center p-4 shadow-sm border-0">
                            <h3 className="fw-bold">New Worker Onboarding</h3>
                            <p className="text-muted">Enter primary mobile number to begin</p>
                            <input type="text" className="form-control mb-3 text-center fs-4" placeholder="+91" 
                                value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                            <button className="btn btn-primary w-100 py-3 fw-bold" onClick={handlePhoneCheck}>Verify & Continue</button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white"><h5>Step 1: Personal Details</h5></div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3"><label>Full Name</label><input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>City</label><input type="text" className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>Alternate Number</label><input type="text" className="form-control" value={formData.alt_number} onChange={e => setFormData({...formData, alt_number: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3">
                                        <label>Language</label>
                                        <select className="form-control" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                                            <option value="hindi">Hindi</option><option value="english">English</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-3"><label>Address</label><textarea className="form-control" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea></div>
                                </div>
                                <button className="btn btn-primary float-end px-4" onClick={() => setStep(2)}>Next Step</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white"><h5>Step 2: Work & Category</h5></div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="fw-bold">Work Category</label>
                                    <select className="form-select border-primary" value={formData.category} 
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
                                            <button className={`btn ${formData.team_status === 'no' ? 'btn-primary' : 'btn-outline-primary'}`} 
                                                onClick={() => setFormData({...formData, team_status: 'no', team_members: []})}>Individual</button>
                                            <button className={`btn ${formData.team_status === 'yes' ? 'btn-primary' : 'btn-outline-primary'}`} 
                                                onClick={() => setFormData({...formData, team_status: 'yes'})}>Team/Contractor</button>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="fw-bold">Select Services</label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {JOB_LISTS[formData.category].map(type => (
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
                                        <input type="number" className="form-control w-25" placeholder="Count" value={m.workers} onChange={e => updateMemberCount(m.type, e.target.value)} />
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(1)}>Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(3)}>Next Step</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white"><h5>Step 3: Identity Verification</h5></div>
                            <div className="card-body">
                                <div className="mb-4 p-3 border rounded bg-light">
                                    <label className="fw-bold mb-2">Aadhar Card</label>
                                    <input type="text" className="form-control mb-2" placeholder="Aadhar Number" value={formData.documents[0].id_number}
                                        onChange={e => { let docs = [...formData.documents]; docs[0].id_number = e.target.value; setFormData({...formData, documents: docs}); }} />
                                </div>
                                <div className="mb-4 p-3 border rounded bg-light">
                                    <label className="fw-bold mb-2">PAN Card</label>
                                    <input type="text" className="form-control" placeholder="PAN Number" value={formData.documents[1].id_number}
                                        onChange={e => { let docs = [...formData.documents]; docs[1].id_number = e.target.value; setFormData({...formData, documents: docs}); }} />
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(2)}>Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(4)}>Next Step</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white"><h5>Step 4: Banking Details</h5></div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3"><label>Holder Name</label><input type="text" className="form-control" onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, account_holder_name: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>Bank</label><input type="text" className="form-control" onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_name: e.target.value}})} /></div>
                                    <div className="col-md-6 mb-3"><label>IFSC</label><input type="text" className="form-control" onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_ifsc: e.target.value}})} /></div>
                                    <div className="col-md-12 mb-3"><label>Account Number</label><input type="text" className="form-control" onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_account_number: e.target.value}})} /></div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(3)}>Back</button>
                                    <button className="btn btn-success px-5 fw-bold" onClick={handleSubmit}>Finish & Save</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddWorker;