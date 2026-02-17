import React from 'react';

const Topbar = () => {
  return (
    <header className="nxl-header">
      <div className="header-wrapper">
        <div className="header-left d-flex align-items-center gap-4">
          <a href="#!" className="nxl-head-mobile-toggler" id="mobile-collapse">
            <div className="hamburger hamburger--arrowturn">
              <div className="hamburger-box"><div className="hamburger-inner"></div></div>
            </div>
          </a>
          <div className="nxl-navigation-toggle">
            <a href="#!" id="menu-mini-button"><i className="feather-align-left"></i></a>
          </div>
        </div>
        <div className="header-right ms-auto">
          <div className="d-flex align-items-center">
            <div className="nxl-h-item dark-light-theme">
              <a href="#!" className="nxl-head-link me-0 dark-button"><i className="feather-moon"></i></a>
            </div>
            <div className="dropdown nxl-h-item">
              <a href="#!" data-bs-toggle="dropdown" role="button">
                <img src="/assets/images/avatar/1.png" alt="" className="img-fluid user-avtar me-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;