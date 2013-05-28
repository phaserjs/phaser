/// <reference path="../Game.ts" />
/// <reference path="../geom/Polygon.ts" />
/// <reference path="../utils/RectangleUtils.ts" />

/**
* Phaser - GeomSprite
*
* A GeomSprite is a special kind of GameObject that contains a base geometry class (Circle, Line, Point, Rectangle).
* They can be rendered in the game and used for collision just like any other game object. Display of them is controlled
* via the lineWidth / lineColor / fillColor and renderOutline / renderFill properties.
*/

module Phaser {

    export class GeomSprite extends Sprite {

        /**
         * GeomSprite constructor
         * Create a new <code>GeomSprite</code>.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param [x] {number} the initial x position of the sprite.
         * @param [y] {number} the initial y position of the sprite.
         */
        constructor(game: Game, x?: number = 0, y?: number = 0) {

            super(game, x, y);

            this.type = GeomSprite.UNASSIGNED;

            return this;

        }

        //  local rendering related temp vars to help avoid gc spikes
        private _dx: number = 0;
        private _dy: number = 0;
        private _dw: number = 0;
        private _dh: number = 0;

        /**
         * Geom type of this sprite. (available: UNASSIGNED, CIRCLE, LINE, POINT, RECTANGLE)
         * @type {number}
         */
        public type: number = 0;

        /**
         * Not completely set yet. (the default type)
         */
        public static UNASSIGNED: number = 0;

        /**
         * Circle.
         * @type {number}
         */
        public static CIRCLE: number = 1;

        /**
         * Line.
         * @type {number}
         */
        public static LINE: number = 2;

        /**
         * Point.
         * @type {number}
         */
        public static POINT: number = 3;

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
         * Point shape container. A Point instance.
         * @type {Point}
         */
        public point: Point;

        /**
         * Rectangle shape container. A Rectangle instance.
         * @type {Rectangle}
         */
        public rect: Rectangle;

        /**
         * Polygon shape container. A Polygon instance.
         * @type {Polygon}
         */
        public polygon: Polygon;

        /**
         * Render outline of this sprite or not. (default is true)
         * @type {boolean}
         */
        public renderOutline: bool = true;

        /**
         * Fill the shape or not. (default is true)
         * @type {boolean}
         */
        public renderFill: bool = true;

        /**
         * Width of outline. (default is 1)
         * @type {number}
         */
        public lineWidth: number = 1;

        /**
         * Width of outline. (default is 1)
         * @type {number}
         */
        public lineColor: string = 'rgb(0,255,0)';

        /**
         * The color of the filled area in rgb or rgba string format
         * @type {string} Defaults to rgb(0,100,0) - a green color
         */
        public fillColor: string = 'rgb(0,100,0)';

        /**
         * Just like Sprite.loadGraphic(), this will load a circle and set its shape to Circle.
         * @param circle {Circle} Circle geometry define.
         * @return {GeomSprite} GeomSprite instance itself.
         */
        loadCircle(circle:Circle): GeomSprite {

            this.refresh();
            this.circle = circle;
            this.type = GeomSprite.CIRCLE;
            return this;

        }

        /**
         * Just like Sprite.loadGraphic(), this will load a line and set its shape to Line.
         * @param line {Line} Line geometry define.
         * @return {GeomSprite} GeomSprite instance itself.
         */
        loadLine(line:Line): GeomSprite {

            this.refresh();
            this.line = line;
            this.type = GeomSprite.LINE;
            return this;

        }

        /**
         * Just like Sprite.loadGraphic(), this will load a point and set its shape to Point.
         * @param point {Point} Point geometry define.
         * @return {GeomSprite} GeomSprite instance itself.
         */
        loadPoint(point:Point): GeomSprite {

            this.refresh();
            this.point = point;
            this.type = GeomSprite.POINT;
            return this;

        }

        /**
         * Just like Sprite.loadGraphic(), this will load a rect and set its shape to Rectangle.
         * @param rect {Rectangle} Rectangle geometry define.
         * @return {GeomSprite} GeomSprite instance itself.
         */
        loadRectangle(rect:Rectangle): GeomSprite {

            this.refresh();
            this.rect = rect;
            this.type = GeomSprite.RECTANGLE;
            return this;

        }

