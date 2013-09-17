/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Animation
*/

/**
* A Frame is a single frame of an animation and is part of a FrameData collection.
*
* @class Frame
* @constructor
* @param {Number} index The index of this Frame within the FrameData set it is being added to.
* @param {Number} x X position of the frame within the texture image.
* @param {Number} y Y position of the frame within the texture image.
* @param {Number} width Width of the frame within the texture image.
* @param {Number} height Height of the frame within the texture image.
* @param {String} name The name of the frame. In Texture Atlas data this is usually set to the filename.
* @param {String} uuid Internal UUID key.
*/
Phaser.Animation.Frame = function (index, x, y, width, height, name, uuid) {

	/**
	* The index of this Frame within the FrameData set it is being added to.
    * @property index
    * @public
	* @type {Number}
	*/
	this.index = index;

	/**
	* X position within the image to cut from.
    * @property x
    * @public
	* @type {Number}
	*/
	this.x = x;

	/**
	* Y position within the image to cut from.
    * @property y
    * @public
	* @type {Number}
	*/
	this.y = y;

	/**
	* Width of the frame.
    * @property width
    * @public
	* @type {Number}
	*/
	this.width = width;

	/**
	* Height of the frame.
    * @property height
    * @public
	* @type {Number}
	*/
	this.height = height;

	/**
	* Useful for Texture Atlas files. (is set to the filename value)
    * @property name
    * @public
    * @type {String}
	*/
	this.name = name;

	/**
	* A link to the PIXI.TextureCache entry
    * @property uuid
    * @public
    * @type {String}
	*/
	this.uuid = uuid;

	/**
	* center X position within the image to cut from.
    * @property centerX
    * @public
	* @type {Number}
	*/
    this.centerX = Math.floor(width / 2);

	/**
	* center Y position within the image to cut from.
    * @property centerY
    * @public
	* @type {Number}
	*/
    this.centerY = Math.floor(height / 2);

	/**
	* The distance from the top left to the bottom-right of this Frame.
    * @property distance
    * @public
	* @type {Number}
	*/
	this.distance = Phaser.Math.distance(0, 0, width, height);

	/**
	* Rotated? (not yet implemented)
    * @property rotated
    * @public
    * @type {Boolean}
    * @default false
	*/
	this.rotated = false;

	/**
	* Either cw or ccw, rotation is always 90 degrees.
    * @property rotationDirection
    * @public
    * @type {String}
    * @default "cw"
	*/
	this.rotationDirection = 'cw';

	/**
	* Was it trimmed when packed?
    * @property trimmed
    * @public
	* @type {Boolean}
	*/
	this.trimmed = false;

	/**
	* Width of the original sprite.
    * @property sourceSizeW
    * @public
	* @type {Number}
	*/
    this.sourceSizeW = width;

	/**
	* Height of the original sprite.
    * @property sourceSizeH
    * @public
	* @type {Number}
	*/
    this.sourceSizeH = height;

	/**
	* X position of the trimmed sprite inside original sprite.
    * @property spriteSourceSizeX
    * @public
	* @type {Number}
    * @default 0
	*/
	this.spriteSourceSizeX = 0;

	/**
	* Y position of the trimmed sprite inside original sprite.
    * @property spriteSourceSizeY
    * @public
	* @type {Number}
    * @default 0
	*/
	this.spriteSourceSizeY = 0;

	/**
	* Width of the trimmed sprite.
    * @property spriteSourceSizeW
    * @public
	* @type {Number}
    * @default 0
	*/
	this.spriteSourceSizeW = 0;

	/**
	* Height of the trimmed sprite.
    * @property spriteSourceSizeH
    * @public
	* @type {Number}
    * @default 0
	*/
	this.spriteSourceSizeH = 0;

};

Phaser.Animation.Frame.prototype = {

	/**
	* If the frame was trimmed when added to the Texture Atlas this records the trim and source data.
	*
	* @method setTrim
	* @param {Boolean} trimmed If this frame was trimmed or not.
	* @param {Number} actualWidth The width of the frame before being trimmed.
	* @param {Number} actualHeight The height of the frame before being trimmed.
	* @param {Number} destX The destination X position of the trimmed frame for display.
	* @param {Number} destY The destination Y position of the trimmed frame for display.
	* @param {Number} destWidth The destination width of the trimmed frame for display.
	* @param {Number} destHeight The destination height of the trimmed frame for display.
	*/
    setTrim: function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {

        this.trimmed = trimmed;

        if (trimmed)
        {
            this.width = actualWidth;
            this.height = actualHeight;
            this.sourceSizeW = actualWidth;
            this.sourceSizeH = actualHeight;
		    this.centerX = Math.floor(actualWidth / 2);
		    this.centerY = Math.floor(actualHeight / 2);
            this.spriteSourceSizeX = destX;
            this.spriteSourceSizeY = destY;
            this.spriteSourceSizeW = destWidth;
            this.spriteSourceSizeH = destHeight;
        }

    }

};
