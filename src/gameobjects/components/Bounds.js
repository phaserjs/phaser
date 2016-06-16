/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
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
    * The center x coordinate of the Game Object.
    * This is the same as `(x - offsetX) + (width / 2)`.
    *
    * @property {number} centerX
    */
    centerX: {

        get: function () {

            return (this.x - this.offsetX) + (this.width * 0.5);

        },

        set: function (value) {

            this.x = (value + this.offsetX) - (this.width * 0.5);

        }

    },

    /**
    * The center y coordinate of the Game Object.
    * This is the same as `(y - offsetY) + (height / 2)`.
    *
    * @property {number} centerY
    */
    centerY: {

        get: function () {

            return (this.y - this.offsetY) + (this.height * 0.5);

        },

        set: function (value) {

            this.y = (value + this.offsetY) - (this.height * 0.5);

        }

    },

    /**
    * The left coordinate of the Game Object.
    * This is the same as `x - offsetX`.
    *
    * @property {number} left
    */
    left: {

        get: function () {

            return this.x - this.offsetX;

        },

        set: function (value) {

            this.x = value + this.offsetX;

        }

    },

    /**
    * The right coordinate of the Game Object.
    * This is the same as `x + width - offsetX`.
    *
    * @property {number} right
    */
    right: {

        get: function () {

            return (this.x + this.width) - this.offsetX;

        },

        set: function (value) {

            this.x = value - (this.width) + this.offsetX;

        }

    },

    /**
    * The y coordinate of the Game Object.
    * This is the same as `y - offsetY`.
    *
    * @property {number} top
    */
    top: {

        get: function () {

            return this.y - this.offsetY;

        },

        set: function (value) {

            this.y = value + this.offsetY;

        }

    },

    /**
    * The sum of the y and height properties.
    * This is the same as `y + height - offsetY`.
    *
    * @property {number} bottom
    */
    bottom: {

        get: function () {

            return (this.y + this.height) - this.offsetY;

        },

        set: function (value) {

            this.y = value - (this.height) + this.offsetY;

        }

    },

    /**
    * Aligns this Game Object to another Game Object, or Rectangle (known as the
    * 'container'), into one of 9 possible positions.
    *
    * The container must be a Game Object, or Phaser.Rectangle object. This can include properties
    * such as `World.bounds` or `Camera.view`, for aligning Game Objects within the world 
    * and camera bounds. Or it can include other Sprites, Images, Text objects, BitmapText,
    * TileSprites or Buttons.
    *
    * Please note that aligning a Sprite to another Game Object does **not** make it a child of
    * the container. It simply modifies its position coordinates so it aligns with it.
    * 
    * The position constants you can use are:
    * 
    * `Phaser.TOP_LEFT`, `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.MIDDLE_LEFT`, 
    * `Phaser.MIDDLE_CENTER`, `Phaser.MIDDLE_RIGHT`, `Phaser.BOTTOM_LEFT`, 
    * `Phaser.BOTTOM_CENTER` and `Phaser.BOTTOM_RIGHT`.
    *
    * The Game Objects are placed in such a way that their _bounds_ align with the
    * container, taking into consideration rotation, scale and the anchor property.
    * This allows you to neatly align Game Objects, irrespective of their position value.
    *
    * @method
    * @param {Phaser.Rectangle|Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Button|Phaser.Graphics|Phaser.TileSprite} container - The Game Object or Rectangle with which to align this Game Object to. Can also include properties such as `World.bounds` or `Camera.view`.
    * @param {integer} [position] - The position constant. One of `Phaser.TOP_LEFT` (default), `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.MIDDLE_LEFT`, `Phaser.MIDDLE_CENTER`, `Phaser.MIDDLE_RIGHT`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` or `Phaser.BOTTOM_RIGHT`.
    */
    alignTo: function (container, position) {

        switch (position)
        {
            default:
            case Phaser.TOP_LEFT:
                this.left = container.left;
                this.top = container.top;
                break;

            case Phaser.TOP_CENTER:
                this.centerX = container.centerX;
                this.top = container.top;
                break;

            case Phaser.TOP_RIGHT:
                this.right = container.right;
                this.top = container.top;
                break;

            case Phaser.MIDDLE_LEFT:
                this.left = container.left;
                this.centerY = container.centerY;
                break;

            case Phaser.MIDDLE_CENTER:
                this.centerX = container.centerX;
                this.centerY = container.centerY;
                break;

            case Phaser.MIDDLE_RIGHT:
                this.right = container.right;
                this.centerY = container.centerY;
                break;

            case Phaser.BOTTOM_LEFT:
                this.left = container.left;
                this.bottom = container.bottom;
                break;

            case Phaser.BOTTOM_CENTER:
                this.centerX = container.centerX;
                this.bottom = container.bottom;
                break;

            case Phaser.BOTTOM_RIGHT:
                this.right = container.right;
                this.bottom = container.bottom;
                break;
        }

    }

};
