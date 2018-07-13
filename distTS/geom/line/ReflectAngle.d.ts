/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Angle: (items: any, value: any, step: any, index: any, direction: any) => any;
declare var NormalAngle: (line: any) => any;
/**
 * Calculate the reflected angle between two lines.
 *
 * This is the outgoing angle based on the angle of Line 1 and the normalAngle of Line 2.
 *
 * @function Phaser.Geom.Line.ReflectAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} lineA - The first line.
 * @param {Phaser.Geom.Line} lineB - The second line.
 *
 * @return {number} The reflected angle between each line.
 */
declare var ReflectAngle: (lineA: any, lineB: any) => number;
