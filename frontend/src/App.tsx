import { useState, useEffect } from 'react';
import './App.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Calculator } from './components/Calculator';

type View = 'login' | 'register' | 'calculator';

interface User {
  id: string;
  username: string;
  email: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setCurrentView('calculator');
      } catch (error) {
        // Token invalide, nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [token]); // Ajouter token pour éviter l'erreur TS

  const handleLogin = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentView('calculator');
  };

  const handleRegister = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentView('calculator');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        );
      case 'register':
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'calculator':
        return <Calculator />;
      default:
        return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Application Calculatrice</h1>
        {user && (
          <div className="user-info">
            <span>Connecté en tant que {user.username}</span>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;

