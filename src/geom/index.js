/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
    Point: require('./point'),
    Polygon: require('./polygon'),
    Rectangle: require('./rectangle'),
    Triangle: require('./triangle')

};

//   Merge in the consts
Geom = Extend(false, Geom, CONST);

module.exports = Geom;
