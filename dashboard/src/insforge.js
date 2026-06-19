import { createClient } from '@insforge/sdk';

const url = import.meta.env.VITE_INSFORGE_URL || 'https://insforge.alienwatermcbo.com';
const key = import.meta.env.VITE_INSFORGE_API_KEY || 'ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6';

export const insforge = createClient({
  baseUrl: url,
  anonKey: key
});
