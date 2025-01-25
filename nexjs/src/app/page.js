"use client";

import { useContext, useState, useEffect } from 'react';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  return (
    <ProtectedRoute>
      <h1>Hello world!</h1>
    </ProtectedRoute>
  );
}
