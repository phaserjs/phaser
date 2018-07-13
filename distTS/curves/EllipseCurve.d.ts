/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var Curve: any;
declare var DegToRad: any;
declare var GetValue: any;
declare var RadToDeg: any;
declare var Vector2: any;
/**
 * @typedef {object} JSONEllipseCurve
 *
 * @property {string} type - The of the curve.
 * @property {number} x - [description]
 * @property {number} y - [description]
 * @property {number} xRadius - The horizontal radius of ellipse.
 * @property {number} yRadius - The vertical radius of ellipse.
 * @property {integer} startAngle - The start angle of ellipse.
 * @property {integer} endAngle - The end angle of ellipse.
 * @property {boolean} clockwise - The clockwise of ellipse.
 * @property {integer} rotation - The rotation of ellipse.
 */
/**
 * @typedef {object} EllipseCurveConfig
 *
 * @property {number} [x=0] - [description]
 * @property {number} [y=0] - [description]
 * @property {number} [xRadius=0] - [description]
 * @property {number} [yRadius=0] - [description]
 * @property {integer} [startAngle=0] - [description]
 * @property {integer} [endAngle=360] - [description]
 * @property {boolean} [clockwise=false] - [description]
 * @property {integer} [rotation=0] - [description]
  */
/**
 * @classdesc
 * [description]
 *
 * @class Ellipse
 * @extends Phaser.Curves.Curve
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {(number|EllipseCurveConfig)} [x=0] - [description]
 * @param {number} [y=0] - [description]
 * @param {number} [xRadius=0] - [description]
 * @param {number} [yRadius=0] - [description]
 * @param {integer} [startAngle=0] - [description]
 * @param {integer} [endAngle=360] - [description]
 * @param {boolean} [clockwise=false] - [description]
 * @param {integer} [rotation=0] - [description]
 */
declare var EllipseCurve: any;
