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
    this.canvas = Phaser.Canvas.create(width, height);
    
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

    this._dirty = false;

}

Phaser.BitmapData.prototype = {

    /**
    * Updates the given objects so that they use this BitmapData as their texture.
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
    
        this._dirty = true;

    },

    /**
    * Resizes the BitmapData.
    * @method Phaser.BitmapData#resize
    */
    resize: function (width, height) {

        if (width !== this.width || height !== this.height)
        {
            console.log('bmd resize', width, height);
            this.width = width;
            this.height = height;
            this.canvas.width = width;
            this.canvas.height = height;
            this.textureFrame.width = width;
            this.textureFrame.height = height;
            this.imageData = this.context.getImageData(0, 0, width, height);
        }
    
        this._dirty = true;

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

            this._dirty = true;
        }

    },

    /**
    * Sets the color of the given pixel to the specified red, green and blue values.
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
    * Get a color of a specific pixel.
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
    * Get a color of a specific pixel (including alpha value).
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
    * Get pixels in array in a specific Rectangle.
    * @param rect {Rectangle} The specific Rectangle.
    * @return {array} CanvasPixelArray.
    */
    getPixels: function (rect) {

        return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);

    },

    copyPixels: function (source, area, destX, destY) {

        this.context.drawImage(source, area.x, area.y, area.width, area.height, destX, destY, area.width, area.height);

    },

    /**
    * If the game is running in WebGL this will push the texture up to the GPU if it's dirty.
    * This is called automatically if the BitmapData is being used by a Sprite, otherwise you need to remember to call it in your render function.
    * @method Phaser.BitmapData#render
    */
    render: function () {

        if (this._dirty)
        {
            //  Only needed if running in WebGL, otherwise this array will never get cleared down
            if (this.game.renderType == Phaser.WEBGL)
            {
                PIXI.texturesToUpdate.push(this.baseTexture);
            }

            this._dirty = false;
        }

    }

};

Phaser.BitmapData.prototype.constructor = Phaser.BitmapData;
