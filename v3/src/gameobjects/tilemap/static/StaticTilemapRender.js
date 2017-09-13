var renderWebGL = require('../../../utils/NOOP');
var renderCanvas = require('../../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./StaticTilemapWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./StaticTilemapCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
