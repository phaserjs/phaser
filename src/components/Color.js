/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Color Component allows you to control the alpha, blend mode, tint and background color
* of a Game Object.
*
* @class
*/
Phaser.Component.Color = function (gameObject)
{
    this.gameObject = gameObject;

    this.game = gameObject.game;

    this._dirty = false;

    this._alpha = 1;
    this._worldAlpha = 1;

    this._blendMode = 0;

    this._tint = [];
    this._hasTint = false;

    this._r = 0;
    this._g = 0;
    this._b = 0;
    this._a = 1;
    this._rgba = '';
    this._hasBackground = false;
};

Phaser.Component.Color.prototype.constructor = Phaser.Component.Color;

Phaser.Component.Color.prototype = {

    setBackground: function (red, green, blue, alpha)
    {
        if (red === undefined)
        {
            this._hasBackground = false;
        }
        else
        {
            this._hasBackground = true;
            this._r = red;
            this._g = (green) ? green : 0;
            this._b = (blue) ? blue : 0;
            this._a = (alpha) ? alpha : 1;
        }

        this.setDirty();
    },

    getBlendMode: function ()
    {
        return this._blendMode;
    },

    setBlendMode: function (blendMode)
    {
        if (blendMode >= 0 && blendMode <= 16)
        {
            this._blendMode = blendMode;
            this.setDirty();
        }
    },

    //  Called by the Dirty Manager
    update: function ()
    {
        this._dirty = false;

        if (this._hasBackground)
        {
            this._rgba = 'rgba(' + this._r + ',' + this._g + ',' + this._b + ',' + this._a + ')';
        }
    },

    setDirty: function ()
    {
        if (!this._dirty)
        {
            this.game.updates.add(this);
        }

        this._dirty = true;
    },

    destroy: function ()
    {
        this.gameObject = null;
        this.game = null;
        this._tint = [];
    }

};

Object.defineProperties(Phaser.Component.Color.prototype, {

    alpha: {

        enumerable: true,

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            if (value !== this._alpha)
            {
                this._alpha = value;
                this.setDirty();
            }
        }

    },

    backgroundAlpha: {

        enumerable: true,

        get: function ()
        {
            return this._a;
        },

        set: function (value)
        {
            if (value !== this._a)
            {
                this._a = value;
                this._hasBackground = true;
                this.setDirty();
            }
        }

    },

    red: {

        enumerable: true,

        get: function ()
        {
            return this._r;
        },

        set: function (value)
        {
            if (value !== this._r)
            {
                this._r = value | 0;
                this._hasBackground = true;
                this.setDirty();
            }
        }

    },

    green: {

        enumerable: true,

        get: function ()
        {
            return this._g;
        },

        set: function (value)
        {
            if (value !== this._g)
            {
                this._g = value | 0;
                this._hasBackground = true;
                this.setDirty();
            }
        }

    },

    blue: {

        enumerable: true,

        get: function ()
        {
            return this._b;
        },

        set: function (value)
        {
            if (value !== this._b)
            {
                this._b = value | 0;
                this._hasBackground = true;
                this.setDirty();
            }
        }

    }

});
