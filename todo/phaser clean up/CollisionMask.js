/// <reference path="../Game.ts" />
/**
* Phaser - CollisionMask
*/
var Phaser;
(function (Phaser) {
    var CollisionMask = (function () {
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
        function CollisionMask(game, parent, x, y, width, height) {
            /**
            * Geom type of this sprite. (available: QUAD, POINT, CIRCLE, LINE, RECTANGLE, POLYGON)
            * @type {number}
            */
            this.type = 0;
            this._game = game;
            this._parent = parent;
            //  By default the CollisionMask is a quad
            this.type = CollisionMask.QUAD;
            this.quad = new Phaser.Quad(this._parent.x, this._parent.y, this._parent.width, this._parent.height);
            this.offset = new Phaser.MicroPoint(0, 0);
            this.last = new Phaser.MicroPoint(0, 0);
            this._ref = this.quad;
            return this;
        }
        CollisionMask.QUAD = 0;
        CollisionMask.POINT = 1;
        CollisionMask.CIRCLE = 2;
        CollisionMask.LINE = 3;
        CollisionMask.RECTANGLE = 4;
        CollisionMask.POLYGON = 5;
        CollisionMask.prototype.createCircle = /**
        * Create a circle shape with specific diameter.
        * @param diameter {number} Diameter of the circle.
        * @return {CollisionMask} This
        */
        function (diameter) {
            this.type = CollisionMask.CIRCLE;
            this.circle = new Phaser.Circle(this.last.x, this.last.y, diameter);
            this._ref = this.circle;
            return this;
        };
        CollisionMask.prototype.preUpdate = /**
        * Pre-update is called right before update() on each object in the game loop.
        */
        function () {
            this.last.x = this.x;
            this.last.y = this.y;
        };
        CollisionMask.prototype.update = function () {
            this._ref.x = this._parent.x + this.offset.x;
            this._ref.y = this._parent.y + this.offset.y;
        };
        CollisionMask.prototype.render = /**
        * Renders the bounding box around this Sprite and the contact points. Useful for visually debugging.
        * @param camera {Camera} Camera the bound will be rendered to.
        * @param cameraOffsetX {number} X offset of bound to the camera.
        * @param cameraOffsetY {number} Y offset of bound to the camera.
        */
        function (camera, cameraOffsetX, cameraOffsetY) {
            var _dx = cameraOffsetX + (this.x - camera.worldView.x);
            var _dy = cameraOffsetY + (this.y - camera.worldView.y);
            this._parent.context.fillStyle = this._parent.renderDebugColor;
            if(this.type == CollisionMask.QUAD) {
                this._parent.context.fillRect(_dx, _dy, this.width, this.height);
            } else if(this.type == CollisionMask.CIRCLE) {
                this._parent.context.beginPath();
                this._parent.context.arc(_dx, _dy, this.circle.radius, 0, Math.PI * 2);
                this._parent.context.fill();
                this._parent.context.closePath();
            }
        };
        CollisionMask.prototype.destroy = /**
        * Destroy all objects and references belonging to this CollisionMask
        */
        function () {
            this._game = null;
            this._parent = null;
            this._ref = null;
            this.quad = null;
            this.point = null;
            this.circle = null;
            this.rect = null;
            this.line = null;
            this.offset = null;
        };
        CollisionMask.prototype.intersectsRaw = function (left, right, top, bottom) {
            //if ((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height))
            return true;
        };
        CollisionMask.prototype.intersectsVector = function (vector) {
            if(this.type == CollisionMask.QUAD) {
                return this.quad.contains(vector.x, vector.y);
            }
        };
        CollisionMask.prototype.intersects = /**
        * Gives a basic boolean response to a geometric collision.
        * If you need the details of the collision use the Collision functions instead and inspect the IntersectResult object.
        * @param source {GeomSprite} Sprite you want to check.
        * @return {boolean} Whether they overlaps or not.
        */
        function (source) {
            //  Quad vs. Quad
            if(this.type == CollisionMask.QUAD && source.type == CollisionMask.QUAD) {
                return this.quad.intersects(source.quad);
            }
            //  Circle vs. Circle
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.circleToCircle(this.circle, source.circle).result;
            }
            //  Circle vs. Rect
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.circleToRectangle(this.circle, source.rect).result;
            }
            //  Circle vs. Point
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.POINT) {
                return Phaser.Collision.circleContainsPoint(this.circle, source.point).result;
            }
            //  Circle vs. Line
            if(this.type == CollisionMask.CIRCLE && source.type == CollisionMask.LINE) {
                return Phaser.Collision.lineToCircle(source.line, this.circle).result;
            }
            //  Rect vs. Rect
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.rectangleToRectangle(this.rect, source.rect).result;
            }
            //  Rect vs. Circle
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.circleToRectangle(source.circle, this.rect).result;
            }
            //  Rect vs. Point
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.POINT) {
                return Phaser.Collision.pointToRectangle(source.point, this.rect).result;
            }
            //  Rect vs. Line
            if(this.type == CollisionMask.RECTANGLE && source.type == CollisionMask.LINE) {
                return Phaser.Collision.lineToRectangle(source.line, this.rect).result;
            }
            //  Point vs. Point
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.POINT) {
                return this.point.equals(source.point);
            }
            //  Point vs. Circle
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.circleContainsPoint(source.circle, this.point).result;
            }
            //  Point vs. Rect
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.pointToRectangle(this.point, source.rect).result;
            }
            //  Point vs. Line
            if(this.type == CollisionMask.POINT && source.type == CollisionMask.LINE) {
                return source.line.isPointOnLine(this.point.x, this.point.y);
            }
            //  Line vs. Line
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.LINE) {
                return Phaser.Collision.lineSegmentToLineSegment(this.line, source.line).result;
            }
            //  Line vs. Circle
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.CIRCLE) {
                return Phaser.Collision.lineToCircle(this.line, source.circle).result;
            }
            //  Line vs. Rect
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.RECTANGLE) {
                return Phaser.Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }
            //  Line vs. Point
            if(this.type == CollisionMask.LINE && source.type == CollisionMask.POINT) {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }
            return false;
        };
        CollisionMask.prototype.checkHullIntersection = function (mask) {
            if((this.hullX + this.hullWidth > mask.hullX) && (this.hullX < mask.hullX + mask.width) && (this.hullY + this.hullHeight > mask.hullY) && (this.hullY < mask.hullY + mask.hullHeight)) {
                return true;
            } else {
                return false;
            }
        };
        Object.defineProperty(CollisionMask.prototype, "hullWidth", {
            get: function () {
                if(this.deltaX > 0) {
                    return this.width + this.deltaX;
                } else {
                    return this.width - this.deltaX;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "hullHeight", {
            get: function () {
                if(this.deltaY > 0) {
                    return this.height + this.deltaY;
                } else {
                    return this.height - this.deltaY;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "hullX", {
            get: function () {
                if(this.x < this.last.x) {
                    return this.x;
                } else {
                    return this.last.x;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "hullY", {
            get: function () {
                if(this.y < this.last.y) {
                    return this.y;
                } else {
                    return this.last.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaXAbs", {
            get: function () {
                return (this.deltaX > 0 ? this.deltaX : -this.deltaX);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaYAbs", {
            get: function () {
                return (this.deltaY > 0 ? this.deltaY : -this.deltaY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaX", {
            get: function () {
                return this.x - this.last.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "deltaY", {
            get: function () {
                return this.y - this.last.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "x", {
            get: function () {
                return this._ref.x;
                //return this.quad.x;
                            },
            set: function (value) {
                this._ref.x = value;
                //this.quad.x = value;
                            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "y", {
            get: function () {
                return this._ref.y;
                //return this.quad.y;
                            },
            set: function (value) {
                this._ref.y = value;
                //this.quad.y = value;
                            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "width", {
            get: function () {
                //return this.quad.width;
                return this._ref.width;
            },
            set: //public get rotation(): number {
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
            function (value) {
                //this.quad.width = value;
                this._ref.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "height", {
            get: function () {
                //return this.quad.height;
                return this._ref.height;
            },
            set: function (value) {
                //this.quad.height = value;
                this._ref.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "halfWidth", {
            get: function () {
                return this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollisionMask.prototype, "halfHeight", {
            get: function () {
                return this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        return CollisionMask;
    })();
    Phaser.CollisionMask = CollisionMask;    
})(Phaser || (Phaser = {}));
