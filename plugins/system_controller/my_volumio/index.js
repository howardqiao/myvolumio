const requireFromString = require('require-from-string');

const _my_module = require('./lib/my_volumio').unpack(__dirname);
const my_module = requireFromString(_my_module, __dirname + '/my_volumio_real');
module.exports = my_module;
