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

Phaser.Component.BaseTransform.prototype = {

    //  Move these into the Transform class?
    //  As you can access them all via the getters and setters

    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.transform._posX = x;
        this.transform._posY = y;

        return this.transform.update();
    },

    setScale: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.transform._scaleX = x;
        this.transform._scaleY = y;

        this.transform.updateCache();

        return this.transform.update();
    },

    setPivot: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.transform._pivotX = x;
        this.transform._pivotY = y;

        return this.transform.update();
    },

    setRotation: function (rotation)
    {
        this.transform.rotation = rotation;

        return this.transform.update();
    }

};

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

    },

    //  GLOBAL read-only properties from here on
    //  Need *all* parents taken into account to get the correct values

    worldRotation: {

        enumerable: true,

        get: function ()
        {
            this.transform.updateAncestors();

            return this.transform._worldRotation;
        }

    },

    worldScaleX: {

        enumerable: true,

        get: function ()
        {
            this.transform.updateAncestors();

            return this.transform._worldScaleX;
        }

    },

    worldScaleY: {

        enumerable: true,

        get: function ()
        {
            this.transform.updateAncestors();

            return this.transform._worldScaleY;
        }

    },

    worldX: {

        enumerable: true,

        get: function ()
        {
            this.transform.updateAncestors();

            return this.transform.world.tx;
        }

    },

    worldY: {

        enumerable: true,

        get: function ()
        {
            this.transform.updateAncestors();

            return this.transform.world.ty;
        }

    }

});
