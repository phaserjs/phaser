/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Keyboard class handles looking after keyboard input for your game. It will recognise and respond to key presses and dispatch the required events.
*
* @class Phaser.Keyboard
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Keyboard = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;
    
    /**
    * @property {object} _keys - The object the key values are stored in.
    * @private
    */
    this._keys = {};
    
    /**
    * @property {object} _hotkeys - The object the hot keys are stored in.
    * @private
    */
    this._hotkeys = {};

    /**
    * @property {object} _capture - The object the key capture values are stored in.
    * @private
    */
    this._capture = {};

    /**
    * You can disable all Keyboard Input by setting disabled to true. While true all new input related events will be ignored.
    * @property {boolean} disabled - The disabled state of the Keyboard.
    * @default
    */
    this.disabled = false;

    /**
    * @property {function} _onKeyDown
    * @private
    * @default
    */
    this._onKeyDown = null;
    
    /**
    * @property {function} _onKeyUp
    * @private
    * @default
    */
    this._onKeyUp = null;

    /**
    * @property {Object} callbackContext - The context under which the callbacks are run.
    */
    this.callbackContext = this;

    /**
    * @property {function} onDownCallback - This callback is invoked every time a key is pressed down.
    */
    this.onDownCallback = null;

    /**
    * @property {function} onUpCallback - This callback is invoked every time a key is released.
    */
    this.onUpCallback = null;
    
};

