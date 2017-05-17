var Clamp = require('../math/Clamp');

//  Alpha Component

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

var Alpha = {

    _alpha: 1,

    alpha: {

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            this._alpha = Clamp(value, 0, 1);

            if (this._alpha === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    setAlpha: function (value)
    {
        this.alpha = value;

        return this;
    }

};

module.exports = Alpha;
