import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings');
                setBookings(res.data);
            } catch (err) {
                console.error("Error fetching bookings", err);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4 d-flex justify-content-between align-items-center">
                <h2 className="fs-20 fw-bold">All Bookings</h2>
                <Link to="/bookings/add" className="btn btn-primary">
                    <i className="feather-plus me-2"></i>Create New Booking
                </Link>
            </div>

            <div className="p-4">
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Client</th>
                                    <th>Date Created</th>
                                    <th>Total Amt</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td><span className="fw-bold">#{b._id.slice(-6).toUpperCase()}</span></td>
                                        <td>
                                            <div className="fw-medium">{b.client?.name}</div>
                                            <small className="text-muted">{b.client?.phone_number}</small>
                                        </td>
                                        <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                        <td>₹{b.total_amount}</td>
                                        <td>
                                            <span className={`badge ${b.payment_status === 'paid' ? 'bg-soft-success text-success' : 'bg-soft-warning text-warning'}`}>
                                                {b.payment_status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-soft-primary text-primary">{b.overall_status.toUpperCase()}</span>
                                        </td>
                                        <td className="text-end">
                                            <Link to={`/bookings/details/${b._id}`} className="btn btn-sm btn-icon btn-light me-2">
                                                <i className="feather-eye"></i>
                                            </Link>
                                            <Link to={`/bookings/edit/${b._id}`} className="btn btn-sm btn-icon btn-light">
                                                <i className="feather-edit"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllBookings;