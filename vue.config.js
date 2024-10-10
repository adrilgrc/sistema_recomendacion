const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',   // Permite que el servidor esté disponible externamente
    allowedHosts: 'all' // Permite todas las conexiones externas
  }
})
