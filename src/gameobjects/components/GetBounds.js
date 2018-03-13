/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Rectangle = require('../../geom/rectangle/Rectangle');
var RotateAround = require('../../math/RotateAround');
var Vector2 = require('../../math/Vector2');

/**
 * Provides methods used for obtaining the bounds of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.GetBounds
 * @since 3.0.0
 */

var GetBounds = {

    /**
     * Gets the center coordinate of this Game Object, regardless of origin.
     * 
     * @method Phaser.GameObjects.Components.GetBounds#getCenter
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
     * @method Phaser.GameObjects.Components.GetBounds#getTopLeft
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
     * @method Phaser.GameObjects.Components.GetBounds#getTopRight
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
     * @method Phaser.GameObjects.Components.GetBounds#getBottomLeft
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
     * @method Phaser.GameObjects.Components.GetBounds#getBottomRight
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
     * @method Phaser.GameObjects.Components.GetBounds#getBounds
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
    }

};

module.exports = GetBounds;
