
import React, { useState } from 'react';
import Header from './components/Header';
import AdminView from './components/AdminView';
import UserView from './components/UserView';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header isAdminView={isAdminView} setIsAdminView={setIsAdminView} />
      <main>
        {isAdminView ? <AdminView /> : <UserView />}
      </main>
      <footer className="bg-slate-100 text-center py-4 mt-8 border-t">
        <p className="text-sm text-slate-500">&copy; 2023 Knowledge Finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
