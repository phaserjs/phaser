var BuildGameObject = require('../BuildGameObject');
var BuildGameObjectAnimation = require('../BuildGameObjectAnimation');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var RenderTexture = require('./RenderTexture');

GameObjectCreator.register('renderTexture', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 32);
    var height = GetAdvancedValue(config, 'height', 32);
    var renderTexture = new RenderTexture(this.scene, x, y, width, height);

    BuildGameObject(this.scene, renderTexture, config);

    return renderTexture;
});
