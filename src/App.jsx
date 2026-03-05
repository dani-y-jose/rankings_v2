import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PlaceDetail from './components/PlaceDetail';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentView('dashboard');
    setSelectedPlaceId(null);
  };

  const openPlace = (placeId) => {
    setSelectedPlaceId(placeId);
    setCurrentView('detail');
  };

  const goToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedPlaceId(null);
  };

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const userEmail = session.user.email || '';
  const userName = userEmail.split('@')[0];
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⭐</span>
          <h1>Ranking</h1>
        </div>
        <div className="header-actions">
          <div className="user-badge">
            <div className="avatar">{userInitial}</div>
            <span>{userName}</span>
          </div>
          <button className="btn btn-ghost" onClick={handleSignOut}>
            Salir
          </button>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard
            session={session}
            onOpenPlace={openPlace}
          />
        )}
        {currentView === 'detail' && selectedPlaceId && (
          <PlaceDetail
            session={session}
            placeId={selectedPlaceId}
            onBack={goToDashboard}
          />
        )}
      </main>
    </div>
  );
}

export default App;
