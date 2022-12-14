/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../components/TransformMatrix');
var Utils = require('../../renderer/webgl/Utils');

var tempMatrix1 = new TransformMatrix();
var tempMatrix2 = new TransformMatrix();
var tempMatrix3 = new TransformMatrix();
var tempMatrix4 = new TransformMatrix();

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Particles.EmitterManager#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} emitterManager - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ParticleManagerWebGLRenderer = function (renderer, emitterManager, camera, parentMatrix)
{
    var emitters = emitterManager.emitters.list;
    var emittersLength = emitters.length;

    if (emittersLength === 0)
    {
        return;
    }

    var pipeline = renderer.pipelines.set(emitterManager.pipeline);

    var camMatrix = tempMatrix1;
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

    var roundPixels = camera.roundPixels;
    var texture = emitterManager.defaultFrame.glTexture;
    var getTint = Utils.getTintAppendFloatAlpha;

    var textureUnit = pipeline.setGameObject(emitterManager, emitterManager.defaultFrame);

    renderer.pipelines.preBatch(emitterManager);

    for (var e = 0; e < emittersLength; e++)
    {
        var emitter = emitters[e];
        var particles = emitter.alive;
        var particleCount = particles.length;

        if (!emitter.visible || particleCount === 0)
        {
            continue;
        }

        camera.addToRenderList(emitter);

        var scrollFactorX = emitter.scrollFactorX;
        var scrollFactorY = emitter.scrollFactorY;

        renderer.setBlendMode(emitter.blendMode);

        if (emitter.mask)
        {
            emitter.mask.preRenderWebGL(renderer, emitter, camera);

            renderer.pipelines.set(emitterManager.pipeline);
        }

        var tintEffect = 0;

        for (var i = 0; i < particleCount; i++)
        {
            var particle = particles[i];

            var alpha = particle.alpha * camera.alpha;

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

            var x = -frame.halfWidth;
            var y = -frame.halfHeight;

            var quad = calcMatrix.setQuad(x, y, x + frame.width, y + frame.height, roundPixels);

            var tint = getTint(particle.tint, alpha);

            pipeline.batchQuad(emitter, quad[0], quad[1], quad[2], quad[3], quad[4], quad[5], quad[6], quad[7], frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, tintEffect, texture, textureUnit);
        }

        if (emitter.mask)
        {
            emitter.mask.postRenderWebGL(renderer, camera);
        }
    }

    renderer.pipelines.postBatch(emitterManager);
};

module.exports = ParticleManagerWebGLRenderer;
