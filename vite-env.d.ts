// Fix: Removed <reference types="vite/client" /> to resolve "Cannot find type definition file" error.
// Added necessary module declarations manually.

// Global constant injected by Vite
declare const __GEMINI_API_KEY__: string;

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
