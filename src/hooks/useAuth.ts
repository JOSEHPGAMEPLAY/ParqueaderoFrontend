import { useState, useEffect } from 'react';
import { getMe } from '../services/auth';

export const useAuth = () => {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setRole(res.role || null);
        setUserId(res.userId || null);
      } catch (err) {
        setRole(null);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { role, userId, loading, isAuthenticated: !!role };
};