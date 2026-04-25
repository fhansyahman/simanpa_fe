import { useState, useEffect } from 'react';
import { wilayahAPI } from '@/lib/api';

export const useWilayah = () => {
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWilayahData = async () => {
    try {
      setLoading(true);
      const response = await wilayahAPI.getAll();
      const wilayahData = response.data.data || [];
      setWilayahList(wilayahData);
    } catch (error) {
      console.error('Error loading wilayah:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWilayahData();
  }, []);

  return {
    wilayahList,
    loading,
    loadWilayahData
  };
};