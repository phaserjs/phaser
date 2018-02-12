/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');

/**
 * @classdesc
 * Abstracts away the use of RAF or setTimeOut for the core game update loop.
 * This is invoked automatically by the Phaser.Game instance.
 *
 * @class RequestAnimationFrame
 * @memberOf Phaser.DOM
 * @constructor
 * @since 3.0.0
 */
var RequestAnimationFrame = new Class({

    initialize:

    function RequestAnimationFrame ()
    {
        /**
         * True if RequestAnimationFrame is running, otherwise false.
         *
         * @property {boolean} isRunning
         * @default false
         * @since 3.0.0
         */
        this.isRunning = false;

        /**
         * The callback to be invoked each step.
         *
         * @property {function} callback
         * @since 3.0.0
         */
        this.callback = NOOP;

        /**
         * The most recent timestamp. Either a DOMHighResTimeStamp under RAF or `Date.now` under SetTimeout.
         *
         * @property {DOMHighResTimeStamp|number} tick
         * @default 0
         * @since 3.0.0
         */
        this.tick = 0;

        /**
         * True if the step is using setTimeout instead of RAF.
         *
         * @property {boolean} isSetTimeOut
         * @default false
         * @since 3.0.0
         */
        this.isSetTimeOut = false;

        /**
         * The setTimeout or RAF callback ID used when canceling them.
         *
         * @property {?number} timeOutID
         * @default null
         * @since 3.0.0
         */
        this.timeOutID = null;

        /**
         * The previous time the step was called.
         *
         * @property {number} lastTime
         * @default 0
         * @since 3.0.0
         */
        this.lastTime = 0;

        var _this = this;

        /**
         * The RAF step function.
         * Updates the local tick value, invokes the callback and schedules another call to requestAnimationFrame.
         *
         * @property {function} step
         * @since 3.0.0
         */
        this.step = function step (timestamp)
        {
            // DOMHighResTimeStamp
            _this.lastTime = _this.tick;

            _this.tick = timestamp;

            _this.callback(timestamp);

            _this.timeOutID = window.requestAnimationFrame(step);
        };

        /**
         * The SetTimeout step function.
         * Updates the local tick value, invokes the callback and schedules another call to setTimeout.
         *
         * @property {function} stepTimeout
         * @since 3.0.0
         */
        this.stepTimeout = function stepTimeout ()
        {
            var d = Date.now();

            var delay = Math.max(16 + _this.lastTime - d, 0);

            _this.lastTime = _this.tick;

            _this.tick = d;

            _this.callback(d);

            _this.timeOutID = window.setTimeout(stepTimeout, delay);
        };
    },

    /**
     * Starts the requestAnimationFrame or setTimeout process running.
     *
     * @method Phaser.DOM.RequestAnimationFrame#start
     * @since 3.0.0
     *
     * @param {function} callback - The callback to invoke each step.
     * @param {boolean} forceSetTimeOut - Should it use SetTimeout, even if RAF is available?
     */
    start: function (callback, forceSetTimeOut)
    {
        if (this.isRunning)
        {
            return;
        }

        this.callback = callback;

        this.isSetTimeOut = forceSetTimeOut;

        this.isRunning = true;

        this.timeOutID = (forceSetTimeOut) ? window.setTimeout(this.stepTimeout, 0) : window.requestAnimationFrame(this.step);
    },

    /**
     * Stops the requestAnimationFrame or setTimeout from running.
     *
     * @method Phaser.DOM.RequestAnimationFrame#stop
     * @since 3.0.0
     */
    stop: function ()
    {
        this.isRunning = false;

        if (this.isSetTimeOut)
        {
            clearTimeout(this.timeOutID);
        }
        else
        {
            window.cancelAnimationFrame(this.timeOutID);
        }
    },

    /**
     * Stops the step from running and clears the callback reference.
     *
     * @method Phaser.DOM.RequestAnimationFrame#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.stop();

        this.callback = NOOP;
    }

});

module.exports = RequestAnimationFrame;
