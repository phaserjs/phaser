var BlendModes = require('../../renderer/BlendModes');

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
            if (typeof value === 'string')
            {
                value = BlendModes[value];
            }

            value | 0;

            if (value >= 0)
            {
                this._blendMode = value;
            }
        }

    },

    //  const or string
    setBlendMode: function (value)
    {
        this.blendMode = value;

        return this;
    }

};

module.exports = BlendMode;
