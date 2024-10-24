import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tsConfigPaths()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@teste': resolve(__dirname, 'test'),
    },
  },
})
