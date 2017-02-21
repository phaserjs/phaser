var AddEventListener = require('../../../dom/AddEventListener');

//  Adds a keydown event listener to the specified target (usually 'window')

var AddKeyDown = function (target, listener, useCapture)
{
    AddEventListener(target, 'keydown', listener, useCapture);
};

module.exports = AddKeyDown;
