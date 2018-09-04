/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BaseCamera = require('./BaseCamera');
var CanvasPool = require('../../display/canvas/CanvasPool');
var CenterOn = require('../../geom/rectangle/CenterOn');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var Effects = require('./effects');
var Linear = require('../../math/Linear');
var Rectangle = require('../../geom/rectangle/Rectangle');
var Vector2 = require('../../math/Vector2');

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
 * @memberOf Phaser.Cameras.Scene2D
 * @constructor
 * @since 3.0.0
 * 
 * @extends Phaser.Cameras.Scene2D.BaseCamera
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.Tint
 *
 * @param {number} x - The x position of the Camera, relative to the top-left of the game canvas.
 * @param {number} y - The y position of the Camera, relative to the top-left of the game canvas.
 * @param {number} width - The width of the Camera, in pixels.
 * @param {number} height - The height of the Camera, in pixels.
 */
var Camera = new Class({

    Extends: BaseCamera,

    Mixins: [
        Components.Flip,
        Components.Tint
    ],

    initialize:

    function Camera (x, y, width, height)
    {
        BaseCamera.call(this, x, y, width, height);

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
         * The Camera Pan effect handler.
         * To pan this camera see the `Camera.pan` method.
         *
         * @name Phaser.Cameras.Scene2D.Camera#panEffect
         * @type {Phaser.Cameras.Scene2D.Effects.Pan}
         * @since 3.11.0
         */
        this.panEffect = new Effects.Pan(this);

        /**
         * The Camera Zoom effect handler.
         * To zoom this camera see the `Camera.zoom` method.
         *
         * @name Phaser.Cameras.Scene2D.Camera#zoomEffect
         * @type {Phaser.Cameras.Scene2D.Effects.Zoom}
         * @since 3.11.0
         */
        this.zoomEffect = new Effects.Zoom(this);

        /**
         * The linear interpolation value to use when following a target.
         *
         * Can also be set via `setLerp` or as part of the `startFollow` call.
         *
         * The default values of 1 means the camera will instantly snap to the target coordinates.
         * A lower value, such as 0.1 means the camera will more slowly track the target, giving
         * a smooth transition. You can set the horizontal and vertical values independently, and also
         * adjust this value in real-time during your game.
         *
         * Be sure to keep the value between 0 and 1. A value of zero will disable tracking on that axis.
         *
         * @name Phaser.Cameras.Scene2D.Camera#lerp
         * @type {Phaser.Math.Vector2}
         * @since 3.9.0
         */
        this.lerp = new Vector2(1, 1);

        /**
         * The values stored in this property are subtracted from the Camera targets position, allowing you to
         * offset the camera from the actual target x/y coordinates by this amount.
         * Can also be set via `setFollowOffset` or as part of the `startFollow` call.
         *
         * @name Phaser.Cameras.Scene2D.Camera#followOffset
         * @type {Phaser.Math.Vector2}
         * @since 3.9.0
         */
        this.followOffset = new Vector2();

        /**
         * The Camera dead zone.
         *
         * The deadzone is only used when the camera is following a target.
         *
         * It defines a rectangular region within which if the target is present, the camera will not scroll.
         * If the target moves outside of this area, the camera will begin scrolling in order to follow it.
         *
         * The `lerp` values that you can set for a follower target also apply when using a deadzone.
         *
         * You can directly set this property to be an instance of a Rectangle. Or, you can use the
         * `setDeadzone` method for a chainable approach.
         *
         * The rectangle you provide can have its dimensions adjusted dynamically, however, please
         * note that its position is updated every frame, as it is constantly re-centered on the cameras mid point.
         *
         * Calling `setDeadzone` with no arguments will reset an active deadzone, as will setting this property
         * to `null`.
         *
         * @name Phaser.Cameras.Scene2D.Camera#deadzone
         * @type {?Phaser.Geom.Rectangle}
         * @since 3.11.0
         */
        this.deadzone = null;

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
         * Is this Camera rendering directly or to a texture?
         * 
         * Warning: This is an experimental feature.
         *
         * @name Phaser.Cameras.Scene2D.Camera#renderToTexture
         * @type {boolean}
         * @default false
         * @private
         * @since 3.12.0-EXPERIMENTAL
         */
        this.renderToTexture = false;

        /**
         * The HTML Canvas Element that the Camera is drawing to if rendering to a texture.
         * This is only populated if Phaser is running with the Canvas Renderer.
         * 
         * Warning: This is an experimental feature.
         *
         * @name Phaser.Cameras.Scene2D.Camera#canvas
         * @type {HTMLCanvasElement}
         * @private
         * @since 3.12.0-EXPERIMENTAL
         */
        this.canvas = null;

        /**
         * A reference to the Rendering Context belonging to the Canvas Element this Camera is rendering to a texture.
         * 
         * Warning: This is an experimental feature.
         *
         * @name Phaser.Cameras.Scene2D.Camera#context
         * @type {CanvasRenderingContext2D}
         * @private
         * @since 3.12.0-EXPERIMENTAL
         */
        this.context = null;

        /**
         * A reference to the GL Frame Buffer this Camera ia drawing to if rendering to a texture.
         * This is only set if Phaser is running with the WebGL Renderer.
         * 
         * Warning: This is an experimental feature.
         *
         * @name Phaser.Cameras.Scene2D.Camera#framebuffer
         * @type {?WebGLFramebuffer}
         * @private
         * @since 3.12.0-EXPERIMENTAL
         */
        this.glTexture = null;

        /**
         * A reference to the GL Frame Buffer this Camera is drawing to if rendering to a texture.
         * This is only set if Phaser is running with the WebGL Renderer.
         * 
         * Warning: This is an experimental feature.
         *
         * @name Phaser.Cameras.Scene2D.Camera#framebuffer
         * @type {?WebGLFramebuffer}
         * @private
         * @since 3.12.0-EXPERIMENTAL
         */
        this.framebuffer = null;

        /**
         * A reference to the GL Frame Buffer this Render Texture is drawing to.
         * This is only set if Phaser is running with the WebGL Renderer.
         * 
         * Warning: This is an experimental feature.
         *
         * @name Phaser.Cameras.Scene2D.Camera#pipeline
         * @type {any}
         * @private
         * @since 3.12.0-EXPERIMENTAL
         */
        this.pipeline = null;
    },

    /**
     * Sets the Camera to render to a texture instead of to the main display.
     * 
     * Make sure that you resize the camera first if you're going to use this feature.
     * 
     * This is an experimental feature and should be expected to change in the future.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setRenderToTexture
     * @since 3.12.0-EXPERIMENTAL
     *
     * @param {any} [pipeline] - An optional WebGL Pipeline to render with.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setRenderToTexture: function (pipeline)
    {
        var renderer = this.scene.sys.game.renderer;

        if (renderer.gl)
        {
            this.glTexture = renderer.createTextureFromSource(null, this.width, this.height, 0);
            this.framebuffer = renderer.createFramebuffer(this.width, this.height, this.glTexture, false);
        }
        else
        {
            this.canvas = CanvasPool.create2D(this, this.width, this.height);
            this.context = this.canvas.getContext('2d');
        }

        this.renderToTexture = true;

        if (pipeline)
        {
            this.pipeline = pipeline;
        }

        return this;
    },

    /**
     * Sets the Camera dead zone.
     *
     * The deadzone is only used when the camera is following a target.
     *
     * It defines a rectangular region within which if the target is present, the camera will not scroll.
     * If the target moves outside of this area, the camera will begin scrolling in order to follow it.
     *
     * The deadzone rectangle is re-positioned every frame so that it is centered on the mid-point
     * of the camera. This allows you to use the object for additional game related checks, such as
     * testing if an object is within it or not via a Rectangle.contains call.
     *
     * The `lerp` values that you can set for a follower target also apply when using a deadzone.
     *
     * Calling this method with no arguments will reset an active deadzone.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setDeadzone
     * @since 3.11.0
     *
     * @param {number} [width] - The width of the deadzone rectangle in pixels. If not specified the deadzone is removed.
     * @param {number} [height] - The height of the deadzone rectangle in pixels.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setDeadzone: function (width, height)
    {
        if (width === undefined)
        {
            this.deadzone = null;
        }
        else
        {
            if (this.deadzone)
            {
                this.deadzone.width = width;
                this.deadzone.height = height;
            }
            else
            {
                this.deadzone = new Rectangle(0, 0, width, height);
            }

            if (this._follow)
            {
                var originX = this.width / 2;
                var originY = this.height / 2;

                var fx = this._follow.x - this.followOffset.x;
                var fy = this._follow.y - this.followOffset.y;

                this.midPoint.set(fx, fy);

                this.scrollX = fx - originX;
                this.scrollY = fy - originY;
            }

            CenterOn(this.deadzone, this.midPoint.x, this.midPoint.y);
        }

        return this;
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
     * This effect will scroll the Camera so that the center of its viewport finishes at the given destination,
     * over the duration and with the ease specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#pan
     * @since 3.11.0
     *
     * @param {number} x - The destination x coordinate to scroll the center of the Camera viewport to.
     * @param {number} y - The destination y coordinate to scroll the center of the Camera viewport to.
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {(string|function)} [ease='Linear'] - The ease to use for the pan. Can be any of the Phaser Easing constants or a custom function.
     * @param {boolean} [force=false] - Force the shake effect to start immediately, even if already running.
     * @param {CameraPanCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent four arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
     * the current camera scroll x coordinate and the current camera scroll y coordinate.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    pan: function (x, y, duration, ease, force, callback, context)
    {
        return this.panEffect.start(x, y, duration, ease, force, callback, context);
    },

    /**
     * This effect will zoom the Camera to the given scale, over the duration and with the ease specified.
     *
     * @method Phaser.Cameras.Scene2D.Camera#zoomTo
     * @since 3.11.0
     *
     * @param {number} zoom - The target Camera zoom value.
     * @param {integer} [duration=1000] - The duration of the effect in milliseconds.
     * @param {(string|function)} [ease='Linear'] - The ease to use for the pan. Can be any of the Phaser Easing constants or a custom function.
     * @param {boolean} [force=false] - Force the shake effect to start immediately, even if already running.
     * @param {CameraPanCallback} [callback] - This callback will be invoked every frame for the duration of the effect.
     * It is sent four arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
     * the current camera scroll x coordinate and the current camera scroll y coordinate.
     * @param {any} [context] - The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    zoomTo: function (zoom, duration, ease, force, callback, context)
    {
        return this.zoomEffect.start(zoom, duration, ease, force, callback, context);
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

        var halfWidth = width * 0.5;
        var halfHeight = height * 0.5;

        var zoom = this.zoom * baseScale;
        var matrix = this.matrix;

        var originX = width * this.originX;
        var originY = height * this.originY;

        var follow = this._follow;
        var deadzone = this.deadzone;

        var sx = this.scrollX;
        var sy = this.scrollY;

        if (deadzone)
        {
            CenterOn(deadzone, this.midPoint.x, this.midPoint.y);
        }

        if (follow)
        {
            var fx = (follow.x - this.followOffset.x);
            var fy = (follow.y - this.followOffset.y);

            if (deadzone)
            {
                if (fx < deadzone.x)
                {
                    sx = Linear(sx, sx - (deadzone.x - fx), this.lerp.x);
                }
                else if (fx > deadzone.right)
                {
                    sx = Linear(sx, sx + (fx - deadzone.right), this.lerp.x);
                }

                if (fy < deadzone.y)
                {
                    sy = Linear(sy, sy - (deadzone.y - fy), this.lerp.y);
                }
                else if (fy > deadzone.bottom)
                {
                    sy = Linear(sy, sy + (fy - deadzone.bottom), this.lerp.y);
                }
            }
            else
            {
                sx = Linear(sx, fx - originX, this.lerp.x);
                sy = Linear(sy, fy - originY, this.lerp.y);
            }
        }

        if (this.useBounds)
        {
            sx = this.clampX(sx);
            sy = this.clampY(sy);
        }

        if (this.roundPixels)
        {
            originX = Math.round(originX);
            originY = Math.round(originY);
        }

        //  Values are in pixels and not impacted by zooming the Camera
        this.scrollX = sx;
        this.scrollY = sy;

        var midX = sx + halfWidth;
        var midY = sy + halfHeight;

        //  The center of the camera, in world space, so taking zoom into account
        //  Basically the pixel value of what it's looking at in the middle of the cam
        this.midPoint.set(midX, midY);

        var displayWidth = width / zoom;
        var displayHeight = height / zoom;

        this.worldView.setTo(
            midX - (displayWidth / 2),
            midY - (displayHeight / 2),
            displayWidth,
            displayHeight
        );

        matrix.loadIdentity();
        matrix.scale(resolution, resolution);
        matrix.translate(this.x + originX, this.y + originY);
        matrix.rotate(this.rotation);
        matrix.scale(zoom, zoom);
        matrix.translate(-originX, -originY);

        this.shakeEffect.preRender();
    },

    /**
     * Sets the linear interpolation value to use when following a target.
     *
     * The default values of 1 means the camera will instantly snap to the target coordinates.
     * A lower value, such as 0.1 means the camera will more slowly track the target, giving
     * a smooth transition. You can set the horizontal and vertical values independently, and also
     * adjust this value in real-time during your game.
     *
     * Be sure to keep the value between 0 and 1. A value of zero will disable tracking on that axis.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setLerp
     * @since 3.9.0
     *
     * @param {number} [x=1] - The amount added to the horizontal linear interpolation of the follow target.
     * @param {number} [y=1] - The amount added to the vertical linear interpolation of the follow target.
     *
     * @return {this} This Camera instance.
     */
    setLerp: function (x, y)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this.lerp.set(x, y);

        return this;
    },

    /**
     * Sets the horizontal and vertical offset of the camera from its follow target.
     * The values are subtracted from the targets position during the Cameras update step.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setFollowOffset
     * @since 3.9.0
     *
     * @param {number} [x=0] - The horizontal offset from the camera follow target.x position.
     * @param {number} [y=0] - The vertical offset from the camera follow target.y position.
     *
     * @return {this} This Camera instance.
     */
    setFollowOffset: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        this.followOffset.set(x, y);

        return this;
    },

    /**
     * Sets the Camera to follow a Game Object.
     *
     * When enabled the Camera will automatically adjust its scroll position to keep the target Game Object
     * in its center.
     *
     * You can set the linear interpolation value used in the follow code.
     * Use low lerp values (such as 0.1) to automatically smooth the camera motion.
     *
     * If you find you're getting a slight "jitter" effect when following an object it's probably to do with sub-pixel
     * rendering of the targets position. This can be rounded by setting the `roundPixels` argument to `true` to
     * force full pixel rounding rendering. Note that this can still be broken if you have specified a non-integer zoom
     * value on the camera. So be sure to keep the camera zoom to integers.
     *
     * @method Phaser.Cameras.Scene2D.Camera#startFollow
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|object)} target - The target for the Camera to follow.
     * @param {boolean} [roundPixels=false] - Round the camera position to whole integers to avoid sub-pixel rendering?
     * @param {number} [lerpX=1] - A value between 0 and 1. This value specifies the amount of linear interpolation to use when horizontally tracking the target. The closer the value to 1, the faster the camera will track.
     * @param {number} [lerpY=1] - A value between 0 and 1. This value specifies the amount of linear interpolation to use when vertically tracking the target. The closer the value to 1, the faster the camera will track.
     * @param {number} [offsetX=0] - The horizontal offset from the camera follow target.x position.
     * @param {number} [offsetY=0] - The vertical offset from the camera follow target.y position.
     *
     * @return {this} This Camera instance.
     */
    startFollow: function (target, roundPixels, lerpX, lerpY, offsetX, offsetY)
    {
        if (roundPixels === undefined) { roundPixels = false; }
        if (lerpX === undefined) { lerpX = 1; }
        if (lerpY === undefined) { lerpY = lerpX; }
        if (offsetX === undefined) { offsetX = 0; }
        if (offsetY === undefined) { offsetY = offsetX; }

        this._follow = target;

        this.roundPixels = roundPixels;

        lerpX = Clamp(lerpX, 0, 1);
        lerpY = Clamp(lerpY, 0, 1);

        this.lerp.set(lerpX, lerpY);

        this.followOffset.set(offsetX, offsetY);

        var originX = this.width / 2;
        var originY = this.height / 2;

        var fx = target.x - offsetX;
        var fy = target.y - offsetY;

        this.midPoint.set(fx, fy);

        this.scrollX = fx - originX;
        this.scrollY = fy - originY;

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
        this.panEffect.reset();
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
        if (this.visible)
        {
            this.panEffect.update(time, delta);
            this.zoomEffect.update(time, delta);
            this.shakeEffect.update(time, delta);
            this.flashEffect.update(time, delta);
            this.fadeEffect.update(time, delta);
        }
    },

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
        BaseCamera.prototype.destroy.call(this);

        this.resetFX();

        this._follow = null;
        this.deadzone = null;
    }

});

module.exports = Camera;
