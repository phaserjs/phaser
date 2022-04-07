/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../../../math/Clamp');
var Class = require('../../../utils/Class');
var Events = require('../events');

/**
 * @classdesc
 * A Camera Flash effect.
 *
 * This effect will flash the camera viewport to the given color, over the duration specified.
 *
 * Only the camera viewport is flashed. None of the objects it is displaying are impacted, i.e. their colors do
 * not change.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect, if required.
 *
 * @class Flash
 * @memberof Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
var Flash = new Class({

    initialize:

    function Flash (camera)
    {
        /**
         * The Camera this effect belongs to.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @readonly
         * @since 3.5.0
         */
        this.camera = camera;

        /**
         * Is this effect actively running?
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#isRunning
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.5.0
         */
        this.isRunning = false;

        /**
         * The duration of the effect, in milliseconds.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#duration
         * @type {number}
         * @readonly
         * @default 0
         * @since 3.5.0
         */
        this.duration = 0;

        /**
         * The value of the red color channel the camera will use for the flash effect.
         * A value between 0 and 255.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#red
         * @type {number}
         * @private
         * @since 3.5.0
         */
        this.red = 0;

        /**
         * The value of the green color channel the camera will use for the flash effect.
         * A value between 0 and 255.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#green
         * @type {number}
         * @private
         * @since 3.5.0
         */
        this.green = 0;

        /**
         * The value of the blue color channel the camera will use for the flash effect.
         * A value between 0 and 255.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#blue
         * @type {number}
         * @private
         * @since 3.5.0
         */
        this.blue = 0;

        /**
         * The value of the alpha channel used during the flash effect.
         * A value between 0 and 1.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#alpha
         * @type {number}
         * @since 3.5.0
         */
        this.alpha = 1;

        /**
         * If this effect is running this holds the current percentage of the progress, a value between 0 and 1.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#progress
         * @type {number}
         * @since 3.5.0
         */
        this.progress = 0;

        /**
         * Effect elapsed timer.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#_elapsed
         * @type {number}
         * @private
         * @since 3.5.0
         */
        this._elapsed = 0;

        /**
         * This is an internal copy of the initial value of `this.alpha`, used to calculate the current alpha value of the fade effect.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#_alpha
         * @type {number}
         * @private
         * @readonly
         * @since 3.60.0
         */
        this._alpha;

        /**
         * This callback is invoked every frame for the duration of the effect.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#_onUpdate
         * @type {?Phaser.Types.Cameras.Scene2D.CameraFlashCallback}
         * @private
         * @default null
         * @since 3.5.0
         */
        this._onUpdate;

        /**
         * On Complete callback scope.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Flash#_onUpdateScope
         * @type {any}
         * @private
         * @since 3.5.0
         */
        this._onUpdateScope;
    },

    /**
     * Flashes the Camera to or from the given color over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Flash#start
     * @fires Phaser.Cameras.Scene2D.Events#FLASH_START
     * @fires Phaser.Cameras.Scene2D.Events#FLASH_COMPLETE
     * @since 3.5.0
     *
     * @param {number} [duration=250] - The duration of the effect in milliseconds.
     * @param {number} [red=255] - The amount to flash the red channel towards. A value between 0 and 255.
     * @param {number} [green=255] - The amount to flash the green channel towards. A value between 0 and 255.
     * @param {number} [blue=255] - The amount to flash the blue channel towards. A value between 0 and 255.
     * @param {boolean} [force=false] - Force the effect to start immediately, even if already running.
     * @param {Phaser.Types.Cameras.Scene2D.CameraFlashCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The Camera on which the effect was started.
     */
    start: function (duration, red, green, blue, force, callback, context)
    {
        if (duration === undefined) { duration = 250; }
        if (red === undefined) { red = 255; }
        if (green === undefined) { green = 255; }
        if (blue === undefined) { blue = 255; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }
        if (context === undefined) { context = this.camera.scene; }

        if (!force && this.isRunning)
        {
            return this.camera;
        }

        this.isRunning = true;
        this.duration = duration;
        this.progress = 0;

        this.red = red;
        this.green = green;
        this.blue = blue;

        this._alpha = this.alpha;
        this._elapsed = 0;

        this._onUpdate = callback;
        this._onUpdateScope = context;

        this.camera.emit(Events.FLASH_START, this.camera, this, duration, red, green, blue);

        return this.camera;
    },

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Flash#update
     * @since 3.5.0
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

        if (this._onUpdate)
        {
            this._onUpdate.call(this._onUpdateScope, this.camera, this.progress);
        }

        if (this._elapsed < this.duration)
        {
            this.alpha = this._alpha * (1 - this.progress);
        }
        else
        {
            this.effectComplete();
        }
    },

    /**
     * Called internally by the Canvas Renderer.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Flash#postRenderCanvas
     * @since 3.5.0
     *
     * @param {CanvasRenderingContext2D} ctx - The Canvas context to render to.
     *
     * @return {boolean} `true` if the effect drew to the renderer, otherwise `false`.
     */
    postRenderCanvas: function (ctx)
    {
        if (!this.isRunning)
        {
            return false;
        }

        var camera = this.camera;

        ctx.fillStyle = 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')';
        ctx.fillRect(camera.x, camera.y, camera.width, camera.height);

        return true;
    },

    /**
     * Called internally by the WebGL Renderer.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Flash#postRenderWebGL
     * @since 3.5.0
     *
     * @param {Phaser.Renderer.WebGL.Pipelines.MultiPipeline} pipeline - The WebGL Pipeline to render to. Must provide the `drawFillRect` method.
     * @param {function} getTintFunction - A function that will return the gl safe tint colors.
     *
     * @return {boolean} `true` if the effect drew to the renderer, otherwise `false`.
     */
    postRenderWebGL: function (pipeline, getTintFunction)
    {
        if (!this.isRunning)
        {
            return false;
        }

        var camera = this.camera;
        var red = this.red / 255;
        var green = this.green / 255;
        var blue = this.blue / 255;

        pipeline.drawFillRect(
            camera.x, camera.y, camera.width, camera.height,
            getTintFunction(blue, green, red, 1),
            this.alpha
        );

        return true;
    },

    /**
     * Called internally when the effect completes.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Flash#effectComplete
     * @fires Phaser.Cameras.Scene2D.Events#FLASH_COMPLETE
     * @since 3.5.0
     */
    effectComplete: function ()
    {
        this.alpha = this._alpha;
        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;

        this.camera.emit(Events.FLASH_COMPLETE, this.camera, this);
    },

    /**
     * Resets this camera effect.
     * If it was previously running, it stops instantly without calling its onComplete callback or emitting an event.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Flash#reset
     * @since 3.5.0
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
     * @method Phaser.Cameras.Scene2D.Effects.Flash#destroy
     * @since 3.5.0
     */
    destroy: function ()
    {
        this.reset();

        this.camera = null;
    }

});

module.exports = Flash;
