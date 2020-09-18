/**
 * @author       Jason Nicholls <nicholls.jason@gmail.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../../../math/Clamp');
var Class = require('../../../utils/Class');
var Events = require('../events');
var EaseMap = require('../../../math/easing/EaseMap');

/**
 * @classdesc
 * A Camera Rotate effect.
 *
 * This effect will rotate the Camera so that the its viewport finishes at the given angle in radians,
 * over the duration and with the ease specified.
 * 
 * Camera rotation always takes place based on the Camera viewport. By default, rotation happens
 * in the center of the viewport. You can adjust this with the `originX` and `originY` properties.
 *
 * Rotation influences the rendering of _all_ Game Objects visible by this Camera. However, it does not
 * rotate the Camera viewport itself, which always remains an axis-aligned rectangle.
 *
 * Only the camera is rotates. None of the objects it is displaying are impacted, i.e. their positions do
 * not change.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect if required.
 *
 * @class RotateTo
 * @memberof Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.23.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
var RotateTo = new Class({

    initialize:

    function RotateTo (camera)
    {
        /**
         * The Camera this effect belongs to.
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @readonly
         * @since 3.23.0
         */
        this.camera = camera;

        /**
         * Is this effect actively running?
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#isRunning
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.23.0
         */
        this.isRunning = false;

        /**
         * The duration of the effect, in milliseconds.
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#duration
         * @type {integer}
         * @readonly
         * @default 0
         * @since 3.23.0
         */
        this.duration = 0;

        /**
         * The starting angle to rotate the camera from.
         * 
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#source
         * @type {number}
         * @since 3.23.0
         */
        this.source = 0;

        /**
         * The constantly updated value based on the force.
         * 
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#current
         * @type {number}
         * @since 3.23.0
         */
        this.current = 0;

        /**
         * The destination angle in radians to rotate the camera to.
         * 
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#destination
         * @type {number}
         * @since 3.23.0
         */
        this.destination = 0;

        /**
         * The ease function to use during the Rotate.
         * 
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#ease
         * @type {function}
         * @since 3.23.0
         */
        this.ease;

        /**
         * If this effect is running this holds the current percentage of the progress, a value between 0 and 1.
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#progress
         * @type {number}
         * @since 3.23.0
         */
        this.progress = 0;

        /**
         * Effect elapsed timer.
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#_elapsed
         * @type {number}
         * @private
         * @since 3.23.0
         */
        this._elapsed = 0;

        /**
         * @callback CameraRotateCallback
         *
         * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera on which the effect is running.
         * @param {number} progress - The progress of the effect. A value between 0 and 1.
         * @param {number} angle - The Camera's new angle in radians.
         */

        /**
         * This callback is invoked every frame for the duration of the effect.
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#_onUpdate
         * @type {?CameraRotateCallback}
         * @private
         * @default null
         * @since 3.23.0
         */
        this._onUpdate;

        /**
         * On Complete callback scope.
         *
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#_onUpdateScope
         * @type {any}
         * @private
         * @since 3.23.0
         */
        this._onUpdateScope;

        /**
         * The direction of the rotation.
         * 
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#clockwise
         * @type {boolean}
         * @since 3.23.0
         */
        this.clockwise = true;

        /**
         * The shortest direction to the target rotation.
         * 
         * @name Phaser.Cameras.Scene2D.Effects.RotateTo#shortestPath
         * @type {boolean}
         * @since 3.23.0
         */
        this.shortestPath = false;
    },

    /**
     * This effect will scroll the Camera so that the center of its viewport finishes at the given angle,
     * over the duration and with the ease specified.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#start
     * @fires Phaser.Cameras.Scene2D.Events#ROTATE_START
     * @fires Phaser.Cameras.Scene2D.Events#ROTATE_COMPLETE
     * @since 3.23.0
     *
     * @param {number} radians - The destination angle in radians to rotate the Camera viewport to. If the angle is positive then the rotation is clockwise else anticlockwise
     * @param {boolean} [shortestPath=false] - If shortest path is set to true the camera will rotate in the quickest direction clockwise or anti-clockwise.
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {(string|function)} [ease='Linear'] - The ease to use for the Rotate. Can be any of the Phaser Easing constants or a custom function.
     * @param {boolean} [force=false] - Force the rotation effect to start immediately, even if already running.
     * @param {CameraRotateCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent four arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
     * the current camera scroll x coordinate and the current camera scroll y coordinate.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The Camera on which the effect was started.
     */
    start: function (radians, shortestPath, duration, ease, force, callback, context)
    {
        if (duration === undefined) { duration = 1000; }
        if (ease === undefined) { ease = EaseMap.Linear; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }
        if (context === undefined) { context = this.camera.scene; }
        if (shortestPath === undefined) { shortestPath = false; }

        this.shortestPath = shortestPath;

        var tmpDestination = radians;

        if (radians < 0)
        {
            tmpDestination = -1 * radians;
            this.clockwise = false;
        }
        else
        {
            this.clockwise = true;
        }

        var maxRad = (360 * Math.PI) / 180;

        tmpDestination = tmpDestination - (Math.floor(tmpDestination / maxRad) * maxRad);

        var cam = this.camera;

        if (!force && this.isRunning)
        {
            return cam;
        }

        this.isRunning = true;
        this.duration = duration;
        this.progress = 0;

        //  Starting from
        this.source = cam.rotation;

        //  Destination
        this.destination = tmpDestination;

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


        if (this.shortestPath)
        {
            // The shortest path is true so calculate the quickest direction
            var cwDist = 0;
            var acwDist = 0;

            if (this.destination > this.source)
            {
                cwDist = Math.abs(this.destination - this.source);
            }
            else
            {
                cwDist = (Math.abs(this.destination + maxRad) - this.source);
            }

            if (this.source > this.destination)
            {
                acwDist = Math.abs(this.source - this.destination);
            }
            else
            {
                acwDist = (Math.abs(this.source + maxRad) - this.destination);
            }

            if (cwDist < acwDist)
            {
                this.clockwise = true;
            }
            else if (cwDist > acwDist)
            {
                this.clockwise = false;
            }
        }

        this.camera.emit(Events.ROTATE_START, this.camera, this, duration, tmpDestination);

        return cam;
    },

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#update
     * @since 3.23.0
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

        var progress = Clamp(this._elapsed / this.duration, 0, 1);

        this.progress = progress;

        var cam = this.camera;

        if (this._elapsed < this.duration)
        {
            var v = this.ease(progress);

            this.current = cam.rotation;
            var distance = 0;
            var maxRad = (360 * Math.PI) / 180;
            var target = this.destination;
            var current = this.current;

            if (this.clockwise === false)
            {
                target = this.current;
                current = this.destination;
            }

            if (target >= current)
            {
                distance = Math.abs(target - current);
            }
            else
            {
                distance = (Math.abs(target + maxRad) - current);
            }

            var r = 0;

            if (this.clockwise)
            {
                r = (cam.rotation + (distance * v));
            }
            else
            {
                r = (cam.rotation - (distance * v));
            }

            cam.rotation = r;

            if (this._onUpdate)
            {
                this._onUpdate.call(this._onUpdateScope, cam, progress, r);
            }
        }
        else
        {
            cam.rotation = this.destination;

            if (this._onUpdate)
            {
                this._onUpdate.call(this._onUpdateScope, cam, progress, this.destination);
            }
    
            this.effectComplete();
        }
    },

    /**
     * Called internally when the effect completes.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#effectComplete
     * @since 3.23.0
     */
    effectComplete: function ()
    {
        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;

        this.camera.emit(Events.ROTATE_COMPLETE, this.camera, this);
    },

    /**
     * Resets this camera effect.
     * If it was previously running, it stops instantly without calling its onComplete callback or emitting an event.
     *
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#reset
     * @since 3.23.0
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
     * @method Phaser.Cameras.Scene2D.Effects.RotateTo#destroy
     * @since 3.23.0
     */
    destroy: function ()
    {
        this.reset();

        this.camera = null;
        this.source = null;
        this.destination = null;
    }

});

module.exports = RotateTo;
