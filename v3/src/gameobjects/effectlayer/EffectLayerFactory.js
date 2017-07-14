var EffectLayer = require('./EffectLayer');

var EffectLayerFactory = function (scene, x, y, width, height, effectName, fragmentShader)
{
    return new EffectLayer(scene, x, y, width, height, effectName, fragmentShader);
};

module.exports = EffectLayerFactory;
