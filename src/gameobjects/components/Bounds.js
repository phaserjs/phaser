/**
* Bounds Component Features.
*
* @class
*/
Phaser.Component.Bounds = function () {};

Phaser.Component.Bounds.prototype = {

    /**
    * The amount the sprite is visually offset from its x coordinate.
    * This is the same as `Sprite.width * Sprite.anchor.x`.
    * It will only be > 0 if the Sprite.anchor.x is not equal to zero.
    *
    * @property {number} offsetX - The amount the sprite is visually offset from its x coordinate.
    * @readOnly
    */
    offsetX: {

        get: function () {

            return this.anchor.x * this.width;

        }

    },

    /**
    * The amount the sprite is visually offset from its y coordinate.
    * This is the same as `Sprite.height * Sprite.anchor.y`.
    * It will only be > 0 if the Sprite.anchor.y is not equal to zero.
    *
    * @property {number} offsetY - The amount the sprite is visually offset from its y coordinate.
    * @readOnly
    */
    offsetY: {

        get: function () {

            return this.anchor.y * this.height;

        }

    },

    /**
    * The left coordinate of the Sprite, adjusted for the anchor.
    *
    * @property {number} left - The left coordinate of the Sprite, adjusted for the anchor.
    * @readOnly
    */
    left: {

        get: function () {

            return this.x - this.offsetX;

        }

    },

    /**
    * The right coordinate of the Sprite, adjusted for the anchor. This is the same as Sprite.x + Sprite.width - Sprite.offsetX.
    *
    * @property {number} right - The right coordinate of the Sprite, adjusted for the anchor. This is the same as Sprite.x + Sprite.width - Sprite.offsetX.
    * @readOnly
    */
    right: {

        get: function () {

            return (this.x + this.width) - this.offsetX;

        }

    },

    /**
    * The y coordinate of the Sprite, adjusted for the anchor.
    *
    * @property {number} top - The y coordinate of the Sprite, adjusted for the anchor.
    * @readOnly
    */
    top: {

        get: function () {

            return this.y - this.offsetY;

        }

    },

    /**
    * The sum of the y and height properties, adjusted for the anchor.
    *
    * @property {number} bottom - The sum of the y and height properties, adjusted for the anchor.
    * @readOnly
    */
    bottom: {

        get: function () {

            return (this.y + this.height) - this.offsetY;

        }

    }

};
