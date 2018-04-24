/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Utils
 * @since 3.0.0
 */
module.exports = {

    /**
     * [pending]
     *
     * @function Phaser.Renderer.WebGL.Utils.getTintFromFloats
     * @since 3.0.0
     * 
     * @param {number} r - [pending] - what's the range?
     * @param {number} g - [description]
     * @param {number} b - [description]
     * @param {number} a - [pending] - what's the range?
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
     * [pending]
     *
     * @function Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha
     * @since 3.0.0
     * 
     * @param {number} rgb - [pending] - what's the range?
     * @param {number} a - [pending] - what's the range?
     * 
     * @return {number} [pending]
     */
    getTintAppendFloatAlpha: function (rgb, a)
    {
        var ua = ((a * 255.0)|0) & 0xFF;
        return ((ua << 24) | rgb) >>> 0;
    },

    /**
     * [pending]
     *
     * @function Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlphaAndSwap
     * @since 3.0.0
     * 
     * @param {number} rgb - [pending] - what's the range?
     * @param {number} a - [pending] - what's the range?
     * 
     * @return {number} [pending]
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
     * [pending]
     *
     * @function Phaser.Renderer.WebGL.Utils.getFloatsFromUintRGB
     * @since 3.0.0
     * 
     * @param {number} rgb - [pending]
     * 
     * @return {number} [pending]
     */
    getFloatsFromUintRGB: function (rgb)
    {
        var ur = ((rgb >> 16)|0) & 0xff;
        var ug = ((rgb >> 8)|0) & 0xff;
        var ub = (rgb|0) & 0xff;

        return [ ur / 255.0, ug / 255.0, ub / 255.0 ];
    },

    /**
     * [pending]
     *
     * @function Phaser.Renderer.WebGL.Utils.getComponentCount
     * @since 3.0.0
     * 
     * @param {number} attributes - [pending]
     * @param {WebGLRenderingContext} glContext - [pending]
     * 
     * @return {number} [pending]
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