        /**
         * Create a circle shape with specific diameter.
         * @param diameter {number} Diameter of the circle.
         * @return {GeomSprite} GeomSprite instance itself.
         */
        createCircle(diameter: number): GeomSprite {

            this.refresh();
            this.circle = new Circle(this.x, this.y, diameter);
            this.type = GeomSprite.CIRCLE;
            this.frameBounds.setTo(this.circle.x - this.circle.radius, this.circle.y - this.circle.radius, this.circle.diameter, this.circle.diameter);
            return this;

        }

        /**
         * Create a line shape with specific end point.
         * @param x {number} X position of the end point.
         * @param y {number} Y position of the end point.
         * @return {GeomSprite} GeomSprite instance itself.
         */
        createLine(x: number, y: number): GeomSprite {

            this.refresh();
            this.line = new Line(this.x, this.y, x, y);
            this.type = GeomSprite.LINE;
            this.frameBounds.setTo(this.x, this.y, this.line.width, this.line.height);
            return this;

        }

        /**
         * Create a point shape at spriter's position.
         * @return {GeomSprite} GeomSprite instance itself.
         */
        createPoint(): GeomSprite {

            this.refresh();
            this.point = new Point(this.x, this.y);
            this.type = GeomSprite.POINT;
            this.frameBounds.width = 1;
            this.frameBounds.height = 1;
            return this;

        }

        /**
         * Create a rectangle shape of the given width and height size
         * @param width {Number} Width of the rectangle
         * @param height {Number} Height of the rectangle
         * @return {GeomSprite} GeomSprite instance.
         */
        createRectangle(width: number, height: number): GeomSprite {

            this.refresh();
            this.rect = new Rectangle(this.x, this.y, width, height);
            this.type = GeomSprite.RECTANGLE;
            this.frameBounds.copyFrom(this.rect);
            return this;

        }

        /**
         * Create a polygon object
         * @param width {Number} Width of the rectangle
         * @param height {Number} Height of the rectangle
         * @return {GeomSprite} GeomSprite instance.
         */
        createPolygon(points?: Vec2[] = []): GeomSprite {

            //this.refresh();
            //this.polygon = new Polygon(new Vec2(this.x, this.y), points);
            //this.type = GeomSprite.POLYGON;
            //this.frameBounds.copyFrom(this.rect);
            return this;

        }

        /**
         * Destroy all geom shapes of this sprite.
         */
        refresh() {

            this.circle = null;
            this.line = null;
            this.point = null;
            this.rect = null;

        }

        /**
         * Update bounds.
         */
        update() {

            //  Update bounds and position?
            if (this.type == GeomSprite.UNASSIGNED)
            {
                return;
            }
            else if (this.type == GeomSprite.CIRCLE)
            {
                this.circle.x = this.x;
                this.circle.y = this.y;
                this.frameBounds.width = this.circle.diameter;
                this.frameBounds.height = this.circle.diameter;
            }
            else if (this.type == GeomSprite.LINE)
            {
                this.line.x1 = this.x;
                this.line.y1 = this.y;
                this.frameBounds.setTo(this.x, this.y, this.line.width, this.line.height);
            }
            else if (this.type == GeomSprite.POINT)
            {
                this.point.x = this.x;
                this.point.y = this.y;
            }
            else if (this.type == GeomSprite.RECTANGLE)
            {
                this.rect.x = this.x;
                this.rect.y = this.y;
                this.frameBounds.copyFrom(this.rect);
            }

        }

        /**
         * Check whether this object is visible in a specific camera rectangle.
         * @param camera {Rectangle} The rectangle you want to check.
         * @return {boolean} Return true if bounds of this sprite intersects the given rectangle, otherwise return false.
         */
        /*
        public inCamera(camera: Rectangle): bool {

            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
                this._dx = this.frameBounds.x - (camera.x * this.scrollFactor.x);
                this._dy = this.frameBounds.y - (camera.y * this.scrollFactor.x);
                this._dw = this.frameBounds.width * this.scale.x;
                this._dh = this.frameBounds.height * this.scale.y;

                return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
            }
            else
            {
                return camera.intersects(this.frameBounds);
            }

        }
        */

