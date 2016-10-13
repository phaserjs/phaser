/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A BaseTransform class that you can use when extending Game Objects.
* Hides away the 'private' stuff and exposes only the useful getters and setters
*
* @class
*/
Phaser.Component.BaseTransform = function (x, y)
{
    this.transform = new Phaser.Component.Transform(this, x, y);
};

Phaser.Component.BaseTransform.prototype.constructor = Phaser.Component.BaseTransform;

Object.defineProperties(Phaser.Component.BaseTransform.prototype, {

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

    anchor: {

        enumerable: true,

        get: function ()
        {
            return this.transform._anchorX;
        },

        set: function (value)
        {
            this.transform._anchorX = value;
            this.transform._anchorY = value;
        }

    },

    anchorX: {

        enumerable: true,

        get: function ()
        {
            return this.transform._anchorX;
        },

        set: function (value)
        {
            this.transform._anchorX = value;
        }

    },

    anchorY: {

        enumerable: true,

        get: function ()
        {
            return this.transform._anchorY;
        },

        set: function (value)
        {
            this.transform._anchorY = value;
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
            return Phaser.Math.wrapAngle(this.rotation * Phaser.Math.RAD_TO_DEG);
        },

        set: function (value)
        {
            this.rotation = Phaser.Math.wrapAngle(value) * Phaser.Math.DEG_TO_RAD;
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

            if (this.transform._rotation % Phaser.Math.PI2)
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

    }

});
