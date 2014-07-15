/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Keyboard class handles looking after keyboard input for your game.
* It will recognise and respond to key presses and dispatch the required events.
* Please be aware that lots of keyboards are unable to process certain combinations of keys due to hardware
* limitations known as ghosting. Full details here: http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/
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
    * You can disable all Keyboard Input by setting disabled to true. While true all new input related events will be ignored.
    * @property {boolean} disabled - The disabled state of the Keyboard.
    * @default
    */
    this.disabled = false;

    /**
    * @property {Object} event - The most recent DOM event from keydown or keyup. This is updated every time a new key is pressed or released.
    */
    this.event = null;

    /**
    * @property {Object} pressEvent - The most recent DOM event from keypress.
    */
    this.pressEvent = null;

    /**
    * @property {Object} callbackContext - The context under which the callbacks are run.
    */
    this.callbackContext = this;

    /**
    * @property {function} onDownCallback - This callback is invoked every time a key is pressed down, including key repeats when a key is held down.
    */
    this.onDownCallback = null;

    /**
    * @property {function} onPressCallback - This callback is invoked every time a DOM onkeypress event is raised, which is only for printable keys.
    */
    this.onPressCallback = null;

    /**
    * @property {function} onUpCallback - This callback is invoked every time a key is released.
    */
    this.onUpCallback = null;

    /**
    * @property {array<Phaser.Key>} _keys - The array the Phaser.Key objects are stored in.
    * @private
    */
    this._keys = [];

    /**
    * @property {array} _capture - The array the key capture values are stored in.
    * @private
    */
    this._capture = [];

    /**
    * @property {function} _onKeyDown
    * @private
    * @default
    */
    this._onKeyDown = null;

    /**
    * @property {function} _onKeyPress
    * @private
    * @default
    */
    this._onKeyPress = null;

    /**
    * @property {function} _onKeyUp
    * @private
    * @default
    */
    this._onKeyUp = null;

    /**
    * @property {number} _i - Internal cache var
    * @private
    */
    this._i = 0;

    /**
    * @property {number} _k - Internal cache var
    * @private
    */
    this._k = 0;

};

