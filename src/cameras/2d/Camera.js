/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CenterOn = require('../../geom/rectangle/CenterOn');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var Effects = require('./effects');
var EventEmitter = require('eventemitter3');
var Linear = require('../../math/Linear');
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
         * The Camera ID. Assigned by the Camera Manager and used to handle camera exclusion.
         * This value is a bitmask.
         *
         * @name Phaser.Cameras.Scene2D.Camera#id
         * @type {integer}
         * @readOnly
         * @since 3.11.0
         */
        this.id = 0;

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
         * The x position of the Camera viewport, relative to the top-left of the game canvas.
         * The viewport is the area into which the camera renders.
         * To adjust the position the camera is looking at in the game world, see the `scrollX` value.
         *
         * @name Phaser.Cameras.Scene2D.Camera#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y position of the Camera, relative to the top-left of the game canvas.
         * The viewport is the area into which the camera renders.
         * To adjust the position the camera is looking at in the game world, see the `scrollY` value.
         *
         * @name Phaser.Cameras.Scene2D.Camera#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The width of the Camera viewport, in pixels.
         *
         * The viewport is the area into which the Camera renders. Setting the viewport does
         * not restrict where the Camera can scroll to.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_width
         * @type {number}
         * @private
         * @since 3.11.0
         */
        this._width = width;

        /**
         * The height of the Camera viewport, in pixels.
         *
         * The viewport is the area into which the Camera renders. Setting the viewport does
         * not restrict where the Camera can scroll to.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_height
         * @type {number}
         * @private
         * @since 3.11.0
         */
        this._height = height;

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
         * Is this Camera visible or not?
         *
         * A visible camera will render and perform input tests.
         * An invisible camera will not render anything and will skip input tests.
         *
         * @name Phaser.Cameras.Scene2D.Camera#visible
         * @type {boolean}
         * @default true
         * @since 3.10.0
         */
        this.visible = true;

        /**
         * Is this Camera using a bounds to restrict scrolling movement?
         *
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
         * The World View is a Rectangle that defines the area of the 'world' the Camera is currently looking at.
         * This factors in the Camera viewport size, zoom and scroll position and is updated in the Camera preRender step.
         * If you have enabled Camera bounds the worldview will be clamped to those bounds accordingly.
         * You can use it for culling or intersection checks.
         *
         * @name Phaser.Cameras.Scene2D.Camera#worldView
         * @type {Phaser.Geom.Rectangle}
         * @readOnly
         * @since 3.11.0
         */
        this.worldView = new Rectangle();

        /**
         * Is this Camera dirty?
         * 
         * A dirty Camera has had either its viewport size, bounds, scroll, rotation or zoom levels changed since the last frame.
         * 
         * This flag is cleared during the `postRenderCamera` method of the renderer.
         *
         * @name Phaser.Cameras.Scene2D.Camera#dirty
         * @type {boolean}
         * @default true
         * @since 3.11.0
         */
        this.dirty = true;

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
         * The horizontal scroll position of this Camera.
         *
         * Change this value to cause the Camera to scroll around your Scene.
         *
         * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
         * will automatically adjust the Camera scroll values accordingly.
         *
         * You can set the bounds within which the Camera can scroll via the `setBounds` method.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_scrollX
         * @type {number}
         * @private
         * @default 0
         * @since 3.11.0
         */
        this._scrollX = 0;

        /**
         * The vertical scroll position of this Camera.
         *
         * Change this value to cause the Camera to scroll around your Scene.
         *
         * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
         * will automatically adjust the Camera scroll values accordingly.
         *
         * You can set the bounds within which the Camera can scroll via the `setBounds` method.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_scrollY
         * @type {number}
         * @private
         * @default 0
         * @since 3.11.0
         */
        this._scrollY = 0;

        /**
         * The Camera zoom value. Change this value to zoom in, or out of, a Scene.
         *
         * A value of 0.5 would zoom the Camera out, so you can now see twice as much
         * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
         * now takes up 2 pixels when rendered.
         *
         * Set to 1 to return to the default zoom level.
         *
         * Be careful to never set this value to zero.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_zoom
         * @type {number}
         * @private
         * @default 1
         * @since 3.11.0
         */
        this._zoom = 1;

        /**
         * The rotation of the Camera in radians.
         *
         * Camera rotation always takes place based on the Camera viewport. By default, rotation happens
         * in the center of the viewport. You can adjust this with the `originX` and `originY` properties.
         *
         * Rotation influences the rendering of _all_ Game Objects visible by this Camera. However, it does not
         * rotate the Camera viewport itself, which always remains an axis-aligned rectangle.
         *
         * @name Phaser.Cameras.Scene2D.Camera#_rotation
         * @type {number}
         * @private
         * @default 0
         * @since 3.11.0
         */
        this._rotation = 0;

        /**
         * A local transform matrix used for internal calculations.
         *
         * @name Phaser.Cameras.Scene2D.Camera#matrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.0.0
         */
        this.matrix = new TransformMatrix();

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
         * The Camera alpha value. Setting this property impacts every single object that this Camera
         * renders. You can either set the property directly, i.e. via a Tween, to fade a Camera in or out,
         * or via the chainable `setAlpha` method instead.
         *
         * @name Phaser.Cameras.Scene2D.Camera#alpha
         * @type {number}
         * @default 1
         * @since 3.11.0
         */
        this.alpha = 1;

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
         * @private
         * @since 3.0.0
         */
        this.culledObjects = [];

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
         * The mid-point of the Camera in 'world' coordinates.
         *
         * Use it to obtain exactly where in the world the center of the camera is currently looking.
         *
         * This value is updated in the preRender method, after the scroll values and follower
         * have been processed.
         *
         * @name Phaser.Cameras.Scene2D.Camera#midPoint
         * @type {Phaser.Math.Vector2}
         * @readOnly
         * @since 3.11.0
         */
        this.midPoint = new Vector2(width / 2, height / 2);

        /**
         * The horizontal origin of rotation for this Camera.
         *
         * By default the camera rotates around the center of the viewport.
         *
         * Changing the origin allows you to adjust the point in the viewport from which rotation happens.
         * A value of 0 would rotate from the top-left of the viewport. A value of 1 from the bottom right.
         *
         * See `setOrigin` to set both origins in a single, chainable call.
         *
         * @name Phaser.Cameras.Scene2D.Camera#originX
         * @type {number}
         * @default 0.5
         * @since 3.11.0
         */
        this.originX = 0.5;

        /**
         * The vertical origin of rotation for this Camera.
         *
         * By default the camera rotates around the center of the viewport.
         *
         * Changing the origin allows you to adjust the point in the viewport from which rotation happens.
         * A value of 0 would rotate from the top-left of the viewport. A value of 1 from the bottom right.
         *
         * See `setOrigin` to set both origins in a single, chainable call.
         *
         * @name Phaser.Cameras.Scene2D.Camera#originY
         * @type {number}
         * @default 0.5
         * @since 3.11.0
         */
        this.originY = 0.5;

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
    },

    /**
     * Set the Alpha level of this Camera. The alpha controls the opacity of the Camera as it renders.
     * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
     *
     * @method Phaser.GameObjects.Components.Origin#setAlpha
     * @since 3.11.0
     *
     * @param {number} [value=1] - The Camera alpha value.
     *
     * @return {this} This Camera instance.
     */
    setAlpha: function (value)
    {
        if (value === undefined) { value = 1; }

        this.alpha = value;

        return this;
    },

    /**
     * Sets the rotation origin of this Camera.
     *
     * The values are given in the range 0 to 1 and are only used when calculating Camera rotation.
     *
     * By default the camera rotates around the center of the viewport.
     *
     * Changing the origin allows you to adjust the point in the viewport from which rotation happens.
     * A value of 0 would rotate from the top-left of the viewport. A value of 1 from the bottom right.
     *
     * @method Phaser.GameObjects.Components.Origin#setOrigin
     * @since 3.11.0
     *
     * @param {number} [x=0.5] - The horizontal origin value.
     * @param {number} [y=x] - The vertical origin value. If not defined it will be set to the value of `x`.
     *
     * @return {this} This Camera instance.
     */
    setOrigin: function (x, y)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this.originX = x;
        this.originY = y;

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
     * Calculates what the Camera.scrollX and scrollY values would need to be in order to move
     * the Camera so it is centered on the given x and y coordinates, without actually moving
     * the Camera there. The results are clamped based on the Camera bounds, if set.
     *
     * @method Phaser.Cameras.Scene2D.Camera#getScroll
     * @since 3.11.0
     *
     * @param {number} x - The horizontal coordinate to center on.
     * @param {number} y - The vertical coordinate to center on.
     * @param {Phaser.Math.Vector2} [out] - A Vec2 to store the values in. If not given a new Vec2 is created.
     *
     * @return {Phaser.Math.Vector2} The scroll coordinates stored in the `x` abd `y` properties.
     */
    getScroll: function (x, y, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var originX = this.width * 0.5;
        var originY = this.height * 0.5;

        out.x = x - originX;
        out.y = y - originY;

        if (this.useBounds)
        {
            out.x = this.clampX(out.x);
            out.y = this.clampY(out.y);
        }

        return out;
    },

    /**
     * Moves the Camera so that it is centered on the given coordinates, bounds allowing.
     *
     * @method Phaser.Cameras.Scene2D.Camera#centerOn
     * @since 3.11.0
     *
     * @param {number} x - The horizontal coordinate to center on.
     * @param {number} y - The vertical coordinate to center on.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    centerOn: function (x, y)
    {
        var originX = this.width * 0.5;
        var originY = this.height * 0.5;

        this.midPoint.set(x, y);

        this.scrollX = x - originX;
        this.scrollY = y - originY;

        if (this.useBounds)
        {
            this.scrollX = this.clampX(this.scrollX);
            this.scrollY = this.clampY(this.scrollY);
        }

        return this;
    },

    /**
     * Moves the Camera so that it is looking at the center of the Camera Bounds, if enabled.
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
            var bounds = this._bounds;
            var originX = this.width * 0.5;
            var originY = this.height * 0.5;

            this.midPoint.set(bounds.centerX, bounds.centerY);

            this.scrollX = bounds.centerX - originX;
            this.scrollY = bounds.centerY - originY;
        }

        return this;
    },

    /**
     * Moves the Camera so that it is re-centered based on its viewport size.
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

            if (tx > -objectW && ty > -objectH && tx < cullW && ty < cullH &&
                tw > -objectW && th > -objectH && tw < cullW && th < cullH)
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
        var id = this.id;

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
     * Takes an x value and checks it's within the range of the Camera bounds, adjusting if required.
     * Do not call this method if you are not using camera bounds.
     *
     * @method Phaser.Cameras.Scene2D.Camera#clampX
     * @since 3.11.0
     *
     * @param {number} x - The value to horizontally scroll clamp.
     *
     * @return {number} The adjusted value to use as scrollX.
     */
    clampX: function (x)
    {
        var bounds = this._bounds;

        var dw = this.displayWidth;

        var bx = bounds.x + ((dw - this.width) / 2);
        var bw = Math.max(bx, bx + bounds.width - dw);

        if (x < bx)
        {
            x = bx;
        }
        else if (x > bw)
        {
            x = bw;
        }

        return x;
    },

    /**
     * Takes a y value and checks it's within the range of the Camera bounds, adjusting if required.
     * Do not call this method if you are not using camera bounds.
     *
     * @method Phaser.Cameras.Scene2D.Camera#clampY
     * @since 3.11.0
     *
     * @param {number} y - The value to vertically scroll clamp.
     *
     * @return {number} The adjusted value to use as scrollY.
     */
    clampY: function (y)
    {
        var bounds = this._bounds;

        var dh = this.displayHeight;

        var by = bounds.y + ((dh - this.height) / 2);
        var bh = Math.max(by, by + bounds.height - dh);

        if (y < by)
        {
            y = by;
        }
        else if (y > bh)
        {
            y = bh;
        }

        return y;
    },

    /*
        var gap = this._zoomInversed;
        return gap * Math.round((src.x - this.scrollX * src.scrollFactorX) / gap);
    */

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

        this.dirty = true;

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
     * Set the bounds of the Camera. The bounds are an axis-aligned rectangle.
     * 
     * The Camera bounds controls where the Camera can scroll to, stopping it from scrolling off the
     * edges and into blank space. It does not limit the placement of Game Objects, or where
     * the Camera viewport can be positioned.
     * 
     * Temporarily disable the bounds by changing the boolean `Camera.useBounds`.
     * 
     * Clear the bounds entirely by calling `Camera.removeBounds`.
     * 
     * If you set bounds that are smaller than the viewport it will stop the Camera from being
     * able to scroll. The bounds can be positioned where-ever you wish. By default they are from
     * 0x0 to the canvas width x height. This means that the coordinate 0x0 is the top left of
     * the Camera bounds. However, you can position them anywhere. So if you wanted a game world
     * that was 2048x2048 in size, with 0x0 being the center of it, you can set the bounds x/y
     * to be -1024, -1024, with a width and height of 2048. Depending on your game you may find
     * it easier for 0x0 to be the top-left of the bounds, or you may wish 0x0 to be the middle.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setBounds
     * @since 3.0.0
     *
     * @param {integer} x - The top-left x coordinate of the bounds.
     * @param {integer} y - The top-left y coordinate of the bounds.
     * @param {integer} width - The width of the bounds, in pixels.
     * @param {integer} height - The height of the bounds, in pixels.
     * @param {boolean} [centerOn] - If `true` the Camera will automatically be centered on the new bounds.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setBounds: function (x, y, width, height, centerOn)
    {
        this._bounds.setTo(x, y, width, height);

        this.dirty = true;
        this.useBounds = true;

        if (centerOn)
        {
            this.centerToBounds();
        }
        else
        {
            this.scrollX = this.clampX(this.scrollX);
            this.scrollY = this.clampY(this.scrollY);
        }

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
     * Should the Camera round pixel values to whole integers when rendering Game Objects?
     * 
     * In some types of game, especially with pixel art, this is required to prevent sub-pixel aliasing.
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
     * @param {number} [value=1] - The zoom value of the Camera. The minimum it can be is 0.001.
     *
     * @return {Phaser.Cameras.Scene2D.Camera} This Camera instance.
     */
    setZoom: function (value)
    {
        if (value === undefined) { value = 1; }

        if (value === 0)
        {
            value = 0.001;
        }

        this.zoom = value;

        return this;
    },

    /**
     * Sets the visibility of this Camera.
     *
     * An invisible Camera will skip rendering and input tests of everything it can see.
     *
     * @method Phaser.Cameras.Scene2D.Camera#setVisible
     * @since 3.10.0
     *
     * @param {boolean} value - The visible state of the Camera.
     *
     * @return {this} This Camera instance.
     */
    setVisible: function (value)
    {
        this.visible = value;

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

        this._follow = null;
        this._bounds = null;
        this.scene = null;
        this.deadzone = null;
    },

    /**
     * The width of the Camera viewport, in pixels.
     *
     * The viewport is the area into which the Camera renders. Setting the viewport does
     * not restrict where the Camera can scroll to.
     *
     * @name Phaser.Cameras.Scene2D.Camera#width
     * @type {number}
     * @since 3.0.0
     */
    width: {

        get: function ()
        {
            return this._width;
        },

        set: function (value)
        {
            this._width = value;
            this.dirty = true;
        }

    },

    /**
     * The height of the Camera viewport, in pixels.
     *
     * The viewport is the area into which the Camera renders. Setting the viewport does
     * not restrict where the Camera can scroll to.
     *
     * @name Phaser.Cameras.Scene2D.Camera#height
     * @type {number}
     * @since 3.0.0
     */
    height: {

        get: function ()
        {
            return this._height;
        },

        set: function (value)
        {
            this._height = value;
            this.dirty = true;
        }

    },

    /**
     * The horizontal scroll position of this Camera.
     *
     * Change this value to cause the Camera to scroll around your Scene.
     *
     * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
     * will automatically adjust the Camera scroll values accordingly.
     *
     * You can set the bounds within which the Camera can scroll via the `setBounds` method.
     *
     * @name Phaser.Cameras.Scene2D.Camera#scrollX
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    scrollX: {

        get: function ()
        {
            return this._scrollX;
        },

        set: function (value)
        {
            this._scrollX = value;
            this.dirty = true;
        }

    },

    /**
     * The vertical scroll position of this Camera.
     *
     * Change this value to cause the Camera to scroll around your Scene.
     *
     * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
     * will automatically adjust the Camera scroll values accordingly.
     *
     * You can set the bounds within which the Camera can scroll via the `setBounds` method.
     *
     * @name Phaser.Cameras.Scene2D.Camera#scrollY
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    scrollY: {

        get: function ()
        {
            return this._scrollY;
        },

        set: function (value)
        {
            this._scrollY = value;
            this.dirty = true;
        }

    },

    /**
     * The Camera zoom value. Change this value to zoom in, or out of, a Scene.
     *
     * A value of 0.5 would zoom the Camera out, so you can now see twice as much
     * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
     * now takes up 2 pixels when rendered.
     *
     * Set to 1 to return to the default zoom level.
     *
     * Be careful to never set this value to zero.
     *
     * @name Phaser.Cameras.Scene2D.Camera#zoom
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    zoom: {

        get: function ()
        {
            return this._zoom;
        },

        set: function (value)
        {
            this._zoom = value;
            this.dirty = true;
        }

    },

    /**
     * The rotation of the Camera in radians.
     *
     * Camera rotation always takes place based on the Camera viewport. By default, rotation happens
     * in the center of the viewport. You can adjust this with the `originX` and `originY` properties.
     *
     * Rotation influences the rendering of _all_ Game Objects visible by this Camera. However, it does not
     * rotate the Camera viewport itself, which always remains an axis-aligned rectangle.
     *
     * @name Phaser.Cameras.Scene2D.Camera#rotation
     * @type {number}
     * @private
     * @default 0
     * @since 3.11.0
     */
    rotation: {

        get: function ()
        {
            return this._rotation;
        },

        set: function (value)
        {
            this._rotation = value;
            this.dirty = true;
        }

    },

    /**
     * The x position of the center of the Camera's viewport, relative to the top-left of the game canvas.
     *
     * @name Phaser.Cameras.Scene2D.Camera#centerX
     * @type {number}
     * @readOnly
     * @since 3.10.0
     */
    centerX: {

        get: function ()
        {
            return this.x + (0.5 * this.width);
        }

    },

    /**
     * The y position of the center of the Camera's viewport, relative to the top-left of the game canvas.
     *
     * @name Phaser.Cameras.Scene2D.Camera#centerY
     * @type {number}
     * @readOnly
     * @since 3.10.0
     */
    centerY: {

        get: function ()
        {
            return this.y + (0.5 * this.height);
        }

    },

    /**
     * The displayed width of the camera viewport, factoring in the camera zoom level.
     *
     * If a camera has a viewport width of 800 and a zoom of 0.5 then its display width
     * would be 1600, as it's displaying twice as many pixels as zoom level 1.
     *
     * Equally, a camera with a width of 800 and zoom of 2 would have a display width
     * of 400 pixels.
     *
     * @name Phaser.Cameras.Scene2D.Camera#displayWidth
     * @type {number}
     * @readOnly
     * @since 3.11.0
     */
    displayWidth: {

        get: function ()
        {
            return this.width / this.zoom;
        }

    },

    /**
     * The displayed height of the camera viewport, factoring in the camera zoom level.
     *
     * If a camera has a viewport height of 600 and a zoom of 0.5 then its display height
     * would be 1200, as it's displaying twice as many pixels as zoom level 1.
     *
     * Equally, a camera with a height of 600 and zoom of 2 would have a display height
     * of 300 pixels.
     *
     * @name Phaser.Cameras.Scene2D.Camera#displayHeight
     * @type {number}
     * @readOnly
     * @since 3.11.0
     */
    displayHeight: {

        get: function ()
        {
            return this.height / this.zoom;
        }

    }

});

module.exports = Camera;
