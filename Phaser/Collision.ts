/// <reference path="Game.ts" />
/// <reference path="geom/Point.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Circle.ts" />
/// <reference path="geom/Line.ts" />
/// <reference path="geom/IntersectResult.ts" />
/// <reference path="system/QuadTree.ts" />

/**
* Phaser - Collision
*
* A set of extremely useful collision and geometry intersection functions.
*/

module Phaser {

    export class Collision {

        constructor(game: Game) {

            this._game = game;

        }

        private _game: Game;

        public static LEFT: number = 0x0001;
        public static RIGHT: number = 0x0010;
        public static UP: number = 0x0100;
        public static DOWN: number = 0x1000;
        public static NONE: number = 0;
        public static CEILING: number = Collision.UP;
        public static FLOOR: number = Collision.DOWN;
        public static WALL: number = Collision.LEFT | Collision.RIGHT;
        public static ANY: number = Collision.LEFT | Collision.RIGHT | Collision.UP | Collision.DOWN;
        public static OVERLAP_BIAS: number = 4;

        /**
	     * -------------------------------------------------------------------------------------------
	     * Lines
	     * -------------------------------------------------------------------------------------------
	     **/

        /**
	     * Check if the two given Line objects intersect
	     * @method lineToLine
	     * @param {Phaser.Line} The first line object to check
	     * @param {Phaser.Line} The second line object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineToLine(line1: Line, line2: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denom = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);

            if (denom !== 0)
            {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
            }

            return output;
        }

        /**
	     * Check if the Line and Line Segment intersects
	     * @method lineToLineSegment
	     * @param {Phaser.Line} The line object to check
	     * @param {Phaser.Line} The line segment object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineToLineSegment(line1: Line, seg: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denom = (line1.x1 - line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 - seg.x2);

            if (denom !== 0)
            {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.x1 - seg.x2) - (line1.x1 - line1.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;

                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);

                //if (!(output.x <= maxX && output.x >= minX) || !(output.y <= maxY && output.y >= minY))
                if ((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true)
                {
                    output.result = true;
                }

            }

            return output;

        }

        /**
	     * Check if the Line and Line Segment intersects
	     * @method lineToLineSegment
	     * @param {Phaser.Line} The line object to check
	     * @param {number} The x1 value
	     * @param {number} The y1 value
	     * @param {number} The x2 value
	     * @param {number} The y2 value
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineToRawSegment(line: Line, x1: number, y1: number, x2: number, y2: number, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denom = (line.x1 - line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 - x2);

            if (denom !== 0)
            {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (x1 - x2) - (line.x1 - line.x2) * (x1 * y2 - y1 * x2)) / denom;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 * y2 - y1 * x2)) / denom;

                var maxX = Math.max(x1, x2);
                var minX = Math.min(x1, x2);
                var maxY = Math.max(y1, y2);
                var minY = Math.min(y1, y2);

                if ((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true)
                {
                    output.result = true;
                }

            }

            return output;

        }

        /**
	     * Check if the Line and Ray intersects
	     * @method lineToRay
	     * @param {Phaser.Line} The Line object to check
	     * @param {Phaser.Line} The Ray object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineToRay(line1: Line, ray: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denom = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);

            if (denom !== 0)
            {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.result = true; // true unless either of the 2 following conditions are met

                if (!(ray.x1 >= ray.x2) && output.x < ray.x1)
                {
                    output.result = false;
                }

                if (!(ray.y1 >= ray.y2) && output.y < ray.y1)
                {
                    output.result = false;
                }
            }

            return output;

        }

        /**
	     * Check if the Line and Circle intersects
	     * @method lineToCircle
	     * @param {Phaser.Line} The Line object to check
	     * @param {Phaser.Circle} The Circle object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
	     **/
        public static lineToCircle(line: Line, circle: Circle, output?: IntersectResult = new IntersectResult): IntersectResult {

            //  Get a perpendicular line running to the center of the circle
            if (line.perp(circle.x, circle.y).length <= circle.radius)
            {
                output.result = true;
            }

            return output;

        }

