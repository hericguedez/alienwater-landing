import { createClient } from '@insforge/sdk';

const url = import.meta.env.VITE_INSFORGE_URL;
const key = import.meta.env.VITE_INSFORGE_API_KEY;

if (!url || !key) {
  console.warn("InsForge environment variables VITE_INSFORGE_URL and VITE_INSFORGE_API_KEY must be set.");
}

export const insforge = createClient({
  baseUrl: url,
  anonKey: key
});
