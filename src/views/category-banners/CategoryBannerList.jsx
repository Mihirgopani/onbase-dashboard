import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const CategoryBannerList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/job-categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content">
            <div className="page-header px-4 mt-4">
                <h2 className="fs-20 fw-bold mb-0">App Category Banners</h2>
                <p className="text-muted small">Update the visual banners shown in the mobile application</p>
            </div>

            <div className="p-4">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    <div className="row">
                        {categories.map((cat) => (
                            <div className="col-md-6 col-xl-4 mb-4" key={cat._id}>
                                <div className="card shadow-sm border-0 h-100 overflow-hidden">
                                    <div className="position-relative bg-light" style={{ height: '160px' }}>
                                        {cat.bannerImage ? (
                                            <img 
                                                src={`http://localhost:5001${cat.bannerImage}`} 
                                                className="w-100 h-100 object-fit-cover" 
                                                alt={cat.name} 
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted bg-soft-secondary">
                                                <i className="feather-image me-2"></i> No Banner Set
                                            </div>
                                        )}
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <Link 
                                                to={`/job-categories/banner/edit/${cat._id}`} 
                                                className="btn btn-sm btn-primary shadow"
                                            >
                                                <i className="feather-edit-2"></i>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body py-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className="fw-bold mb-0 text-dark">{cat.name}</h6>
                                            <span className="badge bg-soft-info text-info small">Category</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryBannerList;