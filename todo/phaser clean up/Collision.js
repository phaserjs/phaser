var Phaser;
(function (Phaser) {
    var Collision = (function () {
        function Collision(game) {
            this._game = game;
            Collision.T_VECTORS = [];
            for(var i = 0; i < 10; i++) {
                Collision.T_VECTORS.push(new Vector2());
            }
            Collision.T_ARRAYS = [];
            for(var i = 0; i < 5; i++) {
                Collision.T_ARRAYS.push([]);
            }
        }
        Collision.LEFT = 0x0001;
        Collision.RIGHT = 0x0010;
        Collision.UP = 0x0100;
        Collision.DOWN = 0x1000;
        Collision.NONE = 0;
        Collision.CEILING = Phaser.Collision.UP;
        Collision.FLOOR = Phaser.Collision.DOWN;
        Collision.WALL = Phaser.Collision.LEFT | Phaser.Collision.RIGHT;
        Collision.ANY = Phaser.Collision.LEFT | Phaser.Collision.RIGHT | Phaser.Collision.UP | Phaser.Collision.DOWN;
        Collision.OVERLAP_BIAS = 4;
        Collision.TILE_OVERLAP = false;
        Collision.lineToLine = function lineToLine(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);
            if(denominator !== 0) {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denominator;
            }
            return output;
        };
        Collision.lineToLineSegment = function lineToLineSegment(line, seg, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line.x1 - line.x2) * (seg.y1 - seg.y2) - (line.y1 - line.y2) * (seg.x1 - seg.x2);
            if(denominator !== 0) {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (seg.x1 - seg.x2) - (line.x1 - line.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denominator;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (seg.y1 - seg.y2) - (line.y1 - line.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denominator;
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);
                if((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true) {
                    output.result = true;
                }
            }
            return output;
        };
        Collision.lineToRawSegment = function lineToRawSegment(line, x1, y1, x2, y2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line.x1 - line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 - x2);
            if(denominator !== 0) {
                output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (x1 - x2) - (line.x1 - line.x2) * (x1 * y2 - y1 * x2)) / denominator;
                output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 * y2 - y1 * x2)) / denominator;
                var maxX = Math.max(x1, x2);
                var minX = Math.min(x1, x2);
                var maxY = Math.max(y1, y2);
                var minY = Math.min(y1, y2);
                if((output.x <= maxX && output.x >= minX) === true || (output.y <= maxY && output.y >= minY) === true) {
                    output.result = true;
                }
            }
            return output;
        };
        Collision.lineToRay = function lineToRay(line1, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var denominator = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);
            if(denominator !== 0) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denominator;
                output.result = true;
                if(!(ray.x1 >= ray.x2) && output.x < ray.x1) {
                    output.result = false;
                }
                if(!(ray.y1 >= ray.y2) && output.y < ray.y1) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineToCircle = function lineToCircle(line, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            if(line.perp(circle.x, circle.y).length <= circle.radius) {
                output.result = true;
            }
            return output;
        };
        Collision.lineToRectangle = function lineToRectangle(line, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Phaser.Collision.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);
            if(output.result === true) {
                return output;
            }
            Phaser.Collision.lineToRawSegment(line, rect.x, rect.y, rect.x, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            Phaser.Collision.lineToRawSegment(line, rect.x, rect.bottom, rect.right, rect.bottom, output);
            if(output.result === true) {
                return output;
            }
            Phaser.Collision.lineToRawSegment(line, rect.right, rect.y, rect.right, rect.bottom, output);
            return output;
        };
        Collision.lineSegmentToLineSegment = function lineSegmentToLineSegment(line1, line2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Phaser.Collision.lineToLineSegment(line1, line2);
            if(output.result === true) {
                if(!(output.x >= Math.min(line1.x1, line1.x2) && output.x <= Math.max(line1.x1, line1.x2) && output.y >= Math.min(line1.y1, line1.y2) && output.y <= Math.max(line1.y1, line1.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToRay = function lineSegmentToRay(line, ray, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Phaser.Collision.lineToRay(line, ray, output);
            if(output.result === true) {
                if(!(output.x >= Math.min(line.x1, line.x2) && output.x <= Math.max(line.x1, line.x2) && output.y >= Math.min(line.y1, line.y2) && output.y <= Math.max(line.y1, line.y2))) {
                    output.result = false;
                }
            }
            return output;
        };
        Collision.lineSegmentToCircle = function lineSegmentToCircle(seg, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var perp = seg.perp(circle.x, circle.y);
            if(perp.length <= circle.radius) {
                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);
                if((perp.x2 <= maxX && perp.x2 >= minX) && (perp.y2 <= maxY && perp.y2 >= minY)) {
                    output.result = true;
                } else {
                    if(Phaser.Collision.circleContainsPoint(circle, {
                        x: seg.x1,
                        y: seg.y1
                    }) || Phaser.Collision.circleContainsPoint(circle, {
                        x: seg.x2,
                        y: seg.y2
                    })) {
                        output.result = true;
                    }
                }
            }
            return output;
        };
        Collision.lineSegmentToRectangle = function lineSegmentToRectangle(seg, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            if(rect.contains(seg.x1, seg.y1) && rect.contains(seg.x2, seg.y2)) {
                output.result = true;
            } else {
                Phaser.Collision.lineToRawSegment(seg, rect.x, rect.y, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                Phaser.Collision.lineToRawSegment(seg, rect.x, rect.y, rect.x, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                Phaser.Collision.lineToRawSegment(seg, rect.x, rect.bottom, rect.right, rect.bottom, output);
                if(output.result === true) {
                    return output;
                }
                Phaser.Collision.lineToRawSegment(seg, rect.right, rect.y, rect.right, rect.bottom, output);
                return output;
            }
            return output;
        };
        Collision.rayToRectangle = function rayToRectangle(ray, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            Phaser.Collision.lineToRectangle(ray, rect, output);
            return output;
        };
        Collision.rayToLineSegment = function rayToLineSegment(rayX1, rayY1, rayX2, rayY2, lineX1, lineY1, lineX2, lineY2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var r;
            var s;
            var d;
            if((rayY2 - rayY1) / (rayX2 - rayX1) != (lineY2 - lineY1) / (lineX2 - lineX1)) {
                d = (((rayX2 - rayX1) * (lineY2 - lineY1)) - (rayY2 - rayY1) * (lineX2 - lineX1));
                if(d != 0) {
                    r = (((rayY1 - lineY1) * (lineX2 - lineX1)) - (rayX1 - lineX1) * (lineY2 - lineY1)) / d;
                    s = (((rayY1 - lineY1) * (rayX2 - rayX1)) - (rayX1 - lineX1) * (rayY2 - rayY1)) / d;
                    if(r >= 0) {
                        if(s >= 0 && s <= 1) {
                            output.result = true;
                            output.x = rayX1 + r * (rayX2 - rayX1);
                            output.y = rayY1 + r * (rayY2 - rayY1);
                        }
                    }
                }
            }
            return output;
        };
        Collision.pointToRectangle = function pointToRectangle(point, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.setTo(point.x, point.y);
            output.result = rect.containsPoint(point);
            return output;
        };
        Collision.rectangleToRectangle = function rectangleToRectangle(rect1, rect2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var leftX = Math.max(rect1.x, rect2.x);
            var rightX = Math.min(rect1.right, rect2.right);
            var topY = Math.max(rect1.y, rect2.y);
            var bottomY = Math.min(rect1.bottom, rect2.bottom);
            output.setTo(leftX, topY, rightX - leftX, bottomY - topY, rightX - leftX, bottomY - topY);
            var cx = output.x + output.width * .5;
            var cy = output.y + output.height * .5;
            if((cx > rect1.x && cx < rect1.right) && (cy > rect1.y && cy < rect1.bottom)) {
                output.result = true;
            }
            return output;
        };
        Collision.rectangleToCircle = function rectangleToCircle(rect, circle, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            return Phaser.Collision.circleToRectangle(circle, rect, output);
        };
        Collision.circleToCircle = function circleToCircle(circle1, circle2, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius)) >= Phaser.Collision.distanceSquared(circle1.x, circle1.y, circle2.x, circle2.y);
            return output;
        };
        Collision.circleToRectangle = function circleToRectangle(circle, rect, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            var inflatedRect = rect.clone();
            inflatedRect.inflate(circle.radius, circle.radius);
            output.result = inflatedRect.contains(circle.x, circle.y);
            return output;
        };
        Collision.circleContainsPoint = function circleContainsPoint(circle, point, output) {
            if (typeof output === "undefined") { output = new Phaser.IntersectResult(); }
            output.result = circle.radius * circle.radius >= Phaser.Collision.distanceSquared(circle.x, circle.y, point.x, point.y);
            return output;
        };
        Collision.prototype.overlap = function (object1, object2, notifyCallback, processCallback, context) {
            if (typeof object1 === "undefined") { object1 = null; }
            if (typeof object2 === "undefined") { object2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if (typeof context === "undefined") { context = null; }
            if(object1 == null) {
                object1 = this._game.world.group;
            }
            if(object2 == object1) {
                object2 = null;
            }
            Phaser.QuadTree.divisions = this._game.world.worldDivisions;
            var quadTree = new Phaser.QuadTree(this._game.world.bounds.x, this._game.world.bounds.y, this._game.world.bounds.width, this._game.world.bounds.height);
            quadTree.load(object1, object2, notifyCallback, processCallback, context);
            var result = quadTree.execute();
            quadTree.destroy();
            quadTree = null;
            return result;
        };
        Collision.separate = function separate(object1, object2) {
            object1.collisionMask.update();
            object2.collisionMask.update();
            var separatedX = Phaser.Collision.separateX(object1, object2);
            var separatedY = Phaser.Collision.separateY(object1, object2);
            return separatedX || separatedY;
        };
        Collision.separateTile = function separateTile(object, x, y, width, height, mass, collideLeft, collideRight, collideUp, collideDown, separateX, separateY) {
            object.collisionMask.update();
            var separatedX = Phaser.Collision.separateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separateX);
            var separatedY = Phaser.Collision.separateTileY(object, x, y, width, height, mass, collideUp, collideDown, separateY);
            return separatedX || separatedY;
        };
        Collision.separateTileX = function separateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separate) {
            if(object.immovable) {
                return false;
            }
            var overlap = 0;
            var objDelta = object.x - object.last.x;
            if(objDelta != 0) {
                var objDeltaAbs = (objDelta > 0) ? objDelta : -objDelta;
                var objBounds = new Phaser.Quad(object.x - ((objDelta > 0) ? objDelta : 0), object.last.y, object.width + ((objDelta > 0) ? objDelta : -objDelta), object.height);
                if((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height)) {
                    var maxOverlap = objDeltaAbs + Phaser.Collision.OVERLAP_BIAS;
                    if(objDelta > 0) {
                        overlap = object.x + object.width - x;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.RIGHT) || collideLeft == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.RIGHT;
                        }
                    } else if(objDelta < 0) {
                        overlap = object.x - width - x;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.LEFT) || collideRight == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.LEFT;
                        }
                    }
                }
            }
            if(overlap != 0) {
                if(separate == true) {
                    object.x = object.x - overlap;
                    object.velocity.x = -(object.velocity.x * object.elasticity);
                }
                Phaser.Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.separateTileY = function separateTileY(object, x, y, width, height, mass, collideUp, collideDown, separate) {
            if(object.immovable) {
                return false;
            }
            var overlap = 0;
            var objDelta = object.y - object.last.y;
            if(objDelta != 0) {
                var objDeltaAbs = (objDelta > 0) ? objDelta : -objDelta;
                var objBounds = new Phaser.Quad(object.x, object.y - ((objDelta > 0) ? objDelta : 0), object.width, object.height + objDeltaAbs);
                if((objBounds.x + objBounds.width > x) && (objBounds.x < x + width) && (objBounds.y + objBounds.height > y) && (objBounds.y < y + height)) {
                    var maxOverlap = objDeltaAbs + Phaser.Collision.OVERLAP_BIAS;
                    if(objDelta > 0) {
                        overlap = object.y + object.height - y;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.DOWN) || collideUp == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.DOWN;
                        }
                    } else if(objDelta < 0) {
                        overlap = object.y - height - y;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.UP) || collideDown == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.UP;
                        }
                    }
                }
            }
            if(overlap != 0) {
                if(separate == true) {
                    object.y = object.y - overlap;
                    object.velocity.y = -(object.velocity.y * object.elasticity);
                }
                Phaser.Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.NEWseparateTileX = function NEWseparateTileX(object, x, y, width, height, mass, collideLeft, collideRight, separate) {
            if(object.immovable) {
                return false;
            }
            var overlap = 0;
            if(object.collisionMask.deltaX != 0) {
                if(object.collisionMask.intersectsRaw(x, x + width, y, y + height)) {
                    var maxOverlap = object.collisionMask.deltaXAbs + Phaser.Collision.OVERLAP_BIAS;
                    if(object.collisionMask.deltaX > 0) {
                        overlap = object.collisionMask.right - x;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.RIGHT) || collideLeft == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.RIGHT;
                        }
                    } else if(object.collisionMask.deltaX < 0) {
                        overlap = object.collisionMask.x - width - x;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.LEFT) || collideRight == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.LEFT;
                        }
                    }
                }
            }
            if(overlap != 0) {
                if(separate == true) {
                    object.x = object.x - overlap;
                    object.velocity.x = -(object.velocity.x * object.elasticity);
                }
                Phaser.Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.NEWseparateTileY = function NEWseparateTileY(object, x, y, width, height, mass, collideUp, collideDown, separate) {
            if(object.immovable) {
                return false;
            }
            var overlap = 0;
            if(object.collisionMask.deltaY != 0) {
                if(object.collisionMask.intersectsRaw(x, x + width, y, y + height)) {
                    var maxOverlap = object.collisionMask.deltaYAbs + Phaser.Collision.OVERLAP_BIAS;
                    if(object.collisionMask.deltaY > 0) {
                        overlap = object.collisionMask.bottom - y;
                        if((overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.DOWN) || collideUp == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.DOWN;
                        }
                    } else if(object.collisionMask.deltaY < 0) {
                        overlap = object.collisionMask.y - height - y;
                        if((-overlap > maxOverlap) || !(object.allowCollisions & Phaser.Collision.UP) || collideDown == false) {
                            overlap = 0;
                        } else {
                            object.touching |= Phaser.Collision.UP;
                        }
                    }
                }
            }
            if(overlap != 0) {
                if(separate == true) {
                    object.y = object.y - overlap;
                    object.velocity.y = -(object.velocity.y * object.elasticity);
                }
                Phaser.Collision.TILE_OVERLAP = true;
                return true;
            } else {
                return false;
            }
        };
        Collision.separateX = function separateX(object1, object2) {
            if(object1.immovable && object2.immovable) {
                return false;
            }
            var overlap = 0;
            if(object1.collisionMask.deltaX != object2.collisionMask.deltaX) {
                if(object1.collisionMask.intersects(object2.collisionMask)) {
                    var maxOverlap = object1.collisionMask.deltaXAbs + object2.collisionMask.deltaXAbs + Phaser.Collision.OVERLAP_BIAS;
                    if(object1.collisionMask.deltaX > object2.collisionMask.deltaX) {
                        overlap = object1.collisionMask.right - object2.collisionMask.x;
                        if((overlap > maxOverlap) || !(object1.allowCollisions & Phaser.Collision.RIGHT) || !(object2.allowCollisions & Phaser.Collision.LEFT)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Phaser.Collision.RIGHT;
                            object2.touching |= Phaser.Collision.LEFT;
                        }
                    } else if(object1.collisionMask.deltaX < object2.collisionMask.deltaX) {
                        overlap = object1.collisionMask.x - object2.collisionMask.width - object2.collisionMask.x;
                        if((-overlap > maxOverlap) || !(object1.allowCollisions & Phaser.Collision.LEFT) || !(object2.allowCollisions & Phaser.Collision.RIGHT)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Phaser.Collision.LEFT;
                            object2.touching |= Phaser.Collision.RIGHT;
                        }
                    }
                }
            }
            if(overlap != 0) {
                var obj1Velocity = object1.velocity.x;
                var obj2Velocity = object2.velocity.x;
                if(!object1.immovable && !object2.immovable) {
                    overlap *= 0.5;
                    object1.x = object1.x - overlap;
                    object2.x += overlap;
                    var obj1NewVelocity = Math.sqrt((obj2Velocity * obj2Velocity * object2.mass) / object1.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity = Math.sqrt((obj1Velocity * obj1Velocity * object1.mass) / object2.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.velocity.x = average + obj1NewVelocity * object1.elasticity;
                    object2.velocity.x = average + obj2NewVelocity * object2.elasticity;
                } else if(!object1.immovable) {
                    object1.x = object1.x - overlap;
                    object1.velocity.x = obj2Velocity - obj1Velocity * object1.elasticity;
                } else if(!object2.immovable) {
                    object2.x += overlap;
                    object2.velocity.x = obj1Velocity - obj2Velocity * object2.elasticity;
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.separateY = function separateY(object1, object2) {
            if(object1.immovable && object2.immovable) {
                return false;
            }
            var overlap = 0;
            if(object1.collisionMask.deltaY != object2.collisionMask.deltaY) {
                if(object1.collisionMask.intersects(object2.collisionMask)) {
                    var maxOverlap = object1.collisionMask.deltaYAbs + object2.collisionMask.deltaYAbs + Phaser.Collision.OVERLAP_BIAS;
                    if(object1.collisionMask.deltaY > object2.collisionMask.deltaY) {
                        overlap = object1.collisionMask.bottom - object2.collisionMask.y;
                        if((overlap > maxOverlap) || !(object1.allowCollisions & Phaser.Collision.DOWN) || !(object2.allowCollisions & Phaser.Collision.UP)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Phaser.Collision.DOWN;
                            object2.touching |= Phaser.Collision.UP;
                        }
                    } else if(object1.collisionMask.deltaY < object2.collisionMask.deltaY) {
                        overlap = object1.collisionMask.y - object2.collisionMask.height - object2.collisionMask.y;
                        if((-overlap > maxOverlap) || !(object1.allowCollisions & Phaser.Collision.UP) || !(object2.allowCollisions & Phaser.Collision.DOWN)) {
                            overlap = 0;
                        } else {
                            object1.touching |= Phaser.Collision.UP;
                            object2.touching |= Phaser.Collision.DOWN;
                        }
                    }
                }
            }
            if(overlap != 0) {
                var obj1Velocity = object1.velocity.y;
                var obj2Velocity = object2.velocity.y;
                if(!object1.immovable && !object2.immovable) {
                    overlap *= 0.5;
                    object1.y = object1.y - overlap;
                    object2.y += overlap;
                    var obj1NewVelocity = Math.sqrt((obj2Velocity * obj2Velocity * object2.mass) / object1.mass) * ((obj2Velocity > 0) ? 1 : -1);
                    var obj2NewVelocity = Math.sqrt((obj1Velocity * obj1Velocity * object1.mass) / object2.mass) * ((obj1Velocity > 0) ? 1 : -1);
                    var average = (obj1NewVelocity + obj2NewVelocity) * 0.5;
                    obj1NewVelocity -= average;
                    obj2NewVelocity -= average;
                    object1.velocity.y = average + obj1NewVelocity * object1.elasticity;
                    object2.velocity.y = average + obj2NewVelocity * object2.elasticity;
                } else if(!object1.immovable) {
                    object1.y = object1.y - overlap;
                    object1.velocity.y = obj2Velocity - obj1Velocity * object1.elasticity;
                    if(object2.active && object2.moves && (object1.collisionMask.deltaY > object2.collisionMask.deltaY)) {
                        object1.x += object2.x - object2.last.x;
                    }
                } else if(!object2.immovable) {
                    object2.y += overlap;
                    object2.velocity.y = obj1Velocity - obj2Velocity * object2.elasticity;
                    if(object1.active && object1.moves && (object1.collisionMask.deltaY < object2.collisionMask.deltaY)) {
                        object2.x += object1.x - object1.last.x;
                    }
                }
                return true;
            } else {
                return false;
            }
        };
        Collision.distance = function distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        };
        Collision.distanceSquared = function distanceSquared(x1, y1, x2, y2) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        };
        Collision.flattenPointsOn = function flattenPointsOn(points, normal, result) {
            var min = Number.MAX_VALUE;
            var max = -Number.MAX_VALUE;
            var len = points.length;
            for(var i = 0; i < len; i++) {
                var dot = points[i].dot(normal);
                if(dot < min) {
                    min = dot;
                }
                if(dot > max) {
                    max = dot;
                }
            }
            result[0] = min;
            result[1] = max;
        };
        Collision.isSeparatingAxis = function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
            if (typeof response === "undefined") { response = null; }
            var rangeA = Phaser.Collision.T_ARRAYS.pop();
            var rangeB = Phaser.Collision.T_ARRAYS.pop();
            var offsetV = Phaser.Collision.T_VECTORS.pop().copyFrom(bPos).sub(aPos);
            var projectedOffset = offsetV.dot(axis);
            Phaser.Collision.flattenPointsOn(aPoints, axis, rangeA);
            Phaser.Collision.flattenPointsOn(bPoints, axis, rangeB);
            rangeB[0] += projectedOffset;
            rangeB[1] += projectedOffset;
            if(rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
                Phaser.Collision.T_VECTORS.push(offsetV);
                Phaser.Collision.T_ARRAYS.push(rangeA);
                Phaser.Collision.T_ARRAYS.push(rangeB);
                return true;
            }
            if(response) {
                var overlap = 0;
                if(rangeA[0] < rangeB[0]) {
                    response.aInB = false;
                    if(rangeA[1] < rangeB[1]) {
                        overlap = rangeA[1] - rangeB[0];
                        response.bInA = false;
                    } else {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                } else {
                    response.bInA = false;
                    if(rangeA[1] > rangeB[1]) {
                        overlap = rangeA[0] - rangeB[1];
                        response.aInB = false;
                    } else {
                        var option1 = rangeA[1] - rangeB[0];
                        var option2 = rangeB[1] - rangeA[0];
                        overlap = option1 < option2 ? option1 : -option2;
                    }
                }
                var absOverlap = Math.abs(overlap);
                if(absOverlap < response.overlap) {
                    response.overlap = absOverlap;
                    response.overlapN.copyFrom(axis);
                    if(overlap < 0) {
                        response.overlapN.reverse();
                    }
                }
            }
            Phaser.Collision.T_VECTORS.push(offsetV);
            Phaser.Collision.T_ARRAYS.push(rangeA);
            Phaser.Collision.T_ARRAYS.push(rangeB);
            return false;
        };
        Collision.LEFT_VORNOI_REGION = -1;
        Collision.MIDDLE_VORNOI_REGION = 0;
        Collision.RIGHT_VORNOI_REGION = 1;
        Collision.vornoiRegion = function vornoiRegion(line, point) {
            var len2 = line.length2();
            var dp = point.dot(line);
            if(dp < 0) {
                return Phaser.Collision.LEFT_VORNOI_REGION;
            } else if(dp > len2) {
                return Phaser.Collision.RIGHT_VORNOI_REGION;
            } else {
                return Phaser.Collision.MIDDLE_VORNOI_REGION;
            }
        };
        Collision.testCircleCircle = function testCircleCircle(a, b, response) {
            if (typeof response === "undefined") { response = null; }
            var differenceV = Phaser.Collision.T_VECTORS.pop().copyFrom(b.pos).sub(a.pos);
            var totalRadius = a.radius + b.radius;
            var totalRadiusSq = totalRadius * totalRadius;
            var distanceSq = differenceV.length2();
            if(distanceSq > totalRadiusSq) {
                Phaser.Collision.T_VECTORS.push(differenceV);
                return false;
            }
            if(response) {
                var dist = Math.sqrt(distanceSq);
                response.a = a;
                response.b = b;
                response.overlap = totalRadius - dist;
                response.overlapN.copyFrom(differenceV.normalize());
                response.overlapV.copyFrom(differenceV).scale(response.overlap);
                response.aInB = a.radius <= b.radius && dist <= b.radius - a.radius;
                response.bInA = b.radius <= a.radius && dist <= a.radius - b.radius;
            }
            Phaser.Collision.T_VECTORS.push(differenceV);
            return true;
        };
        Collision.testPolygonCircle = function testPolygonCircle(polygon, circle, response) {
            if (typeof response === "undefined") { response = null; }
            var circlePos = Phaser.Collision.T_VECTORS.pop().copyFrom(circle.pos).sub(polygon.pos);
            var radius = circle.radius;
            var radius2 = radius * radius;
            var points = polygon.points;
            var len = points.length;
            var edge = Collision.T_VECTORS.pop();
            var point = Collision.T_VECTORS.pop();
            for(var i = 0; i < len; i++) {
                var next = i === len - 1 ? 0 : i + 1;
                var prev = i === 0 ? len - 1 : i - 1;
                var overlap = 0;
                var overlapN = null;
                edge.copyFrom(polygon.edges[i]);
                point.copyFrom(circlePos).sub(points[i]);
                if(response && point.length2() > radius2) {
                    response.aInB = false;
                }
                var region = Collision.vornoiRegion(edge, point);
                if(region === Phaser.Collision.LEFT_VORNOI_REGION) {
                    edge.copyFrom(polygon.edges[prev]);
                    var point2 = Phaser.Collision.T_VECTORS.pop().copyFrom(circlePos).sub(points[prev]);
                    region = Collision.vornoiRegion(edge, point2);
                    if(region === Phaser.Collision.RIGHT_VORNOI_REGION) {
                        var dist = point.length2();
                        if(dist > radius) {
                            Phaser.Collision.T_VECTORS.push(circlePos);
                            Phaser.Collision.T_VECTORS.push(edge);
                            Phaser.Collision.T_VECTORS.push(point);
                            Phaser.Collision.T_VECTORS.push(point2);
                            return false;
                        } else if(response) {
                            response.bInA = false;
                            overlapN = point.normalize();
                            overlap = radius - dist;
                        }
                    }
                    Phaser.Collision.T_VECTORS.push(point2);
                } else if(region === Phaser.Collision.RIGHT_VORNOI_REGION) {
                    edge.copyFrom(polygon.edges[next]);
                    point.copyFrom(circlePos).sub(points[next]);
                    region = Collision.vornoiRegion(edge, point);
                    if(region === Phaser.Collision.LEFT_VORNOI_REGION) {
                        var dist = point.length2();
                        if(dist > radius) {
                            Phaser.Collision.T_VECTORS.push(circlePos);
                            Phaser.Collision.T_VECTORS.push(edge);
                            Phaser.Collision.T_VECTORS.push(point);
                            return false;
                        } else if(response) {
                            response.bInA = false;
                            overlapN = point.normalize();
                            overlap = radius - dist;
                        }
                    }
                } else {
                    var normal = edge.perp().normalize();
                    var dist = point.dot(normal);
                    var distAbs = Math.abs(dist);
                    if(dist > 0 && distAbs > radius) {
                        Phaser.Collision.T_VECTORS.push(circlePos);
                        Phaser.Collision.T_VECTORS.push(normal);
                        Phaser.Collision.T_VECTORS.push(point);
                        return false;
                    } else if(response) {
                        overlapN = normal;
                        overlap = radius - dist;
                        if(dist >= 0 || overlap < 2 * radius) {
                            response.bInA = false;
                        }
                    }
                }
                if(overlapN && response && Math.abs(overlap) < Math.abs(response.overlap)) {
                    response.overlap = overlap;
                    response.overlapN.copyFrom(overlapN);
                }
            }
            if(response) {
                response.a = polygon;
                response.b = circle;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }
            Phaser.Collision.T_VECTORS.push(circlePos);
            Phaser.Collision.T_VECTORS.push(edge);
            Phaser.Collision.T_VECTORS.push(point);
            return true;
        };
        Collision.testCirclePolygon = function testCirclePolygon(circle, polygon, response) {
            if (typeof response === "undefined") { response = null; }
            var result = Phaser.Collision.testPolygonCircle(polygon, circle, response);
            if(result && response) {
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
        };
        Collision.testPolygonPolygon = function testPolygonPolygon(a, b, response) {
            if (typeof response === "undefined") { response = null; }
            var aPoints = a.points;
            var aLen = aPoints.length;
            var bPoints = b.points;
            var bLen = bPoints.length;
            for(var i = 0; i < aLen; i++) {
                if(Phaser.Collision.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[i], response)) {
                    return false;
                }
            }
            for(var i = 0; i < bLen; i++) {
                if(Phaser.Collision.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
                    return false;
                }
            }
            if(response) {
                response.a = a;
                response.b = b;
                response.overlapV.copyFrom(response.overlapN).scale(response.overlap);
            }
            return true;
        };
        return Collision;
    })();
    Phaser.Collision = Collision;    
})(Phaser || (Phaser = {}));
