/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Features = require('../../device/Features');
var NOOP = require('../../utils/Class');

/**
 * @classdesc
 * The Keyboard Manager is a helper class that belongs to the Input Manager.
 * 
 * Its role is to listen for native DOM Keyboard Events and then pass them onto the Input Manager for further processing.
 * 
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically.
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
         * If true the DOM keyboard events will have event.preventDefault applied to them, if false they will propagate fully.
         *
         * @name Phaser.Input.Keyboard.KeyboardManager#capture
         * @type {boolean}
         * @default true
         * @since 3.16.0
         */
        this.capture = true;

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
         * Typically the canvas to which the game is rendering, but can be any interactive DOM element.
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

        inputManager.events.once('boot', this.boot, this);
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

        // this.enabled = config.inputMouse;
        // this.target = config.inputMouseEventTarget;
        // this.capture = config.inputMouseCapture;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }

        if (this.enabled && this.target)
        {
            this.startListeners();
        }
    },

    /**
     * Starts the Mouse Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#startListeners
     * @since 3.16.0
     */
    startListeners: function ()
    {
        var _this = this;
        var canvas = this.manager.canvas;

        this.onMouseDown = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.manager.queueMouseDown(event);
    
            if (_this.capture && event.target === canvas)
            {
                event.preventDefault();
            }
        };

        this.onMouseUp = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                // Do nothing if event already handled
                return;
            }
    
            _this.manager.queueMouseUp(event);
    
            if (_this.capture && event.target === canvas)
            {
                event.preventDefault();
            }
        };

        var target = this.target;

        if (!target)
        {
            return;
        }

        var passive = { passive: true };
        var nonPassive = { passive: false };

        target.addEventListener('mousedown', this.onMouseDown, (this.capture) ? nonPassive : passive);
        target.addEventListener('mouseup', this.onMouseUp, (this.capture) ? nonPassive : passive);

        if (window)
        {
            window.addEventListener('mousedown', this.onMouseDown, nonPassive);
            window.addEventListener('mouseup', this.onMouseUp, nonPassive);
        }

        this.enabled = true;
    },

    /**
     * Stops the Mouse Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#stopListeners
     * @since 3.16.0
     */
    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('mousedown', this.onMouseDown);
        target.removeEventListener('mouseup', this.onMouseUp);

        if (window)
        {
            window.removeEventListener('mousedown', this.onMouseDown);
            window.removeEventListener('mouseup', this.onMouseUp);
        }
    },

    /**
     * Destroys this Mouse Manager instance.
     *
     * @method Phaser.Input.Keyboard.KeyboardManager#destroy
     * @since 3.16.0
     */
    destroy: function ()
    {
        this.stopListeners();

        this.target = null;
        this.enabled = false;
        this.manager = null;
    }

});

module.exports = KeyboardManager;
