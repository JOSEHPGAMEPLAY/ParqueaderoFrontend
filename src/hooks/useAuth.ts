import { useState, useEffect } from 'react';
import { decodeToken, DecodedToken } from '../utils/decodeToken';

export const useAuth = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      setRole(decoded?.role || null);
    }
    setLoading(false);
  }, []);

  return { role, loading };
};