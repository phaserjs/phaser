/// <reference path="../../Game.ts" />

/**
* Phaser - Keyboard
*
* The Keyboard class handles keyboard interactions with the game and the resulting events.
* The avoid stealing all browser input we don't use event.preventDefault. If you would like to trap a specific key however
* then use the addKeyCapture() method.
*/

module Phaser {

    export class Keyboard {

        constructor(game: Game) {

            this._game = game;

        }

        private _game: Game;
        private _keys = {};
        private _capture = {};

        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool = false;

        public start() {

            document.body.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event), false);
            document.body.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp(event), false);

        }

        /**
         * @param {Any} keycode
         */
        public addKeyCapture(keycode) {

            if (typeof keycode === 'object')
            {
                for (var i:number = 0; i < keycode.length; i++)
                {
                    this._capture[keycode[i]] = true;
                }
            }
            else
            {
                this._capture[keycode] = true;
            }

        }

        /**
         * @param {Number} keycode
         */
        public removeKeyCapture(keycode: number) {

            delete this._capture[keycode];

        }

        public clearCaptures() {

            this._capture = {};

        }

        /**
         * @param {KeyboardEvent} event
         */
        public onKeyDown(event: KeyboardEvent) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            if (this._capture[event.keyCode])
            {
                event.preventDefault();
            }

            if (!this._keys[event.keyCode])
            {
                this._keys[event.keyCode] = { isDown: true, timeDown: this._game.time.now, timeUp: 0 };
            }
            else
            {
                this._keys[event.keyCode].isDown = true;
                this._keys[event.keyCode].timeDown = this._game.time.now;
            }

        }

        /**
         * @param {KeyboardEvent} event
         */
        public onKeyUp(event: KeyboardEvent) {

            if (this._game.input.disabled || this.disabled)
            {
                return;
            }

            if (this._capture[event.keyCode])
            {
                event.preventDefault();
            }

            if (!this._keys[event.keyCode])
            {
                this._keys[event.keyCode] = { isDown: false, timeDown: 0, timeUp: this._game.time.now };
            }
            else
            {
                this._keys[event.keyCode].isDown = false;
                this._keys[event.keyCode].timeUp = this._game.time.now;
            }

        }

        public reset() {

            for (var key in this._keys)
            {
                this._keys[key].isDown = false;
            }

        }

        /**
         * @param {Number} keycode
         * @param {Number} [duration]
         * @return {Boolean}
         */
        public justPressed(keycode: number, duration?: number = 250): bool {

            if (this._keys[keycode] && this._keys[keycode].isDown === true && (this._game.time.now - this._keys[keycode].timeDown < duration))
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * @param {Number} keycode
         * @param {Number} [duration]
         * @return {Boolean}
         */
        public justReleased(keycode: number, duration?: number = 250): bool {

            if (this._keys[keycode] && this._keys[keycode].isDown === false && (this._game.time.now - this._keys[keycode].timeUp < duration))
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * @param {Number} keycode
         * @return {Boolean}
         */
        public isDown(keycode: number): bool {

            if (this._keys[keycode])
            {
                return this._keys[keycode].isDown;
            }
            else
            {
                return false;
            }

        }

        // Letters
        public static A: number = "A".charCodeAt(0);
        public static B: number = "B".charCodeAt(0);
        public static C: number = "C".charCodeAt(0);
        public static D: number = "D".charCodeAt(0);
        public static E: number = "E".charCodeAt(0);
        public static F: number = "F".charCodeAt(0);
        public static G: number = "G".charCodeAt(0);
        public static H: number = "H".charCodeAt(0);
        public static I: number = "I".charCodeAt(0);
        public static J: number = "J".charCodeAt(0);
        public static K: number = "K".charCodeAt(0);
        public static L: number = "L".charCodeAt(0);
        public static M: number = "M".charCodeAt(0);
        public static N: number = "N".charCodeAt(0);
        public static O: number = "O".charCodeAt(0);
        public static P: number = "P".charCodeAt(0);
        public static Q: number = "Q".charCodeAt(0);
        public static R: number = "R".charCodeAt(0);
        public static S: number = "S".charCodeAt(0);
        public static T: number = "T".charCodeAt(0);
        public static U: number = "U".charCodeAt(0);
        public static V: number = "V".charCodeAt(0);
        public static W: number = "W".charCodeAt(0);
        public static X: number = "X".charCodeAt(0);
        public static Y: number = "Y".charCodeAt(0);
        public static Z: number = "Z".charCodeAt(0);

        // Numbers
        public static ZERO: number = "0".charCodeAt(0);
        public static ONE: number = "1".charCodeAt(0);
        public static TWO: number = "2".charCodeAt(0);
        public static THREE: number = "3".charCodeAt(0);
        public static FOUR: number = "4".charCodeAt(0);
        public static FIVE: number = "5".charCodeAt(0);
        public static SIX: number = "6".charCodeAt(0);
        public static SEVEN: number = "7".charCodeAt(0);
        public static EIGHT: number = "8".charCodeAt(0);
        public static NINE: number = "9".charCodeAt(0);

        // Numpad
        public static NUMPAD_0: number = 96;
        public static NUMPAD_1: number = 97;
        public static NUMPAD_2: number = 98;
        public static NUMPAD_3: number = 99;
        public static NUMPAD_4: number = 100;
        public static NUMPAD_5: number = 101;
        public static NUMPAD_6: number = 102;
        public static NUMPAD_7: number = 103;
        public static NUMPAD_8: number = 104;
        public static NUMPAD_9: number = 105;
        public static NUMPAD_MULTIPLY: number = 106;
        public static NUMPAD_ADD: number = 107;
        public static NUMPAD_ENTER: number = 108;
        public static NUMPAD_SUBTRACT: number = 109;
        public static NUMPAD_DECIMAL: number = 110;
        public static NUMPAD_DIVIDE: number = 111;

        // Function Keys
        public static F1: number = 112;
        public static F2: number = 113;
        public static F3: number = 114;
        public static F4: number = 115;
        public static F5: number = 116;
        public static F6: number = 117;
        public static F7: number = 118;
        public static F8: number = 119;
        public static F9: number = 120;
        public static F10: number = 121;
        public static F11: number = 122;
        public static F12: number = 123;
        public static F13: number = 124;
        public static F14: number = 125;
        public static F15: number = 126;

        // Symbol Keys
        public static COLON: number = 186;
        public static EQUALS: number = 187;
        public static UNDERSCORE: number = 189;
        public static QUESTION_MARK: number = 191;
        public static TILDE: number = 192;
        public static OPEN_BRACKET: number = 219;
        public static BACKWARD_SLASH: number = 220;
        public static CLOSED_BRACKET: number = 221;
        public static QUOTES: number = 222;

        // Other Keys
        public static BACKSPACE: number = 8;
        public static TAB: number = 9;
        public static CLEAR: number = 12;
        public static ENTER: number = 13;
        public static SHIFT: number = 16;
        public static CONTROL: number = 17;
        public static ALT: number = 18;
        public static CAPS_LOCK: number = 20;
        public static ESC: number = 27;
        public static SPACEBAR: number = 32;
        public static PAGE_UP: number = 33;
        public static PAGE_DOWN: number = 34;
        public static END: number = 35;
        public static HOME: number = 36;
        public static LEFT: number = 37;
        public static UP: number = 38;
        public static RIGHT: number = 39;
        public static DOWN: number = 40;
        public static INSERT: number = 45;
        public static DELETE: number = 46;
        public static HELP: number = 47;
        public static NUM_LOCK: number = 144;

    }

}