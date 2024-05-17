import { ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Login from './routes/login';
import Manage from './routes/manage';
import darkTheme from './theme'; // Import the dark theme

// Define AuthContextType
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create AuthContext with default value of null
const AuthContext = createContext<AuthContextType | null>(null);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={darkTheme}> {/* Apply the dark theme */}
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/admin"
              element={isAuthenticated ? <Manage /> : <Navigate to="/" />}
            />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default App;
