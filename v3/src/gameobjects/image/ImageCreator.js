var Image = require('./Image');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var ImageCreator = function (scene, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var image = new Image(scene, 0, 0, key, frame);

    BuildGameObject(scene, image, config);

    return image;
};

module.exports = ImageCreator;
