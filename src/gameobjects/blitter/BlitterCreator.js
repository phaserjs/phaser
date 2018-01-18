var Blitter = require('./Blitter');
var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('blitter', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var blitter = new Blitter(this.scene, 0, 0, key, frame);

    BuildGameObject(this.scene, blitter, config);

    return blitter;
});
