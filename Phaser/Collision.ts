/// <reference path="Game.ts" />
/// <reference path="geom/Point.ts" />
/// <reference path="geom/Rectangle.ts" />
/// <reference path="geom/Quad.ts" />
/// <reference path="geom/Circle.ts" />
/// <reference path="geom/Line.ts" />
/// <reference path="geom/IntersectResult.ts" />
/// <reference path="geom/Response.ts" />
/// <reference path="geom/Vector2.ts" />
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

            Collision.T_VECTORS = [];

            for (var i = 0; i < 10; i++)
            {
                Collision.T_VECTORS.push(new Vector2);
            }

            Collision.T_ARRAYS = [];

            for (var i = 0; i < 5; i++)
            {
                Collision.T_ARRAYS.push([]);
            }

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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
         * @returns {IntersectResult=} An IntersectResult object containing the results of the intersection
         */
        public static rectangleToCircle(rect: Rectangle, circle: Circle, output?: IntersectResult = new IntersectResult): IntersectResult {

            return Collision.circleToRectangle(circle, rect, output);

        }

        /**
         * Checks if the two Circle objects intersect and returns the result in an IntersectResult object.
         * @param circle1 The first Circle object to check
         * @param circle2 The second Circle object to check
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param [output] An optional IntersectResult object to store the intersection values in. One is created if none given.
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
         * @param context The context in which the callbacks will be called
         * @returns {boolean} true if the objects overlap, otherwise false.
         */
        public overlap(object1: Basic = null, object2: Basic = null, notifyCallback = null, processCallback = null, context = null): bool {

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

            quadTree.load(object1, object2, notifyCallback, processCallback, context);

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

            object1.collisionMask.update();
            object2.collisionMask.update();

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

            object.collisionMask.update();

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
            //var objDelta: number = object.collisionMask.deltaX;

            if (objDelta != 0)
            {
                //  Check if the X hulls actually overlap
                var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objDeltaAbs: number = object.collisionMask.deltaXAbs;
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
                    //console.log('
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
         * @param object The GameObject to separate
         * @param tile The Tile to separate
         * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
         */
        public static NEWseparateTileX(object:GameObject, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool, separate: bool): bool {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the object delta
            var overlap: number = 0;

            if (object.collisionMask.deltaX != 0)
            {
                //  Check if the X hulls actually overlap
                //var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objBounds: Quad = new Quad(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);

                //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                if (object.collisionMask.intersectsRaw(x, x + width, y, y + height))
                {
                    var maxOverlap: number = object.collisionMask.deltaXAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object.collisionMask.deltaX > 0)
                    {
                        //overlap = object.x + object.width - x;
                        overlap = object.collisionMask.right - x;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.RIGHT) || collideLeft == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.RIGHT;
                        }
                    }
                    else if (object.collisionMask.deltaX < 0)
                    {
                        //overlap = object.x - width - x;
                        overlap = object.collisionMask.x - width - x;

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
        public static NEWseparateTileY(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideUp: bool, collideDown: bool, separate: bool): bool {

            //  Can't separate two immovable objects (tiles are always immovable)
            if (object.immovable)
            {
                return false;
            }

            //  First, get the two object deltas
            var overlap: number = 0;
            //var objDelta: number = object.y - object.last.y;

            if (object.collisionMask.deltaY != 0)
            {
                //  Check if the Y hulls actually overlap
                //var objDeltaAbs: number = (objDelta > 0) ? objDelta : -objDelta;
                //var objBounds: Quad = new Quad(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);

                //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
                if (object.collisionMask.intersectsRaw(x, x + width, y, y + height))
                {
                    //var maxOverlap: number = objDeltaAbs + Collision.OVERLAP_BIAS;
                    var maxOverlap: number = object.collisionMask.deltaYAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object.collisionMask.deltaY > 0)
                    {
                        //overlap = object.y + object.height - y;
                        overlap = object.collisionMask.bottom - y;

                        if ((overlap > maxOverlap) || !(object.allowCollisions & Collision.DOWN) || collideUp == false)
                        {
                            overlap = 0;
                        }
                        else
                        {
                            object.touching |= Collision.DOWN;
                        }
                    }
                    else if (object.collisionMask.deltaY < 0)
                    {
                        //overlap = object.y - height - y;
                        overlap = object.collisionMask.y - height - y;

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

            if (object1.collisionMask.deltaX != object2.collisionMask.deltaX)
            {
                if (object1.collisionMask.intersects(object2.collisionMask))
                {
                    var maxOverlap: number = object1.collisionMask.deltaXAbs + object2.collisionMask.deltaXAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object1.collisionMask.deltaX > object2.collisionMask.deltaX)
                    {
                        overlap = object1.collisionMask.right - object2.collisionMask.x;

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
                    else if (object1.collisionMask.deltaX < object2.collisionMask.deltaX)
                    {
                        overlap = object1.collisionMask.x - object2.collisionMask.width - object2.collisionMask.x;

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

            if (object1.collisionMask.deltaY != object2.collisionMask.deltaY)
            {
                if (object1.collisionMask.intersects(object2.collisionMask))
                {
                    //  This is the only place to use the DeltaAbs values
                    var maxOverlap: number = object1.collisionMask.deltaYAbs + object2.collisionMask.deltaYAbs + Collision.OVERLAP_BIAS;

                    //  If they did overlap (and can), figure out by how much and flip the corresponding flags
                    if (object1.collisionMask.deltaY > object2.collisionMask.deltaY)
                    {
                        overlap = object1.collisionMask.bottom - object2.collisionMask.y;

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
                    else if (object1.collisionMask.deltaY < object2.collisionMask.deltaY)
                    {
                        overlap = object1.collisionMask.y - object2.collisionMask.height - object2.collisionMask.y;

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
                    if (object2.active && object2.moves && (object1.collisionMask.deltaY > object2.collisionMask.deltaY))
                    {
                        object1.x += object2.x - object2.last.x;
                    }
                }
                else if (!object2.immovable)
                {
                    object2.y += overlap;
                    object2.velocity.y = obj1Velocity - obj2Velocity * object2.elasticity;
                    //  This is special case code that handles things like horizontal moving platforms you can ride
                    if (object1.active && object1.moves && (object1.collisionMask.deltaY < object2.collisionMask.deltaY))
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



        // SAT

        /**
        * Flattens the specified array of points onto a unit vector axis,
        * resulting in a one dimensional range of the minimum and 
        * maximum value on that axis.
        *
        * @param {Array.<Vector>} points The points to flatten.
        * @param {Vector} normal The unit vector axis to flatten on.
        * @param {Array.<number>} result An array.  After calling this function,
        *   result[0] will be the minimum value,
        *   result[1] will be the maximum value.
        */
        public static flattenPointsOn(points, normal, result) {

            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;
            var len = points.length;

            for (var i = 0; i < len; i++)
            {
                // Get the magnitude of the projection of the point onto the normal
                var dot = points[i].dot(normal);
                if (dot < min) { min = dot; }
                if (dot > max) { max = dot; }
            }

            result[0] = min; result[1] = max;

        }

        /**
        * Pool of Vectors used in calculations.
        * 
        * @type {Array.<Vector>}
        */
        public static T_VECTORS: Vector2[];

        /**
        * Pool of Arrays used in calculations.
        * 
        * @type {Array.<Array.<*>>}
        */
        public static T_ARRAYS;

        /**
        * Check whether two convex clockwise polygons are separated by the specified
        * axis (must be a unit vector).
        * 
        * @param {Vector} aPos The position of the first polygon.
        * @param {Vector} bPos The position of the second polygon.
        * @param {Array.<Vector>} aPoints The points in the first polygon.
        * @param {Array.<Vector>} bPoints The points in the second polygon.
        * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
        *   will be projected onto this axis.
        * @param {Response=} response A Response object (optional) which will be populated
        *   if the axis is not a separating axis.
        * @return {boolean} true if it is a separating axis, false otherwise.  If false,
        *   and a response is passed in, information about how much overlap and
        *   the direction of the overlap will be populated.
        */
        public static isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response?:Response = null): bool {

            var rangeA = Collision.T_ARRAYS.pop();
            var rangeB = Collision.T_ARRAYS.pop();

            // Get the magnitude of the offset between the two polygons
            var offsetV = Collision.T_VECTORS.pop().copyFrom(bPos).sub(aPos);
            var projectedOffset = offsetV.dot(axis);

            // Project the polygons onto the axis.
            Collision.flattenPointsOn(aPoints, axis, rangeA);
            Collision.flattenPointsOn(bPoints, axis, rangeB);

            // Move B's range to its position relative to A.
            rangeB[0] += projectedOffset;
            rangeB[1] += projectedOffset;

            // Check if there is a gap. If there is, this is a separating axis and we can stop
            if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1])
            {
                Collision.T_VECTORS.push(offsetV);
                Collision.T_ARRAYS.push(rangeA);
                Collision.T_ARRAYS.push(rangeB);
                return true;
            }

            // If we're calculating a response, calculate the overlap.
            if (response)
            {
                var overlap = 0;

                // A starts further left than B
                if (rangeA[0] < rangeB[0])
                {
                    response.aInB = false;

                    // A ends before B does. We have to pull A out of B
                    if (rangeA[1] < rangeB[1])
                    {
                        overlap = rangeA[1] - rangeB[0];
                        response.bInA = false;
                        // B is fully inside A.  Pick the shortest way out.
                    }
                    else
                    {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                    // B starts further left than A
                }
                else
                {
                    response.bInA = false;

                    // B ends before A ends. We have to push A out of B
                    if (rangeA[1] > rangeB[1])
                    {
                        overlap = rangeA[0] - rangeB[1];
                        response.aInB = false;
                        // A is fully inside B.  Pick the shortest way out.
                    }
                    else
                    {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                }

                // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
                var absOverlap = Math.abs(overlap);

                if (absOverlap < response.overlap)
                {
                    response.overlap = absOverlap;
                    response.overlapN.copyFrom(axis);

                    if (overlap < 0)
                    {
                        response.overlapN.reverse();
                    }
                }
            }

            Collision.T_VECTORS.push(offsetV);
            Collision.T_ARRAYS.push(rangeA);
            Collision.T_ARRAYS.push(rangeB);

            return false;

        }

        public static LEFT_VORNOI_REGION:number = -1;
        public static MIDDLE_VORNOI_REGION:number = 0;
        public static RIGHT_VORNOI_REGION:number = 1;

        /**
        * Calculates which Vornoi region a point is on a line segment.
        * It is assumed that both the line and the point are relative to (0, 0)
        * 
        *             |       (0)      | 
        *      (-1)  [0]--------------[1]  (1)
        *             |       (0)      | 
        * 
        * @param {Vector} line The line segment.
        * @param {Vector} point The point.
        * @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region, 
        *          MIDDLE_VORNOI_REGION (0) if it is the middle region, 
        *          RIGHT_VORNOI_REGION (1) if it is the right region.
        */
        public static vornoiRegion(line: Vector2, point: Vector2): number {

            var len2 = line.length2();
            var dp = point.dot(line);

            if (dp < 0) { return Collision.LEFT_VORNOI_REGION; }
            else if (dp > len2) { return Collision.RIGHT_VORNOI_REGION; }
            else { return Collision.MIDDLE_VORNOI_REGION; }

        }

        /**
        * Check if two circles intersect.
        * 
        * @param {Circle} a The first circle.
        * @param {Circle} b The second circle.
        * @param {Response=} response Response object (optional) that will be populated if
        *   the circles intersect.
        * @return {boolean} true if the circles intersect, false if they don't. 
        */
        public static testCircleCircle(a: Circle, b: Circle, response?: Response = null): bool {

            var differenceV = Collision.T_VECTORS.pop().copyFrom(b.pos).sub(a.pos);
            var totalRadius = a.radius + b.radius;
            var totalRadiusSq = totalRadius * totalRadius;
            var distanceSq = differenceV.length2();
            
            if (distanceSq > totalRadiusSq)
            {
                // They do not intersect 
                Collision.T_VECTORS.push(differenceV);
                return false;
            }

            // They intersect.  If we're calculating a response, calculate the overlap.
            if (response)
            {
                var dist = Math.sqrt(distanceSq);
                response.a = a;
                response.b = b;
                response.overlap = totalRadius - dist;
                response.overlapN.copyFrom(differenceV.normalize());
                response.overlapV.copyFrom(differenceV).scale(response.overlap);
                response.aInB = a.radius <= b.radius && dist <= b.radius - a.radius;
                response.bInA = b.radius <= a.radius && dist <= a.radius - b.radius;
            }

            Collision.T_VECTORS.push(differenceV);
            return true;

        }

        /**
        * Check if a polygon and a circle intersect.
        * 
        * @param {Polygon} polygon The polygon.
        * @param {Circle} circle The circle.
        * @param {Response=} response Response object (optional) that will be populated if
        *   they interset.
        * @return {boolean} true if they intersect, false if they don't.
        */
        public static testPolygonCircle(polygon: Polygon, circle: Circle, response?: Response = null): bool {

            var circlePos = Collision.T_VECTORS.pop().copyFrom(circle.pos).sub(polygon.pos);
            var radius = circle.radius;
            var radius2 = radius * radius;
            var points = polygon.points;
            var len = points.length;
            var edge = T_VECTORS.pop();
            var point = T_VECTORS.pop();

            // For each edge in the polygon
            for (var i = 0; i < len; i++)
            {
                var next = i === len - 1 ? 0 : i + 1;
                var prev = i === 0 ? len - 1 : i - 1;
                var overlap = 0;
                var overlapN = null;

                // Get the edge
                edge.copyFrom(polygon.edges[i]);
                // Calculate the center of the cirble relative to the starting point of the edge
                point.copyFrom(circlePos).sub(points[i]);

                // If the distance between the center of the circle and the point
                // is bigger than the radius, the polygon is definitely not fully in
                // the circle.
                if (response && point.length2() > radius2)
                {
                    response.aInB = false;
                }

                // Calculate which Vornoi region the center of the circle is in.
                var region = vornoiRegion(edge, point);

                if (region === Collision.LEFT_VORNOI_REGION)
                {
                    // Need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
                    edge.copyFrom(polygon.edges[prev]);

                    // Calculate the center of the circle relative the starting point of the previous edge
                    var point2 = Collision.T_VECTORS.pop().copyFrom(circlePos).sub(points[prev]);
                    region = vornoiRegion(edge, point2);

                    if (region === Collision.RIGHT_VORNOI_REGION)
                    {
                        // It's in the region we want.  Check if the circle intersects the point.
                        var dist = point.length2();

                        if (dist > radius)
                        {
                            // No intersection
                            Collision.T_VECTORS.push(circlePos);
                            Collision.T_VECTORS.push(edge);
                            Collision.T_VECTORS.push(point);
                            Collision.T_VECTORS.push(point2);
                            return false;
                        }
                        else if (response)
                        {
                            // It intersects, calculate the overlap
                            response.bInA = false;
                            overlapN = point.normalize();
                            overlap = radius - dist;
                        }
                    }

                    Collision.T_VECTORS.push(point2);

                }
                else if (region === Collision.RIGHT_VORNOI_REGION)
                {
                    // Need to make sure we're in the left region on the next edge
                    edge.copyFrom(polygon.edges[next]);

                    // Calculate the center of the circle relative to the starting point of the next edge
                    point.copyFrom(circlePos).sub(points[next]);
                    region = vornoiRegion(edge, point);

                    if (region === Collision.LEFT_VORNOI_REGION)
                    {
                        // It's in the region we want.  Check if the circle intersects the point.
                        var dist = point.length2();

                        if (dist > radius)
                        {
                            // No intersection
                            Collision.T_VECTORS.push(circlePos);
                            Collision.T_VECTORS.push(edge);
                            Collision.T_VECTORS.push(point);
                            return false;
                        }
                        else if (response)
                        {
                            // It intersects, calculate the overlap
                            response.bInA = false;
                            overlapN = point.normalize();
                            overlap = radius - dist;
                        }
                    }
                    // MIDDLE_VORNOI_REGION
                }
                else
                {
                    // Need to check if the circle is intersecting the edge,
                    // Change the edge into its "edge normal".
                    var normal = edge.perp().normalize();

                    // Find the perpendicular distance between the center of the 
                    // circle and the edge.
                    var dist = point.dot(normal);
                    var distAbs = Math.abs(dist);

                    // If the circle is on the outside of the edge, there is no intersection
                    if (dist > 0 && distAbs > radius)
                    {
                        Collision.T_VECTORS.push(circlePos);
                        Collision.T_VECTORS.push(normal);
                        Collision.T_VECTORS.push(point);
                        return false;
                    }
                    else if (response)
                    {
                        // It intersects, calculate the overlap.
                        overlapN = normal;
                        overlap = radius - dist;
                        // If the center of the circle is on the outside of the edge, or part of the
                        // circle is on the outside, the circle is not fully inside the polygon.
                        if (dist >= 0 || overlap < 2 * radius)
                        {
                            response.bInA = false;
                        }
                    }
                }

                // If this is the smallest overlap we've seen, keep it. 
                // (overlapN may be null if the circle was in the wrong Vornoi region)
                if (overlapN && response && Math.abs(overlap) < Math.abs(response.overlap))
                {
                    response.overlap = overlap;
                    response.overlapN.copyFrom(overlapN);
                }
            }

            // Calculate the final overlap vector - based on the smallest overlap.
            if (response)
            {
                response.a = polygon;
                response.b = circle;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }
            
            Collision.T_VECTORS.push(circlePos);
            Collision.T_VECTORS.push(edge);
            Collision.T_VECTORS.push(point);

            return true;
        }

        /**
        * Check if a circle and a polygon intersect.
        * 
        * NOTE: This runs slightly slower than polygonCircle as it just
        * runs polygonCircle and reverses everything at the end.
        * 
        * @param {Circle} circle The circle.
        * @param {Polygon} polygon The polygon.
        * @param {Response=} response Response object (optional) that will be populated if
        *   they interset.
        * @return {boolean} true if they intersect, false if they don't.
        */
        public static testCirclePolygon(circle: Circle, polygon: Polygon, response?: Response = null): bool {
            
            var result = Collision.testPolygonCircle(polygon, circle, response);
            
            if (result && response)
            {
                // Swap A and B in the response.
                var a = response.a;
                var aInB = response.aInB;
                response.overlapN.reverse();
                response.overlapV.reverse();
                response.a = response.b;
                response.b = a;
                response.aInB = response.bInA;
                response.bInA = aInB;
            }

            return result;
        }

        /**
        * Checks whether two convex, clockwise polygons intersect.
        * 
        * @param {Polygon} a The first polygon.
        * @param {Polygon} b The second polygon.
        * @param {Response=} response Response object (optional) that will be populated if
        *   they interset.
        * @return {boolean} true if they intersect, false if they don't.
        */
        public static testPolygonPolygon(a: Polygon, b: Polygon, response?: Response = null): bool {

            var aPoints = a.points;
            var aLen = aPoints.length;
            var bPoints = b.points;
            var bLen = bPoints.length;

            // If any of the edge normals of A is a separating axis, no intersection.
            for (var i = 0; i < aLen; i++)
            {
                if (Collision.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[i], response))
                {
                    return false;
                }
            }

            // If any of the edge normals of B is a separating axis, no intersection.
            for (var i = 0; i < bLen; i++)
            {
                if (Collision.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response))
                {
                    return false;
                }
            }

            // Since none of the edge normals of A or B are a separating axis, there is an intersection
            // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
            // final overlap vector.
            if (response)
            {
                response.a = a;
                response.b = b;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }

            return true;
        }

    }

}