        /**
	     * Check if the Line intersects each side of the Rectangle
	     * @method lineToRectangle
	     * @param {Phaser.Line} The Line object to check
	     * @param {Phaser.Rectangle} The Rectangle object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
	     **/
        public static lineToRectangle(line: Line, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            //  Top of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);

            if (output.result === true)
            {
                return output;
            }

            //  Left of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.x, rect.y, rect.x, rect.bottom, output);

            if (output.result === true)
            {
                return output;
            }

            //  Bottom of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.x, rect.bottom, rect.right, rect.bottom, output);

            if (output.result === true)
            {
                return output;
            }

            //  Right of the Rectangle vs the Line
            this.lineToRawSegment(line, rect.right, rect.y, rect.right, rect.bottom, output);

            return output;

        }

        /**
	     * -------------------------------------------------------------------------------------------
	     * Line Segment
	     * -------------------------------------------------------------------------------------------
	     **/

        /**
	     * Check if Line1 intersects with Line2
	     * @method lineSegmentToLineSegment
	     * @param {Phaser.Line} The first line object to check
	     * @param {Phaser.Line} The second line object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineSegmentToLineSegment(line1: Line, line2: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            this.lineToLineSegment(line1, line2, output);

            if (output.result === true)
            {
                if (!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2)
                    && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2)))
                {
                    output.result = false;
                }
            }

            return output;
        }

        /**
	     * Check if the Line Segment intersects with the Ray
	     * @method lineSegmentToRay
	     * @param {Phaser.Line} The Line object to check
	     * @param {Phaser.Line} The Line Ray object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineSegmentToRay(line1: Line, ray: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            this.lineToRay(line1, ray, output);

            if (output.result === true)
            {
                if (!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2)
                    && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2)))
                {
                    output.result = false;
                }
            }

            return output;

        }

        /**
	     * Check if the Line Segment intersects with the Circle
	     * @method lineSegmentToCircle
	     * @param {Phaser.Line} The Line object to check
	     * @param {Phaser.Circle} The Circle object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineSegmentToCircle(seg: Line, circle: Circle, output?: IntersectResult = new IntersectResult): IntersectResult {

            var perp = seg.perp(circle.x, circle.y);

            if (perp.length <= circle.radius)
            {
                //  Line intersects circle - check if segment does
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);

                if ((perp.x2 <= maxX && perp.x2 >= minX) && (perp.y2 <= maxY && perp.y2 >= minY))
                {
                    output.result = true;
                }
                else
                {
                    //  Worst case - segment doesn't traverse center, so no perpendicular connection.
                    if (this.circleContainsPoint(circle, <Point> { x: seg.x1, y: seg.y1 }) || this.circleContainsPoint(circle, <Point> { x: seg.x2, y: seg.y2 }))
                    {
                        output.result = true;
                    }
                }

            }

            return output;
        }

        /**
	     * Check if the Line Segment intersects with the Rectangle
	     * @method lineSegmentToCircle
	     * @param {Phaser.Line} The Line object to check
	     * @param {Phaser.Circle} The Circle object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y
	     **/
        public static lineSegmentToRectangle(seg: Line, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            if (rect.contains(seg.x1, seg.y1) && rect.contains(seg.x2, seg.y2))
            {
                output.result = true;
            }
            else
            {
                //  Top of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.x, rect.y, rect.right, rect.bottom, output);

                if (output.result === true)
                {
                    return output;
                }

                //  Left of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.x, rect.y, rect.x, rect.bottom, output);

                if (output.result === true)
                {
                    return output;
                }

                //  Bottom of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.x, rect.bottom, rect.right, rect.bottom, output);

                if (output.result === true)
                {
                    return output;
                }

                //  Right of the Rectangle vs the Line
                this.lineToRawSegment(seg, rect.right, rect.y, rect.right, rect.bottom, output);

                return output;

            }

            return output;

        }

        /**
	     * -------------------------------------------------------------------------------------------
	     * Ray
	     * -------------------------------------------------------------------------------------------
	     **/

