/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../renderer/BlendModes');
var Camera = require('../cameras/2d/Camera');
var CanvasPool = require('../display/canvas/CanvasPool');
var Class = require('../utils/Class');
var CONST = require('../const');
var DrawingContext = require('../renderer/webgl/DrawingContext');
var Frame = require('./Frame');
var GetFastValue = require('../utils/object/GetFastValue');
var Texture = require('./Texture');
var Utils = require('../renderer/webgl/Utils');
var DynamicTextureCommands = require('./DynamicTextureCommands');

/**
 * @classdesc
 * A Dynamic Texture is a special texture that allows you to draw textures, frames and most kind of
 * Game Objects directly to it.
 *
 * You can take many complex objects and draw them to this one texture, which can then be used as the
 * base texture for other Game Objects, such as Sprites. Should you then update this texture, all
 * Game Objects using it will instantly be updated as well, reflecting the changes immediately.
 *
 * It's a powerful way to generate dynamic textures at run-time that are WebGL friendly and don't invoke
 * expensive GPU uploads on each change.
 *
 * ```js
 * const t = this.textures.addDynamicTexture('player', 64, 128);
 * // draw objects to t
 * this.add.sprite(x, y, 'player');
 * this.render();
 * ```
 *
 * Because this is a standard Texture within Phaser, you can add frames to it, meaning you can use it
 * to generate sprite sheets, texture atlases or tile sets.
 *
 * Under WebGL1, a FrameBuffer, which is what this Dynamic Texture uses internally, cannot be anti-aliased.
 * This means that when drawing objects such as Shapes or Graphics instances to this texture, they may appear
 * to be drawn with no aliasing around the edges. This is a technical limitation of WebGL1. To get around it,
 * create your shape as a texture in an art package, then draw that to this texture.
 *
 * In the event that the WebGL context is lost, this DynamicTexture will
 * lose its contents. Once context is restored (signalled by the `restorewebgl`
 * event), you can choose to redraw the contents of the DynamicTexture.
 * You are responsible for the redrawing logic.
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

        this.add('__BASE', 0, 0, 0, width, height);

        /**
         * A reference to either the Canvas or WebGL Renderer that the Game instance is using.
         *
         * @name Phaser.Textures.DynamicTexture#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.2.0
         */
        this.renderer = renderer;

        /**
         * The width of this Dynamic Texture.
         *
         * Treat this property as read-only. Use the `setSize` method to change the size.
         *
         * @name Phaser.Textures.DynamicTexture#width
         * @type {number}
         * @since 3.60.0
         */
        this.width = -1;

        /**
         * The height of this Dynamic Texture.
         *
         * Treat this property as read-only. Use the `setSize` method to change the size.
         *
         * @name Phaser.Textures.DynamicTexture#height
         * @type {number}
         * @since 3.60.0
         */
        this.height = -1;

        /**
         * An array of commands that are used to draw to this Dynamic Texture.
         * This is flushed by the `render` method.
         * The `clear` method will also clear this array, then store itself.
         *
         * @name Phaser.Textures.DynamicTexture#commandBuffer
         * @type {array}
         * @since 4.0.0
         */
        this.commandBuffer = [];

        /**
         * A reference to the Rendering Context belonging to the Canvas Element this Dynamic Texture is drawing to.
         *
         * @name Phaser.Textures.DynamicTexture#canvas
         * @type {HTMLCanvasElement}
         * @since 3.2.0
         */
        this.canvas = (isCanvas) ? source : null;

        /**
         * The 2D Canvas Rendering Context.
         *
         * @name Phaser.Textures.DynamicTexture#context
         * @readonly
         * @type {CanvasRenderingContext2D}
         * @since 3.7.0
         */
        this.context = (isCanvas) ? source.getContext('2d', { willReadFrequently: true }) : null;

        /**
         * An internal Camera that can be used to move around this Dynamic Texture.
         *
         * Control it just like you would any Scene Camera. The difference is that it only impacts
         * the placement of **Game Objects** (not textures) that you then draw to this texture.
         *
         * You can scroll, zoom and rotate this Camera.
         *
         * @name Phaser.Textures.DynamicTexture#camera
         * @type {Phaser.Cameras.Scene2D.BaseCamera}
         * @since 3.12.0
         */
        this.camera = new Camera(0, 0, width, height).setScene(manager.game.scene.systemScene, false);

        /**
         * The drawing context of this Dynamic Texture.
         * This contains the framebuffer that the Dynamic Texture is drawing to.
         *
         * @name Phaser.Textures.DynamicTexture#drawingContext
         * @type {Phaser.Renderer.WebGL.DrawingContext}
         * @since 4.0.0
         */
        this.drawingContext = isCanvas ? null : new DrawingContext(renderer, {
            width: width,
            height: height,
            camera: this.camera,
            autoClear: false
        });

        if (!isCanvas)
        {
            var frame = this.get();
            frame.source.glTexture = this.drawingContext.texture;
        }

        this.setSize(width, height);
    },

    /**
     * Resizes this Dynamic Texture to the new dimensions given.
     *
     * In WebGL it will destroy and then re-create the frame buffer being used by this Dynamic Texture.
     * In Canvas it will resize the underlying canvas DOM element.
     *
     * Both approaches will erase everything currently drawn to this texture.
     *
     * If the dimensions given are the same as those already being used, calling this method will do nothing.
     *
     * @method Phaser.Textures.DynamicTexture#setSize
     * @since 3.10.0
     *
     * @param {number} width - The new width of this Dynamic Texture.
     * @param {number} [height=width] - The new height of this Dynamic Texture. If not specified, will be set the same as the `width`.
     *
     * @return {this} This Dynamic Texture.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        var frame = this.get();
        var source = frame.source;

        if (width !== this.width || height !== this.height)
        {
            if (this.canvas)
            {
                this.canvas.width = width;
                this.canvas.height = height;
            }

            var drawingContext = this.drawingContext;

            if (drawingContext && (drawingContext.width !== width || drawingContext.height !== height))
            {
                drawingContext.resize(width, height);
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
     * Render the buffered drawing commands to this Dynamic Texture.
     * You must do this in order to see anything drawn to it.
     *
     * @method Phaser.Textures.DynamicTexture#render
     * @since 4.0.0
     * @return {this} This Dynamic Texture instance.
     */
    render: function ()
    {
        if (this.commandBuffer.length === 0)
        {
            return;
        }

        this.camera.preRender();

        if (this.renderer.type === CONST.WEBGL)
        {
            this._renderWebGL();
        }
        if (this.renderer.type === CONST.CANVAS)
        {
            this._renderCanvas();
        }

        return this;
    },

    /**
     * Render the DynamicTexture using the WebGL render system.
     *
     * @method Phaser.Textures.DynamicTexture#_renderWebGL
     * @since 4.0.0
     * @private
     */
    _renderWebGL: function ()
    {
        this.renderer.renderNodes.getNode('DynamicTextureHandler').run(this);
    },

    /**
     * Render the DynamicTexture using the Canvas render system.
     *
     * @method Phaser.Textures.DynamicTexture#_renderCanvas
     * @since 4.0.0
     * @private
     */
    _renderCanvas: function ()
    {
        var camera = this.camera;
        var context = this.context;
        var renderer = this.renderer;
        var textureManager = this.manager;

        renderer.setContext(context);

        // Big list of reused variables.
        var alpha, blendMode, blendModePrev, frame, height, key, originX, originY, rotation, scaleX, scaleY, tint, width, x, y;

        // Traverse commands.
        var commandBuffer = this.commandBuffer;
        var commandBufferLength = commandBuffer.length;
        var preserveBuffer = false;
        var eraseMode = false;

        for (var index = 0; index < commandBufferLength; index++)
        {
            var command = commandBuffer[index];

            switch (command)
            {
                case DynamicTextureCommands.CLEAR:
                {
                    context.save();
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    context.clearRect(0, 0, this.width, this.height);
                    context.restore();
                    break;
                }

                case DynamicTextureCommands.FILL:
                {
                    var color = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    width = commandBuffer[++index];
                    height = commandBuffer[++index];

                    alpha = (color >> 24 & 0xFF) / 255;
                    var r = (color >> 16 & 0xFF);
                    var g = (color >> 8 & 0xFF);
                    var b = (color & 0xFF);

                    context.save();
                    context.globalCompositeOperation = 'source-over';
                    context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
                    context.fillRect(x, y, width, height);
                    context.restore();

                    break;
                }

                case DynamicTextureCommands.STAMP:
                {
                    key = commandBuffer[++index];
                    frame = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    alpha = commandBuffer[++index];
                    tint = commandBuffer[++index];
                    rotation = commandBuffer[++index];
                    scaleX = commandBuffer[++index];
                    scaleY = commandBuffer[++index];
                    originX = commandBuffer[++index];
                    originY = commandBuffer[++index];
                    blendMode = commandBuffer[++index];

                    if (eraseMode)
                    {
                        blendMode = BlendModes.ERASE;
                    }

                    var stamp = textureManager.resetStamp(alpha, tint);

                    stamp.setPosition(x, y)
                        .setRotation(rotation)
                        .setScale(scaleX, scaleY)
                        .setTexture(key, frame)
                        .setOrigin(originX, originY)
                        .setBlendMode(blendMode);

                    stamp.renderCanvas(renderer, stamp, camera, null);

                    break;
                }

                case DynamicTextureCommands.REPEAT:
                {
                    key = commandBuffer[++index];
                    frame = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    alpha = commandBuffer[++index];
                    tint = commandBuffer[++index];
                    rotation = commandBuffer[++index];
                    scaleX = commandBuffer[++index];
                    scaleY = commandBuffer[++index];
                    originX = commandBuffer[++index];
                    originY = commandBuffer[++index];
                    blendMode = commandBuffer[++index];

                    width = commandBuffer[++index];
                    height = commandBuffer[++index];
                    var tilePositionX = commandBuffer[++index];
                    var tilePositionY = commandBuffer[++index];
                    var tileRotation = commandBuffer[++index];
                    var tileScaleX = commandBuffer[++index];
                    var tileScaleY = commandBuffer[++index];

                    if (eraseMode)
                    {
                        blendMode = BlendModes.ERASE;
                    }

                    var repeat = textureManager.resetTileSprite(alpha, tint);

                    repeat.setPosition(x, y)
                        .setRotation(rotation)
                        .setScale(scaleX, scaleY)
                        .setTexture(key, frame)
                        .setSize(width, height)
                        .setOrigin(originX, originY)
                        .setBlendMode(blendMode)
                        .setTilePosition(tilePositionX, tilePositionY)
                        .setTileRotation(tileRotation)
                        .setTileScale(tileScaleX, tileScaleY);

                    repeat.renderCanvas(renderer, repeat, camera, null);

                    break;
                }

                case DynamicTextureCommands.DRAW:
                {
                    var object = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];

                    if (x !== undefined)
                    {
                        var prevX = object.x;
                        object.x = x;
                    }

                    if (y !== undefined)
                    {
                        var prevY = object.y;
                        object.y = y;
                    }

                    if (eraseMode)
                    {
                        blendModePrev = object.blendMode;
                        object.blendMode = BlendModes.ERASE;
                    }

                    object.renderCanvas(renderer, object, camera, null);

                    if (x !== undefined)
                    {
                        object.x = prevX;
                    }

                    if (y !== undefined)
                    {
                        object.y = prevY;
                    }

                    if (eraseMode)
                    {
                        object.blendMode = blendModePrev;
                    }

                    break;
                }

                case DynamicTextureCommands.SET_ERASE:
                {
                    eraseMode = !!commandBuffer[++index];
                    break;
                }

                case DynamicTextureCommands.PRESERVE:
                {
                    preserveBuffer = commandBuffer[++index];
                    break;
                }

                case DynamicTextureCommands.CALLBACK:
                {
                    var callback = commandBuffer[++index];
                    callback();
                    break;
                }
            }
        }

        if (!preserveBuffer)
        {
            commandBuffer.length = 0;
        }

        // Finish rendering.
        renderer.setContext();
    },

    /**
     * Fills this Dynamic Texture with the given color.
     *
     * By default it will fill the entire texture, however you can set it to fill a specific
     * rectangular area by using the x, y, width and height arguments.
     *
     * The color should be given in hex format, i.e. 0xff0000 for red, 0x00ff00 for green, etc.
     *
     * @method Phaser.Textures.DynamicTexture#fill
     * @since 3.2.0
     *
     * @param {number} rgb - The color to fill this Dynamic Texture with, such as 0xff0000 for red.
     * @param {number} [alpha=1] - The alpha value used by the fill.
     * @param {number} [x=0] - The left coordinate of the fill rectangle.
     * @param {number} [y=0] - The top coordinate of the fill rectangle.
     * @param {number} [width=this.width] - The width of the fill rectangle.
     * @param {number} [height=this.height] - The height of the fill rectangle.
     *
     * @return {this} This Dynamic Texture instance.
     */
    fill: function (rgb, alpha, x, y, width, height)
    {
        if (alpha === undefined) { alpha = 1; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        var r = (rgb >> 16 & 0xFF);
        var g = (rgb >> 8 & 0xFF);
        var b = (rgb & 0xFF);
        var color = Utils.getTintFromFloats(r / 255, g / 255, b / 255, alpha);

        this.commandBuffer.push(
            DynamicTextureCommands.FILL,
            color,
            x, y,
            width, height
        );

        return this;
    },

    /**
     * Fully clears this Dynamic Texture, erasing everything from it and resetting it back to
     * a blank, transparent, texture.
     *
     * @method Phaser.Textures.DynamicTexture#clear
     * @since 3.2.0
     *
     * @return {this} This Dynamic Texture instance.
     */
    clear: function ()
    {
        this.commandBuffer.push(DynamicTextureCommands.CLEAR);

        return this;
    },

    /**
     * Takes the given texture key and frame and then stamps it at the given
     * x and y coordinates. You can use the optional 'config' argument to provide
     * lots more options about how the stamp is applied, including the alpha,
     * tint, angle, scale and origin.
     *
     * By default, the frame will stamp on the x/y coordinates based on its center.
     *
     * If you wish to stamp from the top-left, set the config `originX` and
     * `originY` properties both to zero.
     *
     * This method ignores the `camera` property of the Dynamic Texture.
     *
     * @method Phaser.Textures.DynamicTexture#stamp
     * @since 3.60.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture. Set to `null` to skip this argument if not required.
     * @param {number} [x=0] - The x position to draw the frame at.
     * @param {number} [y=0] - The y position to draw the frame at.
     * @param {Phaser.Types.Textures.StampConfig} [config] - The stamp configuration object, allowing you to set the alpha, tint, angle, scale and origin of the stamp.
     *
     * @return {this} This Dynamic Texture instance.
     */
    stamp: function (key, frame, x, y, config)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        var alpha = GetFastValue(config, 'alpha', 1);
        var tint = GetFastValue(config, 'tint', 0xffffff);
        var angle = GetFastValue(config, 'angle', 0);
        var rotation = GetFastValue(config, 'rotation', 0);
        var scale = GetFastValue(config, 'scale', 1);
        var scaleX = GetFastValue(config, 'scaleX', scale);
        var scaleY = GetFastValue(config, 'scaleY', scale);
        var originX = GetFastValue(config, 'originX', 0.5);
        var originY = GetFastValue(config, 'originY', 0.5);
        var blendMode = GetFastValue(config, 'blendMode', 0);

        if (angle !== 0)
        {
            rotation = angle * Math.PI / 180;
        }

        this.commandBuffer.push(
            DynamicTextureCommands.STAMP,
            key, frame,
            x, y,
            alpha, tint, rotation, scaleX, scaleY, originX, originY, blendMode
        );

        return this;
    },

    /**
     * Draws the given object, or an array of objects, to this Dynamic Texture using a blend mode of ERASE.
     * This has the effect of erasing any filled pixels present in the objects from this texture.
     *
     * This method uses the `draw` method internally,
     * and the parameters behave the same way.
     *
     * @method Phaser.Textures.DynamicTexture#erase
     * @since 3.16.0
     *
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, Render Texture, Texture Frame, or an array of any of these.
     * @param {number} [x=0] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y=0] - The y position to draw the Frame at, or the offset applied to the object.
     * @param {number} [alpha=1] - The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] - The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     *
     * @return {this} This Dynamic Texture instance.
     */
    erase: function (entries, x, y, alpha, tint)
    {
        var commandBuffer = this.commandBuffer;
        var commandBufferLength = commandBuffer.length;
        if (
            commandBuffer[commandBufferLength - 2] === DynamicTextureCommands.SET_ERASE &&
            !commandBuffer[commandBufferLength - 1]
        )
        {
            // The last command finished an ERASE operation,
            // so we can just extend it.
            commandBuffer.length -= 2;
        }
        else
        {
            commandBuffer.push(DynamicTextureCommands.SET_ERASE, true);
        }

        this.draw(entries, x, y, alpha, tint);

        commandBuffer.push(DynamicTextureCommands.SET_ERASE, false);

        return this;
    },

    /**
     * Draws the given object, or an array of objects, to this Dynamic Texture.
     *
     * It can accept any of the following:
     *
     * * Any renderable Game Object, such as a Sprite, Text, Graphics or TileSprite.
     * * Tilemap Layers.
     * * A Group. The contents of which will be iterated and drawn in turn.
     * * A Container. The contents of which will be iterated fully, and drawn in turn.
     * * A Scene Display List. Pass in `Scene.children` to draw the whole list.
     * * Another Dynamic Texture, or a Render Texture.
     * * A Texture Frame instance.
     * * A string. This is used to look-up the texture from the Texture Manager.
     *
     * Note 1: You cannot draw a Dynamic Texture to itself.
     *
     * Note 2: GameObjects will use the camera, while textures and frames will not.
     * Textures and frames are drawn using the `stamp` method.
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
     * For textures and frames, the `x` and `y` values are the middle of the texture.
     *
     * The `alpha` and `tint` values are only used by Texture Frames.
     * Game Objects use their own alpha and tint values when being drawn.
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
     * @return {this} This Dynamic Texture instance.
     */
    draw: function (entries, x, y, alpha, tint)
    {
        if (!Array.isArray(entries))
        {
            entries = [ entries ];
        }

        var len = entries.length;

        for (var i = 0; i < len; i++)
        {
            var entry = entries[i];

            if (!entry || entry === this)
            {
                continue;
            }

            if (entry.renderWebGL || entry.renderCanvas)
            {
                //  Game Objects
                this.commandBuffer.push(DynamicTextureCommands.DRAW, entry, x, y);
            }
            else if (entry.isParent || entry.list)
            {
                //  Groups / Display Lists
                var children = entry.getChildren();

                for (var c = 0; c < children.length; c++)
                {
                    var child = children[c];
                    if (child.willRender(this.camera))
                    {
                        this.draw(child, child.x + x || 0, child.y + y || 0);
                    }
                }
            }
            else if (typeof entry === 'string')
            {
                //  Texture key
                this.stamp(entry, null, x, y, { alpha: alpha, tint: tint });
            }
            else if (entry instanceof Frame)
            {
                //  Texture Frame instance
                this.stamp(entry.texture.key, entry, x, y, { alpha: alpha, tint: tint });
            }
            else if (Array.isArray(entry))
            {
                //  Another Array
                this.draw(entry, x, y, alpha, tint);
            }
        }

        return this;
    },

    /**
     * Takes the given Texture Frame and draws it to this Dynamic Texture as a fill pattern,
     * i.e. in a grid-layout based on the frame dimensions.
     * It uses a `TileSprite` internally to draw the frame repeatedly.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * You can optionally provide a position, width, height, alpha and tint value to apply to
     * the frames before they are drawn. The position controls the top-left where the repeating
     * fill will start from. The width and height control the size of the filled area.
     *
     * The position can be negative if required, but the dimensions cannot.
     *
     * This method respects the camera settings of the Dynamic Texture.
     *
     * @method Phaser.Textures.DynamicTexture#repeat
     * @since 3.60.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture. Set to `null` to skip this argument if not required.
     * @param {number} [x=0] - The x position to start drawing the frames from (can be negative to offset).
     * @param {number} [y=0] - The y position to start drawing the frames from (can be negative to offset).
     * @param {number} [width=this.width] - The width of the area to repeat the frame within. Defaults to the width of this Dynamic Texture.
     * @param {number} [height=this.height] - The height of the area to repeat the frame within. Defaults to the height of this Dynamic Texture.
     * @param {Phaser.Types.GameObjects.TileSprite.TileSpriteConfig} [config] - The configuration object for the TileSprite which repeats the texture, allowing you to set further properties on it.
     *
     * @return {this} This Dynamic Texture instance.
     */
    repeat: function (key, frame, x, y, width, height, config)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        var alpha = GetFastValue(config, 'alpha', 1);
        var tint = GetFastValue(config, 'tint', 0xffffff);
        var angle = GetFastValue(config, 'angle', 0);
        var rotation = GetFastValue(config, 'rotation', 0);
        var scale = GetFastValue(config, 'scale', 1);
        var scaleX = GetFastValue(config, 'scaleX', scale);
        var scaleY = GetFastValue(config, 'scaleY', scale);
        var originX = GetFastValue(config, 'originX', 0);
        var originY = GetFastValue(config, 'originY', 0);
        var blendMode = GetFastValue(config, 'blendMode', 0);

        if (angle !== 0)
        {
            rotation = angle * Math.PI / 180;
        }

        var tilePositionX = GetFastValue(config, 'tilePositionX', 0);
        var tilePositionY = GetFastValue(config, 'tilePositionY', 0);
        var tileRotation = GetFastValue(config, 'tileRotation', 0);
        var tileScaleX = GetFastValue(config, 'tileScaleX', 1);
        var tileScaleY = GetFastValue(config, 'tileScaleY', 1);

        this.commandBuffer.push(
            DynamicTextureCommands.REPEAT,
            key, frame,
            x, y,
            alpha, tint, rotation, scaleX, scaleY, originX, originY, blendMode,
            width, height,
            tilePositionX, tilePositionY, tileRotation, tileScaleX, tileScaleY
        );

        return this;
    },

    /**
     * Sets the preserve flag for this Dynamic Texture.
     * Ordinarily, after each render, the command buffer is cleared.
     * When this flag is set to `true`, the command buffer is preserved between renders.
     * This makes it possible to repeat the same drawing commands on each render.
     *
     * Make sure to call `clear()` at the start if you don't want to accumulate
     * drawing detail over the top of itself.
     *
     * @method Phaser.Textures.DynamicTexture#preserve
     * @since 4.0.0
     * @param {boolean} preserve - Whether to preserve the command buffer after rendering.
     * @returns {this} This Dynamic Texture instance.
     */
    preserve: function (preserve)
    {
        this.commandBuffer.push(DynamicTextureCommands.PRESERVE, preserve);

        return this;
    },

    /**
     * Adds a callback to run during the render process.
     * This callback runs as a step in the command buffer.
     * It can be used to set up conditions for the next draw step.
     *
     * Note that this will only execute after `render()` is called.
     *
     * @method Phaser.Textures.DynamicTexture#callback
     * @since 4.0.0
     * @param {Function} callback - A callback function to run during the render process.
     * @returns {this} This Dynamic Texture instance.
     */
    callback: function (callback)
    {
        this.commandBuffer.push(DynamicTextureCommands.CALLBACK, callback);

        return this;
    },

    /**
     * Takes a snapshot of the given area of this Dynamic Texture.
     *
     * The snapshot is taken immediately, but the results are returned via the given callback.
     *
     * To capture the whole Dynamic Texture see the `snapshot` method.
     * To capture just a specific pixel, see the `snapshotPixel` method.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer
     * into an ArrayBufferView. It then parses this, copying the contents to a temporary Canvas and finally
     * creating an Image object from it, which is the image returned to the callback provided.
     *
     * All in all, this is a computationally expensive and blocking process, which gets more expensive
     * the larger the resolution this Dynamic Texture has, so please be careful how you employ this in your game.
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
     * @return {this} This Dynamic Texture instance.
     */
    snapshotArea: function (x, y, width, height, callback, type, encoderOptions)
    {
        if (this.drawingContext)
        {
            this.renderer.snapshotFramebuffer(this.drawingContext.framebuffer, this.width, this.height, callback, false, x, y, width, height, type, encoderOptions);
        }
        else
        {
            this.renderer.snapshotCanvas(this.canvas, callback, false, x, y, width, height, type, encoderOptions);
        }

        return this;
    },

    /**
     * Takes a snapshot of the whole of this Dynamic Texture.
     *
     * The snapshot is taken immediately, but the results are returned via the given callback.
     *
     * To capture a portion of this Dynamic Texture see the `snapshotArea` method.
     * To capture just a specific pixel, see the `snapshotPixel` method.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer
     * into an ArrayBufferView. It then parses this, copying the contents to a temporary Canvas and finally
     * creating an Image object from it, which is the image returned to the callback provided.
     *
     * All in all, this is a computationally expensive and blocking process, which gets more expensive
     * the larger the resolution this Dynamic Texture has, so please be careful how you employ this in your game.
     *
     * @method Phaser.Textures.DynamicTexture#snapshot
     * @since 3.19.0
     *
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot image is created.
     * @param {string} [type='image/png'] - The format of the image to create, usually `image/png` or `image/jpeg`.
     * @param {number} [encoderOptions=0.92] - The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`.
     *
     * @return {this} This Dynamic Texture instance.
     */
    snapshot: function (callback, type, encoderOptions)
    {
        return this.snapshotArea(0, 0, this.width, this.height, callback, type, encoderOptions);
    },

    /**
     * Takes a snapshot of the given pixel from this Dynamic Texture.
     *
     * The snapshot is taken immediately, but the results are returned via the given callback.
     *
     * To capture the whole Dynamic Texture see the `snapshot` method.
     * To capture a portion of this Dynamic Texture see the `snapshotArea` method.
     *
     * Unlike the two other snapshot methods, this one will send your callback a `Color` object
     * containing the color data for the requested pixel. It doesn't need to create an internal
     * Canvas or Image object, so is a lot faster to execute, using less memory than the other snapshot methods.
     *
     * @method Phaser.Textures.DynamicTexture#snapshotPixel
     * @since 3.19.0
     *
     * @param {number} x - The x coordinate of the pixel to get.
     * @param {number} y - The y coordinate of the pixel to get.
     * @param {Phaser.Types.Renderer.Snapshot.SnapshotCallback} callback - The Function to invoke after the snapshot pixel data is extracted.
     *
     * @return {this} This Dynamic Texture instance.
     */
    snapshotPixel: function (x, y, callback)
    {
        return this.snapshotArea(x, y, 1, 1, callback, 'pixel');
    },

    /**
     * Returns the underlying WebGLTextureWrapper, if not running in Canvas mode.
     *
     * @method Phaser.Textures.DynamicTexture#getWebGLTexture
     * @since 3.60.0
     *
     * @return {?Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} The underlying WebGLTextureWrapper, if not running in Canvas mode.
     */
    getWebGLTexture: function ()
    {
        if (this.drawingContext)
        {
            return this.drawingContext.texture;
        }
    },

    /**
     * Sets this Dynamic Texture onto the TextureManager.Stamp
     * and then calls its render method.
     *
     * @method Phaser.Textures.DynamicTexture#renderWebGL
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
     * @param {Phaser.GameObjects.Image} src - The Game Object being rendered in this call.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
     */
    renderWebGL: function (renderer, src, camera, parentMatrix)
    {
        var stamp = this.manager.resetStamp();

        stamp.setTexture(this);
        stamp.setOrigin(0);

        stamp.renderWebGLStep(renderer, stamp, camera, parentMatrix);
    },

    /**
     * This is a NOOP method. Bitmap Masks are not supported by the Canvas Renderer.
     *
     * @method Phaser.Textures.DynamicTexture#renderCanvas
     * @since 3.60.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The Canvas Renderer which would be rendered to.
     * @param {Phaser.GameObjects.GameObject} mask - The masked Game Object which would be rendered.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     */
    renderCanvas: function ()
    {
        // NOOP
    },

    /**
     * Destroys this Texture and releases references to its sources and frames.
     *
     * @method Phaser.Textures.DynamicTexture#destroy
     * @since 3.60.0
     */
    destroy: function ()
    {
        var stamp = this.manager.stamp;

        if (stamp && stamp.texture === this)
        {
            this.manager.resetStamp();
        }

        Texture.prototype.destroy.call(this);

        CanvasPool.remove(this.canvas);

        if (this.drawingContext)
        {
            this.drawingContext.destroy();
        }

        this.camera.destroy();

        this.canvas = null;
        this.context = null;
        this.renderer = null;
    }

});

module.exports = DynamicTexture;
