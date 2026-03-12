import React, { useState, useEffect } from 'react';
import { useCSVReader } from 'react-papaparse';
import api from '../../api/axios';

const AllAreas = () => {
    const { CSVReader } = useCSVReader();
    const [areas, setAreas] = useState([]);
    const [cities, setCities] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [manualArea, setManualArea] = useState({ name: '', pincode: '', city: '', latitude: '', longitude: '' });

    useEffect(() => {
        api.get('/locations/cities').then(res => setCities(res.data));
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        const res = await api.get('/locations/areas');
        setAreas(res.data);
    };

    const handleBulkUpload = async (results) => {
        setIsUploading(true);
        try {
            // Mapping CSV headers based on India Post Directory structure
            const formattedData = results.data.slice(1)
                .filter(row => row[4]) // Ensure Pincode exists
                .map(row => ({
                    officename: row[3],
                    pincode: row[4],
                    divisionname: row[2],
                    district: row[7],
                    statename: row[8],
                    latitude: row[9],
                    longitude: row[10]
                }));

            await api.post('/locations/bulk-upload', formattedData);
            alert("Bulk Sync Complete!");
            fetchAreas();
        } catch (err) { alert("Upload failed"); }
        finally { setIsUploading(false); }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        await api.post('/locations/areas', manualArea);
        setManualArea({ name: '', pincode: '', city: '', latitude: '', longitude: '' });
        fetchAreas();
    };

    return (
        <div className="main-content p-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-primary text-white">Bulk Upload India Post CSV</div>
                        <div className="card-body text-center">
                            <CSVReader onUploadAccepted={handleBulkUpload}>
                                {({ getRootProps, acceptedFile }) => (
                                    <div {...getRootProps()} className="border-dashed p-4 rounded bg-light" style={{cursor: 'pointer'}}>
                                        {acceptedFile ? acceptedFile.name : "Drop India Post CSV here"}
                                    </div>
                                )}
                            </CSVReader>
                            {isUploading && <p className="mt-2 small text-primary animate-pulse">Syncing Database...</p>}
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white fw-bold">Manual Area Add</div>
                        <div className="card-body">
                            <form onSubmit={handleManualSubmit}>
                                <input type="text" className="form-control mb-2" placeholder="Area Name" value={manualArea.name} onChange={e => setManualArea({...manualArea, name: e.target.value})} required />
                                <input type="text" className="form-control mb-2" placeholder="Pincode" value={manualArea.pincode} onChange={e => setManualArea({...manualArea, pincode: e.target.value})} required />
                                <select className="form-select mb-2" value={manualArea.city} onChange={e => setManualArea({...manualArea, city: e.target.value})} required>
                                    <option value="">Select City</option>
                                    {cities.map(c => <option key={c._id} value={c._id}>{c.name} ({c.state?.name})</option>)}
                                </select>
                                <div className="row">
                                    <div className="col"><input type="text" className="form-control mb-2" placeholder="Lat" onChange={e => setManualArea({...manualArea, latitude: e.target.value})} /></div>
                                    <div className="col"><input type="text" className="form-control mb-2" placeholder="Lng" onChange={e => setManualArea({...manualArea, longitude: e.target.value})} /></div>
                                </div>
                                <button className="btn btn-dark w-100">Add Area</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white d-flex justify-content-between">
                            <h5 className="mb-0">Area Database</h5>
                            <span className="badge bg-info">{areas.length} Total Areas</span>
                        </div>
                        <div className="table-responsive" style={{maxHeight: '600px'}}>
                            <table className="table table-sm table-hover align-middle">
                                <thead className="table-light sticky-top">
                                    <tr><th>Area</th><th>Pincode</th><th>City</th><th>Coords</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {areas.map(a => (
                                        <tr key={a._id}>
                                            <td>{a.name}</td>
                                            <td><code className="text-primary">{a.pincode}</code></td>
                                            <td>{a.city?.name}</td>
                                            <td className="small text-muted">{a.location.coordinates[1].toFixed(2)}, {a.location.coordinates[0].toFixed(2)}</td>
                                            <td><button onClick={() => api.delete(`/locations/area/${a._id}`).then(fetchAreas)} className="btn btn-link text-danger p-0"><i className="feather-trash"></i></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllAreas;