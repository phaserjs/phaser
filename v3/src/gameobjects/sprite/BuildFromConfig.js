var Sprite = require('./Sprite');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');
var BuildGameObjectAnimation = require('../BuildGameObjectAnimation');

var BuildFromConfig = function (state, config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var sprite = new Sprite(state, 0, 0, key, frame);

    BuildGameObject(state, sprite, config);

    //  Sprite specific config options:

    BuildGameObjectAnimation(sprite, config);

    //  Physics, Input, etc to follow ...

    return sprite;
};

module.exports = BuildFromConfig;
