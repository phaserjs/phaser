var GetValue = require('../../../utils/object/GetValue');
var NOOP = require('../../../utils/NOOP');

var SetupCallbacks = function (scene, sceneConfig)
{
    if (sceneConfig === undefined) { sceneConfig = scene; }

    //  Extract callbacks or set NOOP

    scene.init = GetValue(sceneConfig, 'init', NOOP);
    scene.preload = GetValue(sceneConfig, 'preload', NOOP);
    scene.create = GetValue(sceneConfig, 'create', NOOP);
    scene.shutdown = GetValue(sceneConfig, 'shutdown', NOOP);

    //  Game Loop level callbacks

    scene.update = GetValue(sceneConfig, 'update', NOOP);
    scene.render = GetValue(sceneConfig, 'render', NOOP);

    return scene;
};

module.exports = SetupCallbacks;
