/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Filters
 */

var Filters = {
    Controller: require('./Controller'),

    Blur: require('./Blur'),
    Bokeh: require('./Bokeh'),
    Displacement: require('./Displacement'),
    Mask: require('./Mask'),
    Pixelate: require('./Pixelate'),
    Sampler: require('./Sampler')
};

module.exports = Filters;