        /**
	     * Check if the two given Circle objects intersect
	     * @method circleToCircle
	     * @param {Phaser.Circle} The first circle object to check
	     * @param {Phaser.Circle} The second circle object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
	     **/
        public static rayToRectangle(ray: Line, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            //  Currently just finds first intersection - might not be closest to ray pt1
            this.lineToRectangle(ray, rect, output);

            return output;

        }

        /**
         * Check whether a ray intersects a line segment, returns the parametric value where the intersection occurs.
         * @method rayToLineSegment
         * @static
         * @param {Number} rayx1. The origin x of the ray.
         * @param {Number} rayy1. The origin y of the ray.
         * @param {Number} rayx2. The direction x of the ray. 
         * @param {Number} rayy2. The direction y of the ray.
         * @param {Number} linex1. The x of the first point of the line segment.
         * @param {Number} liney1. The y of the first point of the line segment.
         * @param {Number} linex2. The x of the second point of the line segment.
         * @param {Number} liney2. The y of the second point of the line segment.
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection stored in x
         **/
        public static rayToLineSegment(rayx1, rayy1, rayx2, rayy2, linex1, liney1, linex2, liney2, output?: IntersectResult = new IntersectResult): IntersectResult {

            var r, s, d;

            // Check lines are not parallel
            if ((rayy2 - rayy1) / (rayx2 - rayx1) != (liney2 - liney1) / (linex2 - linex1))
            {
                d = (((rayx2 - rayx1) * (liney2 - liney1)) - (rayy2 - rayy1) * (linex2 - linex1));

                if (d != 0)
                {
                    r = (((rayy1 - liney1) * (linex2 - linex1)) - (rayx1 - linex1) * (liney2 - liney1)) / d;
                    s = (((rayy1 - liney1) * (rayx2 - rayx1)) - (rayx1 - linex1) * (rayy2 - rayy1)) / d;

                    if (r >= 0)
                    {
                        if (s >= 0 && s <= 1)
                        {
                            output.result = true;
                            output.x = rayx1 + r * (rayx2 - rayx1), rayy1 + r * (rayy2 - rayy1);
                        }
                    }
                }
            }

            return output;

        }

        /**
	     * -------------------------------------------------------------------------------------------
	     * Rectangles
	     * -------------------------------------------------------------------------------------------
	     **/

        /**
         * Determines whether the specified point is contained within the rectangular region defined by the Rectangle object.
         * @method pointToRectangle
         * @param {Point} point The point object being checked.
         * @param {Rectangle} rect The rectangle object being checked.
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y/result
         **/
        public static pointToRectangle(point: Point, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            output.setTo(point.x, point.y);

            output.result = rect.containsPoint(point);

            return output;

        }

        /**
	     * Check whether two axis aligned rectangles intersect. Return the intersecting rectangle dimensions if they do.
	     * @method rectangleToRectangle
	     * @param {Phaser.Rectangle} The first Rectangle object
	     * @param {Phaser.Rectangle} The second Rectangle object
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection in x/y/width/height
	     **/
        public static rectangleToRectangle(rect1: Rectangle, rect2: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            var leftX = Math.max(rect1.x, rect2.x);
            var rightX = Math.min(rect1.right, rect2.right);
            var topY = Math.max(rect1.y, rect2.y);
            var bottomY = Math.min(rect1.bottom, rect2.bottom);

            output.setTo(leftX, topY, rightX - leftX, bottomY - topY, rightX - leftX, bottomY - topY);

            var cx = output.x + output.width * .5;
            var cy = output.y + output.height * .5;

            if ((cx > rect1.x && cx < rect1.right) && (cy > rect1.y && cy < rect1.bottom))
            {
                output.result = true;
            }

            return output;

        }

        public static rectangleToCircle(rect: Rectangle, circle: Circle, output?: IntersectResult = new IntersectResult): IntersectResult {

            return this.circleToRectangle(circle, rect, output);

        }

