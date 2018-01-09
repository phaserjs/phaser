var renderWebGL = require('../../utils/NOOP');
var renderCanvas = require('../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./BlitterWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./BlitterCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
