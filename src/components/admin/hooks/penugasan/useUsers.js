import { useState, useEffect } from 'react';
import { usersAPI } from '@/lib/api';

export const useUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsersData = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsersList(response.data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersData();
  }, []);

  return {
    usersList,
    loading,
    loadUsersData
  };
};