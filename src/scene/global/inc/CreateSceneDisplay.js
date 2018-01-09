var CanvasPool = require('../../../display/canvas/CanvasPool');
var CONST = require('../../../const');
var CanvasInterpolation = require('../../../display/canvas/CanvasInterpolation');

/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#createSceneDisplay
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
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
            scene.sys.context = scene.sys.canvas.getContext('2d');
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
