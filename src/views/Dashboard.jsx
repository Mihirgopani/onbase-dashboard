import React from 'react';

const Dashboard = () => {
  return (
    <div className="main-content">
      <div className="row">
        {/* Worker Stats Card */}
        <div className="col-xxl-3 col-md-6">
          <div className="card stretch stretch-full">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between mb-4">
                <div className="d-flex gap-4 align-items-center">
                  <div className="avatar-text avatar-lg bg-gray-200">
                    <i className="feather-users"></i>
                  </div>
                  <div>
                    <div className="fs-4 fw-bold text-dark">124</div>
                    <h3 className="fs-13 fw-semibold">Total Workers</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;