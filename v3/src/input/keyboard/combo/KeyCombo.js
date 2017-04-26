var GetValue = require('../../../utils/object/GetValue');
var ResetKeyCombo = require('./ResetKeyCombo');
var ProcessKeyCombo = require('./ProcessKeyCombo');
var KeyComboMatchEvent = require('./KeyComboMatchEvent');

//  Keys can be either:
//
//  A string (ATARI)
//  An array of either integers (key codes) or strings, or a mixture of both
//  An array of objects (such as Key objects) with a public 'keyCode' property

var KeyCombo = function (keyboardManager, keys, config)
{
    if (config === undefined) { config = {}; }

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
    this.resetOnWrongKey = GetValue(config, 'resetOnWrongKey', true);

    //  The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
    this.maxKeyDelay = GetValue(config, 'maxKeyDelay', 0);

    //  If previously matched and they press Key 1 again, will it reset?
    this.resetOnMatch = GetValue(config, 'resetOnMatch', false);

    //  If the combo matches, will it delete itself?
    this.deleteOnMatch = GetValue(config, 'deleteOnMatch', false);

    var _this = this;

    var onKeyDownHandler = function (event)
    {
        if (_this.matched || !_this.enabled)
        {
            return;
        }

        var matched = ProcessKeyCombo(event.data, _this);

        if (matched)
        {
            _this.manager.events.dispatch(new KeyComboMatchEvent(_this, event));

            if (_this.resetOnMatch)
            {
                ResetKeyCombo(_this);
            }
            else if (_this.deleteOnMatch)
            {
                _this.destroy();
            }
        }
    };

    this.onKeyDown = onKeyDownHandler;

    this.manager.events.on('KEY_DOWN_EVENT', onKeyDownHandler);
};

KeyCombo.prototype.constructor = KeyCombo;

KeyCombo.prototype = {

    destroy: function ()
    {
        this.enabled = false;
        this.keyCodes = [];

        this.manager.events.off('KEY_DOWN', this.onKeyDown);
        this.manager = undefined;
    }

};

Object.defineProperties(KeyCombo.prototype, {

    progress: {

        enumerable: true,

        //  How far complete is this combo? A value between 0 and 1.
        get: function ()
        {
            return this.index / this.size;
        }

    }

});

module.exports = KeyCombo;
