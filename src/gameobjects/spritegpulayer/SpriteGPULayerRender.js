/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var NOOP = require('../../utils/NOOP');
var renderWebGL = require('./SpriteGPULayerWebGLRenderer');
var renderCanvas = NOOP;

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};
