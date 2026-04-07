import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BASE_URL = 'https://api.onbasenow.com';

const JOB_LISTS = {
    construction: ['brick_mason', 'columns_mason', 'mason_helper', 'plaster_mason', 'reinforcement_fitter'],
    industrial: ['fabricator', 'welder', 'fitter', 'machine_operator', 'industrial_helper'],
    houseHelpers: ['cleaning', 'cooking', 'gardening', 'baby_sitting']
};

const STATUS_OPTIONS = ['pending', 'active', 'inactive', 'rejected'];

const EditWorker = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '', email: '', phone_number: '', alt_number: '',
        city: '', area: '', language: 'english',
        category: 'construction', team_status: 'no', status: 'pending',
        payment_details: {
            bank_name: '', bank_account_number: '', bank_ifsc: '',
            account_holder_name: '', upi_id: '', gpay_number: ''
        },
        team_members: [],
        documents: [],
        addresses: []
    });

    useEffect(() => {
        const fetchWorker = async () => {
            try {
                const res = await api.get(`/workers/${id}`);
                const data = res.data;

                // Normalize category from work_type
                let category = 'construction';
                if (data.work_type === 'house help') category = 'houseHelpers';
                else if (data.work_type === 'industry' || data.work_type === 'industrial') category = 'industrial';

                setFormData({
                    ...data,
                    category,
                    payment_details: data.payment_details || {
                        bank_name: '', bank_account_number: '', bank_ifsc: '',
                        account_holder_name: '', upi_id: '', gpay_number: ''
                    },
                    team_members: data.team_members || [],
                    documents: data.documents || [],
                    addresses: data.addresses || []
                });
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
            team_members: formData.team_members.map(m =>
                m.type === type ? { ...m, workers: parseInt(count) || 0 } : m
            )
        });
    };

    const toggleDocVerification = (idx) => {
        const newDocs = [...formData.documents];
        newDocs[idx] = { ...newDocs[idx], verification_status: !newDocs[idx].verification_status };
        setFormData({ ...formData, documents: newDocs });
    };

    const updateDocIdNumber = (idx, value) => {
        const newDocs = [...formData.documents];
        newDocs[idx] = { ...newDocs[idx], id_number: value };
        setFormData({ ...formData, documents: newDocs });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { _id, createdAt, updatedAt, __v, role, ...cleanData } = formData;

            // Map category to work_type
            if (cleanData.category === 'houseHelpers') cleanData.work_type = 'house help';
            else if (cleanData.category === 'construction') cleanData.work_type = 'construction';
            else if (cleanData.category === 'industrial') cleanData.work_type = 'industry';

            // Clean document _ids
            if (cleanData.documents) {
                cleanData.documents = cleanData.documents.map(({ _id, ...doc }) => doc);
            }

            await api.put(`/workers/${id}`, cleanData);
            navigate(`/workers/details/${id}`);
        } catch (err) {
            console.error("Update Error:", err.response?.data || err.message);
            alert(`Failed: ${err.response?.data?.message || "Error updating profile"}`);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading Profile Data...</div>;

    return (
        <div className="main-content">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="page-header mb-4 d-flex align-items-center gap-3">
                        <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
                            ← Back
                        </button>
                        <h4 className="fw-bold text-primary mb-0">Edit Worker: {formData.name}</h4>
                    </div>

                    {/* Step Pills */}
                    <ul className="nav nav-pills nav-justified mb-4 shadow-sm bg-white rounded p-1">
                        {['Basic Info', 'Work & Team', 'Documents', 'Payment'].map((label, i) => (
                            <li className="nav-item" key={i}>
                                <button
                                    className={`nav-link ${step === i + 1 ? 'active' : ''}`}
                                    onClick={() => setStep(i + 1)}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* STEP 1 — Basic Info */}
                    {step === 1 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <input type="text" className="form-control"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Phone (read-only)</label>
                                        <input type="text" className="form-control bg-light"
                                            value={formData.phone_number} disabled />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Alt Phone</label>
                                        <input type="text" className="form-control"
                                            value={formData.alt_number || ''}
                                            onChange={e => setFormData({ ...formData, alt_number: e.target.value })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input type="email" className="form-control"
                                            value={formData.email || ''}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Language</label>
                                        <select className="form-select"
                                            value={formData.language || 'english'}
                                            onChange={e => setFormData({ ...formData, language: e.target.value })}>
                                            <option value="english">English</option>
                                            <option value="hindi">Hindi</option>
                                            <option value="gujarati">Gujarati</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Profile Status</label>
                                        <select className="form-select"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Address */}
                                {formData.addresses?.length > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Primary Address</label>
                                        <input type="text" className="form-control"
                                            value={formData.addresses[0]?.address || ''}
                                            onChange={e => {
                                                const newAddr = [...formData.addresses];
                                                newAddr[0] = { ...newAddr[0], address: e.target.value };
                                                setFormData({ ...formData, addresses: newAddr });
                                            }} />
                                    </div>
                                )}

                                <div className="d-flex justify-content-end mt-3">
                                    <button className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 — Work & Team */}
                    {step === 2 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Category</label>
                                    <select className="form-select border-primary"
                                        value={formData.category}
                                        onChange={e => setFormData({
                                            ...formData,
                                            category: e.target.value,
                                            team_members: [],
                                            team_status: e.target.value === 'houseHelpers' ? 'no' : formData.team_status
                                        })}>
                                        <option value="construction">Construction</option>
                                        <option value="industrial">Industrial</option>
                                        <option value="houseHelpers">House Helper</option>
                                    </select>
                                </div>

                                {formData.category !== 'houseHelpers' && (
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Team Status</label>
                                        <div className="btn-group w-100 mt-2">
                                            <button
                                                className={`btn ${formData.team_status === 'no' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setFormData({ ...formData, team_status: 'no', team_members: [] })}>
                                                Individual
                                            </button>
                                            <button
                                                className={`btn ${formData.team_status === 'yes' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => setFormData({ ...formData, team_status: 'yes' })}>
                                                Contractor
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Assigned Services</label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {(JOB_LISTS[formData.category] || []).map(type => (
                                            <button key={type} type="button"
                                                className={`btn btn-sm ${formData.team_members.find(m => m.type === type) ? 'btn-dark' : 'btn-outline-secondary'}`}
                                                onClick={() =>
                                                    (formData.team_status === 'yes' || formData.category === 'houseHelpers')
                                                        ? toggleTeamMemberType(type)
                                                        : setFormData({ ...formData, team_members: [{ type, workers: 1 }] })
                                                }>
                                                {type.replace(/_/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {formData.team_status === 'yes' && formData.team_members.map((m, i) => (
                                    <div key={i} className="d-flex align-items-center justify-content-between bg-light p-2 mb-2 rounded border">
                                        <span className="text-capitalize small fw-bold">{m.type.replace(/_/g, ' ')}</span>
                                        <input type="number" className="form-control w-25"
                                            value={m.workers}
                                            onChange={e => updateMemberCount(m.type, e.target.value)} />
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(1)}>← Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 — Documents */}
                    {step === 3 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">Identity Documents</h6>

                                {formData.documents.length === 0 && (
                                    <p className="text-muted">No documents uploaded.</p>
                                )}

                                {formData.documents.map((doc, idx) => (
                                    <div key={idx} className="mb-4 p-3 border rounded bg-light">
                                        {/* Doc type + verification toggle */}
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-uppercase fw-bold small text-secondary">
                                                {doc.type.replace(/_/g, ' ')}
                                            </span>
                                            <div className="form-check form-switch mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={doc.verification_status}
                                                    onChange={() => toggleDocVerification(idx)}
                                                    id={`verify-${idx}`}
                                                />
                                                <label className="form-check-label" htmlFor={`verify-${idx}`}>
                                                    {doc.verification_status
                                                        ? <span className="text-success fw-semibold">Verified</span>
                                                        : <span className="text-warning fw-semibold">Pending</span>}
                                                </label>
                                            </div>
                                        </div>

                                        {/* ID Number */}
                                        <div className="mb-3">
                                            <label className="form-label small">ID Number</label>
                                            <input type="text" className="form-control form-control-sm"
                                                value={doc.id_number || ''}
                                                onChange={e => updateDocIdNumber(idx, e.target.value)} />
                                        </div>

                                        {/* Document Images */}
                                        <div className="row g-2">
                                            {doc.url_front && (
                                                <div className="col-6">
                                                    <p className="small text-muted mb-1">Front</p>
                                                    <img
                                                        src={`${BASE_URL}/${doc.url_front}`}
                                                        alt="front"
                                                        className="img-fluid rounded border"
                                                        style={{ maxHeight: 160, objectFit: 'cover', width: '100%' }}
                                                    />
                                                </div>
                                            )}
                                            {doc.url_back && (
                                                <div className="col-6">
                                                    <p className="small text-muted mb-1">Back</p>
                                                    <img
                                                        src={`${BASE_URL}/${doc.url_back}`}
                                                        alt="back"
                                                        className="img-fluid rounded border"
                                                        style={{ maxHeight: 160, objectFit: 'cover', width: '100%' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(2)}>← Back</button>
                                    <button className="btn btn-primary" onClick={() => setStep(4)}>Next →</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4 — Payment */}
                    {step === 4 && (
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-semibold">Account Holder Name</label>
                                        <input type="text" className="form-control"
                                            value={formData.payment_details?.account_holder_name || ''}
                                            onChange={e => setFormData({ ...formData, payment_details: { ...formData.payment_details, account_holder_name: e.target.value } })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Bank Name</label>
                                        <input type="text" className="form-control"
                                            value={formData.payment_details?.bank_name || ''}
                                            onChange={e => setFormData({ ...formData, payment_details: { ...formData.payment_details, bank_name: e.target.value } })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">IFSC Code</label>
                                        <input type="text" className="form-control"
                                            value={formData.payment_details?.bank_ifsc || ''}
                                            onChange={e => setFormData({ ...formData, payment_details: { ...formData.payment_details, bank_ifsc: e.target.value } })} />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-semibold">Account Number</label>
                                        <input type="text" className="form-control"
                                            value={formData.payment_details?.bank_account_number || ''}
                                            onChange={e => setFormData({ ...formData, payment_details: { ...formData.payment_details, bank_account_number: e.target.value } })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">UPI ID</label>
                                        <input type="text" className="form-control"
                                            value={formData.payment_details?.upi_id || ''}
                                            onChange={e => setFormData({ ...formData, payment_details: { ...formData.payment_details, upi_id: e.target.value } })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">GPay Number</label>
                                        <input type="text" className="form-control"
                                            value={formData.payment_details?.gpay_number || ''}
                                            onChange={e => setFormData({ ...formData, payment_details: { ...formData.payment_details, gpay_number: e.target.value } })} />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-light" onClick={() => setStep(3)}>← Back</button>
                                    <button className="btn btn-warning px-5 fw-bold" onClick={handleUpdate}>
                                        Update Profile
                                    </button>
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