/**
* Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*
* @package    Phaser.Animation.Frame
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.Animation.Frame = function (x, y, width, height, name, uuid) {

	/**
	 * X position within the image to cut from.
	 * @type {number}
	 */
	this.x = x;

	/**
	 * Y position within the image to cut from.
	 * @type {number}
	 */
	this.y = y;

	/**
	 * Width of the frame.
	 * @type {number}
	 */
	this.width = width;

	/**
	 * Height of the frame.
	 * @type {number}
	 */
	this.height = height;

	/**
	 * center X position within the image to cut from.
	 * @type {number}
	 */
    this.centerX = Math.floor(width / 2);

	/**
	 * center Y position within the image to cut from.
	 * @type {number}
	 */
    this.centerY = Math.floor(height / 2);

	/**
	 * Useful for Sprite Sheets.
	 * @type {number}
	 */
	this.index = 0;

	/**
	 * Useful for Texture Atlas files. (is set to the filename value)
	 */
	this.name = name;

	/**
	 * A link to the PIXI.TextureCache entry
	 */
	this.uuid = uuid;

	/**
	 * The distance from the top left to the bottom-right of this Frame.
	 * @type {number}
	 */
	this.distance = Phaser.Math.distance(0, 0, width, height);

	/**
	 * Rotated? (not yet implemented)
	 */
	this.rotated = false;

	/**
	 * Either cw or ccw, rotation is always 90 degrees.
	 */
	this.rotationDirection = 'cw';

	/**
	 * Was it trimmed when packed?
	 * @type {bool}
	 */
	this.trimmed = false;

	/**
	 * Width of the original sprite.
	 * @type {number}
	 */
    this.sourceSizeW = width;

	/**
	 * Height of the original sprite.
	 * @type {number}
	 */
    this.sourceSizeH = height;

	/**
	 * X position of the trimmed sprite inside original sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeX = 0;

	/**
	 * Y position of the trimmed sprite inside original sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeY = 0;

	/**
	 * Width of the trimmed sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeW = 0;

	/**
	 * Height of the trimmed sprite.
	 * @type {number}
	 */
	this.spriteSourceSizeH = 0;

};

Phaser.Animation.Frame.prototype = {

	/**
	* Set trim of the frame.
	* @param trimmed {bool} Whether this frame trimmed or not.
	* @param actualWidth {number} Actual width of this frame.
	* @param actualHeight {number} Actual height of this frame.
	* @param destX {number} Destination x position.
	* @param destY {number} Destination y position.
	* @param destWidth {number} Destination draw width.
	* @param destHeight {number} Destination draw height.
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
