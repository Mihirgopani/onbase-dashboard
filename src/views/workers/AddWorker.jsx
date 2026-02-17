import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddWorker = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Login/OTP, 1: Basic, 2: Team, 3: Docs, 4: Payment
    
    const [formData, setFormData] = useState({
        name: '', email: '', phone_number: '', alt_number: '', address: '', city: '',
        role: 'worker', logintype: 'otp', language: 'hindi', 
        work_type: 'construction_worker', team_status: 'no', status: 'active',
        experience: '', work_area: '',
        payment_details: { bank_name: '', bank_account_number: '', bank_ifsc: '', account_holder_name: '', upi_id: '', gpay_number: '' },
        team_members: [], // { type: '', workers: 1 }
        documents: [
            { type: 'aadhar_card', id_number: '', url_front: null, url_back: null },
            { type: 'pan_card', id_number: '', url_front: null }
        ]
    });

    // --- Step 0: Phone & OTP Logic ---
    const handlePhoneCheck = async () => {
        // Here you would call backend to check if user exists
        // if (new) setStep(0.5) for OTP... for now let's skip to language
        setStep(1);
    };

    // --- Helper functions for Team Members ---
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/workers', formData);
            navigate('/workers');
        } catch (err) {
            alert("Error saving profile");
        }
    };

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    
                    {/* Progress Indicator */}
                    {step > 0 && (
                        <div className="d-flex justify-content-between mb-4 px-3">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`badge ${step === s ? 'bg-primary' : 'bg-light text-dark'} p-2 px-3`}>Step {s}</div>
                            ))}
                        </div>
                    )}

                    {/* STAGE 0: AUTHENTICATION & INITIAL SETUP */}
                    {step === 0 && (
                        <div className="card text-center p-4">
                            <h3>Welcome to OnBase</h3>
                            <p className="text-muted">Enter phone number to continue</p>
                            <input type="text" className="form-control mb-3 text-center fs-4" placeholder="+91 00000 00000" 
                                value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                            <button className="btn btn-primary w-100" onClick={handlePhoneCheck}>Verify & Continue</button>
                        </div>
                    )}

                    {/* STEP 1: BASIC ACCOUNT SETUP */}
                    {step === 1 && (
                        <div className="card shadow-sm">
                            <div className="card-header"><h5>Step 1: Personal Details</h5></div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3"><label>Full Name</label><input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>City</label><input type="text" className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3"><label>Alternate Number</label><input type="text" className="form-control" value={formData.alt_number} onChange={e => setFormData({...formData, alt_number: e.target.value})} /></div>
                                    <div className="col-md-6 mb-3">
                                        <label>Language</label>
                                        <select className="form-control" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                                            <option value="hindi">Hindi</option><option value="english">English</option><option value="gujarati">Gujarati</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-3"><label>Address</label><textarea className="form-control" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea></div>
                                </div>
                                <button className="btn btn-primary float-end" onClick={() => setStep(2)}>Next Step</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: WORK & TEAM SETUP */}
                    {step === 2 && (
                        <div className="card shadow-sm">
                            <div className="card-header"><h5>Step 2: Work & Team</h5></div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="fw-bold">Do you have a team?</label>
                                    <div className="btn-group w-100 mt-2">
                                        <button className={`btn ${formData.team_status === 'no' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFormData({...formData, team_status: 'no', team_members: []})}>No (Individual)</button>
                                        <button className={`btn ${formData.team_status === 'yes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFormData({...formData, team_status: 'yes'})}>Yes (Contractor)</button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label>Work Area (City)</label>
                                    <input type="text" className="form-control" placeholder="e.g. Surat" value={formData.work_area} onChange={e => setFormData({...formData, work_area: e.target.value})} />
                                </div>

                                <div className="mb-3">
                                    <label>Experience</label>
                                    <select className="form-control" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}>
                                        <option value="">Select Experience</option><option value="6 month">6 Months</option><option value="1 year">1 Year</option><option value="2 year">2+ Years</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label>Select Services</label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {['brick_mason', 'column_mason', 'plumber', 'painter'].map(type => (
                                            <button key={type} type="button" 
                                                className={`btn btn-sm ${formData.team_members.find(m => m.type === type) || formData.work_type === type ? 'btn-dark' : 'btn-outline-secondary'}`}
                                                onClick={() => formData.team_status === 'no' ? setFormData({...formData, work_type: type, team_members: [{type, workers: 1}]}) : toggleTeamMemberType(type)}>
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {formData.team_status === 'yes' && formData.team_members.map((m, i) => (
                                    <div key={i} className="d-flex align-items-center justify-content-between bg-light p-2 mb-2 rounded">
                                        <span className="text-capitalize">{m.type.replace('_', ' ')}</span>
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

                    {/* STEP 3: DOCUMENTS (AADHAR & PAN) */}
{step === 3 && (
    <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent border-bottom">
            <h5 className="mb-0">Step 3: Identity Verification</h5>
        </div>
        <div className="card-body">
            {/* Aadhar Section */}
            <div className="mb-4 p-3 border rounded bg-light">
                <label className="fw-bold mb-2 text-primary">Aadhar Card Details</label>
                <div className="row">
                    <div className="col-12 mb-3">
                        <label className="small">Aadhar Number</label>
                        <input type="text" className="form-control" placeholder="1234 5678 9012" 
                            value={formData.documents[0].id_number}
                            onChange={e => {
                                let docs = [...formData.documents];
                                docs[0].id_number = e.target.value;
                                setFormData({...formData, documents: docs});
                            }} 
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label className="small">Upload Front Side</label>
                        <input type="file" className="form-control form-control-sm" onChange={(e) => console.log("Aadhar Front Selected")} />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label className="small">Upload Back Side</label>
                        <input type="file" className="form-control form-control-sm" onChange={(e) => console.log("Aadhar Back Selected")} />
                    </div>
                </div>
            </div>

            {/* Pan Section */}
            <div className="mb-4 p-3 border rounded bg-light">
                <label className="fw-bold mb-2 text-primary">PAN Card Details</label>
                <div className="row">
                    <div className="col-12 mb-3">
                        <label className="small">PAN Number</label>
                        <input type="text" className="form-control" placeholder="ABCDE1234F" 
                            value={formData.documents[1].id_number}
                            onChange={e => {
                                let docs = [...formData.documents];
                                docs[1].id_number = e.target.value;
                                setFormData({...formData, documents: docs});
                            }} 
                        />
                    </div>
                    <div className="col-12 mb-2">
                        <label className="small">Upload PAN Front</label>
                        <input type="file" className="form-control form-control-sm" onChange={(e) => console.log("PAN Front Selected")} />
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-light" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary px-4" onClick={() => setStep(4)}>Next Step</button>
            </div>
        </div>
    </div>
)}

{/* STEP 4: PAYMENT & FINISH */}
{step === 4 && (
    <div className="card shadow-sm border-0">
        <div className="card-header bg-transparent border-bottom">
            <h5 className="mb-0">Step 4: Banking & Payment Info</h5>
        </div>
        <div className="card-body">
            <div className="row">
                <div className="col-md-12 mb-3">
                    <label className="form-label">Account Holder Name</label>
                    <input type="text" className="form-control" placeholder="As per Bank Passbook"
                        onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, account_holder_name: e.target.value}})} 
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Bank Name</label>
                    <input type="text" className="form-control" placeholder="e.g. State Bank of India"
                        onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_name: e.target.value}})} 
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">IFSC Code</label>
                    <input type="text" className="form-control" placeholder="SBIN0001234"
                        onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_ifsc: e.target.value}})} 
                    />
                </div>
                <div className="col-md-12 mb-3">
                    <label className="form-label">Account Number</label>
                    <input type="text" className="form-control" placeholder="0000 0000 0000 0000"
                        onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, bank_account_number: e.target.value}})} 
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">UPI ID</label>
                    <input type="text" className="form-control" placeholder="example@okaxis"
                        onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, upi_id: e.target.value}})} 
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">GPay Number</label>
                    <input type="text" className="form-control" placeholder="+91 00000 00000"
                        onChange={e => setFormData({...formData, payment_details: {...formData.payment_details, gpay_number: e.target.value}})} 
                    />
                </div>
            </div>

            <div className="alert alert-info small mt-2">
                <i className="feather-info me-2"></i>
                Please ensure all details are correct for seamless payments.
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-light" onClick={() => setStep(3)}>Back</button>
                <button className="btn btn-success px-5" onClick={handleSubmit}>Complete Registration</button>
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