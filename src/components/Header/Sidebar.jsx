import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <nav className="nxl-navigation">
      <div className="navbar-wrapper">
        <div className="m-header">
          <Link to="/" className="b-brand">
            {/* <img src="/assets/images/logo-full.png" alt="" className="logo logo-lg" />
            <img src="/assets/images/logo-abbr.png" alt="" className="logo logo-sm" /> */}
          </Link>
        </div>
        <div className="navbar-content">
          <ul className="nxl-navbar">
            <li className="nxl-item nxl-caption"><label>Navigation</label></li>
            <li className="nxl-item">
              <Link to="/" className="nxl-link">
                <span className="nxl-micon"><i className="feather-airplay"></i></span>
                <span className="nxl-mtext">Dashboards</span>
              </Link>
            </li>

            {/* Manage Bookings Section - NEW */}
            <li className="nxl-item nxl-hasmenu">
              <a href="javascript:void(0);" className="nxl-link">
                <span className="nxl-micon"><i className="feather-calendar"></i></span>
                <span className="nxl-mtext">Manage Bookings</span><span className="nxl-arrow"><i className="feather-chevron-right"></i></span>
              </a>
              <ul className="nxl-submenu">
                <li className="nxl-item"><Link className="nxl-link" to="/bookings">All Bookings</Link></li>
                <li className="nxl-item"><Link className="nxl-link" to="/bookings/add">Create Booking</Link></li>
              </ul>
            </li>

            {/* Workers Section */}
            <li className="nxl-item nxl-hasmenu">
              <a href="javascript:void(0);" className="nxl-link">
                <span className="nxl-micon"><i className="feather-users"></i></span>
                <span className="nxl-mtext">Manage Workers</span><span className="nxl-arrow"><i className="feather-chevron-right"></i></span>
              </a>
              <ul className="nxl-submenu">
                <li className="nxl-item"><Link className="nxl-link" to="/workers">All Workers</Link></li>
                <li className="nxl-item"><Link className="nxl-link" to="/workers/add">Add New Worker</Link></li>
              </ul>
            </li>

            {/* Clients Section */}
            <li className="nxl-item nxl-hasmenu">
              <a href="javascript:void(0);" className="nxl-link">
                <span className="nxl-micon"><i className="feather-user"></i></span>
                <span className="nxl-mtext">Manage Clients</span><span className="nxl-arrow"><i className="feather-chevron-right"></i></span>
              </a>
              <ul className="nxl-submenu">
                <li className="nxl-item"><Link className="nxl-link" to="/clients">All Clients</Link></li>
                <li className="nxl-item"><Link className="nxl-link" to="/clients/add">Add New Clients</Link></li>
              </ul>
            </li>

            {/* Manage Jobs Section */}
            <li className="nxl-item nxl-hasmenu">
              <a href="javascript:void(0);" className="nxl-link">
                <span className="nxl-micon"><i className="feather-briefcase"></i></span>
                <span className="nxl-mtext">Manage Jobs</span><span className="nxl-arrow"><i className="feather-chevron-right"></i></span>
              </a>
              <ul className="nxl-submenu">
                <li className="nxl-item"><Link className="nxl-link" to="/jobs">All Jobs</Link></li>
                <li className="nxl-item"><Link className="nxl-link" to="/jobs/add">Add New Job</Link></li>
              </ul>
            </li>

            {/* Manage Job Categories Section */}
            <li className="nxl-item nxl-hasmenu">
              <a href="javascript:void(0);" className="nxl-link">
                <span className="nxl-micon"><i className="feather-layers"></i></span>
                <span className="nxl-mtext">Job Categories</span><span className="nxl-arrow"><i className="feather-chevron-right"></i></span>
              </a>
              <ul className="nxl-submenu">
                <li className="nxl-item"><Link className="nxl-link" to="/job-categories">All Categories</Link></li>
                <li className="nxl-item"><Link className="nxl-link" to="/job-categories/add">Add New Category</Link></li>
              </ul>
            </li>

            {/* Settings / Admin Section */}
            <li className="nxl-item nxl-caption"><label>Settings</label></li>
            
            <li className="nxl-item nxl-hasmenu">
              <a href="javascript:void(0);" className="nxl-link">
                <span className="nxl-micon"><i className="feather-shield"></i></span>
                <span className="nxl-mtext">Manage Admins</span><span className="nxl-arrow"><i className="feather-chevron-right"></i></span>
              </a>
              <ul className="nxl-submenu">
                <li className="nxl-item"><Link className="nxl-link" to="/admins">All Admins</Link></li>
                <li className="nxl-item"><Link className="nxl-link" to="/admins/add">Add New Admin</Link></li>
              </ul>
            </li>

            {/* Audit Trail - NEW */}
            <li className="nxl-item">
              <Link to="/audit-logs" className="nxl-link">
                <span className="nxl-micon"><i className="feather-activity"></i></span>
                <span className="nxl-mtext">Audit Trail (Logs)</span>
              </Link>
            </li>

            {/* Logout Button */}
            <li className="nxl-item mt-4">
              <a href="javascript:void(0);" className="nxl-link text-danger" onClick={handleLogout}>
                <span className="nxl-micon"><i className="feather-log-out"></i></span>
                <span className="nxl-mtext">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;