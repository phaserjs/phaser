/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new BitmapData object.
*
* @class Phaser.BitmapData
*
* @classdesc A BitmapData object contains a Canvas element to which you can draw anything you like via normal Canvas context operations.
* A single BitmapData can be used as the texture one or many Images/Sprites. So if you need to dynamically create a Sprite texture then they are a good choice.
*
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {string} key - Internal Phaser reference key for the render texture.
* @param {number} [width=100] - The width of the BitmapData in pixels.
* @param {number} [height=100] - The height of the BitmapData in pixels.
*/
Phaser.BitmapData = function (game, key, width, height) {

    if (typeof width === 'undefined') { width = 100; }
    if (typeof height === 'undefined') { height = 100; }

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
    this.context = this.canvas.getContext('2d');

    /**
    * @property {CanvasRenderingContext2D} ctx - A reference to BitmapData.context.
    */
    this.ctx = this.context;

    /**
    * @property {ImageData} imageData - The context image data.
    */
    this.imageData = this.context.getImageData(0, 0, width, height);

    /**
    * @property {ArrayBuffer} buffer - An ArrayBuffer the same size as the context ImageData.
    */
    if (this.imageData.data.buffer)
    {
        this.buffer = this.imageData.data.buffer;
    }
    else
    {
        this.buffer = new ArrayBuffer(this.imageData.data.length);
    }

    /**
    * @property {Uint8ClampedArray} data - A Uint8ClampedArray view into BitmapData.buffer.
    */
    this.data = this.imageData.data;

    /**
    * @property {Int32Array} pixels - An Int32Array view into BitmapData.buffer.
    */
    this.pixels = new Int32Array(this.buffer);

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

    /**
    * @property {boolean} littleEndian - True if Little Endian, false if Big Endian.
    */
    this.littleEndian = this.game.device.littleEndian;

    //  Aliases
    this.cls = this.clear;
    this.update = this.refreshBuffer;

};

