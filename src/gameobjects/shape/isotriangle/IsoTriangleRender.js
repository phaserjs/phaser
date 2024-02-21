/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var NOOP = require('../../../utils/NOOP');
var renderWebGL = NOOP;
var renderCanvas = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./IsoTriangleWebGLRenderer');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./IsoTriangleCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
