/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RectangleToRectangle = require('../../geom/intersects/RectangleToRectangle');
var TransformMatrix = require('../components/TransformMatrix');
var Utils = require('../../renderer/webgl/Utils');

var camMatrix = new TransformMatrix();
var calcMatrix = new TransformMatrix();
var particleMatrix = new TransformMatrix();
var managerMatrix = new TransformMatrix();

var tempTexturer = {};
var tempTinter = {};
var tempTransformer = { quad: new Float32Array(8) };

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Particles.Emitter#renderWebGL
 * @since 3.60.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} emitter - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var ParticleEmitterWebGLRenderer = function (renderer, emitter, drawingContext, parentMatrix)
{
    var camera = drawingContext.camera;

    camera.addToRenderList(emitter);

    camMatrix.copyWithScrollFactorFrom(
        camera.getViewMatrix(!drawingContext.useCanvas),
        camera.scrollX, camera.scrollY,
        emitter.scrollFactorX, emitter.scrollFactorY
    );

    if (parentMatrix)
    {
        camMatrix.multiply(parentMatrix);
    }

    managerMatrix.applyITRS(
        emitter.x, emitter.y,
        emitter.rotation,
        emitter.scaleX, emitter.scaleY
    );

    camMatrix.multiply(managerMatrix);

    var getTint = Utils.getTintAppendFloatAlpha;
    var emitterAlpha = emitter.alpha;

    var particles = emitter.alive;
    var particleCount = particles.length;
    var viewBounds = emitter.viewBounds;

    if (particleCount === 0 || (viewBounds && !RectangleToRectangle(viewBounds, camera.worldView)))
    {
        return;
    }

    if (emitter.sortCallback)
    {
        emitter.depthSort();
    }

    var tintFill = emitter.tintFill;

    for (var i = 0; i < particleCount; i++)
    {
        var particle = particles[i];

        var alpha = particle.alpha * emitterAlpha;

        if (alpha <= 0 || particle.scaleX === 0 || particle.scaleY === 0)
        {
            continue;
        }

        particleMatrix.applyITRS(particle.x, particle.y, particle.rotation, particle.scaleX, particle.scaleY);

        //  Multiply by the particle matrix, store result in calcMatrix
        camMatrix.multiply(particleMatrix, calcMatrix);

        var frame = particle.frame;

        var x = -frame.halfWidth;
        var y = -frame.halfHeight;

        calcMatrix.setQuad(x, y, x + frame.width, y + frame.height, tempTransformer.quad);

        if (tempTexturer.frame !== frame)
        {
            tempTexturer.frame = frame;
            tempTexturer.uvSource = frame;
        }

        var tint = getTint(particle.tint, alpha);
        tempTinter.tintTopLeft = tint;
        tempTinter.tintBottomLeft = tint;
        tempTinter.tintTopRight = tint;
        tempTinter.tintBottomRight = tint;
        tempTinter.tintFill = tintFill;

        var normalMap, normalMapRotation;

        if (emitter.lighting)
        {
            if (particle.texture)
            {
                normalMap = frame.texture.dataSource[frame.sourceIndex];
            }

            normalMapRotation = particle.rotation;
            if (emitter.parentContainer)
            {
                var matrix = emitter.getWorldTransformMatrix(camMatrix, calcMatrix).rotate(particle.rotation);

                normalMapRotation = matrix.rotationNormalized;
            }
        }

        var customRenderNodes = emitter.customRenderNodes;
        var defaultRenderNodes = emitter.defaultRenderNodes;

        (customRenderNodes.Submitter || defaultRenderNodes.Submitter).run(
            drawingContext,
            emitter,
            parentMatrix,
            0,
            tempTexturer,
            tempTransformer,
            tempTinter,

            // Optional normal map overrides
            normalMap, normalMapRotation
        );
    }
};

module.exports = ParticleEmitterWebGLRenderer;
