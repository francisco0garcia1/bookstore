"use client";

import { useContext, useState, useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Books  from './books/page';


export default function Home() {

  return (
      <Books />
  );
}
