// Dynamic configuration for backend URL
// IMPORTANT: All evaluation happens at RUNTIME in the browser

// Get backend URL - ONLY evaluated in the browser at runtime
export function getBackendUrl() {
  // CRITICAL: Check window first to ensure we're in browser
  if (typeof window === 'undefined') {
    // During SSR/build, return placeholder
    return '__RUNTIME_ORIGIN__';
  }

  // Now we're guaranteed to be in the browser
  // Check if environment variable is set and is not our placeholder
  const envUrl = process.env.REACT_APP_BACKEND_URL;
  if (envUrl && envUrl !== '' && envUrl !== 'undefined' && envUrl !== '__RUNTIME_ORIGIN__') {
    console.log('🔧 Using configured env URL:', envUrl);
    return envUrl;
  }

  // In development mode, use localhost
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Using dev URL: http://localhost:8000');
    return 'http://localhost:8000';
  }

  // In production or if placeholder is set, use the current origin (same domain as frontend)
  const url = window.location.origin;
  console.log('🔧 Using production URL (window.location.origin):', url);
  return url;
}

// For backward compatibility - exports the placeholder which gets replaced at runtime
export const BACKEND_URL = '__RUNTIME_ORIGIN__';
export const API_URL = '__RUNTIME_ORIGIN__';
