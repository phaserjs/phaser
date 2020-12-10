/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Clamp = require('../math/Clamp');
var Color = require('../display/color/Color');
var CONST = require('../const');
var IsSizePowerOfTwo = require('../math/pow2/IsSizePowerOfTwo');
var Texture = require('./Texture');

/**
 * @classdesc
 * A Canvas Texture is a special kind of Texture that is backed by an HTML Canvas Element as its source.
 *
 * You can use the properties of this texture to draw to the canvas element directly, using all of the standard
 * canvas operations available in the browser. Any Game Object can be given this texture and will render with it.
 *
 * Note: When running under WebGL the Canvas Texture needs to re-generate its base WebGLTexture and reupload it to
 * the GPU every time you modify it, otherwise the changes you make to this texture will not be visible. To do this
 * you should call `CanvasTexture.refresh()` once you are finished with your changes to the canvas. Try and keep
 * this to a minimum, especially on large canvas sizes, or you may inadvertently thrash the GPU by constantly uploading
 * texture data to it. This restriction does not apply if using the Canvas Renderer.
 *
 * It starts with only one frame that covers the whole of the canvas. You can add further frames, that specify
 * sections of the canvas using the `add` method.
 *
 * Should you need to resize the canvas use the `setSize` method so that it accurately updates all of the underlying
 * texture data as well. Forgetting to do this (i.e. by changing the canvas size directly from your code) could cause
 * graphical errors.
 *
 * @class CanvasTexture
 * @extends Phaser.Textures.Texture
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Textures.TextureManager} manager - A reference to the Texture Manager this Texture belongs to.
 * @param {string} key - The unique string-based key of this Texture.
 * @param {HTMLCanvasElement} source - The canvas element that is used as the base of this texture.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 */
