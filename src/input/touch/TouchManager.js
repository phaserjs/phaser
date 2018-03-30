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

    /**
     * [description]
     *
     * @method Phaser.Input.Touch.TouchManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        var queue = this.manager.queue;
        var target = this.target;

        var passive = { passive: true };
        var nonPassive = { passive: false };

        var handler;

        if (this.capture)
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                // console.log('touch', event);

                queue.push(event);

                event.preventDefault();
            };

            target.addEventListener('touchstart', handler, nonPassive);
            target.addEventListener('touchmove', handler, nonPassive);
            target.addEventListener('touchend', handler, nonPassive);
        }
        else
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                queue.push(event);
            };

            target.addEventListener('touchstart', handler, passive);
            target.addEventListener('touchmove', handler, passive);
            target.addEventListener('touchend', handler, passive);
        }

        this.handler = handler;
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

        target.removeEventListener('touchstart', this.handler);
        target.removeEventListener('touchmove', this.handler);
        target.removeEventListener('touchend', this.handler);
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
