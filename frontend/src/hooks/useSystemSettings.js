import { useEffect, useState } from 'react';
import axios from 'axios';

// Same logic used across the app
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://upe-rfchnhw6m-gustavogamarra95s-projects.vercel.app');

export function useSystemSettings() {
  const [settings, setSettings] = useState({
    university_logo: null,
    faculty_logo: null,
    techhub_logo: null,
    updated_at: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/settings/public`, {
          withCredentials: true
        });
        if (!mounted) return;
        const data = res.data?.data || {};
        setSettings({
          university_logo: data.university_logo ? `${BACKEND_URL}${data.university_logo}` : null,
          faculty_logo: data.faculty_logo ? `${BACKEND_URL}${data.faculty_logo}` : null,
          techhub_logo: data.techhub_logo ? `${BACKEND_URL}${data.techhub_logo}` : null,
          updated_at: data.updated_at || null
        });
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => { mounted = false; };
  }, []);

  return { settings, loading, error };
}
