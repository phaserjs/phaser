var EffectLayer = require('./EffectLayer');
var BuildFromConfig = require('./BuildFromConfig');
var FactoryContainer = require('../../gameobjects/FactoryContainer');

var EffectLayerFactory = {

    KEY: 'effectLayer',

    add: function (x, y, width, height, effectName, fragmentShader)
    {
        return this.children.add(new EffectLayer(this.state, x, y, width, height, effectName, fragmentShader));
    },

    make: function (x, y, width, height, effectName, fragmentShader)
    {
        return new EffectLayer(this.state, x, y, width, height, effectName, fragmentShader);
    }

    // make: function (config)
    // {
    //     return BuildFromConfig(this.state, config);
    // }

};

module.exports = FactoryContainer.register(EffectLayerFactory);
