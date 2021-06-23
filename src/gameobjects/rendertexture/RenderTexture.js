/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../../renderer/BlendModes');
var Camera = require('../../cameras/2d/BaseCamera');
var CanvasPool = require('../../display/canvas/CanvasPool');
var Class = require('../../utils/Class');
var Components = require('../components');
var CONST = require('../../const');
var Frame = require('../../textures/Frame');
var GameObject = require('../GameObject');
var NOOP = require('../../utils/NOOP');
var PIPELINE_CONST = require('../../renderer/webgl/pipelines/const');
var Render = require('./RenderTextureRender');
var RenderTarget = require('../../renderer/webgl/RenderTarget');
var Utils = require('../../renderer/webgl/Utils');
var UUID = require('../../utils/string/UUID');

/**
 * @classdesc
 * A Render Texture.
 *
 * A Render Texture is a special texture that allows any number of Game Objects to be drawn to it. You can take many complex objects and
 * draw them all to this one texture, which can they be used as the texture for other Game Object's. It's a way to generate dynamic
 * textures at run-time that are WebGL friendly and don't invoke expensive GPU uploads.
 *
 * Note that under WebGL a FrameBuffer, which is what the Render Texture uses internally, cannot be anti-aliased. This means
 * that when drawing objects such as Shapes to a Render Texture they will appear to be drawn with no aliasing, however this
 * is a technical limitation of WebGL. To get around it, create your shape as a texture in an art package, then draw that
 * to the Render Texture.
 *
 * @class RenderTexture
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.2.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Crop
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=32] - The width of the Render Texture.
 * @param {number} [height=32] - The height of the Render Texture.
 * @param {string} [key] - The texture key to make the RenderTexture from.
 * @param {string} [frame] - The frame to make the RenderTexture from.
 */
