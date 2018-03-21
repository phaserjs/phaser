import GetAngle from './GetAngle';
import GetAngleWithDistance from './GetAngleWithDistance';
import GetEntryTangent from './GetEntryTangent';
import GetPoint from './GetPoint';
import GetPointWithDistance from './GetPointWithDistance';
import GetX from './GetX';
import GetY from './GetY';
/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Pete Baron <pete@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
/**
* A data representation of a Hermite Curve (see http://en.wikipedia.org/wiki/Cubic_Hermite_spline)
*
* A Hermite curve has a start and end point and tangent vectors for both of them.
* The curve will always pass through the two control points and the shape of it is controlled
* by the length and direction of the tangent vectors.  At the control points the curve will
* be facing exactly in the vector direction.
*
* As these curves change speed (speed = distance between points separated by an equal change in
* 't' value - see Hermite.getPoint) this class attempts to reduce the variation by pre-calculating
* the `accuracy` number of points on the curve. The straight-line distances to these points are stored
* in the private 'points' array, and this information is used by Hermite.findT() to convert a pixel
* distance along the curve into a 'time' value.
*
* Higher `accuracy` values will result in more even movement, but require more memory for the points
* list. 5 works, but 10 seems to be an ideal value for the length of curves found in most games on
* a desktop screen. If you use very long curves (more than 400 pixels) you may need to increase
* this value further.
*
* @class Phaser.Hermite
* @constructor
* @param {number} p1x - The x coordinate of the start of the curve.
* @param {number} p1y - The y coordinate of the start of the curve.
* @param {number} p2x - The x coordinate of the end of the curve.
* @param {number} p2y - The y coordinate of the end of the curve.
* @param {number} v1x - The x component of the tangent vector for the start of the curve.
* @param {number} v1y - The y component of the tangent vector for the start of the curve.
* @param {number} v2x - The x component of the tangent vector for the end of the curve.
* @param {number} v2y - The y component of the tangent vector for the end of the curve.
* @param {number} [accuracy=10] The amount of points to pre-calculate on the curve.
*/
export default class Hermite {
    static GetAngle: typeof GetAngle;
    static GetAngleWithDistance: typeof GetAngleWithDistance;
    static GetEntryTangent: typeof GetEntryTangent;
    static GetPoint: typeof GetPoint;
    static GetPointWithDistance: typeof GetPointWithDistance;
    static GetX: typeof GetX;
    static GetY: typeof GetY;
    private _accuracy;
    private _p1x;
    private _p1y;
    private _p2x;
    private _p2y;
    private _v1x;
    private _v1y;
    private _v2x;
    private _v2y;
    private _points;
    private _temp1;
    private _temp2;
    private _ax;
    private _ay;
    private _bx;
    private _by;
    private length;
    constructor(p1x: any, p1y: any, p2x: any, p2y: any, v1x: any, v1y: any, v2x: any, v2y: any, accuracy?: number);
    /**
    * Performs the curve calculations.
    *
    * This is called automatically if you change any of the curves public properties, such as `Hermite.p1x` or `Hermite.v2y`.
    *
    * If you adjust any of the internal private values, then call this to update the points.
    *
    * @method Phaser.Hermite#recalculate
    * @return {Phaser.Hermite} This object.
    */
    recalculate(): this;
    getPoint(curve: any, t: any): any;
    /**
    * Calculate a number of points along the curve, based on `Hermite.accuracy`, and stores them in the private `_points` array.
    *
    * @method Phaser.Hermite#calculateEvenPoints
    * @return {number} The total length of the curve approximated as straight line distances between the points.
    */
    calculateEvenPoints(): number;
    accuracy: any;
    /**
    * @name Phaser.Hermite#p1x
    * @property {number} p1x - The x coordinate of the start of the curve. Setting this value will recalculate the curve.
    */
    p1x: any;
    /**
    * @name Phaser.Hermite#p1y
    * @property {number} p1y - The y coordinate of the start of the curve. Setting this value will recalculate the curve.
    */
    p1y: any;
    /**
    * @name Phaser.Hermite#p2x
    * @property {number} p2x - The x coordinate of the end of the curve. Setting this value will recalculate the curve.
    */
    p2x: any;
    /**
    * @name Phaser.Hermite#p2y
    * @property {number} p2y - The y coordinate of the end of the curve. Setting this value will recalculate the curve.
    */
    p2y: any;
    /**
    * @name Phaser.Hermite#v1x
    * @property {number} v1x - The x component of the tangent vector for the start of the curve. Setting this value will recalculate the curve.
    */
    v1x: any;
    /**
    * @name Phaser.Hermite#v1y
    * @property {number} v1y - The y component of the tangent vector for the start of the curve. Setting this value will recalculate the curve.
    */
    v1y: any;
    /**
    * @name Phaser.Hermite#v2x
    * @property {number} v2x - The x component of the tangent vector for the end of the curve. Setting this value will recalculate the curve.
    */
    v2x: any;
    /**
    * @name Phaser.Hermite#v2y
    * @property {number} v2y - The y component of the tangent vector for the end of the curve. Setting this value will recalculate the curve.
    */
    v2y: any;
}
