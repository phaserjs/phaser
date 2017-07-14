var Blitter = require('./Blitter');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var BlitterCreator = function (scene, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var blitter = new Blitter(scene, 0, 0, key, frame);

    BuildGameObject(scene, blitter, config);

    return blitter;
};

module.exports = BlitterCreator;
