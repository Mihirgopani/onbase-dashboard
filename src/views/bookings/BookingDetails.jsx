import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [otpInputs, setOtpInputs] = useState({});

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

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const isJobDateToday = (jobDate) => {
        if (!jobDate) return false;
        const today = new Date().toISOString().split('T')[0];
        const itemDate = jobDate.split('T')[0];
        return today === itemDate;
    };

    const isJobExpired = (jobDate, status) => {
        if (!jobDate || status === 'finished' || status === 'completed') return false;
        const jobDateObj = new Date(jobDate);
        jobDateObj.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return jobDateObj < today;
    };

    const getStatusInfo = (item) => {
        const s = item?.status?.toLowerCase();
        const hasStarted = !!item?.started_at;
        if (isJobExpired(item.jobDate, s)) return { label: 'EXPIRED', class: 'bg-soft-danger text-danger' };
        if (s === 'pending') return { label: 'PENDING', class: 'bg-soft-warning text-warning' };
        if (s === 'approved' || s === 'reached') return { label: hasStarted ? 'WORK STARTED' : 'APPROVED', class: 'bg-soft-primary text-primary' };
        if (s === 'assigned') return { label: 'ASSIGNED', class: 'bg-soft-info text-info' };
        if (s === 'finished' || s === 'completed') return { label: 'FINISHED', class: 'bg-soft-success text-success' };
        return { label: s?.toUpperCase() || 'UNKNOWN', class: 'bg-soft-secondary text-secondary' };
    };

    const handleStartWork = async (item) => {
        const otp = otpInputs[item._id];
        if (!otp || otp.length < 4) return alert("Please enter the 4-digit OTP.");
        setActionLoading(`start-${item._id}`);
        try {
            await api.post('/app/worker/start-work', { bookingId: booking._id, itemId: item._id, workerId: item.assigned_worker._id, otp });
            await fetchDetails();
        } catch (err) {
            alert("Start work failed: " + (err.response?.data?.message || err.message));
        } finally { setActionLoading(null); }
    };

    const handleEndWork = async (item) => {
        if (!window.confirm("Mark this job as finished?")) return;
        setActionLoading(`end-${item._id}`);
        try {
            await api.post('/app/worker/end-work', { bookingId: booking._id, itemId: item._id, workerId: item.assigned_worker._id });
            await fetchDetails();
        } catch (err) {
            alert("End work failed: " + (err.response?.data?.message || err.message));
        } finally { setActionLoading(null); }
    };

    const renderActionButton = (item, index) => {
        const s = item?.status?.toLowerCase();
        const isTodayJobDate = isJobDateToday(item.jobDate);
        const isExpired = isJobExpired(item.jobDate, s);

        if (isExpired) return <span className="badge bg-soft-danger text-danger border-0 rounded-pill px-3 py-2">Expired</span>;
        if (!item.assigned_worker) return <button onClick={() => navigate(`/bookings/${booking._id}/assign/${index}`)} className="btn btn-sm btn-outline-primary rounded-pill px-3">Assign Now</button>;

        if (s === 'assigned' && isTodayJobDate) {
            return (
                <div className="d-flex align-items-center gap-2 justify-content-end">
                    <input type="text" maxLength={4} placeholder="OTP" className="form-control form-control-sm text-center border border-1" style={{ width: '90px', height:'25px' }} value={otpInputs[item._id] || ''} onChange={e => setOtpInputs(prev => ({ ...prev, [item._id]: e.target.value }))} />
                    <button className="btn btn-sm btn-primary rounded-pill px-3 border-0" onClick={() => handleStartWork(item)} disabled={actionLoading === `start-${item._id}`}>
                        {actionLoading === `start-${item._id}` ? <span className="spinner-border spinner-border-sm"></span> : "Mark Arrived"}
                    </button>
                </div>
            );
        }

        if (s === 'reached' || s === 'approved') return <button className="btn btn-sm btn-danger rounded-pill px-3 border-0" onClick={() => handleEndWork(item)} disabled={actionLoading === `end-${item._id}`}>{actionLoading === `end-${item._id}` ? <span className="spinner-border spinner-border-sm"></span> : "End Job"}</button>;
        if (s === 'finished' || s === 'completed') return <span className="badge bg-soft-success text-success border-0 rounded-pill px-3 py-2">Completed</span>;
        return null;
    };

    if (loading) return <div className="main-content d-flex justify-content-center align-items-center" style={{ height: '80vh' }}><div className="spinner-border text-primary"></div></div>;
    if (!booking) return <div className="p-5 text-center text-muted">Booking not found.</div>;

    return (
        <div className="main-content px-4 mt-4">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <button onClick={() => navigate(-1)} className="btn btn-light border-1 btn-sm me-3 rounded-circle" style={{ width: '35px', height: '35px' }}>
                    <i className="feather-arrow-left"></i>
                </button>
                <h4 className="mb-0 fw-bold">Booking Details <span className="text-muted text-uppercase small">#{booking._id?.slice(-6)}</span></h4>
            </div>

            <div className="row">
                {/* 1. CUSTOMER DETAILS (Full Width Top) */}
                <div className="col-12 mb-4">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Customer & Schedule Information</h5>
                        </div>
                        <div className="card-body">
                            <div className="row align-items-center">
                                {/* Customer Info */}
                                <div className="col-md-3 border-end">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-soft-primary text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                                            <i className="feather-user fs-4"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{booking.client?.name}</h6>
                                            <p className="text-muted small mb-0">{booking.client?.phone_number}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Address Info */}
                                <div className="col-md-4 border-end">
                                    <div className="ps-md-3">
                                        <label className="text-uppercase text-muted extra-small fw-bold mb-1 d-block" style={{ fontSize: '10px' }}>Service Address</label>
                                        <p className="small text-dark fw-bold mb-0">{booking.service_address?.houseDetails}</p>
                                        <p className="small text-muted mb-0">{booking.service_address?.street}, {booking.service_address?.city} - {booking.service_address?.pincode}</p>
                                    </div>
                                </div>
                                {/* Schedule Info */}
                                <div className="col-md-3 border-end">
                                    <div className="ps-md-3">
                                        <label className="text-uppercase text-muted extra-small fw-bold mb-1 d-block" style={{ fontSize: '10px' }}>Slot Details</label>
                                        <p className="small text-dark fw-bold mb-0">{booking.slot?.startDate}</p>
                                        <p className="small text-muted mb-0">{booking.slot?.startTime} - {booking.slot?.endTime}</p>
                                    </div>
                                </div>
                                {/* Status & Price */}
                                <div className="col-md-2 text-md-end">
                                    <div className="pe-md-2">
                                        <div className="mb-1">
                                            <span className={`badge text-uppercase border-0 ${getStatusInfo({ status: booking.overall_status }).class}`}>
                                                {booking.overall_status}
                                            </span>
                                        </div>
                                        <h4 className="fw-bold text-primary mb-0">₹{booking.total_amount?.toLocaleString()}</h4>
                                        <small className="text-muted" style={{ fontSize: '10px' }}>Grand Total</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SERVICE ITEMS (Full Width Bottom) */}
                <div className="col-12">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Service Items</h5>
                            <span className="badge bg-light text-dark border fw-normal">{booking.items?.length} Tasks</span>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive ">
                                <table className="table align-middle mb-0 w-100 pb-4">
                                    <thead className="table-light">
                                        <tr className="small text-uppercase text-muted">
                                            <th className="ps-4">Worker Type</th>
                                            <th>OTP</th>
                                            <th>Job Date</th>
                                            <th>Assignment Details</th>
                                            <th>Status</th>
                                            <th className="pe-4 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='pb-5'> 
                                        {booking.items?.map((item, index) => {
                                            const statusInfo = getStatusInfo(item);
                                            return (
                                                <tr key={item._id}>
                                                    <td className="ps-4 py-4">
                                                        <div className="fw-bold text-dark fs-6">{item.worker_type}</div>
                                                        <small className="text-muted">Rate: ₹{item.price_per_unit} | Duration: {item.hours}hr(s)</small>
                                                    </td>
                                                    <td>
                                                        <code className="bg-light p-2 rounded text-primary fw-bold border-0" style={{ letterSpacing: '1px' }}>
                                                            {item.otp || 'N/A'}
                                                        </code>
                                                    </td>
                                                    <td>
                                                        <div className="text-dark fw-semibold">{item.jobDate?.split('T')[0] || 'N/A'}</div>
                                                    </td>
                                                    <td>
                                                        {item.assigned_worker ? (
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-soft-info text-info rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                                                    <i className="feather-user"></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold text-dark small">{item.assigned_worker.name}</div>
                                                                    <div className="text-muted" style={{ fontSize: '11px' }}>{item.assigned_worker.phone_number}</div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="badge bg-light text-muted fw-normal">Unassigned</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`badge border-0 rounded-pill px-3 py-2 ${statusInfo.class}`} style={{ fontSize: '11px' }}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="pe-4 text-end">
                                                        <div style={{ minWidth: '150px' }}>
                                                            {renderActionButton(item, index)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;