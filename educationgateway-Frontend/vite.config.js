// import react from '@vitejs/plugin-react';
// import { defineConfig } from 'vite';

// // https://vite.dev/config/
// export default defineConfig({
//   css: {
//     postcss: './postcss.config.js', // Specify path if necessary
//   },
//   plugins: [react()],
//   build: {
//     sourcemap: false, // ✅ Disable source maps in production
//   },
//   server: {
//     port: 5173, // ✅ Dev server port
//   },
//   preview: {
//     port: 5173, // ✅ Force preview to run on same port
//   },
// });


import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../GateWay-Education-Backend-main/cert/key.pem'),
      cert: fs.readFileSync('../GateWay-Education-Backend-main/cert/cert.pem'),
    },
    port: 5173,
  },
});

