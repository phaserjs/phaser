var renderWebGL = require('../../utils/NOOP');
var renderCanvas = require('../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./LightLayerWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./LightLayerCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
