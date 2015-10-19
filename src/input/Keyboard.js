/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Keyboard class monitors keyboard input and dispatches keyboard events.
*
* _Note_: many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
* See http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/ for more details.
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
    * Keyboard input will only be processed if enabled.
    * @property {boolean} enabled
    * @default
    */
    this.enabled = true;

    /**
    * @property {object} event - The most recent DOM event from keydown or keyup. This is updated every time a new key is pressed or released.
    */
    this.event = null;

    /**
    * @property {object} pressEvent - The most recent DOM event from keypress.
    */
    this.pressEvent = null;

    /**
    * @property {object} callbackContext - The context under which the callbacks are run.
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
    * @param {object} context - The context under which the callbacks are run.
    * @param {function} [onDown=null] - This callback is invoked every time a key is pressed down.
    * @param {function} [onUp=null] - This callback is invoked every time a key is released.
    * @param {function} [onPress=null] - This callback is invoked every time the onkeypress event is raised.
    */
    addCallbacks: function (context, onDown, onUp, onPress) {

        this.callbackContext = context;

        if (onDown !== undefined && onDown !== null)
        {
            this.onDownCallback = onDown;
        }

        if (onUp !== undefined && onUp !== null)
        {
            this.onUpCallback = onUp;
        }

        if (onPress !== undefined && onPress !== null)
        {
            this.onPressCallback = onPress;
        }

    },

    /**
    * If you need more fine-grained control over a Key you can create a new Phaser.Key object via this method.
    * The Key object can then be polled, have events attached to it, etc.
    *
    * @method Phaser.Keyboard#addKey
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key.
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
    * A practical way to create an object containing user selected hotkeys.
    *
    * For example,
    *
    *     addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );
    *
    * would return an object containing properties (`up`, `down`, `left` and `right`) referring to {@link Phaser.Key} object.
    *
    * @method Phaser.Keyboard#addKeys
    * @param {object} keys - A key mapping object, i.e. `{ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S }` or `{ 'up': 52, 'down': 53 }`.
    * @return {object} An object containing the properties mapped to {@link Phaser.Key} values.
    */
    addKeys: function (keys) {

        var output = {};

        for (var key in keys)
        {
            output[key] = this.addKey(keys[key]);
        }

        return output;

    },

    /**
    * Removes a Key object from the Keyboard manager.
    *
    * @method Phaser.Keyboard#removeKey
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key to remove.
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
    * @return {object} An object containing properties: `up`, `down`, `left` and `right` of {@link Phaser.Key} objects.
    */
    createCursorKeys: function () {

        return this.addKeys({ 'up': Phaser.KeyCode.UP, 'down': Phaser.KeyCode.DOWN, 'left': Phaser.KeyCode.LEFT, 'right': Phaser.KeyCode.RIGHT });

    },

    /**
    * Starts the Keyboard event listeners running (keydown and keyup). They are attached to the window.
    * This is called automatically by Phaser.Input and should not normally be invoked directly.
    *
    * @method Phaser.Keyboard#start
    * @protected
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
    *
    * The `addKeyCapture` method enables consuming keyboard event for specific keys so it doesn't bubble up to the the browser
    * and cause the default browser behavior.
    *
    * Pass in either a single keycode or an array/hash of keycodes.
    *
    * @method Phaser.Keyboard#addKeyCapture
    * @param {integer|integer[]|object} keycode - Either a single {@link Phaser.KeyCode keycode} or an array/hash of keycodes such as `[65, 67, 68]`.
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
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} to remove capturing of.
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

        if (!this.game.input.enabled || !this.enabled)
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

        if (!this.game.input.enabled || !this.enabled)
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

        if (!this.game.input.enabled || !this.enabled)
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

        if (hard === undefined) { hard = true; }

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
    * Returns `true` if the Key was pressed down within the `duration` value given, or `false` if it either isn't down,
    * or was pressed down longer ago than then given duration.
    * 
    * @method Phaser.Keyboard#downDuration
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key to check: i.e. Phaser.KeyCode.UP or Phaser.KeyCode.SPACEBAR.
    * @param {number} [duration=50] - The duration within which the key is considered as being just pressed. Given in ms.
    * @return {boolean} True if the key was pressed down within the given duration, false if not or null if the Key wasn't found.
    */
    downDuration: function (keycode, duration) {

        if (this._keys[keycode])
        {
            return this._keys[keycode].downDuration(duration);
        }
        else
        {
            return null;
        }

    },

    /**
    * Returns `true` if the Key was pressed down within the `duration` value given, or `false` if it either isn't down,
    * or was pressed down longer ago than then given duration.
    * 
    * @method Phaser.Keyboard#upDuration
    * @param {Phaser.KeyCode|integer} keycode - The keycode of the key to check, i.e. Phaser.KeyCode.UP or Phaser.KeyCode.SPACEBAR.
    * @param {number} [duration=50] - The duration within which the key is considered as being just released. Given in ms.
    * @return {boolean} True if the key was released within the given duration, false if not or null if the Key wasn't found.
    */
    upDuration: function (keycode, duration) {

        if (this._keys[keycode])
        {
            return this._keys[keycode].upDuration(duration);
        }
        else
        {
            return null;
        }

    },

    /**
    * Returns true of the key is currently pressed down. Note that it can only detect key presses on the web browser.
    *
    * @method Phaser.Keyboard#isDown
    * @param {integer} keycode - The {@link Phaser.KeyCode keycode} of the key to check: i.e. Phaser.KeyCode.UP or Phaser.KeyCode.SPACEBAR.
    * @return {boolean} True if the key is currently down, false if not or null if the Key wasn't found.
    */
    isDown: function (keycode) {

        if (this._keys[keycode])
        {
            return this._keys[keycode].isDown;
        }
        else
        {
            return null;
        }

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

/**
* A key code represents a physical key on a keyboard.
*
* The KeyCode class contains commonly supported keyboard key codes which can be used
* as keycode`-parameters in several {@link Phaser.Keyboard} and {@link Phaser.Key} methods.
*
* _Note_: These values should only be used indirectly, eg. as `Phaser.KeyCode.KEY`.
* Future versions may replace the actual values, such that they remain compatible with `keycode`-parameters.
* The current implementation maps to the {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode KeyboardEvent.keyCode} property.
*
* _Note_: Use `Phaser.KeyCode.KEY` instead of `Phaser.Keyboard.KEY` to refer to a key code;
* the latter approach is supported for compatibility.
*
* @namespace
*/
Phaser.KeyCode = {
    /** @static */
    A: "A".charCodeAt(0),
    /** @static */
    B: "B".charCodeAt(0),
    /** @static */
    C: "C".charCodeAt(0),
    /** @static */
    D: "D".charCodeAt(0),
    /** @static */
    E: "E".charCodeAt(0),
    /** @static */
    F: "F".charCodeAt(0),
    /** @static */
    G: "G".charCodeAt(0),
    /** @static */
    H: "H".charCodeAt(0),
    /** @static */
    I: "I".charCodeAt(0),
    /** @static */
    J: "J".charCodeAt(0),
    /** @static */
    K: "K".charCodeAt(0),
    /** @static */
    L: "L".charCodeAt(0),
    /** @static */
    M: "M".charCodeAt(0),
    /** @static */
    N: "N".charCodeAt(0),
    /** @static */
    O: "O".charCodeAt(0),
    /** @static */
    P: "P".charCodeAt(0),
    /** @static */
    Q: "Q".charCodeAt(0),
    /** @static */
    R: "R".charCodeAt(0),
    /** @static */
    S: "S".charCodeAt(0),
    /** @static */
    T: "T".charCodeAt(0),
    /** @static */
    U: "U".charCodeAt(0),
    /** @static */
    V: "V".charCodeAt(0),
    /** @static */
    W: "W".charCodeAt(0),
    /** @static */
    X: "X".charCodeAt(0),
    /** @static */
    Y: "Y".charCodeAt(0),
    /** @static */
    Z: "Z".charCodeAt(0),
    /** @static */
    ZERO: "0".charCodeAt(0),
    /** @static */
    ONE: "1".charCodeAt(0),
    /** @static */
    TWO: "2".charCodeAt(0),
    /** @static */
    THREE: "3".charCodeAt(0),
    /** @static */
    FOUR: "4".charCodeAt(0),
    /** @static */
    FIVE: "5".charCodeAt(0),
    /** @static */
    SIX: "6".charCodeAt(0),
    /** @static */
    SEVEN: "7".charCodeAt(0),
    /** @static */
    EIGHT: "8".charCodeAt(0),
    /** @static */
    NINE: "9".charCodeAt(0),
    /** @static */
    NUMPAD_0: 96,
    /** @static */
    NUMPAD_1: 97,
    /** @static */
    NUMPAD_2: 98,
    /** @static */
    NUMPAD_3: 99,
    /** @static */
    NUMPAD_4: 100,
    /** @static */
    NUMPAD_5: 101,
    /** @static */
    NUMPAD_6: 102,
    /** @static */
    NUMPAD_7: 103,
    /** @static */
    NUMPAD_8: 104,
    /** @static */
    NUMPAD_9: 105,
    /** @static */
    NUMPAD_MULTIPLY: 106,
    /** @static */
    NUMPAD_ADD: 107,
    /** @static */
    NUMPAD_ENTER: 108,
    /** @static */
    NUMPAD_SUBTRACT: 109,
    /** @static */
    NUMPAD_DECIMAL: 110,
    /** @static */
    NUMPAD_DIVIDE: 111,
    /** @static */
    F1: 112,
    /** @static */
    F2: 113,
    /** @static */
    F3: 114,
    /** @static */
    F4: 115,
    /** @static */
    F5: 116,
    /** @static */
    F6: 117,
    /** @static */
    F7: 118,
    /** @static */
    F8: 119,
    /** @static */
    F9: 120,
    /** @static */
    F10: 121,
    /** @static */
    F11: 122,
    /** @static */
    F12: 123,
    /** @static */
    F13: 124,
    /** @static */
    F14: 125,
    /** @static */
    F15: 126,
    /** @static */
    COLON: 186,
    /** @static */
    EQUALS: 187,
    /** @static */
    COMMA: 188,
    /** @static */
    UNDERSCORE: 189,
    /** @static */
    PERIOD: 190,
    /** @static */
    QUESTION_MARK: 191,
    /** @static */
    TILDE: 192,
    /** @static */
    OPEN_BRACKET: 219,
    /** @static */
    BACKWARD_SLASH: 220,
    /** @static */
    CLOSED_BRACKET: 221,
    /** @static */
    QUOTES: 222,
    /** @static */
    BACKSPACE: 8,
    /** @static */
    TAB: 9,
    /** @static */
    CLEAR: 12,
    /** @static */
    ENTER: 13,
    /** @static */
    SHIFT: 16,
    /** @static */
    CONTROL: 17,
    /** @static */
    ALT: 18,
    /** @static */
    CAPS_LOCK: 20,
    /** @static */
    ESC: 27,
    /** @static */
    SPACEBAR: 32,
    /** @static */
    PAGE_UP: 33,
    /** @static */
    PAGE_DOWN: 34,
    /** @static */
    END: 35,
    /** @static */
    HOME: 36,
    /** @static */
    LEFT: 37,
    /** @static */
    UP: 38,
    /** @static */
    RIGHT: 39,
    /** @static */
    DOWN: 40,
    /** @static */
    PLUS: 43,
    /** @static */
    MINUS: 44,
    /** @static */
    INSERT: 45,
    /** @static */
    DELETE: 46,
    /** @static */
    HELP: 47,
    /** @static */
    NUM_LOCK: 144
};

// Duplicate Phaser.KeyCode values in Phaser.Keyboard for compatibility
for (var key in Phaser.KeyCode) {
    if (Phaser.KeyCode.hasOwnProperty(key) && !key.match(/[a-z]/)) {
        Phaser.Keyboard[key] = Phaser.KeyCode[key];
    }
}
