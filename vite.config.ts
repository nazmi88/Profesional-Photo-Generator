import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Fix: Cast process to any because the 'Process' type definition might be missing 'cwd' in this environment
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Attempt to find the API Key in various common variable names
  // Zeabur/Vercel often use just API_KEY, while Vite prefers VITE_API_KEY.
  const apiKey = env.API_KEY || env.VITE_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY || '';

  // Log to build console to help debugging
  if (mode === 'production' && !apiKey) {
    console.warn("⚠️  WARNING: API_KEY is not defined in the environment variables during build. The app will not work unless VITE_API_KEY is available at runtime.");
  } else if (apiKey) {
    console.log("✅ API Key detected during build configuration.");
  }

  return {
    plugins: [react()],
    define: {
      // Define a global constant string that gets replaced at build time
      '__GEMINI_API_KEY__': JSON.stringify(apiKey),
    },
    server: {
      port: 3000,
    },
  };
});