Phaser.BitmapData.prototype = {

    /**
    * Updates the given objects so that they use this BitmapData as their texture. This will replace any texture they will currently have set.
    *
    * @method Phaser.BitmapData#add
    * @param {Phaser.Sprite|Phaser.Sprite[]|Phaser.Image|Phaser.Image[]} object - Either a single Sprite/Image or an Array of Sprites/Images.
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
    */
    clear: function () {

        this.context.clearRect(0, 0, this.width, this.height);

        this.dirty = true;

    },

    /**
    * Fills the BitmapData with the given color.
    *
    * @method Phaser.BitmapData#fill
    * @param {number} r - The red color value, between 0 and 0xFF (255).
    * @param {number} g - The green color value, between 0 and 0xFF (255).
    * @param {number} b - The blue color value, between 0 and 0xFF (255).
    * @param {number} [a=255] - The alpha color value, between 0 and 0xFF (255).
    */
    fill: function (r, g, b, a) {

        if (typeof a === 'undefined') { a = 255; }

        this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        this.context.fillRect(0, 0, this.width, this.height);
        this.dirty = true;

    },

    /**
    * Resizes the BitmapData. This changes the size of the underlying canvas and refreshes the buffer.
    *
    * @method Phaser.BitmapData#resize
    */
    resize: function (width, height) {

        if (width !== this.width || height !== this.height)
        {
            this.width = width;
            this.height = height;
            this.canvas.width = width;
            this.canvas.height = height;
            this.textureFrame.width = width;
            this.textureFrame.height = height;
            this.refreshBuffer();
        }

        this.dirty = true;

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
    */

    /**
    * This re-creates the BitmapData.imageData from the current context.
    * It then re-builds the ArrayBuffer, the data Uint8ClampedArray reference and the pixels Int32Array.
    * If not given the dimensions defaults to the full size of the context.
    *
    * @method Phaser.BitmapData#refreshBuffer
    * @param {number} [x=0] - The x coordinate of the top-left of the image data area to grab from.
    * @param {number} [y=0] - The y coordinate of the top-left of the image data area to grab from.
    * @param {number} [width] - The width of the image data area.
    * @param {number} [height] - The height of the image data area.
    */
    refreshBuffer: function (x, y, width, height) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }
        if (typeof width === 'undefined') { width = this.width; }
        if (typeof height === 'undefined') { height = this.height; }

        this.imageData = this.context.getImageData(x, y, width, height);

        if (this.imageData.data.buffer)
        {
            this.buffer = this.imageData.data.buffer;
        }
        else
        {
            this.buffer = new ArrayBuffer(this.imageData.data.length);
        }

        this.data = this.imageData.data;
        this.pixels = new Int32Array(this.buffer);

    },

    /**
    * Scans through the area specified in this BitmapData and sends a color object for every pixel to the given callback.
    * The callback will be sent a single object with 6 properties: `{ r: number, g: number, b: number, a: number, color: number, rgba: string }`.
    * Where r, g, b and a are integers between 0 and 255 representing the color component values for red, green, blue and alpha.
    * The `color` property is an Int32 of the full color. Note the endianess of this will change per system.
    * The `rgba` property is a CSS style rgba() string which can be used with context.fillStyle calls, among others.
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
    */
    processPixelRGB: function (callback, callbackContext, x, y, width, height) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }
        if (typeof width === 'undefined') { width = this.width; }
        if (typeof height === 'undefined') { height = this.height; }

        var w = x + width;
        var h = y + height;
        var pixel = { r: 0, g: 0, b: 0, a: 0, rgba: '' };
        var result = { r: 0, g: 0, b: 0, a: 0 };
        var color = 0;
        var dirty = false;

        for (var ty = y; ty < h; ty++)
        {
            for (var tx = x; tx < w; tx++)
            {
                color = this.getPixel32(tx, ty);
                this.unpackPixel(color, pixel);
                result = callback.call(callbackContext, pixel, color);

                if (result !== false && result !== null)
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

    },

    /**
    * Replaces all pixels matching the given RGBA values with the new RGBA values in the given region, 
    * or the whole BitmapData if no region provided.
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
    */
    replaceRGB: function (r1, g1, b1, a1, r2, g2, b2, a2, region) {

        var sx = 0;
        var sy = 0;
        var w = this.width;
        var h = this.height;
        var source = this.packPixel(r1, g1, b1, a1);

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
    */
    setPixel32: function (x, y, red, green, blue, alpha, immediate) {

        if (typeof immediate === 'undefined') { immediate = true; }

        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        {
            if (this.littleEndian)
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
    */
    setPixel: function (x, y, red, green, blue, immediate) {

        this.setPixel32(x, y, red, green, blue, 255, immediate);

    },

    /**
    * Get the color of a specific pixel.
    * Note that on little-endian systems the format is 0xAABBGGRR and on big-endian the format is 0xRRGGBBAA.
    *
    * @param {number} x - The X coordinate of the pixel to get.
    * @param {number} y - The Y coordinate of the pixel to get.
    * @return {number} A native color value integer (format: 0xRRGGBB)
    */
    getPixel: function (x, y, out) {

        var index = ~~(x + (y * this.width));

        index *= 4;

        if (!out)
        {
            out = { r:0, g:0, b:0, a:0 };
        }

        out.r = this.data[index];
        out.g = this.data[++index];
        out.b = this.data[++index];
        out.a = this.data[++index];

        return out;

    },

    /**
    * Get the color of a specific pixel including its alpha value.
    * Note that on little-endian systems the format is 0xAABBGGRR and on big-endian the format is 0xRRGGBBAA.
    *
    * @method Phaser.BitmapData#getPixel32
    * @param {number} x - The X coordinate of the pixel to get.
    * @param {number} y - The Y coordinate of the pixel to get.
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
    *
    * @method Phaser.BitmapData#getPixelRGB
    * @param {number} x - The X coordinate of the pixel to get.
    * @param {number} y - The Y coordinate of the pixel to get.
    * @return {object} The color object containing r, g, b, a and rgba properties.
    */
    getPixelRGB: function (x, y) {

        return this.unpackPixel(this.getPixel32(x, y));

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
    * Packs the r, g, b, a components into a single integer, for use with Int32Array.
    * If device is little endian then ABGR order is used. Otherwise RGBA order is used.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.BitmapData#packPixel
    * @param {number} r - The red byte, 0-255
    * @param {number} g - The green byte, 0-255
    * @param {number} b - The blue byte, 0-255
    * @param {number} a - The alpha byte, 0-255
    * @return {number} The packed color
    */
    packPixel: function (r, g, b, a) {

        if (this.littleEndian)
        {
            return (a << 24) | (b << 16) | (g <<  8) | r;
        }
        else
        {
            return (r << 24) | (g << 16) | (b <<  8) | a;
        }

    },

    /**
    * Unpacks the r, g, b, a components into the specified color object, or a new
    * object, for use with Int32Array. If little endian, then ABGR order is used when 
    * unpacking, otherwise, RGBA order is used. The resulting color object has the
    * `r, g, b, a` properties which are unrelated to endianness.
    *
    * Note that the integer is assumed to be packed in the correct endianness. On little-endian
    * the format is 0xAABBGGRR and on big-endian the format is 0xRRGGBBAA. If you want a
    * endian-independent method, use fromRGBA(rgba) and toRGBA(r, g, b, a).
    * 
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.BitmapData#unpackPixel
    * @param {number} rgba - The integer, packed in endian order by packPixel.
    * @param {object} out - The color object with `r, g, b, a, rgba and color` properties, or null.
    * @return {object} A color object.
    */
    unpackPixel: function (rgba, out) {

        if (!out)
        {
            out = { r: 0, g: 0, b: 0, a: 0, color: 0, rgba: '' };
        }

        if (this.littleEndian)
        {
            out.a = ((rgba & 0xff000000) >>> 24);
            out.b = ((rgba & 0x00ff0000) >>> 16);
            out.g = ((rgba & 0x0000ff00) >>> 8);
            out.r = ((rgba & 0x000000ff));
        }
        else
        {
            out.r = ((rgba & 0xff000000) >>> 24);
            out.g = ((rgba & 0x00ff0000) >>> 16);
            out.b = ((rgba & 0x0000ff00) >>> 8);
            out.a = ((rgba & 0x000000ff));
        }
        
        out.color = rgba;
        out.rgba = 'rgba(' + out.r + ',' + out.g + ',' + out.b + ',' + out.a + ')';

        return out;

    },

    /**
    * A utility to convert an integer in 0xRRGGBBAA format to a color object.
    * This does not rely on endianness.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.BitmapData#fromRGBA
    * @param {number} rgba - An RGBA hex
    * @param {object} [out] - The object to use, optional.
    * @return {object} A color object.
    */
    fromRGBA: function (rgba, out) {

        if (!out)
        {
            out = { r: 0, g: 0, b: 0, a: 0, rgba: '' };
        }

        out.r = ((rgba & 0xff000000) >>> 24);
        out.g = ((rgba & 0x00ff0000) >>> 16);
        out.b = ((rgba & 0x0000ff00) >>> 8);
        out.a = ((rgba & 0x000000ff));

        out.rgba = 'rgba(' + out.r + ',' + out.g + ',' + out.b + ',' + out.a + ')';

        return out;

    },

    /**
    * A utility to convert RGBA components to a 32 bit integer in RRGGBBAA format.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.BitmapData#toRGBA
    * @param {number} r - The r color component (0 - 255)
    * @param {number} g - The g color component (0 - 255)
    * @param {number} b - The b color component (0 - 255)
    * @param {number} a - The a color component (0 - 255)
    * @return {number} A RGBA-packed 32 bit integer
    */
    toRGBA: function (r, g, b, a) {

        return (r << 24) | (g << 16) | (b <<  8) | a;

    },

    /**
    * A utility function to create a lightweight 'color' object with the default components.
    * Any components that are not specified will default to zero.
    *
    * This is useful when you want to use a shared color object for the getPixel and getPixelAt methods.
    *
    * @author Matt DesLauriers (@mattdesl)
    * @method Phaser.BitmapData#createColor
    * @param {number} [r=0] - The r color component (0 - 255)
    * @param {number} [g=0] - The g color component (0 - 255)
    * @param {number} [b=0] - The b color component (0 - 255)
    * @param {number} [a=0] - The a color component (0 - 255)
    * @return {object} The resulting color object, with r, g, b, a properties
    */
    createColor: function (r, g, b, a) {

        var out = { r: r||0, g: g||0, b: b||0, a: a||0 };

        out.rgba = 'rgba(' + out.r + ',' + out.g + ',' + out.b + ',' + out.a + ')';

        return out;

    },

    /**
    * Copies the pixels from the source image to this BitmapData based on the given area and destination.
    *
    * @method Phaser.BitmapData#copyPixels
    * @param {HTMLImage|string} source - The Image to draw. If you give a key it will try and find the Image in the Game.Cache.
    * @param {Phaser.Rectangle} area - The Rectangle region to copy from the source image.
    * @param {number} destX - The destination x coordinate to copy the image to.
    * @param {number} destY - The destination y coordinate to copy the image to.
    */
    copyPixels: function (source, area, destX, destY) {

        if (typeof source === 'string')
        {
            source = this.game.cache.getImage(source);
        }

        if (source)
        {
            this.context.drawImage(source, area.x, area.y, area.width, area.height, destX, destY, area.width, area.height);
        }

    },

    /**
    * Draws the given image to this BitmapData at the coordinates specified. If you need to only draw a part of the image use BitmapData.copyPixels instead.
    *
    * @method Phaser.BitmapData#draw
    * @param {HTMLImage|string} source - The Image to draw. If you give a string it will try and find the Image in the Game.Cache.
    * @param {number} [x=0] - The x coordinate to draw the image to.
    * @param {number} [y=0] - The y coordinate to draw the image to.
    */
    draw: function (source, x, y) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }

        if (typeof source === 'string')
        {
            source = this.game.cache.getImage(source);
        }

        if (source)
        {
            this.context.drawImage(source, 0, 0, source.width, source.height, x, y, source.width, source.height);
        }

    },

    /**
    * Draws the given image to this BitmapData at the coordinates specified. If you need to only draw a part of the image use BitmapData.copyPixels instead.
    *
    * @method Phaser.BitmapData#drawSprite
    * @param {Phaser.Sprite|Phaser.Image} sprite - The Sprite to draw. Must have a loaded texture and frame.
    * @param {number} [x=0] - The x coordinate to draw the Sprite to.
    * @param {number} [y=0] - The y coordinate to draw the Sprite to.
    */
    drawSprite: function (sprite, x, y) {

        if (typeof x === 'undefined') { x = 0; }
        if (typeof y === 'undefined') { y = 0; }

        var frame = sprite.texture.frame;

        this.context.drawImage(sprite.texture.baseTexture.source, frame.x, frame.y, frame.width, frame.height, x, y, frame.width, frame.height);

    },

    /**
    * Draws the given image onto this BitmapData using an image as an alpha mask.
    *
    * @method Phaser.BitmapData#alphaMask
    * @param {HTMLImage|string} source - The Image to draw. If you give a key it will try and find the Image in the Game.Cache.
    * @param {HTMLImage|string} mask - The Image to use as the alpha mask. If you give a key it will try and find the Image in the Game.Cache.
    */
    alphaMask: function (source, mask) {

        var temp = this.context.globalCompositeOperation;

        if (typeof mask === 'string')
        {
            mask = this.game.cache.getImage(mask);
        }

        if (mask)
        {
            this.context.drawImage(mask, 0, 0);
        }

        this.context.globalCompositeOperation = 'source-atop';

        if (typeof source === 'string')
        {
            source = this.game.cache.getImage(source);
        }

        if (source)
        {
            this.context.drawImage(source, 0, 0);
        }

        this.context.globalCompositeOperation = temp;

    },

    /**
    * 
    *
    * @method Phaser.BitmapData#extractMask
    * @param {HTMLImage|string} source - The Image to draw. If you give a key it will try and find the Image in the Game.Cache.
    * @param {string} key - The Image to use as the alpha mask. If you give a key it will try and find the Image in the Game.Cache.
    * @return {HTMLImage}
    */
    extractMask: function (source, color, alpha) {

        if (typeof alpha === 'undefined') { alpha = 255; }



    },

    /**
    * If the game is running in WebGL this will push the texture up to the GPU if it's dirty.
    * This is called automatically if the BitmapData is being used by a Sprite, otherwise you need to remember to call it in your render function.
    * If you wish to suppress this functionality set BitmapData.disableTextureUpload to `true`.
    *
    * @method Phaser.BitmapData#render
    */
    render: function () {

        if (!this.disableTextureUpload && this.game.renderType === Phaser.WEBGL && this.dirty)
        {
            //  Only needed if running in WebGL, otherwise this array will never get cleared down
            //  should use the rendersession
            PIXI.updateWebGLTexture(this.baseTexture, this.game.renderer.gl);

            this.dirty = false;
        }

    }

};

Phaser.BitmapData.prototype.constructor = Phaser.BitmapData;
