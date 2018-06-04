/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// https://patrickhlauke.github.io/touch/tests/results/
// https://www.html5rocks.com/en/mobile/touch/

/**
 * @classdesc
 * The Touch Manager is a helper class that belongs to the Input Manager.
 * 
 * Its role is to listen for native DOM Touch Events and then pass them onto the Input Manager for further processing.
 * 
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically.
 *
 * @class TouchManager
 * @memberOf Phaser.Input.Touch
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - A reference to the Input Manager.
 */
var TouchManager = new Class({

    initialize:

    function TouchManager (inputManager)
    {
        /**
         * A reference to the Input Manager.
         *
         * @name Phaser.Input.Touch.TouchManager#manager
         * @type {Phaser.Input.InputManager}
         * @since 3.0.0
         */
        this.manager = inputManager;

        /**
         * If true the DOM events will have event.preventDefault applied to them, if false they will propagate fully.
         *
         * @name Phaser.Input.Touch.TouchManager#capture
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.capture = true;

        /**
         * A boolean that controls if the Touch Manager is enabled or not.
         * Can be toggled on the fly.
         *
         * @name Phaser.Input.Touch.TouchManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * The Touch Event target, as defined in the Game Config.
         * Typically the canvas to which the game is rendering, but can be any interactive DOM element.
         *
         * @name Phaser.Input.Touch.TouchManager#target
         * @type {any}
         * @since 3.0.0
         */
        this.target;

        inputManager.events.once('boot', this.boot, this);
    },

    /**
     * The Touch Manager boot process.
     *
     * @method Phaser.Input.Touch.TouchManager#boot
     * @private
     * @since 3.0.0
     */
    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputTouch;
        this.target = config.inputTouchEventTarget;
        this.capture = config.inputTouchCapture;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    /**
     * The Touch Start Event Handler.
     *
     * @method Phaser.Input.Touch.TouchManager#onTouchStart
     * @since 3.10.0
     *
     * @param {TouchEvent} event - The native DOM Touch Start Event.
     */
    onTouchStart: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.manager.queueTouchStart(event);

        if (this.capture)
        {
            event.preventDefault();
        }
    },

    /**
     * The Touch Move Event Handler.
     *
     * @method Phaser.Input.Touch.TouchManager#onTouchMove
     * @since 3.10.0
     *
     * @param {TouchEvent} event - The native DOM Touch Move Event.
     */
    onTouchMove: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.manager.queueTouchMove(event);

        if (this.capture)
        {
            event.preventDefault();
        }
    },

    /**
     * The Touch End Event Handler.
     *
     * @method Phaser.Input.Touch.TouchManager#onTouchEnd
     * @since 3.10.0
     *
     * @param {TouchEvent} event - The native DOM Touch End Event.
     */
    onTouchEnd: function (event)
    {
        if (event.defaultPrevented || !this.enabled)
        {
            // Do nothing if event already handled
            return;
        }

        this.manager.queueTouchEnd(event);

        if (this.capture)
        {
            event.preventDefault();
        }
    },

    /**
     * Starts the Touch Event listeners running.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Touch.TouchManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        var target = this.target;

        var passive = { passive: true };
        var nonPassive = { passive: false };

        if (this.capture)
        {
            target.addEventListener('touchstart', this.onTouchStart.bind(this), nonPassive);
            target.addEventListener('touchmove', this.onTouchMove.bind(this), nonPassive);
            target.addEventListener('touchend', this.onTouchEnd.bind(this), nonPassive);
        }
        else
        {
            target.addEventListener('touchstart', this.onTouchStart.bind(this), passive);
            target.addEventListener('touchmove', this.onTouchMove.bind(this), passive);
            target.addEventListener('touchend', this.onTouchEnd.bind(this), passive);
        }
    },

    /**
     * Stops the Touch Event listeners.
     * This is called automatically and does not need to be manually invoked.
     *
     * @method Phaser.Input.Touch.TouchManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('touchstart', this.onTouchStart);
        target.removeEventListener('touchmove', this.onTouchMove);
        target.removeEventListener('touchend', this.onTouchEnd);
    },

    /**
     * Destroys this Touch Manager instance.
     *
     * @method Phaser.Input.Touch.TouchManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stopListeners();

        this.target = null;
        this.manager = null;
    }

});

module.exports = TouchManager;
