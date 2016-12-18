/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* If you need more fine-grained control over the handling of specific keys you can create and use Phaser.Key objects.
*
* @class Phaser.Key
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {integer} keycode - The key code this Key is responsible for. See {@link Phaser.KeyCode}.
*/
Phaser.Key = function (game, keycode) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * The enabled state of the key - see `enabled`.
    * @property {boolean} _enabled
    * @private
    */
    this._enabled = true;

    /**
    * @property {object} event - Stores the most recent DOM event.
    * @readonly
    */
    this.event = null;

    /**
    * @property {boolean} isDown - The "down" state of the key. This will remain `true` for as long as the keyboard thinks this key is held down.
    * @default
    */
    this.isDown = false;

    /**
    * @property {boolean} isUp - The "up" state of the key. This will remain `true` for as long as the keyboard thinks this key is up.
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
    * If the key is up this value holds the duration of that key release and is constantly updated.
    * If the key is down it holds the duration of the previous up session.
    * @property {number} duration - The number of milliseconds this key has been up for.
    * @default
    */
    this.durationUp = -2500;

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
    * @property {Phaser.Signal} onUp - This Signal is dispatched every time this Key is released. It is only dispatched once (until the key is pressed and released again).
    */
    this.onUp = new Phaser.Signal();

    /**
     * @property {boolean} _justDown - True if the key has just been pressed (NOTE: requires to be reset, see justDown getter)
     * @private
     */
    this._justDown = false;

    /**
     * @property {boolean} _justUp - True if the key has just been pressed (NOTE: requires to be reset, see justDown getter)
     * @private
     */
    this._justUp = false;

};

Phaser.Key.prototype = {

    /**
    * Called automatically by Phaser.Keyboard.
    *
    * @method Phaser.Key#update
    * @protected
    */
    update: function () {

        if (!this._enabled) { return; }

        if (this.isDown)
        {
            this.duration = this.game.time.time - this.timeDown;
            this.repeats++;

            if (this.onHoldCallback)
            {
                this.onHoldCallback.call(this.onHoldContext, this);
            }
        }
        else
        {
            this.durationUp = this.game.time.time - this.timeUp;
        }

    },

    /**
    * Called automatically by Phaser.Keyboard.
    *
    * @method Phaser.Key#processKeyDown
    * @param {KeyboardEvent} event - The DOM event that triggered this.
    * @protected
    */
    processKeyDown: function (event) {

        if (!this._enabled) { return; }

        this.event = event;

        // exit if this key down is from auto-repeat
        if (this.isDown)
        {
            return;
        }

        this.altKey = event.altKey;
        this.ctrlKey = event.ctrlKey;
        this.shiftKey = event.shiftKey;

        this.isDown = true;
        this.isUp = false;
        this.timeDown = this.game.time.time;
        this.duration = 0;
        this.durationUp = this.game.time.time - this.timeUp;
        this.repeats = 0;

        // _justDown will remain true until it is read via the justDown Getter
        // this enables the game to poll for past presses, or reset it at the start of a new game state
        this._justDown = true;

        this.onDown.dispatch(this);

    },

    /**
    * Called automatically by Phaser.Keyboard.
    *
    * @method Phaser.Key#processKeyUp
    * @param {KeyboardEvent} event - The DOM event that triggered this.
    * @protected
    */
    processKeyUp: function (event) {

        if (!this._enabled) { return; }

        this.event = event;

        if (this.isUp)
        {
            return;
        }

        this.isDown = false;
        this.isUp = true;
        this.timeUp = this.game.time.time;
        this.duration = this.game.time.time - this.timeDown;
        this.durationUp = 0;

        // _justUp will remain true until it is read via the justUp Getter
        // this enables the game to poll for past presses, or reset it at the start of a new game state
        this._justUp = true;

        this.onUp.dispatch(this);

    },

    /**
    * Resets the state of this Key.
    *
    * This sets isDown to false, isUp to true, resets the time to be the current time, and _enables_ the key.
    * In addition, if it is a "hard reset", it clears clears any callbacks associated with the onDown and onUp events and removes the onHoldCallback.
    *
    * @method Phaser.Key#reset
    * @param {boolean} [hard=true] - A soft reset won't reset any events or callbacks; a hard reset will.
    */
    reset: function (hard) {

        if (hard === undefined) { hard = true; }

        this.isDown = false;
        this.isUp = true;
        this.timeUp = this.game.time.time;
        this.duration = 0;
        this.durationUp = -2500;
        this._enabled = true; // .enabled causes reset(false)
        this._justDown = false;
        this._justUp = false;

        if (hard)
        {
            this.onDown.removeAll();
            this.onUp.removeAll();
            this.onHoldCallback = null;
            this.onHoldContext = null;
        }

    },

    /**
    * Returns `true` if the Key was pressed down within the `duration` value given, or `false` if it either isn't down,
    * or was pressed down longer ago than then given duration.
    *
    * @method Phaser.Key#downDuration
    * @param {number} [duration=50] - The duration within which the key is considered as being just pressed. Given in ms.
    * @return {boolean} True if the key was pressed down within the given duration.
    */
    downDuration: function (duration) {

        if (duration === undefined) { duration = 50; }

        return (this.isDown && this.duration < duration);

    },

    /**
    * Returns `true` if the Key was pressed down within the `duration` value given, or `false` if it either isn't down,
    * or was pressed down longer ago than then given duration.
    *
    * @method Phaser.Key#upDuration
    * @param {number} [duration=50] - The duration within which the key is considered as being just released. Given in ms.
    * @return {boolean} True if the key was released within the given duration.
    */
    upDuration: function (duration) {

        if (duration === undefined) { duration = 50; }

        return (!this.isDown && ((this.game.time.time - this.timeUp) < duration));

    },
    
    /**
    * Returns `true` if the Key was just pressed down this update tick, or `false` if it either isn't down,
    * or was pressed down on a previous update tick.
    * 
    * @method Phaser.Key#justPressed
    * @return {boolean} True if the key was just pressed down this update tick.
    */
    justPressed: function () {

        return (this.isDown && this.duration === 0);

    },

    /**
    * Returns `true` if the Key was just released this update tick, or `false` if it either isn't up,
    * or was released on a previous update tick.
    * 
    * @method Phaser.Key#justReleased
    * @return {boolean} True if the key was just released this update tick.
    */
    justReleased: function () {

        return (!this.isDown && this.durationUp === 0);

    }

};

