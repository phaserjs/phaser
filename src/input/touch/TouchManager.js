/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var NOOP = require('../../utils/NOOP');

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
 * @memberof Phaser.Input.Touch
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

        /**
         * The Touch Start event handler function.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Touch.TouchManager#onTouchStart
         * @type {function}
         * @since 3.0.0
         */
        this.onTouchStart = NOOP;

        /**
         * The Touch Move event handler function.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Touch.TouchManager#onTouchMove
         * @type {function}
         * @since 3.0.0
         */
        this.onTouchMove = NOOP;

        /**
         * The Touch End event handler function.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Touch.TouchManager#onTouchEnd
         * @type {function}
         * @since 3.0.0
         */
        this.onTouchEnd = NOOP;

        /**
         * The Touch Cancel event handler function.
         * Initially empty and bound in the `startListeners` method.
         *
         * @name Phaser.Input.Touch.TouchManager#onTouchCancel
         * @type {function}
         * @since 3.15.0
         */
        this.onTouchCancel = NOOP;

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

        if (this.enabled && this.target)
        {
            this.startListeners();
        }
    },

    /**
     * Starts the Touch Event listeners running as long as an input target is set.
     * 
     * This method is called automatically if Touch Input is enabled in the game config,
     * which it is by default. However, you can call it manually should you need to
     * delay input capturing until later in the game.
     *
     * @method Phaser.Input.Touch.TouchManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        var _this = this;

        this.onTouchStart = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                //  Do nothing if event already handled
                return;
            }
    
            _this.manager.queueTouchStart(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.onTouchMove = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                //  Do nothing if event already handled
                return;
            }
    
            _this.manager.queueTouchMove(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.onTouchEnd = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                //  Do nothing if event already handled
                return;
            }
    
            _this.manager.queueTouchEnd(event);
    
            if (_this.capture)
            {
                event.preventDefault();
            }
        };

        this.onTouchCancel = function (event)
        {
            if (event.defaultPrevented || !_this.enabled || !_this.manager)
            {
                //  Do nothing if event already handled
                return;
            }
    
            _this.manager.queueTouchCancel(event);
    
            if (_this.capture)
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

        if (this.capture)
        {
            target.addEventListener('touchstart', this.onTouchStart, nonPassive);
            target.addEventListener('touchmove', this.onTouchMove, nonPassive);
            target.addEventListener('touchend', this.onTouchEnd, nonPassive);
            target.addEventListener('touchcancel', this.onTouchCancel, nonPassive);
        }
        else
        {
            target.addEventListener('touchstart', this.onTouchStart, passive);
            target.addEventListener('touchmove', this.onTouchMove, passive);
            target.addEventListener('touchend', this.onTouchEnd, passive);
        }

        this.enabled = true;
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
        target.removeEventListener('touchcancel', this.onTouchCancel);
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
        this.enabled = false;
        this.manager = null;
    }

});

module.exports = TouchManager;
