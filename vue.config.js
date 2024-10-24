const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  pwa: {
    name: 'PomoPet',
    short_name: 'Pomo',
    themeColor: '#4DBA87',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '.',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp('^http://192.168.0.175:8080/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            },
          },
        },
        {
          urlPattern: new RegExp('.*\\.(?:js|css|html|png|jpg|jpeg|gif|svg)'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            },
          },
        },
      ],
    },
  },
})
