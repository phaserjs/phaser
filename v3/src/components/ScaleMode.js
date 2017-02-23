var ScaleModes = require('../renderer/ScaleModes');

//  ScaleMode Component

var _scaleMode = ScaleModes.DEFAULT;

var ScaleMode = {

    scaleMode: {

        get: function ()
        {
            return _scaleMode;
        },

        set: function (value)
        {
            if (value === ScaleModes.LINEAR || value === ScaleModes.NEAREST)
            {
                _scaleMode = value;
            }
        }

    }

};

module.exports = ScaleMode;
