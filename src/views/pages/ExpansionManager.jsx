import React, { useState, useCallback, useEffect } from 'react';
import api from '../../api/axios';
import { debounce } from 'lodash';

const ExpansionManager = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('all'); // State for dropdown
    const [csvResults, setCsvResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activatingId, setActivatingId] = useState(null);

    // Load initial preview data
    useEffect(() => {
        fetchData('', 'all');
    }, []);

    const fetchData = async (query, field) => {
        setLoading(true);
        try {
            const res = await api.get(`/locations/search-master?query=${query}&field=${field}`);
            setCsvResults(res.data);
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((query, field) => fetchData(query, field), 500),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value, searchField);
    };

    const handleFieldChange = (e) => {
        const field = e.target.value;
        setSearchField(field);
        fetchData(searchTerm, field); // Immediate refresh when changing category
    };

    const handleActivate = async (item, index) => {
        setActivatingId(index);
        try {
            const res = await api.post('/locations/activate', item);
            alert(res.data.message || "Area is now live!");
            setCsvResults(prev => prev.filter((_, i) => i !== index));
        } catch (err) {
            alert(err.response?.data?.message || "Error activating area");
        } finally {
            setActivatingId(null);
        }
    };

    return (
        <div className="main-content p-4">
            <div className="mb-4">
                <h2 className="fw-bold">Service Expansion</h2>
                <p className="text-muted">Search and activate new serviceable areas by specific filters.</p>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="input-group">
                        {/* Dropdown for Search Field */}
                        <select 
                            className="form-select border-end-0 flex-grow-0" 
                            style={{ width: '150px' }}
                            value={searchField}
                            onChange={handleFieldChange}
                        >
                            <option value="all">Search All</option>
                            <option value="officename">Area Name</option>
                            <option value="pincode">Pincode</option>
                            <option value="district">City / District</option>
                            <option value="statename">State</option>
                        </select>

                        <span className="input-group-text bg-white border-start-0 border-end-0">
                            <i className="feather-search text-muted"></i>
                        </span>
                        
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder={`Search in ${searchField}...`}
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table align-middle table-hover mb-0">
                        <thead className="bg-light text-uppercase">
                            <tr style={{ fontSize: '11px' }}>
                                <th>Office Name</th>
                                <th>Pincode</th>
                                <th>District & State</th>
                                <th className="text-end px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                        Processing Master Data...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {csvResults.length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-4 text-muted">No records found. Try changing the filter.</td></tr>
                                    )}
                                    {csvResults.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="fw-bold">{item.officename}</div>
                                                <small className="text-muted text-uppercase" style={{ fontSize: '10px' }}>{item.officetype}</small>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-primary border">{item.pincode}</span>
                                            </td>
                                            <td>
                                                <div className="fw-medium">{item.district}</div>
                                                <small className="text-muted">{item.statename}</small>
                                            </td>
                                            <td className="text-end px-4">
                                                <button 
                                                    className="btn btn-sm btn-success px-3 shadow-sm"
                                                    onClick={() => handleActivate(item, index)}
                                                    disabled={activatingId === index}
                                                >
                                                    {activatingId === index ? 'Activating...' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpansionManager;