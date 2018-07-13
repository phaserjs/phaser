/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var MATH_CONST: any;
declare var Angle: (items: any, value: any, step: any, index: any, direction: any) => any;
declare var Point: any;
/**
 * Calculate the normal of the given line.
 *
 * The normal of a line is a vector that points perpendicular from it.
 *
 * @function Phaser.Geom.Line.GetNormal
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the normal of.
 * @param {(Phaser.Geom.Point|object)} [out] - An optional point object to store the normal in.
 *
 * @return {(Phaser.Geom.Point|object)} The normal of the Line.
 */
declare var GetNormal: (line: any, out: any) => any;
