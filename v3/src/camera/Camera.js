/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Component = require('../components');
var MATH_CONST = require('../math/const');
var WrapAngle = require('../math/angle/Wrap');

//  Swap to extending a BaseTransform
// var BaseTransform = require('');

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
    /**
     * The State that this Camera belongs to. A Camera can only belong to one State, and a State only
     * has one Camera.
    * @property {Phaser.State} state
    */
    this.state = state;

    this.viewportWidth = viewportWidth;

    this.viewportHeight = viewportHeight;

    this.transform = new Component.Transform(this, x, y);

    /**
    * The Camera is bound to this Rectangle and cannot move outside of it. By default it is enabled and set to the size of the World.
    * The Rectangle can be located anywhere in the world and updated as often as you like. If you don't wish the Camera to be bound
    * at all then set this to null. The values can be anything and are in World coordinates, with 0,0 being the top-left of the world.
    *
    * @property {Phaser.Rectangle} bounds - The Rectangle in which the Camera is bounded. Set to null to allow for movement anywhere.
    */
    // this.bounds = new Phaser.Rectangle(x, y, width, height);

    // this.bounds = new Phaser.Circle(x, y)

    /**
    * @property {boolean} atLimit - Whether this camera is flush with the World Bounds or not.
    */
    this.atLimit = { x: false, y: false };
};

Camera.prototype.constructor = Camera;

Camera.prototype = {

    /**
    * Method called to ensure the camera doesn't venture outside of the game world.
    * Called automatically by Camera.update.
    *
    * @method Phaser.Camera#checkBounds
    * @protected
    */
    checkBounds: function ()
    {
        this.atLimit.x = false;
        this.atLimit.y = false;

        // var vx = this.view.x + this._shake.x;
        // var vw = this.view.right + this._shake.x;
        // var vy = this.view.y + this._shake.y;
        // var vh = this.view.bottom + this._shake.y;

        var vx = this.x;
        var vw = this.x + this.viewportWidth;
        var vy = this.y;
        var vh = this.y + this.viewportHeight;

        //  Make sure we didn't go outside the cameras bounds
        if (vx <= this.bounds.x * this.scaleX)
        {
            this.atLimit.x = true;
            this.view.x = this.bounds.x * this.scaleX;

            if (!this._shake.shakeBounds)
            {
                //  The camera is up against the bounds, so reset the shake
                this._shake.x = 0;
            }
        }

        if (vw >= this.bounds.right * this.scaleX)
        {
            this.atLimit.x = true;
            this.view.x = (this.bounds.right * this.scaleX) - this.width;

            if (!this._shake.shakeBounds)
            {
                //  The camera is up against the bounds, so reset the shake
                this._shake.x = 0;
            }
        }

        if (vy <= this.bounds.top * this.scaleY)
        {
            this.atLimit.y = true;
            this.view.y = this.bounds.top * this.scaleY;

            if (!this._shake.shakeBounds)
            {
                //  The camera is up against the bounds, so reset the shake
                this._shake.y = 0;
            }
        }

        if (vh >= this.bounds.bottom * this.scaleY)
        {
            this.atLimit.y = true;
            this.view.y = (this.bounds.bottom * this.scaleY) - this.height;

            if (!this._shake.shakeBounds)
            {
                //  The camera is up against the bounds, so reset the shake
                this._shake.y = 0;
            }
        }

    }

};

Object.defineProperties(Camera.prototype, {

    //  Transform getters / setters

    x: {

        enumerable: true,

        get: function ()
        {
            return this.transform._posX;
        },

        set: function (value)
        {
            this.transform._posX = value;
            this.transform.dirty = true;
        }

    },

    y: {

        enumerable: true,

        get: function ()
        {
            return this.transform._posY;
        },

        set: function (value)
        {
            this.transform._posY = value;
            this.transform.dirty = true;
        }

    },

    right: {

        enumerable: true,

        get: function ()
        {
            return this.transform._posX + (this.viewportWidth * this.transform._scaleX);
        }

    },

    bottom: {

        enumerable: true,

        get: function ()
        {
            return this.transform._posY + (this.viewportHeight * this.transform._scaleY);
        }

    },

    scale: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleX;
        },

        set: function (value)
        {
            this.transform._scaleX = value;
            this.transform._scaleY = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    scaleX: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleX;
        },

        set: function (value)
        {
            this.transform._scaleX = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    scaleY: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleY;
        },

        set: function (value)
        {
            this.transform._scaleY = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    pivotX: {

        enumerable: true,

        get: function ()
        {
            return this.transform._pivotX;
        },

        set: function (value)
        {
            this.transform._pivotX = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    pivotY: {

        enumerable: true,

        get: function ()
        {
            return this.transform._pivotY;
        },

        set: function (value)
        {
            this.transform._pivotY = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    angle: {

        enumerable: true,

        get: function ()
        {
            return WrapAngle(this.rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            this.rotation = WrapAngle(value) * MATH_CONST.DEG_TO_RAD;
        }

    },

    rotation: {

        enumerable: true,

        get: function ()
        {
            return this.transform._rotation;
        },

        set: function (value)
        {
            if (this.transform._rotation === value)
            {
                return;
            }

            this.transform._rotation = value;
            this.transform.dirty = true;

            if (this.transform._rotation % MATH_CONST.PI2)
            {
                this.transform.cache.sr = Math.sin(this.transform._rotation);
                this.transform.cache.cr = Math.cos(this.transform._rotation);
                this.transform.updateCache();
                this.transform.hasLocalRotation = true;
            }
            else
            {
                this.transform.hasLocalRotation = false;
            }
        }

    },

});

module.exports = Camera;
