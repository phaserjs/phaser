/**
 * @author Chad Engler <chad@pantherdev.com>
 */

/**
 * The Ellipse object can be used to specify a hit area for displayobjects
 *
 * @class Ellipse
 * @constructor
 * @param x {number} The X coord of the upper-left corner of the framing rectangle of this ellipse
 * @param y {number} The Y coord of the upper-left corner of the framing rectangle of this ellipse
 * @param width {number} The overall height of this ellipse
 * @param height {number} The overall width of this ellipse
 */
PIXI.Ellipse = function(x, y, width, height)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;
    
    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;
    
    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width || 0;
    
    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height || 0;
}

/**
 * Creates a clone of this Ellipse instance
 *
 * @method clone
 * @return {Ellipse} a copy of the ellipse
 */
PIXI.Ellipse.prototype.clone = function()
{
    return new PIXI.Ellipse(this.x, this.y, this.width, this.height);
}

/**
 * Checks if the x, and y coords passed to this function are contained within this ellipse
 *
 * @method contains
 * @param x {number} The X coord of the point to test
 * @param y {number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this ellipse
 */
PIXI.Ellipse.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

    //normalize the coords to an ellipse with center 0,0
    //and a radius of 0.5
    var normx = ((x - this.x) / this.width) - 0.5,
        normy = ((y - this.y) / this.height) - 0.5;

    normx *= normx;
    normy *= normy;

    return (normx + normy < 0.25);
}

PIXI.Ellipse.getBounds = function()
{
    return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
}

PIXI.Ellipse.prototype.constructor = PIXI.Ellipse;

