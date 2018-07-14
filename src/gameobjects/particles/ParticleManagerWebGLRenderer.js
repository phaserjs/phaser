/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');

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

    if (emitters.length === 0 || GameObject.RENDER_MASK !== emitterManager.renderFlags || (emitterManager.cameraFilter > 0 && (emitterManager.cameraFilter & camera._id)))
    {
        return;
    }

    var pipeline = this.pipeline;

    var camMatrix = pipeline._tempMatrix1.copyFrom(camera.matrix);
    var calcMatrix = pipeline._tempMatrix2;
    var particleMatrix = pipeline._tempMatrix3;

    renderer.setPipeline(pipeline);

    var roundPixels = camera.roundPixels;
    var texture = emitterManager.defaultFrame.glTexture;

    pipeline.setTexture2D(texture, 0);
    
    for (var e = 0; e < emitters.length; e++)
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

        renderer.setBlendMode(emitter.blendMode);

        var tintEffect = false;

        for (var i = 0; i < particleCount; i++)
        {
            var particle = particles[i];

            if (particle.alpha <= 0)
            {
                continue;
            }

            var frame = particle.frame;
            var color = particle.color;

            var x = -(frame.halfWidth);
            var y = -(frame.halfHeight);
            var xw = x + frame.width;
            var yh = y + frame.height;

            particleMatrix.applyITRS(0, 0, particle.rotation, particle.scaleX, particle.scaleY);

            particleMatrix.e = particle.x - scrollX;
            particleMatrix.f = particle.y - scrollY;

            camMatrix.multiply(particleMatrix, calcMatrix);

            var tx0 = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
            var ty0 = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;
    
            var tx1 = x * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
            var ty1 = x * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;
    
            var tx2 = xw * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
            var ty2 = xw * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;
    
            var tx3 = xw * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
            var ty3 = xw * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

            if (roundPixels)
            {
                tx0 |= 0;
                ty0 |= 0;

                tx1 |= 0;
                ty1 |= 0;

                tx2 |= 0;
                ty2 |= 0;

                tx3 |= 0;
                ty3 |= 0;
            }

            if (pipeline.batchVertices(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, frame.u0, frame.v0, frame.u1, frame.v1, color, color, color, color, tintEffect))
            {
                pipeline.setTexture2D(texture, 0);
            }
        }
    }
};

module.exports = ParticleManagerWebGLRenderer;
