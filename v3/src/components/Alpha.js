var Clamp = require('../math/Clamp');

//  Alpha Component

var _alpha = 1;

//  bitmask flag for GameObject.renderMask
var _FLAG = 2; // 0010

var Alpha = {

    alpha: {

        get: function ()
        {
            return _alpha;
        },

        set: function (value)
        {
            _alpha = Clamp(value, 0, 1);

            if (_alpha === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    }

};

module.exports = Alpha;