Phaser.Keyboard.prototype = {

    /**
    * Add callbacks to the Keyboard handler so that each time a key is pressed down or released the callbacks are activated.
    *
    * @method Phaser.Keyboard#addCallbacks
    * @param {Object} context - The context under which the callbacks are run.
    * @param {function} [onDown=null] - This callback is invoked every time a key is pressed down.
    * @param {function} [onUp=null] - This callback is invoked every time a key is released.
    * @param {function} [onPress=null] - This callback is invoked every time the onkeypress event is raised.
    */
    addCallbacks: function (context, onDown, onUp, onPress) {

        this.callbackContext = context;

        if (typeof onDown !== 'undefined')
        {
            this.onDownCallback = onDown;
        }

        if (typeof onUp !== 'undefined')
        {
            this.onUpCallback = onUp;
        }

        if (typeof onPress !== 'undefined')
        {
            this.onPressCallback = onPress;
        }

    },

    /**
    * If you need more fine-grained control over a Key you can create a new Phaser.Key object via this method.
    * The Key object can then be polled, have events attached to it, etc.
    *
    * @method Phaser.Keyboard#addKey
    * @param {number} keycode - The keycode of the key, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACEBAR
    * @return {Phaser.Key} The Key object which you can store locally and reference directly.
    */
    addKey: function (keycode) {

        if (!this._keys[keycode])
        {
            this._keys[keycode] = new Phaser.Key(this.game, keycode);

            this.addKeyCapture(keycode);
        }

        return this._keys[keycode];

    },

    /**
    * Removes a Key object from the Keyboard manager.
    *
    * @method Phaser.Keyboard#removeKey
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACEBAR
    */
    removeKey: function (keycode) {

        if (this._keys[keycode])
        {
            this._keys[keycode] = null;

            this.removeKeyCapture(keycode);
        }

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
        };

    },

    /**
    * Starts the Keyboard event listeners running (keydown and keyup). They are attached to the window.
    * This is called automatically by Phaser.Input and should not normally be invoked directly.
    *
    * @method Phaser.Keyboard#start
    */
    start: function () {

        if (this.game.device.cocoonJS)
        {
            return;
        }

        if (this._onKeyDown !== null)
        {
            //  Avoid setting multiple listeners
            return;
        }

        var _this = this;

        this._onKeyDown = function (event) {
            return _this.processKeyDown(event);
        };

        this._onKeyUp = function (event) {
            return _this.processKeyUp(event);
        };

        this._onKeyPress = function (event) {
            return _this.processKeyPress(event);
        };

        window.addEventListener('keydown', this._onKeyDown, false);
        window.addEventListener('keyup', this._onKeyUp, false);
        window.addEventListener('keypress', this._onKeyPress, false);

    },

    /**
    * Stops the Keyboard event listeners from running (keydown, keyup and keypress). They are removed from the window.
    *
    * @method Phaser.Keyboard#stop
    */
    stop: function () {

        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('keypress', this._onKeyPress);

        this._onKeyDown = null;
        this._onKeyUp = null;
        this._onKeyPress = null;

    },

    /**
    * Stops the Keyboard event listeners from running (keydown and keyup). They are removed from the window.
    * Also clears all key captures and currently created Key objects.
    *
    * @method Phaser.Keyboard#destroy
    */
    destroy: function () {

        this.stop();

        this.clearCaptures();

        this._keys.length = 0;
        this._i = 0;

    },

    /**
    * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
    * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
    * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
    * Pass in either a single keycode or an array/hash of keycodes.
    *
    * @method Phaser.Keyboard#addKeyCapture
    * @param {number|array|object} keycode - Either a single numeric keycode or an array/hash of keycodes: [65, 67, 68].
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
    *
    * @method Phaser.Keyboard#removeKeyCapture
    * @param {number} keycode
    */
    removeKeyCapture: function (keycode) {

        delete this._capture[keycode];

    },

    /**
    * Clear all set key captures.
    *
    * @method Phaser.Keyboard#clearCaptures
    */
    clearCaptures: function () {

        this._capture = {};

    },

    /**
    * Updates all currently defined keys.
    *
    * @method Phaser.Keyboard#update
    */
    update: function () {

        this._i = this._keys.length;

        while (this._i--)
        {
            if (this._keys[this._i])
            {
                this._keys[this._i].update();
            }
        }

    },

    /**
    * Process the keydown event.
    *
    * @method Phaser.Keyboard#processKeyDown
    * @param {KeyboardEvent} event
    * @protected
    */
    processKeyDown: function (event) {

        this.event = event;

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        //   The event is being captured but another hotkey may need it
        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (!this._keys[event.keyCode])
        {
            this._keys[event.keyCode] = new Phaser.Key(this.game, event.keyCode);
        }

        this._keys[event.keyCode].processKeyDown(event);

        this._k = event.keyCode;

        if (this.onDownCallback)
        {
            this.onDownCallback.call(this.callbackContext, event);
        }

    },

    /**
    * Process the keypress event.
    *
    * @method Phaser.Keyboard#processKeyPress
    * @param {KeyboardEvent} event
    * @protected
    */
    processKeyPress: function (event) {

        this.pressEvent = event;

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this.onPressCallback)
        {
            this.onPressCallback.call(this.callbackContext, String.fromCharCode(event.charCode), event);
        }

    },

    /**
    * Process the keyup event.
    *
    * @method Phaser.Keyboard#processKeyUp
    * @param {KeyboardEvent} event
    * @protected
    */
    processKeyUp: function (event) {

        this.event = event;

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        if (this._capture[event.keyCode])
        {
            event.preventDefault();
        }

        if (!this._keys[event.keyCode])
        {
            this._keys[event.keyCode] = new Phaser.Key(this.game, event.keyCode);
        }

        this._keys[event.keyCode].processKeyUp(event);

        if (this.onUpCallback)
        {
            this.onUpCallback.call(this.callbackContext, event);
        }

    },

    /**
    * Resets all Keys.
    *
    * @method Phaser.Keyboard#reset
    * @param {boolean} [hard=true] - A soft reset won't reset any events or callbacks that are bound to the Keys. A hard reset will.
    */
    reset: function (hard) {

        if (typeof hard === 'undefined') { hard = true; }

        this.event = null;

        var i = this._keys.length;

        while (i--)
        {
            if (this._keys[i])
            {
                this._keys[i].reset(hard);
            }
        }

    },

    /**
    * Returns the "just pressed" state of the key. Just pressed is considered true if the key was pressed down within the duration given (default 250ms)
    *
    * @method Phaser.Keyboard#justPressed
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACEBAR
    * @param {number} [duration=50] - The duration below which the key is considered as being just pressed.
    * @return {boolean} True if the key is just pressed otherwise false.
    */
    justPressed: function (keycode, duration) {

        if (typeof duration === 'undefined') { duration = 50; }

        if (this._keys[keycode])
        {
            return this._keys[keycode].justPressed(duration);
        }
        else
        {
            return false;
        }

    },

    /**
    * Returns the "just released" state of the Key. Just released is considered as being true if the key was released within the duration given (default 250ms)
    *
    * @method Phaser.Keyboard#justReleased
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACEBAR
    * @param {number} [duration=50] - The duration below which the key is considered as being just released.
    * @return {boolean} True if the key is just released otherwise false.
    */
    justReleased: function (keycode, duration) {

        if (typeof duration === 'undefined') { duration = 50; }

        if (this._keys[keycode])
        {
            return this._keys[keycode].justReleased(duration);
        }
        else
        {
            return false;
        }

    },

    /**
    * Returns true of the key is currently pressed down. Note that it can only detect key presses on the web browser.
    *
    * @method Phaser.Keyboard#isDown
    * @param {number} keycode - The keycode of the key to remove, i.e. Phaser.Keyboard.UP or Phaser.Keyboard.SPACEBAR
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

/**
* Returns the string value of the most recently pressed key.
* @name Phaser.Keyboard#lastChar
* @property {string} lastChar - The string value of the most recently pressed key.
* @readonly
*/
Object.defineProperty(Phaser.Keyboard.prototype, "lastChar", {

    get: function () {

        if (this.event.charCode === 32)
        {
            return '';
        }
        else
        {
            return String.fromCharCode(this.pressEvent.charCode);
        }

    }

});

/**
* Returns the most recently pressed Key. This is a Phaser.Key object and it changes every time a key is pressed.
* @name Phaser.Keyboard#lastKey
* @property {Phaser.Key} lastKey - The most recently pressed Key.
* @readonly
*/
Object.defineProperty(Phaser.Keyboard.prototype, "lastKey", {

    get: function () {

        return this._keys[this._k];

    }

});

Phaser.Keyboard.prototype.constructor = Phaser.Keyboard;

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
