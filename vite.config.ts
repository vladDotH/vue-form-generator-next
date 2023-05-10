import { fileURLToPath, URL } from "node:url";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: false,
    commonjsOptions: {
      esmExternals: true
    },
    lib: {
      entry: "./src/index.ts",
      name: "vfg-next",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `vfg-next.${format}.js`
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        assetFileNames: `vfg-next.[ext]`,
        globals: {
          vue: "Vue"
        }
      }
    }
  },

  css: { preprocessorOptions: { scss: { charset: false } } },

  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    dts({
      tsConfigFilePath: "./tsconfig.json",
      insertTypesEntry: true
    })
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },

  server: {
    host: true,
    open: "./src/dev/index.html"
  }
});
