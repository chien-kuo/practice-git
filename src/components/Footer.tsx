import React from 'react';
import { useStore } from '../store/useStore';
import { APP_ID } from '../utils/constants';

const Footer: React.FC = () => {
  const { user } = useStore();

  return (
    <footer className="text-center py-4 text-xs text-gray-400 mt-auto border-t">
      <p>App ID: <span className="font-mono bg-gray-200 px-1 rounded text-gray-600">{APP_ID}</span></p>
      <p>
        Status: {user 
          ? (user.isAnonymous ? '已連線 (匿名訪客)' : `已連線 (管理員: ${user.email})`) 
          : '連線中...'}
      </p>
    </footer>
  );
};

export default Footer;
