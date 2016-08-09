/**
* @author       Mat Groves http://matgroves.com/
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Rounded Rectangle object is an area defined by its position and has nice rounded corners, 
* as indicated by its top-left corner point (x, y) and by its width and its height.
*
* @class Phaser.RoundedRectangle
* @constructor
* @param {number} [x=0] - The x coordinate of the top-left corner of the Rectangle.
* @param {number} [y=0] - The y coordinate of the top-left corner of the Rectangle.
* @param {number} [width=0] - The width of the Rectangle. Should always be either zero or a positive value.
* @param {number} [height=0] - The height of the Rectangle. Should always be either zero or a positive value.
* @param {number} [radius=20] - Controls the radius of the rounded corners.
*/
Phaser.RoundedRectangle = function(x, y, width, height, radius)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (width === undefined) { width = 0; }
    if (height === undefined) { height = 0; }
    if (radius === undefined) { radius = 20; }

    /**
    * @property {number} x - The x coordinate of the top-left corner of the Rectangle.
    */
    this.x = x;

    /**
    * @property {number} y - The y coordinate of the top-left corner of the Rectangle.
    */
    this.y = y;

    /**
    * @property {number} width - The width of the Rectangle. This value should never be set to a negative.
    */
    this.width = width;

    /**
    * @property {number} height - The height of the Rectangle. This value should never be set to a negative.
    */
    this.height = height;

    /**
    * @property {number} radius - The radius of the rounded corners.
    */
    this.radius = radius || 20;

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.ROUNDEDRECTANGLE;
};

Phaser.RoundedRectangle.prototype = {

    /**
    * Returns a new RoundedRectangle object with the same values for the x, y, width, height and
    * radius properties as this RoundedRectangle object.
    * 
    * @method Phaser.RoundedRectangle#clone
    * @return {Phaser.RoundedRectangle}
    */
    clone: function () {

        return new Phaser.RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);

    },

    /**
    * Determines whether the specified coordinates are contained within the region defined by this Rounded Rectangle object.
    * 
    * @method Phaser.RoundedRectangle#contains
    * @param {number} x - The x coordinate of the point to test.
    * @param {number} y - The y coordinate of the point to test.
    * @return {boolean} A value of true if the RoundedRectangle Rectangle object contains the specified point; otherwise false.
    */
    contains: function (x, y) {

        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }

        var x1 = this.x;

        if (x >= x1 && x <= x1 + this.width)
        {
            var y1 = this.y;

            if (y >= y1 && y <= y1 + this.height)
            {
                return true;
            }
        }

        return false;

    }

};

Phaser.RoundedRectangle.prototype.constructor = Phaser.RoundedRectangle;

//  Because PIXI uses its own type, we'll replace it with ours to avoid duplicating code or confusion.
PIXI.RoundedRectangle = Phaser.RoundedRectangle;
