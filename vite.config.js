// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000'

  let cookieDomainRewrite = 'localhost'
  try {
    cookieDomainRewrite = new URL(apiProxyTarget).hostname
  } catch (error) {
    cookieDomainRewrite = 'localhost'
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // <-- alias @/...
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite,
          cookiePathRewrite: { '/': '/' },
        },
      },
    },
  }
})
