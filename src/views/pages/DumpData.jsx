import React, { useState } from 'react';
import api from '../../api/axios';

const DumpData = () => {
    const [loading, setLoading] = useState(false);

    const handleDump = async (type) => {
        const confirmMsg = `Are you absolutely sure? This will permanently delete ALL ${type.toUpperCase()} records from the database. This cannot be undone.`;
        
        if (window.confirm(confirmMsg)) {
            setLoading(true);
            try {
                const res = await api.delete(`/locations/dump/${type}`);
                alert(res.data.message);
            } catch (err) {
                alert("Error dumping data: " + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="main-content p-4">
            <div className="mb-4">
                <h2 className="fw-bold text-danger">Database Maintenance (Danger Zone)</h2>
                <p className="text-muted">Use these tools to clear location data during the pilot testing phase.</p>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 border-start border-danger border-4">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-light-danger p-3 rounded-circle me-3">
                                    <i className="feather-trash-2 text-danger fs-3"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1 fw-bold">Wipe Location Collections</h5>
                                    <p className="small text-muted mb-0">Select a collection to truncate. Note: This will break existing worker/booking links if those records rely on these IDs.</p>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 fw-bold">States Collection</h6>
                                                <small className="text-muted">Removes all state names.</small>
                                            </td>
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-outline-danger btn-sm" 
                                                    onClick={() => handleDump('states')}
                                                    disabled={loading}
                                                >
                                                    Dump All States
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 fw-bold">Cities Collection</h6>
                                                <small className="text-muted">Removes all cities and their links to states.</small>
                                            </td>
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-outline-danger btn-sm" 
                                                    onClick={() => handleDump('cities')}
                                                    disabled={loading}
                                                >
                                                    Dump All Cities
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="mb-0 fw-bold">Areas & Pincodes Collection</h6>
                                                <small className="text-muted">Removes all 150,000+ pincodes and geo-coordinates.</small>
                                            </td>
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-outline-danger btn-sm" 
                                                    onClick={() => handleDump('areas')}
                                                    disabled={loading}
                                                >
                                                    Dump All Areas
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-soft-warning mt-4 border-0">
                        <h6 className="fw-bold"><i className="feather-info me-2"></i>Recommendation</h6>
                        <p className="small mb-0">
                            If you are re-uploading the India Post CSV, it is best to <strong>Dump Areas</strong> first to ensure a clean slate, though our "Bulk Upload" logic already handles updates automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DumpData;