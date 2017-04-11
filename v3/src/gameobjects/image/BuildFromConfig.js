var Image = require('./Image');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var BuildFromConfig = function (state, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var image = new Image(state, 0, 0, key, frame);

    BuildGameObject(state, image, config);

    return image;
};

module.exports = BuildFromConfig;
