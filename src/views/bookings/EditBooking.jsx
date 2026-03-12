import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // Initialize state to match your specific schema
    const [booking, setBooking] = useState({
        overall_status: '',
        payment_status: '',
        service_address: {
            name: '',
            phone: '',
            houseDetails: '',
            street: '',
            city: '',
            pincode: ''
        }
    });

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/bookings/${id}`);
                // Handle both cases: if data is wrapped in .booking or is at root
                const data = res.data.booking || res.data;
                setBooking(data);
            } catch (err) {
                console.error("Error fetching booking:", err);
                alert("Could not load booking data.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/bookings/${id}`, booking);
            alert("Booking Updated Successfully");
            navigate('/bookings');
        } catch (err) {
            console.error("Update Error:", err);
            alert("Failed to update booking.");
        }
    };

    if (loading) return (
        <div className="main-content d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="main-content p-4">
            <div className="page-header mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-sm btn-light border me-2">
                    <i className="feather-arrow-left"></i>
                </button>
                <h2 className="fs-20 fw-bold d-inline-block">Edit Booking Details</h2>
            </div>

            <div className="card shadow-sm border-0 col-lg-8 mx-auto">
                <div className="card-header bg-white py-3 border-bottom">
                    <h5 className="mb-0">Booking Configuration <span className="text-muted small">#{id.slice(-6).toUpperCase()}</span></h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleUpdate}>
                        <div className="row">
                            {/* Status Section */}
                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-bold small text-uppercase">Order Status</label>
                                <select className="form-select" value={booking.overall_status} 
                                    onChange={e => setBooking({...booking, overall_status: e.target.value})}>
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="On Progress">On Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="form-label fw-bold small text-uppercase">Payment Status</label>
                                <select className="form-select" value={booking.payment_status} 
                                    onChange={e => setBooking({...booking, payment_status: e.target.value})}>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <hr className="my-2" />

                            {/* Address Section */}
                            <div className="col-12 mt-3 mb-3">
                                <h6 className="fw-bold"><i className="feather-map-pin me-2 text-danger"></i>Service Location</h6>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label small">House/Flat No</label>
                                <input type="text" className="form-control" 
                                    value={booking.service_address?.houseDetails || ''}
                                    onChange={e => setBooking({...booking, service_address: {...booking.service_address, houseDetails: e.target.value}})} 
                                />
                            </div>

                            <div className="col-md-8 mb-3">
                                <label className="form-label small">Street / Area</label>
                                <input type="text" className="form-control" 
                                    value={booking.service_address?.street || ''}
                                    onChange={e => setBooking({...booking, service_address: {...booking.service_address, street: e.target.value}})} 
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label small">City</label>
                                <input type="text" className="form-control" 
                                    value={booking.service_address?.city || ''}
                                    onChange={e => setBooking({...booking, service_address: {...booking.service_address, city: e.target.value}})} 
                                />
                            </div>

                            <div className="col-md-6 mb-4">
                                <label className="form-label small">Pincode</label>
                                <input type="text" className="form-control" 
                                    value={booking.service_address?.pincode || ''}
                                    onChange={e => setBooking({...booking, service_address: {...booking.service_address, pincode: e.target.value}})} 
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">Update Booking</button>
                            <button type="button" onClick={() => navigate('/bookings')} className="btn btn-light border px-4">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBooking;