/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RectangleToRectangle = require('../../geom/intersects/RectangleToRectangle');
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
 * @method Phaser.GameObjects.Particles.Emitter#renderCanvas
 * @since 3.60.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ParticleEmitterCanvasRenderer = function (renderer, emitter, camera, parentMatrix)
{
    var camMatrix = tempMatrix1;
    var calcMatrix = tempMatrix2;
    var particleMatrix = tempMatrix3;
    var managerMatrix = tempMatrix4;

    if (parentMatrix)
    {
        managerMatrix.loadIdentity();
        managerMatrix.multiply(parentMatrix);
        managerMatrix.translate(emitter.x, emitter.y);
        managerMatrix.rotate(emitter.rotation);
        managerMatrix.scale(emitter.scaleX, emitter.scaleY);
    }
    else
    {
        managerMatrix.applyITRS(emitter.x, emitter.y, emitter.rotation, emitter.scaleX, emitter.scaleY);
    }

    var ctx = renderer.currentContext;
    var roundPixels = camera.roundPixels;
    var camerAlpha = camera.alpha;
    var emitterAlpha = emitter.alpha;

    var particles = emitter.alive;
    var particleCount = particles.length;
    var viewBounds = emitter.viewBounds;

    if (!emitter.visible || particleCount === 0 || (viewBounds && !RectangleToRectangle(viewBounds, camera.worldView)))
    {
        return;
    }

    if (emitter.sortCallback)
    {
        emitter.depthSort();
    }

    camera.addToRenderList(emitter);

    var scrollFactorX = emitter.scrollFactorX;
    var scrollFactorY = emitter.scrollFactorY;

    ctx.save();

    ctx.globalCompositeOperation = renderer.blendModes[emitter.blendMode];

    for (var i = 0; i < particleCount; i++)
    {
        var particle = particles[i];

        var alpha = particle.alpha * emitterAlpha * camerAlpha;

        if (alpha <= 0 || particle.scaleX === 0 || particle.scaleY === 0)
        {
            continue;
        }

        particleMatrix.applyITRS(particle.x, particle.y, particle.rotation, particle.scaleX, particle.scaleY);

        camMatrix.copyFrom(camera.matrix);

        camMatrix.multiplyWithOffset(managerMatrix, -camera.scrollX * scrollFactorX, -camera.scrollY * scrollFactorY);

        //  Undo the camera scroll
        particleMatrix.e = particle.x;
        particleMatrix.f = particle.y;

        //  Multiply by the particle matrix, store result in calcMatrix
        camMatrix.multiply(particleMatrix, calcMatrix);

        var frame = particle.frame;
        var cd = frame.canvasData;

        if (cd.width > 0 && cd.height > 0)
        {
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

            ctx.imageSmoothingEnabled = !frame.source.scaleMode;

            ctx.drawImage(frame.source.image, cd.x, cd.y, cd.width, cd.height, x, y, cd.width, cd.height);

            ctx.restore();
        }
    }

    ctx.restore();
};

module.exports = ParticleEmitterCanvasRenderer;
