//  A generic Key object which can be passed to the Process functions (and so on)

//  keycode can be either numeric or a string

var Key = function (keycode, name)
{
    if (typeof keycode === 'string')
    {
        keycode = keycode.toUpperCase().charCodeAt(0);
    }

    if (name === undefined || name === '')
    {
        name = String.fromCharCode(keycode);
    }

    /**
    * @property {number} keyCode - The keycode of this key.
    */
    this.keyCode = keycode;

    /**
    * @property {string} name - A string representation of this Key (worked out via String.fromCharCode if possible, or set in the arguments)
    */
    this.name = name;

    /**
    * @property {boolean} preventDefault - Should this Key prevent event propagation?
    * @default
    */
    this.preventDefault = false;

    /**
    * @property {boolean} enabled - Can this Key be processed?
    * @default
    */
    this.enabled = true;

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
    this.timeUp = 0;

    /**
    * @property {number} repeats - If a key is held down this holds down the number of times the key has 'repeated'.
    * @default
    */
    this.repeats = 0;

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

module.exports = Key;
