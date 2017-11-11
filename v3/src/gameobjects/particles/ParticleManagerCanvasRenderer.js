var GameObject = require('../GameObject');

var ParticleManagerCanvasRenderer = function (renderer, emitterManager, interpolationPercentage, camera)
{
    var emitters = emitterManager.emitters.list;

    if (emitters.length === 0 || GameObject.RENDER_MASK !== emitterManager.renderFlags || (emitterManager.cameraFilter > 0 && (emitterManager.cameraFilter & camera._id)))
    {
        return;
    }

    for (var i = 0; i < emitters.length; i++)
    {
        var emitter = emitters[i];

        var particles = emitter.alive;
        var length = particles.length;

        if (!emitter.visible || length === 0)
        {
            continue;
        }

        var ctx = renderer.currentContext;

        var lastAlpha = ctx.globalAlpha;
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

            var alpha = ((particle.color >> 24) & 0xFF) / 255.0;

            if (alpha <= 0)
            {
                continue;
            }

            var frame = particle.frame;
            var dx = frame.x;
            var dy = frame.y;
            var width = frame.width;
            var height = frame.height;
            var ox = width * 0.5;
            var oy = height * 0.5;
            var cd = frame.canvasData;

            var x = -ox;
            var y = -oy;

            ctx.globalAlpha = alpha;
        
            ctx.save();
            ctx.translate(particle.x - cameraScrollX * particle.scrollFactorX, particle.y - cameraScrollY * particle.scrollFactorY);
            ctx.rotate(particle.rotation);
            ctx.scale(particle.scaleX, particle.scaleY);
            ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, x, y, cd.dWidth, cd.dHeight);
            ctx.restore();
        }

        ctx.globalAlpha = lastAlpha;
    }
};

module.exports = ParticleManagerCanvasRenderer;
