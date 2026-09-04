import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar si hay sesión activa al montar la app
    const activeToken = localStorage.getItem('token');
    setToken(activeToken);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Cargando...</div>;
  }

  // Render condicional: Si hay token va al Dashboard, si no, al Login
  return token ? <Dashboard /> : <Login />;
}

export default App;