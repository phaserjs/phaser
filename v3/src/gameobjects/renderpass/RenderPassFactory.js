var RenderPass = require('./RenderPass');

var RenderPassFactory = function (state, x, y, width, height, shaderName, fragmentShader)
{
    return new RenderPass(state, x, y, width, height, shaderName, fragmentShader);
};

module.exports = RenderPassFactory;