        /**
         * Render this sprite to specific camera. Called by game loop after update().
         * @param camera {Camera} Camera this sprite will be rendered to.
         * @cameraOffsetX {number} X offset to the camera.
         * @cameraOffsetY {number} Y offset to the camera.
         * @return {boolean} Return false if not rendered, otherwise return true.
         */
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool {

            //  Render checks
            //if (this.type == GeomSprite.UNASSIGNED || this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false)
            //{
            //    return false;
            //}

            //  Alpha
            if (this.alpha !== 1)
            {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }

            this._dx = cameraOffsetX + (this.frameBounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.frameBounds.y - camera.worldView.y);
            this._dw = this.frameBounds.width * this.scale.x;
            this._dh = this.frameBounds.height * this.scale.y;

            //	Apply camera difference
            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }

            //	Rotation is disabled for now as I don't want it to be misleading re: collision
            /*
            if (this.angle !== 0)
            {
                this.context.save();
                this.context.translate(this._dx + (this._dw / 2) - this.origin.x, this._dy + (this._dh / 2) - this.origin.y);
                this.context.rotate(this.angle * (Math.PI / 180));
                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);
            }
            */

            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);

            this._game.stage.saveCanvasValues();

            //  Debug
            //this.context.fillStyle = 'rgba(255,0,0,0.5)';
            //this.context.fillRect(this.frameBounds.x, this.frameBounds.y, this.frameBounds.width, this.frameBounds.height);

            this.context.lineWidth = this.lineWidth;
            this.context.strokeStyle = this.lineColor;
            this.context.fillStyle = this.fillColor;

            if (this._game.stage.fillStyle !== this.fillColor)
            {
            }

            //  Primitive Renderer
            if (this.type == GeomSprite.CIRCLE)
            {
                this.context.beginPath();
                this.context.arc(this._dx, this._dy, this.circle.radius, 0, Math.PI * 2);

                if (this.renderOutline)
                {
                    this.context.stroke();
                }

                if (this.renderFill)
                {
                    this.context.fill();
                }

                this.context.closePath();
            }
            else if (this.type == GeomSprite.LINE)
            {
                this.context.beginPath();
                this.context.moveTo(this._dx, this._dy);
                this.context.lineTo(this.line.x2, this.line.y2);
                this.context.stroke();
                this.context.closePath();
            }
            else if (this.type == GeomSprite.POINT)
            {
                this.context.fillRect(this._dx, this._dy, 2, 2);
            }
            else if (this.type == GeomSprite.RECTANGLE)
            {
                //  We can use the faster fillRect if we don't need the outline
                if (this.renderOutline == false)
                {
                    this.context.fillRect(this._dx, this._dy, this.rect.width, this.rect.height);
                }
                else
                {
                    this.context.beginPath();
                    this.context.rect(this._dx, this._dy, this.rect.width, this.rect.height);
                    this.context.stroke();

                    if (this.renderFill)
                    {
                        this.context.fill();
                    }

                    this.context.closePath();
                }

                //  And now the edge points
                this.context.fillStyle = 'rgb(255,255,255)';
                //this.renderPoint(this.rect.topLeft, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.topCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.topRight, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.leftCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.center, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.rightCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.bottomLeft, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.bottomCenter, this._dx, this._dy, 2);
                //this.renderPoint(this.rect.bottomRight, this._dx, this._dy, 2);
                this.renderPoint(this.rect.topLeft, 0, 0, 2);
                this.renderPoint(this.rect.topCenter, 0, 0, 2);
                this.renderPoint(this.rect.topRight, 0, 0, 2);
                this.renderPoint(this.rect.leftCenter, 0, 0, 2);
                this.renderPoint(this.rect.center, 0, 0, 2);
                this.renderPoint(this.rect.rightCenter, 0, 0, 2);
                this.renderPoint(this.rect.bottomLeft, 0, 0, 2);
                this.renderPoint(this.rect.bottomCenter, 0, 0, 2);
                this.renderPoint(this.rect.bottomRight, 0, 0, 2);

            }

            this._game.stage.restoreCanvasValues();

            if (this.rotation !== 0)
            {
                this.context.translate(0, 0);
                this.context.restore();
            }

