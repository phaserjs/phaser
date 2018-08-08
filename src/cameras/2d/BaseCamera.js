/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var DegToRad = require('../../math/DegToRad');
var EventEmitter = require('eventemitter3');
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
 * A Base Camera class.
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
 * The Base Camera is extended by the Camera class, which adds in special effects including Fade,
 * Flash and Camera Shake, as well as the ability to follow Game Objects.
 * 
 * The Base Camera was introduced in Phaser 3.12. It was split off from the Camera class, to allow
 * you to isolate special effects as needed. Therefore the 'since' values for properties of this class relate
 * to when they were added to the Camera class.
 *
 * @class BaseCamera
 * @memberOf Phaser.Cameras.Scene2D
 * @constructor
 * @since 3.12.0
 * 
 * @extends Phaser.Events.EventEmitter
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {number} x - The x position of the Camera, relative to the top-left of the game canvas.
 * @param {number} y - The y position of the Camera, relative to the top-left of the game canvas.
 * @param {number} width - The width of the Camera, in pixels.
 * @param {number} height - The height of the Camera, in pixels.
 */
var BaseCamera = new Class({

    Extends: EventEmitter,

    Mixins: [
        Components.Alpha,
        Components.Visible
    ],

    initialize:

    function BaseCamera (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = 0; }

        EventEmitter.call(this);

        /**
         * A reference to the Scene this camera belongs to.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene;

        /**
         * A reference to the Game Scene Manager.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#sceneManager
         * @type {Phaser.Scenes.SceneManager}
         * @since 3.12.0
         */
        this.sceneManager;

        /**
         * A reference to the Game Config.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#config
         * @type {object}
         * @readOnly
         * @since 3.12.0
         */
        this.config;

        /**
         * The Camera ID. Assigned by the Camera Manager and used to handle camera exclusion.
         * This value is a bitmask.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#id
         * @type {integer}
         * @readOnly
         * @since 3.11.0
         */
        this.id = 0;

        /**
         * The name of the Camera. This is left empty for your own use.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * The resolution of the Game, used in most Camera calculations.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#resolution
         * @type {number}
         * @readOnly
         * @since 3.12.0
         */
        this.resolution = 1;

        /**
         * Should this camera round its pixel values to integers?
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#roundPixels
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#visible
         * @type {boolean}
         * @default true
         * @since 3.10.0
        this.visible = true;
         */

        /**
         * Is this Camera using a bounds to restrict scrolling movement?
         *
         * Set this property along with the bounds via `Camera.setBounds`.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#useBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.useBounds = false;

        /**
         * The World View is a Rectangle that defines the area of the 'world' the Camera is currently looking at.
         * This factors in the Camera viewport size, zoom and scroll position and is updated in the Camera preRender step.
         * If you have enabled Camera bounds the worldview will be clamped to those bounds accordingly.
         * You can use it for culling or intersection checks.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#worldView
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#dirty
         * @type {boolean}
         * @default true
         * @since 3.11.0
         */
        this.dirty = true;

        /**
         * The x position of the Camera viewport, relative to the top-left of the game canvas.
         * The viewport is the area into which the camera renders.
         * To adjust the position the camera is looking at in the game world, see the `scrollX` value.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#x
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._x = x;

        /**
         * The y position of the Camera, relative to the top-left of the game canvas.
         * The viewport is the area into which the camera renders.
         * To adjust the position the camera is looking at in the game world, see the `scrollY` value.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#y
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._y = y;

        /**
         * Internal Camera X value multiplied by the resolution.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#_cx
         * @type {number}
         * @private
         * @since 3.12.0
         */
        this._cx = 0;

        /**
         * Internal Camera Y value multiplied by the resolution.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#_cy
         * @type {number}
         * @private
         * @since 3.12.0
         */
        this._cy = 0;

        /**
         * Internal Camera Width value multiplied by the resolution.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#_cw
         * @type {number}
         * @private
         * @since 3.12.0
         */
        this._cw = 0;

        /**
         * Internal Camera Height value multiplied by the resolution.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#_ch
         * @type {number}
         * @private
         * @since 3.12.0
         */
        this._ch = 0;

        /**
         * The width of the Camera viewport, in pixels.
         *
         * The viewport is the area into which the Camera renders. Setting the viewport does
         * not restrict where the Camera can scroll to.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#_width
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#_height
         * @type {number}
         * @private
         * @since 3.11.0
         */
        this._height = height;

        /**
         * The bounds the camera is restrained to during scrolling.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#_bounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.0.0
         */
        this._bounds = new Rectangle();

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
         * @name Phaser.Cameras.Scene2D.BaseCamera#_scrollX
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#_scrollY
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#_zoom
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#_rotation
         * @type {number}
         * @private
         * @default 0
         * @since 3.11.0
         */
        this._rotation = 0;

        /**
         * A local transform matrix used for internal calculations.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#matrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.0.0
         */
        this.matrix = new TransformMatrix();

        /**
         * Does this Camera have a transparent background?
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#transparent
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.transparent = true;

        /**
         * The background color of this Camera. Only used if `transparent` is `false`.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#backgroundColor
         * @type {Phaser.Display.Color}
         * @since 3.0.0
         */
        this.backgroundColor = ValueToColor('rgba(0,0,0,0)');

        /**
         * The Camera alpha value. Setting this property impacts every single object that this Camera
         * renders. You can either set the property directly, i.e. via a Tween, to fade a Camera in or out,
         * or via the chainable `setAlpha` method instead.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#alpha
         * @type {number}
         * @default 1
         * @since 3.11.0
        this.alpha = 1;
         */

        /**
         * Should the camera cull Game Objects before checking them for input hit tests?
         * In some special cases it may be beneficial to disable this.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#disableCull
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.disableCull = false;

        /**
         * A temporary array of culled objects.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#culledObjects
         * @type {Phaser.GameObjects.GameObject[]}
         * @default []
         * @private
         * @since 3.0.0
         */
        this.culledObjects = [];

        /**
         * The mid-point of the Camera in 'world' coordinates.
         *
         * Use it to obtain exactly where in the world the center of the camera is currently looking.
         *
         * This value is updated in the preRender method, after the scroll values and follower
         * have been processed.
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#midPoint
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#originX
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
         * @name Phaser.Cameras.Scene2D.BaseCamera#originY
         * @type {number}
         * @default 0.5
         * @since 3.11.0
         */
        this.originY = 0.5;

        /**
         * Does this Camera have a custom viewport?
         *
         * @name Phaser.Cameras.Scene2D.BaseCamera#_customViewport
         * @type {boolean}
         * @private
         * @default false
         * @since 3.12.0
         */
        this._customViewport = false;
    },

    /**
     * Set the Alpha level of this Camera. The alpha controls the opacity of the Camera as it renders.
     * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setAlpha
     * @since 3.11.0
     *
     * @param {number} [value=1] - The Camera alpha value.
     *
     * @return {this} This Camera instance.
    setAlpha: function (value)
    {
        if (value === undefined) { value = 1; }

        this.alpha = value;

        return this;
    },
     */

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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setOrigin
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
     * Calculates what the Camera.scrollX and scrollY values would need to be in order to move
     * the Camera so it is centered on the given x and y coordinates, without actually moving
     * the Camera there. The results are clamped based on the Camera bounds, if set.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#getScroll
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerOn
     * @since 3.11.0
     *
     * @param {number} x - The horizontal coordinate to center on.
     * @param {number} y - The vertical coordinate to center on.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerToBounds
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#centerToSize
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#cull
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
     * Converts the given `x` and `y` coordinates into World space, based on this Cameras transform.
     * You can optionally provide a Vector2, or similar object, to store the results in.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#getWorldPoint
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

        var res = this.resolution;

        var sx = x * res + ((scrollX * c - scrollY * s) * zoom);
        var sy = y * res + ((scrollX * s + scrollY * c) * zoom);

        /* Apply transform to point */
        output.x = (sx * ima + sy * imc + ime);
        output.y = (sx * imb + sy * imd + imf);

        return output;
    },

    /**
     * Given a Game Object, or an array of Game Objects, it will update all of their camera filter settings
     * so that they are ignored by this Camera. This means they will not be rendered by this Camera.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#ignore
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]|Phaser.GameObjects.Group)} entries - The Game Object, or array of Game Objects, to be ignored by this Camera.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
     */
    ignore: function (entries)
    {
        var id = this.id;

        if (!Array.isArray(entries))
        {
            entries = [ entries ];
        }

        for (var i = 0; i < entries.length; i++)
        {
            var entry = entries[i];

            if (Array.isArray(entry))
            {
                this.ignore(entry);
            }
            else if (entry.isParent)
            {
                this.ignore(entry.getChildren());
            }
            else
            {
                entry.cameraFilter |= id;
            }
        }

        return this;
    },

    /**
     * Internal preRender step.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#preRender
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

        var sx = this.scrollX;
        var sy = this.scrollY;

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
    },

    /**
     * Takes an x value and checks it's within the range of the Camera bounds, adjusting if required.
     * Do not call this method if you are not using camera bounds.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#clampX
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#clampY
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#removeBounds
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setAngle
     * @since 3.0.0
     *
     * @param {number} [value=0] - The cameras angle of rotation, given in degrees.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setBackgroundColor
     * @since 3.0.0
     *
     * @param {(string|number|InputColorObject)} [color='rgba(0,0,0,0)'] - The color value. In CSS, hex or numeric color notation.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setBounds
     * @since 3.0.0
     *
     * @param {integer} x - The top-left x coordinate of the bounds.
     * @param {integer} y - The top-left y coordinate of the bounds.
     * @param {integer} width - The width of the bounds, in pixels.
     * @param {integer} height - The height of the bounds, in pixels.
     * @param {boolean} [centerOn] - If `true` the Camera will automatically be centered on the new bounds.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setName
     * @since 3.0.0
     *
     * @param {string} [value=''] - The name of the Camera.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setPosition
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the Camera viewport.
     * @param {number} [y=x] - The top-left y coordinate of the Camera viewport.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setRotation
     * @since 3.0.0
     *
     * @param {number} [value=0] - The rotation of the Camera, in radians.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setRoundPixels
     * @since 3.0.0
     *
     * @param {boolean} value - `true` to round Camera pixels, `false` to not.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
     */
    setRoundPixels: function (value)
    {
        this.roundPixels = value;

        return this;
    },

    /**
     * Sets the Scene the Camera is bound to.
     * 
     * Also populates the `resolution` property and updates the internal size values.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setScene
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene the camera is bound to.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
     */
    setScene: function (scene)
    {
        this.scene = scene;

        this.config = scene.sys.game.config;
        this.sceneManager = scene.sys.game.scene;

        var res = this.config.resolution;

        this.resolution = res;

        this._cx = this._x * res;
        this._cy = this._y * res;
        this._cw = this._width * res;
        this._ch = this._height * res;

        return this;
    },

    /**
     * Set the position of where the Camera is looking within the game.
     * You can also modify the properties `Camera.scrollX` and `Camera.scrollY` directly.
     * Use this method, or the scroll properties, to move your camera around the game world.
     *
     * This does not change where the camera viewport is placed. See `setPosition` to control that.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#setScroll
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the Camera in the game world.
     * @param {number} [y=x] - The y coordinate of the Camera in the game world.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setSize
     * @since 3.0.0
     *
     * @param {integer} width - The width of the Camera viewport.
     * @param {integer} [height=width] - The height of the Camera viewport.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setViewport
     * @since 3.0.0
     *
     * @param {number} x - The top-left x coordinate of the Camera viewport.
     * @param {number} y - The top-left y coordinate of the Camera viewport.
     * @param {integer} width - The width of the Camera viewport.
     * @param {integer} [height=width] - The height of the Camera viewport.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setZoom
     * @since 3.0.0
     *
     * @param {number} [value=1] - The zoom value of the Camera. The minimum it can be is 0.001.
     *
     * @return {Phaser.Cameras.Scene2D.BaseCamera} This Camera instance.
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
     * @method Phaser.Cameras.Scene2D.BaseCamera#setVisible
     * @since 3.10.0
     *
     * @param {boolean} value - The visible state of the Camera.
     *
     * @return {this} This Camera instance.
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },
     */

    /**
     * Returns an Object suitable for JSON storage containing all of the Camera viewport and rendering properties.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#toJSON
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
     * Internal method called automatically by the Camera Manager.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#update
     * @protected
     * @since 3.0.0
     *
     * @param {integer} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    update: function ()
    {
        //  NOOP
    },

    /**
     * Internal method called automatically when the viewport changes.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#updateSystem
     * @private
     * @since 3.12.0
     */
    updateSystem: function ()
    {
        if (!this.config)
        {
            return;
        }

        var custom = false;

        if (this._x !== 0 || this._y !== 0)
        {
            custom = true;
        }
        else
        {
            var gameWidth = this.config.width;
            var gameHeight = this.config.height;

            if (gameWidth !== this._width || gameHeight !== this._height)
            {
                custom = true;
            }
        }

        var sceneManager = this.sceneManager;

        if (custom && !this._customViewport)
        {
            //  We need a custom viewport for this Camera
            sceneManager.customViewports++;
        }
        else if (!custom && this._customViewport)
        {
            //  We're turning off a custom viewport for this Camera
            sceneManager.customViewports--;
        }

        this.dirty = true;
        this._customViewport = custom;
    },

    /**
     * This event is fired when a camera is destroyed by the Camera Manager.
     *
     * @event CameraDestroyEvent
     * @param {Phaser.Cameras.Scene2D.BaseCamera} camera - The camera that was destroyed.
     */

    /**
     * Destroys this Camera instance. You rarely need to call this directly.
     *
     * Called by the Camera Manager. If you wish to destroy a Camera please use `CameraManager.remove` as
     * cameras are stored in a pool, ready for recycling later, and calling this directly will prevent that.
     *
     * @method Phaser.Cameras.Scene2D.BaseCamera#destroy
     * @fires CameraDestroyEvent
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.emit('cameradestroy', this);

        this.removeAllListeners();

        this.matrix.destroy();

        this.culledObjects = [];

        if (this._customViewport)
        {
            //  We're turning off a custom viewport for this Camera
            this.sceneManager.customViewports--;
        }

        this._bounds = null;

        this.scene = null;
        this.config = null;
        this.sceneManager = null;
    },

    /**
     * The x position of the Camera viewport, relative to the top-left of the game canvas.
     * The viewport is the area into which the camera renders.
     * To adjust the position the camera is looking at in the game world, see the `scrollX` value.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            this._x = value;
            this._cx = value * this.resolution;
            this.updateSystem();
        }

    },

    /**
     * The y position of the Camera viewport, relative to the top-left of the game canvas.
     * The viewport is the area into which the camera renders.
     * To adjust the position the camera is looking at in the game world, see the `scrollY` value.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            this._y = value;
            this._cy = value * this.resolution;
            this.updateSystem();
        }

    },

    /**
     * The width of the Camera viewport, in pixels.
     *
     * The viewport is the area into which the Camera renders. Setting the viewport does
     * not restrict where the Camera can scroll to.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#width
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
            this._cw = value * this.resolution;
            this.updateSystem();
        }

    },

    /**
     * The height of the Camera viewport, in pixels.
     *
     * The viewport is the area into which the Camera renders. Setting the viewport does
     * not restrict where the Camera can scroll to.
     *
     * @name Phaser.Cameras.Scene2D.BaseCamera#height
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
            this._ch = value * this.resolution;
            this.updateSystem();
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#scrollX
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#scrollY
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#zoom
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#rotation
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#centerX
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#centerY
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#displayWidth
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
     * @name Phaser.Cameras.Scene2D.BaseCamera#displayHeight
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

module.exports = BaseCamera;
