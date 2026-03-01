import React, { useState } from 'react';
import { useStore } from './store/useStore';
import { useAuth } from './hooks/useAuth';
import { useSurvey } from './hooks/useSurvey';
import Header from './components/Header';
import Footer from './components/Footer';
import SurveyForm from './components/SurveyForm';
import OpinionTable from './components/OpinionTable';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';

const App: React.FC = () => {
  const { error, isAdmin } = useStore();
  const { logout } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useSurvey(); // Init data listener

  return (
    <div className="min-h-screen pb-12 flex flex-col relative bg-gray-50">
      {error && (
        <div className="bg-red-600 text-white px-4 py-3 text-center shadow-md animate-pulse">
          <i className="fas fa-exclamation-triangle mr-2"></i>{error}
        </div>
      )}

      <Header 
        isAdmin={isAdmin} 
        onAdminClick={() => isAdmin ? logout() : setShowAdminLogin(true)} 
      />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        {isAdmin && <AdminDashboard />}

        <div className="grid md:grid-cols-12 gap-8">
          {!isAdmin && (
            <div className="md:col-span-4">
              <SurveyForm />
            </div>
          )}
          <div className={isAdmin ? "md:col-span-12" : "md:col-span-8"}>
            <OpinionTable />
          </div>
        </div>
      </main>

      <Footer />

      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
};

export default App;
