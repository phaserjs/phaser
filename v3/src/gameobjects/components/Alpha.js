var Clamp = require('../../math/Clamp');

//  Alpha Component

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

var Alpha = {

    _alpha: 1,

    _alphaTL: 1,
    _alphaTR: 1,
    _alphaBL: 1,
    _alphaBR: 1,

    clearAlpha: function ()
    {
        return this.setAlpha(1);
    },

    setAlpha: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 1; }

        //  Treat as if there is only one alpha value for the whole Game Object
        if (topRight === undefined)
        {
            this.alpha = topLeft;
        }
        else
        {
            this._alphaTL = Clamp(topLeft, 0, 1);
            this._alphaTR = Clamp(topRight, 0, 1);
            this._alphaBL = Clamp(bottomLeft, 0, 1);
            this._alphaBR = Clamp(bottomRight, 0, 1);
        }

        return this;
    },

    //  Global Alpha value. If changed this adjusts all alpha properties (topLeft, topRight, etc)
    alpha: {

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alpha = v;
            this._alphaTL = v;
            this._alphaTR = v;
            this._alphaBL = v;
            this._alphaBR = v;

            if (v === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    //  Adjusts the alpha value of the top-left vertex (WebGL only)
    alphaTopLeft: {

        get: function ()
        {
            return this._alphaTL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTL = v

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    alphaTopRight: {

        get: function ()
        {
            return this._alphaTR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaTR = v

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    alphaBottomLeft: {

        get: function ()
        {
            return this._alphaBL;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBL = v

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    alphaBottomRight: {

        get: function ()
        {
            return this._alphaBR;
        },

        set: function (value)
        {
            var v = Clamp(value, 0, 1);

            this._alphaBR = v

            if (v !== 0)
            {
                this.renderFlags |= _FLAG;
            }
        }

    }

};

module.exports = Alpha;