Phaser.Keyboard.prototype = {

    /**
    * Add callbacks to the Keyboard handler so that each time a key is pressed down or releases the callbacks are activated.
    * @method Phaser.Keyboard#addCallbacks
    * @param {Object} context - The context under which the callbacks are run.
    * @param {function} onDown - This callback is invoked every time a key is pressed down.
    * @param {function} [onUp=null] - This callback is invoked every time a key is released.
    */
    addCallbacks: function (context, onDown, onUp) {

        this.callbackContext = context;
        this.onDownCallback = onDown;

        if (typeof onUp !== 'undefined')
        {
            this.onUpCallback = onUp;
        }

    },

    /**
    * If you need more fine-grained control over a Key you can create a new Phaser.Key object via this method.
    * The Key object can then be polled, have events attached to it, etc.
    *
    * @method Phaser.Keyboard#addKey
    * @param {number} keycode - The keycode of the key, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @return {Phaser.Key} The Key object which you can store locally and reference directly.
    */
    addKey: function (keycode) {

        this._hotkeys[keycode] = new Phaser.Key(this.game, keycode);

        this.addKeyCapture(keycode);

        return this._hotkeys[keycode];

    },

    /**
    * Removes a Key object from the Keyboard manager.
    *
    * @method Phaser.Keyboard#removeKey
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    */
    removeKey: function (keycode) {

        delete (this._hotkeys[keycode]);

    },

    /**
    * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
    *
    * @method Phaser.Keyboard#createCursorKeys
    * @return {object} An object containing properties: up, down, left and right. Which can be polled like any other Phaser.Key object.
    */
    createCursorKeys: function () {

        return {
            up: this.addKey(Phaser.Keyboard.UP),
            down: this.addKey(Phaser.Keyboard.DOWN),
            left: this.addKey(Phaser.Keyboard.LEFT),
            right: this.addKey(Phaser.Keyboard.RIGHT)
        }

    },

    /**
    * Starts the Keyboard event listeners running (keydown and keyup). They are attached to the document.body.
    * This is called automatically by Phaser.Input and should not normally be invoked directly.
    *
    * @method Phaser.Keyboard#start
    */
    start: function () {

        var _this = this;

        this._onKeyDown = function (event) {
            return _this.processKeyDown(event);
        };

        this._onKeyUp = function (event) {
            return _this.processKeyUp(event);
        };

        window.addEventListener('keydown', this._onKeyDown, false);
        window.addEventListener('keyup', this._onKeyUp, false);

    },

    /**
    * Stops the Keyboard event listeners from running (keydown and keyup). They are removed from the document.body.
    *
    * @method Phaser.Keyboard#stop
    */
    stop: function () {

        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);

    },

    /**
    * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
    * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
    * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
    * Pass in either a single keycode or an array/hash of keycodes.
    * @method Phaser.Keyboard#addKeyCapture
    * @param {Any} keycode
    */
    addKeyCapture: function (keycode) {

        if (typeof keycode === 'object')
        {
            for (var key in keycode)
            {
                this._capture[keycode[key]] = true;
            }
        }
        else
        {
            this._capture[keycode] = true;
        }
    },

    /**
    * Removes an existing key capture.
    * @method Phaser.Keyboard#removeKeyCapture
    * @param {number} keycode
    */
    removeKeyCapture: function (keycode) {

        delete this._capture[keycode];

    },

    /**
    * Clear all set key captures.
    * @method Phaser.Keyboard#clearCaptures
    */
    clearCaptures: function () {

        this._capture = {};

    },

    /**
    * Process the keydown event.
    * @method Phaser.Keyboard#processKeyDown
    * @param {KeyboardEvent} event
    * @protected
    */
    processKeyDown: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (this.onDownCallback)
        {
            this.onDownCallback.call(this.callbackContext, event);
        }

        if (this._keys[event.keyCode] && this._keys[event.keyCode].isDown)
        {
            //  Key already down and still down, so update
            this._keys[event.keyCode].duration = this.game.time.now - this._keys[event.keyCode].timeDown;
        }
        else
        {
            if (!this._keys[event.keyCode])
            {
                //  Not used this key before, so register it
                this._keys[event.keyCode] = {
                    isDown: true,
                    timeDown: this.game.time.now,
                    timeUp: 0,
                    duration: 0
                };
            }
            else
            {
                //  Key used before but freshly down
                this._keys[event.keyCode].isDown = true;
                this._keys[event.keyCode].timeDown = this.game.time.now;
                this._keys[event.keyCode].duration = 0;
            }
        }

        if (this._hotkeys[event.keyCode])
        {
            this._hotkeys[event.keyCode].processKeyDown(event);
        }

    },

    /**
    * Process the keyup event.
    * @method Phaser.Keyboard#processKeyUp
    * @param {KeyboardEvent} event
    * @protected
    */
    processKeyUp: function (event) {

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (this.onUpCallback)
        {
            this.onUpCallback.call(this.callbackContext, event);
        }

        if (this._hotkeys[event.keyCode])
        {
            this._hotkeys[event.keyCode].processKeyUp(event);
        }

        if (this._keys[event.keyCode])
        {
            this._keys[event.keyCode].isDown = false;
            this._keys[event.keyCode].timeUp = this.game.time.now;
        }
        else
        {
            //  Not used this key before, so register it
            this._keys[event.keyCode] = {
                isDown: false,
                timeDown: this.game.time.now,
                timeUp: this.game.time.now,
                duration: 0
            };
        }

    },

    /**
    * Reset the "isDown" state of all keys.
    * @method Phaser.Keyboard#reset
    */
    reset: function () {

        for (var key in this._keys)
        {
            this._keys[key].isDown = false;
        }

    },

    /**
    * Returns the "just pressed" state of the key. Just pressed is considered true if the key was pressed down within the duration given (default 250ms)
    * @method Phaser.Keyboard#justPressed
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @param {number} [duration=250] - The duration below which the key is considered as being just pressed.
    * @return {boolean} True if the key is just pressed otherwise false.
    */
    justPressed: function (keycode, duration) {

        if (typeof duration === "undefined") { duration = 250; }

        if (this._keys[keycode] && this._keys[keycode].isDown && this._keys[keycode].duration < duration)
        {
            return true;
        }

        return false;

    },

    /**
    * Returns the "just released" state of the Key. Just released is considered as being true if the key was released within the duration given (default 250ms)
    * @method Phaser.Keyboard#justReleased
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @param {number} [duration=250] - The duration below which the key is considered as being just released.
    * @return {boolean} True if the key is just released otherwise false.
    */
    justReleased: function (keycode, duration) {

        if (typeof duration === "undefined") { duration = 250; }

        if (this._keys[keycode] && this._keys[keycode].isDown === false && (this.game.time.now - this._keys[keycode].timeUp < duration))
        {
            return true;
        }

        return false;

    },

    /**
    * Returns true of the key is currently pressed down. Note that it can only detect key presses on the web browser.
    * @method Phaser.Keyboard#isDown
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACE_BAR
    * @return {boolean} True if the key is currently down.
    */
    isDown: function (keycode) {

        if (this._keys[keycode])
        {
            return this._keys[keycode].isDown;
        }

        return false;

    }

};

