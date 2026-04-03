import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`/bookings/${id}`);
                setBooking(res.data.data);
            } catch (err) {
                console.error("Error fetching details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    /**
     * Maps database status and timestamps to human-readable statuses:
     * Pending, Assigned, Approved, Work Started, Finished
     */
    const getStatusInfo = (item) => {
        const s = item?.status?.toLowerCase();
        const hasStarted = !!item?.started_at;

        if (s === 'pending') {
            return { label: 'PENDING', class: 'bg-soft-warning text-warning' };
        }

        if (s === 'approved') {
            if (hasStarted) {
                return { label: 'APPROVED', class: 'bg-soft-primary text-primary' };
            }
            return { label: 'APPROVED', class: 'bg-soft-info text-info' };
        }

        if (s === 'reached') {
            if (hasStarted) {
                return { label: 'WORK STARTED', class: 'bg-soft-primary text-primary' };
            }
            return { label: 'WORK STARTED', class: 'bg-soft-info text-info' };
        }

        if (s === 'assigned') {
            return { label: 'ASSIGNED', class: 'bg-soft-info text-info' };
        }

        if (s === 'finished' || s === 'completed') {
            return { label: 'FINISHED', class: 'bg-soft-success text-success' };
        }

        return { label: s?.toUpperCase() || 'UNKNOWN', class: 'bg-soft-secondary text-secondary' };
    };

    if (loading) return (
        <div className="main-content d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (!booking) return <div className="p-5 text-center text-muted">Booking not found.</div>;

    return (
        <div className="main-content px-4 mt-4">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-light border btn-sm me-3">
                    <i className="feather-arrow-left"></i>
                </button>
                <h4 className="mb-0 fw-bold">
                    Booking Details <span className="text-muted text-uppercase">#{booking._id?.slice(-6)}</span>
                </h4>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    {/* Service Items Card */}
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Service Items</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead className="table-light">
                                        <tr className="small text-uppercase text-muted tracking-wider">
                                            <th className="ps-4">Worker Type</th>
                                            <th>OTP</th>
                                            <th>Job Date</th>
                                            <th>Assignment</th>
                                            {/* <th>Booking Date</th> */}
                                            <th className="pe-4 text-end">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {booking.items?.map((item, index) => {
                                            const statusInfo = getStatusInfo(item);
                                            return (
                                                <tr key={item._id} className='py-5'>
                                                    <td className="ps-4 py-3">
                                                        <div className="fw-bold text-dark">{item.worker_type}</div>
                                                        <small className="text-muted">₹{item.price_per_unit} / {item.hours}hr(s)</small>
                                                    </td>
                                                    <td>
                                                        <code className="bg-light p-1 rounded text-primary fw-bold px-2">
                                                            {item.otp || 'N/A'}
                                                        </code>
                                                    </td>
                                                    <td>
                                                        <code className="p-1 rounded text-dark fw-bold px-2">
                                                            {item.jobDate ? item.jobDate.split('T')[0] : 'N/A'}
                                                        </code>
                                                    </td>
                                                    <td>
                                                        {item.assigned_worker ? (
                                                            <div className="d-flex align-items-center">
                                                                <div className="avatar-xs bg-soft-info text-info rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                                                                    <i className="feather-user" style={{ fontSize: '12px' }}></i>
                                                                </div>
                                                                <span className="fw-semibold text-dark">
                                                                    {item.assigned_worker.name}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => navigate(`/bookings/${booking._id}/assign/${index}`)}
                                                                className="btn btn-md btn-outline-primary px-3 rounded-pill"
                                                                style={{
                                                                    border: "1px solid"
                                                                }}
                                                            >
                                                                Assign Now
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="pe-4 text-end">
                                                        <span className={`badge border-0 rounded-pill ${statusInfo.class}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                        {item.started_at && (
                                                            <div className="text-muted mt-1" style={{ fontSize: '10px' }}>
                                                                Started: {new Date(item.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Worker Contact Info */}
                    {booking.items?.find(i => i.assigned_worker) && (
                        <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="bg-soft-warning p-3 rounded-3 me-3">
                                        <i className="feather-phone text-warning"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">Primary Worker Contact</h6>
                                        <p className="text-muted small mb-0">
                                            +91 {booking.items.find(i => i.assigned_worker)?.assigned_worker.phone_number}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <span className="badge bg-soft-success text-success rounded-pill">
                                        Active Assignment
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Customer & Slot Details */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Customer Details</h5>
                        </div>
                        <div className="card-body pt-0">
                            <div className="d-flex align-items-center mb-4">
                                <div className="avatar-md bg-soft-primary text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px' }}>
                                    <i className="feather-user fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-dark">{booking.client?.name}</h6>
                                    <p className="text-muted small mb-0">{booking.client?.phone_number}</p>
                                </div>
                            </div>

                            <label className="text-uppercase text-muted small fw-bold mb-2 d-block tracking-wider">Service Site</label>
                            <div className="bg-light p-3 rounded-3 mb-4">
                                <p className="small text-dark fw-bold mb-1">{booking.service_address?.houseDetails}</p>
                                <p className="small text-muted mb-0">
                                    {booking.service_address?.street}, {booking.service_address?.city} - {booking.service_address?.pincode}
                                </p>
                            </div>

                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Date:</span>
                                    <span className="fw-bold text-dark small">{booking.slot?.startDate}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted small">Window:</span>
                                    <span className="small text-dark">{booking.slot?.startTime} - {booking.slot?.endTime}</span>
                                </div>
                                <div className="d-flex justify-content-between mt-3 mb-2">
                                    <span className="text-muted small">Booking Status:</span>
                                    <span className={`badge text-uppercase ${getStatusInfo({ status: booking.overall_status }).class}`}>
                                        {booking.overall_status}
                                    </span>
                                </div>
                                <hr className="my-3 text-muted opacity-25" />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-dark">Grand Total</span>
                                    <span className="fs-5 fw-bold text-primary">₹{booking.total_amount?.toLocaleString()}</span>
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