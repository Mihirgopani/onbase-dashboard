import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState({
        overall_status: '',
        payment_status: '',
        service_address: { address: '' }
    });

    useEffect(() => {
        api.get(`/bookings/${id}`).then(res => setBooking(res.data.booking));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        await api.put(`/bookings/${id}`, booking);
        alert("Booking Updated");
        navigate('/bookings');
    };

    return (
        <div className="main-content p-4">
            <div className="card shadow-sm col-md-6 mx-auto">
                <div className="card-header"><h4>Edit Booking</h4></div>
                <div className="card-body">
                    <form onSubmit={handleUpdate}>
                        <div className="mb-3">
                            <label className="form-label">Overall Status</label>
                            <select className="form-select" value={booking.overall_status} 
                                onChange={e => setBooking({...booking, overall_status: e.target.value})}>
                                <option value="received">Received</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Payment Status</label>
                            <select className="form-select" value={booking.payment_status} 
                                onChange={e => setBooking({...booking, payment_status: e.target.value})}>
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <textarea className="form-control" value={booking.service_address.address}
                                onChange={e => setBooking({...booking, service_address: {...booking.service_address, address: e.target.value}})} />
                        </div>
                        <button className="btn btn-primary w-100">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBooking;