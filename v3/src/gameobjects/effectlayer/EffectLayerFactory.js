var EffectLayer = require('./EffectLayer');

var EffectLayerFactory = function (state, x, y, width, height, effectName, fragmentShader)
{
    return new EffectLayer(state, x, y, width, height, effectName, fragmentShader);
};

module.exports = EffectLayerFactory;
