import React, { useState } from 'react';
import { X, Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminLoginModalProps {
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !pass) {
      setError('請輸入信箱與密碼');
      return;
    }

    setLoading(true);
    try {
      await login(email, pass);
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/invalid-email') setError('信箱格式不正確');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') setError('帳號或密碼錯誤');
      else setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Lock size={20} className="text-gray-600" />
            登入後台
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">管理員信箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full border rounded pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="example@mail.com" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="password" 
                value={pass} 
                onChange={e => setPass(e.target.value)} 
                className="w-full border rounded pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-2.5 rounded hover:bg-black transition font-bold disabled:opacity-50"
          >
            {loading ? '登入中...' : '安全登入'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
