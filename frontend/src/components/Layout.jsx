import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserColor = () => {
    if (user?.role === 'student') return 'bg-blue-600';
    if (user?.role === 'company') return 'bg-green-600';
    return 'bg-red-600';
  };

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
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getUserColor()}`}>
                      {getUserInitials()}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.full_name || user?.email}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20">
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-medium text-gray-900">{user?.full_name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            to={
                              user?.role === 'student' ? '/student/dashboard' :
                              user?.role === 'company' ? '/company/dashboard' :
                              '/admin/dashboard'
                            }
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              Dashboard
                            </span>
                          </Link>
                          <Link
                            to={
                              user?.role === 'student' ? '/student/profile' :
                              user?.role === 'company' ? '/company/profile' :
                              '/admin/profile'
                            }
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Profile
                            </span>
                          </Link>
                          {user?.role === 'company' && (
                            <Link
                              to="/company/post-internship"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Post Internship
                              </span>
                            </Link>
                          )}
                          {user?.role === 'admin' || user?.role === 'super_admin' && (
                            <Link
                              to="/admin/users"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Manage Users
                              </span>
                            </Link>
                          )}
                        </div>
                        <div className="border-t py-2">
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
                <li><Link to="/student/register" className="hover:text-white">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Companies</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/company/register" className="hover:text-white">Post Internships</Link></li>
                <li><Link to="/company/login" className="hover:text-white">Company Login</Link></li>
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
