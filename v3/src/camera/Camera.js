
var BaseTransform = require('../components/BaseTransform');

/**
* A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
* The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
*
* @class Phaser.Camera
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {number} id - Not being used at the moment, will be when Phaser supports multiple camera
* @param {number} x - Position of the camera on the X axis
* @param {number} y - Position of the camera on the Y axis
* @param {number} width - The width of the view rectangle
* @param {number} height - The height of the view rectangle
*/
var Camera = function (state, x, y, viewportWidth, viewportHeight)
{
    console.log('Camera', viewportWidth, viewportHeight);

    this.state = state;

    BaseTransform.call(this, this, x, y);

    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.transform.deleteTreeNode();
};

Camera.prototype = Object.create(BaseTransform.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.render = function ()
{
};

Object.defineProperties(Camera.prototype, {

    right: {

        enumerable: true,

        get: function ()
        {
            return this.transform._posX + this.viewportWidth;
        },

        set: function (value)
        {
            this.transform._posX = value - this.viewportWidth;
            this.transform.dirty = true;
        }

    },

    bottom: {

        enumerable: true,

        get: function ()
        {
            return this.transform._posY + this.viewportHeight;
        },

        set: function (value)
        {
            this.transform._posY = value - this.viewportHeight;
            this.transform.dirty = true;
        }

    }

});

module.exports = Camera;
