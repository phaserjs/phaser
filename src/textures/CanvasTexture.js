/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Color = require('../display/color/Color');
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
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Textures.CanvasTexture} manager - A reference to the Texture Manager this Texture belongs to.
 * @param {string} key - The unique string-based key of this Texture.
 * @param {HTMLCanvasElement} source - The canvas element that is used as the base of this texture.
 * @param {integer} width - The width of the canvas.
 * @param {integer} height - The height of the canvas.
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
         * @name Phaser.Textures.CanvasTexturer#_source
         * @type {Phaser.Textures.TextureSource}
         * @private
         * @since 3.7.0
         */
        this._source = this.frames['__BASE'].source;

        /**
         * The source Canvas Element.
         *
         * @name Phaser.Textures.CanvasTexture#canvas
         * @readOnly
         * @type {HTMLCanvasElement}
         * @since 3.7.0
         */
        this.canvas = this._source.image;

        /**
         * The 2D Canvas Rendering Context.
         *
         * @name Phaser.Textures.CanvasTexture#canvas
         * @readOnly
         * @type {CanvasRenderingContext2D}
         * @since 3.7.0
         */
        this.context = this.canvas.getContext('2d');

        /**
         * The width of the Canvas.
         * This property is read-only, if you wish to change use `setSize`.
         *
         * @name Phaser.Textures.CanvasTexture#width
         * @readOnly
         * @type {integer}
         * @since 3.7.0
         */
        this.width = width;

        /**
         * The height of the Canvas.
         * This property is read-only, if you wish to change use `setSize`.
         *
         * @name Phaser.Textures.CanvasTexture#height
         * @readOnly
         * @type {integer}
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
         * @name Phaser.Textures.CanvasTexture#imageData
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
            else
            if (window.ArrayBuffer)
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
        this.imageData = this.context.getImageData(0, 0, this.context.width, this.context.height);

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

        return this;
    },

    /**
     * Get the color of a specific pixel in the context into a color object.
     * 
     * If you have drawn anything to the CanvasTexture since it was created you must call CanvasTexture.update to refresh the array buffer,
     * otherwise this may return out of date color values, or worse - throw a run-time error as it tries to access an array element that doesn't exist.
     *
     * @method Phaser.Textures.CanvasTexture#getPixel
     * @since 3.13.0
     * 
     * @param {integer} x - The x coordinate of the pixel to be set. Must lay within the dimensions of this CanvasTexture and be an integer, not a float.
     * @param {integer} y - The y coordinate of the pixel to be set. Must lay within the dimensions of this CanvasTexture and be an integer, not a float.
     * @param {object} [out] - An object into which 4 properties will be created: r, g, b and a. If not provided a new object will be created.
     * 
     * @return {object} An object with the red, green, blue and alpha values set in the r, g, b and a properties.
     */
    getPixel: function (x, y, out)
    {
        if (!out)
        {
            out = new Color();
        }

        var index = ~~(x + (y * this.width));

        index *= 4;

        out.r = this.data[index];
        out.g = this.data[++index];
        out.b = this.data[++index];
        out.a = this.data[++index];

        return out;
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
     * Clears this Canvas Texture, resetting it back to transparent.
     *
     * @method Phaser.Textures.CanvasTexture#clear
     * @since 3.7.0
     *
     * @return {Phaser.Textures.CanvasTexture} The Canvas Texture.
     */
    clear: function ()
    {
        this.context.clearRect(0, 0, this.width, this.height);

        return this;
    },

    /**
     * Changes the size of this Canvas Texture.
     *
     * @method Phaser.Textures.CanvasTexture#setSize
     * @since 3.7.0
     *
     * @param {integer} width - The new width of the Canvas.
     * @param {integer} [height] - The new height of the Canvas. If not given it will use the width as the height.
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

            this.refresh();
        }

        return this;
    }

});

module.exports = CanvasTexture;
