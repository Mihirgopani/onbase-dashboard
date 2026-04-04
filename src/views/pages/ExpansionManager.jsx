import React, { useState, useCallback } from 'react';
import api from '../../api/axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { debounce } from 'lodash';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to move map view
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 14);
    return null;
}

const ExpansionManager = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activatingId, setActivatingId] = useState(null);
    const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]); // Ahmedabad default
    const [selectedLocation, setSelectedLocation] = useState(null);

    // 1. Search Logic using OpenStreetMap (Nominatim)
    const searchOSM = async (query) => {
        if (!query || query.length < 3) return;
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=in` // Restricted to India for better accuracy
            );
            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error("OSM Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((query) => searchOSM(query), 600),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSelectLocation = (item) => {
        const coords = [parseFloat(item.lat), parseFloat(item.lon)];
        setMapCenter(coords);
        setSelectedLocation(item);
    };

    // const handleActivate = async (item, index) => {
    //     setActivatingId(index);
    
    //     // 1. Map OSM data to your Backend's expected flat keys
    //     // Your controller expects: statename, district, officename, pincode, latitude, longitude
    //     const payload = {
    //         statename: item.address.state || "Unknown State",
    //         district: item.address.city || item.address.town || item.address.district || "Unknown District",
    //         officename: item.address.suburb || item.address.neighbourhood || item.address.road || item.name || "Unknown Area",
    //         pincode: item.address.postcode || "000000",
            
    //         // Send as strings or numbers; your backend uses parseFloat() on these keys specifically
    //         latitude: item.lat, 
    //         longitude: item.lon
    //     };
    
    //     console.log("Sending Payload to Backend:", payload);
    
    //     try {
    //         // 2. Call your existing endpoint
    //         const res = await api.post('/locations/activate', payload);
            
    //         alert(res.data.message || "Area activated successfully!");
            
    //         // Remove from list and reset map selection
    //         setResults(prev => prev.filter((_, i) => i !== index));
    //         setSelectedLocation(null);
    //     } catch (err) {
    //         console.error("Activation Error:", err.response?.data);
            
    //         // Handle the "Area already active" 400 error from your controller
    //         const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error activating area";
    //         alert(errorMessage);
    //     } finally {
    //         setActivatingId(null);
    //     }
    // };

    const handleActivate = async (item, index) => {
        setActivatingId(index);
    
        try {
            let itemToSend = { ...item };
    
            // Ensure address exists
            if (!itemToSend.address) itemToSend.address = {};
    
            // Map postcode to pincode if pincode doesn't exist
            if (!itemToSend.address.pincode) {
                if (itemToSend.address.postcode) {
                    itemToSend.address.pincode = itemToSend.address.postcode;
                } else {
                    // Ask user manually if postcode is also missing
                    const manualPincode = prompt(
                        `Pincode not found for ${item.display_name}. Please enter pincode manually:`
                    );
    
                    if (!manualPincode || !/^\d{5,6}$/.test(manualPincode.trim())) {
                        alert("Invalid pincode entered. Activation cancelled.");
                        setActivatingId(null);
                        return;
                    }
    
                    itemToSend.address.pincode = manualPincode.trim();
                }
            }
    
            console.log("Sending Item to Backend:", itemToSend);
    
            const res = await api.post('/locations/activate', itemToSend);
    
            alert("Area Activated!");
    
            setResults(prev => prev.filter((_, i) => i !== index));
            setSelectedLocation(null);
        } catch (err) {
            console.error("Backend Error:", err.response?.data);
            alert(err.response?.data?.message || "Error activating area");
        } finally {
            setActivatingId(null);
        }
    };

    return (
        <div className="main-content p-4">
            <div className="mb-4">
                <h2 className="fw-bold">Service Expansion</h2>
                <p className="text-muted">Locate areas on the map and activate them for OnBase services.</p>
            </div>

            <div className="row">
                {/* Left Side: Search and Results */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="feather-search text-muted"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Search Area, City or Pincode..."
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="list-group list-group-flush">
                            {loading && (
                                <div className="p-4 text-center">
                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                </div>
                            )}
                            
                            {results.length === 0 && !loading && (
                                <div className="p-4 text-center text-muted">No results. Start typing to search...</div>
                            )}

                            {results.map((item, index) => (
                                <div 
                                    key={index} 
                                    className={`list-group-item p-3 ${selectedLocation === item ? 'bg-light' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleSelectLocation(item)}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div style={{ flex: 1 }}>
                                            <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                                                {item.address.suburb || item.name}
                                            </div>
                                            <div className="text-muted small mb-2">{item.display_name}</div>
                                            <span className="badge bg-light text-primary border">{item.address.postcode || 'No Pincode'}</span>
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-success px-3 shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActivate(item, index);
                                            }}
                                            disabled={activatingId === index}
                                        >
                                            {activatingId === index ? '...' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Map View */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 overflow-hidden" style={{ height: '600px', position: 'sticky', top: '20px' }}>
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <ChangeView center={mapCenter} />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            {selectedLocation && (
                                <Marker position={[parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)]}>
                                    <Popup>
                                        <strong>{selectedLocation.name}</strong><br/>
                                        {selectedLocation.address.city}
                                    </Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpansionManager;