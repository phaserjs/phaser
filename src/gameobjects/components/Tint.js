
var GetColor = function (value)
{
    return (value >> 16) + (value & 0xff00) + ((value & 0xff) << 16);
};

var Tint = {

    //  0: topLeft, 1: topRight, 2: bottomLeft, 3: bottomRight
    _tintTL: 16777215,
    _tintTR: 16777215,
    _tintBL: 16777215,
    _tintBR: 16777215,

    clearTint: function ()
    {
        this.setTint(0xffffff);

        return this;
    },

    setTint: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 0xffffff; }

        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this._tintTL = GetColor(topLeft);
        this._tintTR = GetColor(topRight);
        this._tintBL = GetColor(bottomLeft);
        this._tintBR = GetColor(bottomRight);

        return this;
    },

    tintTopLeft: {

        get: function ()
        {
            return this._tintTL;
        },

        set: function (value)
        {
            this._tintTL = GetColor(value);
        }

    },

    tintTopRight: {

        get: function ()
        {
            return this._tintTR;
        },

        set: function (value)
        {
            this._tintTR = GetColor(value);
        }

    },

    tintBottomLeft: {

        get: function ()
        {
            return this._tintBL;
        },

        set: function (value)
        {
            this._tintBL = GetColor(value);
        }

    },

    tintBottomRight: {

        get: function ()
        {
            return this._tintBR;
        },

        set: function (value)
        {
            this._tintBR = GetColor(value);
        }

    },

    tint: {

        set: function (value)
        {
            this.setTint(value, value, value, value);
        }
    }

};

module.exports = Tint;
