import React, { useState, ReactElement, PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import dkaritoStarLogo from '../../assets/Svgs/star_white_48dp.svg';
import dkaritoFullLogo from '../../assets/Logo-with-text.png';

export const drawerOpenWidth = 256;
export const drawerCloseWidth = 80;

const ADMIN_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80';

const MainLayout = ({ children }: PropsWithChildren): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const path = location.pathname;
  const isDashboard = path === '/dashboard' || path === '/admin';
  const isProducts = path.startsWith('/dashboard/products');
  const isPayments = path.startsWith('/dashboard/payments');
  const isOrders = path.startsWith('/my-orders');

  const activeNavClass =
    'flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group bg-white/15 text-white font-medium text-sm rounded-full shadow border border-white/20 cursor-pointer';
  const inactiveNavClass =
    'flex items-center gap-3 px-4 py-2.5 rounded-full font-medium text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200 group cursor-pointer';

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = globalSearch.trim().toLowerCase();
    if (!q) return;
    if (q.startsWith('#') || q.includes('pay') || q.includes('yape') || q.includes('orden')) {
      navigate('/dashboard/payments');
    } else {
      navigate('/dashboard/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dk-erp-root bg-[#121212] font-body-md text-white antialiased min-h-screen relative overflow-x-hidden">
      {/* Subtle D'Karito Logo Background Watermark (matching SignIn1) */}
      <div className="pointer-events-none select-none fixed inset-0 flex items-center justify-center overflow-hidden z-0 lg:pl-64">
        <img
          src={dkaritoStarLogo}
          alt=""
          aria-hidden="true"
          className="w-[560px] h-[560px] sm:w-[720px] sm:h-[720px] object-contain opacity-[0.035]"
        />
        <img
          src={dkaritoFullLogo}
          alt=""
          aria-hidden="true"
          className="fixed bottom-6 right-8 w-44 object-contain opacity-[0.05] hidden sm:block"
        />
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Left Fixed Glassmorphic Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#ffffff10] to-[#121212] backdrop-blur-md border-r border-white/10 z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header matching SignIn1 glass badge */}
          <div className="px-5 pt-6 pb-5 flex items-center gap-3 border-b border-white/10">
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 border border-white/20 shadow-lg cursor-pointer p-2 hover:bg-white/25 transition"
            >
              <img
                alt="D'Karito Store Logo"
                className="w-full h-full object-contain"
                src={dkaritoStarLogo}
              />
            </div>
            <div
              onClick={() => navigate('/dashboard')}
              className="flex flex-col cursor-pointer"
            >
              <span className="text-base font-semibold text-white tracking-tight">
                D&apos;Karito Store
              </span>
              <span className="text-[11px] text-gray-400 font-mono-data">
                Panel de Gestión
              </span>
            </div>
          </div>

          <div className="px-5 pt-5 pb-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Menú Principal
            </span>
          </div>

          <nav className="flex flex-col gap-1.5 px-3">
            <a
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              href="/dashboard"
              className={isDashboard ? activeNavClass : inactiveNavClass}
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              <span>Resumen Ejecutivo</span>
            </a>

            <a
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate('/dashboard/products');
              }}
              href="/dashboard/products"
              className={isProducts ? activeNavClass : inactiveNavClass}
            >
              <span className="material-symbols-outlined text-lg">inventory_2</span>
              <span>Catálogo e Inventario</span>
            </a>

            <a
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate('/dashboard/payments');
              }}
              href="/dashboard/payments"
              className={isPayments ? activeNavClass : inactiveNavClass}
            >
              <span className="material-symbols-outlined text-lg">payments</span>
              <span>Pasarela de Pagos</span>
            </a>

            <a
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate('/my-orders');
              }}
              href="/my-orders"
              className={isOrders ? activeNavClass : inactiveNavClass}
            >
              <span className="material-symbols-outlined text-lg">local_shipping</span>
              <span>Gestión de Pedidos</span>
            </a>

            <div className="my-2 border-t border-white/10" />

            <a
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate('/');
              }}
              href="/"
              className={inactiveNavClass}
            >
              <span className="material-symbols-outlined text-lg">storefront</span>
              <span>Ir a la Tienda Pública</span>
            </a>
          </nav>
        </div>

        <div className="p-4 flex flex-col gap-3 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Estado del Sistema
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-sm">dns</span>
              <span className="font-mono-data text-xs text-white font-semibold">
                6/6 Microservicios Activos
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-red-500/20 text-gray-200 hover:text-red-300 border border-white/10 font-medium text-sm transition-all duration-200 w-full"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 relative z-10">
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#121212]/80 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/10 text-white"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">
                D&apos;Karito Store
              </span>
              <span className="text-sm text-white font-semibold">
                Panel de Administración
              </span>
            </div>
          </div>

          <form onSubmit={handleGlobalSearchSubmit} className="flex-1 max-w-md mx-6 hidden sm:block">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-gray-400 pointer-events-none text-base">
                search
              </span>
              <input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full h-9 bg-white/10 border border-white/10 pl-10 pr-12 rounded-full text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Buscar productos, órdenes (#12), pagos o SKUs..."
                type="text"
              />
              <span className="absolute right-3 font-mono-data text-[10px] text-gray-400">
                ⌘K
              </span>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-medium transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Ver Tienda</span>
            </a>

            <div className="flex items-center gap-2.5 pl-2">
              <div className="relative">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                  src={user?.picture || ADMIN_AVATAR}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = ADMIN_AVATAR;
                  }}
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#121212]" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs text-white font-medium leading-tight">
                  {user?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-gray-400">
                  Administrador
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative pt-20 w-full px-6 pb-10 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
