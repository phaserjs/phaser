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
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} emitterManager - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ParticleManagerCanvasRenderer = function (renderer, emitterManager, interpolationPercentage, camera, parentMatrix)
{
    var emitters = emitterManager.emitters.list;

    if (emitters.length === 0 || GameObject.RENDER_MASK !== emitterManager.renderFlags || (emitterManager.cameraFilter > 0 && (emitterManager.cameraFilter & camera._id)))
    {
        return;
    }

    var ctx = renderer.currentContext;

    ctx.save();

    if (parentMatrix !== undefined)
    {
        var matrix = parentMatrix.matrix;

        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
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

            var particleAlpha = camera.alpha * ((particle.color >> 24) & 0xFF) / 255;

            if (particleAlpha <= 0)
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

            var tx = particle.x - cameraScrollX;
            var ty = particle.y - cameraScrollY;

            if (camera.roundPixels)
            {
                tx |= 0;
                ty |= 0;
            }

            ctx.globalAlpha = particleAlpha;
        
            ctx.save();

            ctx.translate(tx, ty);

            ctx.rotate(particle.rotation);

            ctx.scale(particle.scaleX, particle.scaleY);

            ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, x, y, cd.dWidth, cd.dHeight);

            ctx.restore();
        }

        ctx.globalAlpha = lastAlpha;
    }

    ctx.restore();
};

module.exports = ParticleManagerCanvasRenderer;
