/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var Rectangle = require('../../geom/rectangle/Rectangle');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var ValueToColor = require('../../display/color/ValueToColor');
var Vector2 = require('../../math/Vector2');

/**
 * @typedef {object} JSONCamera
 *
 * @property {string} name - The name of the camera
 * @property {number} x - The horizontal position of camera
 * @property {number} y - The vertical position of camera
 * @property {number} width - The width size of camera
 * @property {number} height - The height size of camera
 * @property {number} zoom - The zoom of camera
 * @property {number} rotation - The rotation of camera
 * @property {boolean} roundPixels - The round pixels st status of camera
 * @property {number} scrollX - The horizontal scroll of camera
 * @property {number} scrollY - The vertical scroll of camera
 * @property {string} backgroundColor - The background color of camera
 * @property {object} [bounds] - The bounds of camera
 * @property {number} [bounds.x] - The horizontal position of bounds of camera
 * @property {number} [bounds.y] - The vertical position of bounds of camera
 * @property {number} [bounds.width] - The width of the bounds of camera
 * @property {number} [bounds.height] - The height of the bounds of camera
 */

/**
 * @callback Camera2DCallback
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
 */

/**
 * @classdesc
 * [description]
 *
 * @class Camera
 * @memberOf Phaser.Cameras.Scene2D
 * @constructor
 * @since 3.0.0
 *
 * @param {number} x - The x position of the Camera, relative to the top-left of the game canvas.
 * @param {number} y - The y position of the Camera, relative to the top-left of the game canvas.
 * @param {number} width - The width of the Camera, in pixels.
 * @param {number} height - The height of the Camera, in pixels.
 */
