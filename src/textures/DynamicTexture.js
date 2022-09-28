/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../renderer/BlendModes');
var Camera = require('../cameras/2d/BaseCamera');
var CanvasPool = require('../display/canvas/CanvasPool');
var Class = require('../utils/Class');
var CONST = require('../const');
var PIPELINES = require('../renderer/webgl/pipelines/const');
var Frame = require('./Frame');
var Image = require('../gameobjects/image/Image');
var Rectangle = require('../geom/rectangle/Rectangle');
var RenderTarget = require('../renderer/webgl/RenderTarget');
var Texture = require('./Texture');
var Utils = require('../renderer/webgl/Utils');

/**
 * @classdesc
 * A Dynamic Texture is a special texture that allows any number of Game Objects to be drawn to it.
 *
 * You can take many complex objects and draw them to this one texture, which can then be used as the
 * base texture for other Game Objects, such as Sprites. Should you then update this texture, all
 * Game Objects using it will instantly be updated as well, reflecting the changes immediately.
 *
 * It's a powerful way to generate dynamic textures at run-time that are WebGL friendly and don't invoke
 * expensive GPU uploads on each change.
 *
 * Under WebGL, a FrameBuffer, which is what this Dynamic Texture uses internally, cannot be anti-aliased.
 * This means that when drawing objects such as Shapes or Graphics instances to this texture, they may appear
 * to be drawn with no aliasing around the edges. This is a technical limitation of WebGL. To get around it,
 * create your shape as a texture in an art package, then draw that to this texture.
 *
 * Based on the assumption that you will be using this Dynamic Texture as a source for Sprites, it will
 * automatically invert any drawing done to it on the y axis. If you do not require this, please call the
 * `setIsSpriteTexture()` method and pass it `false` as its parameter. Do this before you start drawing
 * to this texture, otherwise you will get vertically inverted frames under WebGL. This isn't required
 * for Canvas.
 *
 * @class DynamicTexture
 * @extends Phaser.Textures.Texture
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Textures.TextureManager} manager - A reference to the Texture Manager this Texture belongs to.
 * @param {string} key - The unique string-based key of this Texture.
 * @param {number} [width=256] - The width of this Dymamic Texture in pixels. Defaults to 256 x 256.
 * @param {number} [height=256] - The height of this Dymamic Texture in pixels. Defaults to 256 x 256.
 */
