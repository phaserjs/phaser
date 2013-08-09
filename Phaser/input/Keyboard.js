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
        return Keyboard;
    })();
    Phaser.Keyboard = Keyboard;
})(Phaser || (Phaser = {}));
