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
    
    // Aligned with your service_address object structure
    const [address, setAddress] = useState({
        name: '',
        phone: '',
        houseDetails: '',
        street: '',
        city: '',
        pincode: ''
    });

    // Temporary state for the "Current Job" being added
    const [tempJob, setTempJob] = useState({
        category_id: '',
        job_id: '',
        worker_count: 1,
        date_type: 'single',
        start_date: '',
        startTime: '09:00 AM',
        endTime: '05:00 PM'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cRes, catRes, jRes] = await Promise.all([
                    api.get('/clients'),
                    api.get('/job-categories'),
                    api.get('/jobs')
                ]);
                setClients(cRes.data);
                setCategories(catRes.data);
                setAllJobs(jRes.data);
            } catch (err) {
                console.error("Error loading booking data:", err);
            }
        };
        fetchData();
    }, []);

    // Auto-fill address details when client is selected
    const handleClientChange = (clientId) => {
        setSelectedClientId(clientId);
        const client = clients.find(c => c._id === clientId);
        if (client) {
            setAddress(prev => ({
                ...prev,
                name: client.name,
                phone: client.phone_number
            }));
        }
    };

    const addToCart = () => {
        if (!tempJob.job_id || !tempJob.start_date) return alert("Please fill job details");
        
        const jobData = allJobs.find(j => j._id === tempJob.job_id);
        
        // Calculate item price
        const pricePerUnit = jobData.price || 1000;
        const totalItemPrice = pricePerUnit * tempJob.worker_count;

        const newItem = {
            worker_type: jobData.jobName,
            price_per_unit: pricePerUnit,
            hours: 8, // Defaulting to standard shift
            status: "Pending",
            otp: Math.floor(1000 + Math.random() * 9000).toString(),
            assigned_worker: null,
            // UI helper fields
            job_id: tempJob.job_id,
            start_date: tempJob.start_date,
            worker_count: tempJob.worker_count
        };

        setCart([...cart, newItem]);
        // Reset job selection but keep date for convenience
        setTempJob({ ...tempJob, job_id: '' });
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price_per_unit * item.worker_count), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Add at least one job");
        if (!address.city || !address.street) return alert("Please fill address details");
    
        // 1. Transform your Dashboard 'cart' to match Backend 'cart' expectations
        // The backend wants: item.title, item.price, item.quantity
        const formattedCart = cart.map(item => ({
            title: item.worker_type, // Backend uses item.title
            price: item.price_per_unit, // Backend uses item.price
            quantity: item.worker_count, // Backend loops over item.quantity
            hours: item.hours || 8
        }));
    
        // 2. Prepare the payload keys exactly as the backend deconstructs them:
        // const { cart, address, selectedSlot, totalAmount } = req.body;
        const bookingPayload = {
            cart: formattedCart,
            address: address, // Matches backend 'address'
            selectedSlot: {
                type: tempJob.date_type, // Backend uses selectedSlot.type
                date: tempJob.start_date,
                startDate: tempJob.start_date, // Ensuring both are sent for safety
                endDate: tempJob.end_date || tempJob.start_date,
                days: tempJob.date_type === 'range' ? calculateDays(tempJob.start_date, tempJob.end_date) : 1,
                startTime: tempJob.startTime,
                endTime: tempJob.endTime
            },
            totalAmount: calculateTotal() // Matches backend 'totalAmount'
        };
    
        try {
            // Note: Make sure your API call includes the auth token 
            // because backend uses req.user.id
            await api.post('/bookings', bookingPayload);
            alert("Booking created successfully!");
            navigate('/bookings');
        } catch (err) {
            console.error("Payload sent:", bookingPayload);
            console.error("Error Response:", err.response?.data);
            alert(err.response?.data?.message || "Error creating booking");
        }
    };
    
    // Helper to calculate days if range is selected
    const calculateDays = (start, end) => {
        if (!start || !end) return 1;
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4">
                <h2 className="fs-20 fw-bold">Manual Client Booking</h2>
            </div>

            <div className="row p-4">
                <div className="col-lg-8">
                    {/* 1. Client & Location */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3"><h5>1. Select Client & Location</h5></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label className="form-label small fw-bold">Client</label>
                                    <select className="form-select" value={selectedClientId} onChange={e => handleClientChange(e.target.value)} required>
                                        <option value="">Choose Client...</option>
                                        {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.phone_number})</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label small">House/Flat No</label>
                                    <input type="text" className="form-control" value={address.houseDetails} onChange={e => setAddress({...address, houseDetails: e.target.value})} />
                                </div>
                                <div className="col-md-8 mb-3">
                                    <label className="form-label small">Street/Area</label>
                                    <input type="text" className="form-control" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small">City</label>
                                    <input type="text" className="form-control" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small">Pincode</label>
                                    <input type="text" className="form-control" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Add Jobs */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3"><h5>2. Add Jobs to Booking</h5></div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="small fw-bold">Category</label>
                                    <select className="form-select" onChange={e => setTempJob({...tempJob, category_id: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="small fw-bold">Specific Job</label>
                                    <select className="form-select" value={tempJob.job_id} onChange={e => setTempJob({...tempJob, job_id: e.target.value})}>
                                        <option value="">Select Job</option>
                                        {allJobs
                                            .filter(j => (j.category?._id || j.category) === tempJob.category_id) 
                                            .map(job => <option key={job._id} value={job._id}>{job.jobName} (₹{job.price})</option>)
                                        }
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="small">Date</label>
                                    <input type="date" className="form-control" onChange={e => setTempJob({...tempJob, start_date: e.target.value})} />
                                </div>
                                <div className="col-md-4">
                                    <label className="small">Workers Needed</label>
                                    <input type="number" className="form-control" min="1" value={tempJob.worker_count} onChange={e => setTempJob({...tempJob, worker_count: parseInt(e.target.value)})} />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <button type="button" className="btn btn-primary w-100" onClick={addToCart}>
                                        <i className="feather-plus me-2"></i> Add to List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
                        <div className="card-header bg-dark text-white py-3">
                            <h5 className="mb-0">Booking Summary</h5>
                        </div>
                        <div className="card-body p-0">
                            {cart.length === 0 ? (
                                <div className="p-4 text-center text-muted">
                                    <i className="feather-shopping-cart fs-30 mb-2 d-block"></i>
                                    No services added.
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {cart.map((item, idx) => (
                                        <li key={idx} className="list-group-item py-3">
                                            <div className="d-flex justify-content-between">
                                                <div className="fw-bold text-dark">{item.worker_type}</div>
                                                <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(idx)}>
                                                    <i className="feather-trash-2"></i>
                                                </button>
                                            </div>
                                            <div className="d-flex justify-content-between small text-muted">
                                                <span>{item.worker_count} worker(s) x ₹{item.price_per_unit}</span>
                                                <span className="fw-bold">₹{item.price_per_unit * item.worker_count}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="card-footer bg-white p-4">
                            <div className="d-flex justify-content-between mb-3 fs-5">
                                <span className="fw-bold">Grand Total:</span>
                                <span className="fw-bold text-primary">₹{calculateTotal().toLocaleString()}</span>
                            </div>
                            <textarea className="form-control mb-3" placeholder="Add any specific instructions..." rows="2" onChange={e => setNotes(e.target.value)}></textarea>
                            <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleSubmit} disabled={cart.length === 0}>
                                Create Final Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBooking;