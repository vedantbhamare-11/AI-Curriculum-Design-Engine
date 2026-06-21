// packages/frontend/src/utils/api.ts

/**
 * Global API Routing Client Workspace Manager
 * Fallback to your secure Render live cluster backend configuration routing map if the Vercel key isn't injected.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-curriculum-design-engine.onrender.com';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Ensure we strip out any accidental double slash collisions cleanly
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE_URL}${cleanEndpoint}`;

  // 💡 PRODUCTION UPGRADE: Detect if the transmission payload body is FormData
  const isFormData = options.body instanceof FormData;

  // If it's FormData, leave headers blank so the browser handles multi-part boundary assignments natively!
  const defaultHeaders: Record<string, string> = isFormData 
    ? {} 
    : { 'Content-Type': 'application/json' };

  // Safely convert options.headers into a plain object to prevent spreading undefined
  const customHeaders = options.headers ? Object.fromEntries(new Headers(options.headers).entries()) : {};

  const response = await fetch(targetUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...customHeaders,
    },
  });

  return response;
};