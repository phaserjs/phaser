/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var renderWebGL = require('../../../../src/utils/NOOP');
var renderCanvas = require('../../../../src/utils/NOOP');

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./SpineContainerWebGLRenderer');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./SpineContainerCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
