/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../components/TransformMatrix');

var tempMatrix1 = new TransformMatrix();
var tempMatrix2 = new TransformMatrix();
var tempMatrix3 = new TransformMatrix();
var tempMatrix4 = new TransformMatrix();

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
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ParticleManagerCanvasRenderer = function (renderer, emitterManager, camera, parentMatrix)
{
    var emitters = emitterManager.emitters.list;
    var emittersLength = emitters.length;

    if (emittersLength === 0)
    {
        return;
    }

    var camMatrix = tempMatrix1.copyFrom(camera.matrix);
    var calcMatrix = tempMatrix2;
    var particleMatrix = tempMatrix3;
    var managerMatrix = tempMatrix4;

    if (parentMatrix)
    {
        managerMatrix.loadIdentity();
        managerMatrix.multiply(parentMatrix);
        managerMatrix.translate(emitterManager.x, emitterManager.y);
        managerMatrix.rotate(emitterManager.rotation);
        managerMatrix.scale(emitterManager.scaleX, emitterManager.scaleY);
    }
    else
    {
        managerMatrix.applyITRS(emitterManager.x, emitterManager.y, emitterManager.rotation, emitterManager.scaleX, emitterManager.scaleY);
    }

    var ctx = renderer.currentContext;
    var roundPixels = camera.roundPixels;

    for (var e = 0; e < emittersLength; e++)
    {
        var emitter = emitters[e];
        var particles = emitter.alive;
        var particleCount = particles.length;

        if (!emitter.visible || particleCount === 0)
        {
            continue;
        }

        var followX = (emitter.follow) ? emitter.follow.x + emitter.followOffset.x : 0;
        var followY = (emitter.follow) ? emitter.follow.y + emitter.followOffset.y : 0;

        var scrollFactorX = emitter.scrollFactorX;
        var scrollFactorY = emitter.scrollFactorY;

        ctx.save();

        ctx.globalCompositeOperation = renderer.blendModes[emitter.blendMode];

        for (var i = 0; i < particleCount; i++)
        {
            var particle = particles[i];

            var alpha = particle.alpha * camera.alpha;

            if (alpha <= 0)
            {
                continue;
            }

            particleMatrix.applyITRS(particle.x, particle.y, particle.rotation, particle.scaleX, particle.scaleY);

            camMatrix.copyFrom(camera.matrix);

            camMatrix.multiplyWithOffset(managerMatrix, followX + -camera.scrollX * scrollFactorX, followY + -camera.scrollY * scrollFactorY);

            //  Undo the camera scroll
            particleMatrix.e = particle.x;
            particleMatrix.f = particle.y;

            //  Multiply by the particle matrix, store result in calcMatrix
            camMatrix.multiply(particleMatrix, calcMatrix);

            var frame = particle.frame;
            var cd = frame.canvasData;

            var x = -(frame.halfWidth);
            var y = -(frame.halfHeight);

            ctx.globalAlpha = alpha;

            ctx.save();

            calcMatrix.setToContext(ctx);

            if (roundPixels)
            {
                x = Math.round(x);
                y = Math.round(y);
            }

            ctx.imageSmoothingEnabled = !(!renderer.antialias || frame.source.scaleMode);

            ctx.drawImage(frame.source.image, cd.x, cd.y, cd.width, cd.height, x, y, cd.width, cd.height);

            ctx.restore();
        }

        ctx.restore();
    }
};

module.exports = ParticleManagerCanvasRenderer;
