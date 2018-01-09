var renderWebGL = require('../../utils/NOOP');
var renderCanvas = require('../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./SpriteWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./SpriteCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
