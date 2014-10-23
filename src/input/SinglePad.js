/**
* @author       @karlmacklin <tacklemcclean@gmail.com>
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A single Phaser Gamepad
* 
* @class Phaser.SinglePad
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {Object} padParent - The parent Phaser.Gamepad object (all gamepads reside under this)
*/
Phaser.SinglePad = function (game, padParent) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {number} index - The gamepad index as per browsers data
    * @readonly
    */
    this.index = null;

    /**
    * @property {boolean} connected - Whether or not this particular gamepad is connected or not.
    * @readonly
    */
    this.connected = false;

    /**
    * @property {Object} callbackContext - The context under which the callbacks are run.
    */
    this.callbackContext = this;

    /**
    * @property {function} onConnectCallback - This callback is invoked every time this gamepad is connected
    */
    this.onConnectCallback = null;

    /**
    * @property {function} onDisconnectCallback - This callback is invoked every time this gamepad is disconnected
    */
    this.onDisconnectCallback = null;

    /**
    * @property {function} onDownCallback - This callback is invoked every time a button is pressed down.
    */
    this.onDownCallback = null;

    /**
    * @property {function} onUpCallback - This callback is invoked every time a gamepad button is released.
    */
    this.onUpCallback = null;

    /**
    * @property {function} onAxisCallback - This callback is invoked every time an axis is changed.
    */
    this.onAxisCallback = null;

    /**
    * @property {function} onFloatCallback - This callback is invoked every time a button is changed to a value where value > 0 and value < 1.
    */
    this.onFloatCallback = null;

    /**
    * @property {number} deadZone - Dead zone for axis feedback - within this value you won't trigger updates.
    */
    this.deadZone = 0.26;

    /**
    * @property {Phaser.Gamepad} padParent - Main Phaser Gamepad object
    * @private
    */
    this._padParent = padParent;

    /**
    * @property {Object} _rawPad - The 'raw' gamepad data.
    * @private
    */
    this._rawPad = null;

    /**
    * @property {number} _prevTimestamp - Used to check for differences between earlier polls and current state of gamepads.
    * @private
    */
    this._prevTimestamp = null;

    /**
    * @property {Array} _buttons - Array of Phaser.GamepadButton objects. This array is populated when the gamepad is connected.
    * @private
    */
    this._buttons = [];

    /**
    * @property {number} _buttonsLen - Length of the _buttons array.
    * @private
    */
    this._buttonsLen = 0;

    /**
    * @property {Array} _axes - Current axes state.
    * @private
    */
    this._axes = [];

    /**
    * @property {number} _axesLen - Length of the _axes array.
    * @private
    */
    this._axesLen = 0;

};

