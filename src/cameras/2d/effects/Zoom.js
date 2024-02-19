/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../../../math/Clamp');
var Class = require('../../../utils/Class');
var EaseMap = require('../../../math/easing/EaseMap');
var Events = require('../events');

/**
 * @classdesc
 * A Camera Zoom effect.
 *
 * This effect will zoom the Camera to the given scale, over the duration and with the ease specified.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect if required.
 *
 * @class Zoom
 * @memberof Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.11.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
var Zoom = new Class({

    initialize:

    function Zoom (camera)
    {
        /**
         * The Camera this effect belongs to.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @readonly
         * @since 3.11.0
         */
        this.camera = camera;

        /**
         * Is this effect actively running?
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#isRunning
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.11.0
         */
        this.isRunning = false;

        /**
         * The duration of the effect, in milliseconds.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#duration
         * @type {number}
         * @readonly
         * @default 0
         * @since 3.11.0
         */
        this.duration = 0;

        /**
         * The starting zoom value;
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#source
         * @type {number}
         * @since 3.11.0
         */
        this.source = 1;

        /**
         * The destination zoom value.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#destination
         * @type {number}
         * @since 3.11.0
         */
        this.destination = 1;

        /**
         * The ease function to use during the zoom.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#ease
         * @type {function}
         * @since 3.11.0
         */
        this.ease;

        /**
         * If this effect is running this holds the current percentage of the progress, a value between 0 and 1.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#progress
         * @type {number}
         * @since 3.11.0
         */
        this.progress = 0;

        /**
         * Effect elapsed timer.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#_elapsed
         * @type {number}
         * @private
         * @since 3.11.0
         */
        this._elapsed = 0;

        /**
         * This callback is invoked every frame for the duration of the effect.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#_onUpdate
         * @type {?Phaser.Types.Cameras.Scene2D.CameraZoomCallback}
         * @private
         * @default null
         * @since 3.11.0
         */
        this._onUpdate;

        /**
         * On Complete callback scope.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#_onUpdateScope
         * @type {any}
         * @private
         * @since 3.11.0
         */
        this._onUpdateScope;
    },

    /**
     * This effect will zoom the Camera to the given scale, over the duration and with the ease specified.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Zoom#start
     * @fires Phaser.Cameras.Scene2D.Events#ZOOM_START
     * @fires Phaser.Cameras.Scene2D.Events#ZOOM_COMPLETE
     * @since 3.11.0
     *
     * @param {number} zoom - The target Camera zoom value.
     * @param {number} [duration=1000] - The duration of the effect in milliseconds.
     * @param {(string|function)} [ease='Linear'] - The ease to use for the Zoom. Can be any of the Phaser Easing constants or a custom function.
     * @param {boolean} [force=false] - Force the zoom effect to start immediately, even if already running.
     * @param {Phaser.Types.Cameras.Scene2D.CameraZoomCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent three arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
     * and the current camera zoom value.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The Camera on which the effect was started.
     */
    start: function (zoom, duration, ease, force, callback, context)
    {
        if (duration === undefined) { duration = 1000; }
        if (ease === undefined) { ease = EaseMap.Linear; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }
        if (context === undefined) { context = this.camera.scene; }

        var cam = this.camera;

        if (!force && this.isRunning)
        {
            return cam;
        }

        this.isRunning = true;
        this.duration = duration;
        this.progress = 0;

        //  Starting from
        this.source = cam.zoom;

        //  Zooming to
        this.destination = zoom;

        //  Using this ease
        if (typeof ease === 'string' && EaseMap.hasOwnProperty(ease))
        {
            this.ease = EaseMap[ease];
        }
        else if (typeof ease === 'function')
        {
            this.ease = ease;
        }

        this._elapsed = 0;

        this._onUpdate = callback;
        this._onUpdateScope = context;

        this.camera.emit(Events.ZOOM_START, this.camera, this, duration, zoom);

        return cam;
    },

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Zoom#update
     * @since 3.11.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        if (!this.isRunning)
        {
            return;
        }

        this._elapsed += delta;

        this.progress = Clamp(this._elapsed / this.duration, 0, 1);

        if (this._elapsed < this.duration)
        {
            this.camera.zoom = this.source + ((this.destination - this.source) * this.ease(this.progress));

            if (this._onUpdate)
            {
                this._onUpdate.call(this._onUpdateScope, this.camera, this.progress, this.camera.zoom);
            }
        }
        else
        {
            this.camera.zoom = this.destination;

            if (this._onUpdate)
            {
                this._onUpdate.call(this._onUpdateScope, this.camera, this.progress, this.destination);
            }

            this.effectComplete();
        }
    },

    /**
     * Called internally when the effect completes.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Zoom#effectComplete
     * @fires Phaser.Cameras.Scene2D.Events#ZOOM_COMPLETE
     * @since 3.11.0
     */
    effectComplete: function ()
    {
        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;

        this.camera.emit(Events.ZOOM_COMPLETE, this.camera, this);
    },

    /**
     * Resets this camera effect.
     * If it was previously running, it stops instantly without calling its onComplete callback or emitting an event.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Zoom#reset
     * @since 3.11.0
     */
    reset: function ()
    {
        this.isRunning = false;

        this._onUpdate = null;
        this._onUpdateScope = null;
    },

    /**
     * Destroys this effect, releasing it from the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Zoom#destroy
     * @since 3.11.0
     */
    destroy: function ()
    {
        this.reset();

        this.camera = null;
    }

});

module.exports = Zoom;
