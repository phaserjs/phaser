Phaser.Input.Keyboard = function (game) {

	this.game = game;
    this._keys = {};
    this._capture = {};
	
};

Phaser.Input.Keyboard.prototype = {

	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @type {bool}
    */
	disabled: false,

	_onKeyDown: null,
	_onKeyUp: null,

    start: function () {

        var _this = this;

        this._onKeyDown = function (event) {
            return _this.onKeyDown(event);
        };

        this._onKeyUp = function (event) {
            return _this.onKeyUp(event);
        };

        document.body.addEventListener('keydown', this._onKeyDown, false);
        document.body.addEventListener('keyup', this._onKeyUp, false);

    },

    stop: function () {

        document.body.removeEventListener('keydown', this._onKeyDown);
        document.body.removeEventListener('keyup', this._onKeyUp);

    },

	/**
    * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
    * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
    * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
    * Pass in either a single keycode or an array/hash of keycodes.
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
    * @param {Number} keycode
    */
    removeKeyCapture: function (keycode) {

        delete this._capture[keycode];

    },

    clearCaptures: function () {

        this._capture = {};

    },

	/**
    * @param {KeyboardEvent} event
    */    
    onKeyDown: function (event) {

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
            this._keys[event.keyCode] = {
                isDown: true,
                timeDown: this.game.time.now,
                timeUp: 0
            };
        }
        else
        {
            this._keys[event.keyCode].isDown = true;
            this._keys[event.keyCode].timeDown = this.game.time.now;
        }

    },

	/**
    * @param {KeyboardEvent} event
    */
    onKeyUp: function (event) {

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
            this._keys[event.keyCode] = {
                isDown: false,
                timeDown: 0,
                timeUp: this.game.time.now
            };
        }
        else
        {
            this._keys[event.keyCode].isDown = false;
            this._keys[event.keyCode].timeUp = this.game.time.now;
        }

    },

    reset: function () {

        for (var key in this._keys)
        {
            this._keys[key].isDown = false;
        }

    },

	/**
    * @param {Number} keycode
    * @param {Number} [duration]
    * @return {bool}
    */
    justPressed: function (keycode, duration) {

        if (typeof duration === "undefined") { duration = 250; }

        if (this._keys[keycode] && this._keys[keycode].isDown === true && (this.game.time.now - this._keys[keycode].timeDown < duration))
        {
            return true;
        }

        return false;

    },

	/**
    * @param {Number} keycode
    * @param {Number} [duration]
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
    * @param {Number} keycode
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

Phaser.Input.Keyboard.A = "A".charCodeAt(0);
Phaser.Input.Keyboard.B = "B".charCodeAt(0);
Phaser.Input.Keyboard.C = "C".charCodeAt(0);
Phaser.Input.Keyboard.D = "D".charCodeAt(0);
Phaser.Input.Keyboard.E = "E".charCodeAt(0);
Phaser.Input.Keyboard.F = "F".charCodeAt(0);
Phaser.Input.Keyboard.G = "G".charCodeAt(0);
Phaser.Input.Keyboard.H = "H".charCodeAt(0);
Phaser.Input.Keyboard.I = "I".charCodeAt(0);
Phaser.Input.Keyboard.J = "J".charCodeAt(0);
Phaser.Input.Keyboard.K = "K".charCodeAt(0);
Phaser.Input.Keyboard.L = "L".charCodeAt(0);
Phaser.Input.Keyboard.M = "M".charCodeAt(0);
Phaser.Input.Keyboard.N = "N".charCodeAt(0);
Phaser.Input.Keyboard.O = "O".charCodeAt(0);
Phaser.Input.Keyboard.P = "P".charCodeAt(0);
Phaser.Input.Keyboard.Q = "Q".charCodeAt(0);
Phaser.Input.Keyboard.R = "R".charCodeAt(0);
Phaser.Input.Keyboard.S = "S".charCodeAt(0);
Phaser.Input.Keyboard.T = "T".charCodeAt(0);
Phaser.Input.Keyboard.U = "U".charCodeAt(0);
Phaser.Input.Keyboard.V = "V".charCodeAt(0);
Phaser.Input.Keyboard.W = "W".charCodeAt(0);
Phaser.Input.Keyboard.X = "X".charCodeAt(0);
Phaser.Input.Keyboard.Y = "Y".charCodeAt(0);
Phaser.Input.Keyboard.Z = "Z".charCodeAt(0);
Phaser.Input.Keyboard.ZERO = "0".charCodeAt(0);
Phaser.Input.Keyboard.ONE = "1".charCodeAt(0);
Phaser.Input.Keyboard.TWO = "2".charCodeAt(0);
Phaser.Input.Keyboard.THREE = "3".charCodeAt(0);
Phaser.Input.Keyboard.FOUR = "4".charCodeAt(0);
Phaser.Input.Keyboard.FIVE = "5".charCodeAt(0);
Phaser.Input.Keyboard.SIX = "6".charCodeAt(0);
Phaser.Input.Keyboard.SEVEN = "7".charCodeAt(0);
Phaser.Input.Keyboard.EIGHT = "8".charCodeAt(0);
Phaser.Input.Keyboard.NINE = "9".charCodeAt(0);
Phaser.Input.Keyboard.NUMPAD_0 = 96;
Phaser.Input.Keyboard.NUMPAD_1 = 97;
Phaser.Input.Keyboard.NUMPAD_2 = 98;
Phaser.Input.Keyboard.NUMPAD_3 = 99;
Phaser.Input.Keyboard.NUMPAD_4 = 100;
Phaser.Input.Keyboard.NUMPAD_5 = 101;
Phaser.Input.Keyboard.NUMPAD_6 = 102;
Phaser.Input.Keyboard.NUMPAD_7 = 103;
Phaser.Input.Keyboard.NUMPAD_8 = 104;
Phaser.Input.Keyboard.NUMPAD_9 = 105;
Phaser.Input.Keyboard.NUMPAD_MULTIPLY = 106;
Phaser.Input.Keyboard.NUMPAD_ADD = 107;
Phaser.Input.Keyboard.NUMPAD_ENTER = 108;
Phaser.Input.Keyboard.NUMPAD_SUBTRACT = 109;
Phaser.Input.Keyboard.NUMPAD_DECIMAL = 110;
Phaser.Input.Keyboard.NUMPAD_DIVIDE = 111;
Phaser.Input.Keyboard.F1 = 112;
Phaser.Input.Keyboard.F2 = 113;
Phaser.Input.Keyboard.F3 = 114;
Phaser.Input.Keyboard.F4 = 115;
Phaser.Input.Keyboard.F5 = 116;
Phaser.Input.Keyboard.F6 = 117;
Phaser.Input.Keyboard.F7 = 118;
Phaser.Input.Keyboard.F8 = 119;
Phaser.Input.Keyboard.F9 = 120;
Phaser.Input.Keyboard.F10 = 121;
Phaser.Input.Keyboard.F11 = 122;
Phaser.Input.Keyboard.F12 = 123;
Phaser.Input.Keyboard.F13 = 124;
Phaser.Input.Keyboard.F14 = 125;
Phaser.Input.Keyboard.F15 = 126;
Phaser.Input.Keyboard.COLON = 186;
Phaser.Input.Keyboard.EQUALS = 187;
Phaser.Input.Keyboard.UNDERSCORE = 189;
Phaser.Input.Keyboard.QUESTION_MARK = 191;
Phaser.Input.Keyboard.TILDE = 192;
Phaser.Input.Keyboard.OPEN_BRACKET = 219;
Phaser.Input.Keyboard.BACKWARD_SLASH = 220;
Phaser.Input.Keyboard.CLOSED_BRACKET = 221;
Phaser.Input.Keyboard.QUOTES = 222;
Phaser.Input.Keyboard.BACKSPACE = 8;
Phaser.Input.Keyboard.TAB = 9;
Phaser.Input.Keyboard.CLEAR = 12;
Phaser.Input.Keyboard.ENTER = 13;
Phaser.Input.Keyboard.SHIFT = 16;
Phaser.Input.Keyboard.CONTROL = 17;
Phaser.Input.Keyboard.ALT = 18;
Phaser.Input.Keyboard.CAPS_LOCK = 20;
Phaser.Input.Keyboard.ESC = 27;
Phaser.Input.Keyboard.SPACEBAR = 32;
Phaser.Input.Keyboard.PAGE_UP = 33;
Phaser.Input.Keyboard.PAGE_DOWN = 34;
Phaser.Input.Keyboard.END = 35;
Phaser.Input.Keyboard.HOME = 36;
Phaser.Input.Keyboard.LEFT = 37;
Phaser.Input.Keyboard.UP = 38;
Phaser.Input.Keyboard.RIGHT = 39;
Phaser.Input.Keyboard.DOWN = 40;
Phaser.Input.Keyboard.INSERT = 45;
Phaser.Input.Keyboard.DELETE = 46;
Phaser.Input.Keyboard.HELP = 47;
Phaser.Input.Keyboard.NUM_LOCK = 144;
