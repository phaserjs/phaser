var Rectangle = require('../../geom/rectangle/Rectangle');
var RotateAround = require('../../math/RotateAround');
var Vector2 = require('../../math/Vector2');

/**
 * Provides methods used for obtaining the bounds of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.GetBounds
 * @mixin
 * @since 3.0.0
 */

var GetBounds = {

    /**
     * Gets the center coordinate of this Game Object, regardless of origin.
     * 
     * @method Phaser.GameObjects.Components.GetBounds.getCenter
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2|object} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * 
     * @return {Phaser.Math.Vector2|object} The values stored in the output object.
     */
    getCenter: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX) + (this.displayWidth / 2);
        output.y = this.y - (this.displayHeight * this.originY) + (this.displayHeight / 2);

        return output;
    },

    /**
     * Gets the top-left corner coordinate of this Game Object, regardless of origin.
     * 
     * @method Phaser.GameObjects.Components.GetBounds.getTopLeft
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2|object} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * 
     * @return {Phaser.Math.Vector2|object} The values stored in the output object.
     */
    getTopLeft: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    /**
     * Gets the top-right corner coordinate of this Game Object, regardless of origin.
     * 
     * @method Phaser.GameObjects.Components.GetBounds.getTopRight
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2|object} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * 
     * @return {Phaser.Math.Vector2|object} The values stored in the output object.
     */
    getTopRight: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    /**
     * Gets the bottom-left corner coordinate of this Game Object, regardless of origin.
     * 
     * @method Phaser.GameObjects.Components.GetBounds.getBottomLeft
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2|object} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * 
     * @return {Phaser.Math.Vector2|object} The values stored in the output object.
     */
    getBottomLeft: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    /**
     * Gets the bottom-right corner coordinate of this Game Object, regardless of origin.
     * 
     * @method Phaser.GameObjects.Components.GetBounds.getBottomRight
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2|object} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * 
     * @return {Phaser.Math.Vector2|object} The values stored in the output object.
     */
    getBottomRight: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    /**
     * Gets the bounds of this Game Object, regardless of origin.
     * The values are stored and returned in a Rectangle, or Rectangle-like, object.
     * 
     * @method Phaser.GameObjects.Components.GetBounds.getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle|object} [output] - An object to store the values in. If not provided a new Rectangle will be created.
     * 
     * @return {Phaser.Geom.Rectangle|object} The values stored in the output object.
     */
    getBounds: function (output)
    {
        if (output === undefined) { output = new Rectangle(); }

        //  We can use the output object to temporarily store the x/y coords in:

        this.getTopLeft(output);

        var TLx = output.x;
        var TLy = output.y;

        this.getTopRight(output);

        var TRx = output.x;
        var TRy = output.y;

        this.getBottomLeft(output);

        var BLx = output.x;
        var BLy = output.y;

        this.getBottomRight(output);

        var BRx = output.x;
        var BRy = output.y;

        output.x = Math.min(TLx, TRx, BLx, BRx);
        output.y = Math.min(TLy, TRy, BLy, BRy);
        output.width = Math.max(TLx, TRx, BLx, BRx) - output.x;
        output.height = Math.max(TLy, TRy, BLy, BRy) - output.y;

        return output;
    },

    //  Works but only if originX/Y = 0

    /*
    getBounds: function (output)
    {
        if (output === undefined) { output = new Rectangle(); }

        var x = this.x;
        var y = this.y;

        var w = this.displayWidth;
        var h = this.displayHeight;

        var r = this.rotation;

        var wct = w * Math.cos(r);
        var hct = h * Math.cos(r);

        var wst = w * Math.sin(r);
        var hst = h * Math.sin(r);

        var xMin = x;
        var xMax = x;
        var yMin = y;
        var yMax = y;

        if (r > 0)
        {
            if (r < 1.5707963267948966)
            {
                // 0 < theta < 90
                yMax = y + hct + wst;
                xMin = x - hst;
                xMax = x + wct;
            }
            else
            {
                // 90 <= theta <= 180
                yMin = y + hct;
                yMax = y + wst;
                xMin = x - hst + wct;
            }
        }
        else if (r > -1.5707963267948966)
        {
            // -90 < theta <= 0
            yMin = y + wst;
            yMax = y + hct;
            xMax = x + wct - hst;
        }
        else
        {
            // -180 <= theta <= -90
            yMin = y + wst + hct;
            xMin = x + wct;
            xMax = x - hst;
        }

        output.x = xMin;
        output.y = yMin;
        output.width = xMax - xMin;
        output.height = yMax - yMin;

        return output;
    }
    */
};

module.exports = GetBounds;
