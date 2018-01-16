var BuildGameObject = require('../BuildGameObject');
var EffectLayer = require('./EffectLayer');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('effectLayer', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var key = GetAdvancedValue(config, 'key', null);
    var fragmentShader = GetAdvancedValue(config, 'fragmentShader', '');

    var layer = new EffectLayer(this.scene, x, y, width, height, effectName, fragmentShader);

    BuildGameObject(this.scene, layer, config);

    return layer;
});
