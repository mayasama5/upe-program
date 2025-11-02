import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + error);
        return;
      }

      if (token) {
        // Save token to localStorage
        localStorage.setItem('token', token);

        // Decode token to get user info (basic JWT decode)
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const payload = JSON.parse(jsonPayload);

          // Update user state
          updateUser({
            id: payload.id,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            is_verified: payload.is_verified,
            picture: payload.picture
          });

          // Redirect based on role
          if (payload.role === 'admin') {
            navigate('/admin');
          } else if (payload.role === 'estudiante' || payload.role === 'empresa') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          navigate('/login?error=invalid_token');
        }
      } else {
        navigate('/login?error=no_token');
      }
    };

    handleCallback();
  }, [searchParams, navigate, updateUser]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
