var RemoveEventListener = require('../../../dom/RemoveEventListener');

var RemoveKeyDown = function (target, listener)
{
    RemoveEventListener(target, 'keydown', listener);
};

module.exports = RemoveKeyDown;
