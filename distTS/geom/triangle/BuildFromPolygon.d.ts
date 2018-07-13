/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var EarCut: any;
declare var Triangle: any;
/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.BuildFromPolygon
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle[]} O - [out,$return]
 *
 * @param {array} data - A flat array of vertice coordinates like [x0,y0, x1,y1, x2,y2, ...]
 * @param {array} [holes=null] - An array of hole indices if any (e.g. [5, 8] for a 12-vertice input would mean one hole with vertices 5–7 and another with 8–11).
 * @param {number} [scaleX=1] - [description]
 * @param {number} [scaleY=1] - [description]
 * @param {(array|Phaser.Geom.Triangle[])} [out] - [description]
 *
 * @return {(array|Phaser.Geom.Triangle[])} [description]
 */
declare var BuildFromPolygon: (data: any, holes: any, scaleX: any, scaleY: any, out: any) => any;
