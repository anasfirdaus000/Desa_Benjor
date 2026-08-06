import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Newspaper, 
  BarChart3, 
  Image as ImageIcon, 
  Settings,
  UserCircle,
  LogOut,
  Menu,
  MessageSquare,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const { adminProfile } = useAppContext();

  // Login checking to prevent unauthorized access
  React.useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Dark Mode initializer
  React.useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ImageIcon, label: 'Kelola Media', path: '/admin/media' },
    { icon: MessageSquare, label: 'Sambutan Kades', path: '/admin/sambutan' },
    { icon: Users, label: 'Kelola SOTK', path: '/admin/sotk' },
    { icon: Store, label: 'Kelola UMKM', path: '/admin/umkm' },
    { icon: Newspaper, label: 'Kelola Berita', path: '/admin/berita' },
    { icon: BarChart3, label: 'Infografis', path: '/admin/infografis' },
    { icon: Settings, label: 'Pengaturan Umum', path: '/admin/pengaturan' },
    { icon: UserCircle, label: 'Keamanan Akun', path: '/admin/akun' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`bg-[#2D5A27] dark:bg-gray-900 text-white w-64 flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20'}`}>
        <div className="p-4 flex items-center gap-3 border-b border-green-700 dark:border-gray-800 h-16">
          <div className="w-8 h-8 bg-white text-[#2D5A27] dark:bg-gray-950 dark:text-green-400 rounded-full flex items-center justify-center font-bold">B</div>
          <span className="font-bold text-lg tracking-wide">Admin Panel</span>
        </div>

        {/* Link back to Main Web */}
        <div className="p-4 border-b border-green-750 dark:border-gray-800">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 w-full py-2 bg-green-800 hover:bg-green-700 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-white rounded-lg text-sm font-bold transition-all shadow-sm border border-green-700/50 dark:border-gray-750/30"
          >
            <Globe size={16} />
            <span>Website Utama &rarr;</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-green-800 dark:bg-gray-800 text-white' 
                  : 'text-green-100 hover:bg-green-700 dark:hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-700 dark:border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-green-100 hover:bg-red-650 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm h-16 flex items-center justify-between px-4 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle inside Admin topbar */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-55 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{adminProfile.name}</span>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {adminProfile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
