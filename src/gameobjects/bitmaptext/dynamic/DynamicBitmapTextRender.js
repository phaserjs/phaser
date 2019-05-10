/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var renderWebGL = require('../../../utils/NOOP');
var renderCanvas = require('../../../utils/NOOP');

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./DynamicBitmapTextWebGLRenderer');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./DynamicBitmapTextCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
