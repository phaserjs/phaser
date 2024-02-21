/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer
 */

/**
 * @namespace Phaser.Types.Renderer
 */

module.exports = {

    Events: require('./events'),
    Snapshot: require('./snapshot')

};

if (typeof CANVAS_RENDERER)
{
    module.exports.Canvas = require('./canvas');
}

if (typeof WEBGL_RENDERER)
{
    module.exports.WebGL = require('./webgl');
}
