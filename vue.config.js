const path = require('path')
const webpack = require('webpack')

const resolve = pathString => {
  return path.resolve(path.join(__dirname, pathString))
}

const plugins = [
  new webpack.EnvironmentPlugin({
    API_URL: process.env.VUE_APP_API_URL ? JSON.stringify(process.env.VUE_APP_API_URL) : '/'
  }),

  new webpack.ProvidePlugin({
    mapGetters: ['vuex', 'mapGetters'],
    mapMutations: ['vuex', 'mapMutations'],
    mapActions: ['vuex', 'mapActions'],
    mapState: ['vuex', 'mapState'],
    mutation: [resolve('./src/store/MutationTypes')],
    action: [resolve('./src/store/ActionTypes')]
  }),
]

module.exports = {
  publicPath: process.env.VUE_APP_API_URL ? '.' : '/',
  lintOnSave: 'error',
  devServer: {
    port: process.env.VUE_APP_PORT,
    proxy: {
      '^/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/scss/_global.scss";`,
      },
    },
  },

  configureWebpack: {
    plugins,
    resolve: {
      alias: {
        src: resolve('src/'),
      },
    },
  },

  pluginOptions: {
    cordovaPath: 'mobile-app'
  }
}
