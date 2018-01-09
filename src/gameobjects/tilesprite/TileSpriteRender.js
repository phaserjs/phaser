var renderWebGL = require('../../utils/NOOP');
var renderCanvas = require('../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./TileSpriteWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./TileSpriteCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
