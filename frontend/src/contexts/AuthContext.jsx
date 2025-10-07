import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Validate the token by making a request to a protected endpoint
          const response = await api.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          // Token is invalid, remove it
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const guestLogin = async () => {
    try {
      // Generate a random username for guest users
      const randomAdjective = ['Cool', 'Swift', 'Bright', 'Quick', 'Clever', 'Smart', 'Wise', 'Bold', 'Keen', 'Sharp', 'Noble', 'Calm', 'Brave', 'Sly', 'Witty', 'Savvy', 'Sage', 'Lively', 'Cheerful', 'Gentle'];
      const randomNoun = ['Tiger', 'Eagle', 'Falcon', 'Panther', 'Wolf', 'Lion', 'Hawk', 'Bear', 'Fox', 'Deer', 'Owl', 'Horse', 'Shark', 'Dolphin', 'Eagle', 'Raven', 'Sparrow', 'Lynx', 'Cougar', 'Heron'];
      
      const randomAdjectiveChoice = randomAdjective[Math.floor(Math.random() * randomAdjective.length)];
      const randomNounChoice = randomNoun[Math.floor(Math.random() * randomNoun.length)];
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
      
      const randomUsername = `${randomAdjectiveChoice}${randomNounChoice}${randomNumber}`;
      
      const response = await api.post('/auth/guest-login', { name: randomUsername });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Guest login error:', error);
      return { success: false, message: 'Guest login failed' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
    }
  };

  const value = {
    user,
    login,
    guestLogin,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};