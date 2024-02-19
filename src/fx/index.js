/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Extend = require('../utils/object/Extend');
var FX_CONST = require('./const');

/**
 * @namespace Phaser.FX
 */

var FX = {

    Barrel: require('./Barrel'),
    Controller: require('./Controller'),
    Bloom: require('./Bloom'),
    Blur: require('./Blur'),
    Bokeh: require('./Bokeh'),
    Circle: require('./Circle'),
    ColorMatrix: require('./ColorMatrix'),
    Displacement: require('./Displacement'),
    Glow: require('./Glow'),
    Gradient: require('./Gradient'),
    Pixelate: require('./Pixelate'),
    Shadow: require('./Shadow'),
    Shine: require('./Shine'),
    Vignette: require('./Vignette'),
    Wipe: require('./Wipe')

};

FX = Extend(false, FX, FX_CONST);

module.exports = FX;
