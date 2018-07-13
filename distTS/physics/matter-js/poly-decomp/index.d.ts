/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Compute the intersection between two lines.
 * @static
 * @method lineInt
 * @param  {Array}  l1          Line vector 1
 * @param  {Array}  l2          Line vector 2
 * @param  {Number} precision   Precision to use when checking if the lines are parallel
 * @return {Array}              The intersection point.
 */
declare function lineInt(l1: any, l2: any, precision: any): number[];
/**
 * Checks if two line segments intersects.
 * @method segmentsIntersect
 * @param {Array} p1 The start vertex of the first line segment.
 * @param {Array} p2 The end vertex of the first line segment.
 * @param {Array} q1 The start vertex of the second line segment.
 * @param {Array} q2 The end vertex of the second line segment.
 * @return {Boolean} True if the two line segments intersect
 */
declare function lineSegmentsIntersect(p1: any, p2: any, q1: any, q2: any): boolean;
/**
 * Get the area of a triangle spanned by the three given points. Note that the area will be negative if the points are not given in counter-clockwise order.
 * @static
 * @method area
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @return {Number}
 */
declare function triangleArea(a: any, b: any, c: any): number;
declare function isLeft(a: any, b: any, c: any): boolean;
declare function isLeftOn(a: any, b: any, c: any): boolean;
declare function isRight(a: any, b: any, c: any): boolean;
declare function isRightOn(a: any, b: any, c: any): boolean;
declare var tmpPoint1: any[], tmpPoint2: any[];
/**
 * Check if three points are collinear
 * @method collinear
 * @param  {Array} a
 * @param  {Array} b
 * @param  {Array} c
 * @param  {Number} [thresholdAngle=0] Threshold angle to use when comparing the vectors. The function will return true if the angle between the resulting vectors is less than this value. Use zero for max precision.
 * @return {Boolean}
 */
declare function collinear(a: any, b: any, c: any, thresholdAngle: any): boolean;
declare function sqdist(a: any, b: any): number;
/**
 * Get a vertex at position i. It does not matter if i is out of bounds, this function will just cycle.
 * @method at
 * @param  {Number} i
 * @return {Array}
 */
declare function polygonAt(polygon: any, i: any): any;
/**
 * Clear the polygon data
 * @method clear
 * @return {Array}
 */
declare function polygonClear(polygon: any): void;
/**
 * Append points "from" to "to"-1 from an other polygon "poly" onto this one.
 * @method append
 * @param {Polygon} poly The polygon to get points from.
 * @param {Number}  from The vertex index in "poly".
 * @param {Number}  to The end vertex index in "poly". Note that this vertex is NOT included when appending.
 * @return {Array}
 */
declare function polygonAppend(polygon: any, poly: any, from: any, to: any): void;
/**
 * Make sure that the polygon vertices are ordered counter-clockwise.
 * @method makeCCW
 */
declare function polygonMakeCCW(polygon: any): void;
/**
 * Reverse the vertices in the polygon
 * @method reverse
 */
declare function polygonReverse(polygon: any): void;
/**
 * Check if a point in the polygon is a reflex point
 * @method isReflex
 * @param  {Number}  i
 * @return {Boolean}
 */
declare function polygonIsReflex(polygon: any, i: any): boolean;
declare var tmpLine1: any[], tmpLine2: any[];
/**
 * Check if two vertices in the polygon can see each other
 * @method canSee
 * @param  {Number} a Vertex index 1
 * @param  {Number} b Vertex index 2
 * @return {Boolean}
 */
declare function polygonCanSee(polygon: any, a: any, b: any): boolean;
/**
 * Copy the polygon from vertex i to vertex j.
 * @method copy
 * @param  {Number} i
 * @param  {Number} j
 * @param  {Polygon} [targetPoly]   Optional target polygon to save in.
 * @return {Polygon}                The resulting copy.
 */
declare function polygonCopy(polygon: any, i: any, j: any, targetPoly: any): any;
/**
 * Decomposes the polygon into convex pieces. Returns a list of edges [[p1,p2],[p2,p3],...] that cuts the polygon.
 * Note that this algorithm has complexity O(N^4) and will be very slow for polygons with many vertices.
 * @method getCutEdges
 * @return {Array}
 */
declare function polygonGetCutEdges(polygon: any): any[];
/**
 * Decomposes the polygon into one or more convex sub-Polygons.
 * @method decomp
 * @return {Array} An array or Polygon objects.
 */
declare function polygonDecomp(polygon: any): false | any[];
/**
 * Slices the polygon given one or more cut edges. If given one, this function will return two polygons (false on failure). If many, an array of polygons.
 * @method slice
 * @param {Array} cutEdges A list of edges, as returned by .getCutEdges()
 * @return {Array}
 */
declare function polygonSlice(polygon: any, cutEdges: any): false | any[];
/**
 * Checks that the line segments of this polygon do not intersect each other.
 * @method isSimple
 * @param  {Array} path An array of vertices e.g. [[0,0],[0,1],...]
 * @return {Boolean}
 * @todo Should it check all segments with all others?
 */
declare function polygonIsSimple(polygon: any): boolean;
declare function getIntersectionPoint(p1: any, p2: any, q1: any, q2: any, delta: any): number[];
/**
 * Quickly decompose the Polygon into convex sub-polygons.
 * @method quickDecomp
 * @param  {Array} result
 * @param  {Array} [reflexVertices]
 * @param  {Array} [steinerPoints]
 * @param  {Number} [delta]
 * @param  {Number} [maxlevel]
 * @param  {Number} [level]
 * @return {Array}
 */
declare function polygonQuickDecomp(polygon: any, result: any, reflexVertices: any, steinerPoints: any, delta: any, maxlevel: any, level: any): any;
/**
 * Remove collinear points in the polygon.
 * @method removeCollinearPoints
 * @param  {Number} [precision] The threshold angle to use when determining whether two edges are collinear. Use zero for finest precision.
 * @return {Number}           The number of points removed
 */
declare function polygonRemoveCollinearPoints(polygon: any, precision: any): number;
/**
 * Check if two scalars are equal
 * @static
 * @method eq
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} [precision]
 * @return {Boolean}
 */
declare function scalar_eq(a: any, b: any, precision: any): boolean;
