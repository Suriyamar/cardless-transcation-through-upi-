import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  Calendar, 
  ClockIcon, 
  History, 
  Bell, 
  Menu, 
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { notifications, dismissNotification } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/cardless-withdrawal', label: 'Cardless Withdrawal', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/atm-locator', label: 'ATM Locator', icon: <MapPin className="w-5 h-5" /> },
    { path: '/slot-booking', label: 'Book Slot', icon: <Calendar className="w-5 h-5" /> },
    { path: '/my-bookings', label: 'My Bookings', icon: <ClockIcon className="w-5 h-5" /> },
    { path: '/transactions', label: 'Transactions', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <CreditCard className="w-8 h-8" />
            <span className="text-xl font-bold">ATM Manager</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Current Time */}
            <div className="hidden md:flex items-center space-x-2 bg-blue-700 px-3 py-1 rounded-md">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {format(currentTime, 'HH:mm:ss')}
              </span>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-blue-700 relative"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div key={index} className="p-3 border-b border-gray-100 flex justify-between items-start">
                          <p className="text-sm text-gray-700">{notification}</p>
                          <button 
                            onClick={() => dismissNotification(index)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-blue-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white shadow-md">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-75">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          location.pathname === item.path
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;