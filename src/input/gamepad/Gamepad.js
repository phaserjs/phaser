/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Axis = require('./Axis');
var Button = require('./Button');
var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A single Gamepad.
 *
 * These are created, updated and managed by the Gamepad Plugin.
 *
 * @class Gamepad
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Input.Gamepad
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.Gamepad.GamepadPlugin} manager - A reference to the Gamepad Plugin.
 * @param {Phaser.Types.Input.Gamepad.Pad} pad - The Gamepad object, as extracted from GamepadEvent.
 */
var Gamepad = new Class({

    Extends: EventEmitter,

    initialize:

    function Gamepad (manager, pad)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Gamepad Plugin.
         *
         * @name Phaser.Input.Gamepad.Gamepad#manager
         * @type {Phaser.Input.Gamepad.GamepadPlugin}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * A reference to the native Gamepad object that is connected to the browser.
         *
         * @name Phaser.Input.Gamepad.Gamepad#pad
         * @type {any}
         * @since 3.10.0
         */
        this.pad = pad;

        /**
         * A string containing some information about the controller.
         *
         * This is not strictly specified, but in Firefox it will contain three pieces of information
         * separated by dashes (-): two 4-digit hexadecimal strings containing the USB vendor and
         * product id of the controller, and the name of the controller as provided by the driver.
         * In Chrome it will contain the name of the controller as provided by the driver,
         * followed by vendor and product 4-digit hexadecimal strings.
         *
         * @name Phaser.Input.Gamepad.Gamepad#id
         * @type {string}
         * @since 3.0.0
         */
        this.id = pad.id;

        /**
         * An integer that is unique for each Gamepad currently connected to the system.
         * This can be used to distinguish multiple controllers.
         * Note that disconnecting a device and then connecting a new device may reuse the previous index.
         *
         * @name Phaser.Input.Gamepad.Gamepad#index
         * @type {number}
         * @since 3.0.0
         */
        this.index = pad.index;

        var buttons = [];

        for (var i = 0; i < pad.buttons.length; i++)
        {
            buttons.push(new Button(this, i));
        }

        /**
         * An array of Gamepad Button objects, corresponding to the different buttons available on the Gamepad.
         *
         * @name Phaser.Input.Gamepad.Gamepad#buttons
         * @type {Phaser.Input.Gamepad.Button[]}
         * @since 3.0.0
         */
        this.buttons = buttons;

        var axes = [];

        for (i = 0; i < pad.axes.length; i++)
        {
            axes.push(new Axis(this, i));
        }

        /**
         * An array of Gamepad Axis objects, corresponding to the different axes available on the Gamepad, if any.
         *
         * @name Phaser.Input.Gamepad.Gamepad#axes
         * @type {Phaser.Input.Gamepad.Axis[]}
         * @since 3.0.0
         */
        this.axes = axes;

        /**
         * The Gamepad's Haptic Actuator (Vibration / Rumble support).
         * This is highly experimental and only set if both present on the device,
         * and exposed by both the hardware and browser.
         *
         * @name Phaser.Input.Gamepad.Gamepad#vibration
         * @type {GamepadHapticActuator}
         * @since 3.10.0
         */
        this.vibration = pad.vibrationActuator;

        // https://w3c.github.io/gamepad/#remapping

        var _noButton = { value: 0, pressed: false };

        /**
         * A reference to the Left Button in the Left Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_LCLeft
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._LCLeft = (buttons[14]) ? buttons[14] : _noButton;

        /**
         * A reference to the Right Button in the Left Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_LCRight
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._LCRight = (buttons[15]) ? buttons[15] : _noButton;

        /**
         * A reference to the Top Button in the Left Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_LCTop
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._LCTop = (buttons[12]) ? buttons[12] : _noButton;

        /**
         * A reference to the Bottom Button in the Left Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_LCBottom
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._LCBottom = (buttons[13]) ? buttons[13] : _noButton;

        /**
         * A reference to the Left Button in the Right Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_RCLeft
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._RCLeft = (buttons[2]) ? buttons[2] : _noButton;

        /**
         * A reference to the Right Button in the Right Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_RCRight
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._RCRight = (buttons[1]) ? buttons[1] : _noButton;

        /**
         * A reference to the Top Button in the Right Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_RCTop
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._RCTop = (buttons[3]) ? buttons[3] : _noButton;

        /**
         * A reference to the Bottom Button in the Right Cluster.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_RCBottom
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._RCBottom = (buttons[0]) ? buttons[0] : _noButton;

        /**
         * A reference to the Top Left Front Button (L1 Shoulder Button)
         *
         * @name Phaser.Input.Gamepad.Gamepad#_FBLeftTop
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._FBLeftTop = (buttons[4]) ? buttons[4] : _noButton;

        /**
         * A reference to the Bottom Left Front Button (L2 Shoulder Button)
         *
         * @name Phaser.Input.Gamepad.Gamepad#_FBLeftBottom
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._FBLeftBottom = (buttons[6]) ? buttons[6] : _noButton;

        /**
         * A reference to the Top Right Front Button (R1 Shoulder Button)
         *
         * @name Phaser.Input.Gamepad.Gamepad#_FBRightTop
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._FBRightTop = (buttons[5]) ? buttons[5] : _noButton;

        /**
         * A reference to the Bottom Right Front Button (R2 Shoulder Button)
         *
         * @name Phaser.Input.Gamepad.Gamepad#_FBRightBottom
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._FBRightBottom = (buttons[7]) ? buttons[7] : _noButton;

        var _noAxis = { value: 0 };

        /**
         * A reference to the Horizontal Axis for the Left Stick.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_HAxisLeft
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._HAxisLeft = (axes[0]) ? axes[0] : _noAxis;

        /**
         * A reference to the Vertical Axis for the Left Stick.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_VAxisLeft
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._VAxisLeft = (axes[1]) ? axes[1] : _noAxis;

        /**
         * A reference to the Horizontal Axis for the Right Stick.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_HAxisRight
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._HAxisRight = (axes[2]) ? axes[2] : _noAxis;

        /**
         * A reference to the Vertical Axis for the Right Stick.
         *
         * @name Phaser.Input.Gamepad.Gamepad#_VAxisRight
         * @type {Phaser.Input.Gamepad.Button}
         * @private
         * @since 3.10.0
         */
        this._VAxisRight = (axes[3]) ? axes[3] : _noAxis;

        /**
         * A Vector2 containing the most recent values from the Gamepad's left axis stick.
         * This is updated automatically as part of the Gamepad.update cycle.
         * The H Axis is mapped to the `Vector2.x` property, and the V Axis to the `Vector2.y` property.
         * The values are based on the Axis thresholds.
         * If the Gamepad does not have a left axis stick, the values will always be zero.
         *
         * @name Phaser.Input.Gamepad.Gamepad#leftStick
         * @type {Phaser.Math.Vector2}
         * @since 3.10.0
         */
        this.leftStick = new Vector2();

        /**
         * A Vector2 containing the most recent values from the Gamepad's right axis stick.
         * This is updated automatically as part of the Gamepad.update cycle.
         * The H Axis is mapped to the `Vector2.x` property, and the V Axis to the `Vector2.y` property.
         * The values are based on the Axis thresholds.
         * If the Gamepad does not have a right axis stick, the values will always be zero.
         *
         * @name Phaser.Input.Gamepad.Gamepad#rightStick
         * @type {Phaser.Math.Vector2}
         * @since 3.10.0
         */
        this.rightStick = new Vector2();
    },

    /**
     * Gets the total number of axis this Gamepad claims to support.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getAxisTotal
     * @since 3.10.0
     *
     * @return {integer} The total number of axes this Gamepad claims to support.
     */
    getAxisTotal: function ()
    {
        return this.axes.length;
    },

    /**
     * Gets the value of an axis based on the given index.
     * The index must be valid within the range of axes supported by this Gamepad.
     * The return value will be a float between 0 and 1.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getAxisValue
     * @since 3.10.0
     *
     * @param {integer} index - The index of the axes to get the value for.
     *
     * @return {number} The value of the axis, between 0 and 1.
     */
    getAxisValue: function (index)
    {
        return this.axes[index].getValue();
    },

    /**
     * Sets the threshold value of all axis on this Gamepad.
     * The value is a float between 0 and 1 and is the amount below which the axis is considered as not having been moved.
     *
     * @method Phaser.Input.Gamepad.Gamepad#setAxisThreshold
     * @since 3.10.0
     *
     * @param {number} value - A value between 0 and 1.
     */
    setAxisThreshold: function (value)
    {
        for (var i = 0; i < this.axes.length; i++)
        {
            this.axes[i].threshold = value;
        }
    },

    /**
     * Gets the total number of buttons this Gamepad claims to have.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getButtonTotal
     * @since 3.10.0
     *
     * @return {integer} The total number of buttons this Gamepad claims to have.
     */
    getButtonTotal: function ()
    {
        return this.buttons.length;
    },

    /**
     * Gets the value of a button based on the given index.
     * The index must be valid within the range of buttons supported by this Gamepad.
     *
     * The return value will be either 0 or 1 for an analogue button, or a float between 0 and 1
     * for a pressure-sensitive digital button, such as the shoulder buttons on a Dual Shock.
     *
     * @method Phaser.Input.Gamepad.Gamepad#getButtonValue
     * @since 3.10.0
     *
     * @param {integer} index - The index of the button to get the value for.
     *
     * @return {number} The value of the button, between 0 and 1.
     */
    getButtonValue: function (index)
    {
        return this.buttons[index].value;
    },

    /**
     * Returns if the button is pressed down or not.
     * The index must be valid within the range of buttons supported by this Gamepad.
     *
     * @method Phaser.Input.Gamepad.Gamepad#isButtonDown
     * @since 3.10.0
     *
     * @param {integer} index - The index of the button to get the value for.
     *
     * @return {boolean} `true` if the button is considered as being pressed down, otherwise `false`.
     */
    isButtonDown: function (index)
    {
        return this.buttons[index].pressed;
    },

    /**
     * Internal update handler for this Gamepad.
     * Called automatically by the Gamepad Manager as part of its update.
     *
     * @method Phaser.Input.Gamepad.Gamepad#update
     * @private
     * @since 3.0.0
     */
    update: function (pad)
    {
        var i;

        //  Sync the button values

        var localButtons = this.buttons;
        var gamepadButtons = pad.buttons;

        var len = localButtons.length;

        for (i = 0; i < len; i++)
        {
            localButtons[i].update(gamepadButtons[i].value);
        }

        //  Sync the axis values

        var localAxes = this.axes;
        var gamepadAxes = pad.axes;

        len = localAxes.length;

        for (i = 0; i < len; i++)
        {
            localAxes[i].update(gamepadAxes[i]);
        }

        if (len >= 2)
        {
            this.leftStick.set(localAxes[0].getValue(), localAxes[1].getValue());

            if (len >= 4)
            {
                this.rightStick.set(localAxes[2].getValue(), localAxes[3].getValue());
            }
        }
    },

    /**
     * Destroys this Gamepad instance, its buttons and axes, and releases external references it holds.
     *
     * @method Phaser.Input.Gamepad.Gamepad#destroy
     * @since 3.10.0
     */
    destroy: function ()
    {
        this.removeAllListeners();

        this.manager = null;
        this.pad = null;

        var i;

        for (i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].destroy();
        }

        for (i = 0; i < this.axes.length; i++)
        {
            this.axes[i].destroy();
        }

        this.buttons = [];
        this.axes = [];
    },

    /**
     * Is this Gamepad currently connected or not?
     *
     * @name Phaser.Input.Gamepad.Gamepad#connected
     * @type {boolean}
     * @default true
     * @since 3.0.0
     */
    connected: {

        get: function ()
        {
            return this.pad.connected;
        }

    },

    /**
     * A timestamp containing the most recent time this Gamepad was updated.
     *
     * @name Phaser.Input.Gamepad.Gamepad#timestamp
     * @type {number}
     * @since 3.0.0
     */
    timestamp: {

        get: function ()
        {
            return this.pad.timestamp;
        }

    },

    /**
     * Is the Gamepad's Left button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad left button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#left
     * @type {boolean}
     * @since 3.10.0
     */
    left: {

        get: function ()
        {
            return this._LCLeft.pressed;
        }

    },

    /**
     * Is the Gamepad's Right button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad right button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#right
     * @type {boolean}
     * @since 3.10.0
     */
    right: {

        get: function ()
        {
            return this._LCRight.pressed;
        }

    },

    /**
     * Is the Gamepad's Up button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad up button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#up
     * @type {boolean}
     * @since 3.10.0
     */
    up: {

        get: function ()
        {
            return this._LCTop.pressed;
        }

    },

    /**
     * Is the Gamepad's Down button being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * This is the d-pad down button under standard Gamepad mapping.
     *
     * @name Phaser.Input.Gamepad.Gamepad#down
     * @type {boolean}
     * @since 3.10.0
     */
    down: {

        get: function ()
        {
            return this._LCBottom.pressed;
        }

    },

    /**
     * Is the Gamepad's bottom button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the X button.
     * On an XBox controller it's the A button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#A
     * @type {boolean}
     * @since 3.10.0
     */
    A: {

        get: function ()
        {
            return this._RCBottom.pressed;
        }

    },

    /**
     * Is the Gamepad's top button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the Triangle button.
     * On an XBox controller it's the Y button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#Y
     * @type {boolean}
     * @since 3.10.0
     */
    Y: {

        get: function ()
        {
            return this._RCTop.pressed;
        }

    },

    /**
     * Is the Gamepad's left button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the Square button.
     * On an XBox controller it's the X button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#X
     * @type {boolean}
     * @since 3.10.0
     */
    X: {

        get: function ()
        {
            return this._RCLeft.pressed;
        }

    },

    /**
     * Is the Gamepad's right button in the right button cluster being pressed?
     * If the Gamepad doesn't have this button it will always return false.
     * On a Dual Shock controller it's the Circle button.
     * On an XBox controller it's the B button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#B
     * @type {boolean}
     * @since 3.10.0
     */
    B: {

        get: function ()
        {
            return this._RCRight.pressed;
        }

    },

    /**
     * Returns the value of the Gamepad's top left shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the L1 button.
     * On an XBox controller it's the LB button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#L1
     * @type {number}
     * @since 3.10.0
     */
    L1: {

        get: function ()
        {
            return this._FBLeftTop.value;
        }

    },

    /**
     * Returns the value of the Gamepad's bottom left shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the L2 button.
     * On an XBox controller it's the LT button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#L2
     * @type {number}
     * @since 3.10.0
     */
    L2: {

        get: function ()
        {
            return this._FBLeftBottom.value;
        }

    },

    /**
     * Returns the value of the Gamepad's top right shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the R1 button.
     * On an XBox controller it's the RB button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#R1
     * @type {number}
     * @since 3.10.0
     */
    R1: {

        get: function ()
        {
            return this._FBRightTop.value;
        }

    },

    /**
     * Returns the value of the Gamepad's bottom right shoulder button.
     * If the Gamepad doesn't have this button it will always return zero.
     * The value is a float between 0 and 1, corresponding to how depressed the button is.
     * On a Dual Shock controller it's the R2 button.
     * On an XBox controller it's the RT button.
     *
     * @name Phaser.Input.Gamepad.Gamepad#R2
     * @type {number}
     * @since 3.10.0
     */
    R2: {

        get: function ()
        {
            return this._FBRightBottom.value;
        }

    }

});

module.exports = Gamepad;
