/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('../../../math/Clamp');
var Class = require('../../../utils/Class');
var Events = require('../events');
var Vector2 = require('../../../math/Vector2');

/**
 * @classdesc
 * A Camera Shake effect.
 *
 * This effect will shake the camera viewport by a random amount, bounded by the specified intensity, each frame.
 *
 * Only the camera viewport is moved. None of the objects it is displaying are impacted, i.e. their positions do
 * not change.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect if required.
 *
 * @class Shake
 * @memberof Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.5.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
var Shake = new Class({

    initialize:

    function Shake (camera)
    {
        /**
         * The Camera this effect belongs to.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#camera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @readonly
         * @since 3.5.0
         */
        this.camera = camera;

        /**
         * Is this effect actively running?
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#isRunning
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.5.0
         */
        this.isRunning = false;

        /**
         * The duration of the effect, in milliseconds.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#duration
         * @type {number}
         * @readonly
         * @default 0
         * @since 3.5.0
         */
        this.duration = 0;

        /**
         * The intensity of the effect. Use small float values. The default when the effect starts is 0.05.
         * This is a Vector2 object, allowing you to control the shake intensity independently across x and y.
         * You can modify this value while the effect is active to create more varied shake effects.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#intensity
         * @type {Phaser.Math.Vector2}
         * @since 3.5.0
         */
        this.intensity = new Vector2();

        /**
         * If this effect is running this holds the current percentage of the progress, a value between 0 and 1.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#progress
         * @type {number}
         * @since 3.5.0
         */
        this.progress = 0;

        /**
         * Effect elapsed timer.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#_elapsed
         * @type {number}
         * @private
         * @since 3.5.0
         */
        this._elapsed = 0;

        /**
         * How much to offset the camera by horizontally.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#_offsetX
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._offsetX = 0;

        /**
         * How much to offset the camera by vertically.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#_offsetY
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._offsetY = 0;

        /**
         * This callback is invoked every frame for the duration of the effect.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#_onUpdate
         * @type {?Phaser.Types.Cameras.Scene2D.CameraShakeCallback}
         * @private
         * @default null
         * @since 3.5.0
         */
        this._onUpdate;

        /**
         * On Complete callback scope.
         *
         * @name Phaser.Cameras.Scene2D.Effects.Shake#_onUpdateScope
         * @type {any}
         * @private
         * @since 3.5.0
         */
        this._onUpdateScope;
    },

    /**
     * Shakes the Camera by the given intensity over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Shake#start
     * @fires Phaser.Cameras.Scene2D.Events#SHAKE_START
     * @fires Phaser.Cameras.Scene2D.Events#SHAKE_COMPLETE
     * @since 3.5.0
     *
     * @param {number} [duration=100] - The duration of the effect in milliseconds.
     * @param {(number|Phaser.Math.Vector2)} [intensity=0.05] - The intensity of the shake.
     * @param {boolean} [force=false] - Force the shake effect to start immediately, even if already running.
     * @param {Phaser.Types.Cameras.Scene2D.CameraShakeCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} The Camera on which the effect was started.
     */
    start: function (duration, intensity, force, callback, context)
    {
        if (duration === undefined) { duration = 100; }
        if (intensity === undefined) { intensity = 0.05; }
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

        if (typeof intensity === 'number')
        {
            this.intensity.set(intensity);
        }
        else
        {
            this.intensity.set(intensity.x, intensity.y);
        }

        this._elapsed = 0;
        this._offsetX = 0;
        this._offsetY = 0;

        this._onUpdate = callback;
        this._onUpdateScope = context;

        this.camera.emit(Events.SHAKE_START, this.camera, this, duration, intensity);

        return this.camera;
    },

    /**
     * The pre-render step for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Shake#preRender
     * @since 3.5.0
     */
    preRender: function ()
    {
        if (this.isRunning)
        {
            this.camera.matrix.translate(this._offsetX, this._offsetY);
        }
    },

    /**
     * The main update loop for this effect. Called automatically by the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Shake#update
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
            var intensity = this.intensity;
            var width = this.camera.width;
            var height = this.camera.height;
            var zoom = this.camera.zoom;

            this._offsetX = (Math.random() * intensity.x * width * 2 - intensity.x * width) * zoom;
            this._offsetY = (Math.random() * intensity.y * height * 2 - intensity.y * height) * zoom;

            if (this.camera.roundPixels)
            {
                this._offsetX = Math.round(this._offsetX);
                this._offsetY = Math.round(this._offsetY);
            }
        }
        else
        {
            this.effectComplete();
        }
    },

    /**
     * Called internally when the effect completes.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Shake#effectComplete
     * @fires Phaser.Cameras.Scene2D.Events#SHAKE_COMPLETE
     * @since 3.5.0
     */
    effectComplete: function ()
    {
        this._offsetX = 0;
        this._offsetY = 0;

        this._onUpdate = null;
        this._onUpdateScope = null;

        this.isRunning = false;

        this.camera.emit(Events.SHAKE_COMPLETE, this.camera, this);
    },

    /**
     * Resets this camera effect.
     * If it was previously running, it stops instantly without calling its onComplete callback or emitting an event.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Shake#reset
     * @since 3.5.0
     */
    reset: function ()
    {
        this.isRunning = false;

        this._offsetX = 0;
        this._offsetY = 0;

        this._onUpdate = null;
        this._onUpdateScope = null;
    },

    /**
     * Destroys this effect, releasing it from the Camera.
     *
     * @method Phaser.Cameras.Scene2D.Effects.Shake#destroy
     * @since 3.5.0
     */
    destroy: function ()
    {
        this.reset();

        this.camera = null;
        this.intensity = null;
    }

});

module.exports = Shake;
