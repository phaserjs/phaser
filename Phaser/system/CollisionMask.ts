/// <reference path="../Game.ts" />

/**
* Phaser - CollisionMask
*/

module Phaser {

    export class CollisionMask {

        /**
         * CollisionMask constructor. Creates a new <code>CollisionMask</code> for the given GameObject.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param parent {Phaser.GameObject} The GameObject this CollisionMask belongs to.
         * @param x {number} The initial x position of the CollisionMask.
         * @param y {number} The initial y position of the CollisionMask.
         * @param width {number} The width of the CollisionMask.
         * @param height {number} The height of the CollisionMask.
         */
        constructor(game: Game, parent: GameObject, x: number, y: number, width: number, height: number) {

            this._game = game;
            this._parent = parent;

            //  By default the CollisionMask is a quad
            this.type = CollisionMask.QUAD;

            this.quad = new Phaser.Quad(this._parent.x, this._parent.y, this._parent.width, this._parent.height);
            this.offset = new MicroPoint(0, 0);
            this.last = new MicroPoint(0, 0);

            this._ref = this.quad;

            return this;

        }

        private _game;
        private _parent;

        //  An internal reference to the active collision shape
        private _ref;

        /**
         * Geom type of this sprite. (available: QUAD, POINT, CIRCLE, LINE, RECTANGLE, POLYGON)
         * @type {number}
         */
        public type: number = 0;

        /**
         * Quad (a smaller version of Rectangle).
         * @type {number}
         */
        public static QUAD: number = 0;

        /**
         * Point.
         * @type {number}
         */
        public static POINT: number = 1;

        /**
         * Circle.
         * @type {number}
         */
        public static CIRCLE: number = 2;

        /**
         * Line.
         * @type {number}
         */
        public static LINE: number = 3;

        /**
         * Rectangle.
         * @type {number}
         */
        public static RECTANGLE: number = 4;

        /**
         * Polygon.
         * @type {number}
         */
        public static POLYGON: number = 5;

        /**
         * Rectangle shape container. A Rectangle instance.
         * @type {Rectangle}
         */
        public quad: Quad;

        /**
         * Point shape container. A Point instance.
         * @type {Point}
         */
        public point: Point;

        /**
         * Circle shape container. A Circle instance.
         * @type {Circle}
         */
        public circle: Circle;

        /**
         * Line shape container. A Line instance.
         * @type {Line}
         */
        public line: Line;

        /**
         * Rectangle shape container. A Rectangle instance.
         * @type {Rectangle}
         */
        public rect: Rectangle;

        /**
        * A value from the top-left of the GameObject frame that this collisionMask is offset to.
        * If the CollisionMask is a Quad/Rectangle the offset relates to the top-left of that Quad.
        * If the CollisionMask is a Circle the offset relates to the center of the circle.
        * @type {MicroPoint}
        */
        public offset: MicroPoint;

        /**
        * The previous x/y coordinates of the CollisionMask, used for hull calculations
        * @type {MicroPoint}
        */
        public last: MicroPoint;

        /**
         * Create a circle shape with specific diameter.
         * @param diameter {number} Diameter of the circle.
         * @return {CollisionMask} This
         */
        createCircle(diameter: number): CollisionMask {

            this.type = CollisionMask.CIRCLE;
            this.circle = new Circle(this.last.x, this.last.y, diameter);
            this._ref = this.circle;

            return this;

        }

        /**
         * Pre-update is called right before update() on each object in the game loop.
         */
        public preUpdate() {

            this.last.x = this.x;
            this.last.y = this.y;

        }

        public update() {

            //this.quad.x = this._parent.x + this.offset.x;
            //this.quad.y = this._parent.y + this.offset.y;
            this._ref.x = this._parent.x + this.offset.x;
            this._ref.y = this._parent.y + this.offset.y;

        }

        /**
         * Renders the bounding box around this Sprite and the contact points. Useful for visually debugging.
         * @param camera {Camera} Camera the bound will be rendered to.
         * @param cameraOffsetX {number} X offset of bound to the camera.
         * @param cameraOffsetY {number} Y offset of bound to the camera.
         */
        public render(camera:Camera, cameraOffsetX:number, cameraOffsetY:number) {

            var _dx = cameraOffsetX + (this.x - camera.worldView.x);
            var _dy = cameraOffsetY + (this.y - camera.worldView.y);

            //this._parent.context.fillStyle = this._parent.renderDebugColor;
            this._parent.context.fillStyle = 'rgba(255,0,0,0.4)';

            if (this.type == CollisionMask.QUAD)
            {
                this._parent.context.fillRect(_dx, _dy, this.width, this.height);
            }
            else if (this.type == CollisionMask.CIRCLE)
            {
                this._parent.context.beginPath();
                this._parent.context.arc(_dx, _dy, this.circle.radius, 0, Math.PI * 2);
                this._parent.context.fill();
                this._parent.context.closePath();
            }

        }

        /**
         * Destroy all objects and references belonging to this CollisionMask
         */
        public destroy() {

            this._game = null;
            this._parent = null;
            this._ref = null;
            this.quad = null;
            this.point = null;
            this.circle = null;
            this.rect = null;
            this.line = null;
            this.offset = null;

        }

