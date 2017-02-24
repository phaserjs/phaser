var ScaleModes = require('../renderer/ScaleModes');

//  ScaleMode Component

var ScaleMode = {

    _scaleMode: ScaleModes.DEFAULT,

    scaleMode: {

        get: function ()
        {
            return this._scaleMode;
        },

        set: function (value)
        {
            if (value === ScaleModes.LINEAR || value === ScaleModes.NEAREST)
            {
                this._scaleMode = value;
            }
        }

    }

};

module.exports = ScaleMode;
