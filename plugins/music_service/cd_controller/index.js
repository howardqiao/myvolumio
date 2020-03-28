const requireFromString = require('require-from-string');

module.exports = function(context, keys) {
    const _my_module = require('./lib/cd_controller').unpack(__dirname, keys.iv, keys.key);
    const my_module = requireFromString(_my_module, __dirname + '/cd_controller_real');
    return new my_module(context);
}
