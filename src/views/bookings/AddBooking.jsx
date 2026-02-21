import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AddBooking = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    
    // Form State
    const [selectedClientId, setSelectedClientId] = useState('');
    const [cart, setCart] = useState([]);
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState({ label: 'Home', address: '' });

    // Temporary state for the "Current Job" being added
    const [tempJob, setTempJob] = useState({
        category_id: '',
        job_id: '',
        worker_count: 1,
        date_type: 'single',
        start_date: '',
        end_date: '',
        time_slot: { start: '09:00', end: '18:00' }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cRes, catRes, jRes] = await Promise.all([
                    api.get('/clients'),
                    api.get('/job-categories'), // Changed from /categories
                    api.get('/jobs')
                ]);
                setClients(cRes.data);
                setCategories(catRes.data);
                setAllJobs(jRes.data);
            } catch (err) {
                console.error("Error loading booking data:", err);
                alert("Failed to load clients or categories. Please check backend connection.");
            }
        };
        fetchData();
    }, []);

    const addToCart = () => {
        if (!tempJob.job_id || !tempJob.start_date) return alert("Please fill job details");
        const jobData = allJobs.find(j => j._id === tempJob.job_id);
        setCart([...cart, { ...tempJob, jobName: jobData.name }]);
        // Reset temp job
        setTempJob({ ...tempJob, job_id: '', worker_count: 1 });
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Add at least one job");

        const bookingData = {
            client_id: selectedClientId,
            cart_items: cart,
            service_address: address,
            total_amount: 0, // In a real app, calculate based on job prices
            order_notes: notes,
            payment_mode: 'COD'
        };

        try {
            await api.post('/bookings', bookingData);
            alert("Booking created successfully!");
            navigate('/bookings');
        } catch (err) {
            console.error(err);
            alert("Error creating booking");
        }
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4">
                <h2 className="fs-20 fw-bold">Manual Client Booking</h2>
            </div>

            <div className="row p-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header"><h5>1. Select Client & Location</h5></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Client</label>
                                    <select className="form-select" onChange={e => setSelectedClientId(e.target.value)} required>
                                        <option value="">Choose Client...</option>
                                        {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.phone_number})</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Service Address</label>
                                    <input type="text" className="form-control" placeholder="House No, Street, City" 
                                        onChange={e => setAddress({...address, address: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mb-4">
                        <div className="card-header"><h5>2. Add Jobs to Booking</h5></div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="small">Category</label>
                                    <select className="form-select" onChange={e => setTempJob({...tempJob, category_id: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                {/* Specific Job Dropdown */}
<div className="col-md-4">
    <label className="small">Specific Job</label>
    <select 
        className="form-select" 
        value={tempJob.job_id}
        onChange={e => setTempJob({...tempJob, job_id: e.target.value})}
    >
        <option value="">Select Job</option>
        {allJobs
            // Compare the category ID from the job object with the selected category ID
            .filter(j => j.category?._id === tempJob.category_id) 
            .map(job => (
                <option key={job._id} value={job._id}>
                    {job.jobName} {/* Use jobName instead of name */}
                </option>
            ))
        }
    </select>
</div>
                                <div className="col-md-4">
                                    <label className="small">Workers Needed</label>
                                    <input type="number" className="form-control" min="1" value={tempJob.worker_count}
                                        onChange={e => setTempJob({...tempJob, worker_count: e.target.value})} />
                                </div>
                                
                                <div className="col-md-4">
                                    <label className="small">Date Strategy</label>
                                    <select className="form-select" onChange={e => setTempJob({...tempJob, date_type: e.target.value})}>
                                        <option value="single">Single Day</option>
                                        <option value="range">Date Range</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="small">Start Date</label>
                                    <input type="date" className="form-control" onChange={e => setTempJob({...tempJob, start_date: e.target.value})} />
                                </div>

                                {tempJob.date_type === 'range' && (
                                    <div className="col-md-4">
                                        <label className="small">End Date</label>
                                        <input type="date" className="form-control" onChange={e => setTempJob({...tempJob, end_date: e.target.value})} />
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <label className="small">Time Slot (Start - End)</label>
                                    <div className="d-flex gap-2">
                                        <input type="time" className="form-control" onChange={e => setTempJob({...tempJob, time_slot: {...tempJob.time_slot, start: e.target.value}})} />
                                        <input type="time" className="form-control" onChange={e => setTempJob({...tempJob, time_slot: {...tempJob.time_slot, end: e.target.value}})} />
                                    </div>
                                </div>

                                <div className="col-md-12 text-end">
                                    <button type="button" className="btn btn-outline-primary" onClick={addToCart}>
                                        <i className="feather-plus me-2"></i> Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-primary">
                        <div className="card-header bg-primary text-white"><h5>Order Summary</h5></div>
                        <div className="card-body p-0">
                            {cart.length === 0 ? <p className="p-3 text-center text-muted">No jobs added yet.</p> : (
                                <ul className="list-group list-group-flush">
                                    {cart.map((item, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div className="ms-2 me-auto">
                                                <div className="fw-bold">{item.jobName}</div>
                                                <small className="text-muted">{item.start_date} | {item.worker_count} Workers</small>
                                            </div>
                                            <button className="btn btn-sm text-danger" onClick={() => removeFromCart(idx)}><i className="feather-trash"></i></button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="card-footer">
                            <textarea className="form-control mb-3" placeholder="Special Instructions..." rows="2" onChange={e => setNotes(e.target.value)}></textarea>
                            <div className="alert alert-soft-warning py-2 small">Payment Mode: Cash on Delivery</div>
                            <button className="btn btn-primary w-100" onClick={handleSubmit}>Create Booking</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBooking;