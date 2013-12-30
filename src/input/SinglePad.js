/**
 * @author       @karlmacklin <tacklemcclean@gmail.com>
 * @copyright    2013 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @class Phaser.SinglePad
 * @classdesc A single Phaser Gamepad
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
     * @property {Phaser.Gamepad} padParent - Main Phaser Gamepad object
     */
    this._padParent = padParent;

    /**
     * @property {number} index - The gamepad index as per browsers data
     * @default
     */
    this._index = null;

    /**
     * @property {Object} _rawPad - The 'raw' gamepad data.
     * @private
     */
    this._rawPad = null;

    /**
     * @property {boolean} _connected - Is this pad connected or not.
     * @private
     */
    this._connected = false;

    /**
     * @property {number} _prevTimestamp - Used to check for differences between earlier polls and current state of gamepads.
     * @private
     */
    this._prevTimestamp = null;

    /**
     * @property {Array} _rawButtons - The 'raw' button state.
     * @private
     */
    this._rawButtons = [];

    /**
     * @property {Array} _buttons - Current Phaser state of the buttons.
     * @private
     */
    this._buttons = [];

    /**
     * @property {Array} _axes - Current axes state.
     * @private
     */
    this._axes = [];

    /**
     * @property {Array} _hotkeys - Hotkey buttons.
     * @private
     */
    this._hotkeys = [];

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

};

