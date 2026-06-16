/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ApplyAlphaDiscard = require('../ApplyAlphaDiscard-glsl');


/**
 * Return a ShaderAdditionConfig for applying an alpha discard strategy
 * to the fragment color.
 *
 * The alpha discard strategy is used to discard fragments based on their alpha value.
 * This is useful for stencil operations, where transparent fragments should not be considered for the stencil buffer.
 * Retained fragments are increased to alpha 1.0.
 *
 * Disable this addition to just keep the fragment color as is.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeApplyAlphaDiscard
 * @since 4.NEXT
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @param {boolean} [dither=false] - Whether to use a dithering strategy to discard fragments.
 * @param {number} [threshold] - The threshold value to use when using a thresholding strategy to discard fragments. If defined, and dither is false, the threshold will be used to discard fragments.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeApplyAlphaDiscard = function (disable, dither, threshold)
{
    var name = 'AlphaDiscard';
    var additions = {
        fragmentHeader: ApplyAlphaDiscard,
        fragmentProcess: 'fragColor = applyAlphaDiscard(fragColor);'
    }

    if (dither)
    {
        name += 'Dither';
        additions.fragmentDefine = '#define ALPHA_DISCARD_STRATEGY_DITHER';
    }
    else if (threshold)
    {
        name += 'Threshold_' + threshold;
        var thresholdString = threshold.toString();
        if (Math.round(threshold) === threshold)
        {
            // Integer, so add a decimal point to convert to a float.
            thresholdString += '.';
        }
        additions.fragmentDefine = '#define ALPHA_DISCARD_STRATEGY_THRESHOLD ' + thresholdString;
    }
    else
    {
        disable = true;
    }

    return {
        name: name,
        additions: additions,
        tags: ['ALPHA_DISCARD'],
        disable: !!disable
    }
};

module.exports = MakeApplyAlphaDiscard;
