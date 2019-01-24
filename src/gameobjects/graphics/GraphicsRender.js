/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var renderWebGL = require('../../utils/NOOP');
var renderCanvas = require('../../utils/NOOP');

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./GraphicsWebGLRenderer');

    //  Needed for Graphics.generateTexture
    renderCanvas = require('./GraphicsCanvasRenderer');
}

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./GraphicsCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
