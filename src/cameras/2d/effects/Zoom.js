/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../../../math/Clamp');
var Class = require('../../../utils/Class');
var EaseMap = require('../../../math/easing/EaseMap');

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
 * @memberOf Phaser.Cameras.Scene2D.Effects
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
         * @readOnly
         * @since 3.11.0
         */
        this.camera = camera;

        /**
         * Is this effect actively running?
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#isRunning
         * @type {boolean}
         * @readOnly
         * @default false
         * @since 3.11.0
         */
        this.isRunning = false;

        /**
         * The duration of the effect, in milliseconds.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#duration
         * @type {integer}
         * @readOnly
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
         * @callback CameraZoomCallback
         *
         * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
         * @param {number} progress - The progress of the effect. A value between 0 and 1.
         * @param {number} zoom - The Camera's new zoom value.
         */

        /**
         * This callback is invoked every frame for the duration of the effect.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Zoom#_onUpdate
         * @type {?CameraZoomCallback}
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
     * This event is fired when the Zoom effect begins to run on a camera.
     *
     * @event CameraZoomStartEvent
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
     * @param {Phaser.Cameras.Scene2D.Effects.Zoom} effect - A reference to the effect instance.
     * @param {integer} duration - The duration of the effect.
     * @param {number} zoom - The destination zoom value.
     */

    /**
     * This event is fired when the Zoom effect completes.
     *
     * @event CameraZoomCompleteEvent
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
     * @param {Phaser.Cameras.Scene2D.Effects.Zoom} effect - A reference to the effect instance.
     */

    /**
     * This effect will zoom the Camera to the given scale, over the duration and with the ease specified.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Zoom#start
     * @fires CameraZoomStartEvent
     * @fires CameraZoomCompleteEvent
     * @since 3.11.0
     *
     * @param {number} zoom - The target Camera zoom value.
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {(string|function)} [ease='Linear'] - The ease to use for the Zoom. Can be any of the Phaser Easing constants or a custom function.
     * @param {boolean} [force=false] - Force the shake effect to start immediately, even if already running.
     * @param {CameraZoomCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
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

        this.camera.emit('camerazoomstart', this.camera, this, duration, zoom);

        return cam;
    },

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Zoom#update
     * @since 3.11.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
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
     * @since 3.11.0
     */
    effectComplete: function ()
    {
        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;

        this.camera.emit('camerazoomcomplete', this.camera, this);
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
