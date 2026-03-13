import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Header/Sidebar";
import Topbar from "./components/Header/Topbar";
import Dashboard from "./views/Dashboard";

// Worker Imports
import AllWorkers from "./views/workers/AllWorkers";
import AddWorker from "./views/workers/AddWorker";
import WorkerDetails from "./views/workers/WorkerDetails";
import EditWorker from "./views/workers/EditWorker";

// Client Imports
import AllClients from "./views/clients/AllClients";
import AddClient from "./views/clients/AddClient";
import EditClient from "./views/clients/EditClient";
import ClientDetails from "./views/clients/ClientDetails";

// Job & Category Imports
import AllJobCategories from "./views/job-categories/AllJobCategories";
import AddJobCategory from "./views/job-categories/AddJobCategory";
import EditJobCategory from "./views/job-categories/EditJobCategory";
import JobCategoryDetails from "./views/job-categories/JobCategoryDetails";

import AllJobs from "./views/jobs/AllJobs";
import AddJob from "./views/jobs/AddJob";
import EditJob from "./views/jobs/EditJob";
import JobDetails from "./views/jobs/JobDetails";

// Admin Imports
import AllAdmins from "./views/admins/AllAdmins";
import AddAdmin from "./views/admins/AddAdmin";
import EditAdmin from "./views/admins/EditAdmin";
import AdminDetails from "./views/admins/AdminDetails";
import Login from "./views/auth/Login";

import BookingDetails from "./views/bookings/BookingDetails";
import AllBookings from "./views/bookings/AllBookings";
import AddBooking from "./views/bookings/AddBooking";
import EditBooking from "./views/bookings/EditBooking";

import GlobalSetting from "./views/pages/Settings";
import AllStates from "./views/locations/AllStates";
import AllCities from "./views/locations/AllCities";
import AllAreas from "./views/locations/AllAreas";
import DumpData from "./views/pages/DumpData";
import WorkerAssignment from "./views/bookings/WorkerAssignment";

import AllFaqs from "./views/faq/AllFaq";
import AddFaq from "./views/faq/AddFaq"; // This would wrap <FaqForm isEdit={false} />
import EditFaq from "./views/faq/EditFaq";
import FaqDetails from "./views/faq/FaqDetails";

import CategoryBanners from "./views/category-banners/CategoryBannerList";
import EditCategoryBanner from "./views/category-banners/UpdateCategoryBanner";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Sync authentication state
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    // Listen for storage changes (helpful if login happens in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Login Route: If already logged in, redirect to Dashboard */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <div className="layout-wrapper">
                <Sidebar />
                <Topbar />
                
                <main className="nxl-container">
                  <div className="nxl-content">
                    <Routes>
                      {/* Dashboard */}
                      <Route path="/" element={<Dashboard />} />

                      {/* Worker Management */}
                      <Route path="/workers" element={<AllWorkers />} />
                      <Route path="/workers/add" element={<AddWorker />} />
                      <Route path="/workers/details/:id" element={<WorkerDetails />} />
                      <Route path="/workers/edit/:id" element={<EditWorker />} />

                      {/* Client Management */}
                      <Route path="/clients" element={<AllClients />} />
                      <Route path="/clients/add" element={<AddClient />} />
                      <Route path="/clients/edit/:id" element={<EditClient />} />
                      <Route path="/clients/details/:id" element={<ClientDetails />} />

                      {/* Job Categories */}
                      <Route path="/job-categories" element={<AllJobCategories />} />
                      <Route path="/job-categories/add" element={<AddJobCategory />} />
                      <Route path="/job-categories/edit/:id" element={<EditJobCategory />} />
                      <Route path="/job-categories/details/:id" element={<JobCategoryDetails />} />

                      {/* Jobs */}
                      <Route path="/jobs" element={<AllJobs />} />
                      <Route path="/jobs/add" element={<AddJob />} />
                      <Route path="/jobs/edit/:id" element={<EditJob />} />
                      <Route path="/jobs/details/:id" element={<JobDetails />} />

                      {/* Admin Management */}
                      <Route path="/admins" element={<AllAdmins />} />
                      <Route path="/admins/add" element={<AddAdmin />} />
                      <Route path="/admins/edit/:id" element={<EditAdmin />} />
                      <Route path="/admins/details/:id" element={<AdminDetails />} />
                      <Route path="/settings/global-setting" element={<GlobalSetting />} />
                      <Route path="/settings/dump-data" element={<DumpData />} />

                      {/* NEW: FAQ Management */}
                      <Route path="/faqs" element={<AllFaqs />} />
                      <Route path="/faqs/add" element={<AddFaq />} />
                      <Route path="/faqs/edit/:id" element={<EditFaq />} />
                      <Route path="/faqs/details/:id" element={<FaqDetails />} />

                      <Route path="/job-categories/banners" element={<CategoryBanners />} />
<Route path="/job-categories/banner/edit/:id" element={<EditCategoryBanner />} />

                      <Route path="/locations/states" element={<AllStates />} />
<Route path="/locations/cities" element={<AllCities />} />
<Route path="/locations/areas" element={<AllAreas />} />

                      <Route path="/bookings" element={<AllBookings />} />
<Route path="/bookings/add" element={<AddBooking />} />
<Route path="/bookings/details/:id" element={<BookingDetails />} />
<Route path="/bookings/edit/:id" element={<EditBooking />} />

<Route path="/bookings/:bookingId/assign/:itemIndex" element={<WorkerAssignment />} />

                      {/* Fallback for authenticated users */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>

                  <footer className="footer">
                    <p className="fs-11 text-muted fw-medium text-uppercase mb-0">
                      Copyright © {new Date().getFullYear()} ONBASE
                    </p>
                  </footer>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;