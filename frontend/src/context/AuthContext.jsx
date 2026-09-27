import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || localStorage.getItem('rural_edu_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || localStorage.getItem('rural_edu_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('rural_edu_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('rural_edu_user', JSON.stringify(user));
    }
  }, [token, user]);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const jwtToken = res.data.token;
    const userObj = {
      id: res.data.id,
      email: res.data.email,
      fullName: res.data.fullName,
      role: res.data.role,
    };

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('rural_edu_token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('rural_edu_user', JSON.stringify(userObj));

    setToken(jwtToken);
    setUser(userObj);

    return res.data;
  };

  const registerStudent = async (data) => {
    const res = await axiosClient.post('/auth/register', data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rural_edu_token');
    localStorage.removeItem('user');
    localStorage.removeItem('rural_edu_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registerStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
