import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Crosshair, Book, Menu, ChevronLeft, Info } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        // Optionally auto-open on desktop
      } else if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex h-screen w-full bg-[#FDFBF7] text-slate-900 overflow-hidden font-sans relative">
      {/* Sidebar Toggle Button (when closed) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`bg-white border-r border-slate-200 flex flex-col shadow-sm transition-all duration-300 ease-in-out ${
          isMobile ? 'fixed inset-y-0 left-0 z-[70]' : 'relative z-50'
        } ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
        }`}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-3 min-w-[16rem]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Book size={16} strokeWidth={1.5} />
            </div>
            <h1 className="text-lg font-serif font-bold text-slate-900 leading-tight">
              Beautiful<br/><span className="italic text-emerald-600">BibleData</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close Menu"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 min-w-[16rem]">
          <Link
            to="/crossreferences"
            onClick={() => isMobile && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              location.pathname.includes('crossreferences')
                ? 'bg-emerald-50 text-emerald-900 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Crosshair size={20} />
            Cross References
          </Link>
          <Link
            to="/bible-board"
            onClick={() => isMobile && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              location.pathname.includes('bible-board')
                ? 'bg-emerald-50 text-emerald-900 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen size={20} />
            Bible Board
          </Link>
          <Link
            to="/about"
            onClick={() => isMobile && setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              location.pathname.includes('about')
                ? 'bg-emerald-50 text-emerald-900 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Info size={20} />
            About
          </Link>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <Outlet context={{ isSidebarOpen, setIsSidebarOpen }} />
      </div>
    </div>
  );
}
