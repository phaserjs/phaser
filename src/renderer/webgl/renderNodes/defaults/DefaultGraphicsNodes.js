/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../../structs/Map');

var DefaultGraphicsNodes = new Map([
    [ 'Submitter', 'BatchHandlerTriFlat' ],
    [ 'FillPath', 'FillPath' ],
    [ 'FillRect', 'FillRect' ],
    [ 'FillTri', 'FillTri' ],
    [ 'StrokePath', 'StrokePath' ]
]);

module.exports = DefaultGraphicsNodes;
