var AddEventListener = require('../../../dom/AddEventListener');

//  Adds a keyup event listener to the specified target (usually 'window')

var AddKeyUp = function (target, listener, useCapture)
{
    AddEventListener(target, 'keyup', listener, useCapture);
};

module.exports = AddKeyUp;