Phaser.SinglePad.prototype = {

    /**
    * Add callbacks to this Gamepad to handle connect / disconnect / button down / button up / axis change / float value buttons.
    * 
    * @method Phaser.SinglePad#addCallbacks
    * @param {Object} context - The context under which the callbacks are run.
    * @param {Object} callbacks - Object that takes six different callbak methods:
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
    * Gets a GamepadButton object from this controller to be stored and referenced locally.
    * The GamepadButton object can then be polled, have events attached to it, etc.
    *
    * @method Phaser.SinglePad#getButton
    * @param {number} buttonCode - The buttonCode of the button, i.e. Phaser.Gamepad.BUTTON_0, Phaser.Gamepad.XBOX360_A, etc.
    * @return {Phaser.GamepadButton} The GamepadButton object which you can store locally and reference directly.
    */
    getButton: function (buttonCode) {

        if (this._buttons[buttonCode])
        {
            return this._buttons[buttonCode];
        }
        else
        {
            return null;
        }

    },

    /**
    * Main update function called by Phaser.Gamepad.
    * 
    * @method Phaser.SinglePad#pollStatus
    */
    pollStatus: function () {

        if (!this.connected || this.game.input.disabled || this.game.input.gamepad.disabled || (this._rawPad.timestamp && (this._rawPad.timestamp === this._prevTimestamp)))
        {
            return;
        }

        for (var i = 0; i < this._buttonsLen; i++)
        {
            var rawButtonVal = isNaN(this._rawPad.buttons[i]) ? this._rawPad.buttons[i].value : this._rawPad.buttons[i];

            if (rawButtonVal !== this._buttons[i].value)
            {
                if (rawButtonVal === 1)
                {
                    this.processButtonDown(i, rawButtonVal);
                }
                else if (rawButtonVal === 0)
                {
                    this.processButtonUp(i, rawButtonVal);
                }
                else
                {
                    this.processButtonFloat(i, rawButtonVal);
                }
            }
        }
        
        for (var index = 0; index < this._axesLen; index++)
        {
            var value = this._rawPad.axes[index];

            if ((value > 0 && value > this.deadZone) || (value < 0 && value < -this.deadZone))
            {
                this.processAxisChange(index, value);
            }
            else
            {
                this.processAxisChange(index, 0);
            }
        }

        this._prevTimestamp = this._rawPad.timestamp;

    },

    /**
    * Gamepad connect function, should be called by Phaser.Gamepad.
    * 
    * @method Phaser.SinglePad#connect
    * @param {Object} rawPad - The raw gamepad object
    */
    connect: function (rawPad) {

        var triggerCallback = !this.connected;

        this.connected = true;
        this.index = rawPad.index;

        this._rawPad = rawPad;

        this._buttons = [];
        this._buttonsLen = rawPad.buttons.length;

        this._axes = [];
        this._axesLen = rawPad.axes.length;

        for (var a = 0; a < this._axesLen; a++)
        {
            this._axes[a] = rawPad.axes[a];
        }

        for (var buttonCode in rawPad.buttons)
        {
            buttonCode = parseInt(buttonCode, 10);
            this._buttons[buttonCode] = new Phaser.GamepadButton(this, buttonCode);
        }

        if (triggerCallback && this._padParent.onConnectCallback)
        {
            this._padParent.onConnectCallback.call(this._padParent.callbackContext, this.index);
        }

        if (triggerCallback && this.onConnectCallback)
        {
            this.onConnectCallback.call(this.callbackContext);
        }

    },

    /**
    * Gamepad disconnect function, should be called by Phaser.Gamepad.
    * 
    * @method Phaser.SinglePad#disconnect
    */
    disconnect: function () {

        var triggerCallback = this.connected;
        var disconnectingIndex = this.index;

        this.connected = false;
        this.index = null;

        this._rawPad = undefined;

        for (var i = 0; i < this._buttonsLen; i++)
        {
            this._buttons[i].destroy();
        }

        this._buttons = [];
        this._buttonsLen = 0;

        this._axes = [];
        this._axesLen = 0;

        if (triggerCallback && this._padParent.onDisconnectCallback)
        {
            this._padParent.onDisconnectCallback.call(this._padParent.callbackContext, disconnectingIndex);
        }

        if (triggerCallback && this.onDisconnectCallback)
        {
            this.onDisconnectCallback.call(this.callbackContext);
        }

    },

    /**
     * Destroys this object and associated callback references.
     *
     * @method destroy
     */
    destroy: function () {

        this._rawPad = undefined;

        for (var i = 0; i < this._buttonsLen; i++)
        {
            this._buttons[i].destroy();
        }

        this._buttons = [];
        this._buttonsLen = 0;

        this._axes = [];
        this._axesLen = 0;

        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
        this.onDownCallback = null;
        this.onUpCallback = null;
        this.onAxisCallback = null;
        this.onFloatCallback = null;

    },

    /**
    * Handles changes in axis.
    * 
    * @method Phaser.SinglePad#processAxisChange
    * @param {Object} axisState - State of the relevant axis
    */
    processAxisChange: function (index, value) {

        if (this._axes[index] === value)
        {
            return;
        }

        this._axes[index] = value;

        if (this._padParent.onAxisCallback)
        {
            this._padParent.onAxisCallback.call(this._padParent.callbackContext, this, index, value);
        }

        if (this.onAxisCallback)
        {
            this.onAxisCallback.call(this.callbackContext, this, index, value);
        }

    },

    /**
    * Handles button down press.
    * 
    * @method Phaser.SinglePad#processButtonDown
    * @param {number} buttonCode - Which buttonCode of this button
    * @param {Object} value - Button value
    */
    processButtonDown: function (buttonCode, value) {

        if (this._padParent.onDownCallback)
        {
            this._padParent.onDownCallback.call(this._padParent.callbackContext, buttonCode, value, this.index);
        }

        if (this.onDownCallback)
        {
            this.onDownCallback.call(this.callbackContext, buttonCode, value);
        }

        if (this._buttons[buttonCode])
        {
            this._buttons[buttonCode].processButtonDown(value);
        }

    },

    /**
    * Handles button release.
    * 
    * @method Phaser.SinglePad#processButtonUp
    * @param {number} buttonCode - Which buttonCode of this button
    * @param {Object} value - Button value
    */
    processButtonUp: function (buttonCode, value) {

        if (this._padParent.onUpCallback)
        {
            this._padParent.onUpCallback.call(this._padParent.callbackContext, buttonCode, value, this.index);
        }

        if (this.onUpCallback)
        {
            this.onUpCallback.call(this.callbackContext, buttonCode, value);
        }

        if (this._buttons[buttonCode])
        {
            this._buttons[buttonCode].processButtonUp(value);
        }

    },

    /**
    * Handles buttons with floating values (like analog buttons that acts almost like an axis but still registers like a button)
    * 
    * @method Phaser.SinglePad#processButtonFloat
    * @param {number} buttonCode - Which buttonCode of this button
    * @param {Object} value - Button value (will range somewhere between 0 and 1, but not specifically 0 or 1.
    */
    processButtonFloat: function (buttonCode, value) {

        if (this._padParent.onFloatCallback)
        {
            this._padParent.onFloatCallback.call(this._padParent.callbackContext, buttonCode, value, this.index);
        }

        if (this.onFloatCallback)
        {
            this.onFloatCallback.call(this.callbackContext, buttonCode, value);
        }

        if (this._buttons[buttonCode])
        {
            this._buttons[buttonCode].processButtonFloat(value);
        }

    },

    /**
    * Returns value of requested axis.
    * 
    * @method Phaser.SinglePad#axis
    * @param {number} axisCode - The index of the axis to check
    * @return {number} Axis value if available otherwise false
    */
    axis: function (axisCode) {

        if (this._axes[axisCode])
        {
            return this._axes[axisCode];
        }

        return false;

    },

    /**
    * Returns true if the button is pressed down.
    * 
    * @method Phaser.SinglePad#isDown
    * @param {number} buttonCode - The buttonCode of the button to check.
    * @return {boolean} True if the button is pressed down.
    */
    isDown: function (buttonCode) {

        if (this._buttons[buttonCode])
        {
            return this._buttons[buttonCode].isDown;
        }

        return false;

    },

    /**
    * Returns true if the button is not currently pressed.
    * 
    * @method Phaser.SinglePad#isUp
    * @param {number} buttonCode - The buttonCode of the button to check.
    * @return {boolean} True if the button is not currently pressed down.
    */
    isUp: function (buttonCode) {

        if (this._buttons[buttonCode])
        {
            return this._buttons[buttonCode].isUp;
        }

        return false;

    },

    /**
    * Returns the "just released" state of a button from this gamepad. Just released is considered as being true if the button was released within the duration given (default 250ms).
    * 
    * @method Phaser.SinglePad#justReleased
    * @param {number} buttonCode - The buttonCode of the button to check for.
    * @param {number} [duration=250] - The duration below which the button is considered as being just released.
    * @return {boolean} True if the button is just released otherwise false.
    */
    justReleased: function (buttonCode, duration) {

        if (this._buttons[buttonCode])
        {
            return this._buttons[buttonCode].justReleased(duration);
        }

    },

    /**
    * Returns the "just pressed" state of a button from this gamepad. Just pressed is considered true if the button was pressed down within the duration given (default 250ms).
    * 
    * @method Phaser.SinglePad#justPressed
    * @param {number} buttonCode - The buttonCode of the button to check for.
    * @param {number} [duration=250] - The duration below which the button is considered as being just pressed.
    * @return {boolean} True if the button is just pressed otherwise false.
    */
    justPressed: function (buttonCode, duration) {

        if (this._buttons[buttonCode])
        {
            return this._buttons[buttonCode].justPressed(duration);
        }

    },

    /**
    * Returns the value of a gamepad button. Intended mainly for cases when you have floating button values, for example
    * analog trigger buttons on the XBOX 360 controller.
    * 
    * @method Phaser.SinglePad#buttonValue
    * @param {number} buttonCode - The buttonCode of the button to check.
    * @return {number} Button value if available otherwise null. Be careful as this can incorrectly evaluate to 0.
    */
    buttonValue: function (buttonCode) {

        if (this._buttons[buttonCode])
        {
            return this._buttons[buttonCode].value;
        }

        return null;

    },

    /**
    * Reset all buttons/axes of this gamepad.
    * 
    * @method Phaser.SinglePad#reset
    */
    reset: function () {

        for (var j = 0; j < this._axes.length; j++)
        {
            this._axes[j] = 0;
        }

    }

};

Phaser.SinglePad.prototype.constructor = Phaser.SinglePad;
