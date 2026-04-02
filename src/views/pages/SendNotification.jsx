import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SendNotification = () => {
    const [formData, setFormData] = useState({
        targetRole: 'worker', 
        recipientType: 'all', 
        userId: '',
        title: '',
        description: ''
    });
    const [userList, setUserList] = useState([]); // Initialized as array
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (formData.recipientType === 'specific') {
            const fetchUsers = async () => {
                try {
                    // Construct full URL using env variable
                    const baseUrl = import.meta.env.VITE_API_BASE_URL;
                    const res = await axios.get(`${baseUrl}/notifications/users?role=${formData.targetRole}`);
                    
                    const data = Array.isArray(res.data) ? res.data : (res.data.users || []);
                    setUserList(data);
                } catch (err) {
                    console.error("Fetch error:", err);
                    toast.error("Could not load user list");
                    setUserList([]);
                }
            };
            fetchUsers();
        }
    }, [formData.targetRole, formData.recipientType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Construct full URL using env variable
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.post(`${baseUrl}/notifications/send`, formData);
            
            toast.success(res.data.message || "Notification sent!");
            setFormData({ ...formData, title: '', description: '', userId: '' });
        } catch (err) {
            console.error("Submit error:", err);
            toast.error(err.response?.data?.message || "Failed to send");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Push Notification Manager</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Target Audience</label>
                                <select className="form-select" 
                                    value={formData.targetRole}
                                    onChange={(e) => setFormData({...formData, targetRole: e.target.value, userId: ''})}>
                                    <option value="worker">Workers</option>
                                    <option value="client">Clients</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Send Option</label>
                                <select className="form-select"
                                    value={formData.recipientType}
                                    onChange={(e) => setFormData({...formData, recipientType: e.target.value, userId: ''})}>
                                    <option value="all">Broadcast to All</option>
                                    <option value="specific">Select Specific User</option>
                                </select>
                            </div>
                        </div>

                        {formData.recipientType === 'specific' && (
                            <div className="mb-4">
                                <label className="form-label fw-bold">Select Recipient</label>
                                <select className="form-select" required
                                    value={formData.userId}
                                    onChange={(e) => setFormData({...formData, userId: e.target.value})}>
                                    <option value="">-- Choose User ({userList.length} available) --</option>
                                    {/* Safety check: ensure userList is an array before mapping */}
                                    {Array.isArray(userList) && userList.map(u => (
                                        <option key={u._id} value={u._id}>
                                            {u.first_name || u.phone_number} {u.last_name || ''} ({u.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label fw-bold">Notification Title</label>
                            <input type="text" className="form-control" placeholder="Enter catchy title..." required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})} />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">Message Body</label>
                            <textarea className="form-control" rows="4" placeholder="Type your marketing message here..." required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-dark px-5 py-2" disabled={loading}>
                                {loading ? "Processing..." : "Send Now"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SendNotification;