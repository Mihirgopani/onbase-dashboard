import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(Array.isArray(res.data) ? res.data : res.data.bookings || []);
        } catch (err) {
            console.error("Error fetching bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
            try {
                await api.delete(`/bookings/${id}`);
                // Filter out the deleted booking from UI instead of reloading everything
                setBookings(bookings.filter(b => b._id !== id));
                alert("Booking deleted successfully");
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete booking");
            }
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-soft-success text-success';
            case 'pending': return 'bg-soft-warning text-warning';
            case 'cancelled': return 'bg-soft-danger text-danger';
            default: return 'bg-soft-primary text-primary';
        }
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fs-20 fw-bold mb-0">All Bookings</h2>
                    <p className="text-muted small mb-0">Manage and track all service requests</p>
                </div>
                <Link to="/bookings/add" className="btn btn-primary d-flex align-items-center">
                    <i className="feather-plus me-2"></i> Create New Booking
                </Link>
            </div>

            <div className="p-4">
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Booking ID</th>
                                    <th>Client Details</th>
                                    <th>Service Date</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                            Loading bookings...
                                        </td>
                                    </tr>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">No bookings found.</td>
                                    </tr>
                                ) : (
                                    bookings.map((b) => (
                                        <tr key={b._id}>
                                            <td className="ps-4">
                                                <span className="fw-bold text-dark">
                                                    #{b._id?.slice(-6).toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{b.service_address?.name || 'Unknown'}</div>
                                                <small className="text-muted">{b.service_address?.phone || 'No Phone'}</small>
                                            </td>
                                            <td>
                                                <div>{b.slot?.date}</div>
                                                <small className="text-muted">{b.slot?.startTime}</small>
                                            </td>
                                            <td><span className="fw-bold">₹{b.total_amount?.toLocaleString()}</span></td>
                                            <td>
                                                <span className={`badge rounded-pill ${b.payment_status === 'paid' ? 'bg-soft-success text-success' : 'bg-soft-warning text-warning'}`}>
                                                    {b.payment_status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusClass(b.overall_status)}`}>
                                                    {b.overall_status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group">
                                                    <Link to={`/bookings/details/${b._id}`} className="btn btn-sm btn-light border" title="View Details">
                                                        <i className="feather-eye text-primary"></i>
                                                    </Link>
                                                    <Link to={`/bookings/edit/${b._id}`} className="btn btn-sm btn-light border" title="Edit">
                                                        <i className="feather-edit text-info"></i>
                                                    </Link>
                                                    {/* DELETE BUTTON */}
                                                    <button 
                                                        onClick={() => handleDelete(b._id)} 
                                                        className="btn btn-sm btn-light border" 
                                                        title="Delete Booking"
                                                    >
                                                        <i className="feather-trash-2 text-danger"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllBookings;