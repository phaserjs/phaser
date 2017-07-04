var RenderPass = require('./RenderPass');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var BuildGameObject = require('../BuildGameObject');

var RenderPassCreator = function (state, config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 512);
    var height = GetAdvancedValue(config, 'height', 512);
    var shaderName = GetAdvancedValue(config, 'shaderName', '');
    var fragmentShader = GetAdvancedValue(config, 'fragmentShader', '');

    var pass = new RenderPass(state, x, y, width, height, shaderName, fragmentShader);

    BuildGameObject(state, pass, config);

    return pass;
};

module.exports = RenderPassCreator;
