// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// export default defineConfig({
//   plugins: [react()],
//   server: { host: "0.0.0.0", port: 5173 },
// });



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // The v4 plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Initialize it here
  ],
})