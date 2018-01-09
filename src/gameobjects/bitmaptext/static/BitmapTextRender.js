var renderWebGL = require('../../../utils/NOOP');
var renderCanvas = require('../../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./BitmapTextWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./BitmapTextCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
