import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

import pugPlugin from "vite-plugin-pug"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    pugPlugin()
  ],

  root: './dev',

  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // server: {
  //   open:'dev/projects/basic/index.html',
  // },
  //
  // rollupOptions: {
  //   input: {
  //     basic: path.resolve(__dirname, 'dev/projects/basic/index.html'),
  //     checklist: path.resolve(__dirname, 'projects/checklist/index.html'),
  //   },
  // }
})
