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
var Color = function (gameObject)
{
    this.gameObject = gameObject;

    this.state = gameObject.state;

    this._dirty = false;

    this._alpha = 1;
    this._worldAlpha = 1;

    this._blendMode = 0;

    this._tint = { topLeft: 0xffffff, topRight: 0xffffff, bottomLeft: 0xffffff, bottomRight: 0xffffff };
    this._glTint = { topLeft: 16777215, topRight: 16777215, bottomLeft: 16777215, bottomRight: 16777215 };
    this._hasTint = false;

    //  Between 0 and 255
    this._r = 0;
    this._g = 0;
    this._b = 0;

    //  Between 0 and 1
    this._a = 1;

    //  String version of RGBA
    this._rgba = '';

    //  32-bit version of ARGB
    this._glBg = 0;

    this._hasBackground = false;
};

Color.prototype.constructor = Color;

Color.prototype = {

    setBackground: function (red, green, blue, alpha)
    {
        if (red === undefined)
        {
            this._hasBackground = false;
            this._glBg = 0;
        }
        else
        {
            this._hasBackground = true;
            this._r = red;
            this._g = (green) ? green : 0;
            this._b = (blue) ? blue : 0;
            this._a = (alpha) ? alpha : 1;
        }

        this.dirty = true;
    },

    clearTint: function ()
    {
        this.setTint(0xffffff);

        this._hasTint = false;
    },

    setTint: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this.tintTopLeft = topLeft;
        this.tintTopRight = topRight;
        this.tintBottomLeft = bottomLeft;
        this.tintBottomRight = bottomRight;

        this._hasTint = true;

        this.dirty = true;
    },

    //  Called by the Dirty Manager
    update: function ()
    {
        this._dirty = false;

        if (this._hasBackground)
        {
            this._rgba = 'rgba(' + this._r + ',' + this._g + ',' + this._b + ',' + this._a + ')';
            this._glBg = this.getColor32(this._r, this._g, this._b, this._a);
        }

        //  Tint mults?

    },

    getColor: function (value)
    {
        return (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
    },

    getColor32: function (r, g, b, a)
    {
        a *= 255;

        return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
    },

    destroy: function ()
    {
        this.gameObject = null;
        this.state = null;
        this._tint = [];
    }

};

Object.defineProperties(Color.prototype, {

    dirty: {

        enumerable: true,

        get: function ()
        {
            return this._dirty;
        },

        set: function (value)
        {
            if (value)
            {
                if (!this._dirty)
                {
                    this._dirty = true;

                    this.state.sys.updates.add(this);
                }
            }
            else
            {
                this._dirty = false;
            }
        }

    },

    tintTopLeft: {

        enumerable: true,

        get: function ()
        {
            return this._tint.topLeft;
        },

        set: function (value)
        {
            this._tint.topLeft = value;
            this._glTint.topLeft = this.getColor(value);
            this.dirty = true;
        }

    },

    tintTopRight: {

        enumerable: true,

        get: function ()
        {
            return this._tint.topRight;
        },

        set: function (value)
        {
            this._tint.topRight = value;
            this._glTint.topRight = this.getColor(value);
            this.dirty = true;
        }

    },

    tintBottomLeft: {

        enumerable: true,

        get: function ()
        {
            return this._tint.bottomLeft;
        },

        set: function (value)
        {
            this._tint.bottomLeft = value;
            this._glTint.bottomLeft = this.getColor(value);
            this.dirty = true;
        }

    },

    tintBottomRight: {

        enumerable: true,

        get: function ()
        {
            return this._tint.bottomRight;
        },

        set: function (value)
        {
            this._tint.bottomRight = value;
            this._glTint.bottomRight = this.getColor(value);
            this.dirty = true;
        }

    },

    tint: {

        enumerable: true,

        get: function ()
        {
            return this._tint;
        },

        set: function (value)
        {
            this.setTint(value, value, value, value);
        }

    },

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
                this.dirty = true;
            }
        }

    },

    blendMode: {

        enumerable: true,

        get: function ()
        {
            return this._blendMode;
        },

        set: function (value)
        {
            if (value !== this._blendMode && value >= 0 && value <= 16)
            {
                this._blendMode = value;
                this.dirty = true;
            }
        }

    },

    worldAlpha: {

        enumerable: true,

        get: function ()
        {
            if (this.gameObject.parent)
            {
                this._worldAlpha = this._alpha * this.gameObject.parent.color.worldAlpha;
            }

            return this._worldAlpha;
        },

        set: function (value)
        {
            this._worldAlpha = this._alpha * value;
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
                this.dirty = true;
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
                this.dirty = true;
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
                this.dirty = true;
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
                this.dirty = true;
            }
        }

    }

});

module.exports = Color;
