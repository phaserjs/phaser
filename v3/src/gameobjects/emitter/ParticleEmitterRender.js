var renderWebGL = require('../../utils/NOOP');
var renderCanvas = require('../../utils/NOOP');

if (WEBGL_RENDERER)
{
    renderWebGL = require('./ParticleEmitterWebGLRenderer');
}

if (CANVAS_RENDERER)
{
    renderCanvas = require('./ParticleEmitterCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
