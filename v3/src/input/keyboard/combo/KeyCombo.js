var GetObjectValue = require('../../../utils/object/GetObjectValue');

//  Keys can be either:
//  
//  A string (ATARI)
//  An array of either integers (key codes) or strings, or a mixture of both
//  An array of objects (such as Key objects) with a public 'keyCode' property

var KeyCombo = function (keyboardManager, keys, config)
{
    //  Can't have a zero or single length combo (string or array based)
    if (keys.length < 2)
    {
        return false;
    }

    this.manager = keyboardManager;

    this.enabled = true;

    this.keyCodes = [];

    //  if 'keys' is a string we need to get the keycode of each character in it

    for (var i = 0; i < keys.length; i++)
    {
        var char = keys[i];

        if (typeof char === 'string')
        {
            this.keyCodes.push(char.toUpperCase().charCodeAt(0));
        }
        else if (typeof char === 'number')
        {
            this.keyCodes.push(char);
        }
        else if (char.hasOwnProperty('keyCode'))
        {
            this.keyCodes.push(char.keyCode);
        }
    }

    //  The current keyCode the combo is waiting for
    this.current = this.keyCodes[0];

    //  The current index of the key being waited for in the 'keys' string
    this.index = 0;

    //  The length of this combo (in keycodes)
    this.size = this.keyCodes.length;

    //  The time the previous key in the combo was matched
    this.timeLastMatched = 0;

    //  Has this Key Combo been matched yet?
    this.matched = false;

    //  The time the entire combo was matched
    this.timeMatched = 0;

    //  Custom options ...

    //  If they press the wrong key do we reset the combo?
    this.resetOnWrongKey = GetObjectValue(config, 'resetOnWrongKey', true);

    //  The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
    this.maxKeyDelay = GetObjectValue(config, 'maxKeyDelay', 0);

    //  If previously matched and they press Key 1 again, will it reset?
    this.resetOnMatch = GetObjectValue(config, 'resetOnMatch', false);
};

KeyCombo.prototype.constructor = KeyCombo;

KeyCombo.prototype = {



};

module.exports = KeyCombo;
