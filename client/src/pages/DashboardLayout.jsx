import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, QrCode, BarChart3, Upload, LogOut, Menu, X,
  ChevronRight, User
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/qrcodes', icon: QrCode, label: 'QR Codes' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/bulk-upload', icon: Upload, label: 'Bulk Upload' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPage = NAV_ITEMS.find(
    item => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* ─── Sidebar overlay (mobile) ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 lg:hidden modal-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-[260px] glass flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 lg:sticky ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-dark-700/30 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-md shadow-primary-500/20">
              <QrCode className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">QR Hub</span>
              <span className="block text-[10px] text-dark-500 -mt-0.5 font-medium">Management System</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                  )}
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-dark-500 group-hover:text-dark-300'}`} />
                  <span className="flex-1">{label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-all ${isActive ? 'opacity-100 text-primary-500' : 'opacity-0 group-hover:opacity-50'}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 pb-4 mt-auto flex-shrink-0">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name || 'User'}</p>
              <p className="text-[11px] text-dark-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-dark-500 hover:text-danger-400 hover:bg-dark-700/50 rounded-lg transition-colors flex-shrink-0 tooltip-hover"
              data-tip="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 px-4 lg:px-6 flex items-center justify-between border-b border-dark-700/20 glass">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800/60 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-white">{currentPage?.label || 'Dashboard'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-dark-400 hidden sm:block">Welcome,</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/40 border border-dark-700/30">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-semibold text-white">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