var CanvasTexture = new Class({

    Extends: Texture,

    initialize:

    function CanvasTexture (manager, key, source, width, height)
    {
        Texture.call(this, manager, key, source, width, height);

        this.add('__BASE', 0, 0, 0, width, height);

        /**
         * A reference to the Texture Source of this Canvas.
         *
         * @name Phaser.Textures.CanvasTexture#_source
         * @type {Phaser.Textures.TextureSource}
         * @private
         * @since 3.7.0
         */
        this._source = this.frames['__BASE'].source;

        /**
         * The source Canvas Element.
         *
         * @name Phaser.Textures.CanvasTexture#canvas
         * @readonly
         * @type {HTMLCanvasElement}
         * @since 3.7.0
         */
        this.canvas = this._source.image;

        /**
         * The 2D Canvas Rendering Context.
         *
         * @name Phaser.Textures.CanvasTexture#context
         * @readonly
         * @type {CanvasRenderingContext2D}
         * @since 3.7.0
         */
        this.context = this.canvas.getContext('2d');

        /**
         * The width of the Canvas.
         * This property is read-only, if you wish to change it use the `setSize` method.
         *
         * @name Phaser.Textures.CanvasTexture#width
         * @readonly
         * @type {number}
         * @since 3.7.0
         */
        this.width = width;

        /**
         * The height of the Canvas.
         * This property is read-only, if you wish to change it use the `setSize` method.
         *
         * @name Phaser.Textures.CanvasTexture#height
         * @readonly
         * @type {number}
         * @since 3.7.0
         */
        this.height = height;

        /**
         * The context image data.
         * Use the `update` method to populate this when the canvas changes.
         *
         * @name Phaser.Textures.CanvasTexture#imageData
         * @type {ImageData}
         * @since 3.13.0
         */
        this.imageData = this.context.getImageData(0, 0, width, height);

        /**
         * A Uint8ClampedArray view into the `buffer`.
         * Use the `update` method to populate this when the canvas changes.
         * Note that this is unavailable in some browsers, such as Epic Browser, due to their security restrictions.
         *
         * @name Phaser.Textures.CanvasTexture#data
         * @type {Uint8ClampedArray}
         * @since 3.13.0
         */
        this.data = null;

        if (this.imageData)
        {
            this.data = this.imageData.data;
        }

        /**
         * An Uint32Array view into the `buffer`.
         *
         * @name Phaser.Textures.CanvasTexture#pixels
         * @type {Uint32Array}
         * @since 3.13.0
         */
        this.pixels = null;

        /**
         * An ArrayBuffer the same size as the context ImageData.
         *
         * @name Phaser.Textures.CanvasTexture#buffer
         * @type {ArrayBuffer}
         * @since 3.13.0
         */
        this.buffer;

        if (this.data)
        {
            if (this.imageData.data.buffer)
            {
                this.buffer = this.imageData.data.buffer;
                this.pixels = new Uint32Array(this.buffer);
            }
            else if (window.ArrayBuffer)
            {
                this.buffer = new ArrayBuffer(this.imageData.data.length);
                this.pixels = new Uint32Array(this.buffer);
            }
            else
            {
                this.pixels = this.imageData.data;
            }
        }
    },

    /**
     * This re-creates the `imageData` from the current context.
     * It then re-builds the ArrayBuffer, the `data` Uint8ClampedArray reference and the `pixels` Int32Array.
     *
     * Warning: This is a very expensive operation, so use it sparingly.
     *
     * @method Phaser.Textures.CanvasTexture#update
     * @since 3.13.0
     *
     * @return {Phaser.Textures.CanvasTexture} This CanvasTexture.
     */
    update: function ()
    {
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);

        this.data = this.imageData.data;

        if (this.imageData.data.buffer)
        {
            this.buffer = this.imageData.data.buffer;
            this.pixels = new Uint32Array(this.buffer);
        }
        else if (window.ArrayBuffer)
        {
            this.buffer = new ArrayBuffer(this.imageData.data.length);
            this.pixels = new Uint32Array(this.buffer);
        }
        else
        {
            this.pixels = this.imageData.data;
        }

        if (this.manager.game.config.renderType === CONST.WEBGL)
        {
            this.refresh();
        }

        return this;
    },

    /**
     * Draws the given Image or Canvas element to this CanvasTexture, then updates the internal
     * ImageData buffer and arrays.
     *
     * @method Phaser.Textures.CanvasTexture#draw
     * @since 3.13.0
     *
     * @param {number} x - The x coordinate to draw the source at.
     * @param {number} y - The y coordinate to draw the source at.
     * @param {(HTMLImageElement|HTMLCanvasElement)} source - The element to draw to this canvas.
     *
     * @return {Phaser.Textures.CanvasTexture} This CanvasTexture.
     */
    draw: function (x, y, source)
    {
        this.context.drawImage(source, x, y);

        return this.update();
    },

    /**
     * Draws the given texture frame to this CanvasTexture, then updates the internal
     * ImageData buffer and arrays.
     *
     * @method Phaser.Textures.CanvasTexture#drawFrame
     * @since 3.16.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|number)} [frame] - The string-based name, or integer based index, of the Frame to get from the Texture.
     * @param {number} [x=0] - The x coordinate to draw the source at.
     * @param {number} [y=0] - The y coordinate to draw the source at.
     *
     * @return {Phaser.Textures.CanvasTexture} This CanvasTexture.
     */
    drawFrame: function (key, frame, x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        var textureFrame = this.manager.getFrame(key, frame);

        if (textureFrame)
        {
            var cd = textureFrame.canvasData;

            var width = textureFrame.cutWidth;
            var height = textureFrame.cutHeight;
            var res = textureFrame.source.resolution;

            this.context.drawImage(
                textureFrame.source.image,
                cd.x, cd.y,
                width,
                height,
                x, y,
                width / res,
                height / res
            );

            return this.update();
        }
        else
        {
            return this;
        }
    },

    /**
     * Sets a pixel in the CanvasTexture to the given color and alpha values.
     *
     * This is an expensive operation to run in large quantities, so use sparingly.
     *
     * @method Phaser.Textures.CanvasTexture#setPixel
     * @since 3.16.0
     *
     * @param {number} x - The x coordinate of the pixel to get. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} y - The y coordinate of the pixel to get. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} red - The red color value. A number between 0 and 255.
     * @param {number} green - The green color value. A number between 0 and 255.
     * @param {number} blue - The blue color value. A number between 0 and 255.
     * @param {number} [alpha=255] - The alpha value. A number between 0 and 255.
     *
     * @return {this} This CanvasTexture.
     */
    setPixel: function (x, y, red, green, blue, alpha)
    {
        if (alpha === undefined) { alpha = 255; }

        x = Math.abs(Math.floor(x));
        y = Math.abs(Math.floor(y));

        var index = this.getIndex(x, y);

        if (index > -1)
        {
            var imageData = this.context.getImageData(x, y, 1, 1);

            imageData.data[0] = red;
            imageData.data[1] = green;
            imageData.data[2] = blue;
            imageData.data[3] = alpha;

            this.context.putImageData(imageData, x, y);
        }

        return this;
    },

    /**
     * Puts the ImageData into the context of this CanvasTexture at the given coordinates.
     *
     * @method Phaser.Textures.CanvasTexture#putData
     * @since 3.16.0
     *
     * @param {ImageData} imageData - The ImageData to put at the given location.
     * @param {number} x - The x coordinate to put the imageData. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} y - The y coordinate to put the imageData. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} [dirtyX=0] - Horizontal position (x coordinate) of the top-left corner from which the image data will be extracted.
     * @param {number} [dirtyY=0] - Vertical position (x coordinate) of the top-left corner from which the image data will be extracted.
     * @param {number} [dirtyWidth] - Width of the rectangle to be painted. Defaults to the width of the image data.
     * @param {number} [dirtyHeight] - Height of the rectangle to be painted. Defaults to the height of the image data.
     *
     * @return {this} This CanvasTexture.
     */
    putData: function (imageData, x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight)
    {
        if (dirtyX === undefined) { dirtyX = 0; }
        if (dirtyY === undefined) { dirtyY = 0; }
        if (dirtyWidth === undefined) { dirtyWidth = imageData.width; }
        if (dirtyHeight === undefined) { dirtyHeight = imageData.height; }

        this.context.putImageData(imageData, x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight);

        return this;
    },

    /**
     * Gets an ImageData region from this CanvasTexture from the position and size specified.
     * You can write this back using `CanvasTexture.putData`, or manipulate it.
     *
     * @method Phaser.Textures.CanvasTexture#getData
     * @since 3.16.0
     *
     * @param {number} x - The x coordinate of the top-left of the area to get the ImageData from. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} y - The y coordinate of the top-left of the area to get the ImageData from. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} width - The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
     * @param {number} height - The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
     *
     * @return {ImageData} The ImageData extracted from this CanvasTexture.
     */
    getData: function (x, y, width, height)
    {
        x = Clamp(Math.floor(x), 0, this.width - 1);
        y = Clamp(Math.floor(y), 0, this.height - 1);
        width = Clamp(width, 1, this.width - x);
        height = Clamp(height, 1, this.height - y);

        var imageData = this.context.getImageData(x, y, width, height);

        return imageData;
    },

    /**
     * Get the color of a specific pixel from this texture and store it in a Color object.
     *
     * If you have drawn anything to this CanvasTexture since it was created you must call `CanvasTexture.update` to refresh the array buffer,
     * otherwise this may return out of date color values, or worse - throw a run-time error as it tries to access an array element that doesn't exist.
     *
     * @method Phaser.Textures.CanvasTexture#getPixel
     * @since 3.13.0
     *
     * @param {number} x - The x coordinate of the pixel to get. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} y - The y coordinate of the pixel to get. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {Phaser.Display.Color} [out] - A Color object to store the pixel values in. If not provided a new Color object will be created.
     *
     * @return {Phaser.Display.Color} An object with the red, green, blue and alpha values set in the r, g, b and a properties.
     */
    getPixel: function (x, y, out)
    {
        if (!out)
        {
            out = new Color();
        }

        var index = this.getIndex(x, y);

        if (index > -1)
        {
            var data = this.data;

            var r = data[index + 0];
            var g = data[index + 1];
            var b = data[index + 2];
            var a = data[index + 3];

            out.setTo(r, g, b, a);
        }

        return out;
    },

    /**
     * Returns an array containing all of the pixels in the given region.
     *
     * If the requested region extends outside the bounds of this CanvasTexture,
     * the region is truncated to fit.
     *
     * If you have drawn anything to this CanvasTexture since it was created you must call `CanvasTexture.update` to refresh the array buffer,
     * otherwise this may return out of date color values, or worse - throw a run-time error as it tries to access an array element that doesn't exist.
     *
     * @method Phaser.Textures.CanvasTexture#getPixels
     * @since 3.16.0
     *
     * @param {number} [x=0] - The x coordinate of the top-left of the region. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} [y=0] - The y coordinate of the top-left of the region. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} [width] - The width of the region to get. Must be an integer. Defaults to the canvas width if not given.
     * @param {number} [height] - The height of the region to get. Must be an integer. If not given will be set to the `width`.
     *
     * @return {Phaser.Types.Textures.PixelConfig[][]} A 2d array of Pixel objects.
     */
    getPixels: function (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = width; }

        x = Math.abs(Math.round(x));
        y = Math.abs(Math.round(y));

        var left = Clamp(x, 0, this.width);
        var right = Clamp(x + width, 0, this.width);
        var top = Clamp(y, 0, this.height);
        var bottom = Clamp(y + height, 0, this.height);

        var pixel = new Color();

        var out = [];

        for (var py = top; py < bottom; py++)
        {
            var row = [];

            for (var px = left; px < right; px++)
            {
                pixel = this.getPixel(px, py, pixel);

                row.push({ x: px, y: py, color: pixel.color, alpha: pixel.alphaGL });
            }

            out.push(row);
        }

        return out;
    },

    /**
     * Returns the Image Data index for the given pixel in this CanvasTexture.
     *
     * The index can be used to read directly from the `this.data` array.
     *
     * The index points to the red value in the array. The subsequent 3 indexes
     * point to green, blue and alpha respectively.
     *
     * @method Phaser.Textures.CanvasTexture#getIndex
     * @since 3.16.0
     *
     * @param {number} x - The x coordinate of the pixel to get. Must lay within the dimensions of this CanvasTexture and be an integer.
     * @param {number} y - The y coordinate of the pixel to get. Must lay within the dimensions of this CanvasTexture and be an integer.
     *
     * @return {number}
     */
    getIndex: function (x, y)
    {
        x = Math.abs(Math.round(x));
        y = Math.abs(Math.round(y));

        if (x < this.width && y < this.height)
        {
            return (x + y * this.width) * 4;
        }
        else
        {
            return -1;
        }
    },

    /**
     * This should be called manually if you are running under WebGL.
     * It will refresh the WebGLTexture from the Canvas source. Only call this if you know that the
     * canvas has changed, as there is a significant GPU texture allocation cost involved in doing so.
     *
     * @method Phaser.Textures.CanvasTexture#refresh
     * @since 3.7.0
     *
     * @return {Phaser.Textures.CanvasTexture} This CanvasTexture.
     */
    refresh: function ()
    {
        this._source.update();

        return this;
    },

    /**
     * Gets the Canvas Element.
     *
     * @method Phaser.Textures.CanvasTexture#getCanvas
     * @since 3.7.0
     *
     * @return {HTMLCanvasElement} The Canvas DOM element this texture is using.
     */
    getCanvas: function ()
    {
        return this.canvas;
    },

    /**
     * Gets the 2D Canvas Rendering Context.
     *
     * @method Phaser.Textures.CanvasTexture#getContext
     * @since 3.7.0
     *
     * @return {CanvasRenderingContext2D} The Canvas Rendering Context this texture is using.
     */
    getContext: function ()
    {
        return this.context;
    },

    /**
     * Clears the given region of this Canvas Texture, resetting it back to transparent.
     * If no region is given, the whole Canvas Texture is cleared.
     *
     * @method Phaser.Textures.CanvasTexture#clear
     * @since 3.7.0
     *
     * @param {number} [x=0] - The x coordinate of the top-left of the region to clear.
     * @param {number} [y=0] - The y coordinate of the top-left of the region to clear.
     * @param {number} [width] - The width of the region.
     * @param {number} [height] - The height of the region.
     *
     * @return {Phaser.Textures.CanvasTexture} The Canvas Texture.
     */
    clear: function (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.width; }
        if (height === undefined) { height = this.height; }

        this.context.clearRect(x, y, width, height);

        return this.update();
    },

    /**
     * Changes the size of this Canvas Texture.
     *
     * @method Phaser.Textures.CanvasTexture#setSize
     * @since 3.7.0
     *
     * @param {number} width - The new width of the Canvas.
     * @param {number} [height] - The new height of the Canvas. If not given it will use the width as the height.
     *
     * @return {Phaser.Textures.CanvasTexture} The Canvas Texture.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        if (width !== this.width || height !== this.height)
        {
            //  Update the Canvas
            this.canvas.width = width;
            this.canvas.height = height;

            //  Update the Texture Source
            this._source.width = width;
            this._source.height = height;
            this._source.isPowerOf2 = IsSizePowerOfTwo(width, height);

            //  Update the Frame
            this.frames['__BASE'].setSize(width, height, 0, 0);

            //  Update this
            this.width = width;
            this.height = height;

            this.refresh();
        }

        return this;
    },

    /**
     * Destroys this Texture and releases references to its sources and frames.
     *
     * @method Phaser.Textures.CanvasTexture#destroy
     * @since 3.16.0
     */
    destroy: function ()
    {
        Texture.prototype.destroy.call(this);

        this._source = null;
        this.canvas = null;
        this.context = null;
        this.imageData = null;
        this.data = null;
        this.pixels = null;
        this.buffer = null;
    }

});

module.exports = CanvasTexture;
