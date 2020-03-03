const { createObject } = require('../utils');

module.exports.buildMetrics = createObject(['BUILD_TIME', 'APP_SIZE']);

module.exports.buildPath = {
  react: 'build',
  vue: 'dist',
  nuxt: '.nuxt'
};

module.exports.extraBuildParams = {
  react: 'development',
  vue: '',
  nuxt: ''
};
