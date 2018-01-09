var renderWebGL = require('../../utils/NOOP');
var renderCanvas = require('../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./MeshWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./MeshCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
