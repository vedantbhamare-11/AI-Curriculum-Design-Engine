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

  const response = await fetch(targetUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
};