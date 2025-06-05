
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'farmer') return '/farmer-dashboard';
    if (user?.role === 'buyer') return '/buyer-dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate(user ? getDashboardRoute() : '/')}
          >
            <span className="text-2xl font-bold text-green-600">🌾</span>
            <span className="ml-2 text-xl font-bold text-gray-900">FarmConnect</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
