var Blitter = require('./Blitter');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var BlitterCreator = function (state, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var blitter = new Blitter(state, 0, 0, key, frame);

    BuildGameObject(state, blitter, config);

    return blitter;
};

module.exports = BlitterCreator;
