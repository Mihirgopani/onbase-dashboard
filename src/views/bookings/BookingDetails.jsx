import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/bookings/${id}`);
                setData(res.data);
            } catch (err) {
                console.error("Error fetching details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="main-content d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (!data) return <div className="p-5 text-center">Booking not found.</div>;

    // Helper to get status badge colors
    const getStatusBadge = (status) => {
        const colors = {
            'pending': 'bg-soft-warning text-warning',
            'paid': 'bg-soft-success text-success',
            'assigned': 'bg-soft-info text-info',
            'completed': 'bg-soft-success text-success'
        };
        return colors[status?.toLowerCase()] || 'bg-soft-secondary text-secondary';
    };

    return (
        <div className="main-content px-4 mt-4">
            <div className="d-flex align-items-center mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-light border btn-sm me-3">
                    <i className="feather-arrow-left"></i>
                </button>
                <h4 className="mb-0 fw-bold">Booking Details <span className="text-muted">#{data._id?.slice(-6).toUpperCase()}</span></h4>
            </div>

            <div className="row">
                {/* Left Side: Items list */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Service Items</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4">Worker Type</th>
                                            <th>Hours</th>
                                            <th>OTP</th>
                                            <th>Assignment</th>
                                            <th className="pe-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items?.map((item) => (
                                            <tr key={item._id}>
                                                <td className="ps-4">
                                                    <div className="fw-bold text-dark">{item.worker_type}</div>
                                                    <small className="text-muted">Rate: ₹{item.price_per_unit}/unit</small>
                                                </td>
                                                <td>{item.hours} hrs</td>
                                                <td><code className="text-primary fw-bold">{item.otp}</code></td>
                                                <td>
                                                    {item.assigned_worker ? (
                                                        <span className="badge bg-soft-info text-info border">
                                                            <i className="feather-user me-1"></i>{item.assigned_worker.name}
                                                        </span>
                                                    ) : (
                                                        <button className="btn btn-xs btn-outline-danger rounded-pill">Assign Now</button>
                                                    )}
                                                </td>
                                                <td className="pe-4">
                                                    <span className={`badge text-uppercase ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Address & Summary */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Customer & Address</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="avatar bg-soft-primary text-primary rounded-circle p-2 me-3">
                                    <i className="feather-user"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">{data.service_address?.name}</h6>
                                    <p className="text-muted small mb-0">+91 {data.service_address?.phone}</p>
                                </div>
                            </div>
                            
                            <div className="bg-light p-3 rounded-3 mb-3">
                                <label className="small fw-bold text-uppercase text-muted mb-1 d-block">Service Address</label>
                                <p className="small text-dark mb-1">
                                    <strong>{data.service_address?.houseDetails}</strong>, {data.service_address?.street}
                                </p>
                                <p className="small text-dark mb-0">
                                    {data.service_address?.city} - {data.service_address?.pincode}
                                </p>
                            </div>

                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Schedule:</span>
                                    <span className="fw-bold text-dark">{data.slot?.date}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Time:</span>
                                    <span className="small">{data.slot?.startTime}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Payment:</span>
                                    <span className={`badge ${getStatusBadge(data.payment_status)}`}>
                                        {data.payment_status?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="fs-5 fw-bold">Total Amount:</span>
                                    <span className="fs-5 fw-bold text-primary">₹{data.total_amount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;