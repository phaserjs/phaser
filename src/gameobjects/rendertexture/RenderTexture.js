/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DynamicTexture = require('../../textures/DynamicTexture');
var Image = require('../image/Image');

/**
 * @classdesc
 * A Render Texture is a combination of Dynamic Texture and an Image Game Object, that uses the
 * Dynamic Texture to display itself with.
 *
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
 * In versions of Phaser before 3.60 a Render Texture was the only way you could create a texture
 * like this, that had the ability to be drawn on. But in 3.60 we split the core functions out to
 * the Dynamic Texture class as it made a lot more sense for them to reside in there. As a result,
 * the Render Texture is now a light-weight shim that sits on-top of an Image Game Object and offers
 * proxy methods to the features available from a Dynamic Texture.
 *
 * **When should you use a Render Texture vs. a Dynamic Texture?**
 *
 * You should use a Dynamic Texture if the texture is going to be used by multiple Game Objects,
 * or you want to use it across multiple Scenes, because textures are globally stored.
 *
 * You should use a Dynamic Texture if the texture isn't going to be displayed in-game, but is
 * instead going to be used for something like a mask or shader.
 *
 * You should use a Render Texture if you need to display the texture in-game on a single Game Object,
 * as it provides the convenience of wrapping an Image and Dynamic Texture together for you.
 *
 * Under WebGL1, a FrameBuffer, which is what this Dynamic Texture uses internally, cannot be anti-aliased.
 * This means that when drawing objects such as Shapes or Graphics instances to this texture, they may appear
 * to be drawn with no aliasing around the edges. This is a technical limitation of WebGL1. To get around it,
 * create your shape as a texture in an art package, then draw that to this texture.
 *
 * @class RenderTexture
 * @extends Phaser.GameObjects.Image
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.2.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=32] - The width of the Render Texture.
 * @param {number} [height=32] - The height of the Render Texture.
 */