Phaser.Keyboard.A = "A".charCodeAt(0);
Phaser.Keyboard.B = "B".charCodeAt(0);
Phaser.Keyboard.C = "C".charCodeAt(0);
Phaser.Keyboard.D = "D".charCodeAt(0);
Phaser.Keyboard.E = "E".charCodeAt(0);
Phaser.Keyboard.F = "F".charCodeAt(0);
Phaser.Keyboard.G = "G".charCodeAt(0);
Phaser.Keyboard.H = "H".charCodeAt(0);
Phaser.Keyboard.I = "I".charCodeAt(0);
Phaser.Keyboard.J = "J".charCodeAt(0);
Phaser.Keyboard.K = "K".charCodeAt(0);
Phaser.Keyboard.L = "L".charCodeAt(0);
Phaser.Keyboard.M = "M".charCodeAt(0);
Phaser.Keyboard.N = "N".charCodeAt(0);
Phaser.Keyboard.O = "O".charCodeAt(0);
Phaser.Keyboard.P = "P".charCodeAt(0);
Phaser.Keyboard.Q = "Q".charCodeAt(0);
Phaser.Keyboard.R = "R".charCodeAt(0);
Phaser.Keyboard.S = "S".charCodeAt(0);
Phaser.Keyboard.T = "T".charCodeAt(0);
Phaser.Keyboard.U = "U".charCodeAt(0);
Phaser.Keyboard.V = "V".charCodeAt(0);
Phaser.Keyboard.W = "W".charCodeAt(0);
Phaser.Keyboard.X = "X".charCodeAt(0);
Phaser.Keyboard.Y = "Y".charCodeAt(0);
Phaser.Keyboard.Z = "Z".charCodeAt(0);
Phaser.Keyboard.ZERO = "0".charCodeAt(0);
Phaser.Keyboard.ONE = "1".charCodeAt(0);
Phaser.Keyboard.TWO = "2".charCodeAt(0);
Phaser.Keyboard.THREE = "3".charCodeAt(0);
Phaser.Keyboard.FOUR = "4".charCodeAt(0);
Phaser.Keyboard.FIVE = "5".charCodeAt(0);
Phaser.Keyboard.SIX = "6".charCodeAt(0);
Phaser.Keyboard.SEVEN = "7".charCodeAt(0);
Phaser.Keyboard.EIGHT = "8".charCodeAt(0);
Phaser.Keyboard.NINE = "9".charCodeAt(0);
Phaser.Keyboard.NUMPAD_0 = 96;
Phaser.Keyboard.NUMPAD_1 = 97;
Phaser.Keyboard.NUMPAD_2 = 98;
Phaser.Keyboard.NUMPAD_3 = 99;
Phaser.Keyboard.NUMPAD_4 = 100;
Phaser.Keyboard.NUMPAD_5 = 101;
Phaser.Keyboard.NUMPAD_6 = 102;
Phaser.Keyboard.NUMPAD_7 = 103;
Phaser.Keyboard.NUMPAD_8 = 104;
Phaser.Keyboard.NUMPAD_9 = 105;
Phaser.Keyboard.NUMPAD_MULTIPLY = 106;
Phaser.Keyboard.NUMPAD_ADD = 107;
Phaser.Keyboard.NUMPAD_ENTER = 108;
Phaser.Keyboard.NUMPAD_SUBTRACT = 109;
Phaser.Keyboard.NUMPAD_DECIMAL = 110;
Phaser.Keyboard.NUMPAD_DIVIDE = 111;
Phaser.Keyboard.F1 = 112;
Phaser.Keyboard.F2 = 113;
Phaser.Keyboard.F3 = 114;
Phaser.Keyboard.F4 = 115;
Phaser.Keyboard.F5 = 116;
Phaser.Keyboard.F6 = 117;
Phaser.Keyboard.F7 = 118;
Phaser.Keyboard.F8 = 119;
Phaser.Keyboard.F9 = 120;
Phaser.Keyboard.F10 = 121;
Phaser.Keyboard.F11 = 122;
Phaser.Keyboard.F12 = 123;
Phaser.Keyboard.F13 = 124;
Phaser.Keyboard.F14 = 125;
Phaser.Keyboard.F15 = 126;
Phaser.Keyboard.COLON = 186;
Phaser.Keyboard.EQUALS = 187;
Phaser.Keyboard.UNDERSCORE = 189;
Phaser.Keyboard.QUESTION_MARK = 191;
Phaser.Keyboard.TILDE = 192;
Phaser.Keyboard.OPEN_BRACKET = 219;
Phaser.Keyboard.BACKWARD_SLASH = 220;
Phaser.Keyboard.CLOSED_BRACKET = 221;
Phaser.Keyboard.QUOTES = 222;
Phaser.Keyboard.BACKSPACE = 8;
Phaser.Keyboard.TAB = 9;
Phaser.Keyboard.CLEAR = 12;
Phaser.Keyboard.ENTER = 13;
Phaser.Keyboard.SHIFT = 16;
Phaser.Keyboard.CONTROL = 17;
Phaser.Keyboard.ALT = 18;
Phaser.Keyboard.CAPS_LOCK = 20;
Phaser.Keyboard.ESC = 27;
Phaser.Keyboard.SPACEBAR = 32;
Phaser.Keyboard.PAGE_UP = 33;
Phaser.Keyboard.PAGE_DOWN = 34;
Phaser.Keyboard.END = 35;
Phaser.Keyboard.HOME = 36;
Phaser.Keyboard.LEFT = 37;
Phaser.Keyboard.UP = 38;
Phaser.Keyboard.RIGHT = 39;
Phaser.Keyboard.DOWN = 40;
Phaser.Keyboard.INSERT = 45;
Phaser.Keyboard.DELETE = 46;
Phaser.Keyboard.HELP = 47;
Phaser.Keyboard.NUM_LOCK = 144;
