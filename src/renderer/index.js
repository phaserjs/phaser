/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
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
