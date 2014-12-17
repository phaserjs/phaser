/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A BitmapData object contains a Canvas element to which you can draw anything you like via normal Canvas context operations.
* A single BitmapData can be used as the texture for one or many Images/Sprites. 
* So if you need to dynamically create a Sprite texture then they are a good choice.
*
* @class Phaser.BitmapData
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {string} key - Internal Phaser reference key for the render texture.
* @param {number} [width=256] - The width of the BitmapData in pixels.
* @param {number} [height=256] - The height of the BitmapData in pixels.
*/
Phaser.BitmapData = function (game, key, width, height) {

    if (typeof width === 'undefined') { width = 256; }
    if (typeof height === 'undefined') { height = 256; }

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {string} key - The key of the BitmapData in the Cache, if stored there.
    */
    this.key = key;

    /**
    * @property {number} width - The width of the BitmapData in pixels.
    */
    this.width = width;

    /**
    * @property {number} height - The height of the BitmapData in pixels.
    */
    this.height = height;

    /**
    * @property {HTMLCanvasElement} canvas - The canvas to which this BitmapData draws.
    * @default
    */
    this.canvas = Phaser.Canvas.create(width, height, '', true);

    /**
    * @property {CanvasRenderingContext2D} context - The 2d context of the canvas.
    * @default
    */
    this.context = this.canvas.getContext('2d', { alpha: true });

    /**
    * @property {CanvasRenderingContext2D} ctx - A reference to BitmapData.context.
    */
    this.ctx = this.context;

    /**
    * @property {ImageData} imageData - The context image data.
    */
    this.imageData = this.context.getImageData(0, 0, width, height);

    /**
    * @property {Uint8ClampedArray} data - A Uint8ClampedArray view into BitmapData.buffer.
    */
    this.data = this.imageData.data;

    /**
    * @property {Uint32Array} pixels - An Uint32Array view into BitmapData.buffer.
    */
    this.pixels = null;

    /**
    * @property {ArrayBuffer} buffer - An ArrayBuffer the same size as the context ImageData.
    */
    if (this.imageData.data.buffer)
    {
        this.buffer = this.imageData.data.buffer;
        this.pixels = new Uint32Array(this.buffer);
    }
    else
    {
        if (window['ArrayBuffer'])
        {
            this.buffer = new ArrayBuffer(this.imageData.data.length);
            this.pixels = new Uint32Array(this.buffer);
        }
        else
        {
            this.pixels = this.imageData.data;
        }
    }

    /**
    * @property {PIXI.BaseTexture} baseTexture - The PIXI.BaseTexture.
    * @default
    */
    this.baseTexture = new PIXI.BaseTexture(this.canvas);

    /**
    * @property {PIXI.Texture} texture - The PIXI.Texture.
    * @default
    */
    this.texture = new PIXI.Texture(this.baseTexture);

    /**
    * @property {Phaser.Frame} textureFrame - The Frame this BitmapData uses for rendering.
    * @default
    */
    this.textureFrame = new Phaser.Frame(0, 0, 0, width, height, 'bitmapData', game.rnd.uuid());

    this.texture.frame = this.textureFrame;

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.BITMAPDATA;

    /**
    * @property {boolean} disableTextureUpload - If disableTextureUpload is true this BitmapData will never send its image data to the GPU when its dirty flag is true.
    */
    this.disableTextureUpload = false;

    /**
    * @property {boolean} dirty - If dirty this BitmapData will be re-rendered.
    */
    this.dirty = false;

    //  Aliases
    this.cls = this.clear;

    /**
    * @property {number} _image - Internal cache var.
    * @private
    */
    this._image = null;

    /**
    * @property {Phaser.Point} _pos - Internal cache var.
    * @private
    */
    this._pos = new Phaser.Point();

    /**
    * @property {Phaser.Point} _size - Internal cache var.
    * @private
    */
    this._size = new Phaser.Point();

    /**
    * @property {Phaser.Point} _scale - Internal cache var.
    * @private
    */
    this._scale = new Phaser.Point();

    /**
    * @property {number} _rotate - Internal cache var.
    * @private
    */
    this._rotate = 0;

    /**
    * @property {object} _alpha - Internal cache var.
    * @private
    */
    this._alpha = { prev: 1, current: 1 };

    /**
    * @property {Phaser.Point} _anchor - Internal cache var.
    * @private
    */
    this._anchor = new Phaser.Point();

    /**
    * @property {number} _tempR - Internal cache var.
    * @private
    */
    this._tempR = 0;

    /**
    * @property {number} _tempG - Internal cache var.
    * @private
    */
    this._tempG = 0;

    /**
    * @property {number} _tempB - Internal cache var.
    * @private
    */
    this._tempB = 0;

    /**
    * @property {Phaser.Circle} _circle - Internal cache var.
    * @private
    */
    this._circle = new Phaser.Circle();

};

