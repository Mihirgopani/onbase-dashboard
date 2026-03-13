import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const UpdateCategoryBanner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await api.get(`/job-categories/${id}`);
                setCategory(res.data);
                if (res.data.bannerImage) {
                    setPreviewUrl(`http://localhost:5001${res.data.bannerImage}`);
                }
            } catch (err) {
                console.error("Error loading category", err);
            }
        };
        fetchCategory();
    }, [id]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create a local preview URL
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return alert("Please select an image file first.");

        setUploading(true);
        const formData = new FormData();
        formData.append('banner', selectedFile); // 'banner' must match your Multer upload.single('banner')

        try {
            await api.put(`/job-categories/${id}/banner`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Banner updated successfully!");
            navigate('/job-categories/banners');
        } catch (err) {
            console.error("Upload error", err);
            alert("Failed to upload image. Please check backend configuration.");
        } finally {
            setUploading(false);
        }
    };

    if (!category) return <div className="p-5 text-center">Loading category details...</div>;

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4 d-flex align-items-center">
                <button onClick={() => navigate(-1)} className="btn btn-light border btn-sm me-3">
                    <i className="feather-arrow-left"></i>
                </button>
                <h2 className="fs-20 fw-bold mb-0">Update Banner</h2>
            </div>

            <div className="p-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="mb-0 fw-bold text-primary">{category.name}</h5>
                            </div>
                            <div className="card-body p-4 text-center">
                                <div className="mb-4">
                                    <label className="form-label d-block fw-bold text-muted small text-uppercase">Banner Preview</label>
                                    <div className="rounded-4 overflow-hidden border bg-light shadow-inner mx-auto" style={{ maxWidth: '100%', height: '250px' }}>
                                        {previewUrl ? (
                                            <img src={previewUrl} className="w-100 h-100 object-fit-cover" alt="Banner Preview" />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                                No image selected
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                                    <input 
                                        type="file" 
                                        className="form-control form-control-lg" 
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                    <small className="text-muted d-block mt-2 text-start">
                                        <i className="feather-info me-1"></i> Recommended size: 1200x400px (PNG, JPG)
                                    </small>
                                </div>

                                <div className="d-flex justify-content-center gap-3 mt-5">
                                    <button 
                                        className="btn btn-light border px-4 py-2" 
                                        onClick={() => navigate(-1)}
                                        disabled={uploading}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn btn-primary px-5 py-2 fw-bold" 
                                        onClick={handleUpload}
                                        disabled={uploading || !selectedFile}
                                    >
                                        {uploading ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Uploading...</>
                                        ) : (
                                            <><i className="feather-upload-cloud me-2"></i>Save Banner</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCategoryBanner;