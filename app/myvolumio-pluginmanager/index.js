const requireFromString = require('require-from-string');

const _my_module = require('./lib/myvolumio_pluginmanager').unpack(__dirname);
const my_module = requireFromString(_my_module, __dirname + '/myvolumio_pluginmanager_real');
module.exports = my_module;
