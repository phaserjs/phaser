var renderWebGL = require('../../../utils/NOOP');
var renderCanvas = require('../../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./StaticTilemapLayerWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./StaticTilemapLayerCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
