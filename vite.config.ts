import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({mode}) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Ensure root-level `assets/` is available on Vercel after build
      viteStaticCopy({
        targets: [{ src: 'assets/img/*', dest: 'assets/img' }],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('motion')) return 'motion';
            return 'vendor';
          },
        },
      },
    },
  };
});
