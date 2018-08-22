/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var modes = require('../../BlendModes');
var CanvasFeatures = require('../../../device/CanvasFeatures');

/**
 * [description]
 *
 * @function Phaser.Renderer.Canvas.GetBlendModes
 * @since 3.0.0
 *
 * @return {array} [description]
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

    return output;
};

module.exports = GetBlendModes;
