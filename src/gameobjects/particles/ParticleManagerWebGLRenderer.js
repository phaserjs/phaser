/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Utils = require('../../renderer/webgl/Utils');

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
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ParticleManagerWebGLRenderer = function (renderer, emitterManager, interpolationPercentage, camera, parentMatrix)
{
    var emitters = emitterManager.emitters.list;
    var emittersLength = emitters.length;

    if (emittersLength === 0)
    {
        return;
    }

    var pipeline = this.pipeline;

    var camMatrix = pipeline._tempMatrix1.copyFrom(camera.matrix);
    var calcMatrix = pipeline._tempMatrix2;
    var particleMatrix = pipeline._tempMatrix3;
    var managerMatrix = pipeline._tempMatrix4.applyITRS(emitterManager.x, emitterManager.y, emitterManager.rotation, emitterManager.scaleX, emitterManager.scaleY);

    camMatrix.multiply(managerMatrix);

    renderer.setPipeline(pipeline);

    var roundPixels = camera.roundPixels;
    var texture = emitterManager.defaultFrame.glTexture;
    var getTint = Utils.getTintAppendFloatAlphaAndSwap;

    pipeline.setTexture2D(texture, 0);

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

        if (renderer.setBlendMode(emitter.blendMode))
        {
            //  Rebind the texture if we've flushed
            pipeline.setTexture2D(texture, 0);
        }

        var tintEffect = 0;

        for (var i = 0; i < particleCount; i++)
        {
            var particle = particles[i];

            var alpha = particle.alpha * camera.alpha;

            if (alpha <= 0)
            {
                continue;
            }

            var frame = particle.frame;

            var x = -(frame.halfWidth);
            var y = -(frame.halfHeight);
            var xw = x + frame.width;
            var yh = y + frame.height;

            particleMatrix.applyITRS(0, 0, particle.rotation, particle.scaleX, particle.scaleY);

            particleMatrix.e = particle.x - scrollX;
            particleMatrix.f = particle.y - scrollY;

            camMatrix.multiply(particleMatrix, calcMatrix);

            var tx0 = calcMatrix.getX(x, y);
            var ty0 = calcMatrix.getY(x, y);
    
            var tx1 = calcMatrix.getX(x, yh);
            var ty1 = calcMatrix.getY(x, yh);
    
            var tx2 = calcMatrix.getX(xw, yh);
            var ty2 = calcMatrix.getY(xw, yh);
    
            var tx3 = calcMatrix.getX(xw, y);
            var ty3 = calcMatrix.getY(xw, y);

            if (roundPixels)
            {
                tx0 = Math.round(tx0);
                ty0 = Math.round(ty0);
    
                tx1 = Math.round(tx1);
                ty1 = Math.round(ty1);
    
                tx2 = Math.round(tx2);
                ty2 = Math.round(ty2);
    
                tx3 = Math.round(tx3);
                ty3 = Math.round(ty3);
            }

            var tint = getTint(particle.tint, alpha);

            pipeline.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, tintEffect, texture, 0);
        }
    }
};

module.exports = ParticleManagerWebGLRenderer;
