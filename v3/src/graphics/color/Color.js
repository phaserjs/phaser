var GetColor = require('./GetColor');
var GetColor32 = require('./GetColor32');

var Color = function (red, green, blue, alpha)
{
    if (red === undefined) { red = 0; }
    if (green === undefined) { green = 0; }
    if (blue === undefined) { blue = 0; }
    if (alpha === undefined) { alpha = 255; }

    //  All private
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;

    this.gl = [ 0.0, 0.0, 0.0, 1.0 ];

    this._color = 0;
    this._color32 = 0;
    this._rgba = '';

    this.dirty = true;

    this.setTo(red, green, blue, alpha);
};

Color.prototype.constructor = Color;

Color.prototype = {

    transparent: function ()
    {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;

        this.dirty = true;

        return this.update();
    },

    //  Values are in the range 0 to 255
    setTo: function (red, green, blue, alpha)
    {
        if (alpha === undefined) { alpha = 255; }

        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;

        this.dirty = true;

        return this.update();
    },

    //  Values are in the range 0 to 1
    setGLTo: function (red, green, blue, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this.redGL = red;
        this.greenGL = green;
        this.blueGL = blue;
        this.alphaGL = alpha;

        this.dirty = true;

        return this.update();
    },

    setFromRGB: function (color)
    {
        this.red = color.r;
        this.green = color.g;
        this.blue = color.b;

        if (color.hasOwnProperty('a'))
        {
            this.alpha = color.a;
        }

        this.dirty = true;

        return this.update();
    },

    update: function ()
    {
        if (!this.dirty)
        {
            return this;
        }

        this._color = GetColor(this.r, this.g, this.b);
        this._color32 = GetColor32(this.r, this.g, this.b, this.a);
        this._rgba = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (255 / this.a) + ')';

        this.dirty = false;

        return this;
    },

    //  Same as setRGB but performs safety checks on all the values given
    clone: function ()
    {
        return new Color(this.r, this.g, this.b, this.a);
    }

};

Object.defineProperties(Color.prototype, {

    color: {

        enumerable: true,

        get: function ()
        {
            if (this.dirty)
            {
                this.update();
            }

            return this._color;
        }

    },

    color32: {

        enumerable: true,

        get: function ()
        {
            if (this.dirty)
            {
                this.update();
            }

            return this._color32;
        }

    },

    rgba: {

        enumerable: true,

        get: function ()
        {
            if (this.dirty)
            {
                this.update();
            }

            return this._rgba;
        }

    },

    //  Gets and sets the red value, normalized to the 0 to 1 range
    redGL: {

        enumerable: true,

        get: function ()
        {
            return this.gl[0];
        },

        set: function (value)
        {
            this.gl[0] = Math.min(Math.abs(value), 1);

            this.r = Math.floor(this.gl[0] * 255);

            this.dirty = true;
        }

    },

    greenGL: {

        enumerable: true,

        get: function ()
        {
            return this.gl[1];
        },

        set: function (value)
        {
            this.gl[1] = Math.min(Math.abs(value), 1);

            this.g = Math.floor(this.gl[1] * 255);

            this.dirty = true;
        }

    },

    blueGL: {

        enumerable: true,

        get: function ()
        {
            return this.gl[2];
        },

        set: function (value)
        {
            this.gl[2] = Math.min(Math.abs(value), 1);

            this.b = Math.floor(this.gl[2] * 255);

            this.dirty = true;
        }

    },

    alphaGL: {

        enumerable: true,

        get: function ()
        {
            return this.gl[3];
        },

        set: function (value)
        {
            this.gl[3] = Math.min(Math.abs(value), 1);

            this.a = Math.floor(this.gl[3] * 255);

            this.dirty = true;
        }

    },

    //  Gets and sets the red value, normalized to the 0 to 255 range
    red: {

        enumerable: true,

        get: function ()
        {
            return this.r;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.r = Math.min(value, 255);

            this.gl[0] = value / 255;

            this.dirty = true;
        }

    },

    green: {

        enumerable: true,

        get: function ()
        {
            return this.g;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.g = Math.min(value, 255);

            this.gl[1] = value / 255;

            this.dirty = true;
        }

    },

    blue: {

        enumerable: true,

        get: function ()
        {
            return this.b;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.b = Math.min(value, 255);

            this.gl[2] = value / 255;

            this.dirty = true;
        }

    },

    alpha: {

        enumerable: true,

        get: function ()
        {
            return this.a;
        },

        set: function (value)
        {
            value = Math.floor(Math.abs(value));

            this.a = Math.min(value, 255);

            this.gl[3] = value / 255;

            this.dirty = true;
        }

    },

});


module.exports = Color;
