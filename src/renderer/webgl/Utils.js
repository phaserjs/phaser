/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @author       Matthew Groves <@doormat>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Generate shader source to test maximum ifs.
 *
 * @private
 * @ignore
 * @param {number} maxIfs - The number of if statements to generate
 */
function GenerateSrc (maxIfs)
{
    var src = '';

    for (var i = 0; i < maxIfs; ++i)
    {
        if (i > 0)
        {
            src += '\nelse ';
        }

        if (i < maxIfs - 1)
        {
            src += 'if(test == ' + i + '.0){}';
        }
    }

    return src;
}

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
     * Check to see how many texture units the GPU supports, based on the given config value.
     * Then tests this against the maximum number of iterations GLSL can support.
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
        if (!maxTextures || maxTextures === -1)
        {
            maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }

        var shader = gl.createShader(gl.FRAGMENT_SHADER);

        var fragTemplate = [
            'precision mediump float;',
            'void main(void){',
            'float test = 0.1;',
            '%forloop%',
            'gl_FragColor = vec4(0.0);',
            '}'
        ].join('\n');

        // eslint-disable-next-line no-constant-condition
        while (true)
        {
            var fragmentSrc = fragTemplate.replace(/%forloop%/gi, GenerateSrc(maxTextures));

            gl.shaderSource(shader, fragmentSrc);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            {
                maxTextures = (maxTextures / 2) | 0;
            }
            else
            {
                // valid!
                break;
            }
        }

        return maxTextures;
    },

    /**
     * Checks the given Fragment Shader Source for `%count%` and `%forloop%` declarations and
     * replaces those with GLSL code for setting `texture = texture2D(uMainSampler[i], outTexCoord)`.
     *
     * @function Phaser.Renderer.WebGL.Utils.parseFragmentShaderMaxTextures
     * @since 3.50.0
     *
     * @param {string} fragmentShaderSource - The Fragment Shader source code to operate on.
     * @param {number} maxTextures - The number of maxTextures value.
     *
     * @return {string} The modified Fragment Shader source.
     */
    parseFragmentShaderMaxTextures: function (fragmentShaderSource, maxTextures)
    {
        if (!fragmentShaderSource)
        {
            return '';
        }

        var src = '';

        for (var i = 0; i < maxTextures; i++)
        {
            if (i > 0)
            {
                src += '\n\telse ';
            }

            if (i < maxTextures - 1)
            {
                src += 'if (outTexId < ' + i + '.5)';
            }

            src += '\n\t{';
            src += '\n\t\ttexture = texture2D(uMainSampler[' + i + '], outTexCoord);';
            src += '\n\t}';
        }

        fragmentShaderSource = fragmentShaderSource.replace(/%count%/gi, maxTextures.toString());

        return fragmentShaderSource.replace(/%forloop%/gi, src);
    }
};
