/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Angle = require('./Angle');
var NormalAngle = require('./NormalAngle');

/**
* Returns the reflected angle between two lines.
* This is the outgoing angle based on the angle of Line 1 and the normalAngle of Line 2.
*/
/**
 * [description]
 *
 * @function Phaser.Geom.Line.ReflectAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} lineA - [description]
 * @param {Phaser.Geom.Line} lineB - [description]
 *
 * @return {number} [description]
 */
var ReflectAngle = function (lineA, lineB)
{
    return (2 * NormalAngle(lineB) - Math.PI - Angle(lineA));
};

module.exports = ReflectAngle;