var RenderTexture = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Crop,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function RenderTexture (scene, x, y, width, height, key, frame)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 32; }
        if (height === undefined) { height = 32; }

        GameObject.call(this, scene, 'RenderTexture');

        /**
         * A reference to either the Canvas or WebGL Renderer that the Game instance is using.
         *
         * @name Phaser.GameObjects.RenderTexture#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.2.0
         */
        this.renderer = scene.sys.renderer;

        /**
         * A reference to the Texture Manager.
         *
         * @name Phaser.GameObjects.RenderTexture#textureManager
         * @type {Phaser.Textures.TextureManager}
         * @since 3.12.0
         */
        this.textureManager = scene.sys.textures;

        /**
         * The tint of the Render Texture when rendered.
         *
         * @name Phaser.GameObjects.RenderTexture#globalTint
         * @type {number}
         * @default 0xffffff
         * @since 3.2.0
         */
        this.globalTint = 0xffffff;

        /**
         * The alpha of the Render Texture when rendered.
         *
         * @name Phaser.GameObjects.RenderTexture#globalAlpha
         * @type {number}
         * @default 1
         * @since 3.2.0
         */
        this.globalAlpha = 1;

        /**
         * The HTML Canvas Element that the Render Texture is drawing to when using the Canvas Renderer.
         *
         * @name Phaser.GameObjects.RenderTexture#canvas
         * @type {HTMLCanvasElement}
         * @since 3.2.0
         */
        this.canvas = null;

        /**
         * Is this Render Texture dirty or not? If not it won't spend time clearing or filling itself.
         *
         * @name Phaser.GameObjects.RenderTexture#dirty
         * @type {boolean}
         * @since 3.12.0
         */
        this.dirty = false;

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.RenderTexture#_crop
         * @type {object}
         * @private
         * @since 3.12.0
         */
        this._crop = this.resetCropObject();

        /**
         * The Texture corresponding to this Render Texture.
         *
         * @name Phaser.GameObjects.RenderTexture#texture
         * @type {Phaser.Textures.Texture}
         * @since 3.12.0
         */
        this.texture = null;

        /**
         * The Frame corresponding to this Render Texture.
         *
         * @name Phaser.GameObjects.RenderTexture#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.12.0
         */
        this.frame = null;

        /**
         * Internal saved texture flag.
         *
         * @name Phaser.GameObjects.RenderTexture#_saved
         * @type {boolean}
         * @private
         * @since 3.12.0
         */
        this._saved = false;

        if (key === undefined)
        {
            this.canvas = CanvasPool.create2D(this, width, height);

            //  Create a new Texture for this RenderTexture object
            this.texture = scene.sys.textures.addCanvas(UUID(), this.canvas);

            //  Get the frame
            this.frame = this.texture.get();
        }
        else
        {
            this.texture = scene.sys.textures.get(key);

            //  Get the frame
            this.frame = this.texture.get(frame);

            this.canvas = this.frame.source.image;
            this._saved = true;

            this.dirty = true;

            this.width = this.frame.cutWidth;
            this.height = this.frame.cutHeight;
        }

        /**
         * A reference to the Rendering Context belonging to the Canvas Element this Render Texture is drawing to.
         *
         * @name Phaser.GameObjects.RenderTexture#context
         * @type {CanvasRenderingContext2D}
         * @since 3.2.0
         */
        this.context = this.canvas.getContext('2d');

        /**
         * Internal erase mode flag.
         *
         * @name Phaser.GameObjects.RenderTexture#_eraseMode
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
         * @name Phaser.GameObjects.RenderTexture#camera
         * @type {Phaser.Cameras.Scene2D.BaseCamera}
         * @since 3.12.0
         */
        this.camera = new Camera(0, 0, width, height);

        /**
         * The Render Target that belongs to this Render Texture.
         *
         * A Render Target encapsulates a framebuffer and texture for the WebGL Renderer.
         *
         * This property remains `null` under Canvas.
         *
         * @name Phaser.GameObjects.RenderTexture#renderTarget
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.50.0
         */
        this.renderTarget = null;

        var renderer = this.renderer;

        if (!renderer)
        {
            this.drawGameObject = NOOP;
        }
        else if (renderer.type === CONST.WEBGL)
        {
            this.drawGameObject = this.batchGameObjectWebGL;

            this.renderTarget = new RenderTarget(renderer, width, height, 1, 0, false);
        }
        else if (renderer.type === CONST.CANVAS)
        {
            this.drawGameObject = this.batchGameObjectCanvas;
        }

        this.camera.setScene(scene);

        this.setPosition(x, y);

        if (key === undefined)
        {
            this.setSize(width, height);
        }

        this.setOrigin(0, 0);

        this.initPipeline(PIPELINE_CONST.SINGLE_PIPELINE);
    },

    /**
     * Sets the size of this Game Object.
     *
     * @method Phaser.GameObjects.RenderTexture#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setSize: function (width, height)
    {
        return this.resize(width, height);
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
     * @method Phaser.GameObjects.RenderTexture#resize
     * @since 3.10.0
     *
     * @param {number} width - The new width of the Render Texture.
     * @param {number} [height=width] - The new height of the Render Texture. If not specified, will be set the same as the `width`.
     *
     * @return {this} This Render Texture.
     */
    resize: function (width, height)
    {
        if (height === undefined) { height = width; }

        var frame = this.frame;

        if (width !== this.width || height !== this.height)
        {
            if (frame.name === '__BASE')
            {
                //  Resize the texture

                this.canvas.width = width;
                this.canvas.height = height;

                this.texture.width = width;
                this.texture.height = height;

                var renderTarget = this.renderTarget;

                if (renderTarget)
                {
                    renderTarget.resize(width, height);

                    frame.glTexture = renderTarget.texture;

                    frame.source.isRenderTexture = true;
                    frame.source.isGLTexture = true;
                    frame.source.glTexture = renderTarget.texture;
                }

                this.camera.setSize(width, height);

                frame.source.width = width;
                frame.source.height = height;

                frame.setSize(width, height);

                this.width = width;
                this.height = height;
            }
        }
        else
        {
            //  Resize the frame

            var baseFrame = this.texture.getSourceImage();

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

        this.updateDisplayOrigin();

        var input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = width;
            input.hitArea.height = height;
        }

        return this;
    },

    /**
     * Set the tint to use when rendering this Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#setGlobalTint
     * @since 3.2.0
     *
     * @param {number} tint - The tint value.
     *
     * @return {this} This Render Texture.
     */
    setGlobalTint: function (tint)
    {
        this.globalTint = tint;

        return this;
    },

    /**
     * Set the alpha to use when rendering this Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#setGlobalAlpha
     * @since 3.2.0
     *
     * @param {number} alpha - The alpha value.
     *
     * @return {this} This Render Texture.
     */
    setGlobalAlpha: function (alpha)
    {
        this.globalAlpha = alpha;

        return this;
    },

    /**
     * Stores a copy of this Render Texture in the Texture Manager using the given key.
     *
     * After doing this, any texture based Game Object, such as a Sprite, can use the contents of this
     * Render Texture by using the texture key:
     *
     * ```javascript
     * var rt = this.add.renderTexture(0, 0, 128, 128);
     *
     * // Draw something to the Render Texture
     *
     * rt.saveTexture('doodle');
     *
     * this.add.image(400, 300, 'doodle');
     * ```
     *
     * Updating the contents of this Render Texture will automatically update _any_ Game Object
     * that is using it as a texture. Calling `saveTexture` again will not save another copy
     * of the same texture, it will just rename the key of the existing copy.
     *
     * By default it will create a single base texture. You can add frames to the texture
     * by using the `Texture.add` method. After doing this, you can then allow Game Objects
     * to use a specific frame from a Render Texture.
     *
     * If you destroy this Render Texture, any Game Object using it via the Texture Manager will
     * stop rendering. Ensure you remove the texture from the Texture Manager and any Game Objects
     * using it first, before destroying this Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#saveTexture
     * @since 3.12.0
     *
     * @param {string} key - The unique key to store the texture as within the global Texture Manager.
     *
     * @return {Phaser.Textures.Texture} The Texture that was saved.
     */
    saveTexture: function (key)
    {
        this.textureManager.renameTexture(this.texture.key, key);

        this._saved = true;

        return this.texture;
    },

    /**
     * Fills the Render Texture with the given color.
     *
     * @method Phaser.GameObjects.RenderTexture#fill
     * @since 3.2.0
     *
     * @param {number} rgb - The color to fill the Render Texture with.
     * @param {number} [alpha=1] - The alpha value used by the fill.
     * @param {number} [x=0] - The left coordinate of the fill rectangle.
     * @param {number} [y=0] - The top coordinate of the fill rectangle.
     * @param {number} [width=this.frame.cutWidth] - The width of the fill rectangle.
     * @param {number} [height=this.frame.cutHeight] - The height of the fill rectangle.
     *
     * @return {this} This Render Texture instance.
     */
    fill: function (rgb, alpha, x, y, width, height)
    {
        var frame = this.frame;
        var camera = this.camera;
        var renderer = this.renderer;

        if (alpha === undefined) { alpha = 1; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = frame.cutWidth; }
        if (height === undefined) { height = frame.cutHeight; }

        var r = (rgb >> 16 & 0xFF) / 255;
        var g = (rgb >> 8 & 0xFF) / 255;
        var b = (rgb & 0xFF) / 255;

        var renderTarget = this.renderTarget;

        camera.preRender();

        if (renderTarget)
        {
            renderTarget.bind(true);

            var pipeline = this.pipeline;

            pipeline.manager.set(pipeline);

            var tw = renderTarget.width;
            var th = renderTarget.height;

            var rw = renderer.width;
            var rh = renderer.height;

            var sx = rw / tw;
            var sy = rh / th;

            pipeline.drawFillRect(
                x * sx, y * sy, width * sx, height * sy,
                Utils.getTintFromFloats(b, g, r, 1),
                alpha
            );

            renderTarget.unbind(true);
        }
        else
        {
            var ctx = this.context;

            renderer.setContext(ctx);

            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            ctx.fillRect(x + frame.cutX, y + frame.cutY, width, height);

            renderer.setContext();
        }

        this.dirty = true;

        return this;
    },

    /**
     * Clears the Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#clear
     * @since 3.2.0
     *
     * @return {this} This Render Texture instance.
     */
    clear: function ()
    {
        if (this.dirty)
        {
            var renderTarget = this.renderTarget;

            if (renderTarget)
            {
                renderTarget.clear();
            }
            else
            {
                var ctx = this.context;

                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(this.frame.cutX, this.frame.cutY, this.frame.cutWidth, this.frame.cutHeight);
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
     * @method Phaser.GameObjects.RenderTexture#erase
     * @since 3.16.0
     *
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, other Render Texture, Texture Frame or an array of any of these.
     * @param {number} [x] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y] - The y position to draw the Frame at, or the offset applied to the object.
     *
     * @return {this} This Render Texture instance.
     */
    erase: function (entries, x, y)
    {
        this._eraseMode = true;

        this.draw(entries, x, y, 1, 16777215);

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
     * Calling this method causes the WebGL batch to flush, so it can write the texture
     * data to the framebuffer being used internally. The batch is flushed at the end,
     * after the entries have been iterated. So if you've a bunch of objects to draw,
     * try and pass them in an array in one single call, rather than making lots of
     * separate calls.
     *
     * @method Phaser.GameObjects.RenderTexture#draw
     * @since 3.2.0
     *
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, other Render Texture, Texture Frame or an array of any of these.
     * @param {number} [x] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y] - The y position to draw the Frame at, or the offset applied to the object.
     * @param {number} [alpha] -  The alpha value. Only used for Texture Frames and if not specified defaults to the `globalAlpha` property. Game Objects use their own current alpha value.
     * @param {number} [tint] -  WebGL only. The tint color value. Only used for Texture Frames and if not specified defaults to the `globalTint` property. Game Objects use their own current tint value.
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
     * @method Phaser.GameObjects.RenderTexture#drawFrame
     * @since 3.12.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture.
     * @param {number} [x=0] - The x position to draw the frame at.
     * @param {number} [y=0] - The y position to draw the frame at.
     * @param {number} [alpha] - The alpha to use. If not specified it uses the `globalAlpha` property.
     * @param {number} [tint] - WebGL only. The tint color to use. If not specified it uses the `globalTint` property.
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
     * Use this method if you need to batch draw a large number of Game Objects to
     * this Render Texture in a single go, or on a frequent basis.
     *
     * This method starts the beginning of a batched draw.
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
     * @method Phaser.GameObjects.RenderTexture#beginDraw
     * @since 3.50.0
     *
     * @return {this} This Render Texture instance.
     */
    beginDraw: function ()
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
     * @method Phaser.GameObjects.RenderTexture#batchDraw
     * @since 3.50.0
     *
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, other Render Texture, Texture Frame or an array of any of these.
     * @param {number} [x] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y] - The y position to draw the Frame at, or the offset applied to the object.
     * @param {number} [alpha] -  The alpha value. Only used for Texture Frames and if not specified defaults to the `globalAlpha` property. Game Objects use their own current alpha value.
     * @param {number} [tint] -  WebGL only. The tint color value. Only used for Texture Frames and if not specified defaults to the `globalTint` property. Game Objects use their own current tint value.
     *
     * @return {this} This Render Texture instance.
     */
    batchDraw: function (entries, x, y, alpha, tint)
    {
        if (alpha === undefined) { alpha = this.globalAlpha; }

        if (tint === undefined)
        {
            tint = (this.globalTint >> 16) + (this.globalTint & 0xff00) + ((this.globalTint & 0xff) << 16);
        }
        else
        {
            tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);
        }

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
     * @method Phaser.GameObjects.RenderTexture#batchDrawFrame
     * @since 3.50.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture.
     * @param {number} [x=0] - The x position to draw the frame at.
     * @param {number} [y=0] - The y position to draw the frame at.
     * @param {number} [alpha] - The alpha to use. If not specified it uses the `globalAlpha` property.
     * @param {number} [tint] - WebGL only. The tint color to use. If not specified it uses the `globalTint` property.
     *
     * @return {this} This Render Texture instance.
     */
    batchDrawFrame: function (key, frame, x, y, alpha, tint)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (alpha === undefined) { alpha = this.globalAlpha; }

        if (tint === undefined)
        {
            tint = (this.globalTint >> 16) + (this.globalTint & 0xff00) + ((this.globalTint & 0xff) << 16);
        }
        else
        {
            tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);
        }

        var textureFrame = this.textureManager.getFrame(key, frame);

        if (textureFrame)
        {
            if (this.renderTarget)
            {
                this.pipeline.batchTextureFrame(textureFrame, x, y, tint, alpha, this.camera.matrix, null);
            }
            else
            {
                this.batchTextureFrame(textureFrame, x + this.frame.cutX, y + this.frame.cutY, alpha, tint);
            }
        }

        return this;
    },

    /**
     * Use this method to finish batch drawing to this Render Texture.
     *
     * Never call this method without first calling `beginDraw`.
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
     * @method Phaser.GameObjects.RenderTexture#endDraw
     * @since 3.50.0
     *
     * @param {boolean} [erase=false] - Draws all objects in this batch using a blend mode of ERASE. This has the effect of erasing any filled pixels in the objects being drawn.
     *
     * @return {this} This Render Texture instance.
     */
    endDraw: function (erase)
    {
        if (erase === undefined) { erase = this._eraseMode; }

        var renderer = this.renderer;

        var renderTarget = this.renderTarget;

        if (renderTarget)
        {
            var canvasTarget = renderer.endCapture();

            var util = renderer.pipelines.setUtility();

            util.blitFrame(canvasTarget, renderTarget, 1, false, false, erase);

            renderer.resetScissor();
            renderer.resetViewport();
        }
        else
        {
            renderer.setContext();
        }

        this.dirty = true;

        return this;
    },

    /**
     * Internal method that handles the drawing of an array of children.
     *
     * @method Phaser.GameObjects.RenderTexture#batchList
     * @private
     * @since 3.12.0
     *
     * @param {array} children - The array of Game Objects to draw.
     * @param {number} [x] - The x position to offset the Game Object by.
     * @param {number} [y] - The y position to offset the Game Object by.
     * @param {number} [alpha] - The alpha to use. If not specified it uses the `globalAlpha` property.
     * @param {number} [tint] - The tint color to use. If not specified it uses the `globalTint` property.
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
                this.drawGameObject(entry, x, y);
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
     * @method Phaser.GameObjects.RenderTexture#batchGroup
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

        x += this.frame.cutX;
        y += this.frame.cutY;

        for (var i = 0; i < children.length; i++)
        {
            var entry = children[i];

            if (entry.willRender(this.camera))
            {
                var tx = entry.x + x;
                var ty = entry.y + y;

                this.drawGameObject(entry, tx, ty);
            }
        }
    },

    /**
     * Internal method that handles drawing a single Phaser Game Object to this Render Texture using WebGL.
     *
     * @method Phaser.GameObjects.RenderTexture#batchGameObjectWebGL
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to draw.
     * @param {number} [x] - The x position to draw the Game Object at.
     * @param {number} [y] - The y position to draw the Game Object at.
     */
    batchGameObjectWebGL: function (gameObject, x, y)
    {
        if (x === undefined) { x = gameObject.x; }
        if (y === undefined) { y = gameObject.y; }

        var prevX = gameObject.x;
        var prevY = gameObject.y;

        gameObject.setPosition(x + this.frame.cutX, y + this.frame.cutY);

        if (gameObject.renderDirect)
        {
            gameObject.renderDirect(this.renderer, gameObject, this.camera);
        }
        else
        {
            gameObject.renderWebGL(this.renderer, gameObject, this.camera);
        }

        gameObject.setPosition(prevX, prevY);
    },

    /**
     * Internal method that handles drawing a single Phaser Game Object to this Render Texture using Canvas.
     *
     * @method Phaser.GameObjects.RenderTexture#batchGameObjectCanvas
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to draw.
     * @param {number} [x] - The x position to draw the Game Object at.
     * @param {number} [y] - The y position to draw the Game Object at.
     */
    batchGameObjectCanvas: function (gameObject, x, y)
    {
        if (x === undefined) { x = gameObject.x; }
        if (y === undefined) { y = gameObject.y; }

        var prevX = gameObject.x;
        var prevY = gameObject.y;

        if (this._eraseMode)
        {
            var blendMode = gameObject.blendMode;

            gameObject.blendMode = BlendModes.ERASE;
        }

        gameObject.setPosition(x + this.frame.cutX, y + this.frame.cutY);

        gameObject.renderCanvas(this.renderer, gameObject, this.camera, null);

        gameObject.setPosition(prevX, prevY);

        if (this._eraseMode)
        {
            gameObject.blendMode = blendMode;
        }
    },

    /**
     * Internal method that handles the drawing of an array of children.
     *
     * @method Phaser.GameObjects.RenderTexture#batchTextureFrameKey
     * @private
     * @since 3.12.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture.
     * @param {number} [x=0] - The x position to offset the Game Object by.
     * @param {number} [y=0] - The y position to offset the Game Object by.
     * @param {number} [alpha] - The alpha to use. If not specified it uses the `globalAlpha` property.
     * @param {number} [tint] - The tint color to use. If not specified it uses the `globalTint` property.
     */
    batchTextureFrameKey: function (key, frame, x, y, alpha, tint)
    {
        var textureFrame = this.textureManager.getFrame(key, frame);

        if (textureFrame)
        {
            this.batchTextureFrame(textureFrame, x, y, alpha, tint);
        }
    },

    /**
     * Internal method that handles the drawing of a Texture Frame to this Render Texture.
     *
     * @method Phaser.GameObjects.RenderTexture#batchTextureFrame
     * @private
     * @since 3.12.0
     *
     * @param {Phaser.Textures.Frame} textureFrame - The Texture Frame to draw.
     * @param {number} [x=0] - The x position to draw the Frame at.
     * @param {number} [y=0] - The y position to draw the Frame at.
     * @param {number} [tint] - A tint color to be applied to the frame drawn to the Render Texture.
     */
    batchTextureFrame: function (textureFrame, x, y, alpha, tint)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        x += this.frame.cutX;
        y += this.frame.cutY;

        var renderTarget = this.renderTarget;

        if (renderTarget)
        {
            this.pipeline.batchTextureFrame(textureFrame, x, y, tint, alpha, this.camera.matrix, null);
        }
        else
        {
            var ctx = this.context;
            var cd = textureFrame.canvasData;
            var source = textureFrame.source.image;

            var matrix = this.camera.matrix;

            ctx.save();

            ctx.globalCompositeOperation = (this._eraseMode) ? 'destination-out' : 'source-over';

            ctx.globalAlpha = alpha;

            matrix.setToContext(ctx);

            ctx.drawImage(source, cd.x, cd.y, cd.width, cd.height, x, y, cd.width, cd.height);

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
     * @method Phaser.GameObjects.RenderTexture#snapshotArea
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
     * @method Phaser.GameObjects.RenderTexture#snapshot
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
        if (this.renderTarget)
        {
            this.renderer.snapshotFramebuffer(this.renderTarget.framebuffer, this.width, this.height, callback, false, 0, 0, this.width, this.height, type, encoderOptions);
        }
        else
        {
            this.renderer.snapshotCanvas(this.canvas, callback, false, 0, 0, this.width, this.height, type, encoderOptions);
        }

        return this;
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
     * @method Phaser.GameObjects.RenderTexture#snapshotPixel
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
        if (this.renderTarget)
        {
            this.renderer.snapshotFramebuffer(this.renderTarget.framebuffer, this.width, this.height, callback, true, x, y);
        }
        else
        {
            this.renderer.snapshotCanvas(this.canvas, callback, true, x, y);
        }

        return this;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.RenderTexture#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        if (!this._saved)
        {
            CanvasPool.remove(this.canvas);

            if (this.renderTarget)
            {
                this.renderTarget.destroy();
            }

            this.texture.destroy();
            this.camera.destroy();

            this.canvas = null;
            this.context = null;
            this.texture = null;
        }
    }

});

module.exports = RenderTexture;
