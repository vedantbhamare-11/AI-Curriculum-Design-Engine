// packages/frontend/src/utils/api.ts

/**
 * Global API Routing Client Workspace Manager
 * Fallback to your secure Render live cluster backend configuration routing map if the Vercel key isn't injected.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-curriculum-design-engine.onrender.com';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE_URL}${cleanEndpoint}`;

  // 💡 PRODUCTION UPGRADE: Detect if the transmission payload body is FormData
  const isFormData = options.body instanceof FormData;

  // If it's FormData, leave headers blank so the browser handles multi-part boundary assignments natively!
  const defaultHeaders: Record<string, string> = isFormData 
    ? {} 
    : { 'Content-Type': 'application/json' };

  const response = await fetch(targetUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return response;
};