var Camera = new Class({

    initialize:

    function Camera (x, y, width, height)
    {
        /**
         * A reference to the Scene this camera belongs to.
         *
         * @name Phaser.Cameras.Scene2D.Camera#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene;

        /**
         * The name of the Camera. This is left empty for your own use.
         *
         * @name Phaser.Cameras.Scene2D.Camera#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * The x position of the Camera, relative to the top-left of the game canvas.
         *
         * @name Phaser.Cameras.Scene2D.Camera#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y position of the Camera, relative to the top-left of the game canvas.
         *
         * @name Phaser.Cameras.Scene2D.Camera#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The width of the Camera, in pixels.
         *
         * @name Phaser.Cameras.Scene2D.Camera#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The height of the Camera, in pixels.
         *
         * @name Phaser.Cameras.Scene2D.Camera#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = height;

        /**
         * Should this camera round its pixel values to integers?
         *
         * @name Phaser.Cameras.Scene2D.Camera#roundPixels
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.roundPixels = false;

        /**
         * Is this Camera using a bounds to restrict scrolling movement?
         * Set this property along with the bounds via `Camera.setBounds`.
         *
         * @name Phaser.Cameras.Scene2D.Camera#useBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.useBounds = false;

        /**
         * The bounds the camera is restrained to during scrolling.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_bounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.0.0
         */
        this._bounds = new Rectangle();

        /**
         * Does this Camera allow the Game Objects it renders to receive input events?
         *
         * @name Phaser.Cameras.Scene2D.Camera#inputEnabled
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.inputEnabled = true;

        /**
         * The horizontal scroll position of this camera.
         * Optionally restricted via the Camera bounds.
         *
         * @name Phaser.Cameras.Scene2D.Camera#scrollX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.scrollX = 0;

        /**
         * The vertical scroll position of this camera.
         * Optionally restricted via the Camera bounds.
         *
         * @name Phaser.Cameras.Scene2D.Camera#scrollY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.scrollY = 0;

        /**
         * The Camera zoom value. Change this value to zoom in, or out of, a Scene.
         * Set to 1 to return to the default zoom level.
         *
         * @name Phaser.Cameras.Scene2D.Camera#zoom
         * @type {float}
         * @default 1
         * @since 3.0.0
         */
        this.zoom = 1;

        /**
         * The rotation of the Camera. This influences the rendering of all Game Objects visible by this camera.
         *
         * @name Phaser.Cameras.Scene2D.Camera#rotation
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.rotation = 0;

        /**
         * A local transform matrix used for internal calculations.
         *
         * @name Phaser.Cameras.Scene2D.Camera#matrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.0.0
         */
        this.matrix = new TransformMatrix(1, 0, 0, 1, 0, 0);

        /**
         * Does this Camera have a transparent background?
         *
         * @name Phaser.Cameras.Scene2D.Camera#transparent
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.transparent = true;

        /**
         * TODO
         *
         * @name Phaser.Cameras.Scene2D.Camera#clearBeforeRender
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.clearBeforeRender = true;

        /**
         * The background color of this Camera. Only used if `transparent` is `false`.
         *
         * @name Phaser.Cameras.Scene2D.Camera#backgroundColor
         * @type {Phaser.Display.Color}
         * @since 3.0.0
         */
        this.backgroundColor = ValueToColor('rgba(0,0,0,0)');

        /**
         * Should the camera cull Game Objects before rendering?
         * In some special cases it may be beneficial to disable this.
         *
         * @name Phaser.Cameras.Scene2D.Camera#disableCull
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.disableCull = false;

        /**
         * A temporary array of culled objects.
         *
         * @name Phaser.Cameras.Scene2D.Camera#culledObjects
         * @type {Phaser.GameObjects.GameObject[]}
         * @default []
         * @since 3.0.0
         */
        this.culledObjects = [];

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_shakeDuration
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._shakeDuration = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_shakeIntensity
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._shakeIntensity = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_shakeOffsetX
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._shakeOffsetX = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_shakeOffsetY
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._shakeOffsetY = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_shakeCallback
         * @type {?Camera2DCallback}
         * @private
         * @default null
         * @since 3.3.0
         */
        this._shakeCallback = null;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_fadeDuration
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._fadeDuration = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_fadeRed
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._fadeRed = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_fadeGreen
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._fadeGreen = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_fadeBlue
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._fadeBlue = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_fadeAlpha
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._fadeAlpha = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_fadeCallback
         * @type {?Camera2DCallback}
         * @private
         * @default null
         * @since 3.3.0
         */
        this._fadeCallback = null;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_flashDuration
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._flashDuration = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_flashRed
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._flashRed = 1;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_flashGreen
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._flashGreen = 1;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_flashBlue
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._flashBlue = 1;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_flashAlpha
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._flashAlpha = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_flashCallback
         * @type {?Camera2DCallback}
         * @private
         * @default null
         * @since 3.3.0
         */
        this._flashCallback = null;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_follow
         * @type {?any}
         * @private
         * @default null
         * @since 3.0.0
         */
        this._follow = null;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Scene2D.Camera#_id
         * @type {integer}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._id = 0;
    },

    scaleX: {
        get: function ()
        {
            return this.zoom;
        }
    },

    scaleY: {
        get: function ()
        {
            return this.zoom;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#centerToBounds
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    centerToBounds: function ()
    {
        this.scrollX = (this._bounds.width * 0.5) - (this.width * 0.5);
        this.scrollY = (this._bounds.height * 0.5) - (this.height * 0.5);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#centerToSize
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    centerToSize: function ()
    {
        this.scrollX = this.width * 0.5;
        this.scrollY = this.height * 0.5;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#cull
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.GameObject[]} G - [renderableObjects,$return]
     *
     * @param {Phaser.GameObjects.GameObject[]} renderableObjects - [description]
     *
     * @return {Phaser.GameObjects.GameObject[]} [description]
     */
    cull: function (renderableObjects)
    {
        if (this.disableCull)
        {
            return renderableObjects;
        }

        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];

        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            return renderableObjects;
        }

        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];

        var scrollX = this.scrollX;
        var scrollY = this.scrollY;
        var cameraW = this.width;
        var cameraH = this.height;
        var culledObjects = this.culledObjects;
        var length = renderableObjects.length;

        determinant = 1 / determinant;

        culledObjects.length = 0;

        for (var index = 0; index < length; ++index)
        {
            var object = renderableObjects[index];

            if (!object.hasOwnProperty('width') || object.parentContainer)
            {
                culledObjects.push(object);
                continue;
            }

            var objectW = object.width;
            var objectH = object.height;
            var objectX = (object.x - (scrollX * object.scrollFactorX)) - (objectW * object.originX);
            var objectY = (object.y - (scrollY * object.scrollFactorY)) - (objectH * object.originY);
            var tx = (objectX * mva + objectY * mvc + mve);
            var ty = (objectX * mvb + objectY * mvd + mvf);
            var tw = ((objectX + objectW) * mva + (objectY + objectH) * mvc + mve);
            var th = ((objectX + objectW) * mvb + (objectY + objectH) * mvd + mvf);
            var cullW = cameraW + objectW;
            var cullH = cameraH + objectH;

            if (tx > -objectW || ty > -objectH || tx < cullW || ty < cullH ||
                tw > -objectW || th > -objectH || tw < cullW || th < cullH)
            {
                culledObjects.push(object);
            }
        }

        return culledObjects;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#cullHitTest
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.GameObject[]} G - [interactiveObjects,$return]
     *
     * @param {Phaser.GameObjects.GameObject[]} interactiveObjects - [description]
     *
     * @return {Phaser.GameObjects.GameObject[]} [description]
     */
    cullHitTest: function (interactiveObjects)
    {
        if (this.disableCull)
        {
            return interactiveObjects;
        }

        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];

        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            return interactiveObjects;
        }

        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];

        var scrollX = this.scrollX;
        var scrollY = this.scrollY;
        var cameraW = this.width;
        var cameraH = this.height;
        var length = interactiveObjects.length;

        determinant = 1 / determinant;

        var culledObjects = [];

        for (var index = 0; index < length; ++index)
        {
            var object = interactiveObjects[index].gameObject;

            if (!object.hasOwnProperty('width') || object.parentContainer)
            {
                culledObjects.push(interactiveObjects[index]);
                continue;
            }

            var objectW = object.width;
            var objectH = object.height;
            var objectX = (object.x - (scrollX * object.scrollFactorX)) - (objectW * object.originX);
            var objectY = (object.y - (scrollY * object.scrollFactorY)) - (objectH * object.originY);
            var tx = (objectX * mva + objectY * mvc + mve);
            var ty = (objectX * mvb + objectY * mvd + mvf);
            var tw = ((objectX + objectW) * mva + (objectY + objectH) * mvc + mve);
            var th = ((objectX + objectW) * mvb + (objectY + objectH) * mvd + mvf);
            var cullW = cameraW + objectW;
            var cullH = cameraH + objectH;

            if (tx > -objectW || ty > -objectH || tx < cullW || ty < cullH ||
                tw > -objectW || th > -objectH || tw < cullW || th < cullH)
            {
                culledObjects.push(interactiveObjects[index]);
            }
        }

        return culledObjects;
    },

    /**
     * Fades the Camera in from the given color over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#fadeIn
     * @since 3.3.0
     *
     * @param {number} duration - The duration of the effect in milliseconds.
     * @param {function} [callback] - An optional callback to invoke when the fade completes. Will be sent one argument - a reference to this camera.
     * @param {number} [red=0] - The value to fade the red channel from. A value between 0 and 1.
     * @param {number} [green=0] - The value to fade the green channel from. A value between 0 and 1.
     * @param {number} [blue=0] - The value to fade the blue channel from. A value between 0 and 1.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    fadeIn: function (duration, callback, red, green, blue)
    {
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }

        return this.flash(duration, red, green, blue, true, callback);
    },

    /**
     * Fades the Camera out to the given color over the duration specified.
     * This is an alias for Camera.fade that forces the fade to start, regardless of existing fades.
     *
     * @method Phaser.Cameras.Scene2D.Camera#fadeOut
     * @since 3.3.0
     *
     * @param {number} duration - The duration of the effect in milliseconds.
     * @param {function} [callback] - An optional callback to invoke when the fade completes. Will be sent one argument - a reference to this camera.
     * @param {number} [red=0] - The value to fade the red channel from. A value between 0 and 1.
     * @param {number} [green=0] - The value to fade the green channel from. A value between 0 and 1.
     * @param {number} [blue=0] - The value to fade the blue channel from. A value between 0 and 1.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    fadeOut: function (duration, callback, red, green, blue)
    {
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }

        return this.fade(duration, red, green, blue, true, callback);
    },

    /**
     * Fades the Camera to the given color over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#fade
     * @since 3.0.0
     *
     * @param {number} duration - The duration of the effect in milliseconds.
     * @param {number} [red=0] - The value to fade the red channel to. A value between 0 and 1.
     * @param {number} [green=0] - The value to fade the green channel to. A value between 0 and 1.
     * @param {number} [blue=0] - The value to fade the blue channel to. A value between 0 and 1.
     * @param {boolean} [force=false] - Force the fade effect to start immediately, even if already running.
     * @param {function} [callback] - An optional callback to invoke when the fade completes. Will be sent one argument - a reference to this camera.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    fade: function (duration, red, green, blue, force, callback)
    {
        if (!duration) { duration = Number.MIN_VALUE; }
        if (red === undefined) { red = 0; }
        if (green === undefined) { green = 0; }
        if (blue === undefined) { blue = 0; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }

        if (!force && this._fadeAlpha > 0)
        {
            return this;
        }

        this._fadeRed = red;
        this._fadeGreen = green;
        this._fadeBlue = blue;
        this._fadeCallback = callback;
        this._fadeDuration = duration;
        this._fadeAlpha = Number.MIN_VALUE;

        return this;
    },

    /**
     * Flashes the Camera to the given color over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#flash
     * @since 3.0.0
     *
     * @param {number} duration - The duration of the effect in milliseconds.
     * @param {number} [red=1] - The value to flash the red channel to. A value between 0 and 1.
     * @param {number} [green=1] - The value to flash the green channel to. A value between 0 and 1.
     * @param {number} [blue=1] - The value to flash the blue channel to. A value between 0 and 1.
     * @param {boolean} [force=false] - Force the flash effect to start immediately, even if already running.
     * @param {function} [callback] - An optional callback to invoke when the flash completes. Will be sent one argument - a reference to this camera.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    flash: function (duration, red, green, blue, force, callback)
    {
        if (!duration) { duration = Number.MIN_VALUE; }
        if (red === undefined) { red = 1; }
        if (green === undefined) { green = 1; }
        if (blue === undefined) { blue = 1; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }

        if (!force && this._flashAlpha > 0)
        {
            return this;
        }

        this._flashRed = red;
        this._flashGreen = green;
        this._flashBlue = blue;
        this._flashCallback = callback;
        this._flashDuration = duration;
        this._flashAlpha = 1;

        return this;
    },

    /**
     * Shakes the Camera by the given intensity over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#shake
     * @since 3.0.0
     *
     * @param {number} duration - The duration of the effect in milliseconds.
     * @param {number} [intensity=0.05] - The intensity of the shake.
     * @param {boolean} [force=false] - Force the shake effect to start immediately, even if already running.
     * @param {function} [callback] - An optional callback to invoke when the shake completes. Will be sent one argument - a reference to this camera.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    shake: function (duration, intensity, force, callback)
    {
        if (!duration) { duration = Number.MIN_VALUE; }
        if (intensity === undefined) { intensity = 0.05; }
        if (force === undefined) { force = false; }
        if (callback === undefined) { callback = null; }

        if (!force && (this._shakeOffsetX !== 0 || this._shakeOffsetY !== 0))
        {
            return this;
        }

        this._shakeDuration = duration;
        this._shakeIntensity = intensity;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;
        this._shakeCallback = callback;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#getWorldPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {(object|Phaser.Math.Vector2)} [output] - [description]
     *
     * @return {Phaser.Math.Vector2} [description]
     */
    getWorldPoint: function (x, y, output)
    {
        if (output === undefined) { output = new Vector2(); }

        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];
        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];

        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            output.x = x;
            output.y = y;

            return output;
        }

        determinant = 1 / determinant;

        var ima = mvd * determinant;
        var imb = -mvb * determinant;
        var imc = -mvc * determinant;
        var imd = mva * determinant;
        var ime = (mvc * mvf - mvd * mve) * determinant;
        var imf = (mvb * mve - mva * mvf) * determinant;

        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);

        var zoom = this.zoom;

        var scrollX = this.scrollX;
        var scrollY = this.scrollY;

        var sx = x + ((scrollX * c - scrollY * s) * zoom);
        var sy = y + ((scrollX * s + scrollY * c) * zoom);

        /* Apply transform to point */
        output.x = (sx * ima + sy * imc + ime);
        output.y = (sx * imb + sy * imd + imf);

        return output;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#ignore
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObjectOrArray - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    ignore: function (gameObjectOrArray)
    {
        if (Array.isArray(gameObjectOrArray))
        {
            for (var index = 0; index < gameObjectOrArray.length; ++index)
            {
                gameObjectOrArray[index].cameraFilter |= this._id;
            }
        }
        else
        {
            gameObjectOrArray.cameraFilter |= this._id;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#preRender
     * @since 3.0.0
     *
     * @param {number} baseScale - [description]
     * @param {number} resolution - [description]
     *
     */
    preRender: function (baseScale, resolution)
    {
        var width = this.width;
        var height = this.height;
        var zoom = this.zoom * baseScale;
        var matrix = this.matrix;
        var originX = width / 2;
        var originY = height / 2;
        var follow = this._follow;

        if (follow !== null)
        {
            originX = follow.x;
            originY = follow.y;

            this.scrollX = (originX - width * 0.5) / zoom;
            this.scrollY = (originY - height * 0.5) / zoom;
        }

        if (this.useBounds)
        {
            var bounds = this._bounds;

            var bw = Math.max(0, bounds.right - width);
            var bh = Math.max(0, bounds.bottom - height);

            if (this.scrollX < bounds.x)
            {
                this.scrollX = bounds.x;
            }
            else if (this.scrollX > bw)
            {
                this.scrollX = bw;
            }

            if (this.scrollY < bounds.y)
            {
                this.scrollY = bounds.y;
            }
            else if (this.scrollY > bh)
            {
                this.scrollY = bh;
            }
        }

        if (this.roundPixels)
        {
            this.scrollX = Math.round(this.scrollX);
            this.scrollY = Math.round(this.scrollY);
        }

        matrix.loadIdentity();
        matrix.scale(resolution, resolution);
        matrix.translate(this.x + originX, this.y + originY);
        matrix.rotate(this.rotation);
        matrix.scale(zoom, zoom);
        matrix.translate(-originX, -originY);
        matrix.translate(this._shakeOffsetX, this._shakeOffsetY);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#removeBounds
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    removeBounds: function ()
    {
        this.useBounds = false;

        this._bounds.setEmpty();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setAngle
     * @since 3.0.0
     *
     * @param {number} [value=0] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setAngle: function (value)
    {
        if (value === undefined) { value = 0; }

        this.rotation = DegToRad(value);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setBackgroundColor
     * @since 3.0.0
     *
     * @param {(string|number|InputColorObject)} [color='rgba(0,0,0,0)'] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setBackgroundColor: function (color)
    {
        if (color === undefined) { color = 'rgba(0,0,0,0)'; }

        this.backgroundColor = ValueToColor(color);

        this.transparent = (this.backgroundColor.alpha === 0);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setBounds
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setBounds: function (x, y, width, height)
    {
        this._bounds.setTo(x, y, width, height);

        this.useBounds = true;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setName
     * @since 3.0.0
     *
     * @param {string} [value=''] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setName: function (value)
    {
        if (value === undefined) { value = ''; }

        this.name = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setPosition
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setRotation
     * @since 3.0.0
     *
     * @param {number} [value=0] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setRotation: function (value)
    {
        if (value === undefined) { value = 0; }

        this.rotation = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setRoundPixels
     * @since 3.0.0
     *
     * @param {boolean} value - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setRoundPixels: function (value)
    {
        this.roundPixels = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setScene
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setScene: function (scene)
    {
        this.scene = scene;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setScroll
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setScroll: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.scrollX = x;
        this.scrollY = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} [height=width] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setViewport
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setViewport: function (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#setZoom
     * @since 3.0.0
     *
     * @param {float} [value=1] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setZoom: function (value)
    {
        if (value === undefined) { value = 1; }

        this.zoom = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#startFollow
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|object)} target - [description]
     * @param {boolean} [roundPx=false] - [description]
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    startFollow: function (target, roundPx)
    {
        if (roundPx === undefined) { roundPx = false; }

        this._follow = target;

        this.roundPixels = roundPx;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#stopFollow
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    stopFollow: function ()
    {
        this._follow = null;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#toJSON
     * @since 3.0.0
     *
     * @return {JSONCamera} [description]
     */
    toJSON: function ()
    {
        var output = {
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            zoom: this.zoom,
            rotation: this.rotation,
            roundPixels: this.roundPixels,
            scrollX: this.scrollX,
            scrollY: this.scrollY,
            backgroundColor: this.backgroundColor.rgba
        };

        if (this.useBounds)
        {
            output['bounds'] = {
                x: this._bounds.x,
                y: this._bounds.y,
                width: this._bounds.width,
                height: this._bounds.height
            };
        }

        return output;
    },

    /**
     * Resets any active FX, such as a fade, flash or shake. Useful to call after a fade in order to
     * remove the fade.
     *
     * @method Phaser.Cameras.Scene2D.Camera#resetFX
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    resetFX: function ()
    {
        this._flashAlpha = 0;
        this._fadeAlpha = 0;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;
        this._shakeDuration = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#update
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        if (this._flashAlpha > 0)
        {
            this._flashAlpha -= delta / this._flashDuration;

            if (this._flashAlpha <= 0)
            {
                this._flashAlpha = 0;

                if (this._flashCallback)
                {
                    //  Do this in case the callback flashes again (otherwise we'd overwrite the new callback)
                    var flashCallback = this._flashCallback;

                    this._flashCallback = null;

                    flashCallback(this);
                }
            }
        }

        if (this._fadeAlpha > 0 && this._fadeAlpha < 1)
        {
            this._fadeAlpha += delta / this._fadeDuration;

            if (this._fadeAlpha >= 1)
            {
                this._fadeAlpha = 1;

                if (this._fadeCallback)
                {
                    //  Do this in case the callback fades again (otherwise we'd overwrite the new callback)
                    var fadeCallback = this._fadeCallback;

                    this._fadeCallback = null;

                    fadeCallback(this);
                }
            }
        }

        if (this._shakeDuration > 0)
        {
            var intensity = this._shakeIntensity;

            this._shakeDuration -= delta;

            if (this._shakeDuration <= 0)
            {
                this._shakeOffsetX = 0;
                this._shakeOffsetY = 0;

                if (this._shakeCallback)
                {
                    //  Do this in case the callback shakes again (otherwise we'd overwrite the new callback)
                    var shakeCallback = this._shakeCallback;

                    this._shakeCallback = null;

                    shakeCallback(this);
                }
            }
            else
            {
                this._shakeOffsetX = (Math.random() * intensity * this.width * 2 - intensity * this.width) * this.zoom;
                this._shakeOffsetY = (Math.random() * intensity * this.height * 2 - intensity * this.height) * this.zoom;

                if (this.roundPixels)
                {
                    this._shakeOffsetX |= 0;
                    this._shakeOffsetY |= 0;
                }
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Scene2D.Camera#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this._bounds = undefined;
        this.matrix = undefined;
        this.culledObjects = [];
        this.scene = undefined;
    }

});

module.exports = Camera;
