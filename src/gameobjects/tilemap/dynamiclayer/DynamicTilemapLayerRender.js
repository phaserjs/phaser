var renderWebGL = require('../../../utils/NOOP');
var renderCanvas = require('../../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./DynamicTilemapLayerWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./DynamicTilemapLayerCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
