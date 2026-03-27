import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Get the base URL from Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalClients: 0,
    pendingAssignments: 0,
    activeWork: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Using the env variable for the request
        const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardData = [
    { 
      label: 'Total Workers', 
      value: stats.totalWorkers, 
      icon: 'feather-users', 
      color: '#FF6F00', 
      bg: '#FFF4ED' 
    },
    { 
      label: 'Total Clients', 
      value: stats.totalClients, 
      icon: 'feather-briefcase', 
      color: '#032542', 
      bg: '#E7F6F2' 
    },
    { 
      label: 'Pending Assignments', 
      value: stats.pendingAssignments, 
      icon: 'feather-clock', 
      color: '#D97706', 
      bg: '#FEF3C7' 
    },
    { 
      label: 'Active Work', 
      value: stats.activeWork, 
      icon: 'feather-activity', 
      color: '#059669', 
      bg: '#D1FAE5' 
    },
  ];

  return (
    <div className="main-content p-4">
      <div className="row g-4">
        {cardData.map((card, index) => (
          <div className="col-xxl-3 col-md-6" key={index}>
            <div className="card border-0 shadow-sm stretch stretch-full" style={{ borderRadius: '16px' }}>
              <div className="card-body">
                <div className="d-flex align-items-center gap-4">
                  <div 
                    className="avatar-text avatar-lg d-flex align-items-center justify-content-center" 
                    style={{ 
                      backgroundColor: card.bg, 
                      color: card.color, 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '12px' 
                    }}
                  >
                    <i className={`${card.icon} fs-4`}></i>
                  </div>
                  <div>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-muted" role="status"></div>
                    ) : (
                      <div className="fs-4 fw-bold text-dark">{card.value.toLocaleString()}</div>
                    )}
                    <h3 className="fs-13 fw-semibold text-muted mb-0">{card.label}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;