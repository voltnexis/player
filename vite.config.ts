import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isEmbed = mode === 'embed';

  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: isEmbed ? {
      lib: {
        entry: 'src/embed/index.tsx',
        name: 'VoltNexisPlayer',
        fileName: () => `player.js`,
        formats: ['umd']
      },
      rollupOptions: {
        external: [],
        output: {
          globals: {}
        }
      },
      emptyOutDir: false
    } : {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html'
        }
      }
    }
  };
});
