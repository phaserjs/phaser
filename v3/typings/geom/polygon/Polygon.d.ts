import Clone from './Clone';
import Contains from './Contains';
import ContainsPoint from './ContainsPoint';
import GetAABB from './GetAABB';
import GetNumberArray from './GetNumberArray';
import Reverse from './Reverse';
export default class Polygon {
    static Clone: typeof Clone;
    static Contains: typeof Contains;
    static ContainsPoint: typeof ContainsPoint;
    static GetAABB: typeof GetAABB;
    static GetNumberArray: typeof GetNumberArray;
    static Reverse: typeof Reverse;
    area: any;
    points: any;
    constructor(points: any);
    /**
     * Sets this Polygon to the given points.
     *
     * The points can be set from a variety of formats:
     *
     * - An array of Point objects: `[new Phaser.Point(x1, y1), ...]`
     * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
     * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
     * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
     *
     * `setTo` may also be called without any arguments to remove all points.
     *
     * @method Phaser.Polygon#setTo
     * @param {Phaser.Point[]|number[]|...Phaser.Point|...number} points - The points to set.
     * @return {Phaser.Polygon} This Polygon object
     */
    setTo(points: any): this;
    /**
     * Calculates the area of the Polygon. This is available in the property Polygon.area
     *
     * @method Phaser.Polygon#calculateArea
     * @private
     * @param {number} y0 - The lowest boundary
     * @return {number} The area of the Polygon.
     */
    calculateArea(y0: any): any;
}
