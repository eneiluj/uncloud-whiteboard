const path = require('path')
const webpackConfig = require('@nextcloud/webpack-vue-config')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'
webpackConfig.devtool = isDev ? 'cheap-source-map' : 'source-map'

webpackConfig.stats = {
    colors: true,
    modules: false,
}

webpackConfig.entry = {
    viewer: { import: path.join(__dirname, 'src', 'viewer.js'), filename: 'whiteboard-viewer.js' },
    filetypes: { import: path.join(__dirname, 'src', 'filetypes.js'), filename: 'whiteboard-filetypes.js' },
}

module.exports = webpackConfig
