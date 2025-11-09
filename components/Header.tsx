
import React from 'react';
import ChartBarIcon from './icons/ChartBarIcon';

interface HeaderProps {
  isAdminView: boolean;
  setIsAdminView: (isAdmin: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isAdminView, setIsAdminView }) => {
  return (
    <header className="bg-brand-primary shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <ChartBarIcon className="h-8 w-8 text-white"/>
            <h1 className="text-xl md:text-2xl font-bold text-white">Knowledge Finder</h1>
          </div>
          <div className="flex items-center">
            <div className="bg-brand-dark p-1 rounded-lg flex items-center space-x-1">
              <button
                onClick={() => setIsAdminView(false)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  !isAdminView ? 'bg-brand-secondary text-white' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                User View
              </button>
              <button
                onClick={() => setIsAdminView(true)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isAdminView ? 'bg-brand-secondary text-white' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Admin View
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
