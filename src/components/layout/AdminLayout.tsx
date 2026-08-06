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
  MessageSquare
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { adminProfile } = useAppContext();

  // Login checking to prevent unauthorized access
  React.useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`bg-[#2D5A27] text-white w-64 flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20'}`}>
        <div className="p-4 flex items-center gap-3 border-b border-green-700 h-16">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#2D5A27] font-bold">B</div>
          <span className="font-bold text-lg tracking-wide">Admin Panel</span>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-green-800 text-white' 
                  : 'text-green-100 hover:bg-green-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-green-100 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{adminProfile.name}</span>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {adminProfile.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
