const requireFromString = require('require-from-string');

const _my_module = require('./lib/streaming_services').unpack(__dirname);
const my_module = requireFromString(_my_module, __dirname + '/streaming_services_real');
module.exports = my_module;
