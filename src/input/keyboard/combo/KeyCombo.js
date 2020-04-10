/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Events = require('../events');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ProcessKeyCombo = require('./ProcessKeyCombo');
var ResetKeyCombo = require('./ResetKeyCombo');

/**
 * @classdesc
 * A KeyCombo will listen for a specific string of keys from the Keyboard, and when it receives them
 * it will emit a `keycombomatch` event from the Keyboard Manager.
 *
 * The keys to be listened for can be defined as:
 *
 * A string (i.e. 'ATARI')
 * An array of either integers (key codes) or strings, or a mixture of both
 * An array of objects (such as Key objects) with a public 'keyCode' property
 *
 * For example, to listen for the Konami code (up, up, down, down, left, right, left, right, b, a, enter)
 * you could pass the following array of key codes:
 *
 * ```javascript
 * this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13 ], { resetOnMatch: true });
 *
 * this.input.keyboard.on('keycombomatch', function (event) {
 *     console.log('Konami Code entered!');
 * });
 * ```
 *
 * Or, to listen for the user entering the word PHASER:
 *
 * ```javascript
 * this.input.keyboard.createCombo('PHASER');
 * ```
 *
 * @class KeyCombo
 * @memberof Phaser.Input.Keyboard
 * @constructor
 * @listens Phaser.Input.Keyboard.Events#ANY_KEY_DOWN
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.KeyboardPlugin} keyboardPlugin - A reference to the Keyboard Plugin.
 * @param {(string|integer[]|object[])} keys - The keys that comprise this combo.
 * @param {Phaser.Types.Input.Keyboard.KeyComboConfig} [config] - A Key Combo configuration object.
 */
var KeyCombo = new Class({

    initialize:

    function KeyCombo (keyboardPlugin, keys, config)
    {
        if (config === undefined) { config = {}; }

        //  Can't have a zero or single length combo (string or array based)
        if (keys.length < 2)
        {
            return false;
        }

        /**
         * A reference to the Keyboard Manager
         *
         * @name Phaser.Input.Keyboard.KeyCombo#manager
         * @type {Phaser.Input.Keyboard.KeyboardPlugin}
         * @since 3.0.0
         */
        this.manager = keyboardPlugin;

        /**
         * A flag that controls if this Key Combo is actively processing keys or not.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#enabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enabled = true;

        /**
         * An array of the keycodes that comprise this combo.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#keyCodes
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.keyCodes = [];

        //  if 'keys' is a string we need to get the keycode of each character in it

        for (var i = 0; i < keys.length; i++)
        {
            var char = keys[i];

            if (typeof char === 'string')
            {
                this.keyCodes.push(char.toUpperCase().charCodeAt(0));
            }
            else if (typeof char === 'number')
            {
                this.keyCodes.push(char);
            }
            else if (char.hasOwnProperty('keyCode'))
            {
                this.keyCodes.push(char.keyCode);
            }
        }

        /**
         * The current keyCode the combo is waiting for.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#current
         * @type {integer}
         * @since 3.0.0
         */
        this.current = this.keyCodes[0];

        /**
         * The current index of the key being waited for in the 'keys' string.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#index
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.index = 0;

        /**
         * The length of this combo (in keycodes)
         *
         * @name Phaser.Input.Keyboard.KeyCombo#size
         * @type {number}
         * @since 3.0.0
         */
        this.size = this.keyCodes.length;

        /**
         * The time the previous key in the combo was matched.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#timeLastMatched
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.timeLastMatched = 0;

        /**
         * Has this Key Combo been matched yet?
         *
         * @name Phaser.Input.Keyboard.KeyCombo#matched
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.matched = false;

        /**
         * The time the entire combo was matched.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#timeMatched
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.timeMatched = 0;

        /**
         * If they press the wrong key do we reset the combo?
         *
         * @name Phaser.Input.Keyboard.KeyCombo#resetOnWrongKey
         * @type {boolean}
         * @default 0
         * @since 3.0.0
         */
        this.resetOnWrongKey = GetFastValue(config, 'resetOnWrongKey', true);

        /**
         * The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#maxKeyDelay
         * @type {integer}
         * @default 0
         * @since 3.0.0
         */
        this.maxKeyDelay = GetFastValue(config, 'maxKeyDelay', 0);

        /**
         * If previously matched and they press the first key of the combo again, will it reset?
         *
         * @name Phaser.Input.Keyboard.KeyCombo#resetOnMatch
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.resetOnMatch = GetFastValue(config, 'resetOnMatch', false);

        /**
         * If the combo matches, will it delete itself?
         *
         * @name Phaser.Input.Keyboard.KeyCombo#deleteOnMatch
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.deleteOnMatch = GetFastValue(config, 'deleteOnMatch', false);

        var _this = this;

        var onKeyDownHandler = function (event)
        {
            if (_this.matched || !_this.enabled)
            {
                return;
            }

            var matched = ProcessKeyCombo(event, _this);

            if (matched)
            {
                _this.manager.emit(Events.COMBO_MATCH, _this, event);

                if (_this.resetOnMatch)
                {
                    ResetKeyCombo(_this);
                }
                else if (_this.deleteOnMatch)
                {
                    _this.destroy();
                }
            }
        };

        /**
         * The internal Key Down handler.
         *
         * @name Phaser.Input.Keyboard.KeyCombo#onKeyDown
         * @private
         * @type {KeyboardKeydownCallback}
         * @fires Phaser.Input.Keyboard.Events#COMBO_MATCH
         * @since 3.0.0
         */
        this.onKeyDown = onKeyDownHandler;

        this.manager.on(Events.ANY_KEY_DOWN, this.onKeyDown);
    },

    /**
     * How far complete is this combo? A value between 0 and 1.
     *
     * @name Phaser.Input.Keyboard.KeyCombo#progress
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    progress: {

        get: function ()
        {
            return this.index / this.size;
        }

    },

    /**
     * Destroys this Key Combo and all of its references.
     *
     * @method Phaser.Input.Keyboard.KeyCombo#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.enabled = false;
        this.keyCodes = [];

        this.manager.off(Events.ANY_KEY_DOWN, this.onKeyDown);

        this.manager = null;
    }

});

module.exports = KeyCombo;
