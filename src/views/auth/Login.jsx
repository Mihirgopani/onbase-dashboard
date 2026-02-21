import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            const response = await api.post('/auth/login', { email, password });
            
            // 1. Save the token to localStorage so axios can find it later
            localStorage.setItem('token', response.data.token);
            
            // 2. Save user info for the Topbar profile
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // 3. FORCE REDIRECT to Dashboard
            // Use window.location.href instead of navigate('/') for a hard refresh 
            // to ensure App.jsx re-checks the token immediately.
            window.location.href = '/'; 
    
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-creative-wrapper">
            <div className="auth-creative-inner">
                <div className="creative-card-wrapper">
                    <div className="card my-4 overflow-hidden" style={{ zIndex: 1 }}>
                        <div className="row flex-1 g-0">
                            <div className="col-lg-6 h-100 my-auto order-1 order-lg-0">
                                <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-50 start-50 d-none d-lg-block">
                                    <img src="/assets/images/logo-abbr.png" alt="Logo" className="img-fluid" />
                                </div>
                                <div className="creative-card-body card-body p-sm-5">
                                    <h2 className="fs-20 fw-bolder mb-4">Login</h2>
                                    <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
                                    <p className="fs-12 fw-medium text-muted">
                                        Welcome back to <strong>ONBASE</strong> administration. Please enter your admin credentials to access the panel.
                                    </p>

                                    {/* Display Validation Errors */}
                                    {error && (
                                        <div className="alert alert-danger py-2 fs-12">
                                            <i className="feather-alert-circle me-2"></i>
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleLogin} className="w-100 mt-4 pt-2">
                                        <div className="mb-4">
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                placeholder="Email Address" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="Password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required 
                                            />
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id="rememberMe" />
                                                    <label className="custom-control-label c-pointer ms-2 fs-11" htmlFor="rememberMe">Remember Me</label>
                                                </div>
                                            </div>
                                            <div>
                                                <a href="javascript:void(0);" className="fs-11 text-primary">Forgot password?</a>
                                            </div>
                                        </div>
                                        <div className="mt-5">
                                            <button 
                                                type="submit" 
                                                className="btn btn-lg btn-primary w-100" 
                                                disabled={loading}
                                            >
                                                {loading ? 'Authenticating...' : 'Login'}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="w-100 mt-5 text-center mx-auto">
                                        <div className="mb-4 border-bottom position-relative">
                                            <span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">System Support</span>
                                        </div>
                                        <p className="fs-11 text-muted">Contact master admin if you have lost access to your account.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 bg-primary order-0 order-lg-1">
                                <div className="h-100 d-flex align-items-center justify-content-center">
                                    <img src="/assets/images/auth/auth-user.png" alt="Auth" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;