/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayRemove = require('../../utils/array/Remove');
var Class = require('../../utils/Class');
var GameEvents = require('../../core/events');
var InputEvents = require('../events');
var KeyCodes = require('../../input/keyboard/keys/KeyCodes');
var NOOP = require('../../utils/NOOP');

/**
 * @classdesc
 * The Keyboard Manager is a helper class that belongs to the global Input Manager.
 *
 * Its role is to listen for native DOM Keyboard Events and then store them for further processing by the Keyboard Plugin.
 *
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically if keyboard
 * input has been enabled in the Game Config.
 *
 * @class KeyboardManager
 * @memberof Phaser.Input.Keyboard
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Input.InputManager} inputManager - A reference to the Input Manager.
 */
var KeyboardManager = new Class({

    initialize:

    function KeyboardManager (inputManager)
    {
        /**
         * A reference to the Input Manager.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.16.0
         */
        this.manager = inputManager;

        /**
         * An internal event queue.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#queue
         * @type {KeyboardEvent[]}
         * @private
         * @since 3.16.0
         */
        this.queue = [];

        /**
         * A flag that controls if the non-modified keys, matching those stored in the `captures` array,
         * have `preventDefault` called on them or not.
         *
         * A non-modified key is one that doesn't have a modifier key held down with it. The modifier keys are
         * shift, control, alt and the meta key (Command on a Mac, the Windows Key on Windows).
         * Therefore, if the user presses shift + r, it won't prevent this combination, because of the modifier.
         * However, if the user presses just the r key on its own, it will have its event prevented.
         *
         * If you wish to stop capturing the keys, for example switching out to a DOM based element, then
         * you can toggle this property at run-time.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#preventDefault
         * @type {boolean}
         * @since 3.16.0
         */
        this.preventDefault = true;

        /**
         * An array of Key Code values that will automatically have `preventDefault` called on them,
         * as long as the `KeyboardManager.preventDefault` boolean is set to `true`.
         *
         * By default the array is empty.
         *
         * The key must be non-modified when pressed in order to be captured.
         *
         * A non-modified key is one that doesn't have a modifier key held down with it. The modifier keys are
         * shift, control, alt and the meta key (Command on a Mac, the Windows Key on Windows).
         * Therefore, if the user presses shift + r, it won't prevent this combination, because of the modifier.
         * However, if the user presses just the r key on its own, it will have its event prevented.
         *
         * If you wish to stop capturing the keys, for example switching out to a DOM based element, then
         * you can toggle the `KeyboardManager.preventDefault` boolean at run-time.
         *
         * If you need more specific control, you can create Key objects and set the flag on each of those instead.
         *
         * This array can be populated via the Game Config by setting the `input.keyboard.capture` array, or you
         * can call the `addCapture` method. See also `removeCapture` and `clearCaptures`.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#captures
         * @type {number[]}
         * @since 3.16.0
         */
        this.captures = [];

        /**
         * A boolean that controls if the Keyboard Manager is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.16.0
         */
        this.enabled = false;

        /**
         * The Keyboard Event target, as defined in the Game Config.
         * Typically the window in which the game is rendering, but can be any interactive DOM element.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#target
         * @type {any}
         * @since 3.16.0
         */
        this.target;

        /**
         * The Key Down Event handler.
         * This function is sent the native DOM KeyEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#onKeyDown
         * @type {function}
         * @since 3.16.00
         */
        this.onKeyDown = NOOP;

        /**
         * The Key Up Event handler.
         * This function is sent the native DOM KeyEvent.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#onKeyUp
         * @type {function}
         * @since 3.16.00
         */
        this.onKeyUp = NOOP;

        inputManager.events.once(InputEvents.MANAGER_BOOT, this.boot, this);
    },

    /**
     * The Keyboard Manager boot process.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#boot
     * @private
     * @since 3.16.0
     */
    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputKeyboard;
        this.target = config.inputKeyboardEventTarget;

        this.addCapture(config.inputKeyboardCapture);

        if (!this.target && window)
        {
            this.target = window;
        }

        if (this.enabled && this.target)
        {
            this.startListeners();
        }

        this.manager.game.events.on(GameEvents.POST_STEP, this.postUpdate, this);
    },

    /**
     * Starts the Keyboard Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#startListeners
     * @since 3.16.0
     */
    startListeners: function ()
    {
        var _this = this;

        this.onKeyDown = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }

            _this.queue.push(event);

            _this.manager.events.emit(InputEvents.MANAGER_PROCESS);

            var modified = (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey);

            if (_this.preventDefault && !modified && _this.captures.indexOf(event.keyCode) > -1)
            {
                event.preventDefault();
            }
        };

        this.onKeyUp = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }

            _this.queue.push(event);

            _this.manager.events.emit(InputEvents.MANAGER_PROCESS);

            var modified = (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey);

            if (_this.preventDefault && !modified && _this.captures.indexOf(event.keyCode) > -1)
            {
                event.preventDefault();
            }
        };

        var target = this.target;

        if (target)
        {
            target.addEventListener('keydown', this.onKeyDown, false);
            target.addEventListener('keyup', this.onKeyUp, false);

            this.enabled = true;
        }
    },

    /**
     * Stops the Key Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#stopListeners
     * @since 3.16.0
     */
    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('keydown', this.onKeyDown, false);
        target.removeEventListener('keyup', this.onKeyUp, false);

        this.enabled = false;
    },

    /**
     * Clears the event queue.
     * Called automatically by the Input Manager.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#postUpdate
     * @private
     * @since 3.16.0
     */
    postUpdate: function ()
    {
        this.queue = [];
    },

    /**
     * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
     * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
     *
     * This `addCapture` method enables consuming keyboard event for specific keys so it doesn't bubble up to the the browser
     * and cause the default browser behavior.
     *
     * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to say prevent
     * the SPACE BAR from triggering a page scroll, then it will prevent it for any Scene in your game, not just the calling one.
     *
     * You can pass in a single key code value, or an array of key codes, or a string:
     *
     * ```javascript
     * this.input.keyboard.addCapture(62);
     * ```
     *
     * An array of key codes:
     *
     * ```javascript
     * this.input.keyboard.addCapture([ 62, 63, 64 ]);
     * ```
     *
     * Or a string:
     *
     * ```javascript
     * this.input.keyboard.addCapture('W,S,A,D');
     * ```
     *
     * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
     *
     * You can also provide an array mixing both strings and key code integers.
     *
     * If there are active captures after calling this method, the `preventDefault` property is set to `true`.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#addCapture
     * @since 3.16.0
     *
     * @param {(string|number|number[]|any[])} keycode - The Key Codes to enable capture for, preventing them reaching the browser.
     */
    addCapture: function (keycode)
    {
        if (typeof keycode === 'string')
        {
            keycode = keycode.split(',');
        }

        if (!Array.isArray(keycode))
        {
            keycode = [ keycode ];
        }

        var captures = this.captures;

        for (var i = 0; i < keycode.length; i++)
        {
            var code = keycode[i];

            if (typeof code === 'string')
            {
                code = KeyCodes[code.trim().toUpperCase()];
            }

            if (captures.indexOf(code) === -1)
            {
                captures.push(code);
            }
        }

        this.preventDefault = captures.length > 0;
    },

    /**
     * Removes an existing key capture.
     *
     * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to remove
     * the capture of a key, then it will remove it for any Scene in your game, not just the calling one.
     *
     * You can pass in a single key code value, or an array of key codes, or a string:
     *
     * ```javascript
     * this.input.keyboard.removeCapture(62);
     * ```
     *
     * An array of key codes:
     *
     * ```javascript
     * this.input.keyboard.removeCapture([ 62, 63, 64 ]);
     * ```
     *
     * Or a string:
     *
     * ```javascript
     * this.input.keyboard.removeCapture('W,S,A,D');
     * ```
     *
     * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
     *
     * You can also provide an array mixing both strings and key code integers.
     *
     * If there are no captures left after calling this method, the `preventDefault` property is set to `false`.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#removeCapture
     * @since 3.16.0
     *
     * @param {(string|number|number[]|any[])} keycode - The Key Codes to disable capture for, allowing them reaching the browser again.
     */
    removeCapture: function (keycode)
    {
        if (typeof keycode === 'string')
        {
            keycode = keycode.split(',');
        }

        if (!Array.isArray(keycode))
        {
            keycode = [ keycode ];
        }

        var captures = this.captures;

        for (var i = 0; i < keycode.length; i++)
        {
            var code = keycode[i];

            if (typeof code === 'string')
            {
                code = KeyCodes[code.toUpperCase()];
            }

            ArrayRemove(captures, code);
        }

        this.preventDefault = captures.length > 0;
    },

    /**
     * Removes all keyboard captures and sets the `preventDefault` property to `false`.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#clearCaptures
     * @since 3.16.0
     */
    clearCaptures: function ()
    {
        this.captures = [];

        this.preventDefault = false;
    },

    /**
     * Destroys this Keyboard Manager instance.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#destroy
     * @since 3.16.0
     */
    destroy: function ()
    {
        this.stopListeners();

        this.clearCaptures();

        this.queue = [];

        this.manager.game.events.off(GameEvents.POST_RENDER, this.postUpdate, this);

        this.target = null;
        this.enabled = false;
        this.manager = null;
    }

});

module.exports = KeyboardManager;
