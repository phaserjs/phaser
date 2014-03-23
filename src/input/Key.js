/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Key
* @classdesc If you need more fine-grained control over the handling of specific keys you can create and use Phaser.Key objects.
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} keycode - The key code this Key is responsible for.
*/
Phaser.Key = function (game, keycode) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {object} event - Stores the most recent DOM event.
    * @readonly
    */
    this.event = null;

    /**
    * @property {boolean} isDown - The "down" state of the key.
    * @default
    */
    this.isDown = false;

    /**
    * @property {boolean} isUp - The "up" state of the key.
    * @default
    */
    this.isUp = true;

    /**
    * @property {boolean} altKey - The down state of the ALT key, if pressed at the same time as this key.
    * @default
    */
    this.altKey = false;

    /**
    * @property {boolean} ctrlKey - The down state of the CTRL key, if pressed at the same time as this key.
    * @default
    */
    this.ctrlKey = false;

    /**
    * @property {boolean} shiftKey - The down state of the SHIFT key, if pressed at the same time as this key.
    * @default
    */
    this.shiftKey = false;

    /**
    * @property {number} timeDown - The timestamp when the key was last pressed down. This is based on Game.time.now.
    */
    this.timeDown = 0;

    /**
    * If the key is down this value holds the duration of that key press and is constantly updated.
    * If the key is up it holds the duration of the previous down session.
    * @property {number} duration - The number of milliseconds this key has been held down for.
    * @default
    */
    this.duration = 0;

    /**
    * @property {number} timeUp - The timestamp when the key was last released. This is based on Game.time.now.
    * @default
    */
    this.timeUp = -2500;

    /**
    * @property {number} repeats - If a key is held down this holds down the number of times the key has 'repeated'.
    * @default
    */
    this.repeats = 0;

    /**
    * @property {number} keyCode - The keycode of this key.
    */
    this.keyCode = keycode;

    /**
    * @property {Phaser.Signal} onDown - This Signal is dispatched every time this Key is pressed down. It is only dispatched once (until the key is released again).
    */
    this.onDown = new Phaser.Signal();

    /**
    * @property {function} onHoldCallback - A callback that is called while this Key is held down. Warning: Depending on refresh rate that could be 60+ times per second.
    */
    this.onHoldCallback = null;

    /**
    * @property {object} onHoldContext - The context under which the onHoldCallback will be called.
    */
    this.onHoldContext = null;

    /**
    * @property {Phaser.Signal} onUp - This Signal is dispatched every time this Key is pressed down. It is only dispatched once (until the key is released again).
    */
    this.onUp = new Phaser.Signal();

};

Phaser.Key.prototype = {

    update: function () {

        if (this.isDown)
        {
            this.duration = this.game.time.now - this.timeDown;
            this.repeats++;

            if (this.onHoldCallback)
            {
                this.onHoldCallback.call(this.onHoldContext, this);
            }
        }

    },

    /**
    * Called automatically by Phaser.Keyboard.
    * @method Phaser.Key#processKeyDown
    * @param {KeyboardEvent} event.
    * @protected
    */
    processKeyDown: function (event) {

        this.event = event;

        if (this.isDown)
        {
            return;
        }

        this.altKey = event.altKey;
        this.ctrlKey = event.ctrlKey;
        this.shiftKey = event.shiftKey;

        this.isDown = true;
        this.isUp = false;
        this.timeDown = this.game.time.now;
        this.duration = 0;
        this.repeats = 0;

        this.onDown.dispatch(this);

    },

    /**
    * Called automatically by Phaser.Keyboard.
    * @method Phaser.Key#processKeyUp
    * @param {KeyboardEvent} event.
    * @protected
    */
    processKeyUp: function (event) {

        this.event = event;

        if (this.isUp)
        {
            return;
        }

        this.isDown = false;
        this.isUp = true;
        this.timeUp = this.game.time.now;
        this.duration = this.game.time.now - this.timeDown;

        this.onUp.dispatch(this);

    },

    /**
    * Resets the state of this Key.
    *
    * @method Phaser.Key#reset
    */
    reset: function () {

        this.isDown = false;
        this.isUp = true;
        this.timeUp = this.game.time.now;
        this.duration = this.game.time.now - this.timeDown;

    },

    /**
    * Returns the "just pressed" state of the Key. Just pressed is considered true if the key was pressed down within the duration given (default 250ms)
    * @method Phaser.Key#justPressed
    * @param {number} [duration=250] - The duration below which the key is considered as being just pressed.
    * @return {boolean} True if the key is just pressed otherwise false.
    */
    justPressed: function (duration) {

        if (typeof duration === "undefined") { duration = 2500; }

        return (this.isDown && this.duration < duration);

    },

    /**
    * Returns the "just released" state of the Key. Just released is considered as being true if the key was released within the duration given (default 250ms)
    * @method Phaser.Key#justReleased
    * @param {number} [duration=250] - The duration below which the key is considered as being just released.
    * @return {boolean} True if the key is just released otherwise false.
    */
    justReleased: function (duration) {

        if (typeof duration === "undefined") { duration = 2500; }

        return (!this.isDown && ((this.game.time.now - this.timeUp) < duration));

    }

};

Phaser.Key.prototype.constructor = Phaser.Key;
