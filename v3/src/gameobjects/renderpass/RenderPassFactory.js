var RenderPass = require('./RenderPass');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var RenderPassFactory = {

    KEY: 'renderPass',

    add: function (x, y, width, height, shaderName, fragmentShader)
    {
        return this.children.add(new RenderPass(this.state, x, y, width, height, shaderName, fragmentShader));
    },

    make: function (x, y, width, height, shaderName, fragmentShader)
    {
        return new RenderPass(this.state, x, y, width, height, shaderName, fragmentShader);
    }

};

module.exports = FactoryContainer.register(RenderPassFactory);
