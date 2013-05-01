/// <reference path="Game.d.ts" />
/// <reference path="geom/Point.d.ts" />
/// <reference path="geom/Rectangle.d.ts" />
/// <reference path="geom/Quad.d.ts" />
/// <reference path="geom/Circle.d.ts" />
/// <reference path="geom/Line.d.ts" />
/// <reference path="geom/IntersectResult.d.ts" />
/// <reference path="system/QuadTree.d.ts" />
module Phaser {
    class Collision {
        constructor(game: Game);
        private _game;
        static LEFT: number;
        static RIGHT: number;
        static UP: number;
        static DOWN: number;
        static NONE: number;
        static CEILING: number;
        static FLOOR: number;
        static WALL: number;
        static ANY: number;
        static OVERLAP_BIAS: number;
        static TILE_OVERLAP: bool;
        static _tempBounds: Quad;
        static lineToLine(line1: Line, line2: Line, output?: IntersectResult): IntersectResult;
        static lineToLineSegment(line: Line, seg: Line, output?: IntersectResult): IntersectResult;
        static lineToRawSegment(line: Line, x1: number, y1: number, x2: number, y2: number, output?: IntersectResult): IntersectResult;
        static lineToRay(line1: Line, ray: Line, output?: IntersectResult): IntersectResult;
        static lineToCircle(line: Line, circle: Circle, output?: IntersectResult): IntersectResult;
        static lineToRectangle(line: Line, rect: Rectangle, output?: IntersectResult): IntersectResult;
        static lineSegmentToLineSegment(line1: Line, line2: Line, output?: IntersectResult): IntersectResult;
        static lineSegmentToRay(line: Line, ray: Line, output?: IntersectResult): IntersectResult;
        static lineSegmentToCircle(seg: Line, circle: Circle, output?: IntersectResult): IntersectResult;
        static lineSegmentToRectangle(seg: Line, rect: Rectangle, output?: IntersectResult): IntersectResult;
        static rayToRectangle(ray: Line, rect: Rectangle, output?: IntersectResult): IntersectResult;
        static rayToLineSegment(rayX1, rayY1, rayX2, rayY2, lineX1, lineY1, lineX2, lineY2, output?: IntersectResult): IntersectResult;
        static pointToRectangle(point, rect: Rectangle, output?: IntersectResult): IntersectResult;
        static rectangleToRectangle(rect1: Rectangle, rect2: Rectangle, output?: IntersectResult): IntersectResult;
        static rectangleToCircle(rect: Rectangle, circle: Circle, output?: IntersectResult): IntersectResult;
        static circleToCircle(circle1: Circle, circle2: Circle, output?: IntersectResult): IntersectResult;
        static circleToRectangle(circle: Circle, rect: Rectangle, output?: IntersectResult): IntersectResult;
        static circleContainsPoint(circle: Circle, point, output?: IntersectResult): IntersectResult;
        public overlap(object1?: Basic, object2?: Basic, notifyCallback?, processCallback?): bool;
        static separate(object1, object2): bool;
        static separateTile(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool, collideUp: bool, collideDown: bool): bool;
        static separateTileX(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool): bool;
        static separateTileY(object: GameObject, x: number, y: number, width: number, height: number, mass: number, collideUp: bool, collideDown: bool): bool;
        static separateX(object1, object2): bool;
        static separateY(object1, object2): bool;
        static distance(x1: number, y1: number, x2: number, y2: number): number;
        static distanceSquared(x1: number, y1: number, x2: number, y2: number): number;
    }
}
