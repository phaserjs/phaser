/// <reference path="../Game.ts" />

/**
*   Phaser
*/

module Phaser {

    export class GeomSprite extends GameObject {

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

        public type: number = 0;

        public static UNASSIGNED: number = 0;
        public static CIRCLE: number = 1;
        public static LINE: number = 2;
        public static POINT: number = 3;
        public static RECTANGLE: number = 4;

        public circle: Circle;
        public line: Line;
        public point: Point;
        public rect: Rectangle;

        public renderOutline: bool = true;
        public renderFill: bool = true;

        public lineWidth: number = 1;
        public lineColor: string = 'rgb(0,255,0)';
        public fillColor: string = 'rgb(0,100,0)';

        loadCircle(circle:Circle): GeomSprite {

            this.refresh();
            this.circle = circle;
            this.type = GeomSprite.CIRCLE;
            return this;

        }


        loadLine(line:Line): GeomSprite {

            this.refresh();
            this.line = line;
            this.type = GeomSprite.LINE;
            return this;

        }

        loadPoint(point:Point): GeomSprite {

            this.refresh();
            this.point = point;
            this.type = GeomSprite.POINT;
            return this;

        }

        loadRectangle(rect:Rectangle): GeomSprite {

            this.refresh();
            this.rect = rect;
            this.type = GeomSprite.RECTANGLE;
            return this;

        }

        createCircle(diameter: number): GeomSprite {

            this.refresh();
            this.circle = new Circle(this.x, this.y, diameter);
            this.type = GeomSprite.CIRCLE;
            this.bounds.setTo(this.circle.x - this.circle.radius, this.circle.y - this.circle.radius, this.circle.diameter, this.circle.diameter);
            return this;

        }

        createLine(x: number, y: number): GeomSprite {

            this.refresh();
            this.line = new Line(this.x, this.y, x, y);
            this.type = GeomSprite.LINE;
            this.bounds.setTo(this.x, this.y, this.line.width, this.line.height);
            return this;

        }

        createPoint(): GeomSprite {

            this.refresh();
            this.point = new Point(this.x, this.y);
            this.type = GeomSprite.POINT;
            this.bounds.width = 1;
            this.bounds.height = 1;
            return this;

        }

        createRectangle(width: number, height: number): GeomSprite {

            this.refresh();
            this.rect = new Rectangle(this.x, this.y, width, height);
            this.type = GeomSprite.RECTANGLE;
            this.bounds.copyFrom(this.rect);
            return this;

        }

        refresh() {

            this.circle = null;
            this.line = null;
            this.point = null;
            this.rect = null;

        }

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
                this.bounds.width = this.circle.diameter;
                this.bounds.height = this.circle.diameter;
            }
            else if (this.type == GeomSprite.LINE)
            {
                this.line.x1 = this.x;
                this.line.y1 = this.y;
                this.bounds.setTo(this.x, this.y, this.line.width, this.line.height);
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
                this.bounds.copyFrom(this.rect);
            }

        }

        public inCamera(camera: Rectangle): bool {

            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
                this._dx = this.bounds.x - (camera.x * this.scrollFactor.x);
                this._dy = this.bounds.y - (camera.y * this.scrollFactor.x);
                this._dw = this.bounds.width * this.scale.x;
                this._dh = this.bounds.height * this.scale.y;

                return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
            }
            else
            {
                return camera.overlap(this.bounds);
            }

        }

        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool {

            //  Render checks
            if (this.type == GeomSprite.UNASSIGNED || this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.inCamera(camera.worldView) == false)
            {
                return false;
            }

            //  Alpha
            if (this.alpha !== 1)
            {
                var globalAlpha = this._game.stage.context.globalAlpha;
                this._game.stage.context.globalAlpha = this.alpha;
            }

            this._dx = cameraOffsetX + (this.bounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.bounds.y - camera.worldView.y);
            this._dw = this.bounds.width * this.scale.x;
            this._dh = this.bounds.height * this.scale.y;

            //  Circles are drawn center based
            if (this.type == GeomSprite.CIRCLE)
            {
                this._dx += this.circle.radius;
                this._dy += this.circle.radius;
            }

            //	Apply camera difference
            if (this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0)
            {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }

            //	Rotation (misleading?)
            if (this.angle !== 0)
            {
                this._game.stage.context.save();
                this._game.stage.context.translate(this._dx + (this._dw / 2) - this.origin.x, this._dy + (this._dh / 2) - this.origin.y);
                this._game.stage.context.rotate(this.angle * (Math.PI / 180));
                this._dx = -(this._dw / 2);
                this._dy = -(this._dh / 2);
            }

            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);

            this._game.stage.saveCanvasValues();

            //  Debug
            this._game.stage.context.fillStyle = 'rgba(255,0,0,0.5)';
            this._game.stage.context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

            this._game.stage.context.lineWidth = this.lineWidth;
            this._game.stage.context.strokeStyle = this.lineColor;
            this._game.stage.context.fillStyle = this.fillColor;

            if (this._game.stage.fillStyle !== this.fillColor)
            {
            }

            //  Primitive Renderer
            if (this.type == GeomSprite.CIRCLE)
            {
                this._game.stage.context.beginPath();
                this._game.stage.context.arc(this._dx, this._dy, this.circle.radius, 0, Math.PI * 2);
                this._game.stage.context.stroke();

                if (this.renderFill)
                {
                    this._game.stage.context.fill();
                }

                this._game.stage.context.closePath();
            }
            else if (this.type == GeomSprite.LINE)
            {
                this._game.stage.context.beginPath();
                this._game.stage.context.moveTo(this._dx, this._dy);
                this._game.stage.context.lineTo(this.line.x2, this.line.y2);
                this._game.stage.context.stroke();
                this._game.stage.context.closePath();
            }
            else if (this.type == GeomSprite.POINT)
            {
                this._game.stage.context.fillRect(this._dx, this._dy, 2, 2);
            }
            else if (this.type == GeomSprite.RECTANGLE)
            {
                //  We can use the faster fillRect if we don't need the outline
                if (this.renderOutline == false)
                {
                    this._game.stage.context.fillRect(this._dx, this._dy, this.rect.width, this.rect.height);
                }
                else
                {
                    this._game.stage.context.beginPath();

                    this._game.stage.context.rect(this._dx, this._dy, this.rect.width, this.rect.height);
                    this._game.stage.context.stroke();

                    if (this.renderFill)
                    {
                        this._game.stage.context.fill();
                    }

                    this._game.stage.context.closePath();
                }
            }

            this._game.stage.restoreCanvasValues();

            if (this.rotation !== 0)
            {
                this._game.stage.context.translate(0, 0);
                this._game.stage.context.restore();
            }

            if (globalAlpha > -1)
            {
                this._game.stage.context.globalAlpha = globalAlpha;
            }

            return true;

        }

        public renderDebugInfo(x: number, y: number, color?: string = 'rgb(255,255,255)') {

            //this._game.stage.context.fillStyle = color;
            //this._game.stage.context.fillText('Sprite: ' + this.name + ' (' + this.bounds.width + ' x ' + this.bounds.height + ')', x, y);
            //this._game.stage.context.fillText('x: ' + this.bounds.x.toFixed(1) + ' y: ' + this.bounds.y.toFixed(1) + ' rotation: ' + this.angle.toFixed(1), x, y + 14);
            //this._game.stage.context.fillText('dx: ' + this._dx.toFixed(1) + ' dy: ' + this._dy.toFixed(1) + ' dw: ' + this._dw.toFixed(1) + ' dh: ' + this._dh.toFixed(1), x, y + 28);
            //this._game.stage.context.fillText('sx: ' + this._sx.toFixed(1) + ' sy: ' + this._sy.toFixed(1) + ' sw: ' + this._sw.toFixed(1) + ' sh: ' + this._sh.toFixed(1), x, y + 42);

        }

        //  Gives a basic boolean response to a geometric collision.
        //  If you need the details of the collision use the Collision functions instead and inspect the IntersectResult object.
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
            if (this.type == GeomSprite.LINE && source.type == GeomSprite.LINE)
            {
                return Collision.lineToCircle(this.line, source.circle).result;
            }

            //  Line vs. Rect
            if (this.type == GeomSprite.LINE && source.type == GeomSprite.RECTANGLE)
            {
                return Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }

            //  Line vs. Point
            if (this.type == GeomSprite.LINE && source.type == GeomSprite.LINE)
            {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }

            return false;

        }

    }

}