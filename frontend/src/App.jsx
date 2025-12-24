/**
 * APP COMPONENT
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/Login/Login';
import StudentRegisterPage from './pages/Register/StudentRegister';
import TutorRegisterPage from './pages/Register/TutorRegister';
import LandingPage from './pages/Landing/Landing';

// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import TutorDashboard from './pages/Dashboard/TutorDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';

// Admin Pages
import AdminUsers from './pages/Admin/AdminUsers';
import AdminClasses from './pages/Admin/AdminClasses';
import AdminSubjects from './pages/Admin/AdminSubjects';

// Tutor Pages
import TutorClasses from './pages/Tutor/TutorClasses';
import TutorCreateClass from './pages/Tutor/TutorCreateClass';
import TutorClassRegistrations from './pages/Tutor/TutorClassRegistrations';
import TutorProfile from './pages/Tutor/TutorProfile';
import TutorRegistrations from './pages/Tutor/TutorRegistrations';
import TutorSchedule from './pages/Tutor/TutorSchedule';
import TutorRatings from './pages/Tutor/TutorRatings';

// Student Pages
import StudentClasses from './pages/Student/StudentClasses';
import StudentClassDetail from './pages/Student/StudentClassDetail';
import StudentRegistrations from './pages/Student/StudentRegistrations';
import StudentProfile from './pages/Student/StudentProfile';
import StudentSchedule from './pages/Student/StudentSchedule';
import StudentRatings from './pages/Student/StudentRatings';

// Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirectMap = {
      Admin: '/admin',
      GiaSu: '/tutor',
      HocVien: '/student',
    };
    return <Navigate to={redirectMap[user?.role] || '/'} replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/student" element={<StudentRegisterPage />} />
        <Route path="/register/tutor" element={<TutorRegisterPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subjects"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminSubjects />
          </ProtectedRoute>
        }
      />

      {/* Tutor Routes */}
      <Route
        path="/tutor"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/classes"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/create-class"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorCreateClass />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/registrations"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/class/:id/registrations"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorClassRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/profile"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/schedule"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/ratings"
        element={
          <ProtectedRoute allowedRoles={['GiaSu']}>
            <TutorRatings />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['HocVien']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/classes"
        element={
          <ProtectedRoute allowedRoles={['HocVien']}>
            <StudentClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/class/:id"
        element={
          <ProtectedRoute allowedRoles={['HocVien']}>
            <StudentClassDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/registrations"
        element={
          <ProtectedRoute allowedRoles={['HocVien']}>
            <StudentRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['HocVien']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/schedule"
        element={
          <ProtectedRoute allowedRoles={['HocVien']}>
            <StudentSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/ratings"
        element={
          <ProtectedRoute allowedRoles={['HocVien']}>
            <StudentRatings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