Phaser.BitmapData.prototype = {

    /**
    * Updates the given objects so that they use this BitmapData as their texture. This will replace any texture they will currently have set.
    *
    * @method Phaser.BitmapData#add
    * @param {Phaser.Sprite|Phaser.Sprite[]|Phaser.Image|Phaser.Image[]} object - Either a single Sprite/Image or an Array of Sprites/Images.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    add: function (object) {

        if (Array.isArray(object))
        {
            for (var i = 0; i < object.length; i++)
            {
                if (object[i]['loadTexture'])
                {
                    object[i].loadTexture(this);
                }
            }
        }
        else
        {
            object.loadTexture(this);
        }

        return this;

    },

    /**
    * Takes the given Game Object, resizes this BitmapData to match it and then draws it into this BitmapDatas canvas, ready for further processing.
    * The source game object is not modified by this operation.
    * If the source object uses a texture as part of a Texture Atlas or Sprite Sheet, only the current frame will be used for sizing.
    * If a string is given it will assume it's a cache key and look in Phaser.Cache for an image key matching the string.
    *
    * @method Phaser.BitmapData#load
    * @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapData|Image|HTMLCanvasElement|string} source - The object that will be used to populate this BitmapData. If you give a string it will try and find the Image in the Game.Cache first.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    load: function (source) {

        if (typeof source === 'string')
        {
            source = this.game.cache.getImage(source);
        }

        if (source)
        {
            this.resize(source.width, source.height);
            this.cls();
        }
        else
        {
            return;
        }

        this.draw(source);

        this.update();

        return this;

    },

    /**
    * Clears the BitmapData context using a clearRect.
    *
    * @method Phaser.BitmapData#cls
    */

    /**
    * Clears the BitmapData context using a clearRect.
    *
    * @method Phaser.BitmapData#clear
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    clear: function () {

        this.context.clearRect(0, 0, this.width, this.height);

        this.dirty = true;

        return this;

    },

    /**
    * Fills the BitmapData with the given color.
    *
    * @method Phaser.BitmapData#fill
    * @param {number} r - The red color value, between 0 and 0xFF (255).
    * @param {number} g - The green color value, between 0 and 0xFF (255).
    * @param {number} b - The blue color value, between 0 and 0xFF (255).
    * @param {number} [a=1] - The alpha color value, between 0 and 1.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    fill: function (r, g, b, a) {

        if (typeof a === 'undefined') { a = 1; }

        this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        this.context.fillRect(0, 0, this.width, this.height);
        this.dirty = true;

        return this;

    },

    /**
    * Resizes the BitmapData. This changes the size of the underlying canvas and refreshes the buffer.
    *
    * @method Phaser.BitmapData#resize
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    resize: function (width, height) {

        if (width !== this.width || height !== this.height)
        {
            this.width = width;
            this.height = height;

            this.canvas.width = width;
            this.canvas.height = height;

            this.baseTexture.width = width;
            this.baseTexture.height = height;

            this.textureFrame.width = width;
            this.textureFrame.height = height;

            this.texture.width = width;
            this.texture.height = height;

            this.texture.crop.width = width;
            this.texture.crop.height = height;

            this.update();
            this.dirty = true;
        }

        return this;

    },

    /**
    * This re-creates the BitmapData.imageData from the current context.
    * It then re-builds the ArrayBuffer, the data Uint8ClampedArray reference and the pixels Int32Array.
    * If not given the dimensions defaults to the full size of the context.
    *
    * @method Phaser.BitmapData#update
    * @param {number} [x=0] - The x coordinate of the top-left of the image data area to grab from.
    * @param {number} [y=0] - The y coordinate of the top-left of the image data area to grab from.
    * @param {number} [width] - The width of the image data area.
    * @param {number} [height] - The height of the image data area.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    update: function (x, y, width, height) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }
        if (typeof width === 'undefined') { width = this.width; }
        if (typeof height === 'undefined') { height = this.height; }

        this.imageData = this.context.getImageData(x, y, width, height);
        this.data = this.imageData.data;

        if (this.imageData.data.buffer)
        {
            this.buffer = this.imageData.data.buffer;
            this.pixels = new Uint32Array(this.buffer);
        }
        else
        {
            if (window['ArrayBuffer'])
            {
                this.buffer = new ArrayBuffer(this.imageData.data.length);
                this.pixels = new Uint32Array(this.buffer);
            }
            else
            {
                this.pixels = this.imageData.data;
            }
        }

        return this;

    },

    /**
    * Scans through the area specified in this BitmapData and sends a color object for every pixel to the given callback.
    * The callback will be sent a color object with 6 properties: `{ r: number, g: number, b: number, a: number, color: number, rgba: string }`.
    * Where r, g, b and a are integers between 0 and 255 representing the color component values for red, green, blue and alpha.
    * The `color` property is an Int32 of the full color. Note the endianess of this will change per system.
    * The `rgba` property is a CSS style rgba() string which can be used with context.fillStyle calls, among others.
    * The callback will also be sent the pixels x and y coordinates respectively.
    * The callback must return either `false`, in which case no change will be made to the pixel, or a new color object.
    * If a new color object is returned the pixel will be set to the r, g, b and a color values given within it.
    *
    * @method Phaser.BitmapData#processPixelRGB
    * @param {function} callback - The callback that will be sent each pixel color object to be processed.
    * @param {object} callbackContext - The context under which the callback will be called.
    * @param {number} [x=0] - The x coordinate of the top-left of the region to process from.
    * @param {number} [y=0] - The y coordinate of the top-left of the region to process from.
    * @param {number} [width] - The width of the region to process.
    * @param {number} [height] - The height of the region to process.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    processPixelRGB: function (callback, callbackContext, x, y, width, height) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }
        if (typeof width === 'undefined') { width = this.width; }
        if (typeof height === 'undefined') { height = this.height; }

        var w = x + width;
        var h = y + height;
        var pixel = Phaser.Color.createColor();
        var result = { r: 0, g: 0, b: 0, a: 0 };
        var dirty = false;

        for (var ty = y; ty < h; ty++)
        {
            for (var tx = x; tx < w; tx++)
            {
                Phaser.Color.unpackPixel(this.getPixel32(tx, ty), pixel);

                result = callback.call(callbackContext, pixel, tx, ty);

                if (result !== false && result !== null && result !== undefined)
                {
                    this.setPixel32(tx, ty, result.r, result.g, result.b, result.a, false);
                    dirty = true;
                }
            }
        }

        if (dirty)
        {
            this.context.putImageData(this.imageData, 0, 0);
            this.dirty = true;
        }

        return this;

    },

    /**
    * Scans through the area specified in this BitmapData and sends the color for every pixel to the given callback along with its x and y coordinates.
    * Whatever value the callback returns is set as the new color for that pixel, unless it returns the same color, in which case it's skipped.
    * Note that the format of the color received will be different depending on if the system is big or little endian.
    * It is expected that your callback will deal with endianess. If you'd rather Phaser did it then use processPixelRGB instead.
    * The callback will also be sent the pixels x and y coordinates respectively.
    *
    * @method Phaser.BitmapData#processPixel
    * @param {function} callback - The callback that will be sent each pixel color to be processed.
    * @param {object} callbackContext - The context under which the callback will be called.
    * @param {number} [x=0] - The x coordinate of the top-left of the region to process from.
    * @param {number} [y=0] - The y coordinate of the top-left of the region to process from.
    * @param {number} [width] - The width of the region to process.
    * @param {number} [height] - The height of the region to process.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    processPixel: function (callback, callbackContext, x, y, width, height) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }
        if (typeof width === 'undefined') { width = this.width; }
        if (typeof height === 'undefined') { height = this.height; }

        var w = x + width;
        var h = y + height;
        var pixel = 0;
        var result = 0;
        var dirty = false;

        for (var ty = y; ty < h; ty++)
        {
            for (var tx = x; tx < w; tx++)
            {
                pixel = this.getPixel32(tx, ty);
                result = callback.call(callbackContext, pixel, tx, ty);

                if (result !== pixel)
                {
                    this.pixels[ty * this.width + tx] = result;
                    dirty = true;
                }
            }
        }

        if (dirty)
        {
            this.context.putImageData(this.imageData, 0, 0);
            this.dirty = true;
        }

        return this;

    },

    /**
    * Replaces all pixels matching one color with another. The color values are given as two sets of RGBA values.
    * An optional region parameter controls if the replacement happens in just a specific area of the BitmapData or the entire thing. 
    *
    * @method Phaser.BitmapData#replaceRGB
    * @param {number} r1 - The red color value to be replaced. Between 0 and 255.
    * @param {number} g1 - The green color value to be replaced. Between 0 and 255.
    * @param {number} b1 - The blue color value to be replaced. Between 0 and 255.
    * @param {number} a1 - The alpha color value to be replaced. Between 0 and 255.
    * @param {number} r2 - The red color value that is the replacement color. Between 0 and 255.
    * @param {number} g2 - The green color value that is the replacement color. Between 0 and 255.
    * @param {number} b2 - The blue color value that is the replacement color. Between 0 and 255.
    * @param {number} a2 - The alpha color value that is the replacement color. Between 0 and 255.
    * @param {Phaser.Rectangle} [region] - The area to perform the search over. If not given it will replace over the whole BitmapData.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    replaceRGB: function (r1, g1, b1, a1, r2, g2, b2, a2, region) {

        var sx = 0;
        var sy = 0;
        var w = this.width;
        var h = this.height;
        var source = Phaser.Color.packPixel(r1, g1, b1, a1);

        if (region !== undefined && region instanceof Phaser.Rectangle)
        {
            sx = region.x;
            sy = region.y;
            w = region.width;
            h = region.height;
        }

        for (var y = 0; y < h; y++)
        {
            for (var x = 0; x < w; x++)
            {
                if (this.getPixel32(sx + x, sy + y) === source)
                {
                    this.setPixel32(sx + x, sy + y, r2, g2, b2, a2, false);
                }
            }
        }

        this.context.putImageData(this.imageData, 0, 0);
        this.dirty = true;

        return this;

    },

    /**
    * Sets the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
    *
    * @method Phaser.BitmapData#setHSL
    * @param {number} [h=null] - The hue, in the range 0 - 1.
    * @param {number} [s=null] - The saturation, in the range 0 - 1.
    * @param {number} [l=null] - The lightness, in the range 0 - 1.
    * @param {Phaser.Rectangle} [region] - The area to perform the operation on. If not given it will run over the whole BitmapData.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    setHSL: function (h, s, l, region) {

        if (typeof h === 'undefined' || h === null) { h = false; }
        if (typeof s === 'undefined' || s === null) { s = false; }
        if (typeof l === 'undefined' || l === null) { l = false; }

        if (!h && !s && !l)
        {
            return;
        }

        if (typeof region === 'undefined')
        {
            region = new Phaser.Rectangle(0, 0, this.width, this.height);
        }

        var pixel = Phaser.Color.createColor();

        for (var y = region.y; y < region.bottom; y++)
        {
            for (var x = region.x; x < region.right; x++)
            {
                Phaser.Color.unpackPixel(this.getPixel32(x, y), pixel, true);

                if (h)
                {
                    pixel.h = h;
                }

                if (s)
                {
                    pixel.s = s;
                }

                if (l)
                {
                    pixel.l = l;
                }

                Phaser.Color.HSLtoRGB(pixel.h, pixel.s, pixel.l, pixel);
                this.setPixel32(x, y, pixel.r, pixel.g, pixel.b, pixel.a, false);
            }
        }

        this.context.putImageData(this.imageData, 0, 0);
        this.dirty = true;

        return this;

    },

    /**
    * Shifts any or all of the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
    * Shifting will add the given value onto the current h, s and l values, not replace them.
    * The hue is wrapped to keep it within the range 0 to 1. Saturation and lightness are clamped to not exceed 1.
    *
    * @method Phaser.BitmapData#shiftHSL
    * @param {number} [h=null] - The amount to shift the hue by.
    * @param {number} [s=null] - The amount to shift the saturation by.
    * @param {number} [l=null] - The amount to shift the lightness by.
    * @param {Phaser.Rectangle} [region] - The area to perform the operation on. If not given it will run over the whole BitmapData.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    shiftHSL: function (h, s, l, region) {

        if (typeof h === 'undefined' || h === null) { h = false; }
        if (typeof s === 'undefined' || s === null) { s = false; }
        if (typeof l === 'undefined' || l === null) { l = false; }

        if (!h && !s && !l)
        {
            return;
        }

        if (typeof region === 'undefined')
        {
            region = new Phaser.Rectangle(0, 0, this.width, this.height);
        }

        var pixel = Phaser.Color.createColor();

        for (var y = region.y; y < region.bottom; y++)
        {
            for (var x = region.x; x < region.right; x++)
            {
                Phaser.Color.unpackPixel(this.getPixel32(x, y), pixel, true);

                if (h)
                {
                    pixel.h = this.game.math.wrap(pixel.h + h, 0, 1);
                }

                if (s)
                {
                    pixel.s = this.game.math.limitValue(pixel.s + s, 0, 1);
                }

                if (l)
                {
                    pixel.l = this.game.math.limitValue(pixel.l + l, 0, 1);
                }

                Phaser.Color.HSLtoRGB(pixel.h, pixel.s, pixel.l, pixel);
                this.setPixel32(x, y, pixel.r, pixel.g, pixel.b, pixel.a, false);
            }
        }

        this.context.putImageData(this.imageData, 0, 0);
        this.dirty = true;

        return this;

    },

    /**
    * Sets the color of the given pixel to the specified red, green, blue and alpha values.
    *
    * @method Phaser.BitmapData#setPixel32
    * @param {number} x - The x coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {number} y - The y coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {number} red - The red color value, between 0 and 0xFF (255).
    * @param {number} green - The green color value, between 0 and 0xFF (255).
    * @param {number} blue - The blue color value, between 0 and 0xFF (255).
    * @param {number} alpha - The alpha color value, between 0 and 0xFF (255).
    * @param {boolean} [immediate=true] - If `true` the context.putImageData will be called and the dirty flag set.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    setPixel32: function (x, y, red, green, blue, alpha, immediate) {

        if (typeof immediate === 'undefined') { immediate = true; }

        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        {
            if (Phaser.Device.LITTLE_ENDIAN)
            {
                this.pixels[y * this.width + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;
            }
            else
            {
                this.pixels[y * this.width + x] = (red << 24) | (green << 16) | (blue << 8) | alpha;
            }

            if (immediate)
            {
                this.context.putImageData(this.imageData, 0, 0);
                this.dirty = true;
            }
        }

        return this;

    },

    /**
    * Sets the color of the given pixel to the specified red, green and blue values.
    *
    * @method Phaser.BitmapData#setPixel
    * @param {number} x - The x coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {number} y - The y coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {number} red - The red color value, between 0 and 0xFF (255).
    * @param {number} green - The green color value, between 0 and 0xFF (255).
    * @param {number} blue - The blue color value, between 0 and 0xFF (255).
    * @param {number} alpha - The alpha color value, between 0 and 0xFF (255).
    * @param {boolean} [immediate=true] - If `true` the context.putImageData will be called and the dirty flag set.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    setPixel: function (x, y, red, green, blue, immediate) {

        return this.setPixel32(x, y, red, green, blue, 255, immediate);

    },

    /**
    * Get the color of a specific pixel in the context into a color object.
    * If you have drawn anything to the BitmapData since it was created you must call BitmapData.update to refresh the array buffer,
    * otherwise this may return out of date color values, or worse - throw a run-time error as it tries to access an array element that doesn't exist.
    *
    * @method Phaser.BitmapData#getPixel
    * @param {number} x - The x coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {number} y - The y coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {object} [out] - An object into which 4 properties will be created: r, g, b and a. If not provided a new object will be created.
    * @return {object} An object with the red, green, blue and alpha values set in the r, g, b and a properties.
    */
    getPixel: function (x, y, out) {

        if (!out)
        {
            out = Phaser.Color.createColor();
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
    * Get the color of a specific pixel including its alpha value.
    * If you have drawn anything to the BitmapData since it was created you must call BitmapData.update to refresh the array buffer,
    * otherwise this may return out of date color values, or worse - throw a run-time error as it tries to access an array element that doesn't exist.
    * Note that on little-endian systems the format is 0xAABBGGRR and on big-endian the format is 0xRRGGBBAA.
    *
    * @method Phaser.BitmapData#getPixel32
    * @param {number} x - The x coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {number} y - The y coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @return {number} A native color value integer (format: 0xAARRGGBB)
    */
    getPixel32: function (x, y) {

        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        {
            return this.pixels[y * this.width + x];
        }

    },

    /**
    * Get the color of a specific pixel including its alpha value as a color object containing r,g,b,a and rgba properties.
    * If you have drawn anything to the BitmapData since it was created you must call BitmapData.update to refresh the array buffer,
    * otherwise this may return out of date color values, or worse - throw a run-time error as it tries to access an array element that doesn't exist.
    *
    * @method Phaser.BitmapData#getPixelRGB
    * @param {number} x - The x coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {number} y - The y coordinate of the pixel to be set. Must lay within the dimensions of this BitmapData.
    * @param {object} [out] - An object into which 3 properties will be created: r, g and b. If not provided a new object will be created.
    * @param {boolean} [hsl=false] - Also convert the rgb values into hsl?
    * @param {boolean} [hsv=false] - Also convert the rgb values into hsv?
    * @return {object} An object with the red, green and blue values set in the r, g and b properties.
    */
    getPixelRGB: function (x, y, out, hsl, hsv) {

        return Phaser.Color.unpackPixel(this.getPixel32(x, y), out, hsl, hsv);

    },

    /**
    * Gets all the pixels from the region specified by the given Rectangle object.
    *
    * @method Phaser.BitmapData#getPixels
    * @param {Phaser.Rectangle} rect - The Rectangle region to get.
    * @return {ImageData} Returns a ImageData object containing a Uint8ClampedArray data property.
    */
    getPixels: function (rect) {

        return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);

    },

    /**
    * Scans the BitmapData, pixel by pixel, until it encounters a pixel that isn't transparent (i.e. has an alpha value > 0).
    * It then stops scanning and returns an object containing the colour of the pixel in r, g and b properties and the location in the x and y properties.
    * 
    * The direction parameter controls from which direction it should start the scan:
    * 
    * 0 = top to bottom
    * 1 = bottom to top
    * 2 = left to right
    * 3 = right to left
    *
    * @method Phaser.BitmapData#getFirstPixel
    * @param {number} [direction=0] - The direction in which to scan for the first pixel. 0 = top to bottom, 1 = bottom to top, 2 = left to right and 3 = right to left.
    * @return {object} Returns an object containing the colour of the pixel in the `r`, `g` and `b` properties and the location in the `x` and `y` properties.
    */
    getFirstPixel: function (direction) {

        if (typeof direction === 'undefined') { direction = 0; }

        var pixel = Phaser.Color.createColor();

        var x = 0;
        var y = 0;
        var v = 1;
        var scan = false;

        if (direction === 1)
        {
            v = -1;
            y = this.height;
        }
        else if (direction === 3)
        {
            v = -1;
            x = this.width;
        }

        do {

            Phaser.Color.unpackPixel(this.getPixel32(x, y), pixel);

            if (direction === 0 || direction === 1)
            {
                //  Top to Bottom / Bottom to Top
                x++;

                if (x === this.width)
                {
                    x = 0;
                    y += v;

                    if (y >= this.height || y <= 0)
                    {
                        scan = true;
                    }
                }
            }
            else if (direction === 2 || direction === 3)
            {
                //  Left to Right / Right to Left
                y++;

                if (y === this.height)
                {
                    y = 0;
                    x += v;

                    if (x >= this.width || x <= 0)
                    {
                        scan = true;
                    }
                }
            }
        }
        while (pixel.a === 0 && !scan);

        pixel.x = x;
        pixel.y = y;

        return pixel;

    },

    /**
    * Scans the BitmapData and calculates the bounds. This is a rectangle that defines the extent of all non-transparent pixels.
    * The rectangle returned will extend from the top-left of the image to the bottom-right, exluding transparent pixels.
    *
    * @method Phaser.BitmapData#getBounds
    * @param {Phaser.Rectangle} [rect] - If provided this Rectangle object will be populated with the bounds, otherwise a new object will be created.
    * @return {Phaser.Rectangle} A Rectangle whose dimensions encompass the full extent of non-transparent pixels in this BitmapData.
    */
    getBounds: function (rect) {

        if (typeof rect === 'undefined') { rect = new Phaser.Rectangle(); }

        rect.x = this.getFirstPixel(2).x;

        //  If we hit this, there's no point scanning any more, the image is empty
        if (rect.x === this.width)
        {
            return rect.setTo(0, 0, 0, 0);
        }

        rect.y = this.getFirstPixel(0).y;
        rect.width = (this.getFirstPixel(3).x - rect.x) + 1;
        rect.height = (this.getFirstPixel(1).y - rect.y) + 1;

        return rect;

    },

    /**
    * Creates a new Phaser.Image object, assigns this BitmapData to be its texture, adds it to the world then returns it.
    *
    * @method Phaser.BitmapData#addToWorld
    * @param {number} [x=0] - The x coordinate to place the Image at.
    * @param {number} [y=0] - The y coordinate to place the Image at.
    * @param {number} [anchorX=0] - Set the x anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
    * @param {number} [anchorY=0] - Set the y anchor point of the Image. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
    * @param {number} [scaleX=1] - The horizontal scale factor of the Image. A value of 1 means no scaling. 2 would be twice the size, and so on.
    * @param {number} [scaleY=1] - The vertical scale factor of the Image. A value of 1 means no scaling. 2 would be twice the size, and so on.
    * @return {Phaser.Image} The newly added Image object.
    */
    addToWorld: function (x, y, anchorX, anchorY, scaleX, scaleY) {

        scaleX = scaleX || 1;
        scaleY = scaleY || 1;

        var image = this.game.add.image(x, y, this);

        image.anchor.set(anchorX, anchorY);
        image.scale.set(scaleX, scaleY);

        return image;

    },

    /**
     * Copies a rectangular area from the source object to this BitmapData. If you give `null` as the source it will copy from itself.
     * You can optionally resize, translate, rotate, scale, alpha or blend as it's drawn.
     * All rotation, scaling and drawing takes place around the regions center point by default, but can be changed with the anchor parameters.
     * Note that the source image can also be this BitmapData, which can create some interesting effects.
     * 
     * This method has a lot of parameters for maximum control.
     * You can use the more friendly methods like `copyRect` and `draw` to avoid having to remember them all.
     *
     * @method Phaser.BitmapData#copy
     * @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapData|Image|HTMLCanvasElement|string} [source] - The source to copy from. If you give a string it will try and find the Image in the Game.Cache first. This is quite expensive so try to provide the image itself.
     * @param {number} [x=0] - The x coordinate representing the top-left of the region to copy from the source image.
     * @param {number} [y=0] - The y coordinate representing the top-left of the region to copy from the source image.
     * @param {number} [width] - The width of the region to copy from the source image. If not specified it will use the full source image width.
     * @param {number} [height] - The height of the region to copy from the source image. If not specified it will use the full source image height.
     * @param {number} [tx] - The x coordinate to translate to before drawing. If not specified it will default to the `x` parameter.
     * @param {number} [ty] - The y coordinate to translate to before drawing. If not specified it will default to the `y` parameter.
     * @param {number} [newWidth] - The new width of the block being copied. If not specified it will default to the `width` parameter.
     * @param {number} [newHeight] - The new height of the block being copied. If not specified it will default to the `height` parameter.
     * @param {number} [rotate=0] - The angle in radians to rotate the block to before drawing. Rotation takes place around the center by default, but can be changed with the `anchor` parameters.
     * @param {number} [anchorX=0] - The anchor point around which the block is rotated and scaled. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
     * @param {number} [anchorY=0] - The anchor point around which the block is rotated and scaled. A value between 0 and 1, where 0 is the top-left and 1 is bottom-right.
     * @param {number} [scaleX=1] - The horizontal scale factor of the block. A value of 1 means no scaling. 2 would be twice the size, and so on.
     * @param {number} [scaleY=1] - The vertical scale factor of the block. A value of 1 means no scaling. 2 would be twice the size, and so on.
     * @param {number} [alpha=1] - The alpha that will be set on the context before drawing. A value between 0 (fully transparent) and 1, opaque.
     * @param {number} [blendMode=null] - The composite blend mode that will be used when drawing. The default is no blend mode at all.
     * @param {boolean} [roundPx=false] - Should the x and y values be rounded to integers before drawing? This prevents anti-aliasing in some instances.
     * @return {Phaser.BitmapData} This BitmapData object for method chaining.
     */
    copy: function (source, x, y, width, height, tx, ty, newWidth, newHeight, rotate, anchorX, anchorY, scaleX, scaleY, alpha, blendMode, roundPx) {

        if (typeof source === 'undefined' || source === null) { source = this; }

        this._image = source;

        if (source instanceof Phaser.Sprite || source instanceof Phaser.Image || source instanceof Phaser.Text)
        {
            //  Copy over sprite values
            this._pos.set(source.texture.crop.x, source.texture.crop.y);
            this._size.set(source.texture.crop.width, source.texture.crop.height);
            this._scale.set(source.scale.x, source.scale.y);
            this._anchor.set(source.anchor.x, source.anchor.y);
            this._rotate = source.rotation;
            this._alpha.current = source.alpha;
            this._image = source.texture.baseTexture.source;

            if (source.texture.trim)
            {
                //  Offset the translation coordinates by the trim amount
                tx += source.texture.trim.x - source.anchor.x * source.texture.trim.width;
                ty += source.texture.trim.y - source.anchor.y * source.texture.trim.height;
            }

            if (source.tint !== 0xFFFFFF)
            {
                if (source.cachedTint !== source.tint)
                {
                    source.cachedTint = source.tint;
                    source.tintedTexture = PIXI.CanvasTinter.getTintedTexture(source, source.tint);
                }

                this._image = source.tintedTexture;
            }
        }
        else
        {
            //  Reset
            this._pos.set(0);
            this._scale.set(1);
            this._anchor.set(0);
            this._rotate = 0;
            this._alpha.current = 1;

            if (source instanceof Phaser.BitmapData)
            {
                this._image = source.canvas;
            }
            else if (typeof source === 'string')
            {
                source = this.game.cache.getImage(source);

                if (source === null)
                {
                    return;
                }
                else
                {
                    this._image = source;
                }
            }

            this._size.set(this._image.width, this._image.height);
        }

        //  The source region to copy from
        if (typeof x === 'undefined' || x === null) { x = 0; }
        if (typeof y === 'undefined' || y === null) { y = 0; }

        //  If they set a width/height then we override the frame values with them
        if (width)
        {
            this._size.x = width;
        }

        if (height)
        {
            this._size.y = height;
        }

        //  The destination region to copy to
        if (typeof tx === 'undefined' || tx === null) { tx = x; }
        if (typeof ty === 'undefined' || ty === null) { ty = y; }
        if (typeof newWidth === 'undefined' || newWidth === null) { newWidth = this._size.x; }
        if (typeof newHeight === 'undefined' || newHeight === null) { newHeight = this._size.y; }

        //  Rotation - if set this will override any potential Sprite value
        if (typeof rotate === 'number')
        {
            this._rotate = rotate;
        }

        //  Anchor - if set this will override any potential Sprite value
        if (typeof anchorX === 'number')
        {
            this._anchor.x = anchorX;
        }

        if (typeof anchorY === 'number')
        {
            this._anchor.y = anchorY;
        }

        //  Scaling - if set this will override any potential Sprite value
        if (typeof scaleX === 'number')
        {
            this._scale.x = scaleX;
        }

        if (typeof scaleY === 'number')
        {
            this._scale.y = scaleY;
        }

        //  Effects
        if (typeof alpha === 'number')
        {
            this._alpha.current = alpha;
        }

        if (typeof blendMode === 'undefined') { blendMode = null; }
        if (typeof roundPx === 'undefined') { roundPx = false; }

        if (this._alpha.current <= 0 || this._scale.x === 0 || this._scale.y === 0 || this._size.x === 0 || this._size.y === 0)
        {
            //  Why bother wasting CPU cycles drawing something you can't see?
            return;
        }

        this._alpha.prev = this.context.globalAlpha;

        this.context.save();

        this.context.globalAlpha = this._alpha.current;

        if (blendMode)
        {
            this.context.globalCompositeOperation = blendMode;
        }

        if (roundPx)
        {
            tx |= 0;
            ty |= 0;
        }

        this.context.translate(tx, ty);

        this.context.scale(this._scale.x, this._scale.y);

        this.context.rotate(this._rotate);

        this.context.drawImage(this._image, this._pos.x + x, this._pos.y + y, this._size.x, this._size.y, -newWidth * this._anchor.x, -newHeight * this._anchor.y, newWidth, newHeight);

        this.context.restore();

        this.context.globalAlpha = this._alpha.prev;

        this.dirty = true;

        return this;

    },

    /**
    * Copies the area defined by the Rectangle parameter from the source image to this BitmapData at the given location.
    *
    * @method Phaser.BitmapData#copyRect
    * @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapData|Image|string} source - The Image to copy from. If you give a string it will try and find the Image in the Game.Cache.
    * @param {Phaser.Rectangle} area - The Rectangle region to copy from the source image.
    * @param {number} x - The destination x coordinate to copy the image to.
    * @param {number} y - The destination y coordinate to copy the image to.
    * @param {number} [alpha=1] - The alpha that will be set on the context before drawing. A value between 0 (fully transparent) and 1, opaque.
    * @param {number} [blendMode=null] - The composite blend mode that will be used when drawing. The default is no blend mode at all.
    * @param {boolean} [roundPx=false] - Should the x and y values be rounded to integers before drawing? This prevents anti-aliasing in some instances.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    copyRect: function (source, area, x, y, alpha, blendMode, roundPx) {

        return this.copy(source, area.x, area.y, area.width, area.height, x, y, area.width, area.height, 0, 0, 0, 1, 1, alpha, blendMode, roundPx);

    },

    /**
    * Draws the given Phaser.Sprite, Phaser.Image or Phaser.Text to this BitmapData at the coordinates specified.
    * You can use the optional width and height values to 'stretch' the sprite as it is drawn. This uses drawImage stretching, not scaling.
    * When drawing it will take into account the Sprites rotation, scale and alpha values.
    *
    * @method Phaser.BitmapData#draw
    * @param {Phaser.Sprite|Phaser.Image|Phaser.Text} source - The Sprite, Image or Text object to draw onto this BitmapData.
    * @param {number} [x=0] - The x coordinate to translate to before drawing. If not specified it will default to `source.x`.
    * @param {number} [y=0] - The y coordinate to translate to before drawing. If not specified it will default to `source.y`.
    * @param {number} [width] - The new width of the Sprite being copied. If not specified it will default to `source.width`.
    * @param {number} [height] - The new height of the Sprite being copied. If not specified it will default to `source.height`.
    * @param {number} [blendMode=null] - The composite blend mode that will be used when drawing the Sprite. The default is no blend mode at all.
    * @param {boolean} [roundPx=false] - Should the x and y values be rounded to integers before drawing? This prevents anti-aliasing in some instances.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    draw: function (source, x, y, width, height, blendMode, roundPx) {

        //  By specifying null for most parameters it will tell `copy` to use the Sprite values instead, which is what we want here
        return this.copy(source, null, null, null, null, x, y, width, height, null, null, null, null, null, null, blendMode, roundPx);

    },

    /**
    * Sets the shadow properties of this BitmapDatas context which will affect all draw operations made to it.
    * You can cancel an existing shadow by calling this method and passing no parameters.
    * Note: At the time of writing (October 2014) Chrome still doesn't support shadowBlur used with drawImage.
    *
    * @method Phaser.BitmapData#shadow
    * @param {string} color - The color of the shadow, given in a CSS format, i.e. `#000000` or `rgba(0,0,0,1)`. If `null` or `undefined` the shadow will be reset.
    * @param {number} [blur=5] - The amount the shadow will be blurred by. Low values = a crisp shadow, high values = a softer shadow.
    * @param {number} [x=10] - The horizontal offset of the shadow in pixels.
    * @param {number} [y=10] - The vertical offset of the shadow in pixels.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    shadow: function (color, blur, x, y) {

        if (typeof color === 'undefined' || color === null)
        {
            this.context.shadowColor = 'rgba(0,0,0,0)';
        }
        else
        {
            this.context.shadowColor = color;
            this.context.shadowBlur = blur || 5;
            this.context.shadowOffsetX = x || 10;
            this.context.shadowOffsetY = y || 10;
        }

    },

    /**
    * Draws the image onto this BitmapData using an image as an alpha mask.
    *
    * @method Phaser.BitmapData#alphaMask
    * @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapData|Image|HTMLCanvasElement|string} source - The source to copy from. If you give a string it will try and find the Image in the Game.Cache first. This is quite expensive so try to provide the image itself.
    * @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapData|Image|HTMLCanvasElement|string} [mask] - The object to be used as the mask. If you give a string it will try and find the Image in the Game.Cache first. This is quite expensive so try to provide the image itself. If you don't provide a mask it will use this BitmapData as the mask.
    * @param {Phaser.Rectangle} [sourceRect] - A Rectangle where x/y define the coordinates to draw the Source image to and width/height define the size.
    * @param {Phaser.Rectangle} [maskRect] - A Rectangle where x/y define the coordinates to draw the Mask image to and width/height define the size.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    alphaMask: function (source, mask, sourceRect, maskRect) {

        if (typeof maskRect === 'undefined' || maskRect === null)
        {
            this.draw(mask).blendSourceAtop();
        }
        else
        {
            this.draw(mask, maskRect.x, maskRect.y, maskRect.width, maskRect.height).blendSourceAtop();
        }

        if (typeof sourceRect === 'undefined' || sourceRect === null)
        {
            this.draw(source).blendReset();
        }
        else
        {
            this.draw(source, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height).blendReset();
        }

        return this;

    },

    /**
    * Scans this BitmapData for all pixels matching the given r,g,b values and then draws them into the given destination BitmapData.
    * The original BitmapData remains unchanged.
    * The destination BitmapData must be large enough to receive all of the pixels that are scanned unless the 'resize' parameter is true.
    * Although the destination BitmapData is returned from this method, it's actually modified directly in place, meaning this call is perfectly valid:
    * `picture.extract(mask, r, g, b)`
    * You can specify optional r2, g2, b2 color values. If given the pixel written to the destination bitmap will be of the r2, g2, b2 color.
    * If not given it will be written as the same color it was extracted. You can provide one or more alternative colors, allowing you to tint
    * the color during extraction.
    *
    * @method Phaser.BitmapData#extract
    * @param {Phaser.BitmapData} destination - The BitmapData that the extracted pixels will be drawn to.
    * @param {number} r - The red color component, in the range 0 - 255.
    * @param {number} g - The green color component, in the range 0 - 255.
    * @param {number} b - The blue color component, in the range 0 - 255.
    * @param {number} [a=255] - The alpha color component, in the range 0 - 255 that the new pixel will be drawn at.
    * @param {boolean} [resize=false] - Should the destination BitmapData be resized to match this one before the pixels are copied?
    * @param {number} [r2] - An alternative red color component to be written to the destination, in the range 0 - 255.
    * @param {number} [g2] - An alternative green color component to be written to the destination, in the range 0 - 255.
    * @param {number} [b2] - An alternative blue color component to be written to the destination, in the range 0 - 255.
    * @returns {Phaser.BitmapData} The BitmapData that the extract pixels were drawn on.
    */
    extract: function (destination, r, g, b, a, resize, r2, g2, b2) {

        if (typeof a === 'undefined') { a = 255; }
        if (typeof resize === 'undefined') { resize = false; }
        if (typeof r2 === 'undefined') { r2 = r; }
        if (typeof g2 === 'undefined') { g2 = g; }
        if (typeof b2 === 'undefined') { b2 = b; }

        if (resize)
        {
            destination.resize(this.width, this.height);
        }

        this.processPixelRGB(
            function (pixel, x, y)
            {
                if (pixel.r === r && pixel.g === g && pixel.b === b)
                {
                    destination.setPixel32(x, y, r2, g2, b2, a, false);
                }
                return false;
            },
            this);

        destination.context.putImageData(destination.imageData, 0, 0);
        destination.dirty = true;

        return destination;

    },

    /**
    * Draws a filled Rectangle to the BitmapData at the given x, y coordinates and width / height in size.
    *
    * @method Phaser.BitmapData#rect
    * @param {number} x - The x coordinate of the top-left of the Rectangle.
    * @param {number} y - The y coordinate of the top-left of the Rectangle.
    * @param {number} width - The width of the Rectangle.
    * @param {number} height - The height of the Rectangle.
    * @param {string} [fillStyle] - If set the context fillStyle will be set to this value before the rect is drawn.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    rect: function (x, y, width, height, fillStyle) {

        if (typeof fillStyle !== 'undefined')
        {
            this.context.fillStyle = fillStyle;
        }

        this.context.fillRect(x, y, width, height);

        return this;

    },

    /**
    * Draws a filled Circle to the BitmapData at the given x, y coordinates and radius in size.
    *
    * @method Phaser.BitmapData#circle
    * @param {number} x - The x coordinate to draw the Circle at. This is the center of the circle.
    * @param {number} y - The y coordinate to draw the Circle at. This is the center of the circle.
    * @param {number} radius - The radius of the Circle in pixels. The radius is half the diameter.
    * @param {string} [fillStyle] - If set the context fillStyle will be set to this value before the circle is drawn.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    circle: function (x, y, radius, fillStyle) {

        if (typeof fillStyle !== 'undefined')
        {
            this.context.fillStyle = fillStyle;
        }

        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2, false);
        this.context.closePath();

        this.context.fill();

        return this;

    },

    /**
    * Takes the given Line object and image and renders it to this BitmapData as a repeating texture line.
    *
    * @method Phaser.BitmapData#textureLine
    * @param {Phaser.Line} line - A Phaser.Line object that will be used to plot the start and end of the line.
    * @param {string|Image} image - The key of an image in the Phaser.Cache to use as the texture for this line, or an actual Image.
    * @param {string} [repeat='repeat-x'] - The pattern repeat mode to use when drawing the line. Either `repeat`, `repeat-x` or `no-repeat`.
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    textureLine: function (line, image, repeat) {

        if (typeof repeat === 'undefined') { repeat = 'repeat-x'; }

        if (typeof image === 'string')
        {
            image = this.game.cache.getImage(image);

            if (!image)
            {
                return;
            }
        }

        var width = line.length;

        if (repeat === 'no-repeat' && width > image.width)
        {
            width = image.width;
        }

        this.context.fillStyle = this.context.createPattern(image, repeat);

        this._circle = new Phaser.Circle(line.start.x, line.start.y, image.height);

        this._circle.circumferencePoint(line.angle - 1.5707963267948966, false, this._pos);

        this.context.save();
        this.context.translate(this._pos.x, this._pos.y);
        this.context.rotate(line.angle);
        this.context.fillRect(0, 0, width, image.height);
        this.context.restore();

        this.dirty = true;

        return this;

    },

    /**
    * If the game is running in WebGL this will push the texture up to the GPU if it's dirty.
    * This is called automatically if the BitmapData is being used by a Sprite, otherwise you need to remember to call it in your render function.
    * If you wish to suppress this functionality set BitmapData.disableTextureUpload to `true`.
    *
    * @method Phaser.BitmapData#render
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    render: function () {

        if (!this.disableTextureUpload && this.dirty)
        {
            this.baseTexture.dirty();
            this.dirty = false;
        }

        return this;

    },

    /**
    * Resets the blend mode (effectively sets it to 'source-over')
    *
    * @method Phaser.BitmapData#blendReset
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendReset: function () {

        this.context.globalCompositeOperation = 'source-over';
        return this;

    },

    /**
    * Sets the blend mode to 'source-over'
    *
    * @method Phaser.BitmapData#blendSourceOver
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendSourceOver: function () {

        this.context.globalCompositeOperation = 'source-over';
        return this;

    },

    /**
    * Sets the blend mode to 'source-in'
    *
    * @method Phaser.BitmapData#blendSourceIn
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendSourceIn: function () {

        this.context.globalCompositeOperation = 'source-in';
        return this;

    },

    /**
    * Sets the blend mode to 'source-out'
    *
    * @method Phaser.BitmapData#blendSourceOut
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendSourceOut: function () {

        this.context.globalCompositeOperation = 'source-out';
        return this;

    },

    /**
    * Sets the blend mode to 'source-atop'
    *
    * @method Phaser.BitmapData#blendSourceAtop
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendSourceAtop: function () {

        this.context.globalCompositeOperation = 'source-atop';
        return this;

    },

    /**
    * Sets the blend mode to 'destination-over'
    *
    * @method Phaser.BitmapData#blendDestinationOver
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendDestinationOver: function () {

        this.context.globalCompositeOperation = 'destination-over';
        return this;

    },

    /**
    * Sets the blend mode to 'destination-in'
    *
    * @method Phaser.BitmapData#blendDestinationIn
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendDestinationIn: function () {

        this.context.globalCompositeOperation = 'destination-in';
        return this;

    },

    /**
    * Sets the blend mode to 'destination-out'
    *
    * @method Phaser.BitmapData#blendDestinationOut
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendDestinationOut: function () {

        this.context.globalCompositeOperation = 'destination-out';
        return this;

    },

    /**
    * Sets the blend mode to 'destination-atop'
    *
    * @method Phaser.BitmapData#blendDestinationAtop
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendDestinationAtop: function () {

        this.context.globalCompositeOperation = 'destination-atop';
        return this;

    },

    /**
    * Sets the blend mode to 'xor'
    *
    * @method Phaser.BitmapData#blendXor
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendXor: function () {

        this.context.globalCompositeOperation = 'xor';
        return this;

    },

    /**
    * Sets the blend mode to 'lighter'
    *
    * @method Phaser.BitmapData#blendAdd
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendAdd: function () {

        this.context.globalCompositeOperation = 'lighter';
        return this;

    },

    /**
    * Sets the blend mode to 'multiply'
    *
    * @method Phaser.BitmapData#blendMultiply
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendMultiply: function () {

        this.context.globalCompositeOperation = 'multiply';
        return this;

    },

    /**
    * Sets the blend mode to 'screen'
    *
    * @method Phaser.BitmapData#blendScreen
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendScreen: function () {

        this.context.globalCompositeOperation = 'screen';
        return this;

    },

    /**
    * Sets the blend mode to 'overlay'
    *
    * @method Phaser.BitmapData#blendOverlay
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendOverlay: function () {

        this.context.globalCompositeOperation = 'overlay';
        return this;

    },

    /**
    * Sets the blend mode to 'darken'
    *
    * @method Phaser.BitmapData#blendDarken
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendDarken: function () {

        this.context.globalCompositeOperation = 'darken';
        return this;

    },

    /**
    * Sets the blend mode to 'lighten'
    *
    * @method Phaser.BitmapData#blendLighten
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendLighten: function () {

        this.context.globalCompositeOperation = 'lighten';
        return this;

    },

    /**
    * Sets the blend mode to 'color-dodge'
    *
    * @method Phaser.BitmapData#blendColorDodge
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendColorDodge: function () {

        this.context.globalCompositeOperation = 'color-dodge';
        return this;

    },

    /**
    * Sets the blend mode to 'color-burn'
    *
    * @method Phaser.BitmapData#blendColorBurn
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendColorBurn: function () {

        this.context.globalCompositeOperation = 'color-burn';
        return this;

    },

    /**
    * Sets the blend mode to 'hard-light'
    *
    * @method Phaser.BitmapData#blendHardLight
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendHardLight: function () {

        this.context.globalCompositeOperation = 'hard-light';
        return this;

    },

    /**
    * Sets the blend mode to 'soft-light'
    *
    * @method Phaser.BitmapData#blendSoftLight
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendSoftLight: function () {

        this.context.globalCompositeOperation = 'soft-light';
        return this;

    },

    /**
    * Sets the blend mode to 'difference'
    *
    * @method Phaser.BitmapData#blendDifference
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendDifference: function () {

        this.context.globalCompositeOperation = 'difference';
        return this;

    },

    /**
    * Sets the blend mode to 'exclusion'
    *
    * @method Phaser.BitmapData#blendExclusion
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendExclusion: function () {

        this.context.globalCompositeOperation = 'exclusion';
        return this;

    },

    /**
    * Sets the blend mode to 'hue'
    *
    * @method Phaser.BitmapData#blendHue
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendHue: function () {

        this.context.globalCompositeOperation = 'hue';
        return this;

    },

    /**
    * Sets the blend mode to 'saturation'
    *
    * @method Phaser.BitmapData#blendSaturation
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendSaturation: function () {

        this.context.globalCompositeOperation = 'saturation';
        return this;

    },

    /**
    * Sets the blend mode to 'color'
    *
    * @method Phaser.BitmapData#blendColor
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendColor: function () {

        this.context.globalCompositeOperation = 'color';
        return this;

    },

    /**
    * Sets the blend mode to 'luminosity'
    *
    * @method Phaser.BitmapData#blendLuminosity
    * @return {Phaser.BitmapData} This BitmapData object for method chaining.
    */
    blendLuminosity: function () {

        this.context.globalCompositeOperation = 'luminosity';
        return this;

    }

};

/**
* @name Phaser.Sprite#smoothed
* @property {boolean} smoothed - Gets or sets this BitmapData.contexts smoothing enabled value.
*/
Object.defineProperty(Phaser.BitmapData.prototype, "smoothed", {

    get: function () {

        Phaser.Canvas.getSmoothingEnabled(this.context);

    },

    set: function (value) {

        Phaser.Canvas.setSmoothingEnabled(this.context, value);

    }

});

/**
 * Gets a JavaScript object that has 6 properties set that are used by BitmapData in a transform.
 *
 * @method Phaser.BitmapData.getTransform
 * @param {number} translateX - The x translate value.
 * @param {number} translateY - The y translate value.
 * @param {number} scaleX - The scale x value.
 * @param {number} scaleY - The scale y value.
 * @param {number} skewX - The skew x value.
 * @param {number} skewY - The skew y value.
 * @return {object} A JavaScript object containing all of the properties BitmapData needs for transforms.
 */
Phaser.BitmapData.getTransform = function (translateX, translateY, scaleX, scaleY, skewX, skewY) {

    if (typeof translateX !== 'number') { translateX = 0; }
    if (typeof translateY !== 'number') { translateY = 0; }
    if (typeof scaleX !== 'number') { scaleX = 1; }
    if (typeof scaleY !== 'number') { scaleY = 1; }
    if (typeof skewX !== 'number') { skewX = 0; }
    if (typeof skewY !== 'number') { skewY = 0; }

    return { sx: scaleX, sy: scaleY, scaleX: scaleX, scaleY: scaleY, skewX: skewX, skewY: skewY, translateX: translateX, translateY: translateY, tx: translateX, ty: translateY };

};

Phaser.BitmapData.prototype.constructor = Phaser.BitmapData;
