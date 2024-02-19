/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../utils/object/Extend');

/**
 * @namespace Phaser.Geom
 */

var Geom = {

    Circle: require('./circle'),
    Ellipse: require('./ellipse'),
    Intersects: require('./intersects'),
    Line: require('./line'),
    Mesh: require('./mesh'),
    Point: require('./point'),
    Polygon: require('./polygon'),
    Rectangle: require('./rectangle'),
    Triangle: require('./triangle')

};

//   Merge in the consts
Geom = Extend(false, Geom, CONST);

module.exports = Geom;
