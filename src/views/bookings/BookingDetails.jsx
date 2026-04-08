import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // tracks which item is loading
    const [otpInputs, setOtpInputs] = useState({}); // stores OTP per itemId

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

    // ✅ Check if job date is today
    const isJobDateToday = (jobDate) => {
        if (!jobDate) return false;
        const today = new Date().toISOString().split('T')[0];
        const itemDate = jobDate.split('T')[0];
        return today === itemDate;
    };

    // ✅ Check if job date is expired
    const isJobExpired = (jobDate, status) => {
        if (!jobDate || status === 'finished' || status === 'completed') return false;
        
        // Create a new Date object for the job date and remove the time part
        const jobDateObj = new Date(jobDate);
        jobDateObj.setHours(0, 0, 0, 0); // Reset the time to midnight for comparison
    
        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset the time to midnight for comparison
    
        // Compare job date with today's date
        return jobDateObj < today; // It's expired if the job date is before today
    };

    const getStatusInfo = (item) => {
        const s = item?.status?.toLowerCase();
        const hasStarted = !!item?.started_at;

        if (isJobExpired(item.jobDate, s)) {
            return { label: 'EXPIRED', class: 'bg-soft-danger text-danger' };
        }

        if (s === 'pending') return { label: 'PENDING', class: 'bg-soft-warning text-warning' };
        if (s === 'approved') {
            if (hasStarted) return { label: 'APPROVED', class: 'bg-soft-primary text-primary' };
            return { label: 'APPROVED', class: 'bg-soft-info text-info' };
        }
        if (s === 'reached') {
            if (hasStarted) return { label: 'WORK STARTED', class: 'bg-soft-primary text-primary' };
            return { label: 'WORK STARTED', class: 'bg-soft-info text-info' };
        }
        if (s === 'assigned') return { label: 'ASSIGNED', class: 'bg-soft-info text-info' };
        if (s === 'finished' || s === 'completed') return { label: 'FINISHED', class: 'bg-soft-success text-success' };
        return { label: s?.toUpperCase() || 'UNKNOWN', class: 'bg-soft-secondary text-secondary' };
    };

    // ✅ Approve Job
    const handleApprove = async (item) => {
        if (!item.assigned_worker?._id) return alert("No worker assigned yet.");
        setActionLoading(`approve-${item._id}`);
        try {
            await api.post('/app/worker/approve-job', {
                bookingId: booking._id,
                itemId: item._id,
                workerId: item.assigned_worker._id,
            });
            await fetchDetails();
        } catch (err) {
            alert("Approve failed: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    // ✅ Start Work (requires OTP)
    const handleStartWork = async (item) => {
        const otp = otpInputs[item._id];
        if (!otp || otp.length < 4) return alert("Please enter the 4-digit OTP.");
        setActionLoading(`start-${item._id}`);
        try {
            await api.post('/app/worker/start-work', {
                bookingId: booking._id,
                itemId: item._id,
                workerId: item.assigned_worker._id,
                otp,
            });
            await fetchDetails();
        } catch (err) {
            alert("Start work failed: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    // ✅ End Work
    const handleEndWork = async (item) => {
        if (!window.confirm("Mark this job as finished?")) return;
        setActionLoading(`end-${item._id}`);
        try {
            await api.post('/app/worker/end-work', {
                bookingId: booking._id,
                itemId: item._id,
                workerId: item.assigned_worker._id,
            });
            await fetchDetails();
        } catch (err) {
            alert("End work failed: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    // ✅ Render action button based on item status
    const renderActionButton = (item) => {
        const s = item?.status?.toLowerCase();
        const isTodayJobDate = isJobDateToday(item.jobDate);
        const isExpired = isJobExpired(item.jobDate, s);

        // If expired, show no action button
        if (isExpired) {
            return (
                <span className="badge bg-soft-danger text-danger rounded-pill px-3 py-2">
                    <i className="feather-x-circle me-1"></i>Expired
                </span>
            );
        }

        // Not assigned yet — show Assign Now
        if (!item.assigned_worker) {
            return (
                <button
                    onClick={() => navigate(`/bookings/${booking._id}/assign/${booking.items.indexOf(item)}`)}
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                >
                    Assign Now
                </button>
            );
        }

        // Other actions as usual (approve, start, etc.)
        if (s === 'assigned' && isTodayJobDate) {
            return (
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        maxLength={4}
                        placeholder="Enter OTP"
                        className="form-control form-control-sm"
                        style={{ width: '100px' }}
                        value={otpInputs[item._id] || ''}
                        onChange={e => setOtpInputs(prev => ({ ...prev, [item._id]: e.target.value }))}
                    />
                    <button
                        className="btn btn-sm btn-primary rounded-pill px-3"
                        onClick={() => handleStartWork(item)}
                        disabled={actionLoading === `start-${item._id}`}
                    >
                        {actionLoading === `start-${item._id}`
                            ? <span className="spinner-border spinner-border-sm"></span>
                            : <><i className="feather-map-pin me-1"></i>Mark Arrived</>
                        }
                    </button>
                </div>
            );
        }


        // Reached / Work Started — show End Job
        if (s === 'reached') {
            return (
                <button
                    className="btn btn-sm btn-danger rounded-pill px-3"
                    onClick={() => handleEndWork(item)}
                    disabled={actionLoading === `end-${item._id}`}
                >
                    {actionLoading === `end-${item._id}`
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : <><i className="feather-stop-circle me-1"></i>End Job</>
                    }
                </button>
            );
        }

        // Finished
        if (s === 'finished' || s === 'completed') {
            return (
                <span className="badge bg-soft-success text-success rounded-pill px-3 py-2">
                    <i className="feather-check-circle me-1"></i>Completed
                </span>
            );
        }

        return null;
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
                                        <tr className="small text-uppercase text-muted">
                                            <th className="ps-4">Worker Type</th>
                                            <th>OTP</th>
                                            <th>Job Date</th>
                                            <th>Assignment</th>
                                            <th>Status</th>
                                            <th className="pe-4 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {booking.items?.map((item, index) => {
                                            const statusInfo = getStatusInfo(item);
                                            return (
                                                <tr key={item._id}>
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
                                                                <div
                                                                    className="bg-soft-info text-info rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                                    style={{ width: '24px', height: '24px' }}
                                                                >
                                                                    <i className="feather-user" style={{ fontSize: '12px' }}></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold text-dark small">{item.assigned_worker.name}</div>
                                                                    <div className="text-muted" style={{ fontSize: '11px' }}>
                                                                        {item.assigned_worker.phone_number}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted small">Unassigned</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`badge border-0 rounded-pill ${statusInfo.class}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                        {item.started_at && (
                                                            <div className="text-muted mt-1" style={{ fontSize: '10px' }}>
                                                                Started: {new Date(item.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        )}
                                                    </td>
                                                    {/* ✅ Action Column */}
                                                    <td className="pe-4 text-end">
                                                        {renderActionButton(item)}
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

                {/* Sidebar */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Customer Details</h5>
                        </div>
                        <div className="card-body pt-0">
                            <div className="d-flex align-items-center mb-4">
                                <div
                                    className="bg-soft-primary text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{ width: '45px', height: '45px' }}
                                >
                                    <i className="feather-user fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-dark">{booking.client?.name}</h6>
                                    <p className="text-muted small mb-0">{booking.client?.phone_number}</p>
                                </div>
                            </div>

                            <label className="text-uppercase text-muted small fw-bold mb-2 d-block">Service Site</label>
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