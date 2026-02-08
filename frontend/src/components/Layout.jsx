import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">InternSafe</span>
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                  SCAM-FREE
                </span>
              </Link>
              <div className="ml-10 flex space-x-4">
                <Link 
                  to="/internships" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/internships') 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Browse Internships
                </Link>
                {isAuthenticated && user?.role === 'student' && (
                  <Link 
                    to="/student/applications" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/student/applications') 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    My Applications
                  </Link>
                )}
                {!isAuthenticated && (
                  <>
                    <Link to="/student/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                      Student Login
                    </Link>
                    <Link to="/company/login" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
                      Company Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to={
                      user?.role === 'student' ? '/student/dashboard' : 
                      user?.role === 'company' ? '/company/dashboard' : 
                      '/admin/dashboard'
                    }
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user?.role === 'student' ? 'bg-blue-100' :
                      user?.role === 'company' ? 'bg-green-100' :
                      'bg-red-100'
                    }`}>
                      <span className={`font-semibold ${
                        user?.role === 'student' ? 'text-blue-600' :
                        user?.role === 'company' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {user?.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/student/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">InternSafe</h3>
              <p className="text-gray-400 text-sm">
                India's first student-protection-centered internship platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/internships" className="hover:text-white">Browse Internships</Link></li>
                <li><Link to="/register" className="hover:text-white">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/register" className="hover:text-white">Post Internships</Link></li>
                <li><Link to="/login" className="hover:text-white">Company Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Safety Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>🛡️ Scam Detection</li>
                <li>💰 Payment Escrow</li>
                <li>⭐ Trust Scores</li>
                <li>📊 Transparent Reviews</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 InternSafe. Protecting students, empowering careers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
