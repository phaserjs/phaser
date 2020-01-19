/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
    var emittersLength = emitters.length;

    if (emittersLength === 0)
    {
        return;
    }

    var camMatrix = renderer._tempMatrix1.copyFrom(camera.matrix);
    var calcMatrix = renderer._tempMatrix2;
    var particleMatrix = renderer._tempMatrix3;
    var managerMatrix = renderer._tempMatrix4.applyITRS(emitterManager.x, emitterManager.y, emitterManager.rotation, emitterManager.scaleX, emitterManager.scaleY);

    camMatrix.multiply(managerMatrix);

    var roundPixels = camera.roundPixels;

    var ctx = renderer.currentContext;

    ctx.save();

    for (var e = 0; e < emittersLength; e++)
    {
        var emitter = emitters[e];
        var particles = emitter.alive;
        var particleCount = particles.length;

        if (!emitter.visible || particleCount === 0)
        {
            continue;
        }

        var scrollX = camera.scrollX * emitter.scrollFactorX;
        var scrollY = camera.scrollY * emitter.scrollFactorY;

        if (parentMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentMatrix, -scrollX, -scrollY);

            scrollX = 0;
            scrollY = 0;
        }

        ctx.globalCompositeOperation = renderer.blendModes[emitter.blendMode];

        for (var i = 0; i < particleCount; i++)
        {
            var particle = particles[i];

            var alpha = particle.alpha * camera.alpha;

            if (alpha <= 0)
            {
                continue;
            }

            var frame = particle.frame;
            var cd = frame.canvasData;

            var x = -(frame.halfWidth);
            var y = -(frame.halfHeight);

            particleMatrix.applyITRS(0, 0, particle.rotation, particle.scaleX, particle.scaleY);

            particleMatrix.e = particle.x - scrollX;
            particleMatrix.f = particle.y - scrollY;

            camMatrix.multiply(particleMatrix, calcMatrix);

            ctx.globalAlpha = alpha;
        
            ctx.save();

            calcMatrix.copyToContext(ctx);

            if (roundPixels)
            {
                x = Math.round(x);
                y = Math.round(y);
            }

            ctx.imageSmoothingEnabled = !(!renderer.antialias || frame.source.scaleMode);

            ctx.drawImage(frame.source.image, cd.x, cd.y, cd.width, cd.height, x, y, cd.width, cd.height);

            ctx.restore();
        }
    }

    ctx.restore();
};

module.exports = ParticleManagerCanvasRenderer;
