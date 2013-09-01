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

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.name = name;
	this.uuid = uuid;
	this.distance = Phaser.Math.distance(0, 0, width, height);

};

Phaser.Animation.Frame.prototype = {

	/**
	 * A link to the PIXI.TextureCache entry
	 */
	uuid: '',

	/**
	 * X position within the image to cut from.
	 * @type {number}
	 */
	x: 0,

	/**
	 * Y position within the image to cut from.
	 * @type {number}
	 */
	y: 0,

	/**
	 * Width of the frame.
	 * @type {number}
	 */
	width: 0,

	/**
	 * Height of the frame.
	 * @type {number}
	 */
	height: 0,

	/**
	 * The distance from the top left to the bottom-right of this Frame.
	 * @type {number}
	 */
	distance: 0,

	/**
	 * Useful for Sprite Sheets.
	 * @type {number}
	 */
	index: 0,

	/**
	 * Useful for Texture Atlas files. (is set to the filename value)
	 */
	name: '',

	/**
	 * Rotated? (not yet implemented)
	 */
	rotated: false,

	/**
	 * Either cw or ccw, rotation is always 90 degrees.
	 */
	rotationDirection: 'cw',

	/**
	 * Was it trimmed when packed?
	 * @type {bool}
	 */
	trimmed: false,

	//  The coordinates of the trimmed sprite inside the original sprite

	/**
	 * Width of the original sprite.
	 * @type {number}
	 */
	sourceSizeW: 0,

	/**
	 * Height of the original sprite.
	 * @type {number}
	 */
	sourceSizeH: 0,

	/**
	 * X position of the trimmed sprite inside original sprite.
	 * @type {number}
	 */
	spriteSourceSizeX: 0,

	/**
	 * Y position of the trimmed sprite inside original sprite.
	 * @type {number}
	 */
	spriteSourceSizeY: 0,

	/**
	 * Width of the trimmed sprite.
	 * @type {number}
	 */
	spriteSourceSizeW: 0,

	/**
	 * Height of the trimmed sprite.
	 * @type {number}
	 */
	spriteSourceSizeH: 0,

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

        if (trimmed) {
            this.width = actualWidth;
            this.height = actualHeight;
            this.sourceSizeW = actualWidth;
            this.sourceSizeH = actualHeight;
            this.spriteSourceSizeX = destX;
            this.spriteSourceSizeY = destY;
            this.spriteSourceSizeW = destWidth;
            this.spriteSourceSizeH = destHeight;
        }

    }

};
