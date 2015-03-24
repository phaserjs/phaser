/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Bounds component contains properties related to the bounds of the Game Object.
*
* @class
*/
Phaser.Component.Bounds = function () {};

Phaser.Component.Bounds.prototype = {

    /**
    * The amount the Game Object is visually offset from its x coordinate.
    * This is the same as `width * anchor.x`.
    * It will only be > 0 if anchor.x is not equal to zero.
    *
    * @property {number} offsetX
    * @readOnly
    */
    offsetX: {

        get: function () {

            return this.anchor.x * this.width;

        }

    },

    /**
    * The amount the Game Object is visually offset from its y coordinate.
    * This is the same as `height * anchor.y`.
    * It will only be > 0 if anchor.y is not equal to zero.
    *
    * @property {number} offsetY
    * @readOnly
    */
    offsetY: {

        get: function () {

            return this.anchor.y * this.height;

        }

    },

    /**
    * The left coordinate of the Game Object.
    * This is the same as `x - offsetX`.
    *
    * @property {number} left
    * @readOnly
    */
    left: {

        get: function () {

            return this.x - this.offsetX;

        }

    },

    /**
    * The right coordinate of the Game Object.
    * This is the same as `x + width - offsetX`.
    *
    * @property {number} right
    * @readOnly
    */
    right: {

        get: function () {

            return (this.x + this.width) - this.offsetX;

        }

    },

    /**
    * The y coordinate of the Game Object.
    * This is the same as `y - offsetY`.
    *
    * @property {number} top
    * @readOnly
    */
    top: {

        get: function () {

            return this.y - this.offsetY;

        }

    },

    /**
    * The sum of the y and height properties.
    * This is the same as `y + height - offsetY`.
    *
    * @property {number} bottom
    * @readOnly
    */
    bottom: {

        get: function () {

            return (this.y + this.height) - this.offsetY;

        }

    }

};
