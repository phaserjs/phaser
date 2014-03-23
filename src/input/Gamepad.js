/**
* @author       @karlmacklin <tacklemcclean@gmail.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Gamepad class handles looking after gamepad input for your game.
* Remember to call gamepad.start(); expecting input!
*
* HTML5 GAMEPAD API SUPPORT IS AT AN EXPERIMENTAL STAGE!
* At moment of writing this (end of 2013) only Chrome supports parts of it out of the box. Firefox supports it
* via prefs flags (about:config, search gamepad). The browsers map the same controllers differently.
* This class has constans for Windows 7 Chrome mapping of
* XBOX 360 controller.
*
* @class Phaser.Gamepad
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Gamepad = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Array<Phaser.SinglePad>} _gamepads - The four Phaser Gamepads.
    * @private
    */
    this._gamepads = [
        new Phaser.SinglePad(game, this),
        new Phaser.SinglePad(game, this),
        new Phaser.SinglePad(game, this),
        new Phaser.SinglePad(game, this)
    ];

    /**
    * @property {Object} _gamepadIndexMap - Maps the browsers gamepad indices to our Phaser Gamepads
    * @private
    */
    this._gamepadIndexMap = {};

    /**
    * @property {Array} _rawPads - The raw state of the gamepads from the browser
    * @private
    */
    this._rawPads = [];

    /**
    * @property {boolean} _active - Private flag for whether or not the API is polled
    * @private
    * @default
    */
    this._active = false;

    /**
    * You can disable all Gamepad Input by setting disabled to true. While true all new input related events will be ignored.
    * @property {boolean} disabled - The disabled state of the Gamepad.
    * @default
    */
    this.disabled = false;

    /**
    * Whether or not gamepads are supported in the current browser. Note that as of Dec. 2013 this check is actually not accurate at all due to poor implementation.
    * @property {boolean} _gamepadSupportAvailable - Are gamepads supported in this browser or not?
    * @private
    */
    this._gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads || (navigator.userAgent.indexOf('Firefox/') != -1) || !!navigator.getGamepads;

    /**
    * Used to check for differences between earlier polls and current state of gamepads.
    * @property {Array} _prevRawGamepadTypes
    * @private
    * @default
    */
    this._prevRawGamepadTypes = [];

    /**
    * Used to check for differences between earlier polls and current state of gamepads.
    * @property {Array} _prevTimestamps
    * @private
    * @default
    */
    this._prevTimestamps = [];

    /**
    * @property {Object} callbackContext - The context under which the callbacks are run.
    */
    this.callbackContext = this;

    /**
    * @property {function} onConnectCallback - This callback is invoked every time any gamepad is connected
    */
    this.onConnectCallback = null;

    /**
    * @property {function} onDisconnectCallback - This callback is invoked every time any gamepad is disconnected
    */
    this.onDisconnectCallback = null;

    /**
    * @property {function} onDownCallback - This callback is invoked every time any gamepad button is pressed down.
    */
    this.onDownCallback = null;

    /**
    * @property {function} onUpCallback - This callback is invoked every time any gamepad button is released.
    */
    this.onUpCallback = null;

    /**
    * @property {function} onAxisCallback - This callback is invoked every time any gamepad axis is changed.
    */
    this.onAxisCallback = null;

    /**
    * @property {function} onFloatCallback - This callback is invoked every time any gamepad button is changed to a value where value > 0 and value < 1.
    */
    this.onFloatCallback = null;

    /**
    * @property {function} _ongamepadconnected - Private callback for Firefox gamepad connection handling
    * @private
    */
    this._ongamepadconnected = null;

    /**
    * @property {function} _gamepaddisconnected - Private callback for Firefox gamepad connection handling
    * @private
    */
    this._gamepaddisconnected = null;
};

