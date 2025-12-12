/**
 * Helper to normalize URLs from database
 * Replaces localhost URLs with production URL
 */
const normalizeImageUrl = (url, req) => {
  if (!url) return url;

  // Si ya es una URL completa y no es localhost, devolver tal cual
  if (url.startsWith('http') && !url.includes('localhost')) {
    return url;
  }

  // Si es localhost o una ruta relativa, reemplazar con la URL correcta
  let baseUrl;
  if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
    baseUrl = process.env.FRONTEND_URL;
  } else if (req) {
    baseUrl = `${req.protocol}://${req.get('host')}`;
  } else {
    baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
  }

  // Si la URL contiene localhost, extraer solo la parte de /uploads/...
  if (url.includes('localhost')) {
    const uploadsIndex = url.indexOf('/uploads/');
    if (uploadsIndex !== -1) {
      url = url.substring(uploadsIndex);
    }
  }

  // Si es una ruta relativa, agregar el baseUrl
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }

  return url;
};

/**
 * Normalize all image URLs in an object
 */
const normalizeObjectUrls = (obj, req, imageFields = ['picture', 'logo_url', 'image_url', 'cv_file_path']) => {
  if (!obj) return obj;

  const normalized = { ...obj };

  imageFields.forEach(field => {
    if (normalized[field]) {
      normalized[field] = normalizeImageUrl(normalized[field], req);
    }
  });

  // Handle arrays of file objects
  if (normalized.certificate_files && Array.isArray(normalized.certificate_files)) {
    normalized.certificate_files = normalized.certificate_files.map(file => {
      // If it's a string, normalize it directly
      if (typeof file === 'string') {
        return normalizeImageUrl(file, req);
      }
      // If it's an object with a url property, normalize the url
      if (file && typeof file === 'object' && file.url) {
        return {
          ...file,
          url: normalizeImageUrl(file.url, req)
        };
      }
      return file;
    });
  }

  if (normalized.degree_files && Array.isArray(normalized.degree_files)) {
    normalized.degree_files = normalized.degree_files.map(file => {
      // If it's a string, normalize it directly
      if (typeof file === 'string') {
        return normalizeImageUrl(file, req);
      }
      // If it's an object with a url property, normalize the url
      if (file && typeof file === 'object' && file.url) {
        return {
          ...file,
          url: normalizeImageUrl(file.url, req)
        };
      }
      return file;
    });
  }

  return normalized;
};

/**
 * Normalize URLs in an array of objects
 */
const normalizeArrayUrls = (array, req, imageFields) => {
  if (!Array.isArray(array)) return array;
  return array.map(item => normalizeObjectUrls(item, req, imageFields));
};

module.exports = {
  normalizeImageUrl,
  normalizeObjectUrls,
  normalizeArrayUrls
};
