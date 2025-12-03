import React from 'react';
import { ShieldCheck, Activity, Search, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AlertBanner from './AlertBanner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Live Monitor', path: '/monitor', icon: <Activity className="w-5 h-5" /> },
    { name: 'Forensics', path: '/forensics', icon: <Search className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Global Alert Notification */}
      <AlertBanner />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            HomeGuard
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm'
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 text-xs text-slate-500 px-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Online • v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 z-40">
         <div className="flex items-center space-x-2">
            <ShieldCheck className="text-blue-500 w-6 h-6" />
            <span className="font-bold text-lg text-slate-100">HomeGuard</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 p-2">
           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute inset-0 bg-slate-950/95 z-30 pt-20 px-6 backdrop-blur-xl">
           <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-4 rounded-lg text-lg ${
                  isActive(item.path)
                    ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8 relative w-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;