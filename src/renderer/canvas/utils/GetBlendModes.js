/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var modes = require('../../BlendModes');
var CanvasFeatures = require('../../../device/CanvasFeatures');

/**
 * Returns an array which maps the default blend modes to supported Canvas blend modes.
 *
 * If the browser doesn't support a blend mode, it will default to the normal `source-over` blend mode.
 *
 * @function Phaser.Renderer.Canvas.GetBlendModes
 * @since 3.0.0
 *
 * @return {array} Which Canvas blend mode corresponds to which default Phaser blend mode.
 */
var GetBlendModes = function ()
{
    var output = [];
    var useNew = CanvasFeatures.supportNewBlendModes;
    var so = 'source-over';

    output[modes.NORMAL] = so;
    output[modes.ADD] = 'lighter';
    output[modes.MULTIPLY] = (useNew) ? 'multiply' : so;
    output[modes.SCREEN] = (useNew) ? 'screen' : so;
    output[modes.OVERLAY] = (useNew) ? 'overlay' : so;
    output[modes.DARKEN] = (useNew) ? 'darken' : so;
    output[modes.LIGHTEN] = (useNew) ? 'lighten' : so;
    output[modes.COLOR_DODGE] = (useNew) ? 'color-dodge' : so;
    output[modes.COLOR_BURN] = (useNew) ? 'color-burn' : so;
    output[modes.HARD_LIGHT] = (useNew) ? 'hard-light' : so;
    output[modes.SOFT_LIGHT] = (useNew) ? 'soft-light' : so;
    output[modes.DIFFERENCE] = (useNew) ? 'difference' : so;
    output[modes.EXCLUSION] = (useNew) ? 'exclusion' : so;
    output[modes.HUE] = (useNew) ? 'hue' : so;
    output[modes.SATURATION] = (useNew) ? 'saturation' : so;
    output[modes.COLOR] = (useNew) ? 'color' : so;
    output[modes.LUMINOSITY] = (useNew) ? 'luminosity' : so;
    output[modes.ERASE] = 'destination-out';
    output[modes.SOURCE_IN] = 'source-in';
    output[modes.SOURCE_OUT] = 'source-out';
    output[modes.SOURCE_ATOP] = 'source-atop';
    output[modes.DESTINATION_OVER] = 'destination-over';
    output[modes.DESTINATION_IN] = 'destination-in';
    output[modes.DESTINATION_OUT] = 'destination-out';
    output[modes.DESTINATION_ATOP] = 'destination-atop';
    output[modes.LIGHTER] = 'lighter';
    output[modes.COPY] = 'copy';
    output[modes.XOR] = 'xor';

    return output;
};

module.exports = GetBlendModes;
