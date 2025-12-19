import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'admin' | null;

interface AuthContextType {
  role: UserRole;
  userId: string | null;
  login: (role: UserRole, userId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const login = (newRole: UserRole, newUserId?: string) => {
    setRole(newRole);
    setUserId(newUserId || `USR-${Date.now()}`);
  };

  const logout = () => {
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
