/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

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
     * @return {number} [description]
     */
    getTintFromFloats: function (r, g, b, a)
    {
        var ur = ((r * 255.0)|0) & 0xFF;
        var ug = ((g * 255.0)|0) & 0xFF;
        var ub = ((b * 255.0)|0) & 0xFF;
        var ua = ((a * 255.0)|0) & 0xFF;

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
        var ua = ((a * 255.0)|0) & 0xFF;
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
        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;
        var ua = ((a * 255.0)|0) & 0xFF;

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
        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;

        return [ ur / 255.0, ug / 255.0, ub / 255.0 ];
    },

    /**
     * Counts how many attributes of 32 bits a vertex has
     *
     * @function Phaser.Renderer.WebGL.Utils.getComponentCount
     * @since 3.0.0
     * 
     * @param {array} attributes - Array of attributes 
     * @param {WebGLRenderingContext} glContext - WebGLContext used for check types
     * 
     * @return {number} Count of 32 bit attributes in vertex
     */
    getComponentCount: function (attributes, glContext)
    {
        var count = 0;

        for (var index = 0; index < attributes.length; ++index)
        {
            var element = attributes[index];
            
            if (element.type === glContext.FLOAT)
            {
                count += element.size;
            }
            else
            {
                count += 1; // We'll force any other type to be 32 bit. for now
            }
        }

        return count;
    }

};
