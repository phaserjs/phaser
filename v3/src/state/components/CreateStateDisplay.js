var CanvasPool = require('../../dom/CanvasPool');
var CONST = require('../../const');
var GetContext = require('../../canvas/GetContext');
var CanvasInterpolation = require('../../dom/CanvasInterpolation');

var CreateStateDisplay = function (state)
{
    // console.log('createStateDisplay', state.sys.settings.key);

    var settings = state.sys.settings;

    var width = settings.width;
    var height = settings.height;

    var config = this.game.config;

    if (config.renderType === CONST.CANVAS)
    {
        if (settings.renderToTexture)
        {
            // console.log('renderToTexture', width, height);
            state.sys.canvas = CanvasPool.create(state, width, height);
            state.sys.context = GetContext(state.sys.canvas);
        }
        else
        {
            // console.log('using game canvas');
            // state.sys.mask = new Rectangle(0, 0, width, height);
            state.sys.canvas = this.game.canvas;
            state.sys.context = this.game.context;
        }

        //  Pixel Art mode?
        if (config.pixelArt)
        {
            CanvasInterpolation.setCrisp(state.sys.canvas);
        }
    }
};

module.exports = CreateStateDisplay;
