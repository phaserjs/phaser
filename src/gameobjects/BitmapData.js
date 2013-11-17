/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new `BitmapData` object.
*
* @class Phaser.BitmapData
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {string} [key] - A key the BitmapData will use when added to the Phaser.Cache. If none is given a UUID is generated.
* @param {number} [width=256] - The width of the BitmapData in pixels.
* @param {number} [height=256] - The height of the BitmapData in pixels.
*/
Phaser.BitmapData = function (game, key, width, height) {

	if (typeof key === 'undefined') { key = 'bitmapData' . game.rnd.uuid(); }
	if (typeof width === 'undefined') { width = 256; }
	if (typeof height === 'undefined') { height = 256; }

	/**
	* @property {Phaser.Game} game - A reference to the currently running game. 
	*/
	this.game = game;

	/**
	* @property {boolean} exists - If exists = false then the BitmapData isn't updated by the core game loop.
	* @default
	*/
    this.exists = true;

	/**
    * @property {Phaser.Group} group - The parent Group of this BitmapData.
   	*/
    this.group = null;

	/**
    * @property {string} name - The name of the BitmapData.
	*/
    this.name = key;

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
	* @property {HTMLCanvasContextElement} context - The 2d context of the canvas.
	* @default
	*/
    this.context = this.canvas.getContext('2d');

	/**
	* @property {array} imageData - The canvas image data.
	*/
	this.imageData = this.context.getImageData(0, 0, width, height);
    
	/**
	* @property {ArrayBuffer} buffer - A TypedArray storing the canvas image data.
	* TODO:      = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
	*/
	this.buffer = new ArrayBuffer(this.imageData.data.length);

	/**
	* @property {Uint8ClampedArray} buffer - A uint8 clamped view on the buffer.
	*/
	this.data8 = new Uint8ClampedArray(this.buffer);

	/**
	* @property {Uint32Array} buffer - A Uint32 view on the buffer.
	*/
	this.data32 = new Uint32Array(this.buffer);

	// Little or big-endian?
	this.data32[1] = 0x0a0b0c0d;
    
	/**
	* @property {boolean} isLittleEndian - .
	*/
	this.isLittleEndian = true;

	if (this.data32[4] === 0x0a && this.data32[5] === 0x0b && this.data32[6] === 0x0c && this.data32[7] === 0x0d)
	{
    	this.isLittleEndian = false;
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
	* You can set a globalCompositeOperation that will be applied to this BitmapData.
	* This is useful if you wish to apply an effect like 'lighten'.
	* If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
	* Set to null to disable.
	* @property {string} globalCompositeOperation
    * @default
	*/
	this.globalCompositeOperation = null;

	this._dirty = false;

}

Phaser.BitmapData.prototype = {

	clear: function () {

	    this.context.clearRect(0, 0, this.width, this.height);
	
		this._dirty = true;

	},

	/**
	* Sets the color of the given pixel.
	* @param {number} x - The X coordinate of the pixel to be set.
	* @param {number} y - The Y coordinate of the pixel to be set.
	* @param {number} red - The red color value (between 0 and 255)
	* @param {number} green - The green color value (between 0 and 255)
	* @param {number} blue - The blue color value (between 0 and 255)
	* @param {number} alpha - The alpha color value (between 0 and 255)
	*/
    setPixel32: function (x, y, red, green, blue, alpha) {

    	if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
    	{
			var value = x * y & 0xff;

    		if (this.isLittleEndian)
    		{
				this.data32[y * this.width + x] = (alpha << 24) | (blue << 16) | (green << 8) | red;
    		}
    		else
    		{
				this.data32[y * this.width + x] = (red << 24) | (green << 16) | (blue << 8) | alpha;
    		}

    		this.imageData.data.set(this.data8);

    		this.context.putImageData(this.imageData, 0, 0);

			this._dirty = true;
    	}

    },

	/**
	* Sets the color of the given pixel.
	* @param {number} x - The X coordinate of the pixel to be set.
	* @param {number} y - The Y coordinate of the pixel to be set.
	* @param {number} red - The red color value (between 0 and 255)
	* @param {number} green - The green color value (between 0 and 255)
	* @param {number} blue - The blue color value (between 0 and 255)
	* @param {number} alpha - The alpha color value (between 0 and 255)
	*/
    setPixel: function (x, y, red, green, blue) {

    	this.setPixel32(x, y, red, green, blue, 255);

    },

	/**
	* Get a color of a specific pixel.
	* @param x {number} X position of the pixel in this texture.
	* @param y {number} Y position of the pixel in this texture.
	* @return {number} A native color value integer (format: 0xRRGGBB)
	*/
    getPixel: function (x, y) {

    	if (x >= 0 && x <= this.width && y >= 0 && y <= this.height)
    	{
    		if (this.isLittleEndian)
    		{
    		}
    		else
    		{
    		}
    	}

        //r = imageData.data[0];
        //g = imageData.data[1];
        //b = imageData.data[2];
        //a = imageData.data[3];
        // var imageData = this.context.getImageData(x, y, 1, 1);

        // return Phaser.ColorUtils.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);

    },

	/**
	* Get a color of a specific pixel (including alpha value).
	* @param x {number} X position of the pixel in this texture.
	* @param y {number} Y position of the pixel in this texture.
	* @return  A native color value integer (format: 0xAARRGGBB)
	*/
    getPixel32: function (x, y) {

        // var imageData = this.context.getImageData(x, y, 1, 1);

        // return Phaser.ColorUtils.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);

    },

    /**
     * Get pixels in array in a specific Rectangle.
     * @param rect {Rectangle} The specific Rectangle.
     * @returns {array} CanvasPixelArray.
     */
    getPixels: function (rect) {

        // return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);

    },

	postUpdate: function () {

		if (this._dirty)
		{
		    //  Only needed if running in WebGL, otherwise this array will never get cleared down I don't think!
		    if (this.game.renderType == Phaser.WEBGL)
		    {
		        PIXI.texturesToUpdate.push(this.baseTexture);
		    }

			this._dirty = false;
		}

	}

}

