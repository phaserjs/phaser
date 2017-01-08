var RemoveEventListener = require('../../../dom/RemoveEventListener');

var RemoveKeyPress = function (target, listener)
{
    RemoveEventListener(target, 'keypress', listener);
};

module.exports = RemoveKeyPress;
