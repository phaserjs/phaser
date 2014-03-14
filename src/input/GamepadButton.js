/**
* @author       @karlmacklin <tacklemcclean@gmail.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.GamepadButton
* @classdesc If you need more fine-grained control over the handling of specific buttons you can create and use Phaser.GamepadButton objects.
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} buttoncode - The button code this GamepadButton is responsible for.
*/
Phaser.GamepadButton = function (game, buttoncode) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

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
    this.buttonCode = buttoncode;

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
    * @method Phaser.GamepadButton#processButtonDown
    * @param {Object} value - Button value
    * @protected
    */
    processButtonDown: function (value) {

        if (this.isDown)
        {
            this.duration = this.game.time.now - this.timeDown;
            this.repeats++;
        }
        else
        {
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this.game.time.now;
            this.duration = 0;
            this.repeats = 0;
            this.value = value;

            this.onDown.dispatch(this, value);
        }

    },

    /**
    * Called automatically by Phaser.SinglePad.
    * @method Phaser.GamepadButton#processButtonUp
    * @param {Object} value - Button value
    * @protected
    */
    processButtonUp: function (value) {

        this.isDown = false;
        this.isUp = true;
        this.timeUp = this.game.time.now;
        this.value = value;

        this.onUp.dispatch(this, value);

    },

    /**
    * Called automatically by Phaser.Gamepad.
    * @method Phaser.GamepadButton#processButtonFloat
    * @param {Object} value - Button value
    * @protected
    */
    processButtonFloat: function (value) {

        this.value = value;
        this.onFloat.dispatch(this, value);

    },

    /**
    * Returns the "just pressed" state of this button. Just pressed is considered true if the button was pressed down within the duration given (default 250ms).
    * @method Phaser.GamepadButton#justPressed
    * @param {number} [duration=250] - The duration below which the button is considered as being just pressed.
    * @return {boolean} True if the button is just pressed otherwise false.
    */
    justPressed: function (duration) {

        if (typeof duration === "undefined") { duration = 250; }

        return (this.isDown && this.duration < duration);

    },

    /**
    * Returns the "just released" state of this button. Just released is considered as being true if the button was released within the duration given (default 250ms).
    * @method Phaser.GamepadButton#justPressed
    * @param {number} [duration=250] - The duration below which the button is considered as being just released.
    * @return {boolean} True if the button is just pressed otherwise false.
    */
    justReleased: function (duration) {

        if (typeof duration === "undefined") { duration = 250; }

        return (this.isDown === false && (this.game.time.now - this.timeUp < duration));
    }

};

Phaser.GamepadButton.prototype.constructor = Phaser.GamepadButton;