            if (globalAlpha > -1)
            {
                this.context.globalAlpha = globalAlpha;
            }

            return true;

        }

        /**
         * Render a point of geometry.
         * @param point {Point} Position of the point.
         * @param offsetX {number} X offset to its position.
         * @param offsetY {number} Y offset to its position.
         * @param [size] {number} point size.
         */
        public renderPoint(point, offsetX?: number = 0, offsetY?: number = 0, size?: number = 1) {

            this.context.fillRect(offsetX + point.x, offsetY + point.y, size, size);

        }

        /**
         * Render debug infos. (this method does not work now)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            //this.context.fillStyle = color;
            //this.context.fillText('Sprite: ' + this.name + ' (' + this.frameBounds.width + ' x ' + this.frameBounds.height + ')', x, y);
            //this.context.fillText('x: ' + this.frameBounds.x.toFixed(1) + ' y: ' + this.frameBounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            //this.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            //this.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);

        }

        /**
         * Gives a basic boolean response to a geometric collision.
         * If you need the details of the collision use the Collision functions instead and inspect the IntersectResult object.
         * @param source {GeomSprite} Sprite you want to check.
         * @return {boolean} Whether they overlaps or not.
         */
        public collide(source: GeomSprite): bool {

            //  Circle vs. Circle
            if (this.type == GeomSprite.CIRCLE && source.type == GeomSprite.CIRCLE)
            {
                return Collision.circleToCircle(this.circle, source.circle).result;
            }

            //  Circle vs. Rect
            if (this.type == GeomSprite.CIRCLE && source.type == GeomSprite.RECTANGLE)
            {
                return Collision.circleToRectangle(this.circle, source.rect).result;
            }

            //  Circle vs. Point
            if (this.type == GeomSprite.CIRCLE && source.type == GeomSprite.POINT)
            {
                return Collision.circleContainsPoint(this.circle, source.point).result;
            }

            //  Circle vs. Line
            if (this.type == GeomSprite.CIRCLE && source.type == GeomSprite.LINE)
            {
                return Collision.lineToCircle(source.line, this.circle).result;
            }

            //  Rect vs. Rect
            if (this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.RECTANGLE)
            {
                return Collision.rectangleToRectangle(this.rect, source.rect).result;
            }

            //  Rect vs. Circle
            if (this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.CIRCLE)
            {
                return Collision.circleToRectangle(source.circle, this.rect).result;
            }

            //  Rect vs. Point
            if (this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.POINT)
            {
                return Collision.pointToRectangle(source.point, this.rect).result;
            }

            //  Rect vs. Line
            if (this.type == GeomSprite.RECTANGLE && source.type == GeomSprite.LINE)
            {
                return Collision.lineToRectangle(source.line, this.rect).result;
            }

            //  Point vs. Point
            if (this.type == GeomSprite.POINT && source.type == GeomSprite.POINT)
            {
                return this.point.equals(source.point);
            }

            //  Point vs. Circle
            if (this.type == GeomSprite.POINT && source.type == GeomSprite.CIRCLE)
            {
                return Collision.circleContainsPoint(source.circle, this.point).result;
            }

            //  Point vs. Rect
            if (this.type == GeomSprite.POINT && source.type == GeomSprite.RECTANGLE)
            {
                return Collision.pointToRectangle(this.point, source.rect).result;
            }

            //  Point vs. Line
            if (this.type == GeomSprite.POINT && source.type == GeomSprite.LINE)
            {
                return source.line.isPointOnLine(this.point.x, this.point.y);
            }

            //  Line vs. Line
            if (this.type == GeomSprite.LINE && source.type == GeomSprite.LINE)
            {
                return Collision.lineSegmentToLineSegment(this.line, source.line).result;
            }

            //  Line vs. Circle
            if (this.type == GeomSprite.LINE && source.type == GeomSprite.CIRCLE)
            {
                return Collision.lineToCircle(this.line, source.circle).result;
            }

            //  Line vs. Rect
            if (this.type == GeomSprite.LINE && source.type == GeomSprite.RECTANGLE)
            {
                return Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }

            //  Line vs. Point
            if (this.type == GeomSprite.LINE && source.type == GeomSprite.POINT)
            {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }

            return false;

        }

    }

}