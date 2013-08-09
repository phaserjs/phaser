/// <reference path="../_definitions.ts" />
/**
* Phaser - Keyboard
*
* The Keyboard class handles keyboard interactions with the game and the resulting events.
* The avoid stealing all browser input we don't use event.preventDefault. If you would like to trap a specific key however
* then use the addKeyCapture() method.
*/
var Phaser;
(function (Phaser) {
    var Keyboard = (function () {
        function Keyboard(game) {
            this._keys = {};
            this._capture = {};
            /**
            * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
            * @type {Boolean}
            */
            this.disabled = false;
            this.game = game;
        }
        Keyboard.prototype.start = function () {
            var _this = this;
            this._onKeyDown = function (event) {
                return _this.onKeyDown(event);
            };
            this._onKeyUp = function (event) {
                return _this.onKeyUp(event);
            };

            document.body.addEventListener('keydown', this._onKeyDown, false);
            document.body.addEventListener('keyup', this._onKeyUp, false);
        };

        Keyboard.prototype.stop = function () {
            document.body.removeEventListener('keydown', this._onKeyDown);
            document.body.removeEventListener('keyup', this._onKeyUp);
        };

        /**
        * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
        * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
        * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
        * Pass in either a single keycode or an array of keycodes.
        * @param {Any} keycode
        */
        Keyboard.prototype.addKeyCapture = function (keycode) {
            if (typeof keycode === 'object') {
                for (var i = 0; i < keycode.length; i++) {
                    this._capture[keycode[i]] = true;
                }
            } else {
                this._capture[keycode] = true;
            }
        };

        /**
        * @param {Number} keycode
        */
        Keyboard.prototype.removeKeyCapture = function (keycode) {
            delete this._capture[keycode];
        };

        Keyboard.prototype.clearCaptures = function () {
            this._capture = {};
        };

        /**
        * @param {KeyboardEvent} event
        */
        Keyboard.prototype.onKeyDown = function (event) {
            if (this.game.input.disabled || this.disabled) {
                return;
            }

            if (this._capture[event.keyCode]) {
                event.preventDefault();
            }

            if (!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = { isDown: true, timeDown: this.game.time.now, timeUp: 0 };
            } else {
                this._keys[event.keyCode].isDown = true;
                this._keys[event.keyCode].timeDown = this.game.time.now;
            }
        };

        /**
        * @param {KeyboardEvent} event
        */
        Keyboard.prototype.onKeyUp = function (event) {
            if (this.game.input.disabled || this.disabled) {
                return;
            }

            if (this._capture[event.keyCode]) {
                event.preventDefault();
            }

            if (!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = { isDown: false, timeDown: 0, timeUp: this.game.time.now };
            } else {
                this._keys[event.keyCode].isDown = false;
                this._keys[event.keyCode].timeUp = this.game.time.now;
            }
        };

        Keyboard.prototype.reset = function () {
            for (var key in this._keys) {
                this._keys[key].isDown = false;
            }
        };

        /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        Keyboard.prototype.justPressed = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if (this._keys[keycode] && this._keys[keycode].isDown === true && (this.game.time.now - this._keys[keycode].timeDown < duration)) {
                return true;
            } else {
                return false;
            }
        };

        /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        Keyboard.prototype.justReleased = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if (this._keys[keycode] && this._keys[keycode].isDown === false && (this.game.time.now - this._keys[keycode].timeUp < duration)) {
                return true;
            } else {
                return false;
            }
        };

        /**
        * @param {Number} keycode
        * @return {Boolean}
        */
        Keyboard.prototype.isDown = function (keycode) {
            if (this._keys[keycode]) {
                return this._keys[keycode].isDown;
            } else {
                return false;
            }
        };

        Keyboard.A = "A".charCodeAt(0);
        Keyboard.B = "B".charCodeAt(0);
        Keyboard.C = "C".charCodeAt(0);
        Keyboard.D = "D".charCodeAt(0);
        Keyboard.E = "E".charCodeAt(0);
        Keyboard.F = "F".charCodeAt(0);
        Keyboard.G = "G".charCodeAt(0);
        Keyboard.H = "H".charCodeAt(0);
        Keyboard.I = "I".charCodeAt(0);
        Keyboard.J = "J".charCodeAt(0);
        Keyboard.K = "K".charCodeAt(0);
        Keyboard.L = "L".charCodeAt(0);
        Keyboard.M = "M".charCodeAt(0);
        Keyboard.N = "N".charCodeAt(0);
        Keyboard.O = "O".charCodeAt(0);
        Keyboard.P = "P".charCodeAt(0);
        Keyboard.Q = "Q".charCodeAt(0);
        Keyboard.R = "R".charCodeAt(0);
        Keyboard.S = "S".charCodeAt(0);
        Keyboard.T = "T".charCodeAt(0);
        Keyboard.U = "U".charCodeAt(0);
        Keyboard.V = "V".charCodeAt(0);
        Keyboard.W = "W".charCodeAt(0);
        Keyboard.X = "X".charCodeAt(0);
        Keyboard.Y = "Y".charCodeAt(0);
        Keyboard.Z = "Z".charCodeAt(0);

        Keyboard.ZERO = "0".charCodeAt(0);
        Keyboard.ONE = "1".charCodeAt(0);
        Keyboard.TWO = "2".charCodeAt(0);
        Keyboard.THREE = "3".charCodeAt(0);
        Keyboard.FOUR = "4".charCodeAt(0);
        Keyboard.FIVE = "5".charCodeAt(0);
        Keyboard.SIX = "6".charCodeAt(0);
        Keyboard.SEVEN = "7".charCodeAt(0);
        Keyboard.EIGHT = "8".charCodeAt(0);
        Keyboard.NINE = "9".charCodeAt(0);

        Keyboard.NUMPAD_0 = 96;
        Keyboard.NUMPAD_1 = 97;
        Keyboard.NUMPAD_2 = 98;
        Keyboard.NUMPAD_3 = 99;
        Keyboard.NUMPAD_4 = 100;
        Keyboard.NUMPAD_5 = 101;
        Keyboard.NUMPAD_6 = 102;
        Keyboard.NUMPAD_7 = 103;
        Keyboard.NUMPAD_8 = 104;
        Keyboard.NUMPAD_9 = 105;
        Keyboard.NUMPAD_MULTIPLY = 106;
        Keyboard.NUMPAD_ADD = 107;
        Keyboard.NUMPAD_ENTER = 108;
        Keyboard.NUMPAD_SUBTRACT = 109;
        Keyboard.NUMPAD_DECIMAL = 110;
        Keyboard.NUMPAD_DIVIDE = 111;

        Keyboard.F1 = 112;
        Keyboard.F2 = 113;
        Keyboard.F3 = 114;
        Keyboard.F4 = 115;
        Keyboard.F5 = 116;
        Keyboard.F6 = 117;
        Keyboard.F7 = 118;
        Keyboard.F8 = 119;
        Keyboard.F9 = 120;
        Keyboard.F10 = 121;
        Keyboard.F11 = 122;
        Keyboard.F12 = 123;
        Keyboard.F13 = 124;
        Keyboard.F14 = 125;
        Keyboard.F15 = 126;

        Keyboard.COLON = 186;
        Keyboard.EQUALS = 187;
        Keyboard.UNDERSCORE = 189;
        Keyboard.QUESTION_MARK = 191;
        Keyboard.TILDE = 192;
        Keyboard.OPEN_BRACKET = 219;
        Keyboard.BACKWARD_SLASH = 220;
        Keyboard.CLOSED_BRACKET = 221;
        Keyboard.QUOTES = 222;

        Keyboard.BACKSPACE = 8;
        Keyboard.TAB = 9;
        Keyboard.CLEAR = 12;
        Keyboard.ENTER = 13;
        Keyboard.SHIFT = 16;
        Keyboard.CONTROL = 17;
        Keyboard.ALT = 18;
        Keyboard.CAPS_LOCK = 20;
        Keyboard.ESC = 27;
        Keyboard.SPACEBAR = 32;
        Keyboard.PAGE_UP = 33;
        Keyboard.PAGE_DOWN = 34;
        Keyboard.END = 35;
        Keyboard.HOME = 36;
        Keyboard.LEFT = 37;
        Keyboard.UP = 38;
        Keyboard.RIGHT = 39;
        Keyboard.DOWN = 40;
        Keyboard.INSERT = 45;
        Keyboard.DELETE = 46;
        Keyboard.HELP = 47;
        Keyboard.NUM_LOCK = 144;
        return Keyboard;
    })();
    Phaser.Keyboard = Keyboard;
})(Phaser || (Phaser = {}));
