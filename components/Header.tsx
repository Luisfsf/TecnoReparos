import React from 'react';
import { View } from './DashboardPage';
import { WrenchScrewdriverIcon, ArrowLeftOnRectangleIcon, SunIcon, MoonIcon, CubeIcon } from './icons';

interface HeaderProps {
  user: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
}

const NavLink: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  const activeClasses = 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white';
  const inactiveClasses = 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50';
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, onThemeToggle, currentView, onNavigate }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm transition-colors sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center flex-shrink-0">
                <WrenchScrewdriverIcon className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span className="ml-3 text-xl font-bold text-slate-800 dark:text-slate-100">TecnoReparos</span>
            </div>
            <nav className="hidden md:flex items-center ml-10 space-x-4">
               <NavLink isActive={currentView === 'orders'} onClick={() => onNavigate('orders')}>
                 <WrenchScrewdriverIcon className="w-5 h-5 mr-2"/>
                 Ordens de Serviço
               </NavLink>
               <NavLink isActive={currentView === 'stock'} onClick={() => onNavigate('stock')}>
                 <CubeIcon className="w-5 h-5 mr-2"/>
                 Estoque
               </NavLink>
            </nav>
          </div>
          <div className="flex items-center">
             <button
              onClick={onThemeToggle}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
              Olá, <span className="font-medium capitalize">{user}</span>
            </span>
            <button
              onClick={onLogout}
              className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              title="Sair do Sistema"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span className="sr-only">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
