import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import CompanyPage from './pages/CompanyPage';
import MemberPage from './pages/MemberPage';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/members" element={<MemberPage />} />
              <Route path="/projects" element={<ProjectPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
=======
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb'
    }}>
      <LoginPage />
    </div>
>>>>>>> ff3a4a6d239734a8e4d2b5f71c9d8a2308f55f8c
  );
}

export default App;