Phaser.SinglePad.prototype = {

    /**
     * Add callbacks to the this Gamepad to handle connect/disconnect/button down/button up/axis change/float value buttons
     * @method Phaser.Gamepad#addCallbacks
     * @param {Object} context - The context under which the callbacks are run.
     * @param {Object} callbacks - Object that takes six different callbak methods:
     * onConnectCallback, onDisconnectCallback, onDownCallback, onUpCallback, onAxisCallback, onFloatCallback
     */
    addCallbacks: function (context, callbacks) {

        if (typeof callbacks !== 'undefined') {
            this.onConnectCallback = (typeof callbacks.onConnect === 'function') ? callbacks.onConnect : this.onConnectCallback;
            this.onDisconnectCallback = (typeof callbacks.onDisconnect === 'function') ? callbacks.onDisconnect : this.onDisconnectCallback;
            this.onDownCallback = (typeof callbacks.onDown === 'function') ? callbacks.onDown : this.onDownCallback;
            this.onUpCallback = (typeof callbacks.onUp === 'function') ? callbacks.onUp : this.onUpCallback;
            this.onAxisCallback = (typeof callbacks.onAxis === 'function') ? callbacks.onAxis : this.onAxisCallback;
            this.onFloatCallback = (typeof callbacks.onFloat === 'function') ? callbacks.onFloat : this.onFloatCallback;
        }

    },

    /**
     * If you need more fine-grained control over a Key you can create a new Phaser.Key object via this method.
     * The Key object can then be polled, have events attached to it, etc.
     *
     * @method Phaser.SinglePad#addButton
     * @param {number} buttonCode - The buttonCode of the button, i.e. Phaser.Gamepad.BUTTON_0 or Phaser.Gamepad.BUTTON_1
     * @return {Phaser.GamepadButton} The GamepadButton object which you can store locally and reference directly.
     */
    addButton: function (buttonCode) {

        this._hotkeys[buttonCode] = new Phaser.GamepadButton(this.game, buttonCode);
        return this._hotkeys[buttonCode];

    },

    /**
     * Main update function, should be called by Phaser.Gamepad
     * @method Phaser.SinglePad#pollStatus
     */
    pollStatus: function () {
        if (this._rawPad.timestamp && (this._rawPad.timestamp == this._prevTimestamp)) {
            return;
        }
        for (var i = 0; i < this._rawPad.buttons.length; i += 1) {
            var buttonValue = this._rawPad.buttons[i];
            if (this._rawButtons[i] !== buttonValue) {
                if (buttonValue === 1) {
                    this.processButtonDown(i, buttonValue);
                }
                else if (buttonValue === 0) {
                    this.processButtonUp(i, buttonValue);
                } else {
                    this.processButtonFloat(i, buttonValue);
                }
                this._rawButtons[i] = buttonValue;
            }
        }

        var axes = this._rawPad.axes;

        for (var j = 0; j < axes.length; j += 1) {
            var axis = axes[j];
            if (axis > 0 && axis > this.deadZone ||
                axis < 0 && axis < -this.deadZone) {
                this.processAxisChange({axis: j, value: axis});
            } else {
                this.processAxisChange({axis: j, value: 0});
            }
        }
        this._prevTimestamp = this._rawPad.timestamp;

    },

    /**
     * Gamepad connect function, should be called by Phaser.Gamepad
     * @param {Object} rawPad - The raw gamepad object
     * @method Phaser.SinglePad#connect
     */
    connect: function (rawPad) {
        var triggerCallback = !this._connected;

        this._index = rawPad.index;
        this._connected = true;
        this._rawPad = rawPad;
        this._rawButtons = rawPad.buttons;
        this._axes = rawPad.axes;

        if (triggerCallback && this._padParent.onConnectCallback) {
            this._padParent.onConnectCallback.call(this._padParent.callbackContext, this._index);
        }
        if (triggerCallback && this.onConnectCallback) {
            this.onConnectCallback.call(this.callbackContext);
        }

    },

    /**
     * Gamepad disconnect function, should be called by Phaser.Gamepad
     * @method Phaser.SinglePad#disconnect
     */
    disconnect: function () {
        var triggerCallback = this._connected;
        this._connected = false;
        this._rawPad = undefined;
        this._rawButtons = [];
        this._buttons = [];
        var disconnectingIndex = this._index;
        this._index = null;

        if (triggerCallback && this._padParent.onDisconnectCallback) {
            this._padParent.onDisconnectCallback.call(this._padParent.callbackContext, disconnectingIndex);
        }
        if (triggerCallback && this.onDisconnectCallback) {
            this.onDisconnectCallback.call(this.callbackContext);
        }
    },

    /**
     * Handles changes in axis
     * @param {Object} axisState - State of the relevant axis
     * @method Phaser.SinglePad#processAxisChange
     */
    processAxisChange: function (axisState) {

        if (this.game.input.disabled || this.game.input.gamepad.disabled) {
            return;
        }

        if (this._axes[axisState.axis] === axisState.value) {
            return;
        }
        this._axes[axisState.axis] = axisState.value;
        if (this._padParent.onAxisCallback) {
            this._padParent.onAxisCallback.call(this._padParent.callbackContext, axisState, this._index);
        }
        if (this.onAxisCallback) {
            this.onAxisCallback.call(this.callbackContext, axisState);
        }

    },


    /**
     * Handles button down press
     * @param {number} buttonCode - Which buttonCode of this button
     * @param {Object} value - Button value
     * @method Phaser.SinglePad#processButtonDown
     */
    processButtonDown: function (buttonCode, value) {
        if (this.game.input.disabled || this.game.input.gamepad.disabled) {
            return;
        }

        if (this._padParent.onDownCallback) {
            this._padParent.onDownCallback.call(this._padParent.callbackContext, buttonCode, value, this._index);
        }

        if (this.onDownCallback) {
            this.onDownCallback.call(this.callbackContext, buttonCode, value);
        }

        if (this._buttons[buttonCode] && this._buttons[buttonCode].isDown) {
            //  Key already down and still down, so update
            this._buttons[buttonCode].duration = this.game.time.now - this._buttons[buttonCode].timeDown;
        }
        else {
            if (!this._buttons[buttonCode]) {
                //  Not used this button before, so register it
                this._buttons[buttonCode] = {
                    isDown: true,
                    timeDown: this.game.time.now,
                    timeUp: 0,
                    duration: 0,
                    value: value
                };
            }
            else {
                //  Button used before but freshly down
                this._buttons[buttonCode].isDown = true;
                this._buttons[buttonCode].timeDown = this.game.time.now;
                this._buttons[buttonCode].duration = 0;
                this._buttons[buttonCode].value = value;
            }
        }

        if (this._hotkeys[buttonCode]) {
            this._hotkeys[buttonCode].processButtonDown(value);
        }

    },

    /**
     * Handles button release
     * @param {number} buttonCode - Which buttonCode of this button
     * @param {Object} value - Button value
     * @method Phaser.SinglePad#processButtonUp
     */
    processButtonUp: function (buttonCode, value) {
        if (this.game.input.disabled || this.game.input.gamepad.disabled) {
            return;
        }

        if (this._padParent.onUpCallback) {
            this._padParent.onUpCallback.call(this._padParent.callbackContext, buttonCode, value, this._index);
        }

        if (this.onUpCallback) {
            this.onUpCallback.call(this.callbackContext, buttonCode, value);
        }

        if (this._hotkeys[buttonCode]) {
            this._hotkeys[buttonCode].processButtonUp(value);
        }

        if (this._buttons[buttonCode]) {
            this._buttons[buttonCode].isDown = false;
            this._buttons[buttonCode].timeUp = this.game.time.now;
            this._buttons[buttonCode].value = value;
        }
        else {
            //  Not used this key before, so register it
            this._buttons[buttonCode] = {
                isDown: false,
                timeDown: this.game.time.now,
                timeUp: this.game.time.now,
                duration: 0,
                value: value
            };
        }
    },

    /**
     * Handles buttons with floating values (like analog buttons that acts almost like an axis but still registers like a button)
     * @param {number} buttonCode - Which buttonCode of this button
     * @param {Object} value - Button value (will range somewhere between 0 and 1, but not specifically 0 or 1.
     * @method Phaser.SinglePad#processButtonFloat
     */
    processButtonFloat: function (buttonCode, value) {
        if (this.game.input.disabled || this.game.input.gamepad.disabled) {
            return;
        }

        if (this._padParent.onFloatCallback) {
            this._padParent.onFloatCallback.call(this._padParent.callbackContext, buttonCode, value, this._index);
        }

        if (this.onFloatCallback) {
            this.onFloatCallback.call(this.callbackContext, buttonCode, value);
        }


        if (!this._buttons[buttonCode]) {
            //  Not used this button before, so register it
            this._buttons[buttonCode] = {
                value: value
            };
        }
        else {
            //  Button used before but freshly down
            this._buttons[buttonCode].value = value;
        }

        if (this._hotkeys[buttonCode]) {
            this._hotkeys[buttonCode].processButtonFloat(value);
        }

    },

    /**
     * Returns value of requested axis
     * @method Phaser.SinglePad#isDown
     * @param {number} axisCode - The index of the axis to check
     * @return {number} Axis value if available otherwise false
     */
    axis: function (axisCode) {
        if (this._axes[axisCode]) {
            return this._axes[axisCode];
        }

        return false;
    },

    /**
     * Returns true if the button is currently pressed down.
     * @method Phaser.SinglePad#isDown
     * @param {number} buttonCode - The buttonCode of the key to check.
     * @return {boolean} True if the key is currently down.
     */
    isDown: function (buttonCode) {

        if (this._buttons[buttonCode]) {
            return this._buttons[buttonCode].isDown;
        }

        return false;

    },


    /**
     * Returns the "just released" state of a button from this gamepad. Just released is considered as being true if the button was released within the duration given (default 250ms).
     * @method Phaser.SinglePad#justPressed
     * @param {number} buttonCode - The buttonCode of the button to check for.
     * @param {number} [duration=250] - The duration below which the button is considered as being just released.
     * @return {boolean} True if the button is just released otherwise false.
     */
    justReleased: function (buttonCode, duration) {

        if (typeof duration === "undefined") {
            duration = 250;
        }

        if (this._buttons[buttonCode] && this._buttons[buttonCode].isDown === false && (this.game.time.now - this._buttons[buttonCode].timeUp < duration)) {
            return true;
        }

        return false;

    },

    /**
     * Returns the "just pressed" state of a button from this gamepad. Just pressed is considered true if the button was pressed down within the duration given (default 250ms).
     * @method Phaser.SinglePad#justPressed
     * @param {number} buttonCode - The buttonCode of the button to check for.
     * @param {number} [duration=250] - The duration below which the button is considered as being just pressed.
     * @return {boolean} True if the button is just pressed otherwise false.
     */
    justPressed: function (buttonCode, duration) {

        if (typeof duration === "undefined") {
            duration = 250;
        }

        if (this._buttons[buttonCode] && this._buttons[buttonCode].isDown && this._buttons[buttonCode].duration < duration) {
            return true;
        }

        return false;

    },

    /**
     * Returns the value of a gamepad button. Intended mainly for cases when you have floating button values, for example
     * analog trigger buttons on the XBOX 360 controller
     * @method Phaser.SinglePad#buttonValue
     * @param {number} buttonCode - The buttonCode of the button to check.
     * @return {boolean} Button value if available otherwise false.
     */
    buttonValue: function (buttonCode) {

        if (this._buttons[buttonCode]) {
            return this._buttons[buttonCode].value;
        }

        return false;

    },

    /**
     * Reset all buttons/axes of this gamepad
     * @method Phaser.SinglePad#reset
     */
    reset: function () {
        for (var i = 0; i < this._buttons.length; i += 1) {
            this._buttons[i] = 0;
        }
        for (var j = 0; j < this._axes.length; j += 1) {
            this._axes[j] = 0;
        }
    }

};

/**
 * Whether or not this particular gamepad is connected or not.
 * @name Phaser.SinglePad#connected
 * @property {boolean} connected - Whether or not this particular gamepad is connected or not.
 * @readonly
 */
Object.defineProperty(Phaser.SinglePad.prototype, "connected", {

    get: function () {
        return this._connected;
    }

});

/**
 * Gamepad index as per browser data
 * @name Phaser.SinglePad#index
 * @property {number} index - The gamepad index, used to identify specific gamepads in the browser
 * @readonly
 */
Object.defineProperty(Phaser.SinglePad.prototype, "index", {

    get: function () {
        return this._index;
    }

});