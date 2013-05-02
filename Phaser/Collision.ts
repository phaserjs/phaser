/// <reference path="Game.ts" />
/// <reference path="geom/Point.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Quad.ts" />
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

        /**
         * Collision constructor
         * @param game A reference to the current Game
         */
        constructor(game: Game) {

            this._game = game;

        }

        /**
         * Local private reference to Game
         */
        private _game: Game;

        /**
         * Flag used to allow GameObjects to collide on their left side
         * @type {number}
         */
        public static LEFT: number = 0x0001;

        /**
         * Flag used to allow GameObjects to collide on their right side
         * @type {number}
         */
        public static RIGHT: number = 0x0010;

        /**
         * Flag used to allow GameObjects to collide on their top side
         * @type {number}
         */
        public static UP: number = 0x0100;

        /**
         * Flag used to allow GameObjects to collide on their bottom side
         * @type {number}
         */
        public static DOWN: number = 0x1000;

        /**
         * Flag used with GameObjects to disable collision
         * @type {number}
         */
        public static NONE: number = 0;

        /**
         * Flag used to allow GameObjects to collide with a ceiling
         * @type {number}
         */
        public static CEILING: number = Collision.UP;

        /**
         * Flag used to allow GameObjects to collide with a floor
         * @type {number}
         */
        public static FLOOR: number = Collision.DOWN;

        /**
         * Flag used to allow GameObjects to collide with a wall (same as LEFT+RIGHT)
         * @type {number}
         */
        public static WALL: number = Collision.LEFT | Collision.RIGHT;

        /**
         * Flag used to allow GameObjects to collide on any face
         * @type {number}
         */
        public static ANY: number = Collision.LEFT | Collision.RIGHT | Collision.UP | Collision.DOWN;

        /**
         * The overlap bias is used when calculating hull overlap before separation - change it if you have especially small or large GameObjects
         * @type {number}
         */
        public static OVERLAP_BIAS: number = 4;

        /**
         * This holds the result of the tile separation check, true if the object was moved, otherwise false
         * @type {boolean}
         */
        public static TILE_OVERLAP: bool = false;

        /**
         * A temporary Quad used in the separation process to help avoid gc spikes
         * @type {Quad}
         */
        public static _tempBounds: Quad;

        /**
         * Checks for Line to Line intersection and returns an IntersectResult object containing the results of the intersection.
         * @param line1 The first Line object to check
         * @param line2 The second Line object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineToLine(line1: Line, line2: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denominator = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);

            if (denominator !== 0)
            {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
            }

            return output;
        }

        /**
         * Checks for Line to Line Segment intersection and returns an IntersectResult object containing the results of the intersection.
         * @param line The Line object to check
         * @param seg The Line segment object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineToLineSegment(line: Line, seg: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denominator = (line.x1 - line.x2) * (seg.y1 - seg.y2) - (line.y1 - line.y2) * (seg.x1 - seg.x2);

            if (denominator !== 0)
            {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (seg.x1 - seg.x2) - (line.x1 - line.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denominator;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (seg.y1 - seg.y2) - (line.y1 - line.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denominator;

                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);

                if ((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true)
                {
                    output.result = true;
                }

            }

            return output;

        }

        /**
         * Checks for Line to Raw Line Segment intersection and returns the result in the IntersectResult object.
         * @param line The Line object to check
         * @param x1 The start x coordinate of the raw segment
         * @param y1 The start y coordinate of the raw segment
         * @param x2 The end x coordinate of the raw segment
         * @param y2 The end y coordinate of the raw segment
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineToRawSegment(line: Line, x1: number, y1: number, x2: number, y2: number, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denominator = (line.x1 - line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 - x2);

            if (denominator !== 0)
            {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (x1 - x2) - (line.x1 - line.x2) * (x1 * y2 - y1 * x2)) / denominator;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 * y2 - y1 * x2)) / denominator;

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
         * Checks for Line to Ray intersection and returns the result in an IntersectResult object.
         * @param line1 The Line object to check
         * @param ray The Ray object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineToRay(line1: Line, ray: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            var denominator = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);

            if (denominator !== 0)
            {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
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
         * Check if the Line and Circle objects intersect
         * @param line The Line object to check
         * @param circle The Circle object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
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
         * @param line The Line object to check
         * @param rect The Rectangle object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineToRectangle(line: Line, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            //  Top of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);

            if (output.result === true)
            {
                return output;
            }

            //  Left of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.x, rect.y, rect.x, rect.bottom, output);

            if (output.result === true)
            {
                return output;
            }

            //  Bottom of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.x, rect.bottom, rect.right, rect.bottom, output);

            if (output.result === true)
            {
                return output;
            }

            //  Right of the Rectangle vs the Line
            Collision.lineToRawSegment(line, rect.right, rect.y, rect.right, rect.bottom, output);

            return output;

        }

        /**
         * Check if the two Line Segments intersect and returns the result in an IntersectResult object.
         * @param line1 The first Line Segment to check
         * @param line2 The second Line Segment to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineSegmentToLineSegment(line1: Line, line2: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            Collision.lineToLineSegment(line1, line2);

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
         * Check if the Line Segment intersects with the Ray and returns the result in an IntersectResult object.
         * @param line The Line Segment to check.
         * @param ray The Ray to check.
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineSegmentToRay(line: Line, ray: Line, output?: IntersectResult = new IntersectResult): IntersectResult {

            Collision.lineToRay(line, ray, output);

            if (output.result === true)
            {
                if (!(output.x >= Math.min(line.x1, line.x2) && output.x <= Math.max(line.x1, line.x2)
                    && output.y >= Math.min(line.y1, line.y2) && output.y <= Math.max(line.y1, line.y2)))
                {
                    output.result = false;
                }
            }

            return output;

        }

        /**
         * Check if the Line Segment intersects with the Circle and returns the result in an IntersectResult object.
         * @param seg The Line Segment to check.
         * @param circle The Circle to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
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
                    if (Collision.circleContainsPoint(circle, <Point> { x: seg.x1, y: seg.y1 }) || Collision.circleContainsPoint(circle, <Point> { x: seg.x2, y: seg.y2 }))
                    {
                        output.result = true;
                    }
                }

            }

            return output;
        }

        /**
         * Check if the Line Segment intersects with the Rectangle and returns the result in an IntersectResult object.
         * @param seg The Line Segment to check.
         * @param rect The Rectangle to check.
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static lineSegmentToRectangle(seg: Line, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            if (rect.contains(seg.x1, seg.y1) && rect.contains(seg.x2, seg.y2))
            {
                output.result = true;
            }
            else
            {
                //  Top of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.x, rect.y, rect.right, rect.bottom, output);

                if (output.result === true)
                {
                    return output;
                }

                //  Left of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.x, rect.y, rect.x, rect.bottom, output);

                if (output.result === true)
                {
                    return output;
                }

                //  Bottom of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.x, rect.bottom, rect.right, rect.bottom, output);

                if (output.result === true)
                {
                    return output;
                }

                //  Right of the Rectangle vs the Line
                Collision.lineToRawSegment(seg, rect.right, rect.y, rect.right, rect.bottom, output);

                return output;

            }

            return output;

        }

        /**
         * Check for Ray to Rectangle intersection and returns the result in an IntersectResult object.
         * @param ray The Ray to check.
         * @param rect The Rectangle to check.
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static rayToRectangle(ray: Line, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            //  Currently just finds first intersection - might not be closest to ray pt1
            Collision.lineToRectangle(ray, rect, output);

            return output;

        }


        /**
         * Check whether a Ray intersects a Line segment and returns the parametric value where the intersection occurs in an IntersectResult object.
         * @param rayX1
         * @param rayY1
         * @param rayX2
         * @param rayY2
         * @param lineX1
         * @param lineY1
         * @param lineX2
         * @param lineY2
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static rayToLineSegment(rayX1, rayY1, rayX2, rayY2, lineX1, lineY1, lineX2, lineY2, output?: IntersectResult = new IntersectResult): IntersectResult {

            var r:number;
            var s:number;
            var d:number;

            // Check lines are not parallel
            if ((rayY2 - rayY1) / (rayX2 - rayX1) != (lineY2 - lineY1) / (lineX2 - lineX1))
            {
                d = (((rayX2 - rayX1) * (lineY2 - lineY1)) - (rayY2 - rayY1) * (lineX2 - lineX1));

                if (d != 0)
                {
                    r = (((rayY1 - lineY1) * (lineX2 - lineX1)) - (rayX1 - lineX1) * (lineY2 - lineY1)) / d;
                    s = (((rayY1 - lineY1) * (rayX2 - rayX1)) - (rayX1 - lineX1) * (rayY2 - rayY1)) / d;

                    if (r >= 0)
                    {
                        if (s >= 0 && s <= 1)
                        {
                            output.result = true;
                            output.x = rayX1 + r * (rayX2 - rayX1);
                            output.y = rayY1 + r * (rayY2 - rayY1);
                        }
                    }
                }
            }

            return output;

        }

        /**
         * Determines whether the specified point is contained within the rectangular region defined by the Rectangle object and returns the result in an IntersectResult object.
         * @param point The Point or MicroPoint object to check, or any object with x and y properties.
         * @param rect The Rectangle object to check the point against
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static pointToRectangle(point, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            output.setTo(point.x, point.y);

            output.result = rect.containsPoint(point);

            return output;

        }

        /**
         * Check whether two axis aligned Rectangles intersect and returns the intersecting rectangle dimensions in an IntersectResult object if they do.
         * @param rect1 The first Rectangle object.
         * @param rect2 The second Rectangle object.
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
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

        /**
         * Checks if the Rectangle and Circle objects intersect and returns the result in an IntersectResult object.
         * @param rect The Rectangle object to check
         * @param circle The Circle object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static rectangleToCircle(rect: Rectangle, circle: Circle, output?: IntersectResult = new IntersectResult): IntersectResult {

            return Collision.circleToRectangle(circle, rect, output);

        }

        /**
         * Checks if the two Circle objects intersect and returns the result in an IntersectResult object.
         * @param circle1 The first Circle object to check
         * @param circle2 The second Circle object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static circleToCircle(circle1: Circle, circle2: Circle, output?: IntersectResult = new IntersectResult): IntersectResult {

            output.result = ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius)) >= Collision.distanceSquared(circle1.x, circle1.y, circle2.x, circle2.y);

            return output;

        }

        /**
         * Checks if the Circle object intersects with the Rectangle and returns the result in an IntersectResult object.
         * @param circle The Circle object to check
         * @param rect The Rectangle object to check
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static circleToRectangle(circle: Circle, rect: Rectangle, output?: IntersectResult = new IntersectResult): IntersectResult {

            var inflatedRect: Rectangle = rect.clone();

            inflatedRect.inflate(circle.radius, circle.radius);

            output.result = inflatedRect.contains(circle.x, circle.y);

            return output;

        }

        /**
         * Checks if the Point object is contained within the Circle and returns the result in an IntersectResult object.
         * @param circle The Circle object to check
         * @param point A Point or MicroPoint object to check, or any object with x and y properties
         * @param output An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static circleContainsPoint(circle: Circle, point, output?: IntersectResult = new IntersectResult): IntersectResult {

            output.result = circle.radius * circle.radius >= Collision.distanceSquared(circle.x, circle.y, point.x, point.y);

            return output;

        }

        /**
         * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
         * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
         * @param object1 The first GameObject or Group to check. If null the world.group is used.
         * @param object2 The second GameObject or Group to check.
         * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
         * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
         * @returns {boolean} true if the objects overlap, otherwise false.
         */
        public overlap(object1: Basic = null, object2: Basic = null, notifyCallback = null, processCallback = null): bool {

            if (object1 == null)
            {
                object1 = this._game.world.group;
            }

            if (object2 == object1)
            {
                object2 = null;
            }

            QuadTree.divisions = this._game.world.worldDivisions;

            var quadTree: QuadTree = new QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);

            quadTree.load(object1, object2, notifyCallback, processCallback);

            var result: bool = quadTree.execute();

            quadTree.destroy();

            quadTree = null;

            return result;

        }

        /**
         * The core Collision separation function used by Collision.overlap.
         * @param object1 The first GameObject to separate
         * @param object2 The second GameObject to separate
         * @returns {boolean} Returns true if the objects were separated, otherwise false.
         */
        public static separate(object1, object2): bool {

            var separatedX: bool = Collision.separateX(object1, object2);
            var separatedY: bool = Collision.separateY(object1, object2);

            return separatedX || separatedY;

        }

        /**
         * Collision resolution specifically for GameObjects vs. Tiles.
         * @param object The GameObject to separate
         * @param tile The Tile to separate
         * @returns {boolean} Whether the objects in fact touched and were separated
         */
        public static separateTile(object:GameObject, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool, collideUp: bool, collideDown: bool, separateX: bool, separateY: bool): bool {

            var separatedX: bool = Collision.separateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separateX);
            var separatedY: bool = Collision.separateTileY(object, x, y, width, height, mass, collideUp, collideDown, separateY);

            return separatedX || separatedY;

        }

        /**
         * Separates the two objects on their x axis
         * @param object The GameObject to separate
         * @param tile The Tile to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
         */
        public static separateTileX(object:GameObject, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool, separate: bool): bool {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the object delta
            var overlap: number = 0;
            var objDelta: number = object.x - object.last.x;

            if (objDelta != 0)
            {
                //  Check if the X hulls actually overlap
                var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                var objBounds: Quad = new Quad(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);

                if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                {
                    var maxOverlap: number = objDeltaAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (objDelta > 0)
                    {
                        overlap = object.x + object.width - x;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.RIGHT) || collideLeft == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.RIGHT;
                        }
                    }
                    else if (objDelta < 0)
                    {
                        overlap = object.x - width - x;

                        if ((-overlap > maxOverlap) || !(object.allowCollisions & Collision.LEFT) || collideRight == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.LEFT;
                        }

                    }

                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                if (separate == true)
                {
                    object.x = object.x - overlap;
                    object.velocity.x = -(object.velocity.x * object.elasticity);
                }

                Collision.TILE_OVERLAP = true;
                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Separates the two objects on their y axis
         * @param object The first GameObject to separate
         * @param tile The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
         */
        public static separateTileY(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideUp: bool, collideDown: bool, separate: bool): bool {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;
            var objDelta: number = object.y - object.last.y;

            if (objDelta != 0)
            {
                //  Check if the Y hulls actually overlap
                var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                var objBounds: Quad = new Quad(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);

                if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                {
                    var maxOverlap: number = objDeltaAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (objDelta > 0)
                    {
                        overlap = object.y + object.height - y;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.DOWN) || collideUp == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.DOWN;
                        }
                    }
                    else if (objDelta < 0)
                    {
                        overlap = object.y - height - y;

                        if ((-overlap > maxOverlap) || !(object.allowCollisions & Collision.UP) || collideDown == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.UP;
                        }
                    }
                }
            }

            // TODO - with super low velocities you get lots of stuttering, set some kind of base minimum here

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                if (separate == true)
                {
                    object.y = object.y - overlap;
                    object.velocity.y = -(object.velocity.y * object.elasticity);
                }

                Collision.TILE_OVERLAP = true;
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
         * Separates the two objects on their x axis
         * @param object1 The first GameObject to separate
         * @param object2 The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
         */
        public static separateX(object1, object2): bool {

            //  Can't separate two immovable objects
            if (object1.immovable && object2.immovable)
            {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;
            var obj1Delta: number = object1.x - object1.last.x;
            var obj2Delta: number = object2.x - object2.last.x;

            if (obj1Delta != obj2Delta)
            {
                //  Check if the X hulls actually overlap
                var obj1DeltaAbs: number = (obj1Delta > 0) ? obj1Delta : -obj1Delta;
                var obj2DeltaAbs: number = (obj2Delta > 0) ? obj2Delta : -obj2Delta;
                var obj1Bounds: Quad = new Quad(object1.x - ((obj1Delta > 0) ? obj1Delta : 0), object1.last.y, object1.width + ((obj1Delta > 0) ? obj1Delta : -obj1Delta), object1.height);
                var obj2Bounds: Quad = new Quad(object2.x - ((obj2Delta > 0) ? obj2Delta : 0), object2.last.y, object2.width + ((obj2Delta > 0) ? obj2Delta : -obj2Delta), object2.height);

                if ((obj1Bounds.x + obj1Bounds.width > obj2Bounds.x) && (obj1Bounds.x < obj2Bounds.x + obj2Bounds.width) && (obj1Bounds.y + obj1Bounds.height > obj2Bounds.y) && (obj1Bounds.y < obj2Bounds.y + obj2Bounds.height))
                {
                    var maxOverlap: number = obj1DeltaAbs + obj2DeltaAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (obj1Delta > obj2Delta)
                    {
                        overlap = object1.x + object1.width - object2.x;

                        if ((overlap > maxOverlap) || !(object1.allowCollisions & Collision.RIGHT) || !(object2.allowCollisions & Collision.LEFT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.touching |= Collision.RIGHT;
                            object2.touching |= Collision.LEFT;
                        }
                    }
                    else if (obj1Delta < obj2Delta)
                    {
                        overlap = object1.x - object2.width - object2.x;

                        if ((-overlap > maxOverlap) || !(object1.allowCollisions & Collision.LEFT) || !(object2.allowCollisions & Collision.RIGHT))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.touching |= Collision.LEFT;
                            object2.touching |= Collision.RIGHT;
                        }

                    }

                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                var obj1Velocity: number = object1.velocity.x;
                var obj2Velocity: number = object2.velocity.x;

                if (!object1.immovable && !object2.immovable)
                {
                    overlap *= 0.5;
                    object1.x = object1.x - overlap;
                    object2.x += overlap;

                    var obj1NewVelocity: number = Math.sqrt((obj2Velocity * obj2Velocity * object2.mass) / object1.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity: number = Math.sqrt((obj1Velocity * obj1Velocity * object1.mass) / object2.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average: number = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.velocity.x = average + obj1NewVelocity * object1.elasticity;
                    object2.velocity.x = average + obj2NewVelocity * object2.elasticity;
                }
                else if (!object1.immovable)
                {
                    object1.x = object1.x - overlap;
                    object1.velocity.x = obj2Velocity - obj1Velocity * object1.elasticity;
                }
                else if (!object2.immovable)
                {
                    object2.x += overlap;
                    object2.velocity.x = obj1Velocity - obj2Velocity * object2.elasticity;
                }

                return true;
            }
            else
            {
                return false;
            }

        }

        /**
         * Separates the two objects on their y axis
         * @param object1 The first GameObject to separate
         * @param object2 The second GameObject to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
         */
        public static separateY(object1, object2): bool {

            //  Can't separate two immovable objects
            if (object1.immovable && object2.immovable) {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;
            var obj1Delta: number = object1.y - object1.last.y;
            var obj2Delta: number = object2.y - object2.last.y;

            if (obj1Delta != obj2Delta)
            {
                //  Check if the Y hulls actually overlap
                var obj1DeltaAbs: number = (obj1Delta > 0) ? obj1Delta : -obj1Delta;
                var obj2DeltaAbs: number = (obj2Delta > 0) ? obj2Delta : -obj2Delta;
                var obj1Bounds: Quad = new Quad(object1.x, object1.y - ((obj1Delta > 0) ? obj1Delta : 0), object1.width, object1.height + obj1DeltaAbs);
                var obj2Bounds: Quad = new Quad(object2.x, object2.y - ((obj2Delta > 0) ? obj2Delta : 0), object2.width, object2.height + obj2DeltaAbs);

                if ((obj1Bounds.x + obj1Bounds.width > obj2Bounds.x) && (obj1Bounds.x < obj2Bounds.x + obj2Bounds.width) && (obj1Bounds.y + obj1Bounds.height > obj2Bounds.y) && (obj1Bounds.y < obj2Bounds.y + obj2Bounds.height))
                {
                    var maxOverlap: number = obj1DeltaAbs + obj2DeltaAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (obj1Delta > obj2Delta)
                    {
                        overlap = object1.y + object1.height - object2.y;

                        if ((overlap > maxOverlap) || !(object1.allowCollisions & Collision.DOWN) || !(object2.allowCollisions & Collision.UP))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.touching |= Collision.DOWN;
                            object2.touching |= Collision.UP;
                        }
                    }
                    else if (obj1Delta < obj2Delta)
                    {
                        overlap = object1.y - object2.height - object2.y;

                        if ((-overlap > maxOverlap) || !(object1.allowCollisions & Collision.UP) || !(object2.allowCollisions & Collision.DOWN))
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object1.touching |= Collision.UP;
                            object2.touching |= Collision.DOWN;
                        }
                    }
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (overlap != 0)
            {
                var obj1Velocity: number = object1.velocity.y;
                var obj2Velocity: number = object2.velocity.y;

                if (!object1.immovable && !object2.immovable)
                {
                    overlap *= 0.5;
                    object1.y = object1.y - overlap;
                    object2.y += overlap;

                    var obj1NewVelocity: number = Math.sqrt((obj2Velocity * obj2Velocity * object2.mass) / object1.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity: number = Math.sqrt((obj1Velocity * obj1Velocity * object1.mass) / object2.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average: number = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.velocity.y = average + obj1NewVelocity * object1.elasticity;
                    object2.velocity.y = average + obj2NewVelocity * object2.elasticity;
                }
                else if (!object1.immovable)
                {
                    object1.y = object1.y - overlap;
                    object1.velocity.y = obj2Velocity - obj1Velocity * object1.elasticity;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (object2.active && object2.moves && (obj1Delta > obj2Delta))
                    {
                        object1.x += object2.x - object2.last.x;
                    }
                }
                else if (!object2.immovable)
                {
                    object2.y += overlap;
                    object2.velocity.y = obj1Velocity - obj2Velocity * object2.elasticity;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (object1.active && object1.moves && (obj1Delta < obj2Delta))
                    {
                        object2.x += object1.x - object1.last.x;
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
         * Returns the distance between the two given coordinates.
         * @param x1 The X value of the first coordinate
         * @param y1 The Y value of the first coordinate
         * @param x2 The X value of the second coordinate
         * @param y2 The Y value of the second coordinate
         * @returns {number} The distance between the two coordinates
         */
        public static distance(x1: number, y1: number, x2: number, y2: number) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        }

        /**
         * Returns the distanced squared between the two given coordinates.
         * @param x1 The X value of the first coordinate
         * @param y1 The Y value of the first coordinate
         * @param x2 The X value of the second coordinate
         * @param y2 The Y value of the second coordinate
         * @returns {number} The distance between the two coordinates
         */
        public static distanceSquared(x1: number, y1: number, x2: number, y2: number) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        }

    }

}