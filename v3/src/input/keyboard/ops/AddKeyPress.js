var AddEventListener = require('../../../dom/AddEventListener');

//  Adds a keypress event listener to the specified target (usually 'window')

var AddKeyPress = function (target, listener, useCapture)
{
    AddEventListener(target, 'keypress', listener, useCapture);
};

module.exports = AddKeyPress;
