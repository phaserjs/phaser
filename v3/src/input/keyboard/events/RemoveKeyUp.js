var RemoveEventListener = require('../../../dom/RemoveEventListener');

var RemoveKeyUp = function (target, listener)
{
    RemoveEventListener(target, 'keyup', listener);
};

module.exports = RemoveKeyUp;
