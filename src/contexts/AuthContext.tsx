
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'farmer' | 'buyer' | 'admin') => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'farmer' | 'buyer' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    // Admin login check
    if (role === 'admin' && email === 'thechauhanvivek@gmail.com' && password === 'vivek@99246') {
      const adminUser: User = {
        id: 'admin-1',
        email,
        role: 'admin',
        name: 'Admin',
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }

    // Regular user login (mock implementation)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      role: userData.role!,
      name: userData.name!,
      phone: userData.phone,
      aadhaar: userData.aadhaar,
      location: userData.location,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