        /**
         * Gives a basic boolean response to a geometric collision.
         * If you need the details of the collision use the Collision functions instead and inspect the IntersectResult object.
         * @param source {GeomSprite} Sprite you want to check.
         * @return {boolean} Whether they overlaps or not.
         */
        public intersects(source: CollisionMask): bool {

            //  Quad vs. Quad
            if (this.type == CollisionMask.QUAD && source.type == CollisionMask.QUAD)
            {
                return this.quad.intersects(source.quad);
            }

            //  Circle vs. Circle
            if (this.type == CollisionMask.CIRCLE && source.type == CollisionMask.CIRCLE)
            {
                console.log('c vs c');
                return Collision.circleToCircle(this.circle, source.circle).result;
            }

            //  Circle vs. Rect
            if (this.type == CollisionMask.CIRCLE && source.type == CollisionMask.RECTANGLE)
            {
                return Collision.circleToRectangle(this.circle, source.rect).result;
            }

            //  Circle vs. Point
            if (this.type == CollisionMask.CIRCLE && source.type == CollisionMask.POINT)
            {
                return Collision.circleContainsPoint(this.circle, source.point).result;
            }

            //  Circle vs. Line
            if (this.type == CollisionMask.CIRCLE && source.type == CollisionMask.LINE)
            {
                return Collision.lineToCircle(source.line, this.circle).result;
            }

            //  Rect vs. Rect
            if (this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.RECTANGLE)
            {
                return Collision.rectangleToRectangle(this.rect, source.rect).result;
            }

            //  Rect vs. Circle
            if (this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.CIRCLE)
            {
                return Collision.circleToRectangle(source.circle, this.rect).result;
            }

            //  Rect vs. Point
            if (this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.POINT)
            {
                return Collision.pointToRectangle(source.point, this.rect).result;
            }

            //  Rect vs. Line
            if (this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.LINE)
            {
                return Collision.lineToRectangle(source.line, this.rect).result;
            }

            //  Point vs. Point
            if (this.type == CollisionMask.POINT && source.type == CollisionMask.POINT)
            {
                return this.point.equals(source.point);
            }

            //  Point vs. Circle
            if (this.type == CollisionMask.POINT && source.type == CollisionMask.CIRCLE)
            {
                return Collision.circleContainsPoint(source.circle, this.point).result;
            }

            //  Point vs. Rect
            if (this.type == CollisionMask.POINT && source.type == CollisionMask.RECTANGLE)
            {
                return Collision.pointToRectangle(this.point, source.rect).result;
            }

            //  Point vs. Line
            if (this.type == CollisionMask.POINT && source.type == CollisionMask.LINE)
            {
                return source.line.isPointOnLine(this.point.x, this.point.y);
            }

            //  Line vs. Line
            if (this.type == CollisionMask.LINE && source.type == CollisionMask.LINE)
            {
                return Collision.lineSegmentToLineSegment(this.line, source.line).result;
            }

            //  Line vs. Circle
            if (this.type == CollisionMask.LINE && source.type == CollisionMask.CIRCLE)
            {
                return Collision.lineToCircle(this.line, source.circle).result;
            }

            //  Line vs. Rect
            if (this.type == CollisionMask.LINE && source.type == CollisionMask.RECTANGLE)
            {
                return Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }

            //  Line vs. Point
            if (this.type == CollisionMask.LINE && source.type == CollisionMask.POINT)
            {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }

            return false;

        }

        public checkHullIntersection(mask: CollisionMask): bool {

            if ((this.hullX + this.hullWidth > mask.hullX) && (this.hullX < mask.hullX + mask.width) && (this.hullY + this.hullHeight > mask.hullY) && (this.hullY < mask.hullY + mask.hullHeight))
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        public get hullWidth(): number {

            if (this.deltaX > 0)
            {
                return this.width + this.deltaX;
            }
            else
            {
                return this.width - this.deltaX;
            }

        }

        public get hullHeight(): number {

            if (this.deltaY > 0)
            {
                return this.height + this.deltaY;
            }
            else
            {
                return this.height - this.deltaY;
            }

        }

        public get hullX(): number {

            if (this.x < this.last.x)
            {
                return this.x;
            }
            else
            {
                return this.last.x;
            }

        }

        public get hullY(): number {

            if (this.y < this.last.y)
            {
                return this.y;
            }
            else
            {
                return this.last.y;
            }

        }

        public get deltaXAbs(): number {
            return (this.deltaX > 0 ? this.deltaX : -this.deltaX);
        }

        public get deltaYAbs(): number {
            return (this.deltaY > 0 ? this.deltaY : -this.deltaY);
        }

        public get deltaX(): number {
            return this.x - this.last.x;
        }

        public get deltaY(): number {
            return this.y - this.last.y;
        }

        public get x(): number {
            return this._ref.x;
            //return this.quad.x;
        }

        public set x(value: number) {
            this._ref.x = value;
            //this.quad.x = value;
        }

        public get y(): number {
            return this._ref.y;
            //return this.quad.y;
        }

        public set y(value: number) {
            this._ref.y = value;
            //this.quad.y = value;
        }

        //public get rotation(): number {
        //    return this._angle;
        //}

        //public set rotation(value: number) {
        //    this._angle = this._game.math.wrap(value, 360, 0);
        //}

        //public get angle(): number {
        //    return this._angle;
        //}

        //public set angle(value: number) {
        //    this._angle = this._game.math.wrap(value, 360, 0);
        //}

        public set width(value:number) {
            //this.quad.width = value;
            this._ref.width = value;
        }

        public set height(value:number) {
            //this.quad.height = value;
            this._ref.height = value;
        }

        public get width(): number {
            //return this.quad.width;
            return this._ref.width;
        }

        public get height(): number {
            //return this.quad.height;
            return this._ref.height;
        }

        public get left(): number {
            return this.x;
        }

        public get right(): number {
            return this.x + this.width;
        }

        public get top(): number {
            return this.y;
        }

        public get bottom(): number {
            return this.y + this.height;
        }

        public get halfWidth(): number {
            return this.width / 2;
        }

        public get halfHeight(): number {
            return this.height / 2;
        }

    }

}