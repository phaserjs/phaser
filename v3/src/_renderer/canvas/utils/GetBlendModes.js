var modes = require('../../BlendModes');
var CanvasFeatures = require('../../../device/CanvasFeatures');

var GetBlendModes = function ()
{
    var output = [];
    var useNew = CanvasFeatures.supportNewBlendModes;

    output[modes.NORMAL] = 'source-over';
    output[modes.ADD] = 'lighter';
    output[modes.MULTIPLY] = (useNew) ? 'multiply' : 'source-over';
    output[modes.SCREEN] = (useNew) ? 'screen' : 'source-over';
    output[modes.OVERLAY] = (useNew) ? 'overlay' : 'source-over';
    output[modes.DARKEN] = (useNew) ? 'darken' : 'source-over';
    output[modes.LIGHTEN] = (useNew) ? 'lighten' : 'source-over';
    output[modes.COLOR_DODGE] = (useNew) ? 'color-dodge' : 'source-over';
    output[modes.COLOR_BURN] = (useNew) ? 'color-burn' : 'source-over';
    output[modes.HARD_LIGHT] = (useNew) ? 'hard-light' : 'source-over';
    output[modes.SOFT_LIGHT] = (useNew) ? 'soft-light' : 'source-over';
    output[modes.DIFFERENCE] = (useNew) ? 'difference' : 'source-over';
    output[modes.EXCLUSION] = (useNew) ? 'exclusion' : 'source-over';
    output[modes.HUE] = (useNew) ? 'hue' : 'source-over';
    output[modes.SATURATION] = (useNew) ? 'saturation' : 'source-over';
    output[modes.COLOR] = (useNew) ? 'color' : 'source-over';
    output[modes.LUMINOSITY] = (useNew) ? 'luminosity' : 'source-over';

    return output;
};

module.exports = GetBlendModes;
