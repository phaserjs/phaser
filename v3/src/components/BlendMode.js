var BlendModes = require('../renderer/BlendModes');

//  BlendMode Component

var BlendMode = {

    _blendMode: BlendModes.NORMAL,

    blendMode: {

        get: function ()
        {
            return this._blendMode;
        },

        set: function (value)
        {
            value | 0;

            if (value >= 0 && value <= 16)
            {
                this._blendMode = value;
            }
        }

    }

};

module.exports = BlendMode;
