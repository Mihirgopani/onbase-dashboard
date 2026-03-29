import React, { useState } from 'react';
import api from '../../api/axios';

const DumpData = () => {
    const [loading, setLoading] = useState(false);

    const handleDump = async (type) => {
        const confirmMsg = `Are you sure you want to seed/dump the ${type.toUpperCase()} collection? This may create duplicate records if not handled by the backend.`;
        
        if (window.confirm(confirmMsg)) {
            setLoading(true);
            try {
                const res = await api.post(`/admin/dump/${type}`);
                alert(res.data.message || "Action Successful");
            } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDumpAll = async () => {
        const sequence = [
            'states', 'cities', 'areas', 
            'categories', 'jobs', 'settings', 
            'admins', 'workers', 'clients', 
            'faqs'
        ];
        
        if (window.confirm("This will run the entire master seed sequence in order. Continue?")) {
            setLoading(true);
            try {
                for (const item of sequence) {
                    await api.post(`/admin/dump/${item}`);
                }
                alert("Global Data Dump Completed Successfully!");
            } catch (err) {
                alert("Sequence interrupted: " + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="main-content p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-danger">Database Maintenance</h2>
                    <p className="text-muted">Generate seed data for all system models.</p>
                </div>
                <button 
                    className="btn btn-danger shadow-sm px-4" 
                    onClick={handleDumpAll}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : '🚀 Master Dump All Data'}
                </button>
            </div>

            <div className="row">
                {/* 1. Location Card */}
                <div className="col-md-6 mb-4">
                    <DumpCard 
                        title="Geography" 
                        icon="feather-map-pin"
                        items={[
                            { label: 'States', type: 'states', desc: 'State collection' },
                            { label: 'Cities', type: 'cities', desc: 'City collection' },
                            { label: 'Areas', type: 'areas', desc: 'Area & Pincode collection' },
                        ]}
                        onDump={handleDump}
                        loading={loading}
                    />
                </div>

                {/* 2. User Roles Card */}
                <div className="col-md-6 mb-4">
                    <DumpCard 
                        title="Users & Accounts" 
                        icon="feather-users"
                        items={[
                            { label: 'Admins', type: 'admins', desc: 'System administrators' },
                            { label: 'Workers', type: 'workers', desc: 'Service provider accounts' },
                            { label: 'Clients', type: 'clients', desc: 'End-user accounts' },
                        ]}
                        onDump={handleDump}
                        loading={loading}
                    />
                </div>

                {/* 3. Services Card */}
                <div className="col-md-6 mb-4">
                    <DumpCard 
                        title="Service Logic" 
                        icon="feather-briefcase"
                        items={[
                            { label: 'Job Categories', type: 'categories', desc: 'Construction, Help, etc.' },
                            { label: 'Jobs', type: 'jobs', desc: 'Specific job roles' },
                            { label: 'Settings', type: 'settings', desc: 'Global configurations' },
                            { label: 'FAQs', type: 'faqs', desc: 'Help & support content' },
                        ]}
                        onDump={handleDump}
                        loading={loading}
                    />
                </div>

                {/* 4. Operations Card */}
                <div className="col-md-6 mb-4">
                    <DumpCard 
                        title="Operations & Tasks" 
                        icon="feather-activity"
                        items={[
                            { label: 'Bookings', type: 'bookings', desc: 'Customer service requests' },
                            { label: 'Assignments', type: 'assignments', desc: 'Worker allocations' },
                            { label: 'Job Tasks', type: 'jobtasks', desc: 'Specific task breakdowns' },
                            { label: 'Worker Slots', type: 'slots', desc: 'Availability schedules' },
                        ]}
                        onDump={handleDump}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

const DumpCard = ({ title, icon, items, onDump, loading }) => (
    <div className="card shadow-sm border-0 h-100">
        <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
                <div className="bg-light-primary p-2 rounded-circle me-3">
                    <i className={`${icon} text-primary fs-4`}></i>
                </div>
                <h5 className="mb-0 fw-bold">{title}</h5>
            </div>

            <div className="table-responsive">
                <table className="table align-middle">
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    <h6 className="mb-0 fw-bold">{item.label}</h6>
                                    <small className="text-muted">{item.desc}</small>
                                </td>
                                <td className="text-end">
                                    <button 
                                        className="btn btn-sm btn-outline-primary" 
                                        onClick={() => onDump(item.type)}
                                        disabled={loading}
                                    >
                                        Dump {item.label}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default DumpData;