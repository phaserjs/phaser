/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var renderWebGL = require('../../../../src/utils/NOOP');
var renderCanvas = require('../../../../src/utils/NOOP');
var renderDirect = require('../../../../src/utils/NOOP');

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./SpineGameObjectWebGLRenderer');
    renderDirect = require('./SpineGameObjectWebGLDirect');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./SpineGameObjectCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas,
    renderDirect: renderDirect

};
