import { useEffect, useState } from 'react';
import axios from 'axios';
import { getBackendUrl } from '../config';

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
        const backendUrl = getBackendUrl();
        const res = await axios.get(`${backendUrl}/api/settings/public`, {
          withCredentials: true
        });
        if (!mounted) return;
        const data = res.data?.data || {};
        setSettings({
          university_logo: data.university_logo ? `${backendUrl}${data.university_logo}` : null,
          faculty_logo: data.faculty_logo ? `${backendUrl}${data.faculty_logo}` : null,
          techhub_logo: data.techhub_logo ? `${backendUrl}${data.techhub_logo}` : null,
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
