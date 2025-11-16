
import React from 'react';
import { Icon } from './common/Icon';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

interface NavItemProps {
  icon: string;
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, view, currentView, onClick }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-primary-light hover:text-primary'
      }`}
    >
      <Icon name={icon} className="w-5 h-5 mr-4" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setOpen }) => {
  const handleNavClick = (view: View) => {
    setCurrentView(view);
    if(window.innerWidth < 768) { // md breakpoint
        setOpen(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      ></div>
      <aside
        className={`bg-white shadow-lg fixed md:relative z-30 md:z-auto inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <span className="text-lg font-bold text-primary">Health Guardian AI</span>
          <button onClick={() => setOpen(false)} className="md:hidden text-gray-500">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem icon="dashboard" label="Dashboard" view="dashboard" currentView={currentView} onClick={handleNavClick} />
          <NavItem icon="chat" label="AI Chat" view="chat" currentView={currentView} onClick={handleNavClick} />
          <NavItem icon="care-plan" label="Care Plan" view="care-plan" currentView={currentView} onClick={handleNavClick} />
        </nav>
        <div className="p-4 border-t">
            <div className="bg-primary-light text-primary-dark p-4 rounded-lg text-sm">
                <p className="font-semibold mb-1">Disclaimer</p>
                <p>This is not medical advice. Always consult with a qualified healthcare professional for any health concerns.</p>
            </div>
        </div>
      </aside>
    </>
  );
};
