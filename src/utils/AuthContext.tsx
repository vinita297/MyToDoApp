import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { StorageService } from '../services/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const currentUser = await StorageService.getCurrentUser();
    setUser(currentUser);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const existingUser = await StorageService.findUserByEmail(email);
      
      if (existingUser && existingUser.password === password) {
        setUser(existingUser);
        await StorageService.setCurrentUser(existingUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const existingUser = await StorageService.findUserByEmail(email);
      
      if (existingUser) {
        return false; // User already exists
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };
      
      await StorageService.saveUser(newUser);
      setUser(newUser);
      await StorageService.setCurrentUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await StorageService.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};