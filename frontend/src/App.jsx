import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import StudentLogin from './pages/student/Login';
import StudentRegister from './pages/student/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentApplications from './pages/student/Applications';
import CompanyLogin from './pages/company/Login';
import CompanyRegister from './pages/company/Register';
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/Profile';
import PostInternship from './pages/company/PostInternship';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCompanies from './pages/admin/Companies';
import AdminReports from './pages/admin/Reports';
import InternshipList from './pages/InternshipList';
import InternshipDetail from './pages/InternshipDetail';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/" />;
    if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="internships" element={<InternshipList />} />
        <Route path="internships/:id" element={<InternshipDetail />} />
        
        {/* Student Portal */}
        <Route path="student">
          <Route path="login" element={<StudentLogin />} />
          <Route path="register" element={<StudentRegister />} />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="applications" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentApplications />
            </ProtectedRoute>
          } />
        </Route>

        {/* Company Portal */}
        <Route path="company">
          <Route path="login" element={<CompanyLogin />} />
          <Route path="register" element={<CompanyRegister />} />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyProfile />
            </ProtectedRoute>
          } />
          <Route path="post-internship" element={
            <ProtectedRoute allowedRoles={['company']}>
              <PostInternship />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Portal */}
        <Route path="admin">
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'moderator']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'moderator']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="companies" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'moderator']}>
              <AdminCompanies />
            </ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin', 'moderator']}>
              <AdminReports />
            </ProtectedRoute>
          } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
