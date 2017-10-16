var GameObject = require('../GameObject');

var ParticleEmitterCanvasRenderer = function (renderer, emitter, interpolationPercentage, camera)
{
    if (emitter.isEmpty() || GameObject.RENDER_MASK !== emitter.renderFlags || (emitter.cameraFilter > 0 && (emitter.cameraFilter & camera._id)))
    {
        return;
    }

    var particles = emitter.alive;
    var length = particles.length;
    var ctx = renderer.currentContext;
    var frame = emitter.frame;
    var dx = frame.x;
    var dy = frame.y;
    var width = frame.width;
    var height = frame.height;
    var ox = width * 0.5;
    var oy = height * 0.5;
    var lastAlpha = ctx.globalAlpha;
    var cd = frame.canvasData;
    var cameraScrollX = camera.scrollX * emitter.scrollFactorX;
    var cameraScrollY = camera.scrollY * emitter.scrollFactorY;

    if (renderer.currentBlendMode !== emitter.blendMode)
    {
        renderer.currentBlendMode = emitter.blendMode;
        ctx.globalCompositeOperation = renderer.blendModes[emitter.blendMode];
    }

    for (var index = 0; index < length; ++index)
    {
        var particle = particles[index];
        var x = -ox;
        var y = -oy;
        var scaleX = particle.scaleX;
        var scaleY = particle.scaleY;
        var rotation = particle.rotation;
        var color = particle.color;
        var alpha = ((color >> 24) & 0xFF) / 255.0;

        ctx.globalAlpha = alpha;
    
        ctx.save();
        ctx.translate(particle.x - cameraScrollX, particle.y - cameraScrollY);
        ctx.rotate(rotation);
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, x, y, cd.dWidth, cd.dHeight);
        ctx.restore();
    }

    ctx.globalAlpha = lastAlpha;
};

module.exports = ParticleEmitterCanvasRenderer;
