import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = (userData) => {
    const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    
    // Check if email already exists
    const existingUserByEmail = existingUsers.find(u => u.email === userData.email);
    if (existingUserByEmail) {
      return { success: false, error: 'An account with this email already exists. Please login instead.' };
    }

    // Check if matric number already exists (for student accounts)
    if (userData.email.includes('@student.usm.my')) {
      const existingUserByMatric = existingUsers.find(u => u.matricNumber === userData.matricNumber);
      if (existingUserByMatric) {
        return { 
          success: false, 
          error: 'This matric number is already registered. Please use your existing account or contact support if you need help.' 
        };
      }
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      role: userData.email.includes('@student.usm.my') ? 'student' : 'admin'
    };

    existingUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
    
    return { success: true, user: newUser };
  };

  const login = (email, password) => {
    // Check mock users first
    let foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    // Then check localStorage for registered users
    if (!foundUser) {
      const registeredUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    }

    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500);
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isTechnician: user?.role === 'technician' // Add this line
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};