var RenderTexture = new Class({

    Extends: Image,

    initialize:

    function RenderTexture (scene, x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 32; }
        if (height === undefined) { height = 32; }

        var dynamicTexture = new DynamicTexture(scene.sys.textures, '', width, height);

        Image.call(this, scene, x, y, dynamicTexture);

        this.type = 'RenderTexture';

        /**
         * An internal Camera that can be used to move around this Render Texture.
         *
         * Control it just like you would any Scene Camera. The difference is that it only impacts
         * the placement of Game Objects that you then draw to this texture.
         *
         * You can scroll, zoom and rotate this Camera.
         *
         * This property is a reference to `RenderTexture.texture.camera`.
         *
         * @name Phaser.GameObjects.RenderTexture#camera
         * @type {Phaser.Cameras.Scene2D.BaseCamera}
         * @since 3.12.0
         */
        this.camera = this.texture.camera;

        /**
         * Internal saved texture flag.
         *
         * @name Phaser.GameObjects.RenderTexture#_saved
         * @type {boolean}
         * @private
         * @since 3.12.0
         */
        this._saved = false;
    },

    /**
     * Sets the internal size of this Render Texture, as used for frame or physics body creation.
     *
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     *
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
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
        this.width = width;
        this.height = height;

        this.texture.setSize(width, height);

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
     * Resizes the Render Texture to the new dimensions given.
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
        this.setSize(width, height);

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
     * @return {Phaser.Textures.DynamicTexture} The Texture that was saved.
     */
    saveTexture: function (key)
    {
        var texture = this.texture;

        texture.key = key;

        if (texture.manager.addDynamicTexture(texture))
        {
            this._saved = true;
        }

        return texture;
    },

    /**
     * Fills this Render Texture with the given color.
     *
     * By default it will fill the entire texture, however you can set it to fill a specific
     * rectangular area by using the x, y, width and height arguments.
     *
     * The color should be given in hex format, i.e. 0xff0000 for red, 0x00ff00 for green, etc.
     *
     * @method Phaser.GameObjects.RenderTexture#fill
     * @since 3.2.0
     *
     * @param {number} rgb - The color to fill this Render Texture with, such as 0xff0000 for red.
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
        this.texture.fill(rgb, alpha, x, y, width, height);

        return this;
    },

    /**
     * Fully clears this Render Texture, erasing everything from it and resetting it back to
     * a blank, transparent, texture.
     *
     * @method Phaser.GameObjects.RenderTexture#clear
     * @since 3.2.0
     *
     * @return {this} This Render Texture instance.
     */
    clear: function ()
    {
        this.texture.clear();

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
     * @method Phaser.GameObjects.RenderTexture#stamp
     * @since 3.60.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture. Set to `null` to skip this argument if not required.
     * @param {number} [x=0] - The x position to draw the frame at.
     * @param {number} [y=0] - The y position to draw the frame at.
     * @param {Phaser.Types.Textures.StampConfig} [config] - The stamp configuration object, allowing you to set the alpha, tint, angle, scale and origin of the stamp.
     *
     * @return {this} This Render Texture instance.
     */
    stamp: function (key, frame, x, y, config)
    {
        this.texture.stamp(key, frame, x, y, config);

        return this;
    },

    /**
     * Draws the given object, or an array of objects, to this Render Texture using a blend mode of ERASE.
     * This has the effect of erasing any filled pixels present in the objects from this texture.
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
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, Render Texture, Texture Frame, or an array of any of these.
     * @param {number} [x=0] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y=0] - The y position to draw the Frame at, or the offset applied to the object.
     *
     * @return {this} This Render Texture instance.
     */
    erase: function (entries, x, y)
    {
        this.texture.erase(entries, x, y);

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
     * * A Scene Display List. Pass in `Scene.children` to draw the whole list.
     * * Another Dynamic Texture, or a Render Texture.
     * * A Texture Frame instance.
     * * A string. This is used to look-up the texture from the Texture Manager.
     *
     * Note 1: You cannot draw a Render Texture to itself.
     *
     * Note 2: For Game Objects that have Post FX Pipelines, the pipeline _cannot_ be
     * used when drawn to this texture.
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
     * @param {number} [x=0] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y=0] - The y position to draw the Frame at, or the offset applied to the object.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     *
     * @return {this} This Render Texture instance.
     */
    draw: function (entries, x, y, alpha, tint)
    {
        this.texture.draw(entries, x, y, alpha, tint);

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
        this.texture.drawFrame(key, frame, x, y, alpha, tint);

        return this;
    },

    /**
     * Takes the given Texture Frame and draws it to this Render Texture as a fill pattern,
     * i.e. in a grid-layout based on the frame dimensions.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * You can optionally provide a position, width, height, alpha and tint value to apply to
     * the frames before they are drawn. The position controls the top-left where the repeating
     * fill will start from. The width and height control the size of the filled area.
     *
     * The position can be negative if required, but the dimensions cannot.
     *
     * Calling this method will cause a batch flush by default. Use the `skipBatch` argument
     * to disable this if this call is part of a larger batch draw.
     *
     * @method Phaser.GameObjects.RenderTexture#repeat
     * @since 3.60.0
     *
     * @param {string} key - The key of the texture to be used, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - The name or index of the frame within the Texture. Set to `null` to skip this argument if not required.
     * @param {number} [x=0] - The x position to start drawing the frames from (can be negative to offset).
     * @param {number} [y=0] - The y position to start drawing the frames from (can be negative to offset).
     * @param {number} [width=this.width] - The width of the area to repeat the frame within. Defaults to the width of this Dynamic Texture.
     * @param {number} [height=this.height] - The height of the area to repeat the frame within. Defaults to the height of this Dynamic Texture.
     * @param {number} [alpha=1] - The alpha to use. Defaults to 1, no alpha.
     * @param {number} [tint=0xffffff] - WebGL only. The tint color to use. Leave as undefined, or 0xffffff to have no tint.
     * @param {boolean} [skipBatch=false] - Skip beginning and ending a batch with this call. Use if this is part of a bigger batched draw.
     *
     * @return {this} This Render Texture instance.
     */
    repeat: function (key, frame, x, y, width, height, alpha, tint, skipBatch)
    {
        this.texture.repeat(key, frame, x, y, width, height, alpha, tint, skipBatch);

        return this;
    },

    /**
     * Use this method if you need to batch draw a large number of Game Objects to
     * this Render Texture in a single pass, or on a frequent basis. This is especially
     * useful under WebGL, however, if your game is using Canvas only, it will not make
     * any speed difference in that situation.
     *
     * This method starts the beginning of a batched draw, unless one is already open.
     *
     * Batched drawing is faster than calling `draw` in loop, but you must be careful
     * to manage the flow of code and remember to call `endDraw()` when you're finished.
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
     * batch is still open. Doing so will cause a run-time error in the WebGL Renderer.
     *
     * You can use the `RenderTexture.texture.isDrawing` boolean property to tell if a batch is
     * currently open, or not.
     *
     * @method Phaser.GameObjects.RenderTexture#beginDraw
     * @since 3.50.0
     *
     * @return {this} This Render Texture instance.
     */
    beginDraw: function ()
    {
        this.texture.beginDraw();

        return this;
    },

    /**
     * Use this method if you have already called `beginDraw` and need to batch
     * draw a large number of objects to this Render Texture.
     *
     * This method batches the drawing of the given objects to this texture,
     * without causing a WebGL bind or batch flush for each one.
     *
     * It is faster than calling `draw`, but you must be careful to manage the
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
     * batch is still open. Doing so will cause a run-time error in the WebGL Renderer.
     *
     * You can use the `RenderTexture.texture.isDrawing` boolean property to tell if a batch is
     * currently open, or not.
     *
     * This method can accept any of the following:
     *
     * * Any renderable Game Object, such as a Sprite, Text, Graphics or TileSprite.
     * * Tilemap Layers.
     * * A Group. The contents of which will be iterated and drawn in turn.
     * * A Container. The contents of which will be iterated fully, and drawn in turn.
     * * A Scene's Display List. Pass in `Scene.children` to draw the whole list.
     * * Another Dynamic Texture or Render Texture.
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
     * @param {any} entries - Any renderable Game Object, or Group, Container, Display List, other Dynamic or Texture, Texture Frame or an array of any of these.
     * @param {number} [x=0] - The x position to draw the Frame at, or the offset applied to the object.
     * @param {number} [y=0] - The y position to draw the Frame at, or the offset applied to the object.
     * @param {number} [alpha=1] -  The alpha value. Only used when drawing Texture Frames to this texture. Game Objects use their own alpha.
     * @param {number} [tint=0xffffff] -  The tint color value. Only used when drawing Texture Frames to this texture. Game Objects use their own tint. WebGL only.
     *
     * @return {this} This Render Texture instance.
     */
    batchDraw: function (entries, x, y, alpha, tint)
    {
        this.texture.batchDraw(entries, x, y, alpha, tint);

        return this;
    },

    /**
     * Use this method if you have already called `beginDraw` and need to batch
     * draw a large number of texture frames to this Render Texture.
     *
     * This method batches the drawing of the given frames to this Render Texture,
     * without causing a WebGL bind or batch flush for each one.
     *
     * It is faster than calling `drawFrame`, but you must be careful to manage the
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
     * batch is still open. Doing so will cause a run-time error in the WebGL Renderer.
     *
     * You can use the `RenderTexture.texture.isDrawing` boolean property to tell if a batch is
     * currently open, or not.
     *
     * Textures are referenced by their string-based keys, as stored in the Texture Manager.
     *
     * You can optionally provide a position, alpha and tint value to apply to the frame
     * before it is drawn.
     *
     * @method Phaser.GameObjects.RenderTexture#batchDrawFrame
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
        this.texture.batchDrawFrame(key, frame, x, y, alpha, tint);

        return this;
    },

    /**
     * Use this method to finish batch drawing to this Render Texture.
     *
     * Doing so will stop the WebGL Renderer from capturing draws and then blit the
     * framebuffer to the Render Target owned by this texture.
     *
     * Calling this method without first calling `beginDraw` will have no effect.
     *
     * Batch drawing is faster than calling `draw`, but you must be careful to manage the
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
     * batch is still open. Doing so will cause a run-time error in the WebGL Renderer.
     *
     * You can use the `RenderTexture.texture.isDrawing` boolean property to tell if a batch is
     * currently open, or not.
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
        this.texture.endDraw(erase);

        return this;
    },

    /**
     * Takes a snapshot of the given area of this Render Texture.
     *
     * The snapshot is taken immediately, but the results are returned via the given callback.
     *
     * To capture the whole Render Texture see the `snapshot` method.
     * To capture just a specific pixel, see the `snapshotPixel` method.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer
     * into an ArrayBufferView. It then parses this, copying the contents to a temporary Canvas and finally
     * creating an Image object from it, which is the image returned to the callback provided.
     *
     * All in all, this is a computationally expensive and blocking process, which gets more expensive
     * the larger the resolution this Render Texture has, so please be careful how you employ this in your game.
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
        this.texture.snapshotArea(x, y, width, height, callback, type, encoderOptions);

        return this;
    },

    /**
     * Takes a snapshot of the whole of this Render Texture.
     *
     * The snapshot is taken immediately, but the results are returned via the given callback.
     *
     * To capture a portion of this Render Texture see the `snapshotArea` method.
     * To capture just a specific pixel, see the `snapshotPixel` method.
     *
     * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer
     * into an ArrayBufferView. It then parses this, copying the contents to a temporary Canvas and finally
     * creating an Image object from it, which is the image returned to the callback provided.
     *
     * All in all, this is a computationally expensive and blocking process, which gets more expensive
     * the larger the resolution this Render Texture has, so please be careful how you employ this in your game.
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
        return this.snapshotArea(0, 0, this.width, this.height, callback, type, encoderOptions);
    },

    /**
     * Takes a snapshot of the given pixel from this Render Texture.
     *
     * The snapshot is taken immediately, but the results are returned via the given callback.
     *
     * To capture the whole Render Texture see the `snapshot` method.
     * To capture a portion of this Render Texture see the `snapshotArea` method.
     *
     * Unlike the two other snapshot methods, this one will send your callback a `Color` object
     * containing the color data for the requested pixel. It doesn't need to create an internal
     * Canvas or Image object, so is a lot faster to execute, using less memory than the other snapshot methods.
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
        return this.snapshotArea(x, y, 1, 1, callback, 'pixel');
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
        this.camera = null;

        if (!this._saved)
        {
            this.texture.destroy();
        }
    }

});

module.exports = RenderTexture;
