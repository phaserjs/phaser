var CanvasPool = require('../../../dom/CanvasPool');
var CONST = require('../../../const');
var GetContext = require('../../../canvas/GetContext');
var CanvasInterpolation = require('../../../dom/CanvasInterpolation');

var CreateSceneDisplay = function (scene)
{
    var settings = scene.sys.settings;

    var width = settings.width;
    var height = settings.height;

    var config = this.game.config;

    if (config.renderType === CONST.CANVAS)
    {
        if (settings.renderToTexture)
        {
            scene.sys.canvas = CanvasPool.create(scene, width, height);
            scene.sys.context = GetContext(scene.sys.canvas);
        }
        else
        {
            scene.sys.canvas = this.game.canvas;
            scene.sys.context = this.game.context;
        }

        //  Pixel Art mode?
        if (config.pixelArt)
        {
            CanvasInterpolation.setCrisp(scene.sys.canvas);
        }
    }
};

module.exports = CreateSceneDisplay;
