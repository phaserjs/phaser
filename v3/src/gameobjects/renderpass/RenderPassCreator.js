var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../../scene/plugins/GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var RenderPass = require('./RenderPass');

//  When registering a factory function 'this' refers to the GameObjectCreator context.

GameObjectCreator.register('renderPass', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var shaderName = GetAdvancedValue(config, 'shaderName', '');
    var fragmentShader = GetAdvancedValue(config, 'fragmentShader', '');
    var untextured = GetAdvancedValue(config, 'untextured', false);

    var pass = new RenderPass(this.scene, x, y, width, height, shaderName, fragmentShader, untextured);

    BuildGameObject(this.scene, pass, config);

    pass.setFlipY(true);
    pass.setPosition(x, y);
    pass.setSize(width, height);
    pass.setOrigin(0, 0);
    
    return pass;
});
