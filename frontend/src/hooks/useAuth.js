import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useToast } from './use-toast';
import { getBackendUrl } from '../config';

// Get backend URL at runtime
const getUrl = () => getBackendUrl();

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Setup axios interceptor to include token in requests
  useEffect(() => {
    const token = localStorage.getItem('token');

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Setup response interceptor to handle maintenance mode and auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check if it's a maintenance mode response
        if (error.response?.status === 503 && error.response?.data?.maintenance) {
          if (window.location.pathname !== '/maintenance') {
            window.location.href = '/maintenance';
          }
        }

        // Handle unauthorized errors
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${getUrl()}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to check auth:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${getUrl()}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${user.name}`,
      });

      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);

      // Traducir mensajes de error al español
      let errorMessage = 'Error al iniciar sesión';

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        if (msg.includes('Invalid credentials') || msg.includes('Invalid email or password')) {
          errorMessage = 'Correo electrónico o contraseña incorrectos';
        } else if (msg.includes('User not found')) {
          errorMessage = 'Usuario no encontrado';
        } else {
          errorMessage = msg;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${getUrl()}/api/auth/register`, userData);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
      });

      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);

      // Traducir mensajes de error al español
      let errorMessage = 'Error al registrar usuario';

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        if (msg.includes('already exists') || msg.includes('already registered')) {
          errorMessage = 'Ya existe una cuenta con este correo electrónico';
        } else if (msg.includes('Invalid email')) {
          errorMessage = 'Correo electrónico inválido';
        } else if (msg.includes('Password must be at least')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        } else if (msg.includes('Missing required fields')) {
          errorMessage = 'Por favor completa todos los campos requeridos';
        } else if (msg.includes('Invalid role')) {
          errorMessage = 'Rol de usuario inválido';
        } else {
          errorMessage = msg;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${getUrl()}/api/auth/logout`);

      localStorage.removeItem('token');
      setUser(null);

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });

      window.location.href = "/";
    } catch (error) {
      console.error('Logout failed:', error);

      // Even if server logout fails, clear local state
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = "/";
    }
  };

  const loginWithGoogle = async (role = 'estudiante') => {
    try {
      // Get Google OAuth URL from backend with role parameter
      const response = await axios.get(`${getUrl()}/api/auth/google`, {
        params: { role }
      });
      const { url } = response.data;

      // Redirect to Google OAuth
      window.location.href = url;

      return { success: true };
    } catch (error) {
      console.error('Google login failed:', error);

      toast({
        title: "Error",
        description: "No se pudo iniciar sesión con Google",
        variant: "destructive"
      });

      return { success: false, error: 'Failed to initiate Google login' };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    updateUser,
    isSignedIn: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
