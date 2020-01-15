/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../../../math/Clamp');
var Class = require('../../../utils/Class');
var Events = require('../events');

/**
 * @classdesc
 * A Camera Fade effect.
 *
 * This effect will fade the camera viewport to the given color, over the duration specified.
 *
 * Only the camera viewport is faded. None of the objects it is displaying are impacted, i.e. their colors do
 * not change.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect, if required.
 *
 * @class Fade
 * @memberof Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
var Fade = new Class({

    initialize:

    function Fade (camera)
    {
        /**
         * The Camera this effect belongs to.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @readonly
         * @since 3.5.0
         */
        this.camera = camera;

        /**
         * Is this effect actively running?
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#isRunning
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.5.0
         */
        this.isRunning = false;

        /**
         * Has this effect finished running?
         *
         * This is different from `isRunning` because it remains set to `true` when the effect is over,
         * until the effect is either reset or started again.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#isComplete
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.5.0
         */
        this.isComplete = false;

        /**
         * The direction of the fade.
         * `true` = fade out (transparent to color), `false` = fade in (color to transparent)
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#direction
         * @type {boolean}
         * @readonly
         * @since 3.5.0
         */
        this.direction = true;

        /**
         * The duration of the effect, in milliseconds.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#duration
         * @type {integer}
         * @readonly
         * @default 0
         * @since 3.5.0
         */
        this.duration = 0;

        /**
         * The value of the red color channel the camera will use for the fade effect.
         * A value between 0 and 255.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#red
         * @type {integer}
         * @private
         * @since 3.5.0
         */
        this.red = 0;

        /**
         * The value of the green color channel the camera will use for the fade effect.
         * A value between 0 and 255.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#green
         * @type {integer}
         * @private
         * @since 3.5.0
         */
        this.green = 0;

        /**
         * The value of the blue color channel the camera will use for the fade effect.
         * A value between 0 and 255.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#blue
         * @type {integer}
         * @private
         * @since 3.5.0
         */
        this.blue = 0;

        /**
         * The value of the alpha channel used during the fade effect.
         * A value between 0 and 1.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#alpha
         * @type {number}
         * @private
         * @since 3.5.0
         */
        this.alpha = 0;

        /**
         * If this effect is running this holds the current percentage of the progress, a value between 0 and 1.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#progress
         * @type {number}
         * @since 3.5.0
         */
        this.progress = 0;

        /**
         * Effect elapsed timer.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#_elapsed
         * @type {number}
         * @private
         * @since 3.5.0
         */
        this._elapsed = 0;

        /**
         * This callback is invoked every frame for the duration of the effect.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#_onUpdate
         * @type {?Phaser.Types.Cameras.Scene2D.CameraFadeCallback}
         * @private
         * @default null
         * @since 3.5.0
         */
        this._onUpdate;

        /**
         * On Complete callback scope.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Fade#_onUpdateScope
         * @type {any}
         * @private
         * @since 3.5.0
         */
        this._onUpdateScope;
    },

    /**
     * Fades the Camera to or from the given color over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Fade#start
     * @fires Phaser.Cameras.Scene2D.Events#FADE_IN_START
     * @fires Phaser.Cameras.Scene2D.Events#FADE_OUT_START
     * @since 3.5.0
     *
     * @param {boolean} [direction=true] - The direction of the fade. `true` = fade out (transparent to color), `false` = fade in (color to transparent)
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {integer} [red=0] - The amount to fade the red channel towards. A value between 0 and 255.
     * @param {integer} [green=0] - The amount to fade the green channel towards. A value between 0 and 255.
     * @param {integer} [blue=0] - The amount to fade the blue channel towards. A value between 0 and 255.
     * @param {boolean} [force=false] - Force the effect to start immediately, even if already running.
     * @param {Phaser.Types.Cameras.Scene2D.CameraFadeCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The Camera on which the effect was started.
     */
    start: function (direction, duration, red, green, blue, force, callback, context)
    {
        if (direction === undefined) { direction = true; }
        if (duration === undefined) { duration = 1000; }
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }
        if (context === undefined) { context = this.camera.scene; }

        if (!force && this.isRunning)
        {
            return this.camera;
        }

        this.isRunning = true;
        this.isComplete = false;
        this.duration = duration;
        this.direction = direction;
        this.progress = 0;

        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = (direction) ? Number.MIN_VALUE : 1;

        this._elapsed = 0;

        this._onUpdate = callback;
        this._onUpdateScope = context;

        var eventName = (direction) ? Events.FADE_OUT_START : Events.FADE_IN_START;

        this.camera.emit(eventName, this.camera, this, duration, red, green, blue);

        return this.camera;
    },

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Fade#update
     * @since 3.5.0
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

        if (this._onUpdate)
        {
            this._onUpdate.call(this._onUpdateScope, this.camera, this.progress);
        }

        if (this._elapsed < this.duration)
        {
            this.alpha = (this.direction) ? this.progress : 1 - this.progress;
        }
        else
        {
            this.alpha = (this.direction) ? 1 : 0;
            this.effectComplete();
        }
    },

    /**
     * Called internally by the Canvas Renderer.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Fade#postRenderCanvas
     * @since 3.5.0
     *
     * @param {CanvasRenderingContext2D} ctx - The Canvas context to render to.
     *
     * @return {boolean} `true` if the effect drew to the renderer, otherwise `false`.
     */
    postRenderCanvas: function (ctx)
    {
        if (!this.isRunning && !this.isComplete)
        {
            return false;
        }

        var camera = this.camera;

        ctx.fillStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')';
        ctx.fillRect(camera._cx, camera._cy, camera._cw, camera._ch);

        return true;
    },

    /**
     * Called internally by the WebGL Renderer.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Fade#postRenderWebGL
     * @since 3.5.0
     *
     * @param {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} pipeline - The WebGL Pipeline to render to.
     * @param {function} getTintFunction - A function that will return the gl safe tint colors.
     *
     * @return {boolean} `true` if the effect drew to the renderer, otherwise `false`.
     */
    postRenderWebGL: function (pipeline, getTintFunction)
    {
        if (!this.isRunning && !this.isComplete)
        {
            return false;
        }

        var camera = this.camera;
        var red = this.red / 255;
        var blue = this.blue / 255;
        var green = this.green / 255;

        pipeline.drawFillRect(
            camera._cx, camera._cy, camera._cw, camera._ch,
            getTintFunction(red, green, blue, 1),
            this.alpha
        );

        return true;
    },

    /**
     * Called internally when the effect completes.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Fade#effectComplete
     * @fires Phaser.Cameras.Scene2D.Events#FADE_IN_COMPLETE
     * @fires Phaser.Cameras.Scene2D.Events#FADE_OUT_COMPLETE
     * @since 3.5.0
     */
    effectComplete: function ()
    {
        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;
        this.isComplete = true;

        var eventName = (this.direction) ? Events.FADE_OUT_COMPLETE : Events.FADE_IN_COMPLETE;

        this.camera.emit(eventName, this.camera, this);
    },

    /**
     * Resets this camera effect.
     * If it was previously running, it stops instantly without calling its onComplete callback or emitting an event.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Fade#reset
     * @since 3.5.0
     */
    reset: function ()
    {
        this.isRunning = false;
        this.isComplete = false;

        this._onUpdate = null;
        this._onUpdateScope = null;
    },

    /**
     * Destroys this effect, releasing it from the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Fade#destroy
     * @since 3.5.0
     */
    destroy: function ()
    {
        this.reset();

        this.camera = null;
    }

});

module.exports = Fade;
