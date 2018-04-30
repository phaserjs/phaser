/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var EventEmitter = require('eventemitter3');
var Effects = require('./effects');
var Rectangle = require('../../geom/rectangle/Rectangle');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var ValueToColor = require('../../display/color/ValueToColor');
var Vector2 = require('../../math/Vector2');

/**
 * @typedef {object} JSONCameraBounds
 * @property {number} x - The horizontal position of camera
 * @property {number} y - The vertical position of camera
 * @property {number} width - The width size of camera
 * @property {number} height - The height size of camera
 */

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
 * @property {(JSONCameraBounds|undefined)} [bounds] - The bounds of camera
 */

/**
 * @classdesc
 * A Camera.
 *
 * The Camera is the way in which all games are rendered in Phaser. They provide a view into your game world,
 * and can be positioned, rotated, zoomed and scrolled accordingly.
 *
 * A Camera consists of two elements: The viewport and the scroll values.
 *
 * The viewport is the physical position and size of the Camera within your game. Cameras, by default, are
 * created the same size as your game, but their position and size can be set to anything. This means if you
 * wanted to create a camera that was 320x200 in size, positioned in the bottom-right corner of your game,
 * you'd adjust the viewport to do that (using methods like `setViewport` and `setSize`).
 *
 * If you wish to change where the Camera is looking in your game, then you scroll it. You can do this
 * via the properties `scrollX` and `scrollY` or the method `setScroll`. Scrolling has no impact on the
 * viewport, and changing the viewport has no impact on the scrolling.
 *
 * By default a Camera will render all Game Objects it can see. You can change this using the `ignore` method,
 * allowing you to filter Game Objects out on a per-Camera basis.
 *
 * A Camera also has built-in special effects including Fade, Flash and Camera Shake.
 *
 * @class Camera
 * @extends Phaser.Events.EventEmitter
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

    Extends: EventEmitter,

    initialize:

    function Camera (x, y, width, height)
    {
        EventEmitter.call(this);

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
         * The background color of this Camera. Only used if `transparent` is `false`.
         *
         * @name Phaser.Cameras.Scene2D.Camera#backgroundColor
         * @type {Phaser.Display.Color}
         * @since 3.0.0
         */
        this.backgroundColor = ValueToColor('rgba(0,0,0,0)');

        /**
         * The Camera Fade effect handler.
         * To fade this camera see the `Camera.fade` methods.
         *
         * @name Phaser.Cameras.Scene2D.Camera#fadeEffect
         * @type {Phaser.Cameras.Scene2D.Effects.Fade}
         * @since 3.5.0
         */
        this.fadeEffect = new Effects.Fade(this);

        /**
         * The Camera Flash effect handler.
         * To flash this camera see the `Camera.flash` method.
         *
         * @name Phaser.Cameras.Scene2D.Camera#flashEffect
         * @type {Phaser.Cameras.Scene2D.Effects.Flash}
         * @since 3.5.0
         */
        this.flashEffect = new Effects.Flash(this);

        /**
         * The Camera Shake effect handler.
         * To shake this camera see the `Camera.shake` method.
         *
         * @name Phaser.Cameras.Scene2D.Camera#shakeEffect
         * @type {Phaser.Cameras.Scene2D.Effects.Shake}
         * @since 3.5.0
         */
        this.shakeEffect = new Effects.Shake(this);

        /**
         * Should the camera cull Game Objects before checking them for input hit tests?
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
         * Internal follow target reference.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_follow
         * @type {?any}
         * @private
         * @default null
         * @since 3.0.0
         */
        this._follow = null;

        /**
         * Internal camera ID. Assigned by the Camera Manager and used in the camera pool.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_id
         * @type {integer}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._id = 0;
    },

    /**
     * Scrolls the Camera so that it is looking at the center of the Camera Bounds (if previously enabled)
     *
     * @method Phaser.Cameras.Scene2D.Camera#centerToBounds
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    centerToBounds: function ()
    {
        if (this.useBounds)
        {
            this.scrollX = (this._bounds.width * 0.5) - (this.width * 0.5);
            this.scrollY = (this._bounds.height * 0.5) - (this.height * 0.5);
        }

        return this;
    },

    /**
     * Scrolls the Camera so that it is re-centered based on its viewport size.
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
     * Takes an array of Game Objects and returns a new array featuring only those objects
     * visible by this camera.
     *
     * @method Phaser.Cameras.Scene2D.Camera#cull
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.GameObject[]} G - [renderableObjects,$return]
     *
     * @param {Phaser.GameObjects.GameObject[]} renderableObjects - An array of Game Objects to cull.
     *
     * @return {Phaser.GameObjects.GameObject[]} An array of Game Objects visible to this Camera.
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
     * Fades the Camera in from the given color over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#fadeIn
     * @since 3.3.0
     *
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {integer} [red=0] - The amount to fade the red channel towards. A value between 0 and 255.
     * @param {integer} [green=0] - The amount to fade the green channel towards. A value between 0 and 255.
     * @param {integer} [blue=0] - The amount to fade the blue channel towards. A value between 0 and 255.
     * @param {function} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    fadeIn: function (duration, red, green, blue, callback, context)
    {
        return this.fadeEffect.start(false, duration, red, green, blue, true, callback, context);
    },

    /**
     * Fades the Camera out to the given color over the duration specified.
     * This is an alias for Camera.fade that forces the fade to start, regardless of existing fades.
     *
     * @method Phaser.Cameras.Scene2D.Camera#fadeOut
     * @since 3.3.0
     *
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {integer} [red=0] - The amount to fade the red channel towards. A value between 0 and 255.
     * @param {integer} [green=0] - The amount to fade the green channel towards. A value between 0 and 255.
     * @param {integer} [blue=0] - The amount to fade the blue channel towards. A value between 0 and 255.
     * @param {function} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    fadeOut: function (duration, red, green, blue, callback, context)
    {
        return this.fadeEffect.start(true, duration, red, green, blue, true, callback, context);
    },

    /**
     * Fades the Camera from the given color to transparent over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#fadeFrom
     * @since 3.5.0
     *
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {integer} [red=0] - The amount to fade the red channel towards. A value between 0 and 255.
     * @param {integer} [green=0] - The amount to fade the green channel towards. A value between 0 and 255.
     * @param {integer} [blue=0] - The amount to fade the blue channel towards. A value between 0 and 255.
     * @param {boolean} [force=false] - Force the effect to start immediately, even if already running.
     * @param {function} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    fadeFrom: function (duration, red, green, blue, force, callback, context)
    {
        return this.fadeEffect.start(false, duration, red, green, blue, force, callback, context);
    },

    /**
     * Fades the Camera from transparent to the given color over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#fade
     * @since 3.0.0
     *
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {integer} [red=0] - The amount to fade the red channel towards. A value between 0 and 255.
     * @param {integer} [green=0] - The amount to fade the green channel towards. A value between 0 and 255.
     * @param {integer} [blue=0] - The amount to fade the blue channel towards. A value between 0 and 255.
     * @param {boolean} [force=false] - Force the effect to start immediately, even if already running.
     * @param {function} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    fade: function (duration, red, green, blue, force, callback, context)
    {
        return this.fadeEffect.start(true, duration, red, green, blue, force, callback, context);
    },

    /**
     * Flashes the Camera by setting it to the given color immediately and then fading it away again quickly over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#flash
     * @since 3.0.0
     *
     * @param {integer} [duration=250] - The duration of the effect in milliseconds.
     * @param {integer} [red=255] - The amount to fade the red channel towards. A value between 0 and 255.
     * @param {integer} [green=255] - The amount to fade the green channel towards. A value between 0 and 255.
     * @param {integer} [blue=255] - The amount to fade the blue channel towards. A value between 0 and 255.
     * @param {boolean} [force=false] - Force the effect to start immediately, even if already running.
     * @param {function} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    flash: function (duration, red, green, blue, force, callback, context)
    {
        return this.flashEffect.start(duration, red, green, blue, force, callback, context);
    },

    /**
     * Shakes the Camera by the given intensity over the duration specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#shake
     * @since 3.0.0
     *
     * @param {integer} [duration=100] - The duration of the effect in milliseconds.
     * @param {number} [intensity=0.05] - The intensity of the shake.
     * @param {boolean} [force=false] - Force the shake effect to start immediately, even if already running.
     * @param {function} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    shake: function (duration, intensity, force, callback, context)
    {
        return this.shakeEffect.start(duration, intensity, force, callback, context);
    },

    /**
     * Converts the given `x` and `y` coordinates into World space, based on this Cameras transform.
     * You can optionally provide a Vector2, or similar object, to store the results in.
     *
     * @method Phaser.Cameras.Scene2D.Camera#getWorldPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {number} x - The x position to convert to world space.
     * @param {number} y - The y position to convert to world space.
     * @param {(object|Phaser.Math.Vector2)} [output] - An optional object to store the results in. If not provided a new Vector2 will be created.
     *
     * @return {Phaser.Math.Vector2} An object holding the converted values in its `x` and `y` properties.
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
     * Given a Game Object, or an array of Game Objects, it will update all of their camera filter settings
     * so that they are ignored by this Camera. This means they will not be rendered by this Camera.
     *
     * @method Phaser.Cameras.Scene2D.Camera#ignore
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObject - The Game Object, or array of Game Objects, to be ignored by this Camera.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    ignore: function (gameObject)
    {
        var id = this._id;

        if (Array.isArray(gameObject))
        {
            for (var i = 0; i < gameObject.length; i++)
            {
                gameObject[i].cameraFilter |= id;
            }
        }
        else
        {
            gameObject.cameraFilter |= id;
        }

        return this;
    },

    /**
     * Internal preRender step.
     *
     * @method Phaser.Cameras.Scene2D.Camera#preRender
     * @protected
     * @since 3.0.0
     *
     * @param {number} baseScale - The base scale, as set in the Camera Manager.
     * @param {number} resolution - The game resolution.
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

        this.shakeEffect.preRender();
    },

    /**
     * If this Camera has previously had movement bounds set on it, this will remove them.
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
     * Set the rotation of this Camera. This causes everything it renders to appear rotated.
     * 
     * Rotating a camera does not rotate the viewport itself, it is applied during rendering.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setAngle
     * @since 3.0.0
     *
     * @param {number} [value=0] - The cameras angle of rotation, given in degrees.
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
     * Sets the background color for this Camera.
     * 
     * By default a Camera has a transparent background but it can be given a solid color, with any level
     * of transparency, via this method.
     *
     * The color value can be specified using CSS color notation, hex or numbers.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setBackgroundColor
     * @since 3.0.0
     *
     * @param {(string|number|InputColorObject)} [color='rgba(0,0,0,0)'] - The color value. In CSS, hex or numeric color notation.
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
     * Set the world bounds for this Camera.
     *
     * A Camera bounds controls where the camera can scroll to within the world. It does not limit
     * rendering of the camera, or placement of the viewport within your game.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setBounds
     * @since 3.0.0
     *
     * @param {integer} x - The top-left x coordinate of the bounds.
     * @param {integer} y - The top-left y coordinate of the bounds.
     * @param {integer} width - The width of the bounds, in pixels.
     * @param {integer} height - The height of the bounds, in pixels.
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
     * Sets the name of this Camera.
     * This value is for your own use and isn't used internally.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setName
     * @since 3.0.0
     *
     * @param {string} [value=''] - The name of the Camera.
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
     * Set the position of the Camera viewport within the game.
     * 
     * This does not change where the camera is 'looking'. See `setScroll` to control that.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setPosition
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the Camera viewport.
     * @param {number} [y=x] - The top-left y coordinate of the Camera viewport.
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
     * Set the rotation of this Camera. This causes everything it renders to appear rotated.
     * 
     * Rotating a camera does not rotate the viewport itself, it is applied during rendering.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setRotation
     * @since 3.0.0
     *
     * @param {number} [value=0] - The rotation of the Camera, in radians.
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
     * Should the Camera round pixel values to whole integers when scrolling?
     * In some types of game this is required to prevent sub-pixel aliasing.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setRoundPixels
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to round Camera pixels, `false` to not.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setRoundPixels: function (value)
    {
        this.roundPixels = value;

        return this;
    },

    /**
     * Sets the Scene the Camera is bound to.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setScene
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene the camera is bound to.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setScene: function (scene)
    {
        this.scene = scene;

        return this;
    },

    /**
     * Set the position of where the Camera is looking within the game.
     * You can also modify the properties `Camera.scrollX` and `Camera.scrollY` directly.
     * Use this method, or the scroll properties, to move your camera around the game world.
     * 
     * This does not change where the camera viewport is placed. See `setPosition` to control that.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setScroll
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the Camera in the game world.
     * @param {number} [y=x] - The y coordinate of the Camera in the game world.
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
     * Set the size of the Camera viewport.
     *
     * By default a Camera is the same size as the game, but can be made smaller via this method,
     * allowing you to create mini-cam style effects by creating and positioning a smaller Camera
     * viewport within your game.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setSize
     * @since 3.0.0
     *
     * @param {integer} width - The width of the Camera viewport.
     * @param {integer} [height=width] - The height of the Camera viewport.
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
     * This method sets the position and size of the Camera viewport in a single call.
     *
     * If you're trying to change where the Camera is looking at in your game, then see
     * the method `Camera.setScroll` instead. This method is for changing the viewport
     * itself, not what the camera can see.
     * 
     * By default a Camera is the same size as the game, but can be made smaller via this method,
     * allowing you to create mini-cam style effects by creating and positioning a smaller Camera
     * viewport within your game.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setViewport
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the Camera viewport.
     * @param {number} y - The top-left y coordinate of the Camera viewport.
     * @param {integer} width - The width of the Camera viewport.
     * @param {integer} [height=width] - The height of the Camera viewport.
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
     * Set the zoom value of the Camera.
     *
     * Changing to a smaller value, such as 0.5, will cause the camera to 'zoom out'.
     * Changing to a larger value, such as 2, will cause the camera to 'zoom in'.
     *
     * A value of 1 means 'no zoom' and is the default.
     *
     * Changing the zoom does not impact the Camera viewport in any way, it is only applied during rendering.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setZoom
     * @since 3.0.0
     *
     * @param {float} [value=1] - The zoom value of the Camera.
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
     * Sets the Camera to follow a Game Object.
     *
     * When enabled the Camera will automatically adjust its scroll position to keep the target Game Object
     * in its center.
     *
     * @method Phaser.Cameras.Scene2D.Camera#startFollow
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|object)} target - The target for the Camera to follow.
     * @param {boolean} [roundPx=false] - Round the movement pixels to whole integers?
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
     * Stops a Camera from following a Game Object, if previously set via `Camera.startFollow`.
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
     * Returns an Object suitable for JSON storage containing all of the Camera viewport and rendering properties.
     *
     * @method Phaser.Cameras.Scene2D.Camera#toJSON
     * @since 3.0.0
     *
     * @return {JSONCamera} A well-formed object suitable for conversion to JSON.
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
        this.shakeEffect.reset();
        this.flashEffect.reset();
        this.fadeEffect.reset();

        return this;
    },

    /**
     * Internal method called automatically by the Camera Manager.
     *
     * @method Phaser.Cameras.Scene2D.Camera#update
     * @protected
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function (time, delta)
    {
        this.shakeEffect.update(time, delta);
        this.flashEffect.update(time, delta);
        this.fadeEffect.update(time, delta);
    },

    /**
     * This event is fired when a camera is destroyed by the Camera Manager.
     *
     * @event CameraDestroyEvent
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that was destroyed.
     */

    /**
     * Destroys this Camera instance. You rarely need to call this directly.
     *
     * Called by the Camera Manager. If you wish to destroy a Camera please use `CameraManager.remove` as
     * cameras are stored in a pool, ready for recycling later, and calling this directly will prevent that.
     *
     * @method Phaser.Cameras.Scene2D.Camera#destroy
     * @fires CameraDestroyEvent
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.emit('cameradestroy', this);

        this.removeAllListeners();

        this.resetFX();

        this.matrix.destroy();

        this.culledObjects = [];

        this.target = undefined;

        this._bounds = undefined;

        this.scene = undefined;
    }

});

module.exports = Camera;