var DynamicTexture = new Class({

    Extends: Texture,

    initialize:

    function DynamicTexture (manager, key, width, height)
    {
        if (width === undefined) { width = 256; }
        if (height === undefined) { height = 256; }

        /**
         * The internal data type of this object.
         *
         * @name Phaser.Textures.DynamicTexture#type
         * @type {string}
         * @readonly
         * @since 3.60.0
         */
        this.type = 'DynamicTexture';

        var renderer = manager.game.renderer;

        var isCanvas = (renderer && renderer.type === CONST.CANVAS);

        var source = (isCanvas) ? CanvasPool.create2D(this, width, height) : [ this ];

        Texture.call(this, manager, key, source, width, height);

        /**
         * A reference to either the Canvas or WebGL Renderer that the Game instance is using.
         *
         * @name Phaser.Textures.DynamicTexture#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.2.0
         */
        this.renderer = renderer;

        /**
         * A reference to the global System Scene.
         *
         * @name Phaser.Textures.DynamicTexture#scene
         * @type {Phaser.Scenes.Scene}
         * @since 3.60.0
         */
        this.scene = manager.game.scene.systemScene;

        /**
         * A reference to the BASE Frame in this Texture.
         *
         * @name Phaser.Textures.DynamicTexture#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.60.0
         */
        this.frame = this.add('__BASE', 0, 0, 0, width, height);

        /**
         * Internal Image Game Object used as a Stamp within this Render Texture.
         *
         * @name Phaser.Textures.DynamicTexture#stamp
         * @type {Phaser.GameObjects.Image}
         * @since 3.60.0
         */
        this.stamp = new Image(this.scene).setOrigin(0);

        /**
         * This flag is set to 'true' during `beginDraw` and reset to 'false` in `endDraw`,
         * allowing you to determine if this Render Texture is batch drawing, or not.
         *
         * @name Phaser.Textures.DynamicTexture#isDrawing
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isDrawing = false;

        /**
         * A reference to the Rendering Context belonging to the Canvas Element this Render Texture is drawing to.
         *
         * @name Phaser.Textures.DynamicTexture#canvas
         * @type {HTMLCanvasElement}
         * @since 3.2.0
         */
        this.canvas = (isCanvas) ? source : null;

        /**
         * The 2D Canvas Rendering Context.
         *
         * @name Phaser.Textures.CanvasTexture#context
         * @readonly
         * @type {CanvasRenderingContext2D}
         * @since 3.7.0
         */
        this.context = (isCanvas) ? source.getContext('2d') : null;

        /**
         * Is this Render Texture dirty or not? If not it won't spend time clearing or filling itself.
         *
         * @name Phaser.Textures.DynamicTexture#dirty
         * @type {boolean}
         * @since 3.12.0
         */
        this.dirty = false;

        /**
         * The internal crop Rectangle, as used by the Stamp when it needs to crop itself.
         *
         * @name Phaser.Textures.DynamicTexture#_stampCrop
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.60.0
         */
        this._stampCrop = new Rectangle();

        /**
         * Is this Render Texture being used as the base texture for a Sprite Game Object?
         *
         * To enable this, call `RenderTexture.setIsSpriteTexture(true)`.
         *
         * You should do this _before_ drawing to this RenderTexture, so that it correctly
         * inverses the frames for WebGL rendering. Not doing so will result in inverted frames.
         *
         * This property is used in the `endDraw` method.
         *
         * @name Phaser.Textures.DynamicTexture#isSpriteTexture
         * @type {boolean}
         * @since 3.60.0
         */
        this.isSpriteTexture = true;

        /**
         * Internal erase mode flag.
         *
         * @name Phaser.Textures.DynamicTexture#_eraseMode
         * @type {boolean}
         * @private
         * @since 3.16.0
         */
        this._eraseMode = false;

        /**
         * An internal Camera that can be used to move around the Render Texture.
         * Control it just like you would any Scene Camera. The difference is that it only impacts the placement of what
         * is drawn to the Render Texture. You can scroll, zoom and rotate this Camera.
         *
         * @name Phaser.Textures.DynamicTexture#camera
         * @type {Phaser.Cameras.Scene2D.BaseCamera}
         * @since 3.12.0
         */
        this.camera = new Camera(0, 0, width, height).setScene(this.scene);

        /**
         * The Render Target that belongs to this Render Texture.
         *
         * A Render Target encapsulates a framebuffer and texture for the WebGL Renderer.
         *
         * This property remains `null` under Canvas.
         *
         * @name Phaser.Textures.DynamicTexture#renderTarget
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.renderTarget = (!isCanvas) ? new RenderTarget(renderer, width, height, 1, 0, false) : null;

        /**
         * A reference to the WebGL Single Pipeline.
         *
         * This property remains `null` under Canvas.
         *
         * @name Phaser.Textures.DynamicTexture#pipeline
         * @type {Phaser.Renderer.WebGL.Pipelines.SinglePipeline}
         * @since 3.60.0
         */
        this.pipeline = (!isCanvas) ? renderer.pipelines.get(PIPELINES.SINGLE_PIPELINE) : null;

        this.setSize(width, height);
    },

    /**
     * Resizes the Render Texture to the new dimensions given.
     *
     * If Render Texture was created from specific frame, only the size of the frame will be changed. The size of the source
     * texture will not change.
     *
     * If Render Texture was not created from specific frame, the following will happen:
     *
     * In WebGL it will destroy and then re-create the frame buffer being used by the Render Texture.
     * In Canvas it will resize the underlying canvas element.
     *
     * Both approaches will erase everything currently drawn to the Render Texture.
     *
     * If the dimensions given are the same as those already being used, calling this method will do nothing.
     *
     * @method Phaser.Textures.DynamicTexture#setSize
     * @since 3.10.0
     *
     * @param {number} width - The new width of the Render Texture.
     * @param {number} [height=width] - The new height of the Render Texture. If not specified, will be set the same as the `width`.
     *
     * @return {this} This Render Texture.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        var frame = this.frame;
        var source = frame.source;

        if (width !== this.width || height !== this.height)
        {
            if (this.canvas)
            {
                this.canvas.width = width;
                this.canvas.height = height;
            }

            var renderTarget = this.renderTarget;

            if (renderTarget)
            {
                renderTarget.resize(width, height);

                frame.glTexture = renderTarget.texture;

                source.isRenderTexture = true;
                source.isGLTexture = true;
                source.glTexture = renderTarget.texture;
                source.glTexture.flipY = true;
            }

            this.camera.setSize(width, height);

            source.width = width;
            source.height = height;

            frame.setSize(width, height);

            this.width = width;
            this.height = height;
        }
        else
        {
            //  Resize the frame
            var baseFrame = this.getSourceImage();

            if (frame.cutX + width > baseFrame.width)
            {
                width = baseFrame.width - frame.cutX;
            }

            if (frame.cutY + height > baseFrame.height)
            {
                height = baseFrame.height - frame.cutY;
            }

            frame.setSize(width, height, frame.cutX, frame.cutY);
        }

        return this;
    },

    /**
     * If you are planning on using this Render Texture as a base texture for Sprite
     * Game Objects, then you should call this method with a value of `true` before
     * drawing anything to it, otherwise you will get inverted frames in WebGL.
     *
     * @method Phaser.Textures.DynamicTexture#setIsSpriteTexture
     * @since 3.60.0
     *
     * @param {boolean} value - Is this Render Target being used as a Sprite Texture, or not?
     *
     * @return {this} This Game Object instance.
     */
    setIsSpriteTexture: function (value)
    {
        this.isSpriteTexture = value;

        return this;
    },

    /**
     * Fills the Render Texture with the given color.
     *
     * @method Phaser.Textures.DynamicTexture#fill
     * @since 3.2.0
     *
     * @param {number} rgb - The color to fill the Render Texture with, such as 0xff0000 for red.
     * @param {number} [alpha=1] - The alpha value used by the fill.
     * @param {number} [x=0] - The left coordinate of the fill rectangle.
     * @param {number} [y=0] - The top coordinate of the fill rectangle.
     * @param {number} [width=this.width] - The width of the fill rectangle.
     * @param {number} [height=this.height] - The height of the fill rectangle.
     *
     * @return {this} This Render Texture instance.
     */
    fill: function (rgb, alpha, x, y, width, height)
    {
        var camera = this.camera;
        var renderer = this.renderer;

        if (alpha === undefined) { alpha = 1; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        var r = (rgb >> 16 & 0xFF);
        var g = (rgb >> 8 & 0xFF);
        var b = (rgb & 0xFF);

        var renderTarget = this.renderTarget;

        camera.preRender();

        if (renderTarget)
        {
            renderTarget.bind(true);

            var pipeline = this.pipeline.manager.set(this.pipeline);

            var sx = renderer.width / renderTarget.width;
            var sy = renderer.height / renderTarget.height;

            pipeline.drawFillRect(
                x * sx, y * sy, width * sx, height * sy,
                Utils.getTintFromFloats(b / 255, g / 255, r / 255, 1),
                alpha
            );

            renderTarget.unbind(true);
        }
        else
        {
            var ctx = this.context;

            renderer.setContext(ctx);

            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            ctx.fillRect(x, y, width, height);

            renderer.setContext();
        }

        this.dirty = true;

        return this;
    },

    /**
     * Clears the Render Texture.
     *
     * @method Phaser.Textures.DynamicTexture#clear
     * @since 3.2.0
     *
     * @return {this} This Render Texture instance.
     */
    clear: function ()
    {
        if (this.dirty)
        {
            var ctx = this.context;
            var renderTarget = this.renderTarget;

            if (renderTarget)
            {
                renderTarget.clear();
            }
            else if (ctx)
            {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.restore();
            }

            this.dirty = false;
        }

        return this;
    },

    /**
     * Draws the given object, or an array of objects, to this Render Texture using a blend mode of ERASE.
     * This has the effect of erasing any filled pixels in the objects from this Render Texture.
     *
     * It can accept any of the following:
     *
     * * Any renderable Game Object, such as a Sprite, Text, Graphics or TileSprite.
     * * Tilemap Layers.
     * * A Group. The contents of which will be iterated and drawn in turn.
     * * A Container. The contents of which will be iterated fully, and drawn in turn.
     * * A Scene's Display List. Pass in `Scene.children` to draw the whole list.
     * * Another Render Texture.
     * * A Texture Frame instance.
     * * A string. This is used to look-up a texture from the Texture Manager.
     *
     * Note: You cannot erase a Render Texture from itself.
     *
     * If passing in a Group or Container it will only draw children that return `true`
     * when their `willRender()` method is called. I.e. a Container with 10 children,
     * 5 of which have `visible=false` will only draw the 5 visible ones.
     *
     * If passing in an array of Game Objects it will draw them all, regardless if
     * they pass a `willRender` check or not.
     *
     * You can pass in a string in which case it will look for a texture in the Texture
     * Manager matching that string, and draw the base frame.
     *
     * You can pass in the `x` and `y` coordinates to draw the objects at. The use of
     * the coordinates differ based on what objects are being drawn. If the object is
     * a Group, Container or Display List, the coordinates are _added_ to the positions
     * of the children. For all other types of object, the coordinates are exact.
     *
     * Calling this method causes the WebGL batch to flush, so it can write the texture
     * data to the framebuffer being used internally. The batch is flushed at the end,
     * after the entries have been iterated. So if you've a bunch of objects to draw,
     * try and pass them in an array in one single call, rather than making lots of
     * separate calls.
     *
     * @method Phaser.Textures.DynamicTexture#erase
     * @since 3.16.0
     *
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, other Render Texture, Texture Frame or an array of any of these.
     * @param {number} [x=0] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y=0] - The y position to draw the Frame at, or the offset applied to the object.
     *
     * @return {this} This Render Texture instance.
     */
    erase: function (entries, x, y)
    {
        this._eraseMode = true;

        this.draw(entries, x, y);

        this._eraseMode = false;

        return this;
    },

    /**
     * Draws the given object, or an array of objects, to this Render Texture.
     *
     * It can accept any of the following:
     *
     * * Any renderable Game Object, such as a Sprite, Text, Graphics or TileSprite.
     * * Tilemap Layers.
     * * A Group. The contents of which will be iterated and drawn in turn.
     * * A Container. The contents of which will be iterated fully, and drawn in turn.
     * * A Scene's Display List. Pass in `Scene.children` to draw the whole list.
     * * Another Render Texture.
     * * A Texture Frame instance.
     * * A string. This is used to look-up a texture from the Texture Manager.
     *
     * Note 1: You cannot draw a Render Texture to itself.
     *
     * Note 2: For Game Objects that have Post FX Pipelines, the pipeline _cannot_ be
     * used when drawn to this Render Texture.
     *
     * If passing in a Group or Container it will only draw children that return `true`
     * when their `willRender()` method is called. I.e. a Container with 10 children,
     * 5 of which have `visible=false` will only draw the 5 visible ones.
     *
     * If passing in an array of Game Objects it will draw them all, regardless if
     * they pass a `willRender` check or not.
     *
     * You can pass in a string in which case it will look for a texture in the Texture
     * Manager matching that string, and draw the base frame. If you need to specify
     * exactly which frame to draw then use the method `drawFrame` instead.
     *
     * You can pass in the `x` and `y` coordinates to draw the objects at. The use of
     * the coordinates differ based on what objects are being drawn. If the object is
     * a Group, Container or Display List, the coordinates are _added_ to the positions
     * of the children. For all other types of object, the coordinates are exact.
     *
     * The `alpha` and `tint` values are only used by Texture Frames.
     * Game Objects use their own alpha and tint values when being drawn.
     *
     * Calling this method causes the WebGL batch to flush, so it can write the texture
     * data to the framebuffer being used internally. The batch is flushed at the end,
     * after the entries have been iterated. So if you've a bunch of objects to draw,
     * try and pass them in an array in one single call, rather than making lots of
     * separate calls.
     *
     * If you are planning on using this Render Texture as a base texture for Sprite
     * Game Objects, then you should set `RenderTexture.isSpriteTexture = true` before
     * calling this method, otherwise you will get inverted frames in WebGL.
     *
     * @method Phaser.Textures.DynamicTexture#draw
     * @since 3.2.0
     *
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, other Render Texture, Texture Frame or an array of any of these.
     * @param {number} [x=0] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y=0] - The y position to draw the Frame at, or the offset applied to the object.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     *
     * @return {this} This Render Texture instance.
     */
    draw: function (entries, x, y, alpha, tint)
    {
        this.beginDraw();
        this.batchDraw(entries, x, y, alpha, tint);
        this.endDraw();

        return this;
    },

    /**
     * Draws the Texture Frame to the Render Texture at the given position.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * ```javascript
     * var rt = this.add.renderTexture(0, 0, 800, 600);
     * rt.drawFrame(key, frame);
     * ```
     *
     * You can optionally provide a position, alpha and tint value to apply to the frame
     * before it is drawn.
     *
     * Calling this method will cause a batch flush, so if you've got a stack of things to draw
     * in a tight loop, try using the `draw` method instead.
     *
     * If you need to draw a Sprite to this Render Texture, use the `draw` method instead.
     *
     * If you are planning on using this Render Texture as a base texture for Sprite
     * Game Objects, then you should set `RenderTexture.isSpriteTexture = true` before
     * calling this method, otherwise you will get inverted frames in WebGL.
     *
     * @method Phaser.Textures.DynamicTexture#drawFrame
     * @since 3.12.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture. Set to `null` to skip this argument if not required.
     * @param {number} [x=0] - The x position to draw the frame at.
     * @param {number} [y=0] - The y position to draw the frame at.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. WebGL only.
     *
     * @return {this} This Render Texture instance.
     */
    drawFrame: function (key, frame, x, y, alpha, tint)
    {
        this.beginDraw();
        this.batchDrawFrame(key, frame, x, y, alpha, tint);
        this.endDraw();

        return this;
    },

    /**
     * Resets the internal Stamp object, ready for drawing.
     *
     * @method Phaser.Textures.DynamicTexture#resetStamp
     * @since 3.60.0
     *
     * @param {number} [alpha=1] - The alpha to use.
     * @param {number} [tint=0xffffff] - WebGL only. The tint color to use.
     *
     * @return {Phaser.GameObjects.Image} A reference to the Stamp Game Object.
     */
    resetStamp: function (alpha, tint)
    {
        if (alpha === undefined) { alpha = 1; }
        if (tint === undefined) { tint = 0xffffff; }

        var stamp = this.stamp;

        stamp.setCrop();
        stamp.setAlpha(alpha);
        stamp.setTint(tint);

        return stamp;
    },

    /**
     * Takes the given Texture Frame and draws it to this Render Texture as a fill pattern,
     * i.e. in a grid-layout based on the frame dimensions.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * ```javascript
     * var rt = this.add.renderTexture(0, 0, 800, 600);
     *
     * rt.repeat(key, frame);
     * ```
     *
     * You can optionally provide a position, width, height, alpha and tint value to apply to
     * the frames before they are drawn. The position controls the top-left where the repeating
     * fill will start from. The width and height control the size of the filled area.
     *
     * The position can be negative if required, but the dimensions cannot.
     *
     * Calling this method will cause a batch flush by default. Use the `skipBatch` argument
     * to disable this, if this call is part of a larger batch draw.
     *
     * If you are planning on using this Render Texture as a base texture for Sprite
     * Game Objects, then you should set `RenderTexture.isSpriteTexture = true` before
     * calling this method, otherwise you will get inverted frames in WebGL.
     *
     * @method Phaser.Textures.DynamicTexture#repeat
     * @since 3.60.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture. Set to `null` to skip this argument if not required.
     * @param {number} [x=0] - The x position to start drawing the frames from (can be negative to offset).
     * @param {number} [y=0] - The y position to start drawing the frames from (can be negative to offset).
     * @param {number} [width=this.width] - The width of the area to repeat the frame within. Defaults to the width of this Render Texture.
     * @param {number} [height=this.height] - The height of the area to repeat the frame within. Defaults to the height of this Render Texture.
     * @param {number} [alpha=1] - The alpha to use. Defaults to 1, no alpha.
     * @param {number} [tint=0xffffff] - WebGL only. The tint color to use. Leave as undefined, or 0xffffff to have no tint.
     * @param {boolean} [skipBatch=false] - Skip beginning and ending a batch with this call. Use if this is part of a bigger batched draw.
     *
     * @return {this} This Render Texture instance.
     */
    repeat: function (key, frame, x, y, width, height, alpha, tint, skipBatch)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }
        if (alpha === undefined) { alpha = 1; }
        if (tint === undefined) { tint = 0xffffff; }
        if (skipBatch === undefined) { skipBatch = false; }

        if (key instanceof Frame)
        {
            frame = key;
        }
        else
        {
            frame = this.manager.getFrame(key, frame);
        }

        if (!frame)
        {
            return this;
        }

        var stamp = this.resetStamp(alpha, tint);

        stamp.setFrame(frame);

        var frameWidth = frame.width;
        var frameHeight = frame.height;

        //  Clamp to integer
        width = Math.floor(width);
        height = Math.floor(height);

        //  How many stamps can we fit in horizontally and vertically?
        //  We round this number up to allow for excess overflow
        var hmax = Math.ceil(width / frameWidth);
        var vmax = Math.ceil(height / frameHeight);

        //  How much extra horizontal and vertical space do we have on the right/bottom?
        var hdiff = (hmax * frameWidth) - width;
        var vdiff = (vmax * frameHeight) - height;

        if (hdiff > 0)
        {
            hdiff = frameWidth - hdiff;
        }

        if (vdiff > 0)
        {
            vdiff = frameHeight - vdiff;
        }

        //  x/y may be negative

        if (x < 0)
        {
            hmax += Math.ceil(Math.abs(x) / frameWidth);
        }

        if (y < 0)
        {
            vmax += Math.ceil(Math.abs(y) / frameHeight);
        }

        var dx = x;
        var dy = y;

        var useCrop = false;
        var cropRect = this._stampCrop.setTo(0, 0, frameWidth, frameHeight);

        if (!skipBatch)
        {
            this.beginDraw();
        }

        for (var ty = 0; ty < vmax; ty++)
        {
            //  Negative offset?
            if (dy + frameHeight < 0)
            {
                //  We can't see it, as it's off the top
                dy += frameHeight;
                continue;
            }

            for (var tx = 0; tx < hmax; tx++)
            {
                useCrop = false;

                //  Negative offset?
                if (dx + frameWidth < 0)
                {
                    //  We can't see it, as it's fully off the left
                    dx += frameWidth;
                    continue;
                }
                else if (dx < 0)
                {
                    //  Partially off the left
                    useCrop = true;
                    cropRect.width = (frameWidth + dx);
                    cropRect.x = frameWidth - cropRect.width;
                }

                //  Negative vertical offset
                if (dy < 0)
                {
                    //  Partially off the top
                    useCrop = true;
                    cropRect.height = (frameHeight + dy);
                    cropRect.y = frameHeight - cropRect.height;
                }

                if (hdiff > 0 && tx === hmax - 1)
                {
                    useCrop = true;
                    cropRect.width = hdiff;
                }

                if (vdiff > 0 && ty === vmax - 1)
                {
                    useCrop = true;
                    cropRect.height = vdiff;
                }

                if (useCrop)
                {
                    stamp.setCrop(cropRect);
                }

                this.batchGameObject(stamp, dx, dy);

                //  Reset crop
                stamp.isCropped = false;

                cropRect.setTo(0, 0, frameWidth, frameHeight);

                dx += frameWidth;
            }

            dx = x;
            dy += frameHeight;
        }

        if (!skipBatch)
        {
            this.endDraw();
        }

        return this;
    },

    /**
     * Use this method if you need to batch draw a large number of Game Objects to
     * this Render Texture in a single go, or on a frequent basis.
     *
     * This method starts the beginning of a batched draw.
     *
     * Batch drawing is faster than calling `draw`, but you must be very careful to manage the
     * flow of code and remember to call `endDraw()` when you're finished.
     *
     * If you don't need to draw large numbers of objects it's much safer and easier
     * to use the `draw` method instead.
     *
     * The flow should be:
     *
     * ```javascript
     * // Call once:
     * RenderTexture.beginDraw();
     *
     * // repeat n times:
     * RenderTexture.batchDraw();
     * // or
     * RenderTexture.batchDrawFrame();
     *
     * // Call once:
     * RenderTexture.endDraw();
     * ```
     *
     * Do not call any methods other than `batchDraw`, `batchDrawFrame`, or `endDraw` once you
     * have started a batch. Also, be very careful not to destroy this Render Texture while the
     * batch is still open.
     *
     * You can use the `RenderTexture.isDrawing` boolean property to tell if a batch is
     * currently open, or not.
     *
     * @method Phaser.Textures.DynamicTexture#beginDraw
     * @since 3.50.0
     *
     * @return {this} This Render Texture instance.
     */
    beginDraw: function ()
    {
        if (!this.isDrawing)
        {
            var camera = this.camera;
            var renderer = this.renderer;
            var renderTarget = this.renderTarget;

            camera.preRender();

            if (renderTarget)
            {
                renderer.beginCapture(renderTarget.width, renderTarget.height);
            }
            else
            {
                renderer.setContext(this.context);
            }

            this.isDrawing = true;
        }

        return this;
    },

    /**
     * Use this method if you have already called `beginDraw` and need to batch
     * draw a large number of objects to this Render Texture.
     *
     * This method batches the drawing of the given objects to this Render Texture,
     * without causing a bind or batch flush.
     *
     * It is faster than calling `draw`, but you must be very careful to manage the
     * flow of code and remember to call `endDraw()`. If you don't need to draw large
     * numbers of objects it's much safer and easier to use the `draw` method instead.
     *
     * The flow should be:
     *
     * ```javascript
     * // Call once:
     * RenderTexture.beginDraw();
     *
     * // repeat n times:
     * RenderTexture.batchDraw();
     * // or
     * RenderTexture.batchDrawFrame();
     *
     * // Call once:
     * RenderTexture.endDraw();
     * ```
     *
     * Do not call any methods other than `batchDraw`, `batchDrawFrame`, or `endDraw` once you
     * have started a batch. Also, be very careful not to destroy this Render Texture while the
     * batch is still open, or call `beginDraw` again.
     *
     * Draws the given object, or an array of objects, to this Render Texture.
     *
     * It can accept any of the following:
     *
     * * Any renderable Game Object, such as a Sprite, Text, Graphics or TileSprite.
     * * Tilemap Layers.
     * * A Group. The contents of which will be iterated and drawn in turn.
     * * A Container. The contents of which will be iterated fully, and drawn in turn.
     * * A Scene's Display List. Pass in `Scene.children` to draw the whole list.
     * * Another Render Texture.
     * * A Texture Frame instance.
     * * A string. This is used to look-up a texture from the Texture Manager.
     *
     * Note: You cannot draw a Render Texture to itself.
     *
     * If passing in a Group or Container it will only draw children that return `true`
     * when their `willRender()` method is called. I.e. a Container with 10 children,
     * 5 of which have `visible=false` will only draw the 5 visible ones.
     *
     * If passing in an array of Game Objects it will draw them all, regardless if
     * they pass a `willRender` check or not.
     *
     * You can pass in a string in which case it will look for a texture in the Texture
     * Manager matching that string, and draw the base frame. If you need to specify
     * exactly which frame to draw then use the method `drawFrame` instead.
     *
     * You can pass in the `x` and `y` coordinates to draw the objects at. The use of
     * the coordinates differ based on what objects are being drawn. If the object is
     * a Group, Container or Display List, the coordinates are _added_ to the positions
     * of the children. For all other types of object, the coordinates are exact.
     *
     * The `alpha` and `tint` values are only used by Texture Frames.
     * Game Objects use their own alpha and tint values when being drawn.
     *
     * @method Phaser.Textures.DynamicTexture#batchDraw
     * @since 3.50.0
     *
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, other Render Texture, Texture Frame or an array of any of these.
     * @param {number} [x=0] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y=0] - The y position to draw the Frame at, or the offset applied to the object.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     *
     * @return {this} This Render Texture instance.
     */
    batchDraw: function (entries, x, y, alpha, tint)
    {
        if (!Array.isArray(entries))
        {
            entries = [ entries ];
        }

        this.batchList(entries, x, y, alpha, tint);

        return this;
    },

    /**
     * Use this method if you have already called `beginDraw` and need to batch
     * draw a large number of texture frames to this Render Texture.
     *
     * This method batches the drawing of the given frames to this Render Texture,
     * without causing a bind or batch flush.
     *
     * It is faster than calling `drawFrame`, but you must be very careful to manage the
     * flow of code and remember to call `endDraw()`. If you don't need to draw large
     * numbers of frames it's much safer and easier to use the `drawFrame` method instead.
     *
     * The flow should be:
     *
     * ```javascript
     * // Call once:
     * RenderTexture.beginDraw();
     *
     * // repeat n times:
     * RenderTexture.batchDraw();
     * // or
     * RenderTexture.batchDrawFrame();
     *
     * // Call once:
     * RenderTexture.endDraw();
     * ```
     *
     * Do not call any methods other than `batchDraw`, `batchDrawFrame`, or `endDraw` once you
     * have started a batch. Also, be very careful not to destroy this Render Texture while the
     * batch is still open, or call `beginDraw` again.
     *
     * Draws the Texture Frame to the Render Texture at the given position.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * ```javascript
     * var rt = this.add.renderTexture(0, 0, 800, 600);
     * rt.drawFrame(key, frame);
     * ```
     *
     * You can optionally provide a position, alpha and tint value to apply to the frame
     * before it is drawn.
     *
     * Calling this method will cause a batch flush, so if you've got a stack of things to draw
     * in a tight loop, try using the `draw` method instead.
     *
     * If you need to draw a Sprite to this Render Texture, use the `draw` method instead.
     *
     * @method Phaser.Textures.DynamicTexture#batchDrawFrame
     * @since 3.50.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture.
     * @param {number} [x=0] - The x position to draw the frame at.
     * @param {number} [y=0] - The y position to draw the frame at.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     *
     * @return {this} This Render Texture instance.
     */
    batchDrawFrame: function (key, frame, x, y, alpha, tint)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (alpha === undefined) { alpha = 1; }
        if (tint === undefined) { tint = 0xffffff; }

        var textureFrame = this.manager.getFrame(key, frame);

        if (textureFrame)
        {
            if (this.renderTarget)
            {
                tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);

                this.pipeline.batchTextureFrame(textureFrame, x, y, tint, alpha, this.camera.matrix, null);
            }
            else
            {
                this.batchTextureFrame(textureFrame, x, y, alpha, tint);
            }
        }

        return this;
    },

    /**
     * Use this method to finish batch drawing to this Render Texture.
     *
     * Calling this method without first calling `beginDraw` will have no effect.
     *
     * Batch drawing is faster than calling `draw`, but you must be very careful to manage the
     * flow of code and remember to call `endDraw()` when you're finished.
     *
     * If you don't need to draw large numbers of objects it's much safer and easier
     * to use the `draw` method instead.
     *
     * The flow should be:
     *
     * ```javascript
     * // Call once:
     * RenderTexture.beginDraw();
     *
     * // repeat n times:
     * RenderTexture.batchDraw();
     * // or
     * RenderTexture.batchDrawFrame();
     *
     * // Call once:
     * RenderTexture.endDraw();
     * ```
     *
     * Do not call any methods other than `batchDraw`, `batchDrawFrame`, or `endDraw` once you
     * have started a batch. Also, be very careful not to destroy this Render Texture while the
     * batch is still open.
     *
     * You can use the `RenderTexture.isDrawing` boolean property to tell if a batch is
     * currently open, or not.
     *
     * @method Phaser.Textures.DynamicTexture#endDraw
     * @since 3.50.0
     *
     * @param {boolean} [erase=false] - Draws all objects in this batch using a blend mode of ERASE. This has the effect of erasing any filled pixels in the objects being drawn.
     *
     * @return {this} This Render Texture instance.
     */
    endDraw: function (erase)
    {
        if (erase === undefined) { erase = this._eraseMode; }

        if (this.isDrawing)
        {
            var renderer = this.renderer;

            var renderTarget = this.renderTarget;

            if (renderTarget)
            {
                var canvasTarget = renderer.endCapture();

                var util = renderer.pipelines.setUtility();

                util.blitFrame(canvasTarget, renderTarget, 1, false, false, erase, this.isSpriteTexture);

                renderer.resetScissor();
                renderer.resetViewport();
            }
            else
            {
                renderer.setContext();
            }

            this.dirty = true;
            this.isDrawing = false;
        }

        return this;
    },

    /**
     * Internal method that handles the drawing of an array of children.
     *
     * @method Phaser.Textures.DynamicTexture#batchList
     * @private
     * @since 3.12.0
     *
     * @param {array} children - The array of Game Objects, Textures or Frames to draw.
     * @param {number} [x=0] - The x position to offset the Game Object by.
     * @param {number} [y=0] - The y position to offset the Game Object by.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     */
    batchList: function (children, x, y, alpha, tint)
    {
        for (var i = 0; i < children.length; i++)
        {
            var entry = children[i];

            if (!entry || entry === this)
            {
                continue;
            }

            if (entry.renderWebGL || entry.renderCanvas)
            {
                //  Game Objects
                this.batchGameObject(entry, x, y);
            }
            else if (entry.isParent || entry.list)
            {
                //  Groups / Display Lists
                this.batchGroup(entry.getChildren(), x, y);
            }
            else if (typeof entry === 'string')
            {
                //  Texture key
                this.batchTextureFrameKey(entry, null, x, y, alpha, tint);
            }
            else if (entry instanceof Frame)
            {
                //  Texture Frame instance
                this.batchTextureFrame(entry, x, y, alpha, tint);
            }
            else if (Array.isArray(entry))
            {
                //  Another Array
                this.batchList(entry, x, y, alpha, tint);
            }
        }
    },

    /**
     * Internal method that handles drawing a Phaser Group contents.
     *
     * @method Phaser.Textures.DynamicTexture#batchGroup
     * @private
     * @since 3.12.0
     *
     * @param {array} children - The array of Game Objects to draw.
     * @param {number} [x=0] - The x position to offset the Game Object by.
     * @param {number} [y=0] - The y position to offset the Game Object by.
     */
    batchGroup: function (children, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        for (var i = 0; i < children.length; i++)
        {
            var entry = children[i];

            if (entry.willRender(this.camera))
            {
                this.batchGameObject(entry, entry.x + x, entry.y + y);
            }
        }
    },

    /**
     * Internal method that handles drawing a single Phaser Game Object to this Render Texture.
     *
     * @method Phaser.Textures.DynamicTexture#batchGameObject
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to draw.
     * @param {number} [x=0] - The x position to draw the Game Object at.
     * @param {number} [y=0] - The y position to draw the Game Object at.
     */
    batchGameObject: function (gameObject, x, y)
    {
        if (x === undefined) { x = gameObject.x; }
        if (y === undefined) { y = gameObject.y; }

        var prevX = gameObject.x;
        var prevY = gameObject.y;

        var camera = this.camera;
        var renderer = this.renderer;
        var eraseMode = this._eraseMode;

        gameObject.setPosition(x, y);

        if (this.canvas)
        {
            if (eraseMode)
            {
                var blendMode = gameObject.blendMode;

                gameObject.blendMode = BlendModes.ERASE;
            }

            gameObject.renderCanvas(renderer, gameObject, camera, null);

            if (eraseMode)
            {
                gameObject.blendMode = blendMode;
            }
        }
        else if (renderer)
        {
            if (gameObject.renderDirect)
            {
                gameObject.renderDirect(renderer, gameObject, camera);
            }
            else
            {
                if (!eraseMode)
                {
                    renderer.setBlendMode(gameObject.blendMode);
                }

                gameObject.renderWebGL(renderer, gameObject, camera);
            }
        }

        gameObject.setPosition(prevX, prevY);
    },

    /**
     * Internal method that handles the drawing a Texture Frame based on its key.
     *
     * @method Phaser.Textures.DynamicTexture#batchTextureFrameKey
     * @private
     * @since 3.12.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture.
     * @param {number} [x=0] - The x position to offset the Game Object by.
     * @param {number} [y=0] - The y position to offset the Game Object by.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     */
    batchTextureFrameKey: function (key, frame, x, y, alpha, tint)
    {
        var textureFrame = this.manager.getFrame(key, frame);

        if (textureFrame)
        {
            this.batchTextureFrame(textureFrame, x, y, alpha, tint);
        }
    },

    /**
     * Internal method that handles the drawing of a Texture Frame to this Render Texture.
     *
     * @method Phaser.Textures.DynamicTexture#batchTextureFrame
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.Textures.Frame} textureFrame - The Texture Frame to draw.
     * @param {number} [x=0] - The x position to draw the Frame at.
     * @param {number} [y=0] - The y position to draw the Frame at.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     */
    batchTextureFrame: function (textureFrame, x, y, alpha, tint)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (alpha === undefined) { alpha = 1; }
        if (tint === undefined) { tint = 0xffffff; }

        var matrix = this.camera.matrix;
        var renderTarget = this.renderTarget;

        if (renderTarget)
        {
            tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);

            this.pipeline.batchTextureFrame(textureFrame, x, y, tint, alpha, matrix, null);
        }
        else
        {
            var ctx = this.context;
            var cd = textureFrame.canvasData;
            var source = textureFrame.source.image;

            ctx.save();

            ctx.globalCompositeOperation = (this._eraseMode) ? 'destination-out' : 'source-over';

            ctx.globalAlpha = alpha;

            matrix.setToContext(ctx);

            if (cd.width > 0 && cd.height > 0)
            {
                ctx.drawImage(source, cd.x, cd.y, cd.width, cd.height, x, y, cd.width, cd.height);
            }

            ctx.restore();
        }
    },

    /**
     * Takes a snapshot of the given area of this Render Texture.
     *
     * The snapshot is taken immediately.
     *
     * To capture the whole Render Texture see the `snapshot` method. To capture a specific pixel, see `snapshotPixel`.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
     * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
     * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
     * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     *
     * @method Phaser.Textures.DynamicTexture#snapshotArea
     * @since 3.19.0
     *
     * @param {number} x - The x coordinate to grab from.
     * @param {number} y - The y coordinate to grab from.
     * @param {number} width - The width of the area to grab.
     * @param {number} height - The height of the area to grab.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This Render Texture instance.
     */
    snapshotArea: function (x, y, width, height, callback, type, encoderOptions)
    {
        if (this.renderTarget)
        {
            this.renderer.snapshotFramebuffer(this.renderTarget.framebuffer, this.width, this.height, callback, false, x, y, width, height, type, encoderOptions);
        }
        else
        {
            this.renderer.snapshotCanvas(this.canvas, callback, false, x, y, width, height, type, encoderOptions);
        }

        return this;
    },

    /**
     * Takes a snapshot of the whole of this Render Texture.
     *
     * The snapshot is taken immediately.
     *
     * To capture just a portion of the Render Texture see the `snapshotArea` method. To capture a specific pixel, see `snapshotPixel`.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
     * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
     * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
     * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     *
     * @method Phaser.Textures.DynamicTexture#snapshot
     * @since 3.19.0
     *
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This Render Texture instance.
     */
    snapshot: function (callback, type, encoderOptions)
    {
        return this.snapshotArea(0, 0, this.width, this.height, callback, type, encoderOptions);
    },

    /**
     * Takes a snapshot of the given pixel from this Render Texture.
     *
     * The snapshot is taken immediately.
     *
     * To capture the whole Render Texture see the `snapshot` method. To capture a specific portion, see `snapshotArea`.
     *
     * Unlike the other two snapshot methods, this one will send your callback a `Color` object containing the color data for
     * the requested pixel. It doesn't need to create an internal Canvas or Image object, so is a lot faster to execute,
     * using less memory, than the other snapshot methods.
     *
     * @method Phaser.Textures.DynamicTexture#snapshotPixel
     * @since 3.19.0
     *
     * @param {number} x - The x coordinate of the pixel to get.
     * @param {number} y - The y coordinate of the pixel to get.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot pixel data is extracted.
     *
     * @return {this} This Render Texture instance.
     */
    snapshotPixel: function (x, y, callback)
    {
        return this.snapshotArea(x, y, 1, 1, callback);
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.Textures.DynamicTexture#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        CanvasPool.remove(this.canvas);

        if (this.renderTarget)
        {
            this.renderTarget.destroy();
        }

        this.camera.destroy();
        this.stamp.destroy();

        this.canvas = null;
        this.context = null;
        this.renderer = null;
        this.scene = null;
    }

});

module.exports = DynamicTexture;