Phaser.Gamepad.prototype = {

    /**
    * Add callbacks to the main Gamepad handler to handle connect/disconnect/button down/button up/axis change/float value buttons
    * @method Phaser.Gamepad#addCallbacks
    * @param {Object} context - The context under which the callbacks are run.
    * @param {Object} callbacks - Object that takes six different callback methods:
    * onConnectCallback, onDisconnectCallback, onDownCallback, onUpCallback, onAxisCallback, onFloatCallback
    */
    addCallbacks: function (context, callbacks) {

        if (typeof callbacks !== 'undefined')
        {
            this.onConnectCallback = (typeof callbacks.onConnect === 'function') ? callbacks.onConnect : this.onConnectCallback;
            this.onDisconnectCallback = (typeof callbacks.onDisconnect === 'function') ? callbacks.onDisconnect : this.onDisconnectCallback;
            this.onDownCallback = (typeof callbacks.onDown === 'function') ? callbacks.onDown : this.onDownCallback;
            this.onUpCallback = (typeof callbacks.onUp === 'function') ? callbacks.onUp : this.onUpCallback;
            this.onAxisCallback = (typeof callbacks.onAxis === 'function') ? callbacks.onAxis : this.onAxisCallback;
            this.onFloatCallback = (typeof callbacks.onFloat === 'function') ? callbacks.onFloat : this.onFloatCallback;
        }

    },

    /**
    * Starts the Gamepad event handling.
    * This MUST be called manually before Phaser will start polling the Gamepad API.
    *
    * @method Phaser.Gamepad#start
    */
    start: function () {

        if (this._active)
        {
            //  Avoid setting multiple listeners
            return;
        }

        this._active = true;

        var _this = this;

        this._ongamepadconnected = function(event) {
            var newPad = event.gamepad;
            _this._rawPads.push(newPad);
            _this._gamepads[newPad.index].connect(newPad);
        };

        window.addEventListener('gamepadconnected', this._ongamepadconnected, false);

        this._ongamepaddisconnected = function(event) {

            var removedPad = event.gamepad;

            for (var i in _this._rawPads)
            {
                if (_this._rawPads[i].index === removedPad.index)
                {
                    _this._rawPads.splice(i,1);
                }
            }
            _this._gamepads[removedPad.index].disconnect();
        };

        window.addEventListener('gamepaddisconnected', this._ongamepaddisconnected, false);

    },

    /**
    * Main gamepad update loop. Should not be called manually.
    * @method Phaser.Gamepad#update
    * @private
    */
    update: function () {

        this._pollGamepads();

        for (var i = 0; i < this._gamepads.length; i++)
        {
            if (this._gamepads[i]._connected)
            {
                this._gamepads[i].pollStatus();
            }
        }

    },

    /**
    * Updating connected gamepads (for Google Chrome).
    * Should not be called manually.
    * @method Phaser.Gamepad#_pollGamepads
    * @private
    */
    _pollGamepads: function () {

        var rawGamepads = navigator.getGamepads || (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;

        if (rawGamepads)
        {
            this._rawPads = [];

            var gamepadsChanged = false;

            for (var i = 0; i < rawGamepads.length; i++)
            {
                if (typeof rawGamepads[i] !== this._prevRawGamepadTypes[i])
                {
                    gamepadsChanged = true;
                    this._prevRawGamepadTypes[i] = typeof rawGamepads[i];
                }

                if (rawGamepads[i])
                {
                    this._rawPads.push(rawGamepads[i]);
                }

                // Support max 4 pads at the moment
                if (i === 3)
                {
                    break;
                }
            }

            if (gamepadsChanged)
            {
                var validConnections = { rawIndices: {}, padIndices: {} };
                var singlePad;

                for (var j = 0; j < this._gamepads.length; j++)
                {
                    singlePad = this._gamepads[j];

                    if (singlePad.connected)
                    {
                        for (var k = 0; k < this._rawPads.length; k++)
                        {
                            if (this._rawPads[k].index === singlePad.index)
                            {
                                validConnections.rawIndices[singlePad.index] = true;
                                validConnections.padIndices[j] = true;
                            }
                        }
                    }
                }

                for (var l = 0; l < this._gamepads.length; l++)
                {
                    singlePad = this._gamepads[l];

                    if (validConnections.padIndices[l])
                    {
                        continue;
                    }

                    if (this._rawPads.length < 1)
                    {
                        singlePad.disconnect();
                    }

                    for (var m = 0; m < this._rawPads.length; m++)
                    {
                        if (validConnections.padIndices[l])
                        {
                            break;
                        }

                        var rawPad = this._rawPads[m];

                        if (rawPad)
                        {
                            if (validConnections.rawIndices[rawPad.index])
                            {
                                singlePad.disconnect();
                                continue;
                            }
                            else
                            {
                                singlePad.connect(rawPad);
                                validConnections.rawIndices[rawPad.index] = true;
                                validConnections.padIndices[l] = true;
                            }
                        }
                        else
                        {
                            singlePad.disconnect();
                        }
                    }
                }
            }
        }
    },

    /**
    * Sets the deadZone variable for all four gamepads
    * @method Phaser.Gamepad#setDeadZones
    */
    setDeadZones: function (value) {

        for (var i = 0; i < this._gamepads.length; i++)
        {
            this._gamepads[i].deadZone = value;
        }

    },

    /**
    * Stops the Gamepad event handling.
    *
    * @method Phaser.Gamepad#stop
    */
    stop: function () {

        this._active = false;

        window.removeEventListener('gamepadconnected', this._ongamepadconnected);
        window.removeEventListener('gamepaddisconnected', this._ongamepaddisconnected);

    },

    /**
    * Reset all buttons/axes of all gamepads
    * @method Phaser.Gamepad#reset
    */
    reset: function () {

        this.update();

        for (var i = 0; i < this._gamepads.length; i++)
        {
            this._gamepads[i].reset();
        }

    },

    /**
    * Returns the "just pressed" state of a button from ANY gamepad connected. Just pressed is considered true if the button was pressed down within the duration given (default 250ms).
    * @method Phaser.Gamepad#justPressed
    * @param {number} buttonCode - The buttonCode of the button to check for.
    * @param {number} [duration=250] - The duration below which the button is considered as being just pressed.
    * @return {boolean} True if the button is just pressed otherwise false.
    */
    justPressed: function (buttonCode, duration) {

        for (var i = 0; i < this._gamepads.length; i++)
        {
            if (this._gamepads[i].justPressed(buttonCode, duration) === true)
            {
                return true;
            }
        }

        return false;

    },

    /**
    * Returns the "just released" state of a button from ANY gamepad connected. Just released is considered as being true if the button was released within the duration given (default 250ms).
    * @method Phaser.Gamepad#justPressed
    * @param {number} buttonCode - The buttonCode of the button to check for.
    * @param {number} [duration=250] - The duration below which the button is considered as being just released.
    * @return {boolean} True if the button is just released otherwise false.
    */
    justReleased: function (buttonCode, duration) {

        for (var i = 0; i < this._gamepads.length; i++)
        {
            if (this._gamepads[i].justReleased(buttonCode, duration) === true)
            {
                return true;
            }
        }

        return false;

    },

    /**
    * Returns true if the button is currently pressed down, on ANY gamepad.
    * @method Phaser.Gamepad#isDown
    * @param {number} buttonCode - The buttonCode of the button to check for.
    * @return {boolean} True if a button is currently down.
    */
    isDown: function (buttonCode) {

        for (var i = 0; i < this._gamepads.length; i++)
        {
            if (this._gamepads[i].isDown(buttonCode) === true)
            {
                return true;
            }
        }

        return false;
    }

};

Phaser.Gamepad.prototype.constructor = Phaser.Gamepad;

/**
* If the gamepad input is active or not - if not active it should not be updated from Input.js
* @name Phaser.Gamepad#active
* @property {boolean} active - If the gamepad input is active or not.
* @readonly
*/
Object.defineProperty(Phaser.Gamepad.prototype, "active", {

    get: function () {
        return this._active;
    }

});

/**
* Whether or not gamepads are supported in current browser.
* @name Phaser.Gamepad#supported
* @property {boolean} supported - Whether or not gamepads are supported in current browser.
* @readonly
*/
Object.defineProperty(Phaser.Gamepad.prototype, "supported", {

    get: function () {
        return this._gamepadSupportAvailable;
    }

});

/**
* How many live gamepads are currently connected.
* @name Phaser.Gamepad#padsConnected
* @property {boolean} padsConnected - How many live gamepads are currently connected.
* @readonly
*/
Object.defineProperty(Phaser.Gamepad.prototype, "padsConnected", {

    get: function () {
        return this._rawPads.length;
    }

});

/**
* Gamepad #1
* @name Phaser.Gamepad#pad1
* @property {boolean} pad1 - Gamepad #1;
* @readonly
*/
Object.defineProperty(Phaser.Gamepad.prototype, "pad1", {

    get: function () {
        return this._gamepads[0];
    }

});

/**
* Gamepad #2
* @name Phaser.Gamepad#pad2
* @property {boolean} pad2 - Gamepad #2
* @readonly
*/
Object.defineProperty(Phaser.Gamepad.prototype, "pad2", {

    get: function () {
        return this._gamepads[1];
    }

});

/**
* Gamepad #3
* @name Phaser.Gamepad#pad3
* @property {boolean} pad3 - Gamepad #3
* @readonly
*/
Object.defineProperty(Phaser.Gamepad.prototype, "pad3", {

    get: function () {
        return this._gamepads[2];
    }

});

/**
* Gamepad #4
* @name Phaser.Gamepad#pad4
* @property {boolean} pad4 - Gamepad #4
* @readonly
*/
Object.defineProperty(Phaser.Gamepad.prototype, "pad4", {

    get: function () {
        return this._gamepads[3];
    }

});

Phaser.Gamepad.BUTTON_0 = 0;
Phaser.Gamepad.BUTTON_1 = 1;
Phaser.Gamepad.BUTTON_2 = 2;
Phaser.Gamepad.BUTTON_3 = 3;
Phaser.Gamepad.BUTTON_4 = 4;
Phaser.Gamepad.BUTTON_5 = 5;
Phaser.Gamepad.BUTTON_6 = 6;
Phaser.Gamepad.BUTTON_7 = 7;
Phaser.Gamepad.BUTTON_8 = 8;
Phaser.Gamepad.BUTTON_9 = 9;
Phaser.Gamepad.BUTTON_10 = 10;
Phaser.Gamepad.BUTTON_11 = 11;
Phaser.Gamepad.BUTTON_12 = 12;
Phaser.Gamepad.BUTTON_13 = 13;
Phaser.Gamepad.BUTTON_14 = 14;
Phaser.Gamepad.BUTTON_15 = 15;

Phaser.Gamepad.AXIS_0 = 0;
Phaser.Gamepad.AXIS_1 = 1;
Phaser.Gamepad.AXIS_2 = 2;
Phaser.Gamepad.AXIS_3 = 3;
Phaser.Gamepad.AXIS_4 = 4;
Phaser.Gamepad.AXIS_5 = 5;
Phaser.Gamepad.AXIS_6 = 6;
Phaser.Gamepad.AXIS_7 = 7;
Phaser.Gamepad.AXIS_8 = 8;
Phaser.Gamepad.AXIS_9 = 9;

// Below mapping applies to XBOX 360 Wired and Wireless controller on Google Chrome (tested on Windows 7).
// - Firefox uses different map! Separate amount of buttons and axes. DPAD = axis and not a button.
// In other words - discrepancies when using gamepads.

Phaser.Gamepad.XBOX360_A = 0;
Phaser.Gamepad.XBOX360_B = 1;
Phaser.Gamepad.XBOX360_X = 2;
Phaser.Gamepad.XBOX360_Y = 3;
Phaser.Gamepad.XBOX360_LEFT_BUMPER = 4;
Phaser.Gamepad.XBOX360_RIGHT_BUMPER = 5;
Phaser.Gamepad.XBOX360_LEFT_TRIGGER = 6;
Phaser.Gamepad.XBOX360_RIGHT_TRIGGER = 7;
Phaser.Gamepad.XBOX360_BACK = 8;
Phaser.Gamepad.XBOX360_START = 9;
Phaser.Gamepad.XBOX360_STICK_LEFT_BUTTON = 10;
Phaser.Gamepad.XBOX360_STICK_RIGHT_BUTTON = 11;

Phaser.Gamepad.XBOX360_DPAD_LEFT = 14;
Phaser.Gamepad.XBOX360_DPAD_RIGHT = 15;
Phaser.Gamepad.XBOX360_DPAD_UP = 12;
Phaser.Gamepad.XBOX360_DPAD_DOWN = 13;

Phaser.Gamepad.XBOX360_STICK_LEFT_X = 0;
Phaser.Gamepad.XBOX360_STICK_LEFT_Y = 1;
Phaser.Gamepad.XBOX360_STICK_RIGHT_X = 2;
Phaser.Gamepad.XBOX360_STICK_RIGHT_Y = 3;