        /**
	     * -------------------------------------------------------------------------------------------
	     * Circle
	     * -------------------------------------------------------------------------------------------
	     **/

        /**
	     * Check if the two given Circle objects intersect
	     * @method circleToCircle
	     * @param {Phaser.Circle} The first circle object to check
	     * @param {Phaser.Circle} The second circle object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
	     **/
        public static circleToCircle(circle1: Circle, circle2: Circle, output?: IntersectResult = new IntersectResult): IntersectResult {

            output.result = ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius)) >= this.distanceSquared(circle1.x, circle1.y, circle2.x, circle2.y);

            return output;

        }

        /**
	     * Check if the given Rectangle intersects with the given Circle
	     * @method circleToRectangle
	     * @param {Phaser.Circle} The circle object to check
	     * @param {Phaser.Rectangle} The Rectangle object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
	     **/
        public static circleToRectangle(circle: Circle, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            var inflatedRect: Rectangle = rect.clone();

            inflatedRect.inflate(circle.radius, circle.radius);

            output.result = inflatedRect.contains(circle.x, circle.y);

            return output;

        }

        /**
	     * Check if the given Point is found within the given Circle
	     * @method circleContainsPoint
	     * @param {Phaser.Circle} The circle object to check
	     * @param {Phaser.Point} The point object to check
	     * @param {Phaser.IntersectResult} An optional IntersectResult object to store the intersection values in (one is created if none given)
	     * @return {Phaser.IntersectResult} An IntersectResult object containing the results of this intersection
	     **/
        public static circleContainsPoint(circle: Circle, point: Point, output?: IntersectResult = new IntersectResult): IntersectResult {

            output.result = circle.radius * circle.radius >= this.distanceSquared(circle.x, circle.y, point.x, point.y);

            return output;

        }

        /**
	     * -------------------------------------------------------------------------------------------
	     * Game Object Collision
	     * -------------------------------------------------------------------------------------------
	     **/

        /**
        * Call this function to see if one <code>GameObject</code> overlaps another.
        * Can be called with one object and one group, or two groups, or two objects,
        * whatever floats your boat! For maximum performance try bundling a lot of objects
        * together using a <code>Group</code> (or even bundling groups together!).
        * 
        * <p>NOTE: does NOT take objects' scrollfactor into account, all overlaps are checked in world space.</p>
        * 
        * @param	ObjectOrGroup1	The first object or group you want to check.
        * @param	ObjectOrGroup2	The second object or group you want to check.  If it is the same as the first it knows to just do a comparison within that group.
        * @param	NotifyCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.
        * @param	ProcessCallback	A function with two <code>GameObject</code> parameters - e.g. <code>myOverlapFunction(Object1:GameObject,Object2:GameObject)</code> - that is called if those two objects overlap.  If a ProcessCallback is provided, then NotifyCallback will only be called if ProcessCallback returns true for those objects!
        * 
        * @return	Whether any overlaps were detected.
        */
        public overlap(ObjectOrGroup1: Basic = null, ObjectOrGroup2: Basic = null, NotifyCallback = null, ProcessCallback = null): bool {

            if (ObjectOrGroup1 == null)
            {
                ObjectOrGroup1 = this._game.world.group;
            }

            if (ObjectOrGroup2 == ObjectOrGroup1)
            {
                ObjectOrGroup2 = null;
            }

            QuadTree.divisions = this._game.world.worldDivisions;

            var quadTree: QuadTree = new QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);

            quadTree.load(ObjectOrGroup1, ObjectOrGroup2, NotifyCallback, ProcessCallback);

            var result: bool = quadTree.execute();

            quadTree.destroy();

            quadTree = null;

            return result;

        }

        /**
         * The main collision resolution.
         * 
         * @param	Object1 	Any <code>Sprite</code>.
         * @param	Object2		Any other <code>Sprite</code>.
         * 
         * @return	Whether the objects in fact touched and were separated.
         */
        public static separate(Object1, Object2): bool {

            var separatedX: bool = Collision.separateX(Object1, Object2);
            var separatedY: bool = Collision.separateY(Object1, Object2);

            return separatedX || separatedY;

        }

        /**
         * Collision resolution specifically for GameObjects vs. Tiles.
         * 
         * @param	Object1 	Any <code>GameObject</code>.
         * @param	Object2		Any <code>Tile</code>.
         * 
         * @return	Whether the objects in fact touched and were separated.
         */
        public static separateTile(object:GameObject, tile:Tile): bool {

            //var separatedX: bool = Collision.separateTileX(object, tile);
            //var separatedY: bool = Collision.separateTileY(object, tile);

            //return separatedX || separatedY;

            return false;

        }

        /*
        public static separateTileX(object:GameObject, tile:Tile): bool {

            //First, get the two object deltas
            var overlap: number = 0;
            var obj1delta: number = object.x - object.last.x;
            var obj2delta: number = tile.x;

            if (obj1delta != obj2delta)
            {
                //Check if the X hulls actually overlap
                var obj1deltaAbs: number = (obj1delta > 0) ? obj1delta : -obj1delta;
                var obj2deltaAbs: number = (obj2delta > 0) ? obj2delta : -obj2delta;
                //var obj1rect: Rectangle = new Rectangle(Object1.x - ((obj1delta > 0) ? obj1delta : 0), Object1.last.y, Object1.width + ((obj1delta > 0) ? obj1delta : -obj1delta), Object1.height);
                //var obj2rect: Rectangle = new Rectangle(Object2.x - ((obj2delta > 0) ? obj2delta : 0), Object2.last.y, Object2.width + ((obj2delta > 0) ? obj2delta : -obj2delta), Object2.height);

                //if ((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height))
                //{
                    var maxOverlap: number = obj1deltaAbs + obj2deltaAbs + Collision.OVERLAP_BIAS;

                    //If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (obj1delta > obj2delta)
                    {
                        overlap = Object1.x + Object1.width - Object2.x;

                        if ((overlap > maxOverlap) || !(Object1.allowCollisions & Collision.RIGHT) || !(Object2.allowCollisions & Collision.LEFT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            Object1.touching |= Collision.RIGHT;
                            Object2.touching |= Collision.LEFT;
                        }
                    }
                    else if (obj1delta < obj2delta)
                        {
                        overlap = Object1.x - Object2.width - Object2.x;

                        if ((-overlap > maxOverlap) || !(Object1.allowCollisions & Collision.LEFT) || !(Object2.allowCollisions & Collision.RIGHT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            Object1.touching |= Collision.LEFT;
                            Object2.touching |= Collision.RIGHT;
                        }

                    }

                }
            }

            //Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                var obj1v: number = Object1.velocity.x;
                var obj2v: number = Object2.velocity.x;

                if (!obj1immovable && !obj2immovable)
                {
                    overlap *= 0.5;
                    Object1.x = Object1.x - overlap;
                    Object2.x += overlap;

                    var obj1velocity: number = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                    var obj2velocity: number = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                    var average: number = (obj1velocity + obj2velocity) * 0.5;
                    obj1velocity -= average;
                    obj2velocity -= average;
                    Object1.velocity.x = average + obj1velocity * Object1.elasticity;
                    Object2.velocity.x = average + obj2velocity * Object2.elasticity;
                }
                else if (!obj1immovable)
                    {
                    Object1.x = Object1.x - overlap;
                    Object1.velocity.x = obj2v - obj1v * Object1.elasticity;
                }
                else if (!obj2immovable)
                    {
                    Object2.x += overlap;
                    Object2.velocity.x = obj1v - obj2v * Object2.elasticity;
                }

                return true;
            }
            else
            {
                return false;
            }

        }
        */

        /**
         * The X-axis component of the object separation process.
         * 
         * @param	Object1 	Any <code>Sprite</code>.
         * @param	Object2		Any other <code>Sprite</code>.
         * 
         * @return	Whether the objects in fact touched and were separated along the X axis.
         */
        public static separateX(Object1, Object2): bool {

            //can't separate two immovable objects
            var obj1immovable: bool = Object1.immovable;
            var obj2immovable: bool = Object2.immovable;

            if (obj1immovable && obj2immovable)
            {
                return false;
            }

            //First, get the two object deltas
            var overlap: number = 0;
            var obj1delta: number = Object1.x - Object1.last.x;
            var obj2delta: number = Object2.x - Object2.last.x;

            if (obj1delta != obj2delta)
            {
                //Check if the X hulls actually overlap
                var obj1deltaAbs: number = (obj1delta > 0) ? obj1delta : -obj1delta;
                var obj2deltaAbs: number = (obj2delta > 0) ? obj2delta : -obj2delta;
                var obj1rect: Rectangle = new Rectangle(Object1.x - ((obj1delta > 0) ? obj1delta : 0), Object1.last.y, Object1.width + ((obj1delta > 0) ? obj1delta : -obj1delta), Object1.height);
                var obj2rect: Rectangle = new Rectangle(Object2.x - ((obj2delta > 0) ? obj2delta : 0), Object2.last.y, Object2.width + ((obj2delta > 0) ? obj2delta : -obj2delta), Object2.height);

                if ((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height))
                {
                    var maxOverlap: number = obj1deltaAbs + obj2deltaAbs + Collision.OVERLAP_BIAS;

                    //If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (obj1delta > obj2delta)
                    {
                        overlap = Object1.x + Object1.width - Object2.x;

                        if ((overlap > maxOverlap) || !(Object1.allowCollisions & Collision.RIGHT) || !(Object2.allowCollisions & Collision.LEFT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            Object1.touching |= Collision.RIGHT;
                            Object2.touching |= Collision.LEFT;
                        }
                    }
                    else if (obj1delta < obj2delta)
                        {
                        overlap = Object1.x - Object2.width - Object2.x;

                        if ((-overlap > maxOverlap) || !(Object1.allowCollisions & Collision.LEFT) || !(Object2.allowCollisions & Collision.RIGHT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            Object1.touching |= Collision.LEFT;
                            Object2.touching |= Collision.RIGHT;
                        }

                    }

                }
            }

            //Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                var obj1v: number = Object1.velocity.x;
                var obj2v: number = Object2.velocity.x;

                if (!obj1immovable && !obj2immovable)
                {
                    overlap *= 0.5;
                    Object1.x = Object1.x - overlap;
                    Object2.x += overlap;

                    var obj1velocity: number = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                    var obj2velocity: number = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                    var average: number = (obj1velocity + obj2velocity) * 0.5;
                    obj1velocity -= average;
                    obj2velocity -= average;
                    Object1.velocity.x = average + obj1velocity * Object1.elasticity;
                    Object2.velocity.x = average + obj2velocity * Object2.elasticity;
                }
                else if (!obj1immovable)
                    {
                    Object1.x = Object1.x - overlap;
                    Object1.velocity.x = obj2v - obj1v * Object1.elasticity;
                }
                else if (!obj2immovable)
                    {
                    Object2.x += overlap;
                    Object2.velocity.x = obj1v - obj2v * Object2.elasticity;
                }

                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * The Y-axis component of the object separation process.
         * 
         * @param	Object1 	Any <code>Sprite</code>.
         * @param	Object2		Any other <code>Sprite</code>.
         * 
         * @return	Whether the objects in fact touched and were separated along the Y axis.
         */
        public static separateY(Object1, Object2): bool {

            //can't separate two immovable objects

            var obj1immovable: bool = Object1.immovable;
            var obj2immovable: bool = Object2.immovable;

            if (obj1immovable && obj2immovable)
                return false;

            //If one of the objects is a tilemap, just pass it off.
            /*
            if (typeof Object1 === 'Tilemap')
            {
                return Object1.overlapsWithCallback(Object2, separateY);
            }
    
            if (typeof Object2 === 'Tilemap')
            {
                return Object2.overlapsWithCallback(Object1, separateY, true);
            }
            */

            //First, get the two object deltas
            var overlap: number = 0;
            var obj1delta: number = Object1.y - Object1.last.y;
            var obj2delta: number = Object2.y - Object2.last.y;

            if (obj1delta != obj2delta)
            {
                //Check if the Y hulls actually overlap
                var obj1deltaAbs: number = (obj1delta > 0) ? obj1delta : -obj1delta;
                var obj2deltaAbs: number = (obj2delta > 0) ? obj2delta : -obj2delta;
                var obj1rect: Rectangle = new Rectangle(Object1.x, Object1.y - ((obj1delta > 0) ? obj1delta : 0), Object1.width, Object1.height + obj1deltaAbs);
                var obj2rect: Rectangle = new Rectangle(Object2.x, Object2.y - ((obj2delta > 0) ? obj2delta : 0), Object2.width, Object2.height + obj2deltaAbs);

                if ((obj1rect.x + obj1rect.width > obj2rect.x) && (obj1rect.x < obj2rect.x + obj2rect.width) && (obj1rect.y + obj1rect.height > obj2rect.y) && (obj1rect.y < obj2rect.y + obj2rect.height))
                {
                    var maxOverlap: number = obj1deltaAbs + obj2deltaAbs + Collision.OVERLAP_BIAS;

                    //If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (obj1delta > obj2delta)
                    {
                        overlap = Object1.y + Object1.height - Object2.y;

                        if ((overlap > maxOverlap) || !(Object1.allowCollisions & Collision.DOWN) || !(Object2.allowCollisions & Collision.UP))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            Object1.touching |= Collision.DOWN;
                            Object2.touching |= Collision.UP;
                        }
                    }
                    else if (obj1delta < obj2delta)
                        {
                        overlap = Object1.y - Object2.height - Object2.y;

                        if ((-overlap > maxOverlap) || !(Object1.allowCollisions & Collision.UP) || !(Object2.allowCollisions & Collision.DOWN))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            Object1.touching |= Collision.UP;
                            Object2.touching |= Collision.DOWN;
                        }
                    }
                }
            }

            //Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                var obj1v: number = Object1.velocity.y;
                var obj2v: number = Object2.velocity.y;

                if (!obj1immovable && !obj2immovable)
                {
                    overlap *= 0.5;
                    Object1.y = Object1.y - overlap;
                    Object2.y += overlap;

                    var obj1velocity: number = Math.sqrt((obj2v * obj2v * Object2.mass) / Object1.mass) * ((obj2v > 0) ? 1 : -1);
                    var obj2velocity: number = Math.sqrt((obj1v * obj1v * Object1.mass) / Object2.mass) * ((obj1v > 0) ? 1 : -1);
                    var average: number = (obj1velocity + obj2velocity) * 0.5;
                    obj1velocity -= average;
                    obj2velocity -= average;
                    Object1.velocity.y = average + obj1velocity * Object1.elasticity;
                    Object2.velocity.y = average + obj2velocity * Object2.elasticity;
                }
                else if (!obj1immovable)
                    {
                    Object1.y = Object1.y - overlap;
                    Object1.velocity.y = obj2v - obj1v * Object1.elasticity;
                    //This is special case code that handles cases like horizontal moving platforms you can ride
                    if (Object2.active && Object2.moves && (obj1delta > obj2delta))
                    {
                        Object1.x += Object2.x - Object2.last.x;
                    }
                }
                else if (!obj2immovable)
                    {
                    Object2.y += overlap;
                    Object2.velocity.y = obj1v - obj2v * Object2.elasticity;
                    //This is special case code that handles cases like horizontal moving platforms you can ride
                    if (Object1.active && Object1.moves && (obj1delta < obj2delta))
                    {
                        Object2.x += Object1.x - Object1.last.x;
                    }
                }

                return true;
            }
            else
            {
                return false;
            }
        }


        /**
	     * -------------------------------------------------------------------------------------------
	     * Distance
	     * -------------------------------------------------------------------------------------------
	     **/

        public static distance(x1: number, y1: number, x2: number, y2: number) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        }

        public static distanceSquared(x1: number, y1: number, x2: number, y2: number) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        }


    }

}