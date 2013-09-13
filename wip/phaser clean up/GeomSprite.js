var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    var GeomSprite = (function (_super) {
        __extends(GeomSprite, _super);
        function GeomSprite(game, x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            _super.call(this, game, x, y);
            this._dx = 0;
            this._dy = 0;
            this._dw = 0;
            this._dh = 0;
            this.type = 0;
            this.renderOutline = true;
            this.renderFill = true;
            this.lineWidth = 1;
            this.lineColor = 'rgb(0,255,0)';
            this.fillColor = 'rgb(0,100,0)';
            this.type = GeomSprite.UNASSIGNED;
            return this;
        }
        GeomSprite.UNASSIGNED = 0;
        GeomSprite.CIRCLE = 1;
        GeomSprite.LINE = 2;
        GeomSprite.POINT = 3;
        GeomSprite.RECTANGLE = 4;
        GeomSprite.POLYGON = 5;
        GeomSprite.prototype.loadCircle = function (circle) {
            this.refresh();
            this.circle = circle;
            this.type = Phaser.GeomSprite.CIRCLE;
            return this;
        };
        GeomSprite.prototype.loadLine = function (line) {
            this.refresh();
            this.line = line;
            this.type = Phaser.GeomSprite.LINE;
            return this;
        };
        GeomSprite.prototype.loadPoint = function (point) {
            this.refresh();
            this.point = point;
            this.type = Phaser.GeomSprite.POINT;
            return this;
        };
        GeomSprite.prototype.loadRectangle = function (rect) {
            this.refresh();
            this.rect = rect;
            this.type = Phaser.GeomSprite.RECTANGLE;
            return this;
        };
        GeomSprite.prototype.createCircle = function (diameter) {
            this.refresh();
            this.circle = new Phaser.Circle(this.x, this.y, diameter);
            this.type = Phaser.GeomSprite.CIRCLE;
            this.frameBounds.setTo(this.circle.x - this.circle.radius, this.circle.y - this.circle.radius, this.circle.diameter, this.circle.diameter);
            return this;
        };
        GeomSprite.prototype.createLine = function (x, y) {
            this.refresh();
            this.line = new Phaser.Line(this.x, this.y, x, y);
            this.type = Phaser.GeomSprite.LINE;
            this.frameBounds.setTo(this.x, this.y, this.line.width, this.line.height);
            return this;
        };
        GeomSprite.prototype.createPoint = function () {
            this.refresh();
            this.point = new Phaser.Point(this.x, this.y);
            this.type = Phaser.GeomSprite.POINT;
            this.frameBounds.width = 1;
            this.frameBounds.height = 1;
            return this;
        };
        GeomSprite.prototype.createRectangle = function (width, height) {
            this.refresh();
            this.rect = new Phaser.Rectangle(this.x, this.y, width, height);
            this.type = Phaser.GeomSprite.RECTANGLE;
            this.frameBounds.copyFrom(this.rect);
            return this;
        };
        GeomSprite.prototype.createPolygon = function (points) {
            if (typeof points === "undefined") { points = []; }
            this.refresh();
            this.polygon = new Phaser.Polygon(new Vector2(this.x, this.y), points);
            this.type = Phaser.GeomSprite.POLYGON;
            return this;
        };
        GeomSprite.prototype.refresh = function () {
            this.circle = null;
            this.line = null;
            this.point = null;
            this.rect = null;
        };
        GeomSprite.prototype.update = function () {
            if(this.type == Phaser.GeomSprite.UNASSIGNED) {
                return;
            } else if(this.type == Phaser.GeomSprite.CIRCLE) {
                this.circle.x = this.x;
                this.circle.y = this.y;
                this.frameBounds.width = this.circle.diameter;
                this.frameBounds.height = this.circle.diameter;
            } else if(this.type == Phaser.GeomSprite.LINE) {
                this.line.x1 = this.x;
                this.line.y1 = this.y;
                this.frameBounds.setTo(this.x, this.y, this.line.width, this.line.height);
            } else if(this.type == Phaser.GeomSprite.POINT) {
                this.point.x = this.x;
                this.point.y = this.y;
            } else if(this.type == Phaser.GeomSprite.RECTANGLE) {
                this.rect.x = this.x;
                this.rect.y = this.y;
                this.frameBounds.copyFrom(this.rect);
            }
        };
        GeomSprite.prototype.inCamera = function (camera) {
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx = this.frameBounds.x - (camera.x * this.scrollFactor.x);
                this._dy = this.frameBounds.y - (camera.y * this.scrollFactor.x);
                this._dw = this.frameBounds.width * this.scale.x;
                this._dh = this.frameBounds.height * this.scale.y;
                return (camera.right > this._dx) && (camera.x < this._dx + this._dw) && (camera.bottom > this._dy) && (camera.y < this._dy + this._dh);
            } else {
                return camera.intersects(this.frameBounds);
            }
        };
        GeomSprite.prototype.render = function (camera, cameraOffsetX, cameraOffsetY) {
            if(this.type == Phaser.GeomSprite.UNASSIGNED || this.visible === false || this.scale.x == 0 || this.scale.y == 0 || this.alpha < 0.1 || this.cameraBlacklist.indexOf(camera.ID) !== -1 || this.inCamera(camera.worldView) == false) {
                return false;
            }
            if(this.alpha !== 1) {
                var globalAlpha = this.context.globalAlpha;
                this.context.globalAlpha = this.alpha;
            }
            this._dx = cameraOffsetX + (this.frameBounds.x - camera.worldView.x);
            this._dy = cameraOffsetY + (this.frameBounds.y - camera.worldView.y);
            this._dw = this.frameBounds.width * this.scale.x;
            this._dh = this.frameBounds.height * this.scale.y;
            if(this.scrollFactor.x !== 1.0 || this.scrollFactor.y !== 1.0) {
                this._dx -= (camera.worldView.x * this.scrollFactor.x);
                this._dy -= (camera.worldView.y * this.scrollFactor.y);
            }
            this._dx = Math.round(this._dx);
            this._dy = Math.round(this._dy);
            this._dw = Math.round(this._dw);
            this._dh = Math.round(this._dh);
            this._game.stage.saveCanvasValues();
            this.context.lineWidth = this.lineWidth;
            this.context.strokeStyle = this.lineColor;
            this.context.fillStyle = this.fillColor;
            if(this._game.stage.fillStyle !== this.fillColor) {
            }
            if(this.type == Phaser.GeomSprite.CIRCLE) {
                this.context.beginPath();
                this.context.arc(this._dx, this._dy, this.circle.radius, 0, Math.PI * 2);
                if(this.renderOutline) {
                    this.context.stroke();
                }
                if(this.renderFill) {
                    this.context.fill();
                }
                this.context.closePath();
            } else if(this.type == Phaser.GeomSprite.LINE) {
                this.context.beginPath();
                this.context.moveTo(this._dx, this._dy);
                this.context.lineTo(this.line.x2, this.line.y2);
                this.context.stroke();
                this.context.closePath();
            } else if(this.type == Phaser.GeomSprite.POINT) {
                this.context.fillRect(this._dx, this._dy, 2, 2);
            } else if(this.type == Phaser.GeomSprite.RECTANGLE) {
                if(this.renderOutline == false) {
                    this.context.fillRect(this._dx, this._dy, this.rect.width, this.rect.height);
                } else {
                    this.context.beginPath();
                    this.context.rect(this._dx, this._dy, this.rect.width, this.rect.height);
                    this.context.stroke();
                    if(this.renderFill) {
                        this.context.fill();
                    }
                    this.context.closePath();
                }
                this.context.fillStyle = 'rgb(255,255,255)';
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
            if(this.rotation !== 0) {
                this.context.translate(0, 0);
                this.context.restore();
            }
            if(globalAlpha > -1) {
                this.context.globalAlpha = globalAlpha;
            }
            return true;
        };
        GeomSprite.prototype.renderPoint = function (point, offsetX, offsetY, size) {
            if (typeof offsetX === "undefined") { offsetX = 0; }
            if (typeof offsetY === "undefined") { offsetY = 0; }
            if (typeof size === "undefined") { size = 1; }
            this.context.fillRect(offsetX + point.x, offsetY + point.y, size, size);
        };
        GeomSprite.prototype.renderDebugInfo = function (x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
        };
        GeomSprite.prototype.collide = function (source) {
            if(this.type == Phaser.GeomSprite.CIRCLE && source.type == Phaser.GeomSprite.CIRCLE) {
                return Phaser.Collision.circleToCircle(this.circle, source.circle).result;
            }
            if(this.type == Phaser.GeomSprite.CIRCLE && source.type == Phaser.GeomSprite.RECTANGLE) {
                return Phaser.Collision.circleToRectangle(this.circle, source.rect).result;
            }
            if(this.type == Phaser.GeomSprite.CIRCLE && source.type == Phaser.GeomSprite.POINT) {
                return Phaser.Collision.circleContainsPoint(this.circle, source.point).result;
            }
            if(this.type == Phaser.GeomSprite.CIRCLE && source.type == Phaser.GeomSprite.LINE) {
                return Phaser.Collision.lineToCircle(source.line, this.circle).result;
            }
            if(this.type == Phaser.GeomSprite.RECTANGLE && source.type == Phaser.GeomSprite.RECTANGLE) {
                return Phaser.Collision.rectangleToRectangle(this.rect, source.rect).result;
            }
            if(this.type == Phaser.GeomSprite.RECTANGLE && source.type == Phaser.GeomSprite.CIRCLE) {
                return Phaser.Collision.circleToRectangle(source.circle, this.rect).result;
            }
            if(this.type == Phaser.GeomSprite.RECTANGLE && source.type == Phaser.GeomSprite.POINT) {
                return Phaser.Collision.pointToRectangle(source.point, this.rect).result;
            }
            if(this.type == Phaser.GeomSprite.RECTANGLE && source.type == Phaser.GeomSprite.LINE) {
                return Phaser.Collision.lineToRectangle(source.line, this.rect).result;
            }
            if(this.type == Phaser.GeomSprite.POINT && source.type == Phaser.GeomSprite.POINT) {
                return this.point.equals(source.point);
            }
            if(this.type == Phaser.GeomSprite.POINT && source.type == Phaser.GeomSprite.CIRCLE) {
                return Phaser.Collision.circleContainsPoint(source.circle, this.point).result;
            }
            if(this.type == Phaser.GeomSprite.POINT && source.type == Phaser.GeomSprite.RECTANGLE) {
                return Phaser.Collision.pointToRectangle(this.point, source.rect).result;
            }
            if(this.type == Phaser.GeomSprite.POINT && source.type == Phaser.GeomSprite.LINE) {
                return source.line.isPointOnLine(this.point.x, this.point.y);
            }
            if(this.type == Phaser.GeomSprite.LINE && source.type == Phaser.GeomSprite.LINE) {
                return Phaser.Collision.lineSegmentToLineSegment(this.line, source.line).result;
            }
            if(this.type == Phaser.GeomSprite.LINE && source.type == Phaser.GeomSprite.CIRCLE) {
                return Phaser.Collision.lineToCircle(this.line, source.circle).result;
            }
            if(this.type == Phaser.GeomSprite.LINE && source.type == Phaser.GeomSprite.RECTANGLE) {
                return Phaser.Collision.lineSegmentToRectangle(this.line, source.rect).result;
            }
            if(this.type == Phaser.GeomSprite.LINE && source.type == Phaser.GeomSprite.POINT) {
                return this.line.isPointOnLine(source.point.x, source.point.y);
            }
            return false;
        };
        return GeomSprite;
    })(Phaser.GameObject);
    Phaser.GeomSprite = GeomSprite;    
})(Phaser || (Phaser = {}));
