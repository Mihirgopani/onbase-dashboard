import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const BookingDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await api.get(`/bookings/${id}`);
            setData(res.data);
        };
        fetchDetails();
    }, [id]);

    if (!data) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="main-content px-4 mt-4">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header"><h5>Job Tasks (Items in Cart)</h5></div>
                        <div className="card-body p-0">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Service</th>
                                        <th>Schedule</th>
                                        <th>Requirement</th>
                                        <th>Worker Assignment</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.tasks.map((task) => (
                                        <tr key={task._id}>
                                            <td>
                                                <div className="fw-bold">{task.job_id?.name}</div>
                                                <small className="text-muted">{task.category_id?.name}</small>
                                            </td>
                                            <td>
                                                <div>{new Date(task.start_date).toLocaleDateString()}</div>
                                                <small>{task.time_slot.start} - {task.time_slot.end}</small>
                                            </td>
                                            <td>{task.worker_count} Worker(s)</td>
                                            <td>
                                                {task.assigned_workers.length > 0 ? (
                                                    task.assigned_workers.map(w => <span key={w._id} className="badge bg-info me-1">{w.name}</span>)
                                                ) : (
                                                    <button className="btn btn-xs btn-outline-danger">Assign Now</button>
                                                )}
                                            </td>
                                            <td><span className="badge bg-light text-dark text-uppercase">{task.task_status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header"><h5>Client Information</h5></div>
                        <div className="card-body">
                            <h6 className="mb-1">{data.booking.client?.name}</h6>
                            <p className="text-muted small mb-3">{data.booking.client?.email}</p>
                            <label className="small fw-bold text-uppercase">Service Address</label>
                            <p className="small">{data.booking.service_address?.address}</p>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span>Payment Mode:</span>
                                <span className="fw-bold">COD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;