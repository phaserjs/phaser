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
    * @property {array} imageData - The canvas image data.
    */
    this.imageData = this.context.getImageData(0, 0, width, height);

    /**
    * @property {UInt8Clamped} pixels - A reference to the context imageData buffer.
    */
    if (this.imageData.data.buffer)
    {
        this.pixels = this.imageData.data.buffer;
    }
    else
    {
        this.pixels = this.imageData.data;
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

    /**
    * @property {number} type - The const type of this object.
    * @default
    */
    this.type = Phaser.BITMAPDATA;

    /**
    * @property {boolean} dirty - If dirty this BitmapData will be re-rendered.
    */
    this.dirty = false;

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
    * Clears the BitmapData.
    * @method Phaser.BitmapData#clear
    */
    clear: function () {

        this.context.clearRect(0, 0, this.width, this.height);

        this.dirty = true;

    },

    /**
    * Resizes the BitmapData.
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
            this.imageData = this.context.getImageData(0, 0, width, height);
        }

        this.dirty = true;

    },

    /**
    * @method Phaser.BitmapData#refreshBuffer
    */
    refreshBuffer: function () {

        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.pixels = new Int32Array(this.imageData.data.buffer);

        // this.data8 = new Uint8ClampedArray(this.imageData.buffer);
        // this.data32 = new Uint32Array(this.imageData.buffer);

    },

    /**
    * Sets the color of the given pixel to the specified red, green, blue and alpha values.
    * @method Phaser.BitmapData#setPixel32
    * @param {number} x - The X coordinate of the pixel to be set.
    * @param {number} y - The Y coordinate of the pixel to be set.
    * @param {number} red - The red color value, between 0 and 0xFF (255).
    * @param {number} green - The green color value, between 0 and 0xFF (255).
    * @param {number} blue - The blue color value, between 0 and 0xFF (255).
    * @param {number} alpha - The alpha color value, between 0 and 0xFF (255).
    */
    setPixel32: function (x, y, red, green, blue, alpha) {

        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        {
            this.pixels[y * this.width + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;

            /*
            if (this.isLittleEndian)
            {
                this.data32[y * this.width + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;
            }
            else
            {
                this.data32[y * this.width + x] = (red << 24) | (green << 16) | (blue << 8) | alpha;
            }
           */

            // this.imageData.data.set(this.data8);

            this.context.putImageData(this.imageData, 0, 0);

            this.dirty = true;
        }

    },

    /**
    * Sets the color of the given pixel to the specified red, green and blue values.
    *
    * @method Phaser.BitmapData#setPixel
    * @param {number} x - The X coordinate of the pixel to be set.
    * @param {number} y - The Y coordinate of the pixel to be set.
    * @param {number} red - The red color value (between 0 and 255)
    * @param {number} green - The green color value (between 0 and 255)
    * @param {number} blue - The blue color value (between 0 and 255)
    */
    setPixel: function (x, y, red, green, blue) {

        this.setPixel32(x, y, red, green, blue, 255);

    },

    /**
    * Get the color of a specific pixel.
    *
    * @param {number} x - The X coordinate of the pixel to get.
    * @param {number} y - The Y coordinate of the pixel to get.
    * @return {number} A native color value integer (format: 0xRRGGBB)
    */
    getPixel: function (x, y) {

        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        {
            return this.data32[y * this.width + x];
        }

    },

    /**
    * Get the color of a specific pixel including its alpha value.
    *
    * @param {number} x - The X coordinate of the pixel to get.
    * @param {number} y - The Y coordinate of the pixel to get.
    * @return {number} A native color value integer (format: 0xAARRGGBB)
    */
    getPixel32: function (x, y) {

        if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
        {
            return this.data32[y * this.width + x];
        }

    },

    /**
    * Gets all the pixels from the region specified by the given Rectangle object.
    *
    * @param {Phaser.Rectangle} rect - The Rectangle region to get.
    * @return {array} CanvasPixelArray.
    */
    getPixels: function (rect) {

        return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);

    },

    /**
    * Copies the pixels from the source image to this BitmapData based on the given area and destination.
    *
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
    * @param {HTMLImage|string} source - The Image to draw. If you give a key it will try and find the Image in the Game.Cache.
    * @param {number} destX - The destination x coordinate to draw the image to.
    * @param {number} destY - The destination y coordinate to draw the image to.
    */
    draw: function (source, destX, destY) {

        if (typeof source === 'string')
        {
            source = this.game.cache.getImage(source);
        }

        if (source)
        {
            this.context.drawImage(source, 0, 0, source.width, source.height, destX, destY, source.width, source.height);
        }

    },

    /**
    * Draws the given image onto this BitmapData using an image as an alpha mask.
    *
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
    * If the game is running in WebGL this will push the texture up to the GPU if it's dirty.
    * This is called automatically if the BitmapData is being used by a Sprite, otherwise you need to remember to call it in your render function.
    *
    * @method Phaser.BitmapData#render
    */
    render: function () {

        if (this.game.renderType === Phaser.WEBGL && this.dirty)
        {
            //  Only needed if running in WebGL, otherwise this array will never get cleared down
            //  should use the rendersession
            PIXI.updateWebGLTexture(this.baseTexture, this.game.renderer.gl);

            this.dirty = false;
        }

    }

};

Phaser.BitmapData.prototype.constructor = Phaser.BitmapData;
