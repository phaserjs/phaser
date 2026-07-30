/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Filters
 */

var Filters = {
    Controller: require('./Controller'),

    Barrel: require('./Barrel'),
    Blend: require('./Blend'),
    Blocky: require('./Blocky'),
    Blur: require('./Blur'),
    Bokeh: require('./Bokeh'),
    ColorMatrix: require('./ColorMatrix'),
    CombineColorMatrix: require('./CombineColorMatrix'),
    Displacement: require('./Displacement'),
    Glow: require('./Glow'),
    GradientMap: require('./GradientMap'),
    ImageLight: require('./ImageLight'),
    Key: require('./Key'),
    Mask: require('./Mask'),
    NormalTools: require('./NormalTools'),
    PanoramaBlur: require('./PanoramaBlur'),
    ParallelFilters: require('./ParallelFilters'),
    Pixelate: require('./Pixelate'),
    Quantize: require('./Quantize'),
    Sampler: require('./Sampler'),
    Shadow: require('./Shadow'),
    Threshold: require('./Threshold'),
    Vignette: require('./Vignette'),
    Wipe: require('./Wipe')
};

module.exports = Filters;
