var BlendModes = require('../renderer/BlendModes');

//  BlendMode Component

var _blendMode = BlendModes.NORMAL;

var BlendMode = {

    blendMode: {

        get: function ()
        {
            return _blendMode;
        },

        set: function (value)
        {
            value | 0;

            if (value >= 0 && value <= 16)
            {
                _blendMode = value;
            }
        }

    }

};

module.exports = BlendMode;
