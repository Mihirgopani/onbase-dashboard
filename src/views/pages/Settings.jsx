import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const SettingsPage = () => {
    const [categories, setCategories] = useState([]);
    const [autoAssignMap, setAutoAssignMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/settings');
            setCategories(res.data.categories);
            setAutoAssignMap(res.data.settings || {});
        } catch (err) {
            console.error("Error loading settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (categoryId) => {
        const currentValue = autoAssignMap[categoryId] || false;
        const newValue = !currentValue;

        // Optimistic Update
        setAutoAssignMap({ ...autoAssignMap, [categoryId]: newValue });

        try {
            await api.put('/settings/toggle', { categoryId, value: newValue });
        } catch (err) {
            alert("Update failed");
            fetchData(); // Revert
        }
    };

    if (loading) return <div className="p-5 text-center">Synchronizing Categories...</div>;

    return (
        <div className="main-content p-4">
            <div className="mb-4">
                <h2 className="fw-bold">Auto-Assignment Configuration</h2>
                <p className="text-muted">Enable or disable automatic worker dispatching per job category.</p>
            </div>

            <div className="card shadow-sm border-0 col-md-8">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0">Job Categories</h5>
                </div>
                <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                        {categories.map((cat) => (
                            <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center py-3 px-4">
                                <div>
                                    <h6 className="mb-0 fw-bold">{cat.name}</h6>
                                    <small className={autoAssignMap[cat._id] ? "text-success" : "text-muted"}>
                                        {autoAssignMap[cat._id] ? "Auto-Assign Active" : "Manual Assignment Only"}
                                    </small>
                                </div>
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input fs-4" 
                                        type="checkbox" 
                                        checked={autoAssignMap[cat._id] || false} 
                                        onChange={() => handleToggle(cat._id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;