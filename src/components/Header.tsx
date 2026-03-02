import React from 'react';
import { Building2, ShieldUser, LogOut } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onAdminClick }) => {
  return (
    <header className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold flex items-center">
          <Building2 className="mr-3" size={24} />
          社區意見調查
        </h1>
        <button 
          onClick={onAdminClick}
          data-testid="admin-header-button"
          className={`text-sm px-4 py-2 rounded transition flex items-center gap-2 ${
            isAdmin 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-700 hover:bg-blue-600 border border-blue-400'
          }`}
        >
          {isAdmin ? <LogOut size={16} /> : <ShieldUser size={16} />}
          {isAdmin ? '登出管理' : '管理者後台'}
        </button>
      </div>
    </header>
  );
};

export default Header;
