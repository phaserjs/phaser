/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Keyboard
*/


/**
* Phaser - Keyboard constructor.
*
* @class Phaser.Keyboard
* @classdesc A Keyboard object Description.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Keyboard = function (game) {

	/**
	* @property {Phaser.Game} game - Local reference to game.
	*/
	this.game = game;
	
	/**
	* @property {Description} _keys - Description.
	* @private
	*/
    this._keys = {};
    
    /**
    * @property {Description} _hotkeys - Description.
    * @private
    */
    this._hotkeys = {};

	/**
	* @property {Description} _capture - Description.
	* @private
	*/
    this._capture = {};

    this.callbackContext = this;
    this.onDownCallback = null;
    this.onUpCallback = null;

    this.onDown = new Phaser.Signal();
    this.onUp = new Phaser.Signal();
	
};

Phaser.Keyboard.prototype = {

	/**
    * @property {Phaser.Game} game - Local reference to game.
	*/
	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @default
    * @property {bool} disabled
    */
	disabled: false,

	/**
	* Description.
	* @property {Description} _onKeyDown
	* @private
	* @default
	*/
	_onKeyDown: null,
	
	/**
	* Description.
	* @property {Description} _onKeyUp
	* @private
	* @default
	*/
	_onKeyUp: null,

    addCallbacks: function (context, onDown, onUp) {

        this.callbackContext = context;
        this.onDownCallback = onDown;

        if (typeof onUp !== 'undefined')
        {
            this.onUpCallback = onUp;
        }

    },

    addKey: function (keycode) {

        this._hotkeys[keycode] = new Phaser.Key(this.game, keycode);
        return this._hotkeys[keycode];

    },

    removeKey: function (keycode) {

        delete (this._hotkeys[keycode]);

    },

	/**
	* Description.
	* @method start
	*/
    start: function () {

        var _this = this;

        this._onKeyDown = function (event) {
            return _this.processKeyDown(event);
        };

        this._onKeyUp = function (event) {
            return _this.processKeyUp(event);
        };

        document.body.addEventListener('keydown', this._onKeyDown, false);
        document.body.addEventListener('keyup', this._onKeyUp, false);

    },

	/**
	* Description.
	* @method stop
	*/
    stop: function () {

        document.body.removeEventListener('keydown', this._onKeyDown);
        document.body.removeEventListener('keyup', this._onKeyUp);

    },

	/**
    * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
    * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
    * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
    * Pass in either a single keycode or an array/hash of keycodes.
    * @method addKeyCapture
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
	* Description.
	* @method removeKeyCapture
    * @param {number} keycode
    */
    removeKeyCapture: function (keycode) {

        delete this._capture[keycode];

    },

	/**
	* Description.
	* @method clearCaptures
    */
    clearCaptures: function () {

        this._capture = {};

    },

	/**
	* Description.
	* @method processKeyDown
    * @param {KeyboardEvent} event
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
	* Description.
	* @method processKeyUp
    * @param {KeyboardEvent} event
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

        this._keys[event.keyCode].isDown = false;
        this._keys[event.keyCode].timeUp = this.game.time.now;

    },

	/**
	* Description.
	* @method reset
    */
    reset: function () {

        for (var key in this._keys)
        {
            this._keys[key].isDown = false;
        }

    },

	/**
	* Description.
	* @method justPressed
    * @param {number} keycode
    * @param {number} [duration]
    * @return {bool}
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
	* Description.
	* @method justReleased
    * @param {number} keycode
    * @param {number} [duration]
    * @return {bool}
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
	* Description.
	* @method isDown
    * @param {number} keycode
    * @return {bool}
    */
    isDown: function (keycode) {

        if (this._keys[keycode])
        {
            return this._keys[keycode].isDown;
        }

		return false;

    }

};

//	Statics

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
