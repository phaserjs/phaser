/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// The Stamp inherits WebGL rendering properties from the Image class.

var NOOP = require('../../utils/NOOP');
var renderCanvas = NOOP;

if (typeof CANVAS_RENDERER)
{
    renderCanvas = require('./StampCanvasRenderer');
}

module.exports = {

    renderCanvas: renderCanvas

};
