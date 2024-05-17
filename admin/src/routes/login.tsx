import { Alert, Box, Button, CircularProgress, Container, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { AuthService } from '../services/auth.service';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await AuthService.login(username, password);
      auth!.login(data.access_token);
      navigate('/admin');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await AuthService.verifyToken(token);
          if (response) {
            auth!.login(token); // Ensure the login function is called to set isAuthenticated
            navigate('/admin');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
        }
      }
    };

    verifyToken();
  }, [auth, navigate]); // Run only once upon mount

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          {error && (
            <Alert severity="error" style={{ marginTop: '20px' }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default Login;
