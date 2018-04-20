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
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getCenter
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
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
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopLeft
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getTopLeft: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the top-right corner coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getTopRight
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getTopRight: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the bottom-left corner coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomLeft
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getBottomLeft: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
        }

        return output;
    },

    /**
     * Gets the bottom-right corner coordinate of this Game Object, regardless of origin.
     * The returned point is calculated in local space and does not factor in any parent containers
     *
     * @method Phaser.GameObjects.Components.GetBounds#getBottomRight
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {(Phaser.Math.Vector2|object)} [output] - An object to store the values in. If not provided a new Vector2 will be created.
     * @param {boolean} [includeParent=false] - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
     *
     * @return {(Phaser.Math.Vector2|object)} The values stored in the output object.
     */
    getBottomRight: function (output, includeParent)
    {
        if (!output) { output = new Vector2(); }
        if (includeParent === undefined) { includeParent = false; }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        if (includeParent && this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            parentMatrix.transformPoint(output.x, output.y, output);
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
     * @generic {Phaser.Geom.Rectangle} O - [output,$return]
     *
     * @param {(Phaser.Geom.Rectangle|object)} [output] - An object to store the values in. If not provided a new Rectangle will be created.
     *
     * @return {(Phaser.Geom.Rectangle|object)} The values stored in the output object.
     */
    getBounds: function (output)
    {
        if (output === undefined) { output = new Rectangle(); }

        //  We can use the output object to temporarily store the x/y coords in:

        var TLx, TLy, TRx, TRy, BLx, BLy, BRx, BRy;

        // Instead of doing a check if parent container is 
        // defined per corner we only do it once.
        if (this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();

            this.getTopLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            TLx = output.x;
            TLy = output.y;

            this.getTopRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            TRx = output.x;
            TRy = output.y;

            this.getBottomLeft(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            BLx = output.x;
            BLy = output.y;

            this.getBottomRight(output);
            parentMatrix.transformPoint(output.x, output.y, output);

            BRx = output.x;
            BRy = output.y;
        }
        else
        {
            this.getTopLeft(output);

            TLx = output.x;
            TLy = output.y;

            this.getTopRight(output);

            TRx = output.x;
            TRy = output.y;

            this.getBottomLeft(output);

            BLx = output.x;
            BLy = output.y;

            this.getBottomRight(output);

            BRx = output.x;
            BRy = output.y;
        }

        output.x = Math.min(TLx, TRx, BLx, BRx);
        output.y = Math.min(TLy, TRy, BLy, BRy);
        output.width = Math.max(TLx, TRx, BLx, BRx) - output.x;
        output.height = Math.max(TLy, TRy, BLy, BRy) - output.y;

        return output;
    }

};

module.exports = GetBounds;
