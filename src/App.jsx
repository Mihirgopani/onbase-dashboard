import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Header/Sidebar";
import Topbar from "./components/Header/Topbar";
import Dashboard from "./views/Dashboard";
import AllWorkers from "./views/workers/AllWorkers";
import AddWorker from "./views/workers/AddWorker";
import WorkerDetails from "./views/workers/WorkerDetails";
import EditWorker from "./views/workers/EditWorker";

function App() {
  return (
    <Router>
      <div className="layout-wrapper">
        <Sidebar />
        <Topbar />
        
        {/* 'nxl-container' is vital for the correct layout spacing */}
        <main className="nxl-container">
          <div className="nxl-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workers" element={<AllWorkers />} />
              <Route path="/workers/add" element={<AddWorker />} />
              <Route path="/workers/details/:id" element={<WorkerDetails />} />
              <Route path="/workers/edit/:id" element={<EditWorker />} />
            </Routes>
          </div>

          <footer className="footer">
            <p className="fs-11 text-muted fw-medium text-uppercase mb-0">
              Copyright © {new Date().getFullYear()} ONBASE
            </p>
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;