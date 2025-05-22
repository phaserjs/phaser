/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @author       Matthew Groves <@doormat>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../gameobjects/components/TransformMatrix');

/**
 * @namespace Phaser.Renderer.WebGL.Utils
 * @since 3.0.0
 */
module.exports = {

    /**
     * Packs four floats on a range from 0.0 to 1.0 into a single Uint32
     *
     * @function Phaser.Renderer.WebGL.Utils.getTintFromFloats
     * @since 3.0.0
     *
     * @param {number} r - Red component in a range from 0.0 to 1.0
     * @param {number} g - Green component in a range from 0.0 to 1.0
     * @param {number} b - Blue component in a range from 0.0 to 1.0
     * @param {number} a - Alpha component in a range from 0.0 to 1.0
     *
     * @return {number} The packed RGBA values as a Uint32.
     */
    getTintFromFloats: function (r, g, b, a)
    {
        var ur = ((r * 255) | 0) & 0xff;
        var ug = ((g * 255) | 0) & 0xff;
        var ub = ((b * 255) | 0) & 0xff;
        var ua = ((a * 255) | 0) & 0xff;

        return ((ua << 24) | (ur << 16) | (ug << 8) | ub) >>> 0;
    },

    /**
     * Packs a Uint24, representing RGB components, with a Float32, representing
     * the alpha component, with a range between 0.0 and 1.0 and return a Uint32
     *
     * @function Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha
     * @since 3.0.0
     *
     * @param {number} rgb - Uint24 representing RGB components
     * @param {number} a - Float32 representing Alpha component
     *
     * @return {number} Packed RGBA as Uint32
     */
    getTintAppendFloatAlpha: function (rgb, a)
    {
        var ua = ((a * 255) | 0) & 0xff;

        return ((ua << 24) | rgb) >>> 0;
    },

    /**
     * Packs a Uint24, representing RGB components, with a Float32, representing
     * the alpha component, with a range between 0.0 and 1.0 and return a
     * swizzled Uint32
     *
     * @function Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlphaAndSwap
     * @since 3.0.0
     *
     * @param {number} rgb - Uint24 representing RGB components
     * @param {number} a - Float32 representing Alpha component
     *
     * @return {number} Packed RGBA as Uint32
     */
    getTintAppendFloatAlphaAndSwap: function (rgb, a)
    {
        var ur = ((rgb >> 16) | 0) & 0xff;
        var ug = ((rgb >> 8) | 0) & 0xff;
        var ub = (rgb | 0) & 0xff;
        var ua = ((a * 255) | 0) & 0xff;

        return ((ua << 24) | (ub << 16) | (ug << 8) | ur) >>> 0;
    },

    /**
     * Unpacks a Uint24 RGB into an array of floats of ranges of 0.0 and 1.0
     *
     * @function Phaser.Renderer.WebGL.Utils.getFloatsFromUintRGB
     * @since 3.0.0
     *
     * @param {number} rgb - RGB packed as a Uint24
     *
     * @return {array} Array of floats representing each component as a float
     */
    getFloatsFromUintRGB: function (rgb)
    {
        var ur = ((rgb >> 16) | 0) & 0xff;
        var ug = ((rgb >> 8) | 0) & 0xff;
        var ub = (rgb | 0) & 0xff;

        return [ ur / 255, ug / 255, ub / 255 ];
    },

    /**
     * Check to see how many texture units the GPU supports in a fragment shader
     * and if the value specific in the game config is allowed.
     *
     * This value is hard-clamped to 16 for performance reasons on Android devices.
     *
     * @function Phaser.Renderer.WebGL.Utils.checkShaderMax
     * @since 3.50.0
     *
     * @param {WebGLRenderingContext} gl - The WebGLContext used to create the shaders.
     * @param {number} maxTextures - The Game Config maxTextures value.
     *
     * @return {number} The number of texture units that is supported by this browser and GPU.
     */
    checkShaderMax: function (gl, maxTextures)
    {
        //  Note: This is the maximum number of TIUs that a _fragment_ shader supports
        //  https://www.khronos.org/opengl/wiki/Common_Mistakes#Texture_Unit

        //  Hard-clamp this to 16 to avoid run-away texture counts such as on Android
        var gpuMax = Math.min(16, gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));

        if (!maxTextures || maxTextures === -1)
        {
            return gpuMax;
        }
        else
        {
            return Math.min(gpuMax, maxTextures);
        }
    },

    /**
     * Update lighting uniforms for a given shader program manager.
     * This is a standard procedure for most lighting shaders.
     *
     * @function Phaser.Renderer.WebGL.Utils.updateLightingUniforms
     * @since 4.0.0
     * @webglOnly
     *
     * @param {boolean} enable - Whether to enable lighting.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The DrawingContext instance.
     * @param {Phaser.Renderer.WebGL.ProgramManager} programManager - The ShaderProgramManager instance.
     * @param {number} textureUnit - The texture unit to use for the normal map.
     * @param {Phaser.Math.Vector2} vec - A Vector2 instance.
     * @param {boolean} [selfShadow] - Whether to enable self-shadowing.
     * @param {number} [selfShadowPenumbra] - The penumbra value for self-shadowing.
     * @param {number} [selfShadowThreshold] - The threshold value for self-shadowing.
     */
    updateLightingUniforms: function (
        enable,
        drawingContext,
        programManager,
        textureUnit,
        vec,
        selfShadow,
        selfShadowPenumbra,
        selfShadowThreshold
    )
    {
        var camera = drawingContext.camera;
        var scene = camera.scene;
        var lightManager = scene.sys.lights;

        if (!lightManager || !lightManager.active)
        {
            return;
        }


        var lights = lightManager.getLights(camera);
        var lightsCount = lights.length;
        var ambientColor = lightManager.ambientColor;
        var height = drawingContext.height;

        if (enable)
        {
            programManager.setUniform(
                'uNormSampler',
                textureUnit
            );

            programManager.setUniform(
                'uCamera',
                [
                    camera.x,
                    camera.y,
                    camera.rotation,
                    camera.zoom
                ]
            );
            programManager.setUniform(
                'uAmbientLightColor',
                [
                    ambientColor.r,
                    ambientColor.g,
                    ambientColor.b
                ]
            );
            programManager.setUniform(
                'uLightCount',
                lightsCount
            );

            var camMatrix = new TransformMatrix();

            for (var i = 0; i < lightsCount; i++)
            {
                var light = lights[i].light;
                var color = light.color;

                var lightName = 'uLights[' + i + '].';

                camMatrix.copyWithScrollFactorFrom(
                    camera.matrixCombined,
                    camera.scrollX, camera.scrollY,
                    light.scrollFactorX, light.scrollFactorY
                );
                camMatrix.transformPoint(
                    light.x,
                    light.y,
                    vec
                );

                programManager.setUniform(
                    lightName + 'position',
                    [
                        vec.x,
                        height - (vec.y),
                        light.z * camera.zoom
                    ]
                );
                programManager.setUniform(
                    lightName + 'color',
                    [
                        color.r,
                        color.g,
                        color.b
                    ]
                );
                programManager.setUniform(
                    lightName + 'intensity',
                    light.intensity
                );
                programManager.setUniform(
                    lightName + 'radius',
                    light.radius
                );
            }

            if (selfShadow)
            {
                // Self-shadowing uniforms.
                programManager.setUniform(
                    'uDiffuseFlatThreshold',
                    selfShadowThreshold * 3
                );

                programManager.setUniform(
                    'uPenumbra',
                    selfShadowPenumbra
                );
            }
        }
        else
        {
            // Clear lighting uniforms.
            programManager.removeUniform('uNormSampler');
            programManager.removeUniform('uCamera');
            programManager.removeUniform('uAmbientLightColor');
            programManager.removeUniform('uLightCount');

            programManager.removeUniform('uPenumbra');
            programManager.removeUniform('uDiffuseFlatThreshold');

            for (i = 0; i < lightsCount; i++)
            {
                lightName = 'uLights[' + i + '].';

                programManager.removeUniform(lightName + 'position');
                programManager.removeUniform(lightName + 'color');
                programManager.removeUniform(lightName + 'intensity');
                programManager.removeUniform(lightName + 'radius');
            }
        }
    }
};
