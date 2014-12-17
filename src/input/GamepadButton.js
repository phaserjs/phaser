/**
* @author       @karlmacklin <tacklemcclean@gmail.com>
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* If you need more fine-grained control over the handling of specific buttons you can create and use Phaser.GamepadButton objects.
* 
* @class Phaser.GamepadButton
* @constructor
* @param {Phaser.SinglePad} pad - A reference to the gamepad that owns this button.
* @param {number} buttonCode - The button code this GamepadButton is responsible for.
*/
Phaser.GamepadButton = function (pad, buttonCode) {

    /**
    * @property {Phaser.SinglePad} pad - A reference to the gamepad that owns this button.
    */
    this.pad = pad;

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = pad.game;

    /**
    * @property {boolean} isDown - The "down" state of the button.
    * @default
    */
    this.isDown = false;

    /**
    * @property {boolean} isUp - The "up" state of the button.
    * @default
    */
    this.isUp = true;

    /**
    * @property {number} timeDown - The timestamp when the button was last pressed down.
    * @default
    */
    this.timeDown = 0;

    /**
    * If the button is down this value holds the duration of that button press and is constantly updated.
    * If the button is up it holds the duration of the previous down session.
    * @property {number} duration - The number of milliseconds this button has been held down for.
    * @default
    */
    this.duration = 0;

    /**
    * @property {number} timeUp - The timestamp when the button was last released.
    * @default
    */
    this.timeUp = 0;

    /**
    * @property {number} repeats - If a button is held down this holds down the number of times the button has 'repeated'.
    * @default
    */
    this.repeats = 0;

    /**
    * @property {number} value - Button value. Mainly useful for checking analog buttons (like shoulder triggers)
    * @default
    */
    this.value = 0;

    /**
    * @property {number} buttonCode - The buttoncode of this button.
    */
    this.buttonCode = buttonCode;

    /**
    * @property {Phaser.Signal} onDown - This Signal is dispatched every time this GamepadButton is pressed down. It is only dispatched once (until the button is released again).
    */
    this.onDown = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onUp - This Signal is dispatched every time this GamepadButton is pressed down. It is only dispatched once (until the button is released again).
    */
    this.onUp = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onFloat - This Signal is dispatched every time this GamepadButton changes floating value (between (but not exactly) 0 and 1)
    */
    this.onFloat = new Phaser.Signal();

};

Phaser.GamepadButton.prototype = {

    /**
    * Called automatically by Phaser.SinglePad.
    * 
    * @method Phaser.GamepadButton#processButtonDown
    * @protected
    * @param {number} value - Button value
    */
    processButtonDown: function (value) {

        this.isDown = true;
        this.isUp = false;
        this.timeDown = this.game.time.time;
        this.duration = 0;
        this.repeats = 0;
        this.value = value;

        this.onDown.dispatch(this, value);

    },

    /**
    * Called automatically by Phaser.SinglePad.
    * 
    * @method Phaser.GamepadButton#processButtonUp
    * @protected
    * @param {number} value - Button value
    */
    processButtonUp: function (value) {

        this.isDown = false;
        this.isUp = true;
        this.timeUp = this.game.time.time;
        this.value = value;

        this.onUp.dispatch(this, value);

    },

    /**
    * Called automatically by Phaser.SinglePad.
    * 
    * @method Phaser.GamepadButton#processButtonFloat
    * @protected
    * @param {number} value - Button value
    */
    processButtonFloat: function (value) {

        this.value = value;

        this.onFloat.dispatch(this, value);

    },

    /**
    * Returns the "just pressed" state of this button. Just pressed is considered true if the button was pressed down within the duration given (default 250ms).
    * 
    * @method Phaser.GamepadButton#justPressed
    * @param {number} [duration=250] - The duration below which the button is considered as being just pressed.
    * @return {boolean} True if the button is just pressed otherwise false.
    */
    justPressed: function (duration) {

        duration = duration || 250;

        return (this.isDown === true && (this.timeDown + duration) > this.game.time.time);

    },

    /**
    * Returns the "just released" state of this button. Just released is considered as being true if the button was released within the duration given (default 250ms).
    * 
    * @method Phaser.GamepadButton#justPressed
    * @param {number} [duration=250] - The duration below which the button is considered as being just released.
    * @return {boolean} True if the button is just pressed otherwise false.
    */
    justReleased: function (duration) {

        duration = duration || 250;

        return (this.isUp === true && (this.timeUp + duration) > this.game.time.time);

    },

    /**
    * Resets this GamepadButton, changing it to an isUp state and resetting the duration and repeats counters.
    * 
    * @method Phaser.GamepadButton#reset
    */
    reset: function () {

        this.isDown = false;
        this.isUp = true;
        this.timeDown = this.game.time.time;
        this.duration = 0;
        this.repeats = 0;

    },

    /**
    * Destroys this GamepadButton, this disposes of the onDown, onUp and onFloat signals and clears the pad and game references.
    * 
    * @method Phaser.GamepadButton#destroy
    */
    destroy: function () {

        this.onDown.dispose();
        this.onUp.dispose();
        this.onFloat.dispose();

        this.pad = null;
        this.game = null;

    }

};

Phaser.GamepadButton.prototype.constructor = Phaser.GamepadButton;
