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
 * @callback TouchHandler
 *
 * @param {TouchEvent} event - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class TouchManager
 * @memberOf Phaser.Input.Touch
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Input.InputManager} inputManager - [description]
 */
var TouchManager = new Class({

    initialize:

    function TouchManager (inputManager)
    {
        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.Input.Touch.TouchManager#enabled
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * [description]
         *
         * @name Phaser.Input.Touch.TouchManager#target
         * @type {null}
         * @since 3.0.0
         */
        this.target;

        /**
         * [description]
         *
         * @name Phaser.Input.Touch.TouchManager#handler
         * @type {?TouchHandler}
         * @since 3.0.0
         */
        this.handler;

        inputManager.events.once('boot', this.boot, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Touch.TouchManager#boot
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

    onTouchStart: function (event)
    {
        if (event.defaultPrevented)
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

    onTouchMove: function (event)
    {
        if (event.defaultPrevented)
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

    onTouchEnd: function (event)
    {
        if (event.defaultPrevented)
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
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Input.Touch.TouchManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stopListeners();

        this.manager = null;
    }

});

module.exports = TouchManager;
