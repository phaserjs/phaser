/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Particles.EmitterManager#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Particles} emitterManager - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
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

        var roundPixels = renderer.config.roundPixels;

        for (var index = 0; index < length; ++index)
        {
            var particle = particles[index];

            var alpha = ((particle.color >> 24) & 0xFF) / 255.0;

            if (alpha <= 0)
            {
                continue;
            }

            var frame = particle.frame;
            var width = frame.width;
            var height = frame.height;
            var ox = width * 0.5;
            var oy = height * 0.5;
            var cd = frame.canvasData;

            var x = -ox;
            var y = -oy;

            var tx = particle.x - cameraScrollX * particle.scrollFactorX;
            var ty = particle.y - cameraScrollY * particle.scrollFactorY;

            if (roundPixels)
            {
                tx |= 0;
                ty |= 0;
            }

            ctx.globalAlpha = alpha;
        
            ctx.save();

            ctx.translate(tx, ty);

            ctx.rotate(particle.rotation);

            ctx.scale(particle.scaleX, particle.scaleY);

            ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, x, y, cd.dWidth, cd.dHeight);

            ctx.restore();
        }

        ctx.globalAlpha = lastAlpha;
    }
};

module.exports = ParticleManagerCanvasRenderer;
