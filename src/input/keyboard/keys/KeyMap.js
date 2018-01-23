var KeyCodes = require('./KeyCodes');

var KeyMap = {};

for (var key in KeyCodes)
{
    KeyMap[KeyCodes[key]] = key;
}

module.exports = KeyMap;
