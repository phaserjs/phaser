var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="../math/Vec2.ts" />
    /// <reference path="../math/Vec2Utils.ts" />
    /**
    * Phaser - 2D AABB
    *
    * A 2D AABB object
    */
    (function (Physics) {
        var Bounds = (function () {
            /**
            * Creates a new 2D AABB object.
            * @class Bounds
            * @constructor
            * @return {Bounds} This object
            **/
            function Bounds(mins, maxs) {
                if (typeof mins === "undefined") { mins = null; }
                if (typeof maxs === "undefined") { maxs = null; }
                if(mins) {
                    this.mins = Phaser.Vec2Utils.clone(mins);
                } else {
                    this.mins = new Phaser.Vec2(999999, 999999);
                }
                if(maxs) {
                    this.maxs = Phaser.Vec2Utils.clone(maxs);
                } else {
                    this.maxs = new Phaser.Vec2(999999, 999999);
                }
            }
            Bounds.prototype.toString = function () {
                return [
                    "mins:", 
                    this.mins.toString(), 
                    "maxs:", 
                    this.maxs.toString()
                ].join(" ");
            };
            Bounds.prototype.setTo = function (mins, maxs) {
                this.mins.setTo(mins.x, mins.y);
                this.maxs.setTo(maxs.x, maxs.y);
            };
            Bounds.prototype.copy = function (b) {
                this.mins.copyFrom(b.mins);
                this.maxs.copyFrom(b.maxs);
                return this;
            };
            Bounds.prototype.clear = function () {
                this.mins.setTo(999999, 999999);
                this.maxs.setTo(-999999, -999999);
                return this;
            };
            Object.defineProperty(Bounds.prototype, "x", {
                get: function () {
                    return Physics.AdvancedPhysics.metersToPixels(this.mins.x);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bounds.prototype, "y", {
                get: function () {
                    return Physics.AdvancedPhysics.metersToPixels(this.mins.y);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bounds.prototype, "width", {
                get: function () {
                    return Physics.AdvancedPhysics.metersToPixels(this.maxs.x - this.mins.x);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bounds.prototype, "height", {
                get: function () {
                    return Physics.AdvancedPhysics.metersToPixels(this.maxs.y - this.mins.y);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bounds.prototype, "right", {
                get: function () {
                    return this.x + this.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bounds.prototype, "bottom", {
                get: function () {
                    return this.y + this.height;
                },
                enumerable: true,
                configurable: true
            });
            Bounds.prototype.isEmpty = function () {
                return (this.mins.x > this.maxs.x || this.mins.y > this.maxs.y);
            };
            Bounds.prototype.getPerimeter = /*
            public getCenter() {
            return vec2.scale(vec2.add(this.mins, this.maxs), 0.5);
            }
            
            public getExtent() {
            return vec2.scale(vec2.sub(this.maxs, this.mins), 0.5);
            }
            */
            function () {
                return (this.maxs.x - this.mins.x + this.maxs.y - this.mins.y) * 2;
            };
            Bounds.prototype.addPoint = function (p) {
                if(this.mins.x > p.x) {
                    this.mins.x = p.x;
                }
                if(this.maxs.x < p.x) {
                    this.maxs.x = p.x;
                }
                if(this.mins.y > p.y) {
                    this.mins.y = p.y;
                }
                if(this.maxs.y < p.y) {
                    this.maxs.y = p.y;
                }
                return this;
            };
            Bounds.prototype.addBounds = function (b) {
                if(this.mins.x > b.mins.x) {
                    this.mins.x = b.mins.x;
                }
                if(this.maxs.x < b.maxs.x) {
                    this.maxs.x = b.maxs.x;
                }
                if(this.mins.y > b.mins.y) {
                    this.mins.y = b.mins.y;
                }
                if(this.maxs.y < b.maxs.y) {
                    this.maxs.y = b.maxs.y;
                }
                return this;
            };
            Bounds.prototype.addBounds2 = function (mins, maxs) {
                if(this.mins.x > mins.x) {
                    this.mins.x = mins.x;
                }
                if(this.maxs.x < maxs.x) {
                    this.maxs.x = maxs.x;
                }
                if(this.mins.y > mins.y) {
                    this.mins.y = mins.y;
                }
                if(this.maxs.y < maxs.y) {
                    this.maxs.y = maxs.y;
                }
                return this;
            };
            Bounds.prototype.addExtents = function (center, extent_x, extent_y) {
                if(this.mins.x > center.x - extent_x) {
                    this.mins.x = center.x - extent_x;
                }
                if(this.maxs.x < center.x + extent_x) {
                    this.maxs.x = center.x + extent_x;
                }
                if(this.mins.y > center.y - extent_y) {
                    this.mins.y = center.y - extent_y;
                }
                if(this.maxs.y < center.y + extent_y) {
                    this.maxs.y = center.y + extent_y;
                }
                return this;
            };
            Bounds.prototype.expand = function (ax, ay) {
                this.mins.x -= ax;
                this.mins.y -= ay;
                this.maxs.x += ax;
                this.maxs.y += ay;
                return this;
            };
            Bounds.prototype.containPoint = function (p) {
                if(p.x < this.mins.x || p.x > this.maxs.x || p.y < this.mins.y || p.y > this.maxs.y) {
                    return false;
                }
                return true;
            };
            Bounds.prototype.intersectsBounds = function (b) {
                if(this.mins.x > b.maxs.x || this.maxs.x < b.mins.x || this.mins.y > b.maxs.y || this.maxs.y < b.mins.y) {
                    return false;
                }
                return true;
            };
            Bounds.expand = function expand(b, ax, ay) {
                var b = new Bounds(b.mins, b.maxs);
                b.expand(ax, ay);
                return b;
            };
            return Bounds;
        })();
        Physics.Bounds = Bounds;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
