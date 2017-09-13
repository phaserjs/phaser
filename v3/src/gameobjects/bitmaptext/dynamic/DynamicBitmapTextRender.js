var renderWebGL = require('../../../utils/NOOP');
var renderCanvas = require('../../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./DynamicBitmapTextWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./DynamicBitmapTextCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
