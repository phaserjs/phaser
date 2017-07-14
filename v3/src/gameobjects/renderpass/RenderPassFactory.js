var RenderPass = require('./RenderPass');

var RenderPassFactory = function (scene, x, y, width, height, shaderName, fragmentShader)
{
    return new RenderPass(scene, x, y, width, height, shaderName, fragmentShader);
};

module.exports = RenderPassFactory;