/**
* The justDown value allows you to test if this Key has just been pressed down or not.
* When you check this value it will return `true` if the Key is down, otherwise `false`.
* You can only call justDown once per key press. It will only return `true` once, until the Key is released and pressed down again.
* This allows you to use it in situations where you want to check if this key is down without using a Signal, such as in a core game loop.
*
* @name Phaser.Key#justDown
* @property {boolean} justDown
* @memberof Phaser.Key
* @default false
*/
Object.defineProperty(Phaser.Key.prototype, "justDown", {

    get: function () {

        var current = this._justDown;
        this._justDown = false;
        return current;

    }

});

/**
* The justUp value allows you to test if this Key has just been released or not.
* When you check this value it will return `true` if the Key is up, otherwise `false`.
* You can only call justUp once per key release. It will only return `true` once, until the Key is pressed down and released again.
* This allows you to use it in situations where you want to check if this key is up without using a Signal, such as in a core game loop.
*
* @name Phaser.Key#justUp
* @property {boolean} justUp
* @memberof Phaser.Key
* @default false
*/
Object.defineProperty(Phaser.Key.prototype, "justUp", {

    get: function () {

        var current = this._justUp;
        this._justUp = false;
        return current;

    }

});

/**
* An enabled key processes its update and dispatches events.
* A key can be disabled momentarily at runtime instead of deleting it.
* @name Phaser.Key#enabled
* @property {boolean} enabled
* @memberof Phaser.Key
* @default true
*/
Object.defineProperty(Phaser.Key.prototype, "enabled", {

    get: function () {

        return this._enabled;

    },

    set: function (value) {

        value = !!value;

        if (value !== this._enabled)
        {
            if (!value)
            {
                this.reset(false);
            }

            this._enabled = value;
        }
    }

});

Phaser.Key.prototype.constructor = Phaser.Key;
