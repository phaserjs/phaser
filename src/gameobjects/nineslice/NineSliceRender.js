/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var NOOP = require('../../utils/NOOP');
var renderWebGL = NOOP;
var renderCanvas = NOOP;

if (typeof WEBGL_RENDERER)
{
    renderWebGL = require('./NineSliceWebGLRenderer');
}

<<<<<<< HEAD
=======
if (typeof CANVAS_RENDERER)
{
    // renderCanvas = require('./MeshCanvasRenderer');
}

>>>>>>> parent of 7aaa976a4 (Updated webpack config DefinePlugin use and corresponding defs to allow those crazy souls who import source directly on node to have a better life #6644)
module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
