
var GetColor = function (value)
{
    return (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
};

var Tint = {

    //  0: topLeft, 1: topRight, 2: bottomLeft, 3: bottomRight
    _tint: [ 16777215, 16777215, 16777215, 16777215 ],

    clearTint: function ()
    {
        this.setTint(0xffffff);
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
    },

    tintTopLeft: {

        get: function ()
        {
            return this._tint[0];
        },

        set: function (value)
        {
            this._tint[0] = GetColor(value);
        }

    },

    tintTopRight: {

        get: function ()
        {
            return this._tint[1];
        },

        set: function (value)
        {
            this._tint[1] = GetColor(value);
        }

    },

    tintBottomLeft: {

        get: function ()
        {
            return this._tint[2];
        },

        set: function (value)
        {
            this._tint[2] = GetColor(value);
        }

    },

    tintBottomRight: {

        get: function ()
        {
            return this._tint[3];
        },

        set: function (value)
        {
            this._tint[3] = GetColor(value);
        }

    },

    tint: {

        get: function ()
        {
            return this._tint;
        },

        set: function (value)
        {
            this.setTint(value, value, value, value);
        }
    }

};

module.exports = Tint;
