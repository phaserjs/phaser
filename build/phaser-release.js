var Phaser;
(function (Phaser) {
    Phaser.VERSION = 'Phaser version 1.0.0';
    Phaser.GAMES = [];
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Types = (function () {
        function Types() { }
        Types.RENDERER_AUTO_DETECT = 0;
        Types.RENDERER_HEADLESS = 1;
        Types.RENDERER_CANVAS = 2;
        Types.RENDERER_WEBGL = 3;
        Types.CAMERA_TYPE_ORTHOGRAPHIC = 0;
        Types.CAMERA_TYPE_ISOMETRIC = 1;
        Types.CAMERA_FOLLOW_LOCKON = 0;
        Types.CAMERA_FOLLOW_PLATFORMER = 1;
        Types.CAMERA_FOLLOW_TOPDOWN = 2;
        Types.CAMERA_FOLLOW_TOPDOWN_TIGHT = 3;
        Types.GROUP = 0;
        Types.SPRITE = 1;
        Types.GEOMSPRITE = 2;
        Types.PARTICLE = 3;
        Types.EMITTER = 4;
        Types.TILEMAP = 5;
        Types.SCROLLZONE = 6;
        Types.BUTTON = 7;
        Types.DYNAMICTEXTURE = 8;
        Types.GEOM_POINT = 0;
        Types.GEOM_CIRCLE = 1;
        Types.GEOM_RECTANGLE = 2;
        Types.GEOM_LINE = 3;
        Types.GEOM_POLYGON = 4;
        Types.BODY_DISABLED = 0;
        Types.BODY_STATIC = 1;
        Types.BODY_KINETIC = 2;
        Types.BODY_DYNAMIC = 3;
        Types.OUT_OF_BOUNDS_KILL = 0;
        Types.OUT_OF_BOUNDS_DESTROY = 1;
        Types.OUT_OF_BOUNDS_PERSIST = 2;
        Types.SORT_ASCENDING = -1;
        Types.SORT_DESCENDING = 1;
        Types.LEFT = 0x0001;
        Types.RIGHT = 0x0010;
        Types.UP = 0x0100;
        Types.DOWN = 0x1000;
        Types.NONE = 0;
        Types.CEILING = 0x0100;
        Types.FLOOR = 0x1000;
        Types.WALL = 0x0001 | 0x0010;
        Types.ANY = 0x0001 | 0x0010 | 0x0100 | 0x1000;
        return Types;
    })();
    Phaser.Types = Types;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Point = (function () {
        function Point(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y);
        };
        Point.prototype.invert = function () {
            return this.setTo(this.y, this.x);
        };
        Point.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.toString = function () {
            return '[{Point (x=' + this.x + ' y=' + this.y + ')}]';
        };
        return Point;
    })();
    Phaser.Point = Point;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Object.defineProperty(Rectangle.prototype, "halfWidth", {
            get: function () {
                return Math.round(this.width / 2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "halfHeight", {
            get: function () {
                return Math.round(this.height / 2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () {
                return this.y + this.height;
            },
            set: function (value) {
                if(value <= this.y) {
                    this.height = 0;
                } else {
                    this.height = (this.y - value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottomRight", {
            set: function (value) {
                this.right = value.x;
                this.bottom = value.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "left", {
            get: function () {
                return this.x;
            },
            set: function (value) {
                if(value >= this.right) {
                    this.width = 0;
                } else {
                    this.width = this.right - value;
                }
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            get: function () {
                return this.x + this.width;
            },
            set: function (value) {
                if(value <= this.x) {
                    this.width = 0;
                } else {
                    this.width = this.x + value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "volume", {
            get: function () {
                return this.width * this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "perimeter", {
            get: function () {
                return (this.width * 2) + (this.height * 2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            get: function () {
                return this.y;
            },
            set: function (value) {
                if(value >= this.bottom) {
                    this.height = 0;
                    this.y = value;
                } else {
                    this.height = (this.bottom - value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "topLeft", {
            set: function (value) {
                this.x = value.x;
                this.y = value.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "empty", {
            get: function () {
                return (!this.width || !this.height);
            },
            set: function (value) {
                this.setTo(0, 0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        };
        Rectangle.prototype.offsetPoint = function (point) {
            return this.offset(point.x, point.y);
        };
        Rectangle.prototype.setTo = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        Rectangle.prototype.floor = function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
        };
        Rectangle.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y, source.width, source.height);
        };
        Rectangle.prototype.toString = function () {
            return "[{Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + " empty=" + this.empty + ")}]";
        };
        return Rectangle;
    })();
    Phaser.Rectangle = Rectangle;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Circle = (function () {
        function Circle(x, y, diameter) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof diameter === "undefined") { diameter = 0; }
            this._diameter = 0;
            this._radius = 0;
            this.x = 0;
            this.y = 0;
            this.setTo(x, y, diameter);
        }
        Object.defineProperty(Circle.prototype, "diameter", {
            get: function () {
                return this._diameter;
            },
            set: function (value) {
                if(value > 0) {
                    this._diameter = value;
                    this._radius = value * 0.5;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                if(value > 0) {
                    this._radius = value;
                    this._diameter = value * 2;
                }
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.circumference = function () {
            return 2 * (Math.PI * this._radius);
        };
        Object.defineProperty(Circle.prototype, "bottom", {
            get: function () {
                return this.y + this._radius;
            },
            set: function (value) {
                if(value < this.y) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = value - this.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "left", {
            get: function () {
                return this.x - this._radius;
            },
            set: function (value) {
                if(value > this.x) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = this.x - value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "right", {
            get: function () {
                return this.x + this._radius;
            },
            set: function (value) {
                if(value < this.x) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = value - this.x;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "top", {
            get: function () {
                return this.y - this._radius;
            },
            set: function (value) {
                if(value > this.y) {
                    this._radius = 0;
                    this._diameter = 0;
                } else {
                    this.radius = this.y - value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "area", {
            get: function () {
                if(this._radius > 0) {
                    return Math.PI * this._radius * this._radius;
                } else {
                    return 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.setTo = function (x, y, diameter) {
            this.x = x;
            this.y = y;
            this._diameter = diameter;
            this._radius = diameter * 0.5;
            return this;
        };
        Circle.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y, source.diameter);
        };
        Object.defineProperty(Circle.prototype, "empty", {
            get: function () {
                return (this._diameter == 0);
            },
            set: function (value) {
                this.setTo(0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
            return this;
        };
        Circle.prototype.offsetPoint = function (point) {
            return this.offset(point.x, point.y);
        };
        Circle.prototype.toString = function () {
            return "[{Circle (x=" + this.x + " y=" + this.y + " diameter=" + this.diameter + " radius=" + this.radius + ")}]";
        };
        return Circle;
    })();
    Phaser.Circle = Circle;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Line = (function () {
        function Line(x1, y1, x2, y2) {
            if (typeof x1 === "undefined") { x1 = 0; }
            if (typeof y1 === "undefined") { y1 = 0; }
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
            this.setTo(x1, y1, x2, y2);
        }
        Line.prototype.clone = function (output) {
            if (typeof output === "undefined") { output = new Line(); }
            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        };
        Line.prototype.copyFrom = function (source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        };
        Line.prototype.copyTo = function (target) {
            return target.copyFrom(this);
        };
        Line.prototype.setTo = function (x1, y1, x2, y2) {
            if (typeof x1 === "undefined") { x1 = 0; }
            if (typeof y1 === "undefined") { y1 = 0; }
            if (typeof x2 === "undefined") { x2 = 0; }
            if (typeof y2 === "undefined") { y2 = 0; }
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            return this;
        };
        Object.defineProperty(Line.prototype, "width", {
            get: function () {
                return Math.max(this.x1, this.x2) - Math.min(this.x1, this.x2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "height", {
            get: function () {
                return Math.max(this.y1, this.y2) - Math.min(this.y1, this.y2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "length", {
            get: function () {
                return Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.getY = function (x) {
            return this.slope * x + this.yIntercept;
        };
        Object.defineProperty(Line.prototype, "angle", {
            get: function () {
                return Math.atan2(this.x2 - this.x1, this.y2 - this.y1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "slope", {
            get: function () {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "perpSlope", {
            get: function () {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "yIntercept", {
            get: function () {
                return (this.y1 - this.slope * this.x1);
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.isPointOnLine = function (x, y) {
            if((x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1)) {
                return true;
            } else {
                return false;
            }
        };
        Line.prototype.isPointOnLineSegment = function (x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);
            if(this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax)) {
                return true;
            } else {
                return false;
            }
        };
        Line.prototype.intersectLineLine = function (line) {
        };
        Line.prototype.toString = function () {
            return "[{Line (x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " y2=" + this.y2 + ")}]";
        };
        return Line;
    })();
    Phaser.Line = Line;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var GameMath = (function () {
        function GameMath(game) {
            this.cosTable = [];
            this.sinTable = [];
            this.game = game;
            GameMath.sinA = [];
            GameMath.cosA = [];
            for(var i = 0; i < 360; i++) {
                GameMath.sinA.push(Math.sin(this.degreesToRadians(i)));
                GameMath.cosA.push(Math.cos(this.degreesToRadians(i)));
            }
        }
        GameMath.PI = 3.141592653589793;
        GameMath.PI_2 = 1.5707963267948965;
        GameMath.PI_4 = 0.7853981633974483;
        GameMath.PI_8 = 0.39269908169872413;
        GameMath.PI_16 = 0.19634954084936206;
        GameMath.TWO_PI = 6.283185307179586;
        GameMath.THREE_PI_2 = 4.7123889803846895;
        GameMath.E = 2.71828182845905;
        GameMath.LN10 = 2.302585092994046;
        GameMath.LN2 = 0.6931471805599453;
        GameMath.LOG10E = 0.4342944819032518;
        GameMath.LOG2E = 1.442695040888963387;
        GameMath.SQRT1_2 = 0.7071067811865476;
        GameMath.SQRT2 = 1.4142135623730951;
        GameMath.DEG_TO_RAD = 0.017453292519943294444444444444444;
        GameMath.RAD_TO_DEG = 57.295779513082325225835265587527;
        GameMath.B_16 = 65536;
        GameMath.B_31 = 2147483648;
        GameMath.B_32 = 4294967296;
        GameMath.B_48 = 281474976710656;
        GameMath.B_53 = 9007199254740992;
        GameMath.B_64 = 18446744073709551616;
        GameMath.ONE_THIRD = 0.333333333333333333333333333333333;
        GameMath.TWO_THIRDS = 0.666666666666666666666666666666666;
        GameMath.ONE_SIXTH = 0.166666666666666666666666666666666;
        GameMath.COS_PI_3 = 0.86602540378443864676372317075294;
        GameMath.SIN_2PI_3 = 0.03654595;
        GameMath.CIRCLE_ALPHA = 0.5522847498307933984022516322796;
        GameMath.ON = true;
        GameMath.OFF = false;
        GameMath.SHORT_EPSILON = 0.1;
        GameMath.PERC_EPSILON = 0.001;
        GameMath.EPSILON = 0.0001;
        GameMath.LONG_EPSILON = 0.00000001;
        GameMath.prototype.fuzzyEqual = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.abs(a - b) < epsilon;
        };
        GameMath.prototype.fuzzyLessThan = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return a < b + epsilon;
        };
        GameMath.prototype.fuzzyGreaterThan = function (a, b, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return a > b - epsilon;
        };
        GameMath.prototype.fuzzyCeil = function (val, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.ceil(val - epsilon);
        };
        GameMath.prototype.fuzzyFloor = function (val, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return Math.floor(val + epsilon);
        };
        GameMath.prototype.average = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var avg = 0;
            for(var i = 0; i < args.length; i++) {
                avg += args[i];
            }
            return avg / args.length;
        };
        GameMath.prototype.slam = function (value, target, epsilon) {
            if (typeof epsilon === "undefined") { epsilon = 0.0001; }
            return (Math.abs(value - target) < epsilon) ? target : value;
        };
        GameMath.prototype.percentageMinMax = function (val, max, min) {
            if (typeof min === "undefined") { min = 0; }
            val -= min;
            max -= min;
            if(!max) {
                return 0;
            } else {
                return val / max;
            }
        };
        GameMath.prototype.sign = function (n) {
            if(n) {
                return n / Math.abs(n);
            } else {
                return 0;
            }
        };
        GameMath.prototype.truncate = function (n) {
            return (n > 0) ? Math.floor(n) : Math.ceil(n);
        };
        GameMath.prototype.shear = function (n) {
            return n % 1;
        };
        GameMath.prototype.wrap = function (val, max, min) {
            if (typeof min === "undefined") { min = 0; }
            val -= min;
            max -= min;
            if(max == 0) {
                return min;
            }
            val %= max;
            val += min;
            while(val < min) {
                val += max;
            }
            return val;
        };
        GameMath.prototype.arithWrap = function (value, max, min) {
            if (typeof min === "undefined") { min = 0; }
            max -= min;
            if(max == 0) {
                return min;
            }
            return value - max * Math.floor((value - min) / max);
        };
        GameMath.prototype.clamp = function (input, max, min) {
            if (typeof min === "undefined") { min = 0; }
            return Math.max(min, Math.min(max, input));
        };
        GameMath.prototype.snapTo = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.round(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToFloor = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.floor(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToCeil = function (input, gap, start) {
            if (typeof start === "undefined") { start = 0; }
            if(gap == 0) {
                return input;
            }
            input -= start;
            input = gap * Math.ceil(input / gap);
            return start + input;
        };
        GameMath.prototype.snapToInArray = function (input, arr, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if(sort) {
                arr.sort();
            }
            if(input < arr[0]) {
                return arr[0];
            }
            var i = 1;
            while(arr[i] < input) {
                i++;
            }
            var low = arr[i - 1];
            var high = (i < arr.length) ? arr[i] : Number.POSITIVE_INFINITY;
            return ((high - input) <= (input - low)) ? high : low;
        };
        GameMath.prototype.roundTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.round(value * p) / p;
        };
        GameMath.prototype.floorTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.floor(value * p) / p;
        };
        GameMath.prototype.ceilTo = function (value, place, base) {
            if (typeof place === "undefined") { place = 0; }
            if (typeof base === "undefined") { base = 10; }
            var p = Math.pow(base, -place);
            return Math.ceil(value * p) / p;
        };
        GameMath.prototype.interpolateFloat = function (a, b, weight) {
            return (b - a) * weight + a;
        };
        GameMath.prototype.radiansToDegrees = function (angle) {
            return angle * GameMath.RAD_TO_DEG;
        };
        GameMath.prototype.degreesToRadians = function (angle) {
            return angle * GameMath.DEG_TO_RAD;
        };
        GameMath.prototype.angleBetween = function (x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        };
        GameMath.prototype.normalizeAngle = function (angle, radians) {
            if (typeof radians === "undefined") { radians = true; }
            var rd = (radians) ? GameMath.PI : 180;
            return this.wrap(angle, rd, -rd);
        };
        GameMath.prototype.nearestAngleBetween = function (a1, a2, radians) {
            if (typeof radians === "undefined") { radians = true; }
            var rd = (radians) ? GameMath.PI : 180;
            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngle(a2, radians);
            if(a1 < -rd / 2 && a2 > rd / 2) {
                a1 += rd * 2;
            }
            if(a2 < -rd / 2 && a1 > rd / 2) {
                a2 += rd * 2;
            }
            return a2 - a1;
        };
        GameMath.prototype.normalizeAngleToAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            return ind + this.nearestAngleBetween(ind, dep, radians);
        };
        GameMath.prototype.normalizeAngleAfterAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(dep - ind, radians);
            return ind + dep;
        };
        GameMath.prototype.normalizeAngleBeforeAnother = function (dep, ind, radians) {
            if (typeof radians === "undefined") { radians = true; }
            dep = this.normalizeAngle(ind - dep, radians);
            return ind - dep;
        };
        GameMath.prototype.interpolateAngles = function (a1, a2, weight, radians, ease) {
            if (typeof radians === "undefined") { radians = true; }
            if (typeof ease === "undefined") { ease = null; }
            a1 = this.normalizeAngle(a1, radians);
            a2 = this.normalizeAngleToAnother(a2, a1, radians);
            return (typeof ease === 'function') ? ease(weight, a1, a2 - a1, 1) : this.interpolateFloat(a1, a2, weight);
        };
        GameMath.prototype.logBaseOf = function (value, base) {
            return Math.log(value) / Math.log(base);
        };
        GameMath.prototype.GCD = function (m, n) {
            var r;
            m = Math.abs(m);
            n = Math.abs(n);
            if(m < n) {
                r = m;
                m = n;
                n = r;
            }
            while(true) {
                r = m % n;
                if(!r) {
                    return n;
                }
                m = n;
                n = r;
            }
            return 1;
        };
        GameMath.prototype.LCM = function (m, n) {
            return (m * n) / this.GCD(m, n);
        };
        GameMath.prototype.factorial = function (value) {
            if(value == 0) {
                return 1;
            }
            var res = value;
            while(--value) {
                res *= value;
            }
            return res;
        };
        GameMath.prototype.gammaFunction = function (value) {
            return this.factorial(value - 1);
        };
        GameMath.prototype.fallingFactorial = function (base, exp) {
            return this.factorial(base) / this.factorial(base - exp);
        };
        GameMath.prototype.risingFactorial = function (base, exp) {
            return this.factorial(base + exp - 1) / this.factorial(base - 1);
        };
        GameMath.prototype.binCoef = function (n, k) {
            return this.fallingFactorial(n, k) / this.factorial(k);
        };
        GameMath.prototype.risingBinCoef = function (n, k) {
            return this.risingFactorial(n, k) / this.factorial(k);
        };
        GameMath.prototype.chanceRoll = function (chance) {
            if (typeof chance === "undefined") { chance = 50; }
            if(chance <= 0) {
                return false;
            } else if(chance >= 100) {
                return true;
            } else {
                if(Math.random() * 100 >= chance) {
                    return false;
                } else {
                    return true;
                }
            }
        };
        GameMath.prototype.maxAdd = function (value, amount, max) {
            value += amount;
            if(value > max) {
                value = max;
            }
            return value;
        };
        GameMath.prototype.minSub = function (value, amount, min) {
            value -= amount;
            if(value < min) {
                value = min;
            }
            return value;
        };
        GameMath.prototype.wrapValue = function (value, amount, max) {
            var diff;
            value = Math.abs(value);
            amount = Math.abs(amount);
            max = Math.abs(max);
            diff = (value + amount) % max;
            return diff;
        };
        GameMath.prototype.randomSign = function () {
            return (Math.random() > 0.5) ? 1 : -1;
        };
        GameMath.prototype.isOdd = function (n) {
            if(n & 1) {
                return true;
            } else {
                return false;
            }
        };
        GameMath.prototype.isEven = function (n) {
            if(n & 1) {
                return false;
            } else {
                return true;
            }
        };
        GameMath.prototype.wrapAngle = function (angle) {
            var result = angle;
            if(angle >= -180 && angle <= 180) {
                return angle;
            }
            result = (angle + 180) % 360;
            if(result < 0) {
                result += 360;
            }
            return result - 180;
        };
        GameMath.prototype.angleLimit = function (angle, min, max) {
            var result = angle;
            if(angle > max) {
                result = max;
            } else if(angle < min) {
                result = min;
            }
            return result;
        };
        GameMath.prototype.linearInterpolation = function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            if(k < 0) {
                return this.linear(v[0], v[1], f);
            }
            if(k > 1) {
                return this.linear(v[m], v[m - 1], m - f);
            }
            return this.linear(v[i], v[i + 1 > m ? m : i + 1], f - i);
        };
        GameMath.prototype.bezierInterpolation = function (v, k) {
            var b = 0;
            var n = v.length - 1;
            for(var i = 0; i <= n; i++) {
                b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * this.bernstein(n, i);
            }
            return b;
        };
        GameMath.prototype.catmullRomInterpolation = function (v, k) {
            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            if(v[0] === v[m]) {
                if(k < 0) {
                    i = Math.floor(f = m * (1 + k));
                }
                return this.catmullRom(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
            } else {
                if(k < 0) {
                    return v[0] - (this.catmullRom(v[0], v[0], v[1], v[1], -f) - v[0]);
                }
                if(k > 1) {
                    return v[m] - (this.catmullRom(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                }
                return this.catmullRom(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            }
        };
        GameMath.prototype.linear = function (p0, p1, t) {
            return (p1 - p0) * t + p0;
        };
        GameMath.prototype.bernstein = function (n, i) {
            return this.factorial(n) / this.factorial(i) / this.factorial(n - i);
        };
        GameMath.prototype.catmullRom = function (p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        };
        GameMath.prototype.difference = function (a, b) {
            return Math.abs(a - b);
        };
        GameMath.prototype.getRandom = function (objects, startIndex, length) {
            if (typeof startIndex === "undefined") { startIndex = 0; }
            if (typeof length === "undefined") { length = 0; }
            if(objects != null) {
                var l = length;
                if((l == 0) || (l > objects.length - startIndex)) {
                    l = objects.length - startIndex;
                }
                if(l > 0) {
                    return objects[startIndex + Math.floor(Math.random() * l)];
                }
            }
            return null;
        };
        GameMath.prototype.floor = function (value) {
            var n = value | 0;
            return (value > 0) ? (n) : ((n != value) ? (n - 1) : (n));
        };
        GameMath.prototype.ceil = function (value) {
            var n = value | 0;
            return (value > 0) ? ((n != value) ? (n + 1) : (n)) : (n);
        };
        GameMath.prototype.sinCosGenerator = function (length, sinAmplitude, cosAmplitude, frequency) {
            if (typeof sinAmplitude === "undefined") { sinAmplitude = 1.0; }
            if (typeof cosAmplitude === "undefined") { cosAmplitude = 1.0; }
            if (typeof frequency === "undefined") { frequency = 1.0; }
            var sin = sinAmplitude;
            var cos = cosAmplitude;
            var frq = frequency * Math.PI / length;
            this.cosTable = [];
            this.sinTable = [];
            for(var c = 0; c < length; c++) {
                cos -= sin * frq;
                sin += cos * frq;
                this.cosTable[c] = cos;
                this.sinTable[c] = sin;
            }
            return this.sinTable;
        };
        GameMath.prototype.shiftSinTable = function () {
            if(this.sinTable) {
                var s = this.sinTable.shift();
                this.sinTable.push(s);
                return s;
            }
        };
        GameMath.prototype.shiftCosTable = function () {
            if(this.cosTable) {
                var s = this.cosTable.shift();
                this.cosTable.push(s);
                return s;
            }
        };
        GameMath.prototype.shuffleArray = function (array) {
            for(var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        };
        GameMath.prototype.distanceBetween = function (x1, y1, x2, y2) {
            var dx = x1 - x2;
            var dy = y1 - y2;
            return Math.sqrt(dx * dx + dy * dy);
        };
        GameMath.prototype.vectorLength = function (dx, dy) {
            return Math.sqrt(dx * dx + dy * dy);
        };
        return GameMath;
    })();
    Phaser.GameMath = GameMath;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Vec2 = (function () {
        function Vec2(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
            return this;
        }
        Vec2.prototype.copyFrom = function (source) {
            return this.setTo(source.x, source.y);
        };
        Vec2.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vec2.prototype.add = function (a) {
            this.x += a.x;
            this.y += a.y;
            return this;
        };
        Vec2.prototype.subtract = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vec2.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };
        Vec2.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        };
        Vec2.prototype.length = function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        };
        Vec2.prototype.lengthSq = function () {
            return (this.x * this.x) + (this.y * this.y);
        };
        Vec2.prototype.normalize = function () {
            var inv = (this.x != 0 || this.y != 0) ? 1 / Math.sqrt(this.x * this.x + this.y * this.y) : 0;
            this.x *= inv;
            this.y *= inv;
            return this;
        };
        Vec2.prototype.dot = function (a) {
            return ((this.x * a.x) + (this.y * a.y));
        };
        Vec2.prototype.cross = function (a) {
            return ((this.x * a.y) - (this.y * a.x));
        };
        Vec2.prototype.projectionLength = function (a) {
            var den = a.dot(a);
            if(den == 0) {
                return 0;
            } else {
                return Math.abs(this.dot(a) / den);
            }
        };
        Vec2.prototype.angle = function (a) {
            return Math.atan2(a.x * this.y - a.y * this.x, a.x * this.x + a.y * this.y);
        };
        Vec2.prototype.scale = function (x, y) {
            this.x *= x;
            this.y *= y || x;
            return this;
        };
        Vec2.prototype.multiplyByScalar = function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        };
        Vec2.prototype.multiplyAddByScalar = function (a, scalar) {
            this.x += a.x * scalar;
            this.y += a.y * scalar;
            return this;
        };
        Vec2.prototype.divideByScalar = function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        };
        Vec2.prototype.reverse = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vec2.prototype.equals = function (value) {
            return (this.x == value && this.y == value);
        };
        Vec2.prototype.toString = function () {
            return "[{Vec2 (x=" + this.x + " y=" + this.y + ")}]";
        };
        return Vec2;
    })();
    Phaser.Vec2 = Vec2;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Vec2Utils = (function () {
        function Vec2Utils() { }
        Vec2Utils.add = function add(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x + b.x, a.y + b.y);
        };
        Vec2Utils.subtract = function subtract(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x - b.x, a.y - b.y);
        };
        Vec2Utils.multiply = function multiply(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x * b.x, a.y * b.y);
        };
        Vec2Utils.divide = function divide(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x / b.x, a.y / b.y);
        };
        Vec2Utils.scale = function scale(a, s, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x * s, a.y * s);
        };
        Vec2Utils.multiplyAdd = function multiplyAdd(a, b, s, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x + b.x * s, a.y + b.y * s);
        };
        Vec2Utils.negative = function negative(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(-a.x, -a.y);
        };
        Vec2Utils.perp = function perp(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(-a.y, a.x);
        };
        Vec2Utils.rperp = function rperp(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.y, -a.x);
        };
        Vec2Utils.equals = function equals(a, b) {
            return a.x == b.x && a.y == b.y;
        };
        Vec2Utils.epsilonEquals = function epsilonEquals(a, b, epsilon) {
            return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
        };
        Vec2Utils.distance = function distance(a, b) {
            return Math.sqrt(Vec2Utils.distanceSq(a, b));
        };
        Vec2Utils.distanceSq = function distanceSq(a, b) {
            return ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));
        };
        Vec2Utils.project = function project(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var amt = a.dot(b) / b.lengthSq();
            if(amt != 0) {
                out.setTo(amt * b.x, amt * b.y);
            }
            return out;
        };
        Vec2Utils.projectUnit = function projectUnit(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var amt = a.dot(b);
            if(amt != 0) {
                out.setTo(amt * b.x, amt * b.y);
            }
            return out;
        };
        Vec2Utils.normalRightHand = function normalRightHand(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.y * -1, a.x);
        };
        Vec2Utils.normalize = function normalize(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var m = a.length();
            if(m != 0) {
                out.setTo(a.x / m, a.y / m);
            }
            return out;
        };
        Vec2Utils.dot = function dot(a, b) {
            return ((a.x * b.x) + (a.y * b.y));
        };
        Vec2Utils.cross = function cross(a, b) {
            return ((a.x * b.y) - (a.y * b.x));
        };
        Vec2Utils.angle = function angle(a, b) {
            return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        };
        Vec2Utils.angleSq = function angleSq(a, b) {
            return a.subtract(b).angle(b.subtract(a));
        };
        Vec2Utils.rotateAroundOrigin = function rotateAroundOrigin(a, b, theta, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var x = a.x - b.x;
            var y = a.y - b.y;
            return out.setTo(x * Math.cos(theta) - y * Math.sin(theta) + b.x, x * Math.sin(theta) + y * Math.cos(theta) + b.y);
        };
        Vec2Utils.rotate = function rotate(a, theta, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var c = Math.cos(theta);
            var s = Math.sin(theta);
            return out.setTo(a.x * c - a.y * s, a.x * s + a.y * c);
        };
        Vec2Utils.clone = function clone(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x, a.y);
        };
        return Vec2Utils;
    })();
    Phaser.Vec2Utils = Vec2Utils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Mat3 = (function () {
        function Mat3() {
            this.data = [
                1, 
                0, 
                0, 
                0, 
                1, 
                0, 
                0, 
                0, 
                1
            ];
        }
        Object.defineProperty(Mat3.prototype, "a00", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a01", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a02", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a10", {
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.data[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a11", {
            get: function () {
                return this.data[4];
            },
            set: function (value) {
                this.data[4] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a12", {
            get: function () {
                return this.data[5];
            },
            set: function (value) {
                this.data[5] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a20", {
            get: function () {
                return this.data[6];
            },
            set: function (value) {
                this.data[6] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a21", {
            get: function () {
                return this.data[7];
            },
            set: function (value) {
                this.data[7] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a22", {
            get: function () {
                return this.data[8];
            },
            set: function (value) {
                this.data[8] = value;
            },
            enumerable: true,
            configurable: true
        });
        Mat3.prototype.copyFromMat3 = function (source) {
            this.data[0] = source.data[0];
            this.data[1] = source.data[1];
            this.data[2] = source.data[2];
            this.data[3] = source.data[3];
            this.data[4] = source.data[4];
            this.data[5] = source.data[5];
            this.data[6] = source.data[6];
            this.data[7] = source.data[7];
            this.data[8] = source.data[8];
            return this;
        };
        Mat3.prototype.copyFromMat4 = function (source) {
            this.data[0] = source[0];
            this.data[1] = source[1];
            this.data[2] = source[2];
            this.data[3] = source[4];
            this.data[4] = source[5];
            this.data[5] = source[6];
            this.data[6] = source[8];
            this.data[7] = source[9];
            this.data[8] = source[10];
            return this;
        };
        Mat3.prototype.clone = function (out) {
            if (typeof out === "undefined") { out = new Phaser.Mat3(); }
            out[0] = this.data[0];
            out[1] = this.data[1];
            out[2] = this.data[2];
            out[3] = this.data[3];
            out[4] = this.data[4];
            out[5] = this.data[5];
            out[6] = this.data[6];
            out[7] = this.data[7];
            out[8] = this.data[8];
            return out;
        };
        Mat3.prototype.identity = function () {
            return this.setTo(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Mat3.prototype.translate = function (v) {
            this.a20 = v.x * this.a00 + v.y * this.a10 + this.a20;
            this.a21 = v.x * this.a01 + v.y * this.a11 + this.a21;
            this.a22 = v.x * this.a02 + v.y * this.a12 + this.a22;
            return this;
        };
        Mat3.prototype.setTemps = function () {
            this._a00 = this.data[0];
            this._a01 = this.data[1];
            this._a02 = this.data[2];
            this._a10 = this.data[3];
            this._a11 = this.data[4];
            this._a12 = this.data[5];
            this._a20 = this.data[6];
            this._a21 = this.data[7];
            this._a22 = this.data[8];
        };
        Mat3.prototype.rotate = function (rad) {
            this.setTemps();
            var s = Phaser.GameMath.sinA[rad];
            var c = Phaser.GameMath.cosA[rad];
            this.data[0] = c * this._a00 + s * this._a10;
            this.data[1] = c * this._a01 + s * this._a10;
            this.data[2] = c * this._a02 + s * this._a12;
            this.data[3] = c * this._a10 - s * this._a00;
            this.data[4] = c * this._a11 - s * this._a01;
            this.data[5] = c * this._a12 - s * this._a02;
            return this;
        };
        Mat3.prototype.scale = function (v) {
            this.data[0] = v.x * this.data[0];
            this.data[1] = v.x * this.data[1];
            this.data[2] = v.x * this.data[2];
            this.data[3] = v.y * this.data[3];
            this.data[4] = v.y * this.data[4];
            this.data[5] = v.y * this.data[5];
            return this;
        };
        Mat3.prototype.setTo = function (a00, a01, a02, a10, a11, a12, a20, a21, a22) {
            this.data[0] = a00;
            this.data[1] = a01;
            this.data[2] = a02;
            this.data[3] = a10;
            this.data[4] = a11;
            this.data[5] = a12;
            this.data[6] = a20;
            this.data[7] = a21;
            this.data[8] = a22;
            return this;
        };
        Mat3.prototype.toString = function () {
            return '';
        };
        return Mat3;
    })();
    Phaser.Mat3 = Mat3;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Mat3Utils = (function () {
        function Mat3Utils() { }
        Mat3Utils.transpose = function transpose(source, dest) {
            if (typeof dest === "undefined") { dest = null; }
            if(dest === null) {
                var a01 = source.data[1];
                var a02 = source.data[2];
                var a12 = source.data[5];
                source.data[1] = source.data[3];
                source.data[2] = source.data[6];
                source.data[3] = a01;
                source.data[5] = source.data[7];
                source.data[6] = a02;
                source.data[7] = a12;
            } else {
                source.data[0] = dest.data[0];
                source.data[1] = dest.data[3];
                source.data[2] = dest.data[6];
                source.data[3] = dest.data[1];
                source.data[4] = dest.data[4];
                source.data[5] = dest.data[7];
                source.data[6] = dest.data[2];
                source.data[7] = dest.data[5];
                source.data[8] = dest.data[8];
            }
            return source;
        };
        Mat3Utils.invert = function invert(source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];
            var b01 = a22 * a11 - a12 * a21;
            var b11 = -a22 * a10 + a12 * a20;
            var b21 = a21 * a10 - a11 * a20;
            var det = a00 * b01 + a01 * b11 + a02 * b21;
            if(!det) {
                return null;
            }
            det = 1.0 / det;
            source.data[0] = b01 * det;
            source.data[1] = (-a22 * a01 + a02 * a21) * det;
            source.data[2] = (a12 * a01 - a02 * a11) * det;
            source.data[3] = b11 * det;
            source.data[4] = (a22 * a00 - a02 * a20) * det;
            source.data[5] = (-a12 * a00 + a02 * a10) * det;
            source.data[6] = b21 * det;
            source.data[7] = (-a21 * a00 + a01 * a20) * det;
            source.data[8] = (a11 * a00 - a01 * a10) * det;
            return source;
        };
        Mat3Utils.adjoint = function adjoint(source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];
            source.data[0] = (a11 * a22 - a12 * a21);
            source.data[1] = (a02 * a21 - a01 * a22);
            source.data[2] = (a01 * a12 - a02 * a11);
            source.data[3] = (a12 * a20 - a10 * a22);
            source.data[4] = (a00 * a22 - a02 * a20);
            source.data[5] = (a02 * a10 - a00 * a12);
            source.data[6] = (a10 * a21 - a11 * a20);
            source.data[7] = (a01 * a20 - a00 * a21);
            source.data[8] = (a00 * a11 - a01 * a10);
            return source;
        };
        Mat3Utils.determinant = function determinant(source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];
            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        };
        Mat3Utils.multiply = function multiply(source, b) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];
            var b00 = b.data[0];
            var b01 = b.data[1];
            var b02 = b.data[2];
            var b10 = b.data[3];
            var b11 = b.data[4];
            var b12 = b.data[5];
            var b20 = b.data[6];
            var b21 = b.data[7];
            var b22 = b.data[8];
            source.data[0] = b00 * a00 + b01 * a10 + b02 * a20;
            source.data[1] = b00 * a01 + b01 * a11 + b02 * a21;
            source.data[2] = b00 * a02 + b01 * a12 + b02 * a22;
            source.data[3] = b10 * a00 + b11 * a10 + b12 * a20;
            source.data[4] = b10 * a01 + b11 * a11 + b12 * a21;
            source.data[5] = b10 * a02 + b11 * a12 + b12 * a22;
            source.data[6] = b20 * a00 + b21 * a10 + b22 * a20;
            source.data[7] = b20 * a01 + b21 * a11 + b22 * a21;
            source.data[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return source;
        };
        Mat3Utils.fromQuaternion = function fromQuaternion() {
        };
        Mat3Utils.normalFromMat4 = function normalFromMat4() {
        };
        return Mat3Utils;
    })();
    Phaser.Mat3Utils = Mat3Utils;    
})(Phaser || (Phaser = {}));
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    var QuadTree = (function (_super) {
        __extends(QuadTree, _super);
        function QuadTree(manager, x, y, width, height, parent) {
            if (typeof parent === "undefined") { parent = null; }
                _super.call(this, x, y, width, height);
            QuadTree.physics = manager;
            this._headA = this._tailA = new Phaser.LinkedList();
            this._headB = this._tailB = new Phaser.LinkedList();
            if(parent != null) {
                if(parent._headA.object != null) {
                    this._iterator = parent._headA;
                    while(this._iterator != null) {
                        if(this._tailA.object != null) {
                            this._ot = this._tailA;
                            this._tailA = new Phaser.LinkedList();
                            this._ot.next = this._tailA;
                        }
                        this._tailA.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }
                if(parent._headB.object != null) {
                    this._iterator = parent._headB;
                    while(this._iterator != null) {
                        if(this._tailB.object != null) {
                            this._ot = this._tailB;
                            this._tailB = new Phaser.LinkedList();
                            this._ot.next = this._tailB;
                        }
                        this._tailB.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }
            } else {
                QuadTree._min = (this.width + this.height) / (2 * QuadTree.divisions);
            }
            this._canSubdivide = (this.width > QuadTree._min) || (this.height > QuadTree._min);
            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;
            this._leftEdge = this.x;
            this._rightEdge = this.x + this.width;
            this._halfWidth = this.width / 2;
            this._midpointX = this._leftEdge + this._halfWidth;
            this._topEdge = this.y;
            this._bottomEdge = this.y + this.height;
            this._halfHeight = this.height / 2;
            this._midpointY = this._topEdge + this._halfHeight;
        }
        QuadTree.A_LIST = 0;
        QuadTree.B_LIST = 1;
        QuadTree.prototype.destroy = function () {
            this._tailA.destroy();
            this._tailB.destroy();
            this._headA.destroy();
            this._headB.destroy();
            this._tailA = null;
            this._tailB = null;
            this._headA = null;
            this._headB = null;
            if(this._northWestTree != null) {
                this._northWestTree.destroy();
            }
            if(this._northEastTree != null) {
                this._northEastTree.destroy();
            }
            if(this._southEastTree != null) {
                this._southEastTree.destroy();
            }
            if(this._southWestTree != null) {
                this._southWestTree.destroy();
            }
            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;
            QuadTree._object = null;
            QuadTree._processingCallback = null;
            QuadTree._notifyCallback = null;
        };
        QuadTree.prototype.load = function (objectOrGroup1, objectOrGroup2, notifyCallback, processCallback, context) {
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if (typeof context === "undefined") { context = null; }
            this.add(objectOrGroup1, QuadTree.A_LIST);
            if(objectOrGroup2 != null) {
                this.add(objectOrGroup2, QuadTree.B_LIST);
                QuadTree._useBothLists = true;
            } else {
                QuadTree._useBothLists = false;
            }
            QuadTree._notifyCallback = notifyCallback;
            QuadTree._processingCallback = processCallback;
            QuadTree._callbackContext = context;
        };
        QuadTree.prototype.add = function (objectOrGroup, list) {
            QuadTree._list = list;
            if(objectOrGroup.type == Phaser.Types.GROUP) {
                this._i = 0;
                this._members = objectOrGroup['members'];
                this._l = objectOrGroup['length'];
                while(this._i < this._l) {
                    this._basic = this._members[this._i++];
                    if(this._basic != null && this._basic.exists) {
                        if(this._basic.type == Phaser.Types.GROUP) {
                            this.add(this._basic, list);
                        } else {
                            QuadTree._object = this._basic;
                            if(QuadTree._object.exists && QuadTree._object.body.allowCollisions) {
                                this.addObject();
                            }
                        }
                    }
                }
            } else {
                QuadTree._object = objectOrGroup;
                if(QuadTree._object.exists && QuadTree._object.body.allowCollisions) {
                    this.addObject();
                }
            }
        };
        QuadTree.prototype.addObject = function () {
            if(!this._canSubdivide || ((this._leftEdge >= QuadTree._object.body.bounds.x) && (this._rightEdge <= QuadTree._object.body.bounds.right) && (this._topEdge >= QuadTree._object.body.bounds.y) && (this._bottomEdge <= QuadTree._object.body.bounds.bottom))) {
                this.addToList();
                return;
            }
            if((QuadTree._object.body.bounds.x > this._leftEdge) && (QuadTree._object.body.bounds.right < this._midpointX)) {
                if((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY)) {
                    if(this._northWestTree == null) {
                        this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northWestTree.addObject();
                    return;
                }
                if((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge)) {
                    if(this._southWestTree == null) {
                        this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southWestTree.addObject();
                    return;
                }
            }
            if((QuadTree._object.body.bounds.x > this._midpointX) && (QuadTree._object.body.bounds.right < this._rightEdge)) {
                if((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY)) {
                    if(this._northEastTree == null) {
                        this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northEastTree.addObject();
                    return;
                }
                if((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge)) {
                    if(this._southEastTree == null) {
                        this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southEastTree.addObject();
                    return;
                }
            }
            if((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY)) {
                if(this._northWestTree == null) {
                    this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northWestTree.addObject();
            }
            if((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY)) {
                if(this._northEastTree == null) {
                    this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northEastTree.addObject();
            }
            if((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge)) {
                if(this._southEastTree == null) {
                    this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southEastTree.addObject();
            }
            if((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge)) {
                if(this._southWestTree == null) {
                    this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southWestTree.addObject();
            }
        };
        QuadTree.prototype.addToList = function () {
            if(QuadTree._list == QuadTree.A_LIST) {
                if(this._tailA.object != null) {
                    this._ot = this._tailA;
                    this._tailA = new Phaser.LinkedList();
                    this._ot.next = this._tailA;
                }
                this._tailA.object = QuadTree._object;
            } else {
                if(this._tailB.object != null) {
                    this._ot = this._tailB;
                    this._tailB = new Phaser.LinkedList();
                    this._ot.next = this._tailB;
                }
                this._tailB.object = QuadTree._object;
            }
            if(!this._canSubdivide) {
                return;
            }
            if(this._northWestTree != null) {
                this._northWestTree.addToList();
            }
            if(this._northEastTree != null) {
                this._northEastTree.addToList();
            }
            if(this._southEastTree != null) {
                this._southEastTree.addToList();
            }
            if(this._southWestTree != null) {
                this._southWestTree.addToList();
            }
        };
        QuadTree.prototype.execute = function () {
            this._overlapProcessed = false;
            if(this._headA.object != null) {
                this._iterator = this._headA;
                while(this._iterator != null) {
                    QuadTree._object = this._iterator.object;
                    if(QuadTree._useBothLists) {
                        QuadTree._iterator = this._headB;
                    } else {
                        QuadTree._iterator = this._iterator.next;
                    }
                    if(QuadTree._object.exists && (QuadTree._object.body.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode()) {
                        this._overlapProcessed = true;
                    }
                    this._iterator = this._iterator.next;
                }
            }
            if((this._northWestTree != null) && this._northWestTree.execute()) {
                this._overlapProcessed = true;
            }
            if((this._northEastTree != null) && this._northEastTree.execute()) {
                this._overlapProcessed = true;
            }
            if((this._southEastTree != null) && this._southEastTree.execute()) {
                this._overlapProcessed = true;
            }
            if((this._southWestTree != null) && this._southWestTree.execute()) {
                this._overlapProcessed = true;
            }
            return this._overlapProcessed;
        };
        QuadTree.prototype.overlapNode = function () {
            this._overlapProcessed = false;
            while(QuadTree._iterator != null) {
                if(!QuadTree._object.exists || (QuadTree._object.body.allowCollisions <= 0)) {
                    break;
                }
                this._checkObject = QuadTree._iterator.object;
                if((QuadTree._object === this._checkObject) || !this._checkObject.exists || (this._checkObject.body.allowCollisions <= 0)) {
                    QuadTree._iterator = QuadTree._iterator.next;
                    continue;
                }
                QuadTree._iterator = QuadTree._iterator.next;
            }
            return this._overlapProcessed;
        };
        return QuadTree;
    })(Phaser.Rectangle);
    Phaser.QuadTree = QuadTree;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var LinkedList = (function () {
        function LinkedList() {
            this.object = null;
            this.next = null;
        }
        LinkedList.prototype.destroy = function () {
            this.object = null;
            if(this.next != null) {
                this.next.destroy();
            }
            this.next = null;
        };
        return LinkedList;
    })();
    Phaser.LinkedList = LinkedList;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var RandomDataGenerator = (function () {
        function RandomDataGenerator(seeds) {
            if (typeof seeds === "undefined") { seeds = []; }
            this.c = 1;
            this.sow(seeds);
        }
        RandomDataGenerator.prototype.uint32 = function () {
            return this.rnd.apply(this) * 0x100000000;
        };
        RandomDataGenerator.prototype.fract32 = function () {
            return this.rnd.apply(this) + (this.rnd.apply(this) * 0x200000 | 0) * 1.1102230246251565e-16;
        };
        RandomDataGenerator.prototype.rnd = function () {
            var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10;
            this.c = t | 0;
            this.s0 = this.s1;
            this.s1 = this.s2;
            this.s2 = t - this.c;
            return this.s2;
        };
        RandomDataGenerator.prototype.hash = function (data) {
            var h, i, n;
            n = 0xefc8249d;
            data = data.toString();
            for(i = 0; i < data.length; i++) {
                n += data.charCodeAt(i);
                h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000;
            }
            return (n >>> 0) * 2.3283064365386963e-10;
        };
        RandomDataGenerator.prototype.sow = function (seeds) {
            if (typeof seeds === "undefined") { seeds = []; }
            this.s0 = this.hash(' ');
            this.s1 = this.hash(this.s0);
            this.s2 = this.hash(this.s1);
            var seed;
            for(var i = 0; seed = seeds[i++]; ) {
                this.s0 -= this.hash(seed);
                this.s0 += ~~(this.s0 < 0);
                this.s1 -= this.hash(seed);
                this.s1 += ~~(this.s1 < 0);
                this.s2 -= this.hash(seed);
                this.s2 += ~~(this.s2 < 0);
            }
        };
        Object.defineProperty(RandomDataGenerator.prototype, "integer", {
            get: function () {
                return this.uint32();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "frac", {
            get: function () {
                return this.fract32();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "real", {
            get: function () {
                return this.uint32() + this.fract32();
            },
            enumerable: true,
            configurable: true
        });
        RandomDataGenerator.prototype.integerInRange = function (min, max) {
            return Math.floor(this.realInRange(min, max));
        };
        RandomDataGenerator.prototype.realInRange = function (min, max) {
            min = min || 0;
            max = max || 0;
            return this.frac * (max - min) + min;
        };
        Object.defineProperty(RandomDataGenerator.prototype, "normal", {
            get: function () {
                return 1 - 2 * this.frac;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RandomDataGenerator.prototype, "uuid", {
            get: function () {
                var a, b;
                for(b = a = ''; a++ < 36; b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {
                    ;
                }
                return b;
            },
            enumerable: true,
            configurable: true
        });
        RandomDataGenerator.prototype.pick = function (array) {
            return array[this.integerInRange(0, array.length)];
        };
        RandomDataGenerator.prototype.weightedPick = function (array) {
            return array[~~(Math.pow(this.frac, 2) * array.length)];
        };
        RandomDataGenerator.prototype.timestamp = function (min, max) {
            if (typeof min === "undefined") { min = 946684800000; }
            if (typeof max === "undefined") { max = 1577862000000; }
            return this.realInRange(min, max);
        };
        Object.defineProperty(RandomDataGenerator.prototype, "angle", {
            get: function () {
                return this.integerInRange(-180, 180);
            },
            enumerable: true,
            configurable: true
        });
        return RandomDataGenerator;
    })();
    Phaser.RandomDataGenerator = RandomDataGenerator;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Plugin = (function () {
        function Plugin(game, parent) {
            this.game = game;
            this.parent = parent;
            this.active = false;
            this.visible = false;
            this.hasPreUpdate = false;
            this.hasUpdate = false;
            this.hasPostUpdate = false;
            this.hasPreRender = false;
            this.hasRender = false;
            this.hasPostRender = false;
        }
        Plugin.prototype.preUpdate = function () {
        };
        Plugin.prototype.update = function () {
        };
        Plugin.prototype.postUpdate = function () {
        };
        Plugin.prototype.preRender = function () {
        };
        Plugin.prototype.render = function () {
        };
        Plugin.prototype.postRender = function () {
        };
        Plugin.prototype.destroy = function () {
            this.game = null;
            this.parent = null;
            this.active = false;
            this.visible = false;
        };
        return Plugin;
    })();
    Phaser.Plugin = Plugin;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var PluginManager = (function () {
        function PluginManager(game, parent) {
            this.game = game;
            this._parent = parent;
            this.plugins = [];
        }
        PluginManager.prototype.add = function (plugin) {
            var result = false;
            if(typeof plugin === 'function') {
                plugin = new plugin(this.game, this._parent);
            } else {
                plugin.game = this.game;
                plugin.parent = this._parent;
            }
            if(typeof plugin['preUpdate'] === 'function') {
                plugin.hasPreUpdate = true;
                result = true;
            }
            if(typeof plugin['update'] === 'function') {
                plugin.hasUpdate = true;
                result = true;
            }
            if(typeof plugin['postUpdate'] === 'function') {
                plugin.hasPostUpdate = true;
                result = true;
            }
            if(typeof plugin['preRender'] === 'function') {
                plugin.hasPreRender = true;
                result = true;
            }
            if(typeof plugin['render'] === 'function') {
                plugin.hasRender = true;
                result = true;
            }
            if(typeof plugin['postRender'] === 'function') {
                plugin.hasPostRender = true;
                result = true;
            }
            if(result == true) {
                if(plugin.hasPreUpdate || plugin.hasUpdate || plugin.hasPostUpdate) {
                    plugin.active = true;
                }
                if(plugin.hasPreRender || plugin.hasRender || plugin.hasPostRender) {
                    plugin.visible = true;
                }
                this._pluginsLength = this.plugins.push(plugin);
                return plugin;
            } else {
                return null;
            }
        };
        PluginManager.prototype.remove = function (plugin) {
            this._pluginsLength--;
        };
        PluginManager.prototype.preUpdate = function () {
            for(this._p = 0; this._p < this._pluginsLength; this._p++) {
                if(this.plugins[this._p].active && this.plugins[this._p].hasPreUpdate) {
                    this.plugins[this._p].preUpdate();
                }
            }
        };
        PluginManager.prototype.update = function () {
            for(this._p = 0; this._p < this._pluginsLength; this._p++) {
                if(this.plugins[this._p].active && this.plugins[this._p].hasUpdate) {
                    this.plugins[this._p].update();
                }
            }
        };
        PluginManager.prototype.postUpdate = function () {
            for(this._p = 0; this._p < this._pluginsLength; this._p++) {
                if(this.plugins[this._p].active && this.plugins[this._p].hasPostUpdate) {
                    this.plugins[this._p].postUpdate();
                }
            }
        };
        PluginManager.prototype.preRender = function () {
            for(this._p = 0; this._p < this._pluginsLength; this._p++) {
                if(this.plugins[this._p].visible && this.plugins[this._p].hasPreRender) {
                    this.plugins[this._p].preRender();
                }
            }
        };
        PluginManager.prototype.render = function () {
            for(this._p = 0; this._p < this._pluginsLength; this._p++) {
                if(this.plugins[this._p].visible && this.plugins[this._p].hasRender) {
                    this.plugins[this._p].render();
                }
            }
        };
        PluginManager.prototype.postRender = function () {
            for(this._p = 0; this._p < this._pluginsLength; this._p++) {
                if(this.plugins[this._p].visible && this.plugins[this._p].hasPostRender) {
                    this.plugins[this._p].postRender();
                }
            }
        };
        PluginManager.prototype.destroy = function () {
            this.plugins.length = 0;
            this._pluginsLength = 0;
            this.game = null;
            this._parent = null;
        };
        return PluginManager;
    })();
    Phaser.PluginManager = PluginManager;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Signal = (function () {
        function Signal() {
            this._bindings = [];
            this._prevParams = null;
            this.memorize = false;
            this._shouldPropagate = true;
            this.active = true;
        }
        Signal.VERSION = '1.0.0';
        Signal.prototype.validateListener = function (listener, fnName) {
            if(typeof listener !== 'function') {
                throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
            }
        };
        Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
            var prevIndex = this._indexOfListener(listener, listenerContext);
            var binding;
            if(prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if(binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
                }
            } else {
                binding = new Phaser.SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }
            if(this.memorize && this._prevParams) {
                binding.execute(this._prevParams);
            }
            return binding;
        };
        Signal.prototype._addBinding = function (binding) {
            var n = this._bindings.length;
            do {
                --n;
            }while(this._bindings[n] && binding.priority <= this._bindings[n].priority);
            this._bindings.splice(n + 1, 0, binding);
        };
        Signal.prototype._indexOfListener = function (listener, context) {
            var n = this._bindings.length;
            var cur;
            while(n--) {
                cur = this._bindings[n];
                if(cur.getListener() === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        };
        Signal.prototype.has = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            return this._indexOfListener(listener, context) !== -1;
        };
        Signal.prototype.add = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        };
        Signal.prototype.addOnce = function (listener, listenerContext, priority) {
            if (typeof listenerContext === "undefined") { listenerContext = null; }
            if (typeof priority === "undefined") { priority = 0; }
            this.validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        };
        Signal.prototype.remove = function (listener, context) {
            if (typeof context === "undefined") { context = null; }
            this.validateListener(listener, 'remove');
            var i = this._indexOfListener(listener, context);
            if(i !== -1) {
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1);
            }
            return listener;
        };
        Signal.prototype.removeAll = function () {
            if(this._bindings) {
                var n = this._bindings.length;
                while(n--) {
                    this._bindings[n]._destroy();
                }
                this._bindings.length = 0;
            }
        };
        Signal.prototype.getNumListeners = function () {
            return this._bindings.length;
        };
        Signal.prototype.halt = function () {
            this._shouldPropagate = false;
        };
        Signal.prototype.dispatch = function () {
            var paramsArr = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                paramsArr[_i] = arguments[_i + 0];
            }
            if(!this.active) {
                return;
            }
            var n = this._bindings.length;
            var bindings;
            if(this.memorize) {
                this._prevParams = paramsArr;
            }
            if(!n) {
                return;
            }
            bindings = this._bindings.slice(0);
            this._shouldPropagate = true;
            do {
                n--;
            }while(bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        };
        Signal.prototype.forget = function () {
            this._prevParams = null;
        };
        Signal.prototype.dispose = function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        };
        Signal.prototype.toString = function () {
            return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
        };
        return Signal;
    })();
    Phaser.Signal = Signal;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var SignalBinding = (function () {
        function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
            if (typeof priority === "undefined") { priority = 0; }
            this.active = true;
            this.params = null;
            this._listener = listener;
            this._isOnce = isOnce;
            this.context = listenerContext;
            this._signal = signal;
            this.priority = priority || 0;
        }
        SignalBinding.prototype.execute = function (paramsArr) {
            var handlerReturn;
            var params;
            if(this.active && !!this._listener) {
                params = this.params ? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if(this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        };
        SignalBinding.prototype.detach = function () {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
        };
        SignalBinding.prototype.isBound = function () {
            return (!!this._signal && !!this._listener);
        };
        SignalBinding.prototype.isOnce = function () {
            return this._isOnce;
        };
        SignalBinding.prototype.getListener = function () {
            return this._listener;
        };
        SignalBinding.prototype.getSignal = function () {
            return this._signal;
        };
        SignalBinding.prototype._destroy = function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        };
        SignalBinding.prototype.toString = function () {
            return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
        };
        return SignalBinding;
    })();
    Phaser.SignalBinding = SignalBinding;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Group = (function () {
        function Group(game, maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            this._sortIndex = '';
            this._zCounter = 0;
            this.ID = -1;
            this.z = -1;
            this.group = null;
            this.modified = false;
            this.game = game;
            this.type = Phaser.Types.GROUP;
            this.active = true;
            this.exists = true;
            this.visible = true;
            this.members = [];
            this.length = 0;
            this._maxSize = maxSize;
            this._marker = 0;
            this._sortIndex = null;
            this.ID = this.game.world.getNextGroupID();
            this.transform = new Phaser.Components.TransformManager(this);
            this.texture = new Phaser.Display.Texture(this);
            this.texture.opaque = false;
        }
        Group.prototype.getNextZIndex = function () {
            return this._zCounter++;
        };
        Group.prototype.destroy = function () {
            if(this.members != null) {
                this._i = 0;
                while(this._i < this.length) {
                    this._member = this.members[this._i++];
                    if(this._member != null) {
                        this._member.destroy();
                    }
                }
                this.members.length = 0;
            }
            this._sortIndex = null;
        };
        Group.prototype.update = function () {
            if(this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists && this._member.active) {
                    if(this._member.type != Phaser.Types.GROUP) {
                        this._member.preUpdate();
                    }
                    this._member.update();
                }
            }
        };
        Group.prototype.postUpdate = function () {
            if(this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists && this._member.active) {
                    this._member.postUpdate();
                }
            }
        };
        Group.prototype.render = function (camera) {
            if(camera.isHidden(this) == true) {
                return;
            }
            this.game.renderer.groupRenderer.preRender(camera, this);
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists && this._member.visible && camera.isHidden(this._member) == false) {
                    if(this._member.type == Phaser.Types.GROUP) {
                        this._member.render(camera);
                    } else {
                        this.game.renderer.renderGameObject(camera, this._member);
                    }
                }
            }
            this.game.renderer.groupRenderer.postRender(camera, this);
        };
        Group.prototype.directRender = function (camera) {
            this.game.renderer.groupRenderer.preRender(camera, this);
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists) {
                    if(this._member.type == Phaser.Types.GROUP) {
                        this._member.directRender(camera);
                    } else {
                        this.game.renderer.renderGameObject(this._member);
                    }
                }
            }
            this.game.renderer.groupRenderer.postRender(camera, this);
        };
        Object.defineProperty(Group.prototype, "maxSize", {
            get: function () {
                return this._maxSize;
            },
            set: function (size) {
                this._maxSize = size;
                if(this._marker >= this._maxSize) {
                    this._marker = 0;
                }
                if(this._maxSize == 0 || this.members == null || (this._maxSize >= this.members.length)) {
                    return;
                }
                this._i = this._maxSize;
                this._length = this.members.length;
                while(this._i < this._length) {
                    this._member = this.members[this._i++];
                    if(this._member != null) {
                        this._member.destroy();
                    }
                }
                this.length = this.members.length = this._maxSize;
            },
            enumerable: true,
            configurable: true
        });
        Group.prototype.add = function (object) {
            if(object.group && (object.group.ID == this.ID || (object.type == Phaser.Types.GROUP && object.ID == this.ID))) {
                return object;
            }
            this._i = 0;
            this._length = this.members.length;
            while(this._i < this._length) {
                if(this.members[this._i] == null) {
                    this.members[this._i] = object;
                    this.setObjectIDs(object);
                    if(this._i >= this.length) {
                        this.length = this._i + 1;
                    }
                    return object;
                }
                this._i++;
            }
            if(this._maxSize > 0) {
                if(this.members.length >= this._maxSize) {
                    return object;
                } else if(this.members.length * 2 <= this._maxSize) {
                    this.members.length *= 2;
                } else {
                    this.members.length = this._maxSize;
                }
            } else {
                this.members.length *= 2;
            }
            this.members[this._i] = object;
            this.length = this._i + 1;
            this.setObjectIDs(object);
            return object;
        };
        Group.prototype.addNewSprite = function (x, y, key, frame) {
            if (typeof key === "undefined") { key = ''; }
            if (typeof frame === "undefined") { frame = null; }
            return this.add(new Phaser.Sprite(this.game, x, y, key, frame));
        };
        Group.prototype.setObjectIDs = function (object, zIndex) {
            if (typeof zIndex === "undefined") { zIndex = -1; }
            if(object.group !== null) {
                object.group.remove(object);
            }
            object.group = this;
            if(zIndex == -1) {
                zIndex = this.getNextZIndex();
            }
            object.z = zIndex;
            if(object['events']) {
                object['events'].onAddedToGroup.dispatch(object, this, object.z);
            }
        };
        Group.prototype.recycle = function (objectClass) {
            if (typeof objectClass === "undefined") { objectClass = null; }
            if(this._maxSize > 0) {
                if(this.length < this._maxSize) {
                    if(objectClass == null) {
                        return null;
                    }
                    return this.add(new objectClass(this.game));
                } else {
                    this._member = this.members[this._marker++];
                    if(this._marker >= this._maxSize) {
                        this._marker = 0;
                    }
                    return this._member;
                }
            } else {
                this._member = this.getFirstAvailable(objectClass);
                if(this._member != null) {
                    return this._member;
                }
                if(objectClass == null) {
                    return null;
                }
                return this.add(new objectClass(this.game));
            }
        };
        Group.prototype.remove = function (object, splice) {
            if (typeof splice === "undefined") { splice = false; }
            this._i = this.members.indexOf(object);
            if(this._i < 0 || (this._i >= this.members.length)) {
                return null;
            }
            if(splice) {
                this.members.splice(this._i, 1);
                this.length--;
            } else {
                this.members[this._i] = null;
            }
            if(object['events']) {
                object['events'].onRemovedFromGroup.dispatch(object, this);
            }
            object.group = null;
            object.z = -1;
            return object;
        };
        Group.prototype.replace = function (oldObject, newObject) {
            this._i = this.members.indexOf(oldObject);
            if(this._i < 0 || (this._i >= this.members.length)) {
                return null;
            }
            this.setObjectIDs(newObject, this.members[this._i].z);
            this.remove(this.members[this._i]);
            this.members[this._i] = newObject;
            return newObject;
        };
        Group.prototype.swap = function (child1, child2, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if(child1.group.ID != this.ID || child2.group.ID != this.ID || child1 === child2) {
                return false;
            }
            var tempZ = child1.z;
            child1.z = child2.z;
            child2.z = tempZ;
            if(sort) {
                this.sort();
            }
            return true;
        };
        Group.prototype.bringToTop = function (child) {
            var oldZ = child.z;
            if(!child || child.group == null || child.group.ID != this.ID) {
                return false;
            }
            var topZ = -1;
            for(var i = 0; i < this.length; i++) {
                if(this.members[i] && this.members[i].z > topZ) {
                    topZ = this.members[i].z;
                }
            }
            if(child.z == topZ) {
                return false;
            }
            child.z = topZ + 1;
            this.sort();
            for(var i = 0; i < this.length; i++) {
                if(this.members[i]) {
                    this.members[i].z = i;
                }
            }
            return true;
        };
        Group.prototype.sort = function (index, order) {
            if (typeof index === "undefined") { index = 'z'; }
            if (typeof order === "undefined") { order = Phaser.Types.SORT_ASCENDING; }
            var _this = this;
            this._sortIndex = index;
            this._sortOrder = order;
            this.members.sort(function (a, b) {
                return _this.sortHandler(a, b);
            });
        };
        Group.prototype.sortHandler = function (obj1, obj2) {
            if(!obj1 || !obj2) {
                return 0;
            }
            if(obj1[this._sortIndex] < obj2[this._sortIndex]) {
                return this._sortOrder;
            } else if(obj1[this._sortIndex] > obj2[this._sortIndex]) {
                return -this._sortOrder;
            }
            return 0;
        };
        Group.prototype.setAll = function (variableName, value, recurse) {
            if (typeof recurse === "undefined") { recurse = true; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(recurse && this._member.type == Phaser.Types.GROUP) {
                        this._member.setAll(variableName, value, recurse);
                    } else {
                        this._member[variableName] = value;
                    }
                }
            }
        };
        Group.prototype.callAll = function (functionName, recurse) {
            if (typeof recurse === "undefined") { recurse = true; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(recurse && this._member.type == Phaser.Types.GROUP) {
                        this._member.callAll(functionName, recurse);
                    } else {
                        this._member[functionName]();
                    }
                }
            }
        };
        Group.prototype.forEach = function (callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(recursive && this._member.type == Phaser.Types.GROUP) {
                        this._member.forEach(callback, true);
                    } else {
                        callback.call(this, this._member);
                    }
                }
            }
        };
        Group.prototype.forEachAlive = function (context, callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.alive) {
                    if(recursive && this._member.type == Phaser.Types.GROUP) {
                        this._member.forEachAlive(context, callback, true);
                    } else {
                        callback.call(context, this._member);
                    }
                }
            }
        };
        Group.prototype.getFirstAvailable = function (objectClass) {
            if (typeof objectClass === "undefined") { objectClass = null; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && !this._member.exists && ((objectClass == null) || (typeof this._member === objectClass))) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.getFirstNull = function () {
            this._i = 0;
            while(this._i < this.length) {
                if(this.members[this._i] == null) {
                    return this._i;
                } else {
                    this._i++;
                }
            }
            return -1;
        };
        Group.prototype.getFirstExtant = function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.getFirstAlive = function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && this._member.exists && this._member.alive) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.getFirstDead = function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && !this._member.alive) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.countLiving = function () {
            this._count = -1;
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(this._count < 0) {
                        this._count = 0;
                    }
                    if(this._member.exists && this._member.alive) {
                        this._count++;
                    }
                }
            }
            return this._count;
        };
        Group.prototype.countDead = function () {
            this._count = -1;
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(this._count < 0) {
                        this._count = 0;
                    }
                    if(!this._member.alive) {
                        this._count++;
                    }
                }
            }
            return this._count;
        };
        Group.prototype.getRandom = function (startIndex, length) {
            if (typeof startIndex === "undefined") { startIndex = 0; }
            if (typeof length === "undefined") { length = 0; }
            if(length == 0) {
                length = this.length;
            }
            return this.game.math.getRandom(this.members, startIndex, length);
        };
        Group.prototype.clear = function () {
            this.length = this.members.length = 0;
        };
        Group.prototype.kill = function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && this._member.exists) {
                    this._member.kill();
                }
            }
        };
        return Group;
    })();
    Phaser.Group = Group;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Camera = (function () {
        function Camera(game, id, x, y, width, height) {
            this._target = null;
            this.worldBounds = null;
            this.modified = false;
            this.deadzone = null;
            this.visible = true;
            this.z = -1;
            this.game = game;
            this.ID = id;
            this.z = id;
            width = this.game.math.clamp(width, this.game.stage.width, 1);
            height = this.game.math.clamp(height, this.game.stage.height, 1);
            this.worldView = new Phaser.Rectangle(0, 0, width, height);
            this.screenView = new Phaser.Rectangle(x, y, width, height);
            this.plugins = new Phaser.PluginManager(this.game, this);
            this.transform = new Phaser.Components.TransformManager(this);
            this.texture = new Phaser.Display.Texture(this);
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._renderLocal = true;
            this.texture.canvas = this._canvas;
            this.texture.context = this.texture.canvas.getContext('2d');
            this.texture.backgroundColor = this.game.stage.backgroundColor;
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;
        }
        Object.defineProperty(Camera.prototype, "alpha", {
            get: function () {
                return this.texture.alpha;
            },
            set: function (value) {
                this.texture.alpha = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "directToStage", {
            set: function (value) {
                if(value) {
                    this._renderLocal = false;
                    this.texture.canvas = this.game.stage.canvas;
                    Phaser.CanvasUtils.setBackgroundColor(this.texture.canvas, this.game.stage.backgroundColor);
                } else {
                    this._renderLocal = true;
                    this.texture.canvas = this._canvas;
                    Phaser.CanvasUtils.setBackgroundColor(this.texture.canvas, this.texture.backgroundColor);
                }
                this.texture.context = this.texture.canvas.getContext('2d');
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.hide = function (object) {
            object.texture.hideFromCamera(this);
        };
        Camera.prototype.isHidden = function (object) {
            return object.texture.isHidden(this);
        };
        Camera.prototype.show = function (object) {
            object.texture.showToCamera(this);
        };
        Camera.prototype.follow = function (target, style) {
            if (typeof style === "undefined") { style = Phaser.Types.CAMERA_FOLLOW_LOCKON; }
            this._target = target;
            var helper;
            switch(style) {
                case Phaser.Types.CAMERA_FOLLOW_PLATFORMER:
                    var w = this.width / 8;
                    var h = this.height / 3;
                    this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN:
                    helper = Math.max(this.width, this.height) / 4;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_TOPDOWN_TIGHT:
                    helper = Math.max(this.width, this.height) / 8;
                    this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                    break;
                case Phaser.Types.CAMERA_FOLLOW_LOCKON:
                default:
                    this.deadzone = null;
                    break;
            }
        };
        Camera.prototype.focusOnXY = function (x, y) {
            x += (x > 0) ? 0.0000001 : -0.0000001;
            y += (y > 0) ? 0.0000001 : -0.0000001;
            this.worldView.x = Math.round(x - this.worldView.halfWidth);
            this.worldView.y = Math.round(y - this.worldView.halfHeight);
        };
        Camera.prototype.focusOn = function (point) {
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
            this.worldView.x = Math.round(point.x - this.worldView.halfWidth);
            this.worldView.y = Math.round(point.y - this.worldView.halfHeight);
        };
        Camera.prototype.setBounds = function (x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            if(this.worldBounds == null) {
                this.worldBounds = new Phaser.Rectangle();
            }
            this.worldBounds.setTo(x, y, width, height);
            this.worldView.x = x;
            this.worldView.y = y;
            this.update();
        };
        Camera.prototype.update = function () {
            if(this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }
            this.plugins.preUpdate();
            if(this._target !== null) {
                if(this.deadzone == null) {
                    this.focusOnXY(this._target.x, this._target.y);
                } else {
                    var edge;
                    var targetX = this._target.x + ((this._target.x > 0) ? 0.0000001 : -0.0000001);
                    var targetY = this._target.y + ((this._target.y > 0) ? 0.0000001 : -0.0000001);
                    edge = targetX - this.deadzone.x;
                    if(this.worldView.x > edge) {
                        this.worldView.x = edge;
                    }
                    edge = targetX + this._target.width - this.deadzone.x - this.deadzone.width;
                    if(this.worldView.x < edge) {
                        this.worldView.x = edge;
                    }
                    edge = targetY - this.deadzone.y;
                    if(this.worldView.y > edge) {
                        this.worldView.y = edge;
                    }
                    edge = targetY + this._target.height - this.deadzone.y - this.deadzone.height;
                    if(this.worldView.y < edge) {
                        this.worldView.y = edge;
                    }
                }
            }
            if(this.worldBounds !== null) {
                if(this.worldView.x < this.worldBounds.left) {
                    this.worldView.x = this.worldBounds.left;
                }
                if(this.worldView.x > this.worldBounds.right - this.width) {
                    this.worldView.x = (this.worldBounds.right - this.width) + 1;
                }
                if(this.worldView.y < this.worldBounds.top) {
                    this.worldView.y = this.worldBounds.top;
                }
                if(this.worldView.y > this.worldBounds.bottom - this.height) {
                    this.worldView.y = (this.worldBounds.bottom - this.height) + 1;
                }
            }
            this.worldView.floor();
            this.plugins.update();
        };
        Camera.prototype.postUpdate = function () {
            if(this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }
            if(this.worldBounds !== null) {
                if(this.worldView.x < this.worldBounds.left) {
                    this.worldView.x = this.worldBounds.left;
                }
                if(this.worldView.x > this.worldBounds.right - this.width) {
                    this.worldView.x = this.worldBounds.right - this.width;
                }
                if(this.worldView.y < this.worldBounds.top) {
                    this.worldView.y = this.worldBounds.top;
                }
                if(this.worldView.y > this.worldBounds.bottom - this.height) {
                    this.worldView.y = this.worldBounds.bottom - this.height;
                }
            }
            this.worldView.floor();
            this.plugins.postUpdate();
        };
        Camera.prototype.destroy = function () {
            this.game.world.cameras.removeCamera(this.ID);
            this.plugins.destroy();
        };
        Object.defineProperty(Camera.prototype, "x", {
            get: function () {
                return this.worldView.x;
            },
            set: function (value) {
                this.worldView.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "y", {
            get: function () {
                return this.worldView.y;
            },
            set: function (value) {
                this.worldView.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "width", {
            get: function () {
                return this.screenView.width;
            },
            set: function (value) {
                this.screenView.width = value;
                this.worldView.width = value;
                if(value !== this.texture.canvas.width) {
                    this.texture.canvas.width = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "height", {
            get: function () {
                return this.screenView.height;
            },
            set: function (value) {
                this.screenView.height = value;
                this.worldView.height = value;
                if(value !== this.texture.canvas.height) {
                    this.texture.canvas.height = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.setPosition = function (x, y) {
            this.screenView.x = x;
            this.screenView.y = y;
        };
        Camera.prototype.setSize = function (width, height) {
            this.screenView.width = width * this.transform.scale.x;
            this.screenView.height = height * this.transform.scale.y;
            this.worldView.width = width;
            this.worldView.height = height;
            if(width !== this.texture.canvas.width) {
                this.texture.canvas.width = width;
            }
            if(height !== this.texture.canvas.height) {
                this.texture.canvas.height = height;
            }
        };
        Object.defineProperty(Camera.prototype, "rotation", {
            get: function () {
                return this.transform.rotation;
            },
            set: function (value) {
                this.transform.rotation = this.game.math.wrap(value, 360, 0);
            },
            enumerable: true,
            configurable: true
        });
        return Camera;
    })();
    Phaser.Camera = Camera;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var CameraManager = (function () {
        function CameraManager(game, x, y, width, height) {
            this._sortIndex = '';
            this.game = game;
            this._cameras = [];
            this._cameraLength = 0;
            this.defaultCamera = this.addCamera(x, y, width, height);
            this.defaultCamera.directToStage = true;
            this.current = this.defaultCamera;
        }
        CameraManager.prototype.getAll = function () {
            return this._cameras;
        };
        CameraManager.prototype.update = function () {
            for(var i = 0; i < this._cameras.length; i++) {
                this._cameras[i].update();
            }
        };
        CameraManager.prototype.postUpdate = function () {
            for(var i = 0; i < this._cameras.length; i++) {
                this._cameras[i].postUpdate();
            }
        };
        CameraManager.prototype.addCamera = function (x, y, width, height) {
            var newCam = new Phaser.Camera(this.game, this._cameraLength, x, y, width, height);
            this._cameraLength = this._cameras.push(newCam);
            return newCam;
        };
        CameraManager.prototype.removeCamera = function (id) {
            for(var c = 0; c < this._cameras.length; c++) {
                if(this._cameras[c].ID == id) {
                    if(this.current.ID === this._cameras[c].ID) {
                        this.current = null;
                    }
                    this._cameras.splice(c, 1);
                    return true;
                }
            }
            return false;
        };
        CameraManager.prototype.swap = function (camera1, camera2, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if(camera1.ID == camera2.ID) {
                return false;
            }
            var tempZ = camera1.z;
            camera1.z = camera2.z;
            camera2.z = tempZ;
            if(sort) {
                this.sort();
            }
            return true;
        };
        CameraManager.prototype.getCameraUnderPoint = function (x, y) {
            for(var c = this._cameraLength - 1; c >= 0; c--) {
                if(this._cameras[c].visible && Phaser.RectangleUtils.contains(this._cameras[c].screenView, x, y)) {
                    return this._cameras[c];
                }
            }
            return null;
        };
        CameraManager.prototype.sort = function (index, order) {
            if (typeof index === "undefined") { index = 'z'; }
            if (typeof order === "undefined") { order = Phaser.Types.SORT_ASCENDING; }
            var _this = this;
            this._sortIndex = index;
            this._sortOrder = order;
            this._cameras.sort(function (a, b) {
                return _this.sortHandler(a, b);
            });
        };
        CameraManager.prototype.sortHandler = function (obj1, obj2) {
            if(obj1[this._sortIndex] < obj2[this._sortIndex]) {
                return this._sortOrder;
            } else if(obj1[this._sortIndex] > obj2[this._sortIndex]) {
                return -this._sortOrder;
            }
            return 0;
        };
        CameraManager.prototype.destroy = function () {
            this._cameras.length = 0;
            this.current = this.addCamera(0, 0, this.game.stage.width, this.game.stage.height);
        };
        return CameraManager;
    })();
    Phaser.CameraManager = CameraManager;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Display) {
        var CSS3Filters = (function () {
            function CSS3Filters(parent) {
                this._blur = 0;
                this._grayscale = 0;
                this._sepia = 0;
                this._brightness = 0;
                this._contrast = 0;
                this._hueRotate = 0;
                this._invert = 0;
                this._opacity = 0;
                this._saturate = 0;
                this.parent = parent;
            }
            CSS3Filters.prototype.setFilter = function (local, prefix, value, unit) {
                this[local] = value;
                if(this.parent) {
                    this.parent.style['-webkit-filter'] = prefix + '(' + value + unit + ')';
                }
            };
            Object.defineProperty(CSS3Filters.prototype, "blur", {
                get: function () {
                    return this._blur;
                },
                set: function (radius) {
                    this.setFilter('_blur', 'blur', radius, 'px');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "grayscale", {
                get: function () {
                    return this._grayscale;
                },
                set: function (amount) {
                    this.setFilter('_grayscale', 'grayscale', amount, '%');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "sepia", {
                get: function () {
                    return this._sepia;
                },
                set: function (amount) {
                    this.setFilter('_sepia', 'sepia', amount, '%');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "brightness", {
                get: function () {
                    return this._brightness;
                },
                set: function (amount) {
                    this.setFilter('_brightness', 'brightness', amount, '%');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "contrast", {
                get: function () {
                    return this._contrast;
                },
                set: function (amount) {
                    this.setFilter('_contrast', 'contrast', amount, '%');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "hueRotate", {
                get: function () {
                    return this._hueRotate;
                },
                set: function (angle) {
                    this.setFilter('_hueRotate', 'hue-rotate', angle, 'deg');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "invert", {
                get: function () {
                    return this._invert;
                },
                set: function (value) {
                    this.setFilter('_invert', 'invert', value, '%');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "opacity", {
                get: function () {
                    return this._opacity;
                },
                set: function (value) {
                    this.setFilter('_opacity', 'opacity', value, '%');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSS3Filters.prototype, "saturate", {
                get: function () {
                    return this._saturate;
                },
                set: function (value) {
                    this.setFilter('_saturate', 'saturate', value, '%');
                },
                enumerable: true,
                configurable: true
            });
            return CSS3Filters;
        })();
        Display.CSS3Filters = CSS3Filters;        
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Display) {
        var DynamicTexture = (function () {
            function DynamicTexture(game, width, height) {
                this._sx = 0;
                this._sy = 0;
                this._sw = 0;
                this._sh = 0;
                this._dx = 0;
                this._dy = 0;
                this._dw = 0;
                this._dh = 0;
                this.globalCompositeOperation = null;
                this.game = game;
                this.type = Phaser.Types.DYNAMICTEXTURE;
                this.canvas = document.createElement('canvas');
                this.canvas.width = width;
                this.canvas.height = height;
                this.context = this.canvas.getContext('2d');
                this.css3 = new Phaser.Display.CSS3Filters(this.canvas);
                this.bounds = new Phaser.Rectangle(0, 0, width, height);
            }
            DynamicTexture.prototype.getPixel = function (x, y) {
                var imageData = this.context.getImageData(x, y, 1, 1);
                return Phaser.ColorUtils.getColor(imageData.data[0], imageData.data[1], imageData.data[2]);
            };
            DynamicTexture.prototype.getPixel32 = function (x, y) {
                var imageData = this.context.getImageData(x, y, 1, 1);
                return Phaser.ColorUtils.getColor32(imageData.data[3], imageData.data[0], imageData.data[1], imageData.data[2]);
            };
            DynamicTexture.prototype.getPixels = function (rect) {
                return this.context.getImageData(rect.x, rect.y, rect.width, rect.height);
            };
            DynamicTexture.prototype.setPixel = function (x, y, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, 1, 1);
            };
            DynamicTexture.prototype.setPixel32 = function (x, y, color) {
                this.context.fillStyle = color;
                this.context.fillRect(x, y, 1, 1);
            };
            DynamicTexture.prototype.setPixels = function (rect, input) {
                this.context.putImageData(input, rect.x, rect.y);
            };
            DynamicTexture.prototype.fillRect = function (rect, color) {
                this.context.fillStyle = color;
                this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
            };
            DynamicTexture.prototype.pasteImage = function (key, frame, destX, destY, destWidth, destHeight) {
                if (typeof frame === "undefined") { frame = -1; }
                if (typeof destX === "undefined") { destX = 0; }
                if (typeof destY === "undefined") { destY = 0; }
                if (typeof destWidth === "undefined") { destWidth = null; }
                if (typeof destHeight === "undefined") { destHeight = null; }
                var texture = null;
                var frameData;
                this._sx = 0;
                this._sy = 0;
                this._dx = destX;
                this._dy = destY;
                if(frame > -1) {
                } else {
                    texture = this.game.cache.getImage(key);
                    this._sw = texture.width;
                    this._sh = texture.height;
                    this._dw = texture.width;
                    this._dh = texture.height;
                }
                if(destWidth !== null) {
                    this._dw = destWidth;
                }
                if(destHeight !== null) {
                    this._dh = destHeight;
                }
                if(texture != null) {
                    this.context.drawImage(texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                }
            };
            DynamicTexture.prototype.copyPixels = function (sourceTexture, sourceRect, destPoint) {
                if(Phaser.RectangleUtils.equals(sourceRect, this.bounds) == true) {
                    this.context.drawImage(sourceTexture.canvas, destPoint.x, destPoint.y);
                } else {
                    this.context.putImageData(sourceTexture.getPixels(sourceRect), destPoint.x, destPoint.y);
                }
            };
            DynamicTexture.prototype.add = function (sprite) {
                sprite.texture.canvas = this.canvas;
                sprite.texture.context = this.context;
            };
            DynamicTexture.prototype.assignCanvasToGameObjects = function (objects) {
                for(var i = 0; i < objects.length; i++) {
                    if(objects[i].texture) {
                        objects[i].texture.canvas = this.canvas;
                        objects[i].texture.context = this.context;
                    }
                }
            };
            DynamicTexture.prototype.clear = function () {
                this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);
            };
            DynamicTexture.prototype.render = function (x, y) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if(this.globalCompositeOperation) {
                    this.game.stage.context.save();
                    this.game.stage.context.globalCompositeOperation = this.globalCompositeOperation;
                }
                this.game.stage.context.drawImage(this.canvas, x, y);
                if(this.globalCompositeOperation) {
                    this.game.stage.context.restore();
                }
            };
            Object.defineProperty(DynamicTexture.prototype, "width", {
                get: function () {
                    return this.bounds.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DynamicTexture.prototype, "height", {
                get: function () {
                    return this.bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            return DynamicTexture;
        })();
        Display.DynamicTexture = DynamicTexture;        
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Display) {
        var Texture = (function () {
            function Texture(parent) {
                this.imageTexture = null;
                this.dynamicTexture = null;
                this.loaded = false;
                this.opaque = false;
                this.backgroundColor = 'rgb(255,255,255)';
                this.globalCompositeOperation = null;
                this.renderRotation = true;
                this.flippedX = false;
                this.flippedY = false;
                this.isDynamic = false;
                this.game = parent.game;
                this.parent = parent;
                this.canvas = parent.game.stage.canvas;
                this.context = parent.game.stage.context;
                this.alpha = 1;
                this.flippedX = false;
                this.flippedY = false;
                this._width = 16;
                this._height = 16;
                this.cameraBlacklist = [];
                this._blacklist = 0;
            }
            Texture.prototype.hideFromCamera = function (camera) {
                if(this.isHidden(camera) == false) {
                    this.cameraBlacklist.push(camera.ID);
                    this._blacklist++;
                }
            };
            Texture.prototype.isHidden = function (camera) {
                if(this._blacklist && this.cameraBlacklist.indexOf(camera.ID) !== -1) {
                    return true;
                }
                return false;
            };
            Texture.prototype.showToCamera = function (camera) {
                if(this.isHidden(camera)) {
                    this.cameraBlacklist.slice(this.cameraBlacklist.indexOf(camera.ID), 1);
                    this._blacklist--;
                }
            };
            Texture.prototype.setTo = function (image, dynamic) {
                if (typeof image === "undefined") { image = null; }
                if (typeof dynamic === "undefined") { dynamic = null; }
                if(dynamic) {
                    this.isDynamic = true;
                    this.dynamicTexture = dynamic;
                    this.texture = this.dynamicTexture.canvas;
                } else {
                    this.isDynamic = false;
                    this.imageTexture = image;
                    this.texture = this.imageTexture;
                    this._width = image.width;
                    this._height = image.height;
                }
                this.loaded = true;
                return this.parent;
            };
            Texture.prototype.loadImage = function (key, clearAnimations, updateBody) {
                if (typeof clearAnimations === "undefined") { clearAnimations = true; }
                if (typeof updateBody === "undefined") { updateBody = true; }
                if(clearAnimations && this.parent['animations'] && this.parent['animations'].frameData !== null) {
                    this.parent.animations.destroy();
                }
                if(this.game.cache.getImage(key) !== null) {
                    this.setTo(this.game.cache.getImage(key), null);
                    this.cacheKey = key;
                    if(this.game.cache.isSpriteSheet(key) && this.parent['animations']) {
                        this.parent.animations.loadFrameData(this.parent.game.cache.getFrameData(key));
                    } else {
                        if(updateBody && this.parent['body']) {
                            this.parent.body.bounds.width = this.width;
                            this.parent.body.bounds.height = this.height;
                        }
                    }
                }
            };
            Texture.prototype.loadDynamicTexture = function (texture) {
                if(this.parent.animations.frameData !== null) {
                    this.parent.animations.destroy();
                }
                this.setTo(null, texture);
                this.parent.texture.width = this.width;
                this.parent.texture.height = this.height;
            };
            Object.defineProperty(Texture.prototype, "width", {
                get: function () {
                    if(this.isDynamic) {
                        return this.dynamicTexture.width;
                    } else {
                        return this._width;
                    }
                },
                set: function (value) {
                    this._width = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Texture.prototype, "height", {
                get: function () {
                    if(this.isDynamic) {
                        return this.dynamicTexture.height;
                    } else {
                        return this._height;
                    }
                },
                set: function (value) {
                    this._height = value;
                },
                enumerable: true,
                configurable: true
            });
            return Texture;
        })();
        Display.Texture = Texture;        
    })(Phaser.Display || (Phaser.Display = {}));
    var Display = Phaser.Display;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Back = (function () {
            function Back() { }
            Back.In = function In(k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            };
            Back.Out = function Out(k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            };
            Back.InOut = function InOut(k) {
                var s = 1.70158 * 1.525;
                if((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            };
            return Back;
        })();
        Easing.Back = Back;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Bounce = (function () {
            function Bounce() { }
            Bounce.In = function In(k) {
                return 1 - Phaser.Easing.Bounce.Out(1 - k);
            };
            Bounce.Out = function Out(k) {
                if(k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if(k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if(k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            };
            Bounce.InOut = function InOut(k) {
                if(k < 0.5) {
                    return Phaser.Easing.Bounce.In(k * 2) * 0.5;
                }
                return Phaser.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            };
            return Bounce;
        })();
        Easing.Bounce = Bounce;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Circular = (function () {
            function Circular() { }
            Circular.In = function In(k) {
                return 1 - Math.sqrt(1 - k * k);
            };
            Circular.Out = function Out(k) {
                return Math.sqrt(1 - (--k * k));
            };
            Circular.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            };
            return Circular;
        })();
        Easing.Circular = Circular;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Cubic = (function () {
            function Cubic() { }
            Cubic.In = function In(k) {
                return k * k * k;
            };
            Cubic.Out = function Out(k) {
                return --k * k * k + 1;
            };
            Cubic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k + 2);
            };
            return Cubic;
        })();
        Easing.Cubic = Cubic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Elastic = (function () {
            function Elastic() { }
            Elastic.In = function In(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            };
            Elastic.Out = function Out(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
            };
            Elastic.InOut = function InOut(k) {
                var s, a = 0.1, p = 0.4;
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if(!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p * Math.asin(1 / a) / (2 * Math.PI);
                }
                if((k *= 2) < 1) {
                    return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                }
                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
            };
            return Elastic;
        })();
        Easing.Elastic = Elastic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Exponential = (function () {
            function Exponential() { }
            Exponential.In = function In(k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            };
            Exponential.Out = function Out(k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            };
            Exponential.InOut = function InOut(k) {
                if(k === 0) {
                    return 0;
                }
                if(k === 1) {
                    return 1;
                }
                if((k *= 2) < 1) {
                    return 0.5 * Math.pow(1024, k - 1);
                }
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            };
            return Exponential;
        })();
        Easing.Exponential = Exponential;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Linear = (function () {
            function Linear() { }
            Linear.None = function None(k) {
                return k;
            };
            return Linear;
        })();
        Easing.Linear = Linear;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Quadratic = (function () {
            function Quadratic() { }
            Quadratic.In = function In(k) {
                return k * k;
            };
            Quadratic.Out = function Out(k) {
                return k * (2 - k);
            };
            Quadratic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k;
                }
                return -0.5 * (--k * (k - 2) - 1);
            };
            return Quadratic;
        })();
        Easing.Quadratic = Quadratic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Quartic = (function () {
            function Quartic() { }
            Quartic.In = function In(k) {
                return k * k * k * k;
            };
            Quartic.Out = function Out(k) {
                return 1 - (--k * k * k * k);
            };
            Quartic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k * k * k;
                }
                return -0.5 * ((k -= 2) * k * k * k - 2);
            };
            return Quartic;
        })();
        Easing.Quartic = Quartic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Quintic = (function () {
            function Quintic() { }
            Quintic.In = function In(k) {
                return k * k * k * k * k;
            };
            Quintic.Out = function Out(k) {
                return --k * k * k * k * k + 1;
            };
            Quintic.InOut = function InOut(k) {
                if((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            };
            return Quintic;
        })();
        Easing.Quintic = Quintic;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Easing) {
        var Sinusoidal = (function () {
            function Sinusoidal() { }
            Sinusoidal.In = function In(k) {
                return 1 - Math.cos(k * Math.PI / 2);
            };
            Sinusoidal.Out = function Out(k) {
                return Math.sin(k * Math.PI / 2);
            };
            Sinusoidal.InOut = function InOut(k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            };
            return Sinusoidal;
        })();
        Easing.Sinusoidal = Sinusoidal;        
    })(Phaser.Easing || (Phaser.Easing = {}));
    var Easing = Phaser.Easing;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Tween = (function () {
        function Tween(object, game) {
            this._object = null;
            this._pausedTime = 0;
            this._valuesStart = {
            };
            this._valuesEnd = {
            };
            this._duration = 1000;
            this._delayTime = 0;
            this._startTime = null;
            this._loop = false;
            this._yoyo = false;
            this._yoyoCount = 0;
            this._chainedTweens = [];
            this.isRunning = false;
            this._object = object;
            this.game = game;
            this._manager = this.game.tweens;
            this._interpolationFunction = this.game.math.linearInterpolation;
            this._easingFunction = Phaser.Easing.Linear.None;
            this._chainedTweens = [];
            this.onStart = new Phaser.Signal();
            this.onUpdate = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();
        }
        Tween.prototype.to = function (properties, duration, ease, autoStart, delay, loop, yoyo) {
            if (typeof duration === "undefined") { duration = 1000; }
            if (typeof ease === "undefined") { ease = null; }
            if (typeof autoStart === "undefined") { autoStart = false; }
            if (typeof delay === "undefined") { delay = 0; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof yoyo === "undefined") { yoyo = false; }
            this._duration = duration;
            this._valuesEnd = properties;
            if(ease !== null) {
                this._easingFunction = ease;
            }
            if(delay > 0) {
                this._delayTime = delay;
            }
            this._loop = loop;
            this._yoyo = yoyo;
            this._yoyoCount = 0;
            if(autoStart === true) {
                return this.start();
            } else {
                return this;
            }
        };
        Tween.prototype.loop = function (value) {
            this._loop = value;
            return this;
        };
        Tween.prototype.yoyo = function (value) {
            this._yoyo = value;
            this._yoyoCount = 0;
            return this;
        };
        Tween.prototype.start = function (looped) {
            if (typeof looped === "undefined") { looped = false; }
            if(this.game === null || this._object === null) {
                return;
            }
            if(looped == false) {
                this._manager.add(this);
                this.onStart.dispatch(this._object);
            }
            this._startTime = this.game.time.now + this._delayTime;
            this.isRunning = true;
            for(var property in this._valuesEnd) {
                if(this._object[property] === null || !(property in this._object)) {
                    throw Error('Phaser.Tween interpolation of null value of non-existing property');
                    continue;
                }
                if(this._valuesEnd[property] instanceof Array) {
                    if(this._valuesEnd[property].length === 0) {
                        continue;
                    }
                    this._valuesEnd[property] = [
                        this._object[property]
                    ].concat(this._valuesEnd[property]);
                }
                if(looped == false) {
                    this._valuesStart[property] = this._object[property];
                }
            }
            return this;
        };
        Tween.prototype.reverse = function () {
            var tempObj = {
            };
            for(var property in this._valuesStart) {
                tempObj[property] = this._valuesStart[property];
                this._valuesStart[property] = this._valuesEnd[property];
                this._valuesEnd[property] = tempObj[property];
            }
            this._yoyoCount++;
            return this.start(true);
        };
        Tween.prototype.reset = function () {
            for(var property in this._valuesStart) {
                this._object[property] = this._valuesStart[property];
            }
            return this.start(true);
        };
        Tween.prototype.clear = function () {
            this._chainedTweens = [];
            this.onStart.removeAll();
            this.onUpdate.removeAll();
            this.onComplete.removeAll();
            return this;
        };
        Tween.prototype.stop = function () {
            if(this._manager !== null) {
                this._manager.remove(this);
            }
            this.isRunning = false;
            this.onComplete.dispose();
            return this;
        };
        Object.defineProperty(Tween.prototype, "parent", {
            set: function (value) {
                this.game = value;
                this._manager = this.game.tweens;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "delay", {
            get: function () {
                return this._delayTime;
            },
            set: function (amount) {
                this._delayTime = amount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "easing", {
            get: function () {
                return this._easingFunction;
            },
            set: function (easing) {
                this._easingFunction = easing;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tween.prototype, "interpolation", {
            get: function () {
                return this._interpolationFunction;
            },
            set: function (interpolation) {
                this._interpolationFunction = interpolation;
            },
            enumerable: true,
            configurable: true
        });
        Tween.prototype.chain = function (tween) {
            this._chainedTweens.push(tween);
            return this;
        };
        Tween.prototype.pause = function () {
            this._paused = true;
        };
        Tween.prototype.resume = function () {
            this._paused = false;
            this._startTime += this.game.time.pauseDuration;
        };
        Tween.prototype.update = function (time) {
            if(this._paused || time < this._startTime) {
                return true;
            }
            this._tempElapsed = (time - this._startTime) / this._duration;
            this._tempElapsed = this._tempElapsed > 1 ? 1 : this._tempElapsed;
            this._tempValue = this._easingFunction(this._tempElapsed);
            for(var property in this._valuesStart) {
                if(this._valuesEnd[property] instanceof Array) {
                    this._object[property] = this._interpolationFunction(this._valuesEnd[property], this._tempValue);
                } else {
                    this._object[property] = this._valuesStart[property] + (this._valuesEnd[property] - this._valuesStart[property]) * this._tempValue;
                }
            }
            this.onUpdate.dispatch(this._object, this._tempValue);
            if(this._tempElapsed == 1) {
                if(this._yoyo) {
                    if(this._yoyoCount == 0) {
                        this.reverse();
                        return true;
                    } else {
                        if(this._loop == false) {
                            this.onComplete.dispatch(this._object);
                            for(var i = 0; i < this._chainedTweens.length; i++) {
                                this._chainedTweens[i].start();
                            }
                            return false;
                        } else {
                            this._yoyoCount = 0;
                            this.reverse();
                            return true;
                        }
                    }
                }
                if(this._loop) {
                    this._yoyoCount = 0;
                    this.reset();
                    return true;
                } else {
                    this.onComplete.dispatch(this._object);
                    for(var i = 0; i < this._chainedTweens.length; i++) {
                        this._chainedTweens[i].start();
                    }
                    if(this._chainedTweens.length == 0) {
                        this.isRunning = false;
                    }
                    return false;
                }
            }
            return true;
        };
        return Tween;
    })();
    Phaser.Tween = Tween;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var TweenManager = (function () {
        function TweenManager(game) {
            this.game = game;
            this._tweens = [];
            this.game.onPause.add(this.pauseAll, this);
            this.game.onResume.add(this.resumeAll, this);
        }
        TweenManager.prototype.getAll = function () {
            return this._tweens;
        };
        TweenManager.prototype.removeAll = function () {
            this._tweens.length = 0;
        };
        TweenManager.prototype.create = function (object, localReference) {
            if (typeof localReference === "undefined") { localReference = false; }
            if(localReference) {
                object['tween'] = new Phaser.Tween(object, this.game);
                return object['tween'];
            } else {
                return new Phaser.Tween(object, this.game);
            }
        };
        TweenManager.prototype.add = function (tween) {
            tween.parent = this.game;
            this._tweens.push(tween);
            return tween;
        };
        TweenManager.prototype.remove = function (tween) {
            var i = this._tweens.indexOf(tween);
            if(i !== -1) {
                this._tweens.splice(i, 1);
            }
        };
        TweenManager.prototype.update = function () {
            if(this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            var numTweens = this._tweens.length;
            while(i < numTweens) {
                if(this._tweens[i].update(this.game.time.now)) {
                    i++;
                } else {
                    this._tweens.splice(i, 1);
                    numTweens--;
                }
            }
            return true;
        };
        TweenManager.prototype.pauseAll = function () {
            if(this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            var numTweens = this._tweens.length;
            while(i < numTweens) {
                this._tweens[i].pause();
                i++;
            }
        };
        TweenManager.prototype.resumeAll = function () {
            if(this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            var numTweens = this._tweens.length;
            while(i < numTweens) {
                this._tweens[i].resume();
                i++;
            }
        };
        return TweenManager;
    })();
    Phaser.TweenManager = TweenManager;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var TimeManager = (function () {
        function TimeManager(game) {
            this.elapsed = 0;
            this.physicsElapsed = 0;
            this.time = 0;
            this.pausedTime = 0;
            this.now = 0;
            this.delta = 0;
            this.fps = 0;
            this.fpsMin = 1000;
            this.fpsMax = 0;
            this.msMin = 1000;
            this.msMax = 0;
            this.frames = 0;
            this._timeLastSecond = 0;
            this.pauseDuration = 0;
            this._pauseStarted = 0;
            this.game = game;
            this._started = 0;
            this._timeLastSecond = this._started;
            this.time = this._started;
            this.game.onPause.add(this.gamePaused, this);
            this.game.onResume.add(this.gameResumed, this);
        }
        Object.defineProperty(TimeManager.prototype, "totalElapsedSeconds", {
            get: function () {
                return (this.now - this._started) * 0.001;
            },
            enumerable: true,
            configurable: true
        });
        TimeManager.prototype.update = function (raf) {
            this.now = raf;
            this.delta = this.now - this.time;
            this.msMin = Math.min(this.msMin, this.delta);
            this.msMax = Math.max(this.msMax, this.delta);
            this.frames++;
            if(this.now > this._timeLastSecond + 1000) {
                this.fps = Math.round((this.frames * 1000) / (this.now - this._timeLastSecond));
                this.fpsMin = Math.min(this.fpsMin, this.fps);
                this.fpsMax = Math.max(this.fpsMax, this.fps);
                this._timeLastSecond = this.now;
                this.frames = 0;
            }
            this.time = this.now;
            this.physicsElapsed = 1.0 * (16.66 / 1000);
            if(this.game.paused) {
                this.pausedTime = this.now - this._pauseStarted;
            }
        };
        TimeManager.prototype.gamePaused = function () {
            this._pauseStarted = this.now;
        };
        TimeManager.prototype.gameResumed = function () {
            this.pauseDuration = this.pausedTime;
        };
        TimeManager.prototype.elapsedSince = function (since) {
            return this.now - since;
        };
        TimeManager.prototype.elapsedSecondsSince = function (since) {
            return (this.now - since) * 0.001;
        };
        TimeManager.prototype.reset = function () {
            this._started = this.now;
        };
        return TimeManager;
    })();
    Phaser.TimeManager = TimeManager;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Net = (function () {
        function Net(game) {
            this.game = game;
        }
        Net.prototype.checkDomainName = function (domain) {
            return window.location.hostname.indexOf(domain) !== -1;
        };
        Net.prototype.updateQueryString = function (key, value, redirect, url) {
            if (typeof redirect === "undefined") { redirect = false; }
            if (typeof url === "undefined") { url = ''; }
            if(url == '') {
                url = window.location.href;
            }
            var output = '';
            var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
            if(re.test(url)) {
                if(typeof value !== 'undefined' && value !== null) {
                    output = url.replace(re, '$1' + key + "=" + value + '$2$3');
                } else {
                    output = url.replace(re, '$1$3').replace(/(&|\?)$/, '');
                }
            } else {
                if(typeof value !== 'undefined' && value !== null) {
                    var separator = url.indexOf('?') !== -1 ? '&' : '?';
                    var hash = url.split('#');
                    url = hash[0] + separator + key + '=' + value;
                    if(hash[1]) {
                        url += '#' + hash[1];
                    }
                    output = url;
                } else {
                    output = url;
                }
            }
            if(redirect) {
                window.location.href = output;
            } else {
                return output;
            }
        };
        Net.prototype.getQueryString = function (parameter) {
            if (typeof parameter === "undefined") { parameter = ''; }
            var output = {
            };
            var keyValues = location.search.substring(1).split('&');
            for(var i in keyValues) {
                var key = keyValues[i].split('=');
                if(key.length > 1) {
                    if(parameter && parameter == this.decodeURI(key[0])) {
                        return this.decodeURI(key[1]);
                    } else {
                        output[this.decodeURI(key[0])] = this.decodeURI(key[1]);
                    }
                }
            }
            return output;
        };
        Net.prototype.decodeURI = function (value) {
            return decodeURIComponent(value.replace(/\+/g, " "));
        };
        return Net;
    })();
    Phaser.Net = Net;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Keyboard = (function () {
        function Keyboard(game) {
            this._keys = {
            };
            this._capture = {
            };
            this.disabled = false;
            this.game = game;
        }
        Keyboard.prototype.start = function () {
            var _this = this;
            this._onKeyDown = function (event) {
                return _this.onKeyDown(event);
            };
            this._onKeyUp = function (event) {
                return _this.onKeyUp(event);
            };
            document.body.addEventListener('keydown', this._onKeyDown, false);
            document.body.addEventListener('keyup', this._onKeyUp, false);
        };
        Keyboard.prototype.stop = function () {
            document.body.removeEventListener('keydown', this._onKeyDown);
            document.body.removeEventListener('keyup', this._onKeyUp);
        };
        Keyboard.prototype.addKeyCapture = function (keycode) {
            if(typeof keycode === 'object') {
                for(var i = 0; i < keycode.length; i++) {
                    this._capture[keycode[i]] = true;
                }
            } else {
                this._capture[keycode] = true;
            }
        };
        Keyboard.prototype.removeKeyCapture = function (keycode) {
            delete this._capture[keycode];
        };
        Keyboard.prototype.clearCaptures = function () {
            this._capture = {
            };
        };
        Keyboard.prototype.onKeyDown = function (event) {
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            if(this._capture[event.keyCode]) {
                event.preventDefault();
            }
            if(!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = {
                    isDown: true,
                    timeDown: this.game.time.now,
                    timeUp: 0
                };
            } else {
                this._keys[event.keyCode].isDown = true;
                this._keys[event.keyCode].timeDown = this.game.time.now;
            }
        };
        Keyboard.prototype.onKeyUp = function (event) {
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            if(this._capture[event.keyCode]) {
                event.preventDefault();
            }
            if(!this._keys[event.keyCode]) {
                this._keys[event.keyCode] = {
                    isDown: false,
                    timeDown: 0,
                    timeUp: this.game.time.now
                };
            } else {
                this._keys[event.keyCode].isDown = false;
                this._keys[event.keyCode].timeUp = this.game.time.now;
            }
        };
        Keyboard.prototype.reset = function () {
            for(var key in this._keys) {
                this._keys[key].isDown = false;
            }
        };
        Keyboard.prototype.justPressed = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if(this._keys[keycode] && this._keys[keycode].isDown === true && (this.game.time.now - this._keys[keycode].timeDown < duration)) {
                return true;
            } else {
                return false;
            }
        };
        Keyboard.prototype.justReleased = function (keycode, duration) {
            if (typeof duration === "undefined") { duration = 250; }
            if(this._keys[keycode] && this._keys[keycode].isDown === false && (this.game.time.now - this._keys[keycode].timeUp < duration)) {
                return true;
            } else {
                return false;
            }
        };
        Keyboard.prototype.isDown = function (keycode) {
            if(this._keys[keycode]) {
                return this._keys[keycode].isDown;
            } else {
                return false;
            }
        };
        Keyboard.A = "A".charCodeAt(0);
        Keyboard.B = "B".charCodeAt(0);
        Keyboard.C = "C".charCodeAt(0);
        Keyboard.D = "D".charCodeAt(0);
        Keyboard.E = "E".charCodeAt(0);
        Keyboard.F = "F".charCodeAt(0);
        Keyboard.G = "G".charCodeAt(0);
        Keyboard.H = "H".charCodeAt(0);
        Keyboard.I = "I".charCodeAt(0);
        Keyboard.J = "J".charCodeAt(0);
        Keyboard.K = "K".charCodeAt(0);
        Keyboard.L = "L".charCodeAt(0);
        Keyboard.M = "M".charCodeAt(0);
        Keyboard.N = "N".charCodeAt(0);
        Keyboard.O = "O".charCodeAt(0);
        Keyboard.P = "P".charCodeAt(0);
        Keyboard.Q = "Q".charCodeAt(0);
        Keyboard.R = "R".charCodeAt(0);
        Keyboard.S = "S".charCodeAt(0);
        Keyboard.T = "T".charCodeAt(0);
        Keyboard.U = "U".charCodeAt(0);
        Keyboard.V = "V".charCodeAt(0);
        Keyboard.W = "W".charCodeAt(0);
        Keyboard.X = "X".charCodeAt(0);
        Keyboard.Y = "Y".charCodeAt(0);
        Keyboard.Z = "Z".charCodeAt(0);
        Keyboard.ZERO = "0".charCodeAt(0);
        Keyboard.ONE = "1".charCodeAt(0);
        Keyboard.TWO = "2".charCodeAt(0);
        Keyboard.THREE = "3".charCodeAt(0);
        Keyboard.FOUR = "4".charCodeAt(0);
        Keyboard.FIVE = "5".charCodeAt(0);
        Keyboard.SIX = "6".charCodeAt(0);
        Keyboard.SEVEN = "7".charCodeAt(0);
        Keyboard.EIGHT = "8".charCodeAt(0);
        Keyboard.NINE = "9".charCodeAt(0);
        Keyboard.NUMPAD_0 = 96;
        Keyboard.NUMPAD_1 = 97;
        Keyboard.NUMPAD_2 = 98;
        Keyboard.NUMPAD_3 = 99;
        Keyboard.NUMPAD_4 = 100;
        Keyboard.NUMPAD_5 = 101;
        Keyboard.NUMPAD_6 = 102;
        Keyboard.NUMPAD_7 = 103;
        Keyboard.NUMPAD_8 = 104;
        Keyboard.NUMPAD_9 = 105;
        Keyboard.NUMPAD_MULTIPLY = 106;
        Keyboard.NUMPAD_ADD = 107;
        Keyboard.NUMPAD_ENTER = 108;
        Keyboard.NUMPAD_SUBTRACT = 109;
        Keyboard.NUMPAD_DECIMAL = 110;
        Keyboard.NUMPAD_DIVIDE = 111;
        Keyboard.F1 = 112;
        Keyboard.F2 = 113;
        Keyboard.F3 = 114;
        Keyboard.F4 = 115;
        Keyboard.F5 = 116;
        Keyboard.F6 = 117;
        Keyboard.F7 = 118;
        Keyboard.F8 = 119;
        Keyboard.F9 = 120;
        Keyboard.F10 = 121;
        Keyboard.F11 = 122;
        Keyboard.F12 = 123;
        Keyboard.F13 = 124;
        Keyboard.F14 = 125;
        Keyboard.F15 = 126;
        Keyboard.COLON = 186;
        Keyboard.EQUALS = 187;
        Keyboard.UNDERSCORE = 189;
        Keyboard.QUESTION_MARK = 191;
        Keyboard.TILDE = 192;
        Keyboard.OPEN_BRACKET = 219;
        Keyboard.BACKWARD_SLASH = 220;
        Keyboard.CLOSED_BRACKET = 221;
        Keyboard.QUOTES = 222;
        Keyboard.BACKSPACE = 8;
        Keyboard.TAB = 9;
        Keyboard.CLEAR = 12;
        Keyboard.ENTER = 13;
        Keyboard.SHIFT = 16;
        Keyboard.CONTROL = 17;
        Keyboard.ALT = 18;
        Keyboard.CAPS_LOCK = 20;
        Keyboard.ESC = 27;
        Keyboard.SPACEBAR = 32;
        Keyboard.PAGE_UP = 33;
        Keyboard.PAGE_DOWN = 34;
        Keyboard.END = 35;
        Keyboard.HOME = 36;
        Keyboard.LEFT = 37;
        Keyboard.UP = 38;
        Keyboard.RIGHT = 39;
        Keyboard.DOWN = 40;
        Keyboard.INSERT = 45;
        Keyboard.DELETE = 46;
        Keyboard.HELP = 47;
        Keyboard.NUM_LOCK = 144;
        return Keyboard;
    })();
    Phaser.Keyboard = Keyboard;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Mouse = (function () {
        function Mouse(game) {
            this.disabled = false;
            this.mouseDownCallback = null;
            this.mouseMoveCallback = null;
            this.mouseUpCallback = null;
            this.game = game;
            this.callbackContext = this.game;
        }
        Mouse.LEFT_BUTTON = 0;
        Mouse.MIDDLE_BUTTON = 1;
        Mouse.RIGHT_BUTTON = 2;
        Mouse.prototype.start = function () {
            var _this = this;
            if(this.game.device.android && this.game.device.chrome == false) {
                return;
            }
            this._onMouseDown = function (event) {
                return _this.onMouseDown(event);
            };
            this._onMouseMove = function (event) {
                return _this.onMouseMove(event);
            };
            this._onMouseUp = function (event) {
                return _this.onMouseUp(event);
            };
            this.game.stage.canvas.addEventListener('mousedown', this._onMouseDown, true);
            this.game.stage.canvas.addEventListener('mousemove', this._onMouseMove, true);
            this.game.stage.canvas.addEventListener('mouseup', this._onMouseUp, true);
        };
        Mouse.prototype.onMouseDown = function (event) {
            if(this.mouseDownCallback) {
                this.mouseDownCallback.call(this.callbackContext, event);
            }
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event['identifier'] = 0;
            this.game.input.mousePointer.start(event);
        };
        Mouse.prototype.onMouseMove = function (event) {
            if(this.mouseMoveCallback) {
                this.mouseMoveCallback.call(this.callbackContext, event);
            }
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event['identifier'] = 0;
            this.game.input.mousePointer.move(event);
        };
        Mouse.prototype.onMouseUp = function (event) {
            if(this.mouseUpCallback) {
                this.mouseUpCallback.call(this.callbackContext, event);
            }
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event['identifier'] = 0;
            this.game.input.mousePointer.stop(event);
        };
        Mouse.prototype.stop = function () {
            this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown);
            this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove);
            this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp);
        };
        return Mouse;
    })();
    Phaser.Mouse = Mouse;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var MSPointer = (function () {
        function MSPointer(game) {
            this.disabled = false;
            this.game = game;
        }
        MSPointer.prototype.start = function () {
            var _this = this;
            if(this.game.device.mspointer == true) {
                this._onMSPointerDown = function (event) {
                    return _this.onPointerDown(event);
                };
                this._onMSPointerMove = function (event) {
                    return _this.onPointerMove(event);
                };
                this._onMSPointerUp = function (event) {
                    return _this.onPointerUp(event);
                };
                this.game.stage.canvas.addEventListener('MSPointerDown', this._onMSPointerDown, false);
                this.game.stage.canvas.addEventListener('MSPointerMove', this._onMSPointerMove, false);
                this.game.stage.canvas.addEventListener('MSPointerUp', this._onMSPointerUp, false);
            }
        };
        MSPointer.prototype.onPointerDown = function (event) {
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            event.identifier = event.pointerId;
            this.game.input.startPointer(event);
        };
        MSPointer.prototype.onPointerMove = function (event) {
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            event.identifier = event.pointerId;
            this.game.input.updatePointer(event);
        };
        MSPointer.prototype.onPointerUp = function (event) {
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            event.identifier = event.pointerId;
            this.game.input.stopPointer(event);
        };
        MSPointer.prototype.stop = function () {
            if(this.game.device.mspointer == true) {
                this.game.stage.canvas.removeEventListener('MSPointerDown', this._onMSPointerDown);
                this.game.stage.canvas.removeEventListener('MSPointerMove', this._onMSPointerMove);
                this.game.stage.canvas.removeEventListener('MSPointerUp', this._onMSPointerUp);
            }
        };
        return MSPointer;
    })();
    Phaser.MSPointer = MSPointer;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Touch = (function () {
        function Touch(game) {
            this.disabled = false;
            this.touchStartCallback = null;
            this.touchMoveCallback = null;
            this.touchEndCallback = null;
            this.touchEnterCallback = null;
            this.touchLeaveCallback = null;
            this.touchCancelCallback = null;
            this.game = game;
            this.callbackContext = this.game;
        }
        Touch.prototype.start = function () {
            var _this = this;
            if(this.game.device.touch) {
                this._onTouchStart = function (event) {
                    return _this.onTouchStart(event);
                };
                this._onTouchMove = function (event) {
                    return _this.onTouchMove(event);
                };
                this._onTouchEnd = function (event) {
                    return _this.onTouchEnd(event);
                };
                this._onTouchEnter = function (event) {
                    return _this.onTouchEnter(event);
                };
                this._onTouchLeave = function (event) {
                    return _this.onTouchLeave(event);
                };
                this._onTouchCancel = function (event) {
                    return _this.onTouchCancel(event);
                };
                this._documentTouchMove = function (event) {
                    return _this.consumeTouchMove(event);
                };
                this.game.stage.canvas.addEventListener('touchstart', this._onTouchStart, false);
                this.game.stage.canvas.addEventListener('touchmove', this._onTouchMove, false);
                this.game.stage.canvas.addEventListener('touchend', this._onTouchEnd, false);
                this.game.stage.canvas.addEventListener('touchenter', this._onTouchEnter, false);
                this.game.stage.canvas.addEventListener('touchleave', this._onTouchLeave, false);
                this.game.stage.canvas.addEventListener('touchcancel', this._onTouchCancel, false);
                document.addEventListener('touchmove', this._documentTouchMove, false);
            }
        };
        Touch.prototype.consumeTouchMove = function (event) {
            event.preventDefault();
        };
        Touch.prototype.onTouchStart = function (event) {
            if(this.touchStartCallback) {
                this.touchStartCallback.call(this.callbackContext, event);
            }
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.startPointer(event.changedTouches[i]);
            }
        };
        Touch.prototype.onTouchCancel = function (event) {
            if(this.touchCancelCallback) {
                this.touchCancelCallback.call(this.callbackContext, event);
            }
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.stopPointer(event.changedTouches[i]);
            }
        };
        Touch.prototype.onTouchEnter = function (event) {
            if(this.touchEnterCallback) {
                this.touchEnterCallback.call(this.callbackContext, event);
            }
            if(this.game.input.disabled || this.disabled) {
                return;
            }
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
            }
        };
        Touch.prototype.onTouchLeave = function (event) {
            if(this.touchLeaveCallback) {
                this.touchLeaveCallback.call(this.callbackContext, event);
            }
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
            }
        };
        Touch.prototype.onTouchMove = function (event) {
            if(this.touchMoveCallback) {
                this.touchMoveCallback.call(this.callbackContext, event);
            }
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.updatePointer(event.changedTouches[i]);
            }
        };
        Touch.prototype.onTouchEnd = function (event) {
            if(this.touchEndCallback) {
                this.touchEndCallback.call(this.callbackContext, event);
            }
            event.preventDefault();
            for(var i = 0; i < event.changedTouches.length; i++) {
                this.game.input.stopPointer(event.changedTouches[i]);
            }
        };
        Touch.prototype.stop = function () {
            if(this.game.device.touch) {
                this.game.stage.canvas.removeEventListener('touchstart', this._onTouchStart);
                this.game.stage.canvas.removeEventListener('touchmove', this._onTouchMove);
                this.game.stage.canvas.removeEventListener('touchend', this._onTouchEnd);
                this.game.stage.canvas.removeEventListener('touchenter', this._onTouchEnter);
                this.game.stage.canvas.removeEventListener('touchleave', this._onTouchLeave);
                this.game.stage.canvas.removeEventListener('touchcancel', this._onTouchCancel);
                document.removeEventListener('touchmove', this._documentTouchMove);
            }
        };
        return Touch;
    })();
    Phaser.Touch = Touch;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Pointer = (function () {
        function Pointer(game, id) {
            this._holdSent = false;
            this._history = [];
            this._nextDrop = 0;
            this._stateReset = false;
            this.positionDown = null;
            this.position = null;
            this.circle = null;
            this.withinGame = false;
            this.clientX = -1;
            this.clientY = -1;
            this.pageX = -1;
            this.pageY = -1;
            this.screenX = -1;
            this.screenY = -1;
            this.x = -1;
            this.y = -1;
            this.isMouse = false;
            this.isDown = false;
            this.isUp = true;
            this.timeDown = 0;
            this.timeUp = 0;
            this.previousTapTime = 0;
            this.totalTouches = 0;
            this.msSinceLastClick = Number.MAX_VALUE;
            this.targetObject = null;
            this.camera = null;
            this.game = game;
            this.id = id;
            this.active = false;
            this.position = new Phaser.Vec2();
            this.positionDown = new Phaser.Vec2();
            this.circle = new Phaser.Circle(0, 0, 44);
            if(id == 0) {
                this.isMouse = true;
            }
        }
        Object.defineProperty(Pointer.prototype, "duration", {
            get: function () {
                if(this.isUp) {
                    return -1;
                }
                return this.game.time.now - this.timeDown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pointer.prototype, "worldX", {
            get: function () {
                if(this.camera) {
                    return (this.camera.worldView.x - this.camera.screenView.x) + this.x;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pointer.prototype, "worldY", {
            get: function () {
                if(this.camera) {
                    return (this.camera.worldView.y - this.camera.screenView.y) + this.y;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Pointer.prototype.start = function (event) {
            this.identifier = event.identifier;
            this.target = event.target;
            if(event.button) {
                this.button = event.button;
            }
            if(this.game.paused == true && this.game.stage.scale.incorrectOrientation == false) {
                this.game.stage.resumeGame();
                return this;
            }
            this._history.length = 0;
            this.active = true;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;
            this.msSinceLastClick = this.game.time.now - this.timeDown;
            this.timeDown = this.game.time.now;
            this._holdSent = false;
            this.move(event);
            this.positionDown.setTo(this.x, this.y);
            if(this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                this.game.input.x = this.x;
                this.game.input.y = this.y;
                this.game.input.position.setTo(this.x, this.y);
                this.game.input.onDown.dispatch(this);
                this.game.input.resetSpeed(this.x, this.y);
            }
            this._stateReset = false;
            this.totalTouches++;
            if(this.isMouse == false) {
                this.game.input.currentPointers++;
            }
            if(this.targetObject !== null) {
                this.targetObject.input._touchedHandler(this);
            }
            return this;
        };
        Pointer.prototype.update = function () {
            if(this.active) {
                if(this._holdSent == false && this.duration >= this.game.input.holdRate) {
                    if(this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                        this.game.input.onHold.dispatch(this);
                    }
                    this._holdSent = true;
                }
                if(this.game.input.recordPointerHistory && this.game.time.now >= this._nextDrop) {
                    this._nextDrop = this.game.time.now + this.game.input.recordRate;
                    this._history.push({
                        x: this.position.x,
                        y: this.position.y
                    });
                    if(this._history.length > this.game.input.recordLimit) {
                        this._history.shift();
                    }
                }
                this.camera = this.game.world.cameras.getCameraUnderPoint(this.x, this.y);
            }
        };
        Pointer.prototype.move = function (event) {
            if(this.game.input.pollLocked) {
                return;
            }
            if(event.button) {
                this.button = event.button;
            }
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.pageX = event.pageX;
            this.pageY = event.pageY;
            this.screenX = event.screenX;
            this.screenY = event.screenY;
            this.x = (this.pageX - this.game.stage.offset.x) * this.game.input.scale.x;
            this.y = (this.pageY - this.game.stage.offset.y) * this.game.input.scale.y;
            this.position.setTo(this.x, this.y);
            this.circle.x = this.x;
            this.circle.y = this.y;
            if(this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                this.game.input.activePointer = this;
                this.game.input.x = this.x;
                this.game.input.y = this.y;
                this.game.input.position.setTo(this.game.input.x, this.game.input.y);
                this.game.input.circle.x = this.game.input.x;
                this.game.input.circle.y = this.game.input.y;
            }
            if(this.game.paused) {
                return this;
            }
            if(this.targetObject !== null && this.targetObject.input && this.targetObject.input.isDragged == true) {
                if(this.targetObject.input.update(this) == false) {
                    this.targetObject = null;
                }
                return this;
            }
            this._highestRenderOrderID = -1;
            this._highestRenderObject = -1;
            this._highestInputPriorityID = -1;
            for(var i = 0; i < this.game.input.totalTrackedObjects; i++) {
                if(this.game.input.inputObjects[i] && this.game.input.inputObjects[i].input && this.game.input.inputObjects[i].input.checkPointerOver(this)) {
                    if(this.game.input.inputObjects[i].input.priorityID > this._highestInputPriorityID || (this.game.input.inputObjects[i].input.priorityID == this._highestInputPriorityID && this.game.input.inputObjects[i].renderOrderID > this._highestRenderOrderID)) {
                        this._highestRenderOrderID = this.game.input.inputObjects[i].renderOrderID;
                        this._highestRenderObject = i;
                        this._highestInputPriorityID = this.game.input.inputObjects[i].input.priorityID;
                    }
                }
            }
            if(this._highestRenderObject == -1) {
                if(this.targetObject !== null) {
                    this.targetObject.input._pointerOutHandler(this);
                    this.targetObject = null;
                }
            } else {
                if(this.targetObject == null) {
                    this.targetObject = this.game.input.inputObjects[this._highestRenderObject];
                    this.targetObject.input._pointerOverHandler(this);
                } else {
                    if(this.targetObject == this.game.input.inputObjects[this._highestRenderObject]) {
                        if(this.targetObject.input.update(this) == false) {
                            this.targetObject = null;
                        }
                    } else {
                        this.targetObject.input._pointerOutHandler(this);
                        this.targetObject = this.game.input.inputObjects[this._highestRenderObject];
                        this.targetObject.input._pointerOverHandler(this);
                    }
                }
            }
            return this;
        };
        Pointer.prototype.leave = function (event) {
            this.withinGame = false;
            this.move(event);
        };
        Pointer.prototype.stop = function (event) {
            if(this._stateReset) {
                event.preventDefault();
                return;
            }
            this.timeUp = this.game.time.now;
            if(this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_OVERRIDES_TOUCH || this.game.input.multiInputOverride == Phaser.InputManager.MOUSE_TOUCH_COMBINE || (this.game.input.multiInputOverride == Phaser.InputManager.TOUCH_OVERRIDES_MOUSE && this.game.input.currentPointers == 0)) {
                this.game.input.onUp.dispatch(this);
                if(this.duration >= 0 && this.duration <= this.game.input.tapRate) {
                    if(this.timeUp - this.previousTapTime < this.game.input.doubleTapRate) {
                        this.game.input.onTap.dispatch(this, true);
                    } else {
                        this.game.input.onTap.dispatch(this, false);
                    }
                    this.previousTapTime = this.timeUp;
                }
            }
            if(this.id > 0) {
                this.active = false;
            }
            this.withinGame = false;
            this.isDown = false;
            this.isUp = true;
            if(this.isMouse == false) {
                this.game.input.currentPointers--;
            }
            for(var i = 0; i < this.game.input.totalTrackedObjects; i++) {
                if(this.game.input.inputObjects[i] && this.game.input.inputObjects[i].input && this.game.input.inputObjects[i].input.enabled) {
                    this.game.input.inputObjects[i].input._releasedHandler(this);
                }
            }
            if(this.targetObject) {
                this.targetObject.input._releasedHandler(this);
            }
            this.targetObject = null;
            return this;
        };
        Pointer.prototype.justPressed = function (duration) {
            if (typeof duration === "undefined") { duration = this.game.input.justPressedRate; }
            if(this.isDown === true && (this.timeDown + duration) > this.game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Pointer.prototype.justReleased = function (duration) {
            if (typeof duration === "undefined") { duration = this.game.input.justReleasedRate; }
            if(this.isUp === true && (this.timeUp + duration) > this.game.time.now) {
                return true;
            } else {
                return false;
            }
        };
        Pointer.prototype.reset = function () {
            if(this.isMouse == false) {
                this.active = false;
            }
            this.identifier = null;
            this.isDown = false;
            this.isUp = true;
            this.totalTouches = 0;
            this._holdSent = false;
            this._history.length = 0;
            this._stateReset = true;
            if(this.targetObject && this.targetObject.input) {
                this.targetObject.input._releasedHandler(this);
            }
            this.targetObject = null;
        };
        Pointer.prototype.toString = function () {
            return "[{Pointer (id=" + this.id + " identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";
        };
        return Pointer;
    })();
    Phaser.Pointer = Pointer;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Components) {
        var InputHandler = (function () {
            function InputHandler(parent) {
                this.priorityID = 0;
                this.indexID = 0;
                this.isDragged = false;
                this.dragPixelPerfect = false;
                this.allowHorizontalDrag = true;
                this.allowVerticalDrag = true;
                this.bringToTop = false;
                this.snapOnDrag = false;
                this.snapOnRelease = false;
                this.snapX = 0;
                this.snapY = 0;
                this.draggable = false;
                this.boundsRect = null;
                this.boundsSprite = null;
                this.consumePointerEvent = false;
                this.game = parent.game;
                this._parent = parent;
                this.enabled = false;
            }
            InputHandler.prototype.pointerX = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].x;
            };
            InputHandler.prototype.pointerY = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].y;
            };
            InputHandler.prototype.pointerDown = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isDown;
            };
            InputHandler.prototype.pointerUp = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isUp;
            };
            InputHandler.prototype.pointerTimeDown = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeDown;
            };
            InputHandler.prototype.pointerTimeUp = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeUp;
            };
            InputHandler.prototype.pointerOver = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isOver;
            };
            InputHandler.prototype.pointerOut = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isOut;
            };
            InputHandler.prototype.pointerTimeOver = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeOver;
            };
            InputHandler.prototype.pointerTimeOut = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].timeOut;
            };
            InputHandler.prototype.pointerDragged = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                return this._pointerData[pointer].isDragged;
            };
            InputHandler.prototype.start = function (priority, checkBody, useHandCursor) {
                if (typeof priority === "undefined") { priority = 0; }
                if (typeof checkBody === "undefined") { checkBody = false; }
                if (typeof useHandCursor === "undefined") { useHandCursor = false; }
                if(this.enabled == false) {
                    this.checkBody = checkBody;
                    this.useHandCursor = useHandCursor;
                    this.priorityID = priority;
                    this._pointerData = [];
                    for(var i = 0; i < 10; i++) {
                        this._pointerData.push({
                            id: i,
                            x: 0,
                            y: 0,
                            isDown: false,
                            isUp: false,
                            isOver: false,
                            isOut: false,
                            timeOver: 0,
                            timeOut: 0,
                            timeDown: 0,
                            timeUp: 0,
                            downDuration: 0,
                            isDragged: false
                        });
                    }
                    this.snapOffset = new Phaser.Point();
                    this.enabled = true;
                    this.game.input.addGameObject(this._parent);
                    if(this._parent.events.onInputOver == null) {
                        this._parent.events.onInputOver = new Phaser.Signal();
                        this._parent.events.onInputOut = new Phaser.Signal();
                        this._parent.events.onInputDown = new Phaser.Signal();
                        this._parent.events.onInputUp = new Phaser.Signal();
                        this._parent.events.onDragStart = new Phaser.Signal();
                        this._parent.events.onDragStop = new Phaser.Signal();
                    }
                }
                return this._parent;
            };
            InputHandler.prototype.reset = function () {
                this.enabled = false;
                for(var i = 0; i < 10; i++) {
                    this._pointerData[i] = {
                        id: i,
                        x: 0,
                        y: 0,
                        isDown: false,
                        isUp: false,
                        isOver: false,
                        isOut: false,
                        timeOver: 0,
                        timeOut: 0,
                        timeDown: 0,
                        timeUp: 0,
                        downDuration: 0,
                        isDragged: false
                    };
                }
            };
            InputHandler.prototype.stop = function () {
                if(this.enabled == false) {
                    return;
                } else {
                    this.enabled = false;
                    this.game.input.removeGameObject(this.indexID);
                }
            };
            InputHandler.prototype.destroy = function () {
                if(this.enabled) {
                    this.enabled = false;
                    this.game.input.removeGameObject(this.indexID);
                }
            };
            InputHandler.prototype.checkPointerOver = function (pointer) {
                if(this.enabled == false || this._parent.visible == false) {
                    return false;
                } else {
                    return Phaser.SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY);
                }
            };
            InputHandler.prototype.update = function (pointer) {
                if(this.enabled == false || this._parent.visible == false) {
                    this._pointerOutHandler(pointer);
                    return false;
                }
                if(this.draggable && this._draggedPointerID == pointer.id) {
                    return this.updateDrag(pointer);
                } else if(this._pointerData[pointer.id].isOver == true) {
                    if(Phaser.SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY)) {
                        this._pointerData[pointer.id].x = pointer.x - this._parent.x;
                        this._pointerData[pointer.id].y = pointer.y - this._parent.y;
                        return true;
                    } else {
                        this._pointerOutHandler(pointer);
                        return false;
                    }
                }
            };
            InputHandler.prototype._pointerOverHandler = function (pointer) {
                if(this._pointerData[pointer.id].isOver == false) {
                    this._pointerData[pointer.id].isOver = true;
                    this._pointerData[pointer.id].isOut = false;
                    this._pointerData[pointer.id].timeOver = this.game.time.now;
                    this._pointerData[pointer.id].x = pointer.x - this._parent.x;
                    this._pointerData[pointer.id].y = pointer.y - this._parent.y;
                    if(this.useHandCursor && this._pointerData[pointer.id].isDragged == false) {
                        this.game.stage.canvas.style.cursor = "pointer";
                    }
                    this._parent.events.onInputOver.dispatch(this._parent, pointer);
                }
            };
            InputHandler.prototype._pointerOutHandler = function (pointer) {
                this._pointerData[pointer.id].isOver = false;
                this._pointerData[pointer.id].isOut = true;
                this._pointerData[pointer.id].timeOut = this.game.time.now;
                if(this.useHandCursor && this._pointerData[pointer.id].isDragged == false) {
                    this.game.stage.canvas.style.cursor = "default";
                }
                this._parent.events.onInputOut.dispatch(this._parent, pointer);
            };
            InputHandler.prototype._touchedHandler = function (pointer) {
                if(this._pointerData[pointer.id].isDown == false && this._pointerData[pointer.id].isOver == true) {
                    this._pointerData[pointer.id].isDown = true;
                    this._pointerData[pointer.id].isUp = false;
                    this._pointerData[pointer.id].timeDown = this.game.time.now;
                    this._parent.events.onInputDown.dispatch(this._parent, pointer);
                    if(this.draggable && this.isDragged == false) {
                        this.startDrag(pointer);
                    }
                    if(this.bringToTop) {
                        this._parent.bringToTop();
                    }
                }
                return this.consumePointerEvent;
            };
            InputHandler.prototype._releasedHandler = function (pointer) {
                if(this._pointerData[pointer.id].isDown && pointer.isUp) {
                    this._pointerData[pointer.id].isDown = false;
                    this._pointerData[pointer.id].isUp = true;
                    this._pointerData[pointer.id].timeUp = this.game.time.now;
                    this._pointerData[pointer.id].downDuration = this._pointerData[pointer.id].timeUp - this._pointerData[pointer.id].timeDown;
                    if(Phaser.SpriteUtils.overlapsXY(this._parent, pointer.worldX, pointer.worldY)) {
                        this._parent.events.onInputUp.dispatch(this._parent, pointer);
                    } else {
                        if(this.useHandCursor) {
                            this.game.stage.canvas.style.cursor = "default";
                        }
                    }
                    if(this.draggable && this.isDragged && this._draggedPointerID == pointer.id) {
                        this.stopDrag(pointer);
                    }
                }
            };
            InputHandler.prototype.updateDrag = function (pointer) {
                if(pointer.isUp) {
                    this.stopDrag(pointer);
                    return false;
                }
                if(this.allowHorizontalDrag) {
                    this._parent.x = pointer.x + this._dragPoint.x + this.dragOffset.x;
                }
                if(this.allowVerticalDrag) {
                    this._parent.y = pointer.y + this._dragPoint.y + this.dragOffset.y;
                }
                if(this.boundsRect) {
                    this.checkBoundsRect();
                }
                if(this.boundsSprite) {
                    this.checkBoundsSprite();
                }
                if(this.snapOnDrag) {
                    this._parent.x = Math.floor(this._parent.x / this.snapX) * this.snapX;
                    this._parent.y = Math.floor(this._parent.y / this.snapY) * this.snapY;
                }
                return true;
            };
            InputHandler.prototype.justOver = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isOver && this.overDuration(pointer) < delay);
            };
            InputHandler.prototype.justOut = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isOut && (this.game.time.now - this._pointerData[pointer].timeOut < delay));
            };
            InputHandler.prototype.justPressed = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isDown && this.downDuration(pointer) < delay);
            };
            InputHandler.prototype.justReleased = function (pointer, delay) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if (typeof delay === "undefined") { delay = 500; }
                return (this._pointerData[pointer].isUp && (this.game.time.now - this._pointerData[pointer].timeUp < delay));
            };
            InputHandler.prototype.overDuration = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if(this._pointerData[pointer].isOver) {
                    return this.game.time.now - this._pointerData[pointer].timeOver;
                }
                return -1;
            };
            InputHandler.prototype.downDuration = function (pointer) {
                if (typeof pointer === "undefined") { pointer = 0; }
                if(this._pointerData[pointer].isDown) {
                    return this.game.time.now - this._pointerData[pointer].timeDown;
                }
                return -1;
            };
            InputHandler.prototype.enableDrag = function (lockCenter, bringToTop, pixelPerfect, alphaThreshold, boundsRect, boundsSprite) {
                if (typeof lockCenter === "undefined") { lockCenter = false; }
                if (typeof bringToTop === "undefined") { bringToTop = false; }
                if (typeof pixelPerfect === "undefined") { pixelPerfect = false; }
                if (typeof alphaThreshold === "undefined") { alphaThreshold = 255; }
                if (typeof boundsRect === "undefined") { boundsRect = null; }
                if (typeof boundsSprite === "undefined") { boundsSprite = null; }
                this._dragPoint = new Phaser.Point();
                this.draggable = true;
                this.bringToTop = bringToTop;
                this.dragOffset = new Phaser.Point();
                this.dragFromCenter = lockCenter;
                this.dragPixelPerfect = pixelPerfect;
                this.dragPixelPerfectAlpha = alphaThreshold;
                if(boundsRect) {
                    this.boundsRect = boundsRect;
                }
                if(boundsSprite) {
                    this.boundsSprite = boundsSprite;
                }
            };
            InputHandler.prototype.disableDrag = function () {
                if(this._pointerData) {
                    for(var i = 0; i < 10; i++) {
                        this._pointerData[i].isDragged = false;
                    }
                }
                this.draggable = false;
                this.isDragged = false;
                this._draggedPointerID = -1;
            };
            InputHandler.prototype.startDrag = function (pointer) {
                this.isDragged = true;
                this._draggedPointerID = pointer.id;
                this._pointerData[pointer.id].isDragged = true;
                if(this.dragFromCenter) {
                    this._parent.transform.centerOn(pointer.worldX, pointer.worldY);
                    this._dragPoint.setTo(this._parent.x - pointer.x, this._parent.y - pointer.y);
                } else {
                    this._dragPoint.setTo(this._parent.x - pointer.x, this._parent.y - pointer.y);
                }
                this.updateDrag(pointer);
                if(this.bringToTop) {
                    this._parent.bringToTop();
                }
                this._parent.events.onDragStart.dispatch(this._parent, pointer);
            };
            InputHandler.prototype.stopDrag = function (pointer) {
                this.isDragged = false;
                this._draggedPointerID = -1;
                this._pointerData[pointer.id].isDragged = false;
                if(this.snapOnRelease) {
                    this._parent.x = Math.floor(this._parent.x / this.snapX) * this.snapX;
                    this._parent.y = Math.floor(this._parent.y / this.snapY) * this.snapY;
                }
                this._parent.events.onDragStop.dispatch(this._parent, pointer);
                this._parent.events.onInputUp.dispatch(this._parent, pointer);
            };
            InputHandler.prototype.setDragLock = function (allowHorizontal, allowVertical) {
                if (typeof allowHorizontal === "undefined") { allowHorizontal = true; }
                if (typeof allowVertical === "undefined") { allowVertical = true; }
                this.allowHorizontalDrag = allowHorizontal;
                this.allowVerticalDrag = allowVertical;
            };
            InputHandler.prototype.enableSnap = function (snapX, snapY, onDrag, onRelease) {
                if (typeof onDrag === "undefined") { onDrag = true; }
                if (typeof onRelease === "undefined") { onRelease = false; }
                this.snapOnDrag = onDrag;
                this.snapOnRelease = onRelease;
                this.snapX = snapX;
                this.snapY = snapY;
            };
            InputHandler.prototype.disableSnap = function () {
                this.snapOnDrag = false;
                this.snapOnRelease = false;
            };
            InputHandler.prototype.checkBoundsRect = function () {
                if(this._parent.x < this.boundsRect.left) {
                    this._parent.x = this.boundsRect.x;
                } else if((this._parent.x + this._parent.width) > this.boundsRect.right) {
                    this._parent.x = this.boundsRect.right - this._parent.width;
                }
                if(this._parent.y < this.boundsRect.top) {
                    this._parent.y = this.boundsRect.top;
                } else if((this._parent.y + this._parent.height) > this.boundsRect.bottom) {
                    this._parent.y = this.boundsRect.bottom - this._parent.height;
                }
            };
            InputHandler.prototype.checkBoundsSprite = function () {
                if(this._parent.x < this.boundsSprite.x) {
                    this._parent.x = this.boundsSprite.x;
                } else if((this._parent.x + this._parent.width) > (this.boundsSprite.x + this.boundsSprite.width)) {
                    this._parent.x = (this.boundsSprite.x + this.boundsSprite.width) - this._parent.width;
                }
                if(this._parent.y < this.boundsSprite.y) {
                    this._parent.y = this.boundsSprite.y;
                } else if((this._parent.y + this._parent.height) > (this.boundsSprite.y + this.boundsSprite.height)) {
                    this._parent.y = (this.boundsSprite.y + this.boundsSprite.height) - this._parent.height;
                }
            };
            return InputHandler;
        })();
        Components.InputHandler = InputHandler;        
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var InputManager = (function () {
        function InputManager(game) {
            this.pollRate = 0;
            this._pollCounter = 0;
            this._oldPosition = null;
            this._x = 0;
            this._y = 0;
            this.disabled = false;
            this.multiInputOverride = InputManager.MOUSE_TOUCH_COMBINE;
            this.position = null;
            this.speed = null;
            this.circle = null;
            this.scale = null;
            this.maxPointers = 10;
            this.currentPointers = 0;
            this.tapRate = 200;
            this.doubleTapRate = 300;
            this.holdRate = 2000;
            this.justPressedRate = 200;
            this.justReleasedRate = 200;
            this.recordPointerHistory = false;
            this.recordRate = 100;
            this.recordLimit = 100;
            this.pointer3 = null;
            this.pointer4 = null;
            this.pointer5 = null;
            this.pointer6 = null;
            this.pointer7 = null;
            this.pointer8 = null;
            this.pointer9 = null;
            this.pointer10 = null;
            this.activePointer = null;
            this.inputObjects = [];
            this.totalTrackedObjects = 0;
            this.game = game;
            this.mousePointer = new Phaser.Pointer(this.game, 0);
            this.pointer1 = new Phaser.Pointer(this.game, 1);
            this.pointer2 = new Phaser.Pointer(this.game, 2);
            this.mouse = new Phaser.Mouse(this.game);
            this.keyboard = new Phaser.Keyboard(this.game);
            this.touch = new Phaser.Touch(this.game);
            this.mspointer = new Phaser.MSPointer(this.game);
            this.onDown = new Phaser.Signal();
            this.onUp = new Phaser.Signal();
            this.onTap = new Phaser.Signal();
            this.onHold = new Phaser.Signal();
            this.scale = new Phaser.Vec2(1, 1);
            this.speed = new Phaser.Vec2();
            this.position = new Phaser.Vec2();
            this._oldPosition = new Phaser.Vec2();
            this.circle = new Phaser.Circle(0, 0, 44);
            this.activePointer = this.mousePointer;
            this.currentPointers = 0;
            this.hitCanvas = document.createElement('canvas');
            this.hitCanvas.width = 1;
            this.hitCanvas.height = 1;
            this.hitContext = this.hitCanvas.getContext('2d');
        }
        InputManager.MOUSE_OVERRIDES_TOUCH = 0;
        InputManager.TOUCH_OVERRIDES_MOUSE = 1;
        InputManager.MOUSE_TOUCH_COMBINE = 2;
        Object.defineProperty(InputManager.prototype, "camera", {
            get: function () {
                return this.activePointer.camera;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = Math.floor(value);
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.addPointer = function () {
            var next = 0;
            for(var i = 10; i > 0; i--) {
                if(this['pointer' + i] === null) {
                    next = i;
                }
            }
            if(next == 0) {
                throw new Error("You can only have 10 Pointer objects");
                return null;
            } else {
                this['pointer' + next] = new Phaser.Pointer(this.game, next);
                return this['pointer' + next];
            }
        };
        InputManager.prototype.boot = function () {
            this.mouse.start();
            this.keyboard.start();
            this.touch.start();
            this.mspointer.start();
            this.mousePointer.active = true;
        };
        InputManager.prototype.addGameObject = function (object) {
            for(var i = 0; i < this.inputObjects.length; i++) {
                if(this.inputObjects[i] == null) {
                    this.inputObjects[i] = object;
                    object.input.indexID = i;
                    this.totalTrackedObjects++;
                    return;
                }
            }
            object.input.indexID = this.inputObjects.length;
            this.inputObjects.push(object);
            this.totalTrackedObjects++;
        };
        InputManager.prototype.removeGameObject = function (index) {
            if(this.inputObjects[index]) {
                this.inputObjects[index] = null;
            }
        };
        Object.defineProperty(InputManager.prototype, "pollLocked", {
            get: function () {
                return (this.pollRate > 0 && this._pollCounter < this.pollRate);
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.update = function () {
            if(this.pollRate > 0 && this._pollCounter < this.pollRate) {
                this._pollCounter++;
                return;
            }
            this.speed.x = this.position.x - this._oldPosition.x;
            this.speed.y = this.position.y - this._oldPosition.y;
            this._oldPosition.copyFrom(this.position);
            this.mousePointer.update();
            this.pointer1.update();
            this.pointer2.update();
            if(this.pointer3) {
                this.pointer3.update();
            }
            if(this.pointer4) {
                this.pointer4.update();
            }
            if(this.pointer5) {
                this.pointer5.update();
            }
            if(this.pointer6) {
                this.pointer6.update();
            }
            if(this.pointer7) {
                this.pointer7.update();
            }
            if(this.pointer8) {
                this.pointer8.update();
            }
            if(this.pointer9) {
                this.pointer9.update();
            }
            if(this.pointer10) {
                this.pointer10.update();
            }
            this._pollCounter = 0;
        };
        InputManager.prototype.reset = function (hard) {
            if (typeof hard === "undefined") { hard = false; }
            this.keyboard.reset();
            this.mousePointer.reset();
            for(var i = 1; i <= 10; i++) {
                if(this['pointer' + i]) {
                    this['pointer' + i].reset();
                }
            }
            this.currentPointers = 0;
            this.game.stage.canvas.style.cursor = "default";
            if(hard == true) {
                this.onDown.dispose();
                this.onUp.dispose();
                this.onTap.dispose();
                this.onHold.dispose();
                this.onDown = new Phaser.Signal();
                this.onUp = new Phaser.Signal();
                this.onTap = new Phaser.Signal();
                this.onHold = new Phaser.Signal();
                for(var i = 0; i < this.totalTrackedObjects; i++) {
                    if(this.inputObjects[i] && this.inputObjects[i].input) {
                        this.inputObjects[i].input.reset();
                    }
                }
                this.inputObjects.length = 0;
                this.totalTrackedObjects = 0;
            }
            this._pollCounter = 0;
        };
        InputManager.prototype.resetSpeed = function (x, y) {
            this._oldPosition.setTo(x, y);
            this.speed.setTo(0, 0);
        };
        Object.defineProperty(InputManager.prototype, "totalInactivePointers", {
            get: function () {
                return 10 - this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "totalActivePointers", {
            get: function () {
                this.currentPointers = 0;
                for(var i = 1; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active) {
                        this.currentPointers++;
                    }
                }
                return this.currentPointers;
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.startPointer = function (event) {
            if(this.maxPointers < 10 && this.totalActivePointers == this.maxPointers) {
                return null;
            }
            if(this.pointer1.active == false) {
                return this.pointer1.start(event);
            } else if(this.pointer2.active == false) {
                return this.pointer2.start(event);
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active == false) {
                        return this['pointer' + i].start(event);
                    }
                }
            }
            return null;
        };
        InputManager.prototype.updatePointer = function (event) {
            if(this.pointer1.active && this.pointer1.identifier == event.identifier) {
                return this.pointer1.move(event);
            } else if(this.pointer2.active && this.pointer2.identifier == event.identifier) {
                return this.pointer2.move(event);
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier) {
                        return this['pointer' + i].move(event);
                    }
                }
            }
            return null;
        };
        InputManager.prototype.stopPointer = function (event) {
            if(this.pointer1.active && this.pointer1.identifier == event.identifier) {
                return this.pointer1.stop(event);
            } else if(this.pointer2.active && this.pointer2.identifier == event.identifier) {
                return this.pointer2.stop(event);
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active && this['pointer' + i].identifier == event.identifier) {
                        return this['pointer' + i].stop(event);
                    }
                }
            }
            return null;
        };
        InputManager.prototype.getPointer = function (state) {
            if (typeof state === "undefined") { state = false; }
            if(this.pointer1.active == state) {
                return this.pointer1;
            } else if(this.pointer2.active == state) {
                return this.pointer2;
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].active == state) {
                        return this['pointer' + i];
                    }
                }
            }
            return null;
        };
        InputManager.prototype.getPointerFromIdentifier = function (identifier) {
            if(this.pointer1.identifier == identifier) {
                return this.pointer1;
            } else if(this.pointer2.identifier == identifier) {
                return this.pointer2;
            } else {
                for(var i = 3; i <= 10; i++) {
                    if(this['pointer' + i] && this['pointer' + i].identifier == identifier) {
                        return this['pointer' + i];
                    }
                }
            }
            return null;
        };
        Object.defineProperty(InputManager.prototype, "worldX", {
            get: function () {
                if(this.camera) {
                    return (this.camera.worldView.x - this.camera.screenView.x) + this.x;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "worldY", {
            get: function () {
                if(this.camera) {
                    return (this.camera.worldView.y - this.camera.screenView.y) + this.y;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.getDistance = function (pointer1, pointer2) {
            return Phaser.Vec2Utils.distance(pointer1.position, pointer2.position);
        };
        InputManager.prototype.getAngle = function (pointer1, pointer2) {
            return Phaser.Vec2Utils.angle(pointer1.position, pointer2.position);
        };
        InputManager.prototype.pixelPerfectCheck = function (sprite, pointer, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            this.hitContext.clearRect(0, 0, 1, 1);
            return true;
        };
        return InputManager;
    })();
    Phaser.InputManager = InputManager;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Device = (function () {
        function Device() {
            this.patchAndroidClearRectBug = false;
            this.desktop = false;
            this.iOS = false;
            this.android = false;
            this.chromeOS = false;
            this.linux = false;
            this.macOS = false;
            this.windows = false;
            this.canvas = false;
            this.file = false;
            this.fileSystem = false;
            this.localStorage = false;
            this.webGL = false;
            this.worker = false;
            this.touch = false;
            this.mspointer = false;
            this.css3D = false;
            this.arora = false;
            this.chrome = false;
            this.epiphany = false;
            this.firefox = false;
            this.ie = false;
            this.ieVersion = 0;
            this.mobileSafari = false;
            this.midori = false;
            this.opera = false;
            this.safari = false;
            this.webApp = false;
            this.audioData = false;
            this.webAudio = false;
            this.ogg = false;
            this.opus = false;
            this.mp3 = false;
            this.wav = false;
            this.m4a = false;
            this.webm = false;
            this.iPhone = false;
            this.iPhone4 = false;
            this.iPad = false;
            this.pixelRatio = 0;
            this._checkAudio();
            this._checkBrowser();
            this._checkCSS3D();
            this._checkDevice();
            this._checkFeatures();
            this._checkOS();
        }
        Device.prototype._checkOS = function () {
            var ua = navigator.userAgent;
            if(/Android/.test(ua)) {
                this.android = true;
            } else if(/CrOS/.test(ua)) {
                this.chromeOS = true;
            } else if(/iP[ao]d|iPhone/i.test(ua)) {
                this.iOS = true;
            } else if(/Linux/.test(ua)) {
                this.linux = true;
            } else if(/Mac OS/.test(ua)) {
                this.macOS = true;
            } else if(/Windows/.test(ua)) {
                this.windows = true;
            }
            if(this.windows || this.macOS || this.linux) {
                this.desktop = true;
            }
        };
        Device.prototype._checkFeatures = function () {
            this.canvas = !!window['CanvasRenderingContext2D'];
            try  {
                this.localStorage = !!localStorage.getItem;
            } catch (error) {
                this.localStorage = false;
            }
            this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
            this.fileSystem = !!window['requestFileSystem'];
            this.webGL = !!window['WebGLRenderingContext'];
            this.worker = !!window['Worker'];
            if('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled) {
                this.touch = true;
            }
            if(window.navigator.msPointerEnabled) {
                this.mspointer = true;
            }
        };
        Device.prototype._checkBrowser = function () {
            var ua = navigator.userAgent;
            if(/Arora/.test(ua)) {
                this.arora = true;
            } else if(/Chrome/.test(ua)) {
                this.chrome = true;
            } else if(/Epiphany/.test(ua)) {
                this.epiphany = true;
            } else if(/Firefox/.test(ua)) {
                this.firefox = true;
            } else if(/Mobile Safari/.test(ua)) {
                this.mobileSafari = true;
            } else if(/MSIE (\d+\.\d+);/.test(ua)) {
                this.ie = true;
                this.ieVersion = parseInt(RegExp.$1);
            } else if(/Midori/.test(ua)) {
                this.midori = true;
            } else if(/Opera/.test(ua)) {
                this.opera = true;
            } else if(/Safari/.test(ua)) {
                this.safari = true;
            }
            if(navigator['standalone']) {
                this.webApp = true;
            }
        };
        Device.prototype.canPlayAudio = function (type) {
            if(type == 'mp3' && this.mp3) {
                return true;
            } else if(type == 'ogg' && (this.ogg || this.opus)) {
                return true;
            } else if(type == 'm4a' && this.m4a) {
                return true;
            } else if(type == 'wav' && this.wav) {
                return true;
            } else if(type == 'webm' && this.webm) {
                return true;
            }
            return false;
        };
        Device.prototype._checkAudio = function () {
            this.audioData = !!(window['Audio']);
            this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);
            var audioElement = document.createElement('audio');
            var result = false;
            try  {
                if(result = !!audioElement.canPlayType) {
                    if(audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                        this.ogg = true;
                    }
                    if(audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '')) {
                        this.opus = true;
                    }
                    if(audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
                        this.mp3 = true;
                    }
                    if(audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
                        this.wav = true;
                    }
                    if(audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
                        this.m4a = true;
                    }
                    if(audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')) {
                        this.webm = true;
                    }
                }
            } catch (e) {
            }
        };
        Device.prototype._checkDevice = function () {
            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;
            this.iPhone4 = (this.pixelRatio == 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') != -1;
        };
        Device.prototype._checkCSS3D = function () {
            var el = document.createElement('p');
            var has3d;
            var transforms = {
                'webkitTransform': '-webkit-transform',
                'OTransform': '-o-transform',
                'msTransform': '-ms-transform',
                'MozTransform': '-moz-transform',
                'transform': 'transform'
            };
            document.body.insertBefore(el, null);
            for(var t in transforms) {
                if(el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            this.css3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        };
        Device.prototype.isConsoleOpen = function () {
            if(window.console && window.console['firebug']) {
                return true;
            }
            if(window.console) {
                console.profile();
                console.profileEnd();
                if(console.clear) {
                    console.clear();
                }
                return console['profiles'].length > 0;
            }
            return false;
        };
        return Device;
    })();
    Phaser.Device = Device;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var RequestAnimationFrame = (function () {
        function RequestAnimationFrame(game, callback) {
            this._isSetTimeOut = false;
            this.isRunning = false;
            this.game = game;
            this.callback = callback;
            var vendors = [
                'ms', 
                'moz', 
                'webkit', 
                'o'
            ];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
            }
            this.start();
        }
        RequestAnimationFrame.prototype.isUsingSetTimeOut = function () {
            return this._isSetTimeOut;
        };
        RequestAnimationFrame.prototype.isUsingRAF = function () {
            return this._isSetTimeOut === true;
        };
        RequestAnimationFrame.prototype.start = function (callback) {
            if (typeof callback === "undefined") { callback = null; }
            var _this = this;
            if(callback) {
                this.callback = callback;
            }
            if(!window.requestAnimationFrame) {
                this._isSetTimeOut = true;
                this._onLoop = function () {
                    return _this.SetTimeoutUpdate();
                };
                this._timeOutID = window.setTimeout(this._onLoop, 0);
            } else {
                this._isSetTimeOut = false;
                this._onLoop = function () {
                    return _this.RAFUpdate(0);
                };
                window.requestAnimationFrame(this._onLoop);
            }
            this.isRunning = true;
        };
        RequestAnimationFrame.prototype.stop = function () {
            if(this._isSetTimeOut) {
                clearTimeout(this._timeOutID);
            } else {
                window.cancelAnimationFrame;
            }
            this.isRunning = false;
        };
        RequestAnimationFrame.prototype.RAFUpdate = function (time) {
            var _this = this;
            this.game.time.update(time);
            if(this.callback) {
                this.callback.call(this.game);
            }
            this._onLoop = function (time) {
                return _this.RAFUpdate(time);
            };
            window.requestAnimationFrame(this._onLoop);
        };
        RequestAnimationFrame.prototype.SetTimeoutUpdate = function () {
            var _this = this;
            this.game.time.update(Date.now());
            this._onLoop = function () {
                return _this.SetTimeoutUpdate();
            };
            this._timeOutID = window.setTimeout(this._onLoop, 16);
            if(this.callback) {
                this.callback.call(this.game);
            }
        };
        return RequestAnimationFrame;
    })();
    Phaser.RequestAnimationFrame = RequestAnimationFrame;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var StageScaleMode = (function () {
        function StageScaleMode(game, width, height) {
            var _this = this;
            this._startHeight = 0;
            this.forceLandscape = false;
            this.forcePortrait = false;
            this.incorrectOrientation = false;
            this.pageAlignHorizontally = false;
            this.pageAlignVeritcally = false;
            this.minWidth = null;
            this.maxWidth = null;
            this.minHeight = null;
            this.maxHeight = null;
            this.width = 0;
            this.height = 0;
            this.maxIterations = 10;
            this.game = game;
            this.enterLandscape = new Phaser.Signal();
            this.enterPortrait = new Phaser.Signal();
            if(window['orientation']) {
                this.orientation = window['orientation'];
            } else {
                if(window.outerWidth > window.outerHeight) {
                    this.orientation = 90;
                } else {
                    this.orientation = 0;
                }
            }
            this.scaleFactor = new Phaser.Vec2(1, 1);
            this.aspectRatio = 0;
            this.minWidth = width;
            this.minHeight = height;
            this.maxWidth = width;
            this.maxHeight = height;
            window.addEventListener('orientationchange', function (event) {
                return _this.checkOrientation(event);
            }, false);
            window.addEventListener('resize', function (event) {
                return _this.checkResize(event);
            }, false);
        }
        StageScaleMode.EXACT_FIT = 0;
        StageScaleMode.NO_SCALE = 1;
        StageScaleMode.SHOW_ALL = 2;
        Object.defineProperty(StageScaleMode.prototype, "isFullScreen", {
            get: function () {
                if(document['fullscreenElement'] === null || document['mozFullScreenElement'] === null || document['webkitFullscreenElement'] === null) {
                    return false;
                }
                return true;
            },
            enumerable: true,
            configurable: true
        });
        StageScaleMode.prototype.startFullScreen = function () {
            if(this.isFullScreen) {
                return;
            }
            var element = this.game.stage.canvas;
            if(element['requestFullScreen']) {
                element['requestFullScreen']();
            } else if(element['mozRequestFullScreen']) {
                element['mozRequestFullScreen']();
            } else if(element['webkitRequestFullScreen']) {
                element['webkitRequestFullScreen']();
            }
        };
        StageScaleMode.prototype.stopFullScreen = function () {
            if(document['cancelFullScreen']) {
                document['cancelFullScreen']();
            } else if(document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            } else if(document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        };
        StageScaleMode.prototype.update = function () {
            if(this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE && (window.innerWidth !== this.width || window.innerHeight !== this.height)) {
                this.refresh();
            }
            if(this.forceLandscape || this.forcePortrait) {
                this.checkOrientationState();
            }
        };
        StageScaleMode.prototype.checkOrientationState = function () {
            if(this.incorrectOrientation) {
                if((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth)) {
                    this.game.paused = false;
                    this.incorrectOrientation = false;
                    this.refresh();
                }
            } else {
                if((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth)) {
                    this.game.paused = true;
                    this.incorrectOrientation = true;
                    this.refresh();
                }
            }
        };
        Object.defineProperty(StageScaleMode.prototype, "isPortrait", {
            get: function () {
                return this.orientation == 0 || this.orientation == 180;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StageScaleMode.prototype, "isLandscape", {
            get: function () {
                return this.orientation === 90 || this.orientation === -90;
            },
            enumerable: true,
            configurable: true
        });
        StageScaleMode.prototype.checkOrientation = function (event) {
            this.orientation = window['orientation'];
            if(this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation, true, false);
            } else {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }
            if(this.game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };
        StageScaleMode.prototype.checkResize = function (event) {
            if(window.outerWidth > window.outerHeight) {
                this.orientation = 90;
            } else {
                this.orientation = 0;
            }
            if(this.isLandscape) {
                this.enterLandscape.dispatch(this.orientation, true, false);
            } else {
                this.enterPortrait.dispatch(this.orientation, false, true);
            }
            if(this.game.stage.scaleMode !== StageScaleMode.NO_SCALE) {
                this.refresh();
            }
        };
        StageScaleMode.prototype.refresh = function () {
            var _this = this;
            if(this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) {
                document.documentElement['style'].minHeight = '2000px';
                this._startHeight = window.innerHeight;
                if(this.game.device.android && this.game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }
            if(this._check == null && this.maxIterations > 0) {
                this._iterations = this.maxIterations;
                this._check = window.setInterval(function () {
                    return _this.setScreenSize();
                }, 10);
                this.setScreenSize();
            }
        };
        StageScaleMode.prototype.setScreenSize = function (force) {
            if (typeof force === "undefined") { force = false; }
            if(this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) {
                if(this.game.device.android && this.game.device.chrome == false) {
                    window.scrollTo(0, 1);
                } else {
                    window.scrollTo(0, 0);
                }
            }
            this._iterations--;
            if(force || window.innerHeight > this._startHeight || this._iterations < 0) {
                document.documentElement['style'].minHeight = window.innerHeight + 'px';
                if(this.incorrectOrientation == true) {
                    this.setMaximum();
                } else if(this.game.stage.scaleMode == StageScaleMode.EXACT_FIT) {
                    this.setExactFit();
                } else if(this.game.stage.scaleMode == StageScaleMode.SHOW_ALL) {
                    this.setShowAll();
                }
                this.setSize();
                clearInterval(this._check);
                this._check = null;
            }
        };
        StageScaleMode.prototype.setSize = function () {
            if(this.incorrectOrientation == false) {
                if(this.maxWidth && this.width > this.maxWidth) {
                    this.width = this.maxWidth;
                }
                if(this.maxHeight && this.height > this.maxHeight) {
                    this.height = this.maxHeight;
                }
                if(this.minWidth && this.width < this.minWidth) {
                    this.width = this.minWidth;
                }
                if(this.minHeight && this.height < this.minHeight) {
                    this.height = this.minHeight;
                }
            }
            this.game.stage.canvas.style.width = this.width + 'px';
            this.game.stage.canvas.style.height = this.height + 'px';
            this.game.input.scale.setTo(this.game.stage.width / this.width, this.game.stage.height / this.height);
            if(this.pageAlignHorizontally) {
                if(this.width < window.innerWidth && this.incorrectOrientation == false) {
                    this.game.stage.canvas.style.marginLeft = Math.round((window.innerWidth - this.width) / 2) + 'px';
                } else {
                    this.game.stage.canvas.style.marginLeft = '0px';
                }
            }
            if(this.pageAlignVeritcally) {
                if(this.height < window.innerHeight && this.incorrectOrientation == false) {
                    this.game.stage.canvas.style.marginTop = Math.round((window.innerHeight - this.height) / 2) + 'px';
                } else {
                    this.game.stage.canvas.style.marginTop = '0px';
                }
            }
            this.game.stage.getOffset(this.game.stage.canvas);
            this.aspectRatio = this.width / this.height;
            this.scaleFactor.x = this.game.stage.width / this.width;
            this.scaleFactor.y = this.game.stage.height / this.height;
        };
        StageScaleMode.prototype.setMaximum = function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        };
        StageScaleMode.prototype.setShowAll = function () {
            var multiplier = Math.min((window.innerHeight / this.game.stage.height), (window.innerWidth / this.game.stage.width));
            this.width = Math.round(this.game.stage.width * multiplier);
            this.height = Math.round(this.game.stage.height * multiplier);
        };
        StageScaleMode.prototype.setExactFit = function () {
            if(this.maxWidth && window.innerWidth > this.maxWidth) {
                this.width = this.maxWidth;
            } else {
                this.width = window.innerWidth;
            }
            if(this.maxHeight && window.innerHeight > this.maxHeight) {
                this.height = this.maxHeight;
            } else {
                this.height = window.innerHeight;
            }
        };
        return StageScaleMode;
    })();
    Phaser.StageScaleMode = StageScaleMode;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var BootScreen = (function () {
        function BootScreen(game) {
            this._logoData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAZCAYAAADdYmvFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAstJREFUeNrsWlFuwjAMbavdZGcAcRm4AXzvCPuGG8BlEJxhZ+l4TJ48z3actGGthqUI1MaO/V6cmIT2/fW10eTt46NvKshtvDZlG31yfOL9a/ldU6x4IZ0GQs0gS217enMkJYr5ixXkYrFoVqtV1kDn8/n+KfXw/Hq9Nin7h8MhScB2u3Xtav2ivsNWrh7XLcWMYqA4eUZ1kj0MAifHJEeKFojWzyIH+rL/0Cwif2AX9nN1oQOgrTg8XcTFx+ScdEOJ4WBxXQ1EjRyrn0cOzzQLzFyQSQcgw/5Qkkr0JVEQpNIdhL4vm4DL5fLulNTHcy6Uxl4/6iMLiePx2KzX6/v30+n0aynUlrnSeNq2/VN9bgM4dFPdNPmsJnIg/PuQbJmLdFN3UNu0SzbyJ0GOWJVWZE/QMkY+owrqXxGEdZA37BVyX6lJTipT6J1lf7fbqc+xh8nYeIvikatP+PGW0nEJ4jOydHYOIcfKnmgWoZDQSIIeio4Sf1IthYWskCO4vqQ6lFYjl8tl9L1H67PZbMz3VO3t93uVXHofmUjReLyMwHi5eCb3ICwJj5ZU9nCg+SzUgPYyif+2epTk4pkkyDp+eXTlZu2BkUybEkklePZfK9lPuTnc07vbmt1bYulHBeNQgx18SsH4ni/cV2rSLtqNDNUH2JQ2SsXS57Y9PHlfumkwCdICt5rnkNdPjpMiIEWgRlAJSdF4SvCQMWj+VyfI0h8D/EgWSYKiJKXi8VrOhJUxaFiFCOKKUJAtR78k9eX4USLHXqLGXOIiWUT4Vj9JiP4W0io3VDz8AJXblNWQrOimLjIGy/9uLICH6mrVmFbxEFHauzmc0fGJJmPg/v+6D0oB7N2bj0FsNHtSWTQniWTR931QlHXvasDTHXLjqY0/1/8hSDxACD+lAGH8dKQbQk5N3TFtzDmLWutvV0+pL5FVoHvCNG35FGAAayS4KUoKC9QAAAAASUVORK5CYII=";
            this._color1 = {
                r: 20,
                g: 20,
                b: 20
            };
            this._color2 = {
                r: 200,
                g: 200,
                b: 200
            };
            this._fade = null;
            this.game = game;
            this._logo = new Image();
            this._logo.src = this._logoData;
        }
        BootScreen.prototype.update = function () {
            if(this._fade == null) {
                this.colorCycle();
            }
            this._color1.r = Math.round(this._color1.r);
            this._color1.g = Math.round(this._color1.g);
            this._color1.b = Math.round(this._color1.b);
            this._color2.r = Math.round(this._color2.r);
            this._color2.g = Math.round(this._color2.g);
            this._color2.b = Math.round(this._color2.b);
        };
        BootScreen.prototype.render = function () {
            var grd = this.game.stage.context.createLinearGradient(0, 0, 0, this.game.stage.height);
            grd.addColorStop(0, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            grd.addColorStop(0.5, 'rgb(' + this._color2.r + ', ' + this._color2.g + ', ' + this._color2.b + ')');
            grd.addColorStop(1, 'rgb(' + this._color1.r + ', ' + this._color1.g + ', ' + this._color1.b + ')');
            this.game.stage.context.fillStyle = grd;
            this.game.stage.context.fillRect(0, 0, this.game.stage.width, this.game.stage.height);
            this.game.stage.context.shadowOffsetX = 0;
            this.game.stage.context.shadowOffsetY = 0;
            if(this._logo) {
                this.game.stage.context.drawImage(this._logo, 32, 32);
            }
            this.game.stage.context.shadowColor = 'rgb(0,0,0)';
            this.game.stage.context.shadowOffsetX = 1;
            this.game.stage.context.shadowOffsetY = 1;
            this.game.stage.context.shadowBlur = 0;
            this.game.stage.context.fillStyle = 'rgb(255,255,255)';
            this.game.stage.context.font = 'bold 18px Arial';
            this.game.stage.context.textBaseline = 'top';
            this.game.stage.context.fillText(Phaser.VERSION, 32, 64 + 32);
            this.game.stage.context.fillText('Game Size: ' + this.game.stage.width + ' x ' + this.game.stage.height, 32, 64 + 64);
            this.game.stage.context.fillText('www.photonstorm.com', 32, 64 + 96);
            this.game.stage.context.font = '16px Arial';
            this.game.stage.context.fillText('You are seeing this screen because you didn\'t specify any default', 32, 64 + 160);
            this.game.stage.context.fillText('functions in the Game constructor or use Game.switchState()', 32, 64 + 184);
        };
        BootScreen.prototype.colorCycle = function () {
            this._fade = this.game.add.tween(this._color2);
            this._fade.to({
                r: Math.random() * 250,
                g: Math.random() * 250,
                b: Math.random() * 250
            }, 3000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.colorCycle, this);
            this._fade.start();
        };
        return BootScreen;
    })();
    Phaser.BootScreen = BootScreen;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var OrientationScreen = (function () {
        function OrientationScreen(game) {
            this._showOnLandscape = false;
            this._showOnPortrait = false;
            this.game = game;
        }
        OrientationScreen.prototype.enable = function (onLandscape, onPortrait, imageKey) {
            this._showOnLandscape = onLandscape;
            this._showOnPortrait = onPortrait;
            this.landscapeImage = this.game.cache.getImage(imageKey);
            this.portraitImage = this.game.cache.getImage(imageKey);
        };
        OrientationScreen.prototype.update = function () {
        };
        OrientationScreen.prototype.render = function () {
            if(this._showOnLandscape) {
                this.game.stage.context.drawImage(this.landscapeImage, 0, 0, this.landscapeImage.width, this.landscapeImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            } else if(this._showOnPortrait) {
                this.game.stage.context.drawImage(this.portraitImage, 0, 0, this.portraitImage.width, this.portraitImage.height, 0, 0, this.game.stage.width, this.game.stage.height);
            }
        };
        return OrientationScreen;
    })();
    Phaser.OrientationScreen = OrientationScreen;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var PauseScreen = (function () {
        function PauseScreen(game, width, height) {
            this.game = game;
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
            this._context = this._canvas.getContext('2d');
        }
        PauseScreen.prototype.onPaused = function () {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.drawImage(this.game.stage.canvas, 0, 0);
            this._color = {
                r: 255,
                g: 255,
                b: 255
            };
            this.fadeOut();
        };
        PauseScreen.prototype.onResume = function () {
            this._fade.stop();
            this.game.tweens.remove(this._fade);
        };
        PauseScreen.prototype.update = function () {
            this._color.r = Math.round(this._color.r);
            this._color.g = Math.round(this._color.g);
            this._color.b = Math.round(this._color.b);
        };
        PauseScreen.prototype.render = function () {
            this.game.stage.context.drawImage(this._canvas, 0, 0);
            this.game.stage.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.game.stage.context.fillRect(0, 0, this.game.stage.width, this.game.stage.height);
            var arrowWidth = Math.round(this.game.stage.width / 2);
            var arrowHeight = Math.round(this.game.stage.height / 2);
            var sx = this.game.stage.centerX - arrowWidth / 2;
            var sy = this.game.stage.centerY - arrowHeight / 2;
            this.game.stage.context.beginPath();
            this.game.stage.context.moveTo(sx, sy);
            this.game.stage.context.lineTo(sx, sy + arrowHeight);
            this.game.stage.context.lineTo(sx + arrowWidth, this.game.stage.centerY);
            this.game.stage.context.fillStyle = 'rgba(' + this._color.r + ', ' + this._color.g + ', ' + this._color.b + ', 0.8)';
            this.game.stage.context.fill();
            this.game.stage.context.closePath();
        };
        PauseScreen.prototype.fadeOut = function () {
            this._fade = this.game.add.tween(this._color);
            this._fade.to({
                r: 50,
                g: 50,
                b: 50
            }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeIn, this);
            this._fade.start();
        };
        PauseScreen.prototype.fadeIn = function () {
            this._fade = this.game.add.tween(this._color);
            this._fade.to({
                r: 255,
                g: 255,
                b: 255
            }, 1000, Phaser.Easing.Linear.None);
            this._fade.onComplete.add(this.fadeOut, this);
            this._fade.start();
        };
        return PauseScreen;
    })();
    Phaser.PauseScreen = PauseScreen;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var SoundManager = (function () {
        function SoundManager(game) {
            this.usingWebAudio = false;
            this.usingAudioTag = false;
            this.noAudio = false;
            this.context = null;
            this._muted = false;
            this.touchLocked = false;
            this._unlockSource = null;
            this.onSoundDecode = new Phaser.Signal();
            this.game = game;
            this._volume = 1;
            this._muted = false;
            this._sounds = [];
            if(this.game.device.iOS && this.game.device.webAudio == false) {
                this.channels = 1;
            }
            if(this.game.device.iOS || (window['PhaserGlobal'] && window['PhaserGlobal'].fakeiOSTouchLock)) {
                this.game.input.touch.callbackContext = this;
                this.game.input.touch.touchStartCallback = this.unlock;
                this.game.input.mouse.callbackContext = this;
                this.game.input.mouse.mouseDownCallback = this.unlock;
                this.touchLocked = true;
            } else {
                this.touchLocked = false;
            }
            if(window['PhaserGlobal']) {
                if(window['PhaserGlobal'].disableAudio == true) {
                    this.usingWebAudio = false;
                    this.noAudio = true;
                    return;
                }
                if(window['PhaserGlobal'].disableWebAudio == true) {
                    this.usingWebAudio = false;
                    this.usingAudioTag = true;
                    this.noAudio = false;
                    return;
                }
            }
            this.usingWebAudio = true;
            this.noAudio = false;
            if(!!window['AudioContext']) {
                this.context = new window['AudioContext']();
            } else if(!!window['webkitAudioContext']) {
                this.context = new window['webkitAudioContext']();
            } else if(!!window['Audio']) {
                this.usingWebAudio = false;
                this.usingAudioTag = true;
            } else {
                this.usingWebAudio = false;
                this.noAudio = true;
            }
            if(this.context !== null) {
                if(typeof this.context.createGain === 'undefined') {
                    this.masterGain = this.context.createGainNode();
                } else {
                    this.masterGain = this.context.createGain();
                }
                this.masterGain.gain.value = 1;
                this.masterGain.connect(this.context.destination);
            }
        }
        SoundManager.prototype.unlock = function () {
            if(this.touchLocked == false) {
                return;
            }
            if(this.game.device.webAudio && (window['PhaserGlobal'] && window['PhaserGlobal'].disableWebAudio == false)) {
                var buffer = this.context.createBuffer(1, 1, 22050);
                this._unlockSource = this.context.createBufferSource();
                this._unlockSource.buffer = buffer;
                this._unlockSource.connect(this.context.destination);
                this._unlockSource.noteOn(0);
            } else {
                this.touchLocked = false;
                this._unlockSource = null;
                this.game.input.touch.callbackContext = null;
                this.game.input.touch.touchStartCallback = null;
                this.game.input.mouse.callbackContext = null;
                this.game.input.mouse.mouseDownCallback = null;
            }
        };
        Object.defineProperty(SoundManager.prototype, "mute", {
            get: function () {
                return this._muted;
            },
            set: function (value) {
                if(value) {
                    if(this._muted) {
                        return;
                    }
                    this._muted = true;
                    if(this.usingWebAudio) {
                        this._muteVolume = this.masterGain.gain.value;
                        this.masterGain.gain.value = 0;
                    }
                    for(var i = 0; i < this._sounds.length; i++) {
                        if(this._sounds[i].usingAudioTag) {
                            this._sounds[i].mute = true;
                        }
                    }
                } else {
                    if(this._muted == false) {
                        return;
                    }
                    this._muted = false;
                    if(this.usingWebAudio) {
                        this.masterGain.gain.value = this._muteVolume;
                    }
                    for(var i = 0; i < this._sounds.length; i++) {
                        if(this._sounds[i].usingAudioTag) {
                            this._sounds[i].mute = false;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SoundManager.prototype, "volume", {
            get: function () {
                if(this.usingWebAudio) {
                    return this.masterGain.gain.value;
                } else {
                    return this._volume;
                }
            },
            set: function (value) {
                value = this.game.math.clamp(value, 1, 0);
                this._volume = value;
                if(this.usingWebAudio) {
                    this.masterGain.gain.value = value;
                }
                for(var i = 0; i < this._sounds.length; i++) {
                    if(this._sounds[i].usingAudioTag) {
                        this._sounds[i].volume = this._sounds[i].volume * value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        SoundManager.prototype.stopAll = function () {
            for(var i = 0; i < this._sounds.length; i++) {
                if(this._sounds[i]) {
                    this._sounds[i].stop();
                }
            }
        };
        SoundManager.prototype.pauseAll = function () {
            for(var i = 0; i < this._sounds.length; i++) {
                if(this._sounds[i]) {
                    this._sounds[i].pause();
                }
            }
        };
        SoundManager.prototype.resumeAll = function () {
            for(var i = 0; i < this._sounds.length; i++) {
                if(this._sounds[i]) {
                    this._sounds[i].resume();
                }
            }
        };
        SoundManager.prototype.decode = function (key, sound) {
            if (typeof sound === "undefined") { sound = null; }
            var soundData = this.game.cache.getSoundData(key);
            if(soundData) {
                if(this.game.cache.isSoundDecoded(key) === false) {
                    this.game.cache.updateSound(key, 'isDecoding', true);
                    var that = this;
                    this.context.decodeAudioData(soundData, function (buffer) {
                        that.game.cache.decodedSound(key, buffer);
                        if(sound) {
                            that.onSoundDecode.dispatch(sound);
                        }
                    });
                }
            }
        };
        SoundManager.prototype.update = function () {
            if(this.touchLocked) {
                if(this.game.device.webAudio && this._unlockSource !== null) {
                    if((this._unlockSource.playbackState === this._unlockSource.PLAYING_STATE || this._unlockSource.playbackState === this._unlockSource.FINISHED_STATE)) {
                        this.touchLocked = false;
                        this._unlockSource = null;
                        this.game.input.touch.callbackContext = null;
                        this.game.input.touch.touchStartCallback = null;
                    }
                }
            }
            for(var i = 0; i < this._sounds.length; i++) {
                this._sounds[i].update();
            }
        };
        SoundManager.prototype.add = function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            var sound = new Phaser.Sound(this.game, key, volume, loop);
            this._sounds.push(sound);
            return sound;
        };
        return SoundManager;
    })();
    Phaser.SoundManager = SoundManager;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Sound = (function () {
        function Sound(game, key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.context = null;
            this._buffer = null;
            this._muted = false;
            this.usingWebAudio = false;
            this.usingAudioTag = false;
            this.name = '';
            this.autoplay = false;
            this.totalDuration = 0;
            this.startTime = 0;
            this.currentTime = 0;
            this.duration = 0;
            this.stopTime = 0;
            this.paused = false;
            this.loop = false;
            this.isPlaying = false;
            this.currentMarker = '';
            this.pendingPlayback = false;
            this.override = false;
            this.game = game;
            this.usingWebAudio = this.game.sound.usingWebAudio;
            this.usingAudioTag = this.game.sound.usingAudioTag;
            this.key = key;
            if(this.usingWebAudio) {
                this.context = this.game.sound.context;
                this.masterGainNode = this.game.sound.masterGain;
                if(typeof this.context.createGain === 'undefined') {
                    this.gainNode = this.context.createGainNode();
                } else {
                    this.gainNode = this.context.createGain();
                }
                this.gainNode.gain.value = volume * this.game.sound.volume;
                this.gainNode.connect(this.masterGainNode);
            } else {
                if(this.game.cache.getSound(key) && this.game.cache.getSound(key).locked == false) {
                    this._sound = this.game.cache.getSoundData(key);
                    this.totalDuration = this._sound.duration;
                } else {
                    this.game.cache.onSoundUnlock.add(this.soundHasUnlocked, this);
                }
            }
            this._volume = volume;
            this.loop = loop;
            this.markers = {
            };
            this.onDecoded = new Phaser.Signal();
            this.onPlay = new Phaser.Signal();
            this.onPause = new Phaser.Signal();
            this.onResume = new Phaser.Signal();
            this.onLoop = new Phaser.Signal();
            this.onStop = new Phaser.Signal();
            this.onMute = new Phaser.Signal();
            this.onMarkerComplete = new Phaser.Signal();
        }
        Sound.prototype.soundHasUnlocked = function (key) {
            if(key == this.key) {
                this._sound = this.game.cache.getSoundData(this.key);
                this.totalDuration = this._sound.duration;
            }
        };
        Object.defineProperty(Sound.prototype, "isDecoding", {
            get: function () {
                return this.game.cache.getSound(this.key).isDecoding;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "isDecoded", {
            get: function () {
                return this.game.cache.isSoundDecoded(this.key);
            },
            enumerable: true,
            configurable: true
        });
        Sound.prototype.addMarker = function (name, start, stop, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.markers[name] = {
                name: name,
                start: start,
                stop: stop,
                volume: volume,
                duration: stop - start,
                loop: loop
            };
        };
        Sound.prototype.removeMarker = function (name) {
            delete this.markers[name];
        };
        Sound.prototype.update = function () {
            if(this.pendingPlayback && this.game.cache.isSoundReady(this.key)) {
                this.pendingPlayback = false;
                this.play(this._tempMarker, this._tempPosition, this._tempVolume, this._tempLoop);
            }
            if(this.isPlaying) {
                this.currentTime = this.game.time.now - this.startTime;
                if(this.currentTime >= this.duration) {
                    if(this.usingWebAudio) {
                        if(this.loop) {
                            this.onLoop.dispatch(this);
                            if(this.currentMarker == '') {
                                this.currentTime = 0;
                                this.startTime = this.game.time.now;
                            } else {
                                this.play(this.currentMarker, 0, this.volume, true, true);
                            }
                        } else {
                            this.stop();
                        }
                    } else {
                        if(this.loop) {
                            this.onLoop.dispatch(this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        } else {
                            this.stop();
                        }
                    }
                }
            }
        };
        Sound.prototype.play = function (marker, position, volume, loop, forceRestart) {
            if (typeof marker === "undefined") { marker = ''; }
            if (typeof position === "undefined") { position = 0; }
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof forceRestart === "undefined") { forceRestart = false; }
            if(this.isPlaying == true && forceRestart == false && this.override == false) {
                return;
            }
            if(this.isPlaying && this.override) {
                if(this.usingWebAudio) {
                    if(typeof this._sound.stop === 'undefined') {
                        this._sound.noteOff(0);
                    } else {
                        this._sound.stop(0);
                    }
                } else if(this.usingAudioTag) {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }
            this.currentMarker = marker;
            if(marker !== '' && this.markers[marker]) {
                this.position = this.markers[marker].start;
                this.volume = this.markers[marker].volume;
                this.loop = this.markers[marker].loop;
                this.duration = this.markers[marker].duration * 1000;
                this._tempMarker = marker;
                this._tempPosition = this.position;
                this._tempVolume = this.volume;
                this._tempLoop = this.loop;
            } else {
                this.position = position;
                this.volume = volume;
                this.loop = loop;
                this.duration = 0;
                this._tempMarker = marker;
                this._tempPosition = position;
                this._tempVolume = volume;
                this._tempLoop = loop;
            }
            if(this.usingWebAudio) {
                if(this.game.cache.isSoundDecoded(this.key)) {
                    if(this._buffer == null) {
                        this._buffer = this.game.cache.getSoundData(this.key);
                    }
                    this._sound = this.context.createBufferSource();
                    this._sound.buffer = this._buffer;
                    this._sound.connect(this.gainNode);
                    this.totalDuration = this._sound.buffer.duration;
                    if(this.duration == 0) {
                        this.duration = this.totalDuration * 1000;
                    }
                    if(this.loop && marker == '') {
                        this._sound.loop = true;
                    }
                    if(typeof this._sound.start === 'undefined') {
                        this._sound.noteGrainOn(0, this.position, this.duration / 1000);
                    } else {
                        this._sound.start(0, this.position, this.duration / 1000);
                    }
                    this.isPlaying = true;
                    this.startTime = this.game.time.now;
                    this.currentTime = 0;
                    this.stopTime = this.startTime + this.duration;
                    this.onPlay.dispatch(this);
                } else {
                    this.pendingPlayback = true;
                    if(this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).isDecoding == false) {
                        this.game.sound.decode(this.key, this);
                    }
                }
            } else {
                if(this.game.cache.getSound(this.key) && this.game.cache.getSound(this.key).locked) {
                    this.game.cache.reloadSound(this.key);
                    this.pendingPlayback = true;
                } else {
                    if(this._sound && this._sound.readyState == 4) {
                        if(this.duration == 0) {
                            this.duration = this.totalDuration * 1000;
                        }
                        this._sound.currentTime = this.position;
                        this._sound.muted = this._muted;
                        if(this._muted) {
                            this._sound.volume = 0;
                        } else {
                            this._sound.volume = this._volume;
                        }
                        this._sound.play();
                        this.isPlaying = true;
                        this.startTime = this.game.time.now;
                        this.currentTime = 0;
                        this.stopTime = this.startTime + this.duration;
                        this.onPlay.dispatch(this);
                    } else {
                        this.pendingPlayback = true;
                    }
                }
            }
        };
        Sound.prototype.restart = function (marker, position, volume, loop) {
            if (typeof marker === "undefined") { marker = ''; }
            if (typeof position === "undefined") { position = 0; }
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            this.play(marker, position, volume, loop, true);
        };
        Sound.prototype.pause = function () {
            if(this.isPlaying && this._sound) {
                this.stop();
                this.isPlaying = false;
                this.paused = true;
                this.onPause.dispatch(this);
            }
        };
        Sound.prototype.resume = function () {
            if(this.paused && this._sound) {
                if(this.usingWebAudio) {
                    if(typeof this._sound.start === 'undefined') {
                        this._sound.noteGrainOn(0, this.position, this.duration);
                    } else {
                        this._sound.start(0, this.position, this.duration);
                    }
                } else {
                    this._sound.play();
                }
                this.isPlaying = true;
                this.paused = false;
                this.onResume.dispatch(this);
            }
        };
        Sound.prototype.stop = function () {
            if(this.isPlaying && this._sound) {
                if(this.usingWebAudio) {
                    if(typeof this._sound.stop === 'undefined') {
                        this._sound.noteOff(0);
                    } else {
                        this._sound.stop(0);
                    }
                } else if(this.usingAudioTag) {
                    this._sound.pause();
                    this._sound.currentTime = 0;
                }
            }
            this.isPlaying = false;
            var prevMarker = this.currentMarker;
            this.currentMarker = '';
            this.onStop.dispatch(this, prevMarker);
        };
        Object.defineProperty(Sound.prototype, "mute", {
            get: function () {
                return this._muted;
            },
            set: function (value) {
                if(value) {
                    this._muted = true;
                    if(this.usingWebAudio) {
                        this._muteVolume = this.gainNode.gain.value;
                        this.gainNode.gain.value = 0;
                    } else if(this.usingAudioTag && this._sound) {
                        this._muteVolume = this._sound.volume;
                        this._sound.volume = 0;
                    }
                } else {
                    this._muted = false;
                    if(this.usingWebAudio) {
                        this.gainNode.gain.value = this._muteVolume;
                    } else if(this.usingAudioTag && this._sound) {
                        this._sound.volume = this._muteVolume;
                    }
                }
                this.onMute.dispatch(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "volume", {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                this._volume = value;
                if(this.usingWebAudio) {
                    this.gainNode.gain.value = value;
                } else if(this.usingAudioTag && this._sound) {
                    this._sound.volume = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Sound;
    })();
    Phaser.Sound = Sound;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Animation = (function () {
        function Animation(game, parent, frameData, name, frames, delay, looped) {
            this.game = game;
            this._parent = parent;
            this._frames = frames;
            this._frameData = frameData;
            this.name = name;
            this.delay = 1000 / delay;
            this.looped = looped;
            this.isFinished = false;
            this.isPlaying = false;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        }
        Object.defineProperty(Animation.prototype, "frameTotal", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "frame", {
            get: function () {
                if(this.currentFrame !== null) {
                    return this.currentFrame.index;
                } else {
                    return this._frameIndex;
                }
            },
            set: function (value) {
                this.currentFrame = this._frameData.getFrame(value);
                if(this.currentFrame !== null) {
                    this._parent.texture.width = this.currentFrame.width;
                    this._parent.texture.height = this.currentFrame.height;
                    this._frameIndex = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.play = function (frameRate, loop) {
            if (typeof frameRate === "undefined") { frameRate = null; }
            if (typeof loop === "undefined") { loop = false; }
            if(frameRate !== null) {
                this.delay = 1000 / frameRate;
            }
            this.looped = loop;
            this.isPlaying = true;
            this.isFinished = false;
            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
            this._parent.events.onAnimationStart.dispatch(this._parent, this);
            return this;
        };
        Animation.prototype.restart = function () {
            this.isPlaying = true;
            this.isFinished = false;
            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        };
        Animation.prototype.stop = function () {
            this.isPlaying = false;
            this.isFinished = true;
        };
        Animation.prototype.update = function () {
            if(this.isPlaying == true && this.game.time.now >= this._timeNextFrame) {
                this._frameIndex++;
                if(this._frameIndex == this._frames.length) {
                    if(this.looped) {
                        this._frameIndex = 0;
                        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                        this._parent.events.onAnimationLoop.dispatch(this._parent, this);
                    } else {
                        this.onComplete();
                    }
                } else {
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                }
                this._timeLastFrame = this.game.time.now;
                this._timeNextFrame = this.game.time.now + this.delay;
                return true;
            }
            return false;
        };
        Animation.prototype.destroy = function () {
            this.game = null;
            this._parent = null;
            this._frames = null;
            this._frameData = null;
            this.currentFrame = null;
            this.isPlaying = false;
        };
        Animation.prototype.onComplete = function () {
            this.isPlaying = false;
            this.isFinished = true;
            this._parent.events.onAnimationComplete.dispatch(this._parent, this);
        };
        return Animation;
    })();
    Phaser.Animation = Animation;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Components) {
        var AnimationManager = (function () {
            function AnimationManager(parent) {
                this._frameData = null;
                this.autoUpdateBounds = true;
                this.currentFrame = null;
                this._parent = parent;
                this.game = parent.game;
                this._anims = {
                };
            }
            AnimationManager.prototype.loadFrameData = function (frameData) {
                this._frameData = frameData;
                this.frame = 0;
            };
            AnimationManager.prototype.add = function (name, frames, frameRate, loop, useNumericIndex) {
                if (typeof frames === "undefined") { frames = null; }
                if (typeof frameRate === "undefined") { frameRate = 60; }
                if (typeof loop === "undefined") { loop = false; }
                if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
                if(this._frameData == null) {
                    return;
                }
                if(this._parent.events.onAnimationStart == null) {
                    this._parent.events.onAnimationStart = new Phaser.Signal();
                    this._parent.events.onAnimationComplete = new Phaser.Signal();
                    this._parent.events.onAnimationLoop = new Phaser.Signal();
                }
                if(frames == null) {
                    frames = this._frameData.getFrameIndexes();
                } else {
                    if(this.validateFrames(frames, useNumericIndex) == false) {
                        throw Error('Invalid frames given to Animation ' + name);
                        return;
                    }
                }
                if(useNumericIndex == false) {
                    frames = this._frameData.getFrameIndexesByName(frames);
                }
                this._anims[name] = new Phaser.Animation(this.game, this._parent, this._frameData, name, frames, frameRate, loop);
                this.currentAnim = this._anims[name];
                this.currentFrame = this.currentAnim.currentFrame;
                return this._anims[name];
            };
            AnimationManager.prototype.validateFrames = function (frames, useNumericIndex) {
                for(var i = 0; i < frames.length; i++) {
                    if(useNumericIndex == true) {
                        if(frames[i] > this._frameData.total) {
                            return false;
                        }
                    } else {
                        if(this._frameData.checkFrameName(frames[i]) == false) {
                            return false;
                        }
                    }
                }
                return true;
            };
            AnimationManager.prototype.play = function (name, frameRate, loop) {
                if (typeof frameRate === "undefined") { frameRate = null; }
                if (typeof loop === "undefined") { loop = false; }
                if(this._anims[name]) {
                    if(this.currentAnim == this._anims[name]) {
                        if(this.currentAnim.isPlaying == false) {
                            return this.currentAnim.play(frameRate, loop);
                        }
                    } else {
                        this.currentAnim = this._anims[name];
                        return this.currentAnim.play(frameRate, loop);
                    }
                }
            };
            AnimationManager.prototype.stop = function (name) {
                if(this._anims[name]) {
                    this.currentAnim = this._anims[name];
                    this.currentAnim.stop();
                }
            };
            AnimationManager.prototype.update = function () {
                if(this.currentAnim && this.currentAnim.update() == true) {
                    this.currentFrame = this.currentAnim.currentFrame;
                    this._parent.texture.width = this.currentFrame.width;
                    this._parent.texture.height = this.currentFrame.height;
                }
            };
            Object.defineProperty(AnimationManager.prototype, "frameData", {
                get: function () {
                    return this._frameData;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationManager.prototype, "frameTotal", {
                get: function () {
                    if(this._frameData) {
                        return this._frameData.total;
                    } else {
                        return -1;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationManager.prototype, "frame", {
                get: function () {
                    return this._frameIndex;
                },
                set: function (value) {
                    if(this._frameData && this._frameData.getFrame(value) !== null) {
                        this.currentFrame = this._frameData.getFrame(value);
                        this._parent.texture.width = this.currentFrame.width;
                        this._parent.texture.height = this.currentFrame.height;
                        if(this.autoUpdateBounds && this._parent['body']) {
                            this._parent.body.bounds.width = this.currentFrame.width;
                            this._parent.body.bounds.height = this.currentFrame.height;
                        }
                        this._frameIndex = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationManager.prototype, "frameName", {
                get: function () {
                    return this.currentFrame.name;
                },
                set: function (value) {
                    if(this._frameData && this._frameData.getFrameByName(value)) {
                        this.currentFrame = this._frameData.getFrameByName(value);
                        this._parent.texture.width = this.currentFrame.width;
                        this._parent.texture.height = this.currentFrame.height;
                        this._frameIndex = this.currentFrame.index;
                    } else {
                        throw new Error("Cannot set frameName: " + value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            AnimationManager.prototype.destroy = function () {
                this._anims = {
                };
                this._frameData = null;
                this._frameIndex = 0;
                this.currentAnim = null;
                this.currentFrame = null;
            };
            return AnimationManager;
        })();
        Components.AnimationManager = AnimationManager;        
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Frame = (function () {
        function Frame(x, y, width, height, name) {
            this.name = '';
            this.rotated = false;
            this.rotationDirection = 'cw';
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.name = name;
            this.rotated = false;
            this.trimmed = false;
        }
        Frame.prototype.setRotation = function (rotated, rotationDirection) {
        };
        Frame.prototype.setTrim = function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {
            this.trimmed = trimmed;
            if(trimmed) {
                this.width = actualWidth;
                this.height = actualHeight;
                this.sourceSizeW = actualWidth;
                this.sourceSizeH = actualHeight;
                this.spriteSourceSizeX = destX;
                this.spriteSourceSizeY = destY;
                this.spriteSourceSizeW = destWidth;
                this.spriteSourceSizeH = destHeight;
            }
        };
        return Frame;
    })();
    Phaser.Frame = Frame;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var FrameData = (function () {
        function FrameData() {
            this._frames = [];
            this._frameNames = [];
        }
        Object.defineProperty(FrameData.prototype, "total", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });
        FrameData.prototype.addFrame = function (frame) {
            frame.index = this._frames.length;
            this._frames.push(frame);
            if(frame.name !== '') {
                this._frameNames[frame.name] = frame.index;
            }
            return frame;
        };
        FrameData.prototype.getFrame = function (index) {
            if(this._frames[index]) {
                return this._frames[index];
            }
            return null;
        };
        FrameData.prototype.getFrameByName = function (name) {
            if(this._frameNames[name] !== '') {
                return this._frames[this._frameNames[name]];
            }
            return null;
        };
        FrameData.prototype.checkFrameName = function (name) {
            if(this._frameNames[name] == null) {
                return false;
            }
            return true;
        };
        FrameData.prototype.getFrameRange = function (start, end, output) {
            if (typeof output === "undefined") { output = []; }
            for(var i = start; i <= end; i++) {
                output.push(this._frames[i]);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexes = function (output) {
            if (typeof output === "undefined") { output = []; }
            output.length = 0;
            for(var i = 0; i < this._frames.length; i++) {
                output.push(i);
            }
            return output;
        };
        FrameData.prototype.getFrameIndexesByName = function (input) {
            var output = [];
            for(var i = 0; i < input.length; i++) {
                if(this.getFrameByName(input[i])) {
                    output.push(this.getFrameByName(input[i]).index);
                }
            }
            return output;
        };
        FrameData.prototype.getAllFrames = function () {
            return this._frames;
        };
        FrameData.prototype.getFrames = function (range) {
            var output = [];
            for(var i = 0; i < range.length; i++) {
                output.push(this._frames[i]);
            }
            return output;
        };
        return FrameData;
    })();
    Phaser.FrameData = FrameData;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Cache = (function () {
        function Cache(game) {
            this.onSoundUnlock = new Phaser.Signal();
            this.game = game;
            this._canvases = {
            };
            this._images = {
            };
            this._sounds = {
            };
            this._text = {
            };
        }
        Cache.prototype.addCanvas = function (key, canvas, context) {
            this._canvases[key] = {
                canvas: canvas,
                context: context
            };
        };
        Cache.prototype.addSpriteSheet = function (key, url, data, frameWidth, frameHeight, frameMax) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: true,
                frameWidth: frameWidth,
                frameHeight: frameHeight
            };
            this._images[key].frameData = Phaser.AnimationLoader.parseSpriteSheet(this.game, key, frameWidth, frameHeight, frameMax);
        };
        Cache.prototype.addTextureAtlas = function (key, url, data, atlasData, format) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: true
            };
            if(format == Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                this._images[key].frameData = Phaser.AnimationLoader.parseJSONData(this.game, atlasData);
            } else if(format == Phaser.Loader.TEXTURE_ATLAS_XML_STARLING) {
                this._images[key].frameData = Phaser.AnimationLoader.parseXMLData(this.game, atlasData, format);
            }
        };
        Cache.prototype.addImage = function (key, url, data) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: false
            };
        };
        Cache.prototype.addSound = function (key, url, data, webAudio, audioTag) {
            if (typeof webAudio === "undefined") { webAudio = true; }
            if (typeof audioTag === "undefined") { audioTag = false; }
            var locked = this.game.sound.touchLocked;
            var decoded = false;
            if(audioTag) {
                decoded = true;
            }
            this._sounds[key] = {
                url: url,
                data: data,
                locked: locked,
                isDecoding: false,
                decoded: decoded,
                webAudio: webAudio,
                audioTag: audioTag
            };
        };
        Cache.prototype.reloadSound = function (key) {
            var _this = this;
            if(this._sounds[key]) {
                this._sounds[key].data.src = this._sounds[key].url;
                this._sounds[key].data.addEventListener('canplaythrough', function () {
                    return _this.reloadSoundComplete(key);
                }, false);
                this._sounds[key].data.load();
            }
        };
        Cache.prototype.reloadSoundComplete = function (key) {
            if(this._sounds[key]) {
                this._sounds[key].locked = false;
                this.onSoundUnlock.dispatch(key);
            }
        };
        Cache.prototype.updateSound = function (key, property, value) {
            if(this._sounds[key]) {
                this._sounds[key][property] = value;
            }
        };
        Cache.prototype.decodedSound = function (key, data) {
            this._sounds[key].data = data;
            this._sounds[key].decoded = true;
            this._sounds[key].isDecoding = false;
        };
        Cache.prototype.addText = function (key, url, data) {
            this._text[key] = {
                url: url,
                data: data
            };
        };
        Cache.prototype.getCanvas = function (key) {
            if(this._canvases[key]) {
                return this._canvases[key].canvas;
            }
            return null;
        };
        Cache.prototype.getImage = function (key) {
            if(this._images[key]) {
                return this._images[key].data;
            }
            return null;
        };
        Cache.prototype.getFrameData = function (key) {
            if(this._images[key] && this._images[key].spriteSheet == true) {
                return this._images[key].frameData;
            }
            return null;
        };
        Cache.prototype.getSound = function (key) {
            if(this._sounds[key]) {
                return this._sounds[key];
            }
            return null;
        };
        Cache.prototype.getSoundData = function (key) {
            if(this._sounds[key]) {
                return this._sounds[key].data;
            }
            return null;
        };
        Cache.prototype.isSoundDecoded = function (key) {
            if(this._sounds[key]) {
                return this._sounds[key].decoded;
            }
        };
        Cache.prototype.isSoundReady = function (key) {
            if(this._sounds[key] && this._sounds[key].decoded == true && this._sounds[key].locked == false) {
                return true;
            }
            return false;
        };
        Cache.prototype.isSpriteSheet = function (key) {
            if(this._images[key]) {
                return this._images[key].spriteSheet;
            }
        };
        Cache.prototype.getText = function (key) {
            if(this._text[key]) {
                return this._text[key].data;
            }
            return null;
        };
        Cache.prototype.getImageKeys = function () {
            var output = [];
            for(var item in this._images) {
                output.push(item);
            }
            return output;
        };
        Cache.prototype.getSoundKeys = function () {
            var output = [];
            for(var item in this._sounds) {
                output.push(item);
            }
            return output;
        };
        Cache.prototype.getTextKeys = function () {
            var output = [];
            for(var item in this._text) {
                output.push(item);
            }
            return output;
        };
        Cache.prototype.removeCanvas = function (key) {
            delete this._canvases[key];
        };
        Cache.prototype.removeImage = function (key) {
            delete this._images[key];
        };
        Cache.prototype.removeSound = function (key) {
            delete this._sounds[key];
        };
        Cache.prototype.removeText = function (key) {
            delete this._text[key];
        };
        Cache.prototype.destroy = function () {
            for(var item in this._canvases) {
                delete this._canvases[item['key']];
            }
            for(var item in this._images) {
                delete this._images[item['key']];
            }
            for(var item in this._sounds) {
                delete this._sounds[item['key']];
            }
            for(var item in this._text) {
                delete this._text[item['key']];
            }
        };
        return Cache;
    })();
    Phaser.Cache = Cache;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Loader = (function () {
        function Loader(game) {
            this.crossOrigin = '';
            this.baseURL = '';
            this.game = game;
            this._keys = [];
            this._fileList = {
            };
            this._xhr = new XMLHttpRequest();
            this._queueSize = 0;
            this.isLoading = false;
            this.onFileComplete = new Phaser.Signal();
            this.onFileError = new Phaser.Signal();
            this.onLoadStart = new Phaser.Signal();
            this.onLoadComplete = new Phaser.Signal();
        }
        Loader.TEXTURE_ATLAS_JSON_ARRAY = 0;
        Loader.TEXTURE_ATLAS_JSON_HASH = 1;
        Loader.TEXTURE_ATLAS_XML_STARLING = 2;
        Loader.prototype.reset = function () {
            this._queueSize = 0;
            this.isLoading = false;
        };
        Object.defineProperty(Loader.prototype, "queueSize", {
            get: function () {
                return this._queueSize;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.image = function (key, url, overwrite) {
            if (typeof overwrite === "undefined") { overwrite = false; }
            if(overwrite == true || this.checkKeyExists(key) == false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'image',
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.spritesheet = function (key, url, frameWidth, frameHeight, frameMax) {
            if (typeof frameMax === "undefined") { frameMax = -1; }
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'spritesheet',
                    key: key,
                    url: url,
                    data: null,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight,
                    frameMax: frameMax,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.atlas = function (key, textureURL, atlasURL, atlasData, format) {
            if (typeof atlasURL === "undefined") { atlasURL = null; }
            if (typeof atlasData === "undefined") { atlasData = null; }
            if (typeof format === "undefined") { format = Loader.TEXTURE_ATLAS_JSON_ARRAY; }
            if(this.checkKeyExists(key) === false) {
                if(atlasURL !== null) {
                    this._queueSize++;
                    this._fileList[key] = {
                        type: 'textureatlas',
                        key: key,
                        url: textureURL,
                        atlasURL: atlasURL,
                        data: null,
                        format: format,
                        error: false,
                        loaded: false
                    };
                    this._keys.push(key);
                } else {
                    if(format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                        if(typeof atlasData === 'string') {
                            atlasData = JSON.parse(atlasData);
                        }
                        this._queueSize++;
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: textureURL,
                            data: null,
                            atlasURL: null,
                            atlasData: atlasData,
                            format: format,
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    } else if(format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                        if(typeof atlasData === 'string') {
                            var xml;
                            try  {
                                if(window['DOMParser']) {
                                    var domparser = new DOMParser();
                                    xml = domparser.parseFromString(atlasData, "text/xml");
                                } else {
                                    xml = new ActiveXObject("Microsoft.XMLDOM");
                                    xml.async = 'false';
                                    xml.loadXML(atlasData);
                                }
                            } catch (e) {
                                xml = undefined;
                            }
                            if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                                throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");
                            } else {
                                atlasData = xml;
                            }
                        }
                        this._queueSize++;
                        this._fileList[key] = {
                            type: 'textureatlas',
                            key: key,
                            url: textureURL,
                            data: null,
                            atlasURL: null,
                            atlasData: atlasData,
                            format: format,
                            error: false,
                            loaded: false
                        };
                        this._keys.push(key);
                    }
                }
            }
        };
        Loader.prototype.audio = function (key, urls, autoDecode) {
            if (typeof autoDecode === "undefined") { autoDecode = true; }
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'audio',
                    key: key,
                    url: urls,
                    data: null,
                    buffer: null,
                    error: false,
                    loaded: false,
                    autoDecode: autoDecode
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.text = function (key, url) {
            if(this.checkKeyExists(key) === false) {
                this._queueSize++;
                this._fileList[key] = {
                    type: 'text',
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
                this._keys.push(key);
            }
        };
        Loader.prototype.removeFile = function (key) {
            delete this._fileList[key];
        };
        Loader.prototype.removeAll = function () {
            this._fileList = {
            };
        };
        Loader.prototype.start = function () {
            if(this.isLoading) {
                return;
            }
            this.progress = 0;
            this.hasLoaded = false;
            this.isLoading = true;
            this.onLoadStart.dispatch(this.queueSize);
            if(this._keys.length > 0) {
                this._progressChunk = 100 / this._keys.length;
                this.loadFile();
            } else {
                this.progress = 100;
                this.hasLoaded = true;
                this.onLoadComplete.dispatch();
            }
        };
        Loader.prototype.loadFile = function () {
            var _this = this;
            var file = this._fileList[this._keys.pop()];
            switch(file.type) {
                case 'image':
                case 'spritesheet':
                case 'textureatlas':
                    file.data = new Image();
                    file.data.name = file.key;
                    file.data.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    file.data.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    file.data.crossOrigin = this.crossOrigin;
                    file.data.src = this.baseURL + file.url;
                    break;
                case 'audio':
                    file.url = this.getAudioURL(file.url);
                    if(file.url !== null) {
                        if(this.game.sound.usingWebAudio) {
                            this._xhr.open("GET", this.baseURL + file.url, true);
                            this._xhr.responseType = "arraybuffer";
                            this._xhr.onload = function () {
                                return _this.fileComplete(file.key);
                            };
                            this._xhr.onerror = function () {
                                return _this.fileError(file.key);
                            };
                            this._xhr.send();
                        } else if(this.game.sound.usingAudioTag) {
                            if(this.game.sound.touchLocked) {
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.preload = 'auto';
                                file.data.src = this.baseURL + file.url;
                                this.fileComplete(file.key);
                            } else {
                                file.data = new Audio();
                                file.data.name = file.key;
                                file.data.onerror = function () {
                                    return _this.fileError(file.key);
                                };
                                file.data.preload = 'auto';
                                file.data.src = this.baseURL + file.url;
                                file.data.addEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete(file.key), false);
                                file.data.load();
                            }
                        }
                    }
                    break;
                case 'text':
                    this._xhr.open("GET", this.baseURL + file.url, true);
                    this._xhr.responseType = "text";
                    this._xhr.onload = function () {
                        return _this.fileComplete(file.key);
                    };
                    this._xhr.onerror = function () {
                        return _this.fileError(file.key);
                    };
                    this._xhr.send();
                    break;
            }
        };
        Loader.prototype.getAudioURL = function (urls) {
            var extension;
            for(var i = 0; i < urls.length; i++) {
                extension = urls[i].toLowerCase();
                extension = extension.substr((Math.max(0, extension.lastIndexOf(".")) || Infinity) + 1);
                if(this.game.device.canPlayAudio(extension)) {
                    return urls[i];
                }
            }
            return null;
        };
        Loader.prototype.fileError = function (key) {
            this._fileList[key].loaded = true;
            this._fileList[key].error = true;
            this.onFileError.dispatch(key);
            throw new Error("Phaser.Loader error loading file: " + key);
            this.nextFile(key, false);
        };
        Loader.prototype.fileComplete = function (key) {
            var _this = this;
            if(!this._fileList[key]) {
                throw new Error('Phaser.Loader fileComplete invalid key ' + key);
                return;
            }
            this._fileList[key].loaded = true;
            var file = this._fileList[key];
            var loadNext = true;
            switch(file.type) {
                case 'image':
                    this.game.cache.addImage(file.key, file.url, file.data);
                    break;
                case 'spritesheet':
                    this.game.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                    break;
                case 'textureatlas':
                    if(file.atlasURL == null) {
                        this.game.cache.addTextureAtlas(file.key, file.url, file.data, file.atlasData, file.format);
                    } else {
                        loadNext = false;
                        this._xhr.open("GET", this.baseURL + file.atlasURL, true);
                        this._xhr.responseType = "text";
                        if(file.format == Loader.TEXTURE_ATLAS_JSON_ARRAY) {
                            this._xhr.onload = function () {
                                return _this.jsonLoadComplete(file.key);
                            };
                        } else if(file.format == Loader.TEXTURE_ATLAS_XML_STARLING) {
                            this._xhr.onload = function () {
                                return _this.xmlLoadComplete(file.key);
                            };
                        }
                        this._xhr.onerror = function () {
                            return _this.dataLoadError(file.key);
                        };
                        this._xhr.send();
                    }
                    break;
                case 'audio':
                    if(this.game.sound.usingWebAudio) {
                        file.data = this._xhr.response;
                        this.game.cache.addSound(file.key, file.url, file.data, true, false);
                        if(file.autoDecode) {
                            this.game.cache.updateSound(key, 'isDecoding', true);
                            var that = this;
                            var key = file.key;
                            this.game.sound.context.decodeAudioData(file.data, function (buffer) {
                                if(buffer) {
                                    that.game.cache.decodedSound(key, buffer);
                                }
                            });
                        }
                    } else {
                        file.data.removeEventListener('canplaythrough', Phaser.GAMES[this.game.id].load.fileComplete);
                        this.game.cache.addSound(file.key, file.url, file.data, false, true);
                    }
                    break;
                case 'text':
                    file.data = this._xhr.response;
                    this.game.cache.addText(file.key, file.url, file.data);
                    break;
            }
            if(loadNext) {
                this.nextFile(key, true);
            }
        };
        Loader.prototype.jsonLoadComplete = function (key) {
            var data = JSON.parse(this._xhr.response);
            var file = this._fileList[key];
            this.game.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
            this.nextFile(key, true);
        };
        Loader.prototype.dataLoadError = function (key) {
            var file = this._fileList[key];
            file.error = true;
            throw new Error("Phaser.Loader dataLoadError: " + key);
            this.nextFile(key, true);
        };
        Loader.prototype.xmlLoadComplete = function (key) {
            var atlasData = this._xhr.response;
            var xml;
            try  {
                if(window['DOMParser']) {
                    var domparser = new DOMParser();
                    xml = domparser.parseFromString(atlasData, "text/xml");
                } else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = 'false';
                    xml.loadXML(atlasData);
                }
            } catch (e) {
                xml = undefined;
            }
            if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                throw new Error("Phaser.Loader. Invalid XML given");
            }
            var file = this._fileList[key];
            this.game.cache.addTextureAtlas(file.key, file.url, file.data, xml, file.format);
            this.nextFile(key, true);
        };
        Loader.prototype.nextFile = function (previousKey, success) {
            this.progress = Math.round(this.progress + this._progressChunk);
            if(this.progress > 100) {
                this.progress = 100;
            }
            this.onFileComplete.dispatch(this.progress, previousKey, success, this._queueSize - this._keys.length, this._queueSize);
            if(this._keys.length > 0) {
                this.loadFile();
            } else {
                this.hasLoaded = true;
                this.isLoading = false;
                this.removeAll();
                this.onLoadComplete.dispatch();
            }
        };
        Loader.prototype.checkKeyExists = function (key) {
            if(this._fileList[key]) {
                return true;
            } else {
                return false;
            }
        };
        return Loader;
    })();
    Phaser.Loader = Loader;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var AnimationLoader = (function () {
        function AnimationLoader() { }
        AnimationLoader.parseSpriteSheet = function parseSpriteSheet(game, key, frameWidth, frameHeight, frameMax) {
            var img = game.cache.getImage(key);
            if(img == null) {
                return null;
            }
            var width = img.width;
            var height = img.height;
            var row = Math.round(width / frameWidth);
            var column = Math.round(height / frameHeight);
            var total = row * column;
            if(frameMax !== -1) {
                total = frameMax;
            }
            if(width == 0 || height == 0 || width < frameWidth || height < frameHeight || total === 0) {
                throw new Error("AnimationLoader.parseSpriteSheet: width/height zero or width/height < given frameWidth/frameHeight");
                return null;
            }
            var data = new Phaser.FrameData();
            var x = 0;
            var y = 0;
            for(var i = 0; i < total; i++) {
                data.addFrame(new Phaser.Frame(x, y, frameWidth, frameHeight, ''));
                x += frameWidth;
                if(x === width) {
                    x = 0;
                    y += frameHeight;
                }
            }
            return data;
        };
        AnimationLoader.parseJSONData = function parseJSONData(game, json) {
            if(!json['frames']) {
                console.log(json);
                throw new Error("Phaser.AnimationLoader.parseJSONData: Invalid Texture Atlas JSON given, missing 'frames' array");
            }
            var data = new Phaser.FrameData();
            var frames = json['frames'];
            var newFrame;
            for(var i = 0; i < frames.length; i++) {
                newFrame = data.addFrame(new Phaser.Frame(frames[i].frame.x, frames[i].frame.y, frames[i].frame.w, frames[i].frame.h, frames[i].filename));
                newFrame.setTrim(frames[i].trimmed, frames[i].sourceSize.w, frames[i].sourceSize.h, frames[i].spriteSourceSize.x, frames[i].spriteSourceSize.y, frames[i].spriteSourceSize.w, frames[i].spriteSourceSize.h);
            }
            return data;
        };
        AnimationLoader.parseXMLData = function parseXMLData(game, xml, format) {
            if(!xml.getElementsByTagName('TextureAtlas')) {
                throw new Error("Phaser.AnimationLoader.parseXMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");
            }
            var data = new Phaser.FrameData();
            var frames = xml.getElementsByTagName('SubTexture');
            var newFrame;
            for(var i = 0; i < frames.length; i++) {
                var frame = frames[i].attributes;
                newFrame = data.addFrame(new Phaser.Frame(frame.x.nodeValue, frame.y.nodeValue, frame.width.nodeValue, frame.height.nodeValue, frame.name.nodeValue));
                if(frame.frameX.nodeValue != '-0' || frame.frameY.nodeValue != '-0') {
                    newFrame.setTrim(true, frame.width.nodeValue, frame.height.nodeValue, Math.abs(frame.frameX.nodeValue), Math.abs(frame.frameY.nodeValue), frame.frameWidth.nodeValue, frame.frameHeight.nodeValue);
                }
            }
            return data;
        };
        return AnimationLoader;
    })();
    Phaser.AnimationLoader = AnimationLoader;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Tile = (function () {
        function Tile(game, tilemap, index, width, height) {
            this.mass = 1.0;
            this.collideLeft = false;
            this.collideRight = false;
            this.collideUp = false;
            this.collideDown = false;
            this.separateX = true;
            this.separateY = true;
            this.game = game;
            this.tilemap = tilemap;
            this.index = index;
            this.width = width;
            this.height = height;
            this.allowCollisions = Phaser.Types.NONE;
        }
        Tile.prototype.destroy = function () {
            this.tilemap = null;
        };
        Tile.prototype.setCollision = function (collision, resetCollisions, separateX, separateY) {
            if(resetCollisions) {
                this.resetCollision();
            }
            this.separateX = separateX;
            this.separateY = separateY;
            this.allowCollisions = collision;
            if(collision & Phaser.Types.ANY) {
                this.collideLeft = true;
                this.collideRight = true;
                this.collideUp = true;
                this.collideDown = true;
                return;
            }
            if(collision & Phaser.Types.LEFT || collision & Phaser.Types.WALL) {
                this.collideLeft = true;
            }
            if(collision & Phaser.Types.RIGHT || collision & Phaser.Types.WALL) {
                this.collideRight = true;
            }
            if(collision & Phaser.Types.UP || collision & Phaser.Types.CEILING) {
                this.collideUp = true;
            }
            if(collision & Phaser.Types.DOWN || collision & Phaser.Types.CEILING) {
                this.collideDown = true;
            }
        };
        Tile.prototype.resetCollision = function () {
            this.allowCollisions = Phaser.Types.NONE;
            this.collideLeft = false;
            this.collideRight = false;
            this.collideUp = false;
            this.collideDown = false;
        };
        Tile.prototype.toString = function () {
            return "[{Tile (index=" + this.index + " collisions=" + this.allowCollisions + " width=" + this.width + " height=" + this.height + ")}]";
        };
        return Tile;
    })();
    Phaser.Tile = Tile;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Tilemap = (function () {
        function Tilemap(game, key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            this.z = -1;
            this.renderOrderID = 0;
            this.collisionCallback = null;
            this.game = game;
            this.type = Phaser.Types.TILEMAP;
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.z = -1;
            this.group = null;
            this.name = '';
            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);
            this.tiles = [];
            this.layers = [];
            this.mapFormat = format;
            switch(format) {
                case Tilemap.FORMAT_CSV:
                    this.parseCSV(game.cache.getText(mapData), key, tileWidth, tileHeight);
                    break;
                case Tilemap.FORMAT_TILED_JSON:
                    this.parseTiledJSON(game.cache.getText(mapData), key);
                    break;
            }
            if(this.currentLayer && resizeWorld) {
                this.game.world.setSize(this.currentLayer.widthInPixels, this.currentLayer.heightInPixels, true);
            }
        }
        Tilemap.FORMAT_CSV = 0;
        Tilemap.FORMAT_TILED_JSON = 1;
        Tilemap.prototype.parseCSV = function (data, key, tileWidth, tileHeight) {
            var layer = new Phaser.TilemapLayer(this, 0, key, Tilemap.FORMAT_CSV, 'TileLayerCSV' + this.layers.length.toString(), tileWidth, tileHeight);
            data = data.trim();
            var rows = data.split("\n");
            for(var i = 0; i < rows.length; i++) {
                var column = rows[i].split(",");
                if(column.length > 0) {
                    layer.addColumn(column);
                }
            }
            layer.updateBounds();
            var tileQuantity = layer.parseTileOffsets();
            this.currentLayer = layer;
            this.collisionLayer = layer;
            this.layers.push(layer);
            this.generateTiles(tileQuantity);
        };
        Tilemap.prototype.parseTiledJSON = function (data, key) {
            data = data.trim();
            var json = JSON.parse(data);
            for(var i = 0; i < json.layers.length; i++) {
                var layer = new Phaser.TilemapLayer(this, i, key, Tilemap.FORMAT_TILED_JSON, json.layers[i].name, json.tilewidth, json.tileheight);
                if(!json.layers[i].data) {
                    continue;
                }
                layer.alpha = json.layers[i].opacity;
                layer.visible = json.layers[i].visible;
                layer.tileMargin = json.tilesets[0].margin;
                layer.tileSpacing = json.tilesets[0].spacing;
                var c = 0;
                var row;
                for(var t = 0; t < json.layers[i].data.length; t++) {
                    if(c == 0) {
                        row = [];
                    }
                    row.push(json.layers[i].data[t]);
                    c++;
                    if(c == json.layers[i].width) {
                        layer.addColumn(row);
                        c = 0;
                    }
                }
                layer.updateBounds();
                var tileQuantity = layer.parseTileOffsets();
                this.currentLayer = layer;
                this.collisionLayer = layer;
                this.layers.push(layer);
            }
            this.generateTiles(tileQuantity);
        };
        Tilemap.prototype.generateTiles = function (qty) {
            for(var i = 0; i < qty; i++) {
                this.tiles.push(new Phaser.Tile(this.game, this, i, this.currentLayer.tileWidth, this.currentLayer.tileHeight));
            }
        };
        Object.defineProperty(Tilemap.prototype, "widthInPixels", {
            get: function () {
                return this.currentLayer.widthInPixels;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tilemap.prototype, "heightInPixels", {
            get: function () {
                return this.currentLayer.heightInPixels;
            },
            enumerable: true,
            configurable: true
        });
        Tilemap.prototype.setCollisionCallback = function (context, callback) {
            this.collisionCallbackContext = context;
            this.collisionCallback = callback;
        };
        Tilemap.prototype.setCollisionRange = function (start, end, collision, resetCollisions, separateX, separateY) {
            if (typeof collision === "undefined") { collision = Phaser.Types.ANY; }
            if (typeof resetCollisions === "undefined") { resetCollisions = false; }
            if (typeof separateX === "undefined") { separateX = true; }
            if (typeof separateY === "undefined") { separateY = true; }
            for(var i = start; i < end; i++) {
                this.tiles[i].setCollision(collision, resetCollisions, separateX, separateY);
            }
        };
        Tilemap.prototype.setCollisionByIndex = function (values, collision, resetCollisions, separateX, separateY) {
            if (typeof collision === "undefined") { collision = Phaser.Types.ANY; }
            if (typeof resetCollisions === "undefined") { resetCollisions = false; }
            if (typeof separateX === "undefined") { separateX = true; }
            if (typeof separateY === "undefined") { separateY = true; }
            for(var i = 0; i < values.length; i++) {
                this.tiles[values[i]].setCollision(collision, resetCollisions, separateX, separateY);
            }
        };
        Tilemap.prototype.getTileByIndex = function (value) {
            if(this.tiles[value]) {
                return this.tiles[value];
            }
            return null;
        };
        Tilemap.prototype.getTile = function (x, y, layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            return this.tiles[this.layers[layer].getTileIndex(x, y)];
        };
        Tilemap.prototype.getTileFromWorldXY = function (x, y, layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(x, y)];
        };
        Tilemap.prototype.getTileFromInputXY = function (layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            return this.tiles[this.layers[layer].getTileFromWorldXY(this.game.input.worldX, this.game.input.worldY)];
        };
        Tilemap.prototype.getTileOverlaps = function (object) {
            return this.currentLayer.getTileOverlaps(object);
        };
        Tilemap.prototype.collide = function (objectOrGroup, callback, context) {
            if (typeof objectOrGroup === "undefined") { objectOrGroup = null; }
            if (typeof callback === "undefined") { callback = null; }
            if (typeof context === "undefined") { context = null; }
            if(callback !== null && context !== null) {
                this.collisionCallback = callback;
                this.collisionCallbackContext = context;
            }
            if(objectOrGroup == null) {
                objectOrGroup = this.game.world.group;
            }
            if(objectOrGroup.isGroup == false) {
                this.collideGameObject(objectOrGroup);
            } else {
                objectOrGroup.forEachAlive(this, this.collideGameObject, true);
            }
        };
        Tilemap.prototype.collideGameObject = function (object) {
            if(object.body.type == Phaser.Types.BODY_DYNAMIC && object.exists == true && object.body.allowCollisions != Phaser.Types.NONE) {
                this._tempCollisionData = this.collisionLayer.getTileOverlaps(object);
                if(this.collisionCallback !== null && this._tempCollisionData.length > 0) {
                    this.collisionCallback.call(this.collisionCallbackContext, object, this._tempCollisionData);
                }
                return true;
            } else {
                return false;
            }
        };
        Tilemap.prototype.putTile = function (x, y, index, layer) {
            if (typeof layer === "undefined") { layer = this.currentLayer.ID; }
            this.layers[layer].putTile(x, y, index);
        };
        Tilemap.prototype.destroy = function () {
            this.texture = null;
            this.transform = null;
            this.tiles.length = 0;
            this.layers.length = 0;
        };
        return Tilemap;
    })();
    Phaser.Tilemap = Tilemap;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var TilemapLayer = (function () {
        function TilemapLayer(parent, id, key, mapFormat, name, tileWidth, tileHeight) {
            this.exists = true;
            this.visible = true;
            this.widthInTiles = 0;
            this.heightInTiles = 0;
            this.widthInPixels = 0;
            this.heightInPixels = 0;
            this.tileMargin = 0;
            this.tileSpacing = 0;
            this.parent = parent;
            this.game = parent.game;
            this.ID = id;
            this.name = name;
            this.mapFormat = mapFormat;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.boundsInTiles = new Phaser.Rectangle();
            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);
            if(key !== null) {
                this.texture.loadImage(key, false);
            } else {
                this.texture.opaque = true;
            }
            this.alpha = this.texture.alpha;
            this.mapData = [];
            this._tempTileBlock = [];
        }
        TilemapLayer.prototype.putTileWorldXY = function (x, y, index) {
            x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;
            if(y >= 0 && y < this.mapData.length) {
                if(x >= 0 && x < this.mapData[y].length) {
                    this.mapData[y][x] = index;
                }
            }
        };
        TilemapLayer.prototype.putTile = function (x, y, index) {
            if(y >= 0 && y < this.mapData.length) {
                if(x >= 0 && x < this.mapData[y].length) {
                    this.mapData[y][x] = index;
                }
            }
        };
        TilemapLayer.prototype.swapTile = function (tileA, tileB, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                if(this._tempTileBlock[r].tile.index == tileA) {
                    this._tempTileBlock[r].newIndex = true;
                }
                if(this._tempTileBlock[r].tile.index == tileB) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileA;
                }
            }
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                if(this._tempTileBlock[r].newIndex == true) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }
        };
        TilemapLayer.prototype.fillTile = function (index, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = index;
            }
        };
        TilemapLayer.prototype.randomiseTiles = function (tiles, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = this.game.math.getRandom(tiles);
            }
        };
        TilemapLayer.prototype.replaceTile = function (tileA, tileB, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = this.widthInTiles; }
            if (typeof height === "undefined") { height = this.heightInTiles; }
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                if(this._tempTileBlock[r].tile.index == tileA) {
                    this.mapData[this._tempTileBlock[r].y][this._tempTileBlock[r].x] = tileB;
                }
            }
        };
        TilemapLayer.prototype.getTileBlock = function (x, y, width, height) {
            var output = [];
            this.getTempBlock(x, y, width, height);
            for(var r = 0; r < this._tempTileBlock.length; r++) {
                output.push({
                    x: this._tempTileBlock[r].x,
                    y: this._tempTileBlock[r].y,
                    tile: this._tempTileBlock[r].tile
                });
            }
            return output;
        };
        TilemapLayer.prototype.getTileFromWorldXY = function (x, y) {
            x = this.game.math.snapToFloor(x, this.tileWidth) / this.tileWidth;
            y = this.game.math.snapToFloor(y, this.tileHeight) / this.tileHeight;
            return this.getTileIndex(x, y);
        };
        TilemapLayer.prototype.getTileOverlaps = function (object) {
            if(object.body.bounds.x < 0 || object.body.bounds.x > this.widthInPixels || object.body.bounds.y < 0 || object.body.bounds.bottom > this.heightInPixels) {
                return;
            }
            this._tempTileX = this.game.math.snapToFloor(object.body.bounds.x, this.tileWidth) / this.tileWidth;
            this._tempTileY = this.game.math.snapToFloor(object.body.bounds.y, this.tileHeight) / this.tileHeight;
            this._tempTileW = (this.game.math.snapToCeil(object.body.bounds.width, this.tileWidth) + this.tileWidth) / this.tileWidth;
            this._tempTileH = (this.game.math.snapToCeil(object.body.bounds.height, this.tileHeight) + this.tileHeight) / this.tileHeight;
            this._tempBlockResults = [];
            this.getTempBlock(this._tempTileX, this._tempTileY, this._tempTileW, this._tempTileH, true);
            return this._tempBlockResults;
        };
        TilemapLayer.prototype.getTempBlock = function (x, y, width, height, collisionOnly) {
            if (typeof collisionOnly === "undefined") { collisionOnly = false; }
            if(x < 0) {
                x = 0;
            }
            if(y < 0) {
                y = 0;
            }
            if(width > this.widthInTiles) {
                width = this.widthInTiles;
            }
            if(height > this.heightInTiles) {
                height = this.heightInTiles;
            }
            this._tempTileBlock = [];
            for(var ty = y; ty < y + height; ty++) {
                for(var tx = x; tx < x + width; tx++) {
                    if(collisionOnly) {
                        if(this.mapData[ty] && this.mapData[ty][tx] && this.parent.tiles[this.mapData[ty][tx]].allowCollisions != Phaser.Types.NONE) {
                            this._tempTileBlock.push({
                                x: tx,
                                y: ty,
                                tile: this.parent.tiles[this.mapData[ty][tx]]
                            });
                        }
                    } else {
                        if(this.mapData[ty] && this.mapData[ty][tx]) {
                            this._tempTileBlock.push({
                                x: tx,
                                y: ty,
                                tile: this.parent.tiles[this.mapData[ty][tx]]
                            });
                        }
                    }
                }
            }
        };
        TilemapLayer.prototype.getTileIndex = function (x, y) {
            if(y >= 0 && y < this.mapData.length) {
                if(x >= 0 && x < this.mapData[y].length) {
                    return this.mapData[y][x];
                }
            }
            return null;
        };
        TilemapLayer.prototype.addColumn = function (column) {
            var data = [];
            for(var c = 0; c < column.length; c++) {
                data[c] = parseInt(column[c]);
            }
            if(this.widthInTiles == 0) {
                this.widthInTiles = data.length;
                this.widthInPixels = this.widthInTiles * this.tileWidth;
            }
            this.mapData.push(data);
            this.heightInTiles++;
            this.heightInPixels += this.tileHeight;
        };
        TilemapLayer.prototype.updateBounds = function () {
            this.boundsInTiles.setTo(0, 0, this.widthInTiles, this.heightInTiles);
        };
        TilemapLayer.prototype.parseTileOffsets = function () {
            this.tileOffsets = [];
            var i = 0;
            if(this.mapFormat == Phaser.Tilemap.FORMAT_TILED_JSON) {
                this.tileOffsets[0] = null;
                i = 1;
            }
            for(var ty = this.tileMargin; ty < this.texture.height; ty += (this.tileHeight + this.tileSpacing)) {
                for(var tx = this.tileMargin; tx < this.texture.width; tx += (this.tileWidth + this.tileSpacing)) {
                    this.tileOffsets[i] = {
                        x: tx,
                        y: ty
                    };
                    i++;
                }
            }
            return this.tileOffsets.length;
        };
        return TilemapLayer;
    })();
    Phaser.TilemapLayer = TilemapLayer;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        var PhysicsManager = (function () {
            function PhysicsManager(game) {
                this._length = 0;
                this.grav = 0.2;
                this.drag = 1;
                this.bounce = 0.3;
                this.friction = 0.05;
                this.min_f = 0;
                this.max_f = 1;
                this.min_b = 0;
                this.max_b = 1;
                this.min_g = 0;
                this.max_g = 1;
                this.xmin = 0;
                this.xmax = 800;
                this.ymin = 0;
                this.ymax = 600;
                this.objrad = 24;
                this.tilerad = 24 * 2;
                this.objspeed = 0.2;
                this.maxspeed = 20;
                this.game = game;
            }
            PhysicsManager.prototype.update = function () {
            };
            PhysicsManager.prototype.updateMotion = function (body) {
                this._velocityDelta = (this.computeVelocity(body.angularVelocity, body.gravity.x, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity) / 2;
                body.angularVelocity += this._velocityDelta;
                body.sprite.transform.rotation += body.angularVelocity * this.game.time.physicsElapsed;
                body.angularVelocity += this._velocityDelta;
                this._velocityDelta = (this.computeVelocity(body.velocity.x, body.gravity.x, body.acceleration.x, body.drag.x) - body.velocity.x) / 2;
                body.velocity.x += this._velocityDelta;
                this._delta = body.velocity.x * this.game.time.physicsElapsed;
                body.aabb.pos.x += this._delta;
                body.deltaX = this._delta;
                this._velocityDelta = (this.computeVelocity(body.velocity.y, body.gravity.y, body.acceleration.y, body.drag.y) - body.velocity.y) / 2;
                body.velocity.y += this._velocityDelta;
                this._delta = body.velocity.y * this.game.time.physicsElapsed;
                body.aabb.pos.y += this._delta;
                body.deltaY = this._delta;
                body.aabb.integrateVerlet();
            };
            PhysicsManager.prototype.computeVelocity = function (velocity, gravity, acceleration, drag, max) {
                if (typeof gravity === "undefined") { gravity = 0; }
                if (typeof acceleration === "undefined") { acceleration = 0; }
                if (typeof drag === "undefined") { drag = 0; }
                if (typeof max === "undefined") { max = 10000; }
                if(acceleration !== 0) {
                    velocity += (acceleration + gravity) * this.game.time.elapsed;
                } else if(drag !== 0) {
                    this._drag = drag * this.game.time.elapsed;
                    if(velocity - this._drag > 0) {
                        velocity = velocity - this._drag;
                    } else if(velocity + this._drag < 0) {
                        velocity += this._drag;
                    } else {
                        velocity = 0;
                    }
                    velocity += gravity;
                }
                if((velocity != 0) && (max != 10000)) {
                    if(velocity > max) {
                        velocity = max;
                    } else if(velocity < -max) {
                        velocity = -max;
                    }
                }
                return velocity;
            };
            return PhysicsManager;
        })();
        Physics.PhysicsManager = PhysicsManager;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        var Body = (function () {
            function Body(sprite, type) {
                this.angularVelocity = 0;
                this.angularAcceleration = 0;
                this.angularDrag = 0;
                this.maxAngular = 10000;
                this.deltaX = 0;
                this.deltaY = 0;
                this.sprite = sprite;
                this.game = sprite.game;
                this.type = type;
                this.aabb = new Phaser.Physics.AABB(sprite.game, sprite.x, sprite.y, sprite.width, sprite.height);
                this.velocity = new Phaser.Vec2();
                this.acceleration = new Phaser.Vec2();
                this.drag = new Phaser.Vec2();
                this.gravity = new Phaser.Vec2();
                this.maxVelocity = new Phaser.Vec2(10000, 10000);
                this.angularVelocity = 0;
                this.angularAcceleration = 0;
                this.angularDrag = 0;
                this.maxAngular = 10000;
                this.allowCollisions = Phaser.Types.ANY;
            }
            return Body;
        })();
        Physics.Body = Body;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        var AABB = (function () {
            function AABB(game, x, y, width, height) {
                this.type = 0;
                this.game = game;
                this.pos = new Phaser.Vec2(x, y);
                this.oldpos = new Phaser.Vec2(x, y);
                this.width = Math.abs(width);
                this.height = Math.abs(height);
                this.aabbTileProjections = {
                };
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGs] = Phaser.Physics.Projection.AABB22Deg.CollideS;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGb] = Phaser.Physics.Projection.AABB22Deg.CollideB;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_45DEG] = Phaser.Physics.Projection.AABB45Deg.Collide;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGs] = Phaser.Physics.Projection.AABB67Deg.CollideS;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGb] = Phaser.Physics.Projection.AABB67Deg.CollideB;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONCAVE] = Phaser.Physics.Projection.AABBConcave.Collide;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONVEX] = Phaser.Physics.Projection.AABBConvex.Collide;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_FULL] = Phaser.Physics.Projection.AABBFull.Collide;
                this.aabbTileProjections[Phaser.Physics.TileMapCell.CTYPE_HALF] = Phaser.Physics.Projection.AABBHalf.Collide;
            }
            AABB.COL_NONE = 0;
            AABB.COL_AXIS = 1;
            AABB.COL_OTHER = 2;
            AABB.prototype.integrateVerlet = function () {
                var d = 0;
                var g = 0;
                var px = this.pos.x;
                var py = this.pos.y;
                var ox = this.oldpos.x;
                var oy = this.oldpos.y;
                this.oldpos.x = this.pos.x;
                this.oldpos.y = this.pos.y;
                this.pos.x += (d * px) - (d * ox);
                this.pos.y += (d * py) - (d * oy) + g;
            };
            AABB.prototype.reportCollisionVsWorld = function (px, py, dx, dy, obj) {
                if (typeof obj === "undefined") { obj = null; }
                var vx = this.pos.x - this.oldpos.x;
                var vy = this.pos.y - this.oldpos.y;
                var dp = (vx * dx + vy * dy);
                var nx = dp * dx;
                var ny = dp * dy;
                var tx = vx - nx;
                var ty = vy - ny;
                this.pos.x += px;
                this.pos.y += py;
                this.oldpos.x += px;
                this.oldpos.y += py;
                if(dp < 0) {
                    var b = 1 + 0.5;
                    var f = 0.05;
                    var fx = tx * f;
                    var fy = ty * f;
                    this.oldpos.x += (nx * b) + fx;
                    this.oldpos.y += (ny * b) + fy;
                }
            };
            AABB.prototype.collideAABBVsTile = function (tile) {
                var pos = this.pos;
                var c = tile;
                var tx = c.pos.x;
                var ty = c.pos.y;
                var txw = c.xw;
                var tyw = c.yw;
                var dx = pos.x - tx;
                var px = (txw + this.width) - Math.abs(dx);
                if(0 < px) {
                    var dy = pos.y - ty;
                    var py = (tyw + this.height) - Math.abs(dy);
                    if(0 < py) {
                        if(px < py) {
                            if(dx < 0) {
                                px *= -1;
                                py = 0;
                            } else {
                                py = 0;
                            }
                        } else {
                            if(dy < 0) {
                                px = 0;
                                py *= -1;
                            } else {
                                px = 0;
                            }
                        }
                        this.resolveBoxTile(px, py, this, c);
                    }
                }
            };
            AABB.prototype.collideAABBVsWorldBounds = function () {
                var p = this.pos;
                var xw = this.width;
                var yw = this.height;
                var XMIN = 0;
                var XMAX = 800;
                var YMIN = 0;
                var YMAX = 600;
                var dx = XMIN - (p.x - xw);
                if(0 < dx) {
                    this.reportCollisionVsWorld(dx, 0, 1, 0, null);
                } else {
                    dx = (p.x + xw) - XMAX;
                    if(0 < dx) {
                        this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
                    }
                }
                var dy = YMIN - (p.y - yw);
                if(0 < dy) {
                    this.reportCollisionVsWorld(0, dy, 0, 1, null);
                } else {
                    dy = (p.y + yw) - YMAX;
                    if(0 < dy) {
                        this.reportCollisionVsWorld(0, -dy, 0, -1, null);
                    }
                }
            };
            AABB.prototype.render = function (context) {
                context.beginPath();
                context.strokeStyle = 'rgb(0,255,0)';
                context.strokeRect(this.pos.x - this.width, this.pos.y - this.height, this.width * 2, this.height * 2);
                context.stroke();
                context.closePath();
                context.fillStyle = 'rgb(0,255,0)';
                context.fillRect(this.pos.x, this.pos.y, 2, 2);
            };
            AABB.prototype.resolveBoxTile = function (x, y, box, t) {
                if(0 < t.ID) {
                    return this.aabbTileProjections[t.CTYPE](x, y, box, t);
                } else {
                    return false;
                }
            };
            return AABB;
        })();
        Physics.AABB = AABB;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        var Circle = (function () {
            function Circle(game, x, y, radius) {
                this.type = 1;
                this.game = game;
                this.pos = new Phaser.Vec2(x, y);
                this.oldpos = new Phaser.Vec2(x, y);
                this.radius = radius;
                this.circleTileProjections = {
                };
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGs] = Phaser.Physics.Projection.Circle22Deg.CollideS;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_22DEGb] = Phaser.Physics.Projection.Circle22Deg.CollideB;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_45DEG] = Phaser.Physics.Projection.Circle45Deg.Collide;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGs] = Phaser.Physics.Projection.Circle67Deg.CollideS;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_67DEGb] = Phaser.Physics.Projection.Circle67Deg.CollideB;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONCAVE] = Phaser.Physics.Projection.CircleConcave.Collide;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_CONVEX] = Phaser.Physics.Projection.CircleConvex.Collide;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_FULL] = Phaser.Physics.Projection.CircleFull.Collide;
                this.circleTileProjections[Phaser.Physics.TileMapCell.CTYPE_HALF] = Phaser.Physics.Projection.CircleHalf.Collide;
            }
            Circle.COL_NONE = 0;
            Circle.COL_AXIS = 1;
            Circle.COL_OTHER = 2;
            Circle.prototype.integrateVerlet = function () {
                var d = 1;
                var g = 0.2;
                var p = this.pos;
                var o = this.oldpos;
                var px;
                var py;
                var ox = o.x;
                var oy = o.y;
                o.x = px = p.x;
                o.y = py = p.y;
                p.x += (d * px) - (d * ox);
                p.y += (d * py) - (d * oy) + g;
            };
            Circle.prototype.reportCollisionVsWorld = function (px, py, dx, dy, obj) {
                if (typeof obj === "undefined") { obj = null; }
                var p = this.pos;
                var o = this.oldpos;
                var vx = p.x - o.x;
                var vy = p.y - o.y;
                var dp = (vx * dx + vy * dy);
                var nx = dp * dx;
                var ny = dp * dy;
                var tx = vx - nx;
                var ty = vy - ny;
                var b, bx, by, f, fx, fy;
                if(dp < 0) {
                    f = 0.05;
                    fx = tx * f;
                    fy = ty * f;
                    b = 1 + 0.3;
                    bx = (nx * b);
                    by = (ny * b);
                } else {
                    bx = by = fx = fy = 0;
                }
                p.x += px;
                p.y += py;
                o.x += px + bx + fx;
                o.y += py + by + fy;
            };
            Circle.prototype.collideCircleVsWorldBounds = function () {
                var p = this.pos;
                var r = this.radius;
                var XMIN = 0;
                var XMAX = 800;
                var YMIN = 0;
                var YMAX = 600;
                var dx = XMIN - (p.x - r);
                if(0 < dx) {
                    this.reportCollisionVsWorld(dx, 0, 1, 0, null);
                } else {
                    dx = (p.x + r) - XMAX;
                    if(0 < dx) {
                        this.reportCollisionVsWorld(-dx, 0, -1, 0, null);
                    }
                }
                var dy = YMIN - (p.y - r);
                if(0 < dy) {
                    this.reportCollisionVsWorld(0, dy, 0, 1, null);
                } else {
                    dy = (p.y + r) - YMAX;
                    if(0 < dy) {
                        this.reportCollisionVsWorld(0, -dy, 0, -1, null);
                    }
                }
            };
            Circle.prototype.render = function (context) {
                context.beginPath();
                context.strokeStyle = 'rgb(0,255,0)';
                context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
                context.stroke();
                context.closePath();
                if(this.oH == 1) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.pos.x - this.radius, this.pos.y - this.radius);
                    context.lineTo(this.pos.x - this.radius, this.pos.y + this.radius);
                    context.stroke();
                    context.closePath();
                } else if(this.oH == -1) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.pos.x + this.radius, this.pos.y - this.radius);
                    context.lineTo(this.pos.x + this.radius, this.pos.y + this.radius);
                    context.stroke();
                    context.closePath();
                }
                if(this.oV == 1) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.pos.x - this.radius, this.pos.y - this.radius);
                    context.lineTo(this.pos.x + this.radius, this.pos.y - this.radius);
                    context.stroke();
                    context.closePath();
                } else if(this.oV == -1) {
                    context.beginPath();
                    context.strokeStyle = 'rgb(255,0,0)';
                    context.moveTo(this.pos.x - this.radius, this.pos.y + this.radius);
                    context.lineTo(this.pos.x + this.radius, this.pos.y + this.radius);
                    context.stroke();
                    context.closePath();
                }
            };
            Circle.prototype.collideCircleVsTile = function (tile) {
                var pos = this.pos;
                var r = this.radius;
                var c = tile;
                var tx = c.pos.x;
                var ty = c.pos.y;
                var txw = c.xw;
                var tyw = c.yw;
                var dx = pos.x - tx;
                var px = (txw + r) - Math.abs(dx);
                if(0 < px) {
                    var dy = pos.y - ty;
                    var py = (tyw + r) - Math.abs(dy);
                    if(0 < py) {
                        this.oH = 0;
                        this.oV = 0;
                        if(dx < -txw) {
                            this.oH = -1;
                        } else if(txw < dx) {
                            this.oH = 1;
                        }
                        if(dy < -tyw) {
                            this.oV = -1;
                        } else if(tyw < dy) {
                            this.oV = 1;
                        }
                        this.resolveCircleTile(px, py, this.oH, this.oV, this, c);
                    }
                }
            };
            Circle.prototype.resolveCircleTile = function (x, y, oH, oV, obj, t) {
                if(0 < t.ID) {
                    return this.circleTileProjections[t.CTYPE](x, y, oH, oV, obj, t);
                } else {
                    console.log("resolveCircleTile() was called with an empty (or unknown) tile!: ID=" + t.ID + " (" + t.i + "," + t.j + ")");
                    return false;
                }
            };
            return Circle;
        })();
        Physics.Circle = Circle;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        var TileMapCell = (function () {
            function TileMapCell(game, x, y, xw, yw) {
                this.game = game;
                this.ID = TileMapCell.TID_EMPTY;
                this.CTYPE = TileMapCell.CTYPE_EMPTY;
                this.pos = new Phaser.Vec2(x, y);
                this.xw = xw;
                this.yw = yw;
                this.minx = this.pos.x - this.xw;
                this.maxx = this.pos.x + this.xw;
                this.miny = this.pos.y - this.yw;
                this.maxy = this.pos.y + this.yw;
                this.signx = 0;
                this.signy = 0;
                this.sx = 0;
                this.sy = 0;
            }
            TileMapCell.TID_EMPTY = 0;
            TileMapCell.TID_FULL = 1;
            TileMapCell.TID_45DEGpn = 2;
            TileMapCell.TID_45DEGnn = 3;
            TileMapCell.TID_45DEGnp = 4;
            TileMapCell.TID_45DEGpp = 5;
            TileMapCell.TID_CONCAVEpn = 6;
            TileMapCell.TID_CONCAVEnn = 7;
            TileMapCell.TID_CONCAVEnp = 8;
            TileMapCell.TID_CONCAVEpp = 9;
            TileMapCell.TID_CONVEXpn = 10;
            TileMapCell.TID_CONVEXnn = 11;
            TileMapCell.TID_CONVEXnp = 12;
            TileMapCell.TID_CONVEXpp = 13;
            TileMapCell.TID_22DEGpnS = 14;
            TileMapCell.TID_22DEGnnS = 15;
            TileMapCell.TID_22DEGnpS = 16;
            TileMapCell.TID_22DEGppS = 17;
            TileMapCell.TID_22DEGpnB = 18;
            TileMapCell.TID_22DEGnnB = 19;
            TileMapCell.TID_22DEGnpB = 20;
            TileMapCell.TID_22DEGppB = 21;
            TileMapCell.TID_67DEGpnS = 22;
            TileMapCell.TID_67DEGnnS = 23;
            TileMapCell.TID_67DEGnpS = 24;
            TileMapCell.TID_67DEGppS = 25;
            TileMapCell.TID_67DEGpnB = 26;
            TileMapCell.TID_67DEGnnB = 27;
            TileMapCell.TID_67DEGnpB = 28;
            TileMapCell.TID_67DEGppB = 29;
            TileMapCell.TID_HALFd = 30;
            TileMapCell.TID_HALFr = 31;
            TileMapCell.TID_HALFu = 32;
            TileMapCell.TID_HALFl = 33;
            TileMapCell.CTYPE_EMPTY = 0;
            TileMapCell.CTYPE_FULL = 1;
            TileMapCell.CTYPE_45DEG = 2;
            TileMapCell.CTYPE_CONCAVE = 6;
            TileMapCell.CTYPE_CONVEX = 10;
            TileMapCell.CTYPE_22DEGs = 14;
            TileMapCell.CTYPE_22DEGb = 18;
            TileMapCell.CTYPE_67DEGs = 22;
            TileMapCell.CTYPE_67DEGb = 26;
            TileMapCell.CTYPE_HALF = 30;
            TileMapCell.prototype.SetState = function (ID) {
                if(ID == TileMapCell.TID_EMPTY) {
                    this.Clear();
                } else {
                    this.ID = ID;
                    this.UpdateType();
                }
                return this;
            };
            TileMapCell.prototype.Clear = function () {
                this.ID = TileMapCell.TID_EMPTY;
                this.UpdateType();
            };
            TileMapCell.prototype.render = function (context) {
                context.beginPath();
                context.strokeStyle = 'rgb(255,255,0)';
                context.strokeRect(this.minx, this.miny, this.xw * 2, this.yw * 2);
                context.strokeRect(this.pos.x, this.pos.y, 2, 2);
                context.closePath();
            };
            TileMapCell.prototype.UpdateType = function () {
                if(0 < this.ID) {
                    if(this.ID < TileMapCell.CTYPE_45DEG) {
                        this.CTYPE = TileMapCell.CTYPE_FULL;
                        this.signx = 0;
                        this.signy = 0;
                        this.sx = 0;
                        this.sy = 0;
                    } else if(this.ID < TileMapCell.CTYPE_CONCAVE) {
                        this.CTYPE = TileMapCell.CTYPE_45DEG;
                        if(this.ID == TileMapCell.TID_45DEGpn) {
                            console.log('set tile as 45deg pn');
                            this.signx = 1;
                            this.signy = -1;
                            this.sx = this.signx / Math.SQRT2;
                            this.sy = this.signy / Math.SQRT2;
                        } else if(this.ID == TileMapCell.TID_45DEGnn) {
                            this.signx = -1;
                            this.signy = -1;
                            this.sx = this.signx / Math.SQRT2;
                            this.sy = this.signy / Math.SQRT2;
                        } else if(this.ID == TileMapCell.TID_45DEGnp) {
                            this.signx = -1;
                            this.signy = 1;
                            this.sx = this.signx / Math.SQRT2;
                            this.sy = this.signy / Math.SQRT2;
                        } else if(this.ID == TileMapCell.TID_45DEGpp) {
                            this.signx = 1;
                            this.signy = 1;
                            this.sx = this.signx / Math.SQRT2;
                            this.sy = this.signy / Math.SQRT2;
                        } else {
                            return false;
                        }
                    } else if(this.ID < TileMapCell.CTYPE_CONVEX) {
                        this.CTYPE = TileMapCell.CTYPE_CONCAVE;
                        if(this.ID == TileMapCell.TID_CONCAVEpn) {
                            this.signx = 1;
                            this.signy = -1;
                            this.sx = 0;
                            this.sy = 0;
                        } else if(this.ID == TileMapCell.TID_CONCAVEnn) {
                            this.signx = -1;
                            this.signy = -1;
                            this.sx = 0;
                            this.sy = 0;
                        } else if(this.ID == TileMapCell.TID_CONCAVEnp) {
                            this.signx = -1;
                            this.signy = 1;
                            this.sx = 0;
                            this.sy = 0;
                        } else if(this.ID == TileMapCell.TID_CONCAVEpp) {
                            this.signx = 1;
                            this.signy = 1;
                            this.sx = 0;
                            this.sy = 0;
                        } else {
                            return false;
                        }
                    } else if(this.ID < TileMapCell.CTYPE_22DEGs) {
                        this.CTYPE = TileMapCell.CTYPE_CONVEX;
                        if(this.ID == TileMapCell.TID_CONVEXpn) {
                            this.signx = 1;
                            this.signy = -1;
                            this.sx = 0;
                            this.sy = 0;
                        } else if(this.ID == TileMapCell.TID_CONVEXnn) {
                            this.signx = -1;
                            this.signy = -1;
                            this.sx = 0;
                            this.sy = 0;
                        } else if(this.ID == TileMapCell.TID_CONVEXnp) {
                            this.signx = -1;
                            this.signy = 1;
                            this.sx = 0;
                            this.sy = 0;
                        } else if(this.ID == TileMapCell.TID_CONVEXpp) {
                            this.signx = 1;
                            this.signy = 1;
                            this.sx = 0;
                            this.sy = 0;
                        } else {
                            return false;
                        }
                    } else if(this.ID < TileMapCell.CTYPE_22DEGb) {
                        this.CTYPE = TileMapCell.CTYPE_22DEGs;
                        if(this.ID == TileMapCell.TID_22DEGpnS) {
                            this.signx = 1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else if(this.ID == TileMapCell.TID_22DEGnnS) {
                            this.signx = -1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else if(this.ID == TileMapCell.TID_22DEGnpS) {
                            this.signx = -1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else if(this.ID == TileMapCell.TID_22DEGppS) {
                            this.signx = 1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else {
                            return false;
                        }
                    } else if(this.ID < TileMapCell.CTYPE_67DEGs) {
                        this.CTYPE = TileMapCell.CTYPE_22DEGb;
                        if(this.ID == TileMapCell.TID_22DEGpnB) {
                            this.signx = 1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else if(this.ID == TileMapCell.TID_22DEGnnB) {
                            this.signx = -1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else if(this.ID == TileMapCell.TID_22DEGnpB) {
                            this.signx = -1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else if(this.ID == TileMapCell.TID_22DEGppB) {
                            this.signx = 1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 1) / slen;
                            this.sy = (this.signy * 2) / slen;
                        } else {
                            return false;
                        }
                    } else if(this.ID < TileMapCell.CTYPE_67DEGb) {
                        this.CTYPE = TileMapCell.CTYPE_67DEGs;
                        if(this.ID == TileMapCell.TID_67DEGpnS) {
                            this.signx = 1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else if(this.ID == TileMapCell.TID_67DEGnnS) {
                            this.signx = -1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else if(this.ID == TileMapCell.TID_67DEGnpS) {
                            this.signx = -1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else if(this.ID == TileMapCell.TID_67DEGppS) {
                            this.signx = 1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else {
                            return false;
                        }
                    } else if(this.ID < TileMapCell.CTYPE_HALF) {
                        this.CTYPE = TileMapCell.CTYPE_67DEGb;
                        if(this.ID == TileMapCell.TID_67DEGpnB) {
                            this.signx = 1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else if(this.ID == TileMapCell.TID_67DEGnnB) {
                            this.signx = -1;
                            this.signy = -1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else if(this.ID == TileMapCell.TID_67DEGnpB) {
                            this.signx = -1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else if(this.ID == TileMapCell.TID_67DEGppB) {
                            this.signx = 1;
                            this.signy = 1;
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            this.sx = (this.signx * 2) / slen;
                            this.sy = (this.signy * 1) / slen;
                        } else {
                            return false;
                        }
                    } else {
                        this.CTYPE = TileMapCell.CTYPE_HALF;
                        if(this.ID == TileMapCell.TID_HALFd) {
                            this.signx = 0;
                            this.signy = -1;
                            this.sx = this.signx;
                            this.sy = this.signy;
                        } else if(this.ID == TileMapCell.TID_HALFu) {
                            this.signx = 0;
                            this.signy = 1;
                            this.sx = this.signx;
                            this.sy = this.signy;
                        } else if(this.ID == TileMapCell.TID_HALFl) {
                            this.signx = 1;
                            this.signy = 0;
                            this.sx = this.signx;
                            this.sy = this.signy;
                        } else if(this.ID == TileMapCell.TID_HALFr) {
                            this.signx = -1;
                            this.signy = 0;
                            this.sx = this.signx;
                            this.sy = this.signy;
                        } else {
                            return false;
                        }
                    }
                } else {
                    this.CTYPE = TileMapCell.CTYPE_EMPTY;
                    this.signx = 0;
                    this.signy = 0;
                    this.sx = 0;
                    this.sy = 0;
                }
            };
            return TileMapCell;
        })();
        Physics.TileMapCell = TileMapCell;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var AABB22Deg = (function () {
                function AABB22Deg() { }
                AABB22Deg.CollideS = function CollideS(x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var py = obj.pos.y - (signy * obj.height);
                    var penY = t.pos.y - py;
                    if(0 < (penY * signy)) {
                        var ox = (obj.pos.x - (signx * obj.width)) - (t.pos.x + (signx * t.xw));
                        var oy = (obj.pos.y - (signy * obj.height)) - (t.pos.y - (signy * t.yw));
                        var sx = t.sx;
                        var sy = t.sy;
                        var dp = (ox * sx) + (oy * sy);
                        if(dp < 0) {
                            sx *= -dp;
                            sy *= -dp;
                            var lenN = Math.sqrt(sx * sx + sy * sy);
                            var lenP = Math.sqrt(x * x + y * y);
                            var aY = Math.abs(penY);
                            if(lenP < lenN) {
                                if(aY < lenP) {
                                    obj.reportCollisionVsWorld(0, penY, 0, penY / aY, t);
                                    return Phaser.Physics.AABB.COL_OTHER;
                                } else {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.AABB.COL_AXIS;
                                }
                            } else {
                                if(aY < lenN) {
                                    obj.reportCollisionVsWorld(0, penY, 0, penY / aY, t);
                                    return Phaser.Physics.AABB.COL_OTHER;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                    return Phaser.Physics.AABB.COL_OTHER;
                                }
                            }
                        }
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                AABB22Deg.CollideB = function CollideB(x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var ox = (obj.pos.x - (signx * obj.width)) - (t.pos.x - (signx * t.xw));
                    var oy = (obj.pos.y - (signy * obj.height)) - (t.pos.y + (signy * t.yw));
                    var sx = t.sx;
                    var sy = t.sy;
                    var dp = (ox * sx) + (oy * sy);
                    if(dp < 0) {
                        sx *= -dp;
                        sy *= -dp;
                        var lenN = Math.sqrt(sx * sx + sy * sy);
                        var lenP = Math.sqrt(x * x + y * y);
                        if(lenP < lenN) {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABB22Deg;
            })();
            Projection.AABB22Deg = AABB22Deg;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var AABB45Deg = (function () {
                function AABB45Deg() { }
                AABB45Deg.Collide = function Collide(x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var ox = (obj.pos.x - (signx * obj.width)) - t.pos.x;
                    var oy = (obj.pos.y - (signy * obj.height)) - t.pos.y;
                    var sx = t.sx;
                    var sy = t.sy;
                    var dp = (ox * sx) + (oy * sy);
                    if(dp < 0) {
                        sx *= -dp;
                        sy *= -dp;
                        var lenN = Math.sqrt(sx * sx + sy * sy);
                        var lenP = Math.sqrt(x * x + y * y);
                        if(lenP < lenN) {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy);
                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABB45Deg;
            })();
            Projection.AABB45Deg = AABB45Deg;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var AABB67Deg = (function () {
                function AABB67Deg() { }
                AABB67Deg.CollideS = function CollideS(x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var px = obj.pos.x - (signx * obj.width);
                    var penX = t.pos.x - px;
                    if(0 < (penX * signx)) {
                        var ox = (obj.pos.x - (signx * obj.width)) - (t.pos.x - (signx * t.xw));
                        var oy = (obj.pos.y - (signy * obj.height)) - (t.pos.y + (signy * t.yw));
                        var sx = t.sx;
                        var sy = t.sy;
                        var dp = (ox * sx) + (oy * sy);
                        if(dp < 0) {
                            sx *= -dp;
                            sy *= -dp;
                            var lenN = Math.sqrt(sx * sx + sy * sy);
                            var lenP = Math.sqrt(x * x + y * y);
                            var aX = Math.abs(penX);
                            if(lenP < lenN) {
                                if(aX < lenP) {
                                    obj.reportCollisionVsWorld(penX, 0, penX / aX, 0, t);
                                    return Phaser.Physics.AABB.COL_OTHER;
                                } else {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.AABB.COL_AXIS;
                                }
                            } else {
                                if(aX < lenN) {
                                    obj.reportCollisionVsWorld(penX, 0, penX / aX, 0, t);
                                    return Phaser.Physics.AABB.COL_OTHER;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                    return Phaser.Physics.AABB.COL_OTHER;
                                }
                            }
                        }
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                AABB67Deg.CollideB = function CollideB(x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var ox = (obj.pos.x - (signx * obj.width)) - (t.pos.x + (signx * t.xw));
                    var oy = (obj.pos.y - (signy * obj.height)) - (t.pos.y - (signy * t.yw));
                    var sx = t.sx;
                    var sy = t.sy;
                    var dp = (ox * sx) + (oy * sy);
                    if(dp < 0) {
                        sx *= -dp;
                        sy *= -dp;
                        var lenN = Math.sqrt(sx * sx + sy * sy);
                        var lenP = Math.sqrt(x * x + y * y);
                        if(lenP < lenN) {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABB67Deg;
            })();
            Projection.AABB67Deg = AABB67Deg;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var AABBConcave = (function () {
                function AABBConcave() { }
                AABBConcave.Collide = function Collide(x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var ox = (t.pos.x + (signx * t.xw)) - (obj.pos.x - (signx * obj.width));
                    var oy = (t.pos.y + (signy * t.yw)) - (obj.pos.y - (signy * obj.height));
                    var twid = t.xw * 2;
                    var rad = Math.sqrt(twid * twid + 0);
                    var len = Math.sqrt(ox * ox + oy * oy);
                    var pen = len - rad;
                    if(0 < pen) {
                        var lenP = Math.sqrt(x * x + y * y);
                        if(lenP < pen) {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            ox /= len;
                            oy /= len;
                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABBConcave;
            })();
            Projection.AABBConcave = AABBConcave;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var AABBConvex = (function () {
                function AABBConvex() { }
                AABBConvex.Collide = function Collide(x, y, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var ox = (obj.pos.x - (signx * obj.width)) - (t.pos.x - (signx * t.xw));
                    var oy = (obj.pos.y - (signy * obj.height)) - (t.pos.y - (signy * t.yw));
                    var len = Math.sqrt(ox * ox + oy * oy);
                    var twid = t.xw * 2;
                    var rad = Math.sqrt(twid * twid + 0);
                    var pen = rad - len;
                    if(((signx * ox) < 0) || ((signy * oy) < 0)) {
                        var lenP = Math.sqrt(x * x + y * y);
                        obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                        return Phaser.Physics.AABB.COL_AXIS;
                    } else if(0 < pen) {
                        ox /= len;
                        oy /= len;
                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                        return Phaser.Physics.AABB.COL_OTHER;
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABBConvex;
            })();
            Projection.AABBConvex = AABBConvex;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var AABBFull = (function () {
                function AABBFull() { }
                AABBFull.Collide = function Collide(x, y, obj, t) {
                    var l = Math.sqrt(x * x + y * y);
                    obj.reportCollisionVsWorld(x, y, x / l, y / l, t);
                    return Phaser.Physics.AABB.COL_AXIS;
                };
                return AABBFull;
            })();
            Projection.AABBFull = AABBFull;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var AABBHalf = (function () {
                function AABBHalf() { }
                AABBHalf.Collide = function Collide(x, y, obj, t) {
                    var sx = t.signx;
                    var sy = t.signy;
                    var ox = (obj.pos.x - (sx * obj.width)) - t.pos.x;
                    var oy = (obj.pos.y - (sy * obj.height)) - t.pos.y;
                    var dp = (ox * sx) + (oy * sy);
                    if(dp < 0) {
                        sx *= -dp;
                        sy *= -dp;
                        var lenN = Math.sqrt(sx * sx + sy * sy);
                        var lenP = Math.sqrt(x * x + y * y);
                        if(lenP < lenN) {
                            obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                            return Phaser.Physics.AABB.COL_AXIS;
                        } else {
                            obj.reportCollisionVsWorld(sx, sy, t.signx, t.signy, t);
                            return Phaser.Physics.AABB.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.AABB.COL_NONE;
                };
                return AABBHalf;
            })();
            Projection.AABBHalf = AABBHalf;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var Circle22Deg = (function () {
                function Circle22Deg() { }
                Circle22Deg.CollideS = function CollideS(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    if(0 < (signy * oV)) {
                        return Phaser.Physics.Circle.COL_NONE;
                    } else if(oH == 0) {
                        if(oV == 0) {
                            var sx = t.sx;
                            var sy = t.sy;
                            var r = obj.radius;
                            var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                            var oy = obj.pos.y - t.pos.y;
                            var perp = (ox * -sy) + (oy * sx);
                            if(0 < (perp * signx * signy)) {
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = r - len;
                                if(0 < pen) {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                ox -= r * sx;
                                oy -= r * sy;
                                var dp = (ox * sx) + (oy * sy);
                                if(dp < 0) {
                                    sx *= -dp;
                                    sy *= -dp;
                                    var lenN = Math.sqrt(sx * sx + sy * sy);
                                    var lenP;
                                    if(x < y) {
                                        lenP = x;
                                        y = 0;
                                        if((obj.pos.x - t.pos.x) < 0) {
                                            x *= -1;
                                        }
                                    } else {
                                        lenP = y;
                                        x = 0;
                                        if((obj.pos.y - t.pos.y) < 0) {
                                            y *= -1;
                                        }
                                    }
                                    if(lenP < lenN) {
                                        obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                        return Phaser.Physics.Circle.COL_AXIS;
                                    } else {
                                        obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        } else {
                            obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                    } else if(oV == 0) {
                        if((signx * oH) < 0) {
                            var vx = t.pos.x - (signx * t.xw);
                            var vy = t.pos.y;
                            var dx = obj.pos.x - vx;
                            var dy = obj.pos.y - vy;
                            if((dy * signy) < 0) {
                                obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    if(len == 0) {
                                        dx = oH / Math.SQRT2;
                                        dy = oV / Math.SQRT2;
                                    } else {
                                        dx /= len;
                                        dy /= len;
                                    }
                                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            var sx = t.sx;
                            var sy = t.sy;
                            var ox = obj.pos.x - (t.pos.x + (oH * t.xw));
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                            var perp = (ox * -sy) + (oy * sx);
                            if((perp * signx * signy) < 0) {
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                var dp = (ox * sx) + (oy * sy);
                                var pen = obj.radius - Math.abs(dp);
                                if(0 < pen) {
                                    obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        }
                    } else {
                        var vx = t.pos.x + (oH * t.xw);
                        var vy = t.pos.y + (oV * t.yw);
                        var dx = obj.pos.x - vx;
                        var dy = obj.pos.y - vy;
                        var len = Math.sqrt(dx * dx + dy * dy);
                        var pen = obj.radius - len;
                        if(0 < pen) {
                            if(len == 0) {
                                dx = oH / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            } else {
                                dx /= len;
                                dy /= len;
                            }
                            obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                Circle22Deg.CollideB = function CollideB(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var sx;
                    var sy;
                    if(oH == 0) {
                        if(oV == 0) {
                            sx = t.sx;
                            sy = t.sy;
                            var r = obj.radius;
                            var ox = (obj.pos.x - (sx * r)) - (t.pos.x - (signx * t.xw));
                            var oy = (obj.pos.y - (sy * r)) - (t.pos.y + (signy * t.yw));
                            var dp = (ox * sx) + (oy * sy);
                            if(dp < 0) {
                                sx *= -dp;
                                sy *= -dp;
                                var lenN = Math.sqrt(sx * sx + sy * sy);
                                var lenP;
                                if(x < y) {
                                    lenP = x;
                                    y = 0;
                                    if((obj.pos.x - t.pos.x) < 0) {
                                        x *= -1;
                                    }
                                } else {
                                    lenP = y;
                                    x = 0;
                                    if((obj.pos.y - t.pos.y) < 0) {
                                        y *= -1;
                                    }
                                }
                                if(lenP < lenN) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            if((signy * oV) < 0) {
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                sx = t.sx;
                                sy = t.sy;
                                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                                var oy = obj.pos.y - (t.pos.y + (signy * t.yw));
                                var perp = (ox * -sy) + (oy * sx);
                                if(0 < (perp * signx * signy)) {
                                    var len = Math.sqrt(ox * ox + oy * oy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        ox /= len;
                                        oy /= len;
                                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                } else {
                                    var dp = (ox * sx) + (oy * sy);
                                    var pen = obj.radius - Math.abs(dp);
                                    if(0 < pen) {
                                        obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        }
                    } else if(oV == 0) {
                        if((signx * oH) < 0) {
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        } else {
                            var ox = obj.pos.x - (t.pos.x + (signx * t.xw));
                            var oy = obj.pos.y - t.pos.y;
                            if((oy * signy) < 0) {
                                obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                sx = t.sx;
                                sy = t.sy;
                                var perp = (ox * -sy) + (oy * sx);
                                if((perp * signx * signy) < 0) {
                                    var len = Math.sqrt(ox * ox + oy * oy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        ox /= len;
                                        oy /= len;
                                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                } else {
                                    var dp = (ox * sx) + (oy * sy);
                                    var pen = obj.radius - Math.abs(dp);
                                    if(0 < pen) {
                                        obj.reportCollisionVsWorld(sx * pen, sy * pen, t.sx, t.sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        }
                    } else {
                        if(0 < ((signx * oH) + (signy * oV))) {
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            sx = (signx * 1) / slen;
                            sy = (signy * 2) / slen;
                            var r = obj.radius;
                            var ox = (obj.pos.x - (sx * r)) - (t.pos.x - (signx * t.xw));
                            var oy = (obj.pos.y - (sy * r)) - (t.pos.y + (signy * t.yw));
                            var dp = (ox * sx) + (oy * sy);
                            if(dp < 0) {
                                obj.reportCollisionVsWorld(-sx * dp, -sy * dp, t.sx, t.sy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                            return Phaser.Physics.Circle.COL_NONE;
                        } else {
                            var vx = t.pos.x + (oH * t.xw);
                            var vy = t.pos.y + (oV * t.yw);
                            var dx = obj.pos.x - vx;
                            var dy = obj.pos.y - vy;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var pen = obj.radius - len;
                            if(0 < pen) {
                                if(len == 0) {
                                    dx = oH / Math.SQRT2;
                                    dy = oV / Math.SQRT2;
                                } else {
                                    dx /= len;
                                    dy /= len;
                                }
                                obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return Circle22Deg;
            })();
            Projection.Circle22Deg = Circle22Deg;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var Circle45Deg = (function () {
                function Circle45Deg() { }
                Circle45Deg.Collide = function Collide(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var lenP;
                    if(oH == 0) {
                        if(oV == 0) {
                            var sx = t.sx;
                            var sy = t.sy;
                            var ox = (obj.pos.x - (sx * obj.radius)) - t.pos.x;
                            var oy = (obj.pos.y - (sy * obj.radius)) - t.pos.y;
                            var dp = (ox * sx) + (oy * sy);
                            if(dp < 0) {
                                sx *= -dp;
                                sy *= -dp;
                                if(x < y) {
                                    lenP = x;
                                    y = 0;
                                    if((obj.pos.x - t.pos.x) < 0) {
                                        x *= -1;
                                    }
                                } else {
                                    lenP = y;
                                    x = 0;
                                    if((obj.pos.y - t.pos.y) < 0) {
                                        y *= -1;
                                    }
                                }
                                var lenN = Math.sqrt(sx * sx + sy * sy);
                                if(lenP < lenN) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            if((signy * oV) < 0) {
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                var sx = t.sx;
                                var sy = t.sy;
                                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                                var oy = obj.pos.y - (t.pos.y + (oV * t.yw));
                                var perp = (ox * -sy) + (oy * sx);
                                if(0 < (perp * signx * signy)) {
                                    var len = Math.sqrt(ox * ox + oy * oy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        ox /= len;
                                        oy /= len;
                                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                } else {
                                    var dp = (ox * sx) + (oy * sy);
                                    var pen = obj.radius - Math.abs(dp);
                                    if(0 < pen) {
                                        obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        }
                    } else if(oV == 0) {
                        if((signx * oH) < 0) {
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        } else {
                            var sx = t.sx;
                            var sy = t.sy;
                            var ox = obj.pos.x - (t.pos.x + (oH * t.xw));
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                            var perp = (ox * -sy) + (oy * sx);
                            if((perp * signx * signy) < 0) {
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                var dp = (ox * sx) + (oy * sy);
                                var pen = obj.radius - Math.abs(dp);
                                if(0 < pen) {
                                    obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        }
                    } else {
                        if(0 < ((signx * oH) + (signy * oV))) {
                            return Phaser.Physics.Circle.COL_NONE;
                        } else {
                            var vx = t.pos.x + (oH * t.xw);
                            var vy = t.pos.y + (oV * t.yw);
                            var dx = obj.pos.x - vx;
                            var dy = obj.pos.y - vy;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var pen = obj.radius - len;
                            if(0 < pen) {
                                if(len == 0) {
                                    dx = oH / Math.SQRT2;
                                    dy = oV / Math.SQRT2;
                                } else {
                                    dx /= len;
                                    dy /= len;
                                }
                                obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return Circle45Deg;
            })();
            Projection.Circle45Deg = Circle45Deg;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var Circle67Deg = (function () {
                function Circle67Deg() { }
                Circle67Deg.CollideS = function CollideS(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var sx;
                    var sy;
                    if(0 < (signx * oH)) {
                        return Phaser.Physics.Circle.COL_NONE;
                    } else if(oH == 0) {
                        if(oV == 0) {
                            sx = t.sx;
                            sy = t.sy;
                            var r = obj.radius;
                            var ox = obj.pos.x - t.pos.x;
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                            var perp = (ox * -sy) + (oy * sx);
                            if((perp * signx * signy) < 0) {
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = r - len;
                                if(0 < pen) {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                ox -= r * sx;
                                oy -= r * sy;
                                var dp = (ox * sx) + (oy * sy);
                                var lenP;
                                if(dp < 0) {
                                    sx *= -dp;
                                    sy *= -dp;
                                    var lenN = Math.sqrt(sx * sx + sy * sy);
                                    if(x < y) {
                                        lenP = x;
                                        y = 0;
                                        if((obj.pos.x - t.pos.x) < 0) {
                                            x *= -1;
                                        }
                                    } else {
                                        lenP = y;
                                        x = 0;
                                        if((obj.pos.y - t.pos.y) < 0) {
                                            y *= -1;
                                        }
                                    }
                                    if(lenP < lenN) {
                                        obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                        return Phaser.Physics.Circle.COL_AXIS;
                                    } else {
                                        obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        } else {
                            if((signy * oV) < 0) {
                                var vx = t.pos.x;
                                var vy = t.pos.y - (signy * t.yw);
                                var dx = obj.pos.x - vx;
                                var dy = obj.pos.y - vy;
                                if((dx * signx) < 0) {
                                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    var len = Math.sqrt(dx * dx + dy * dy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        if(len == 0) {
                                            dx = oH / Math.SQRT2;
                                            dy = oV / Math.SQRT2;
                                        } else {
                                            dx /= len;
                                            dy /= len;
                                        }
                                        obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            } else {
                                sx = t.sx;
                                sy = t.sy;
                                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                                var oy = obj.pos.y - (t.pos.y + (oV * t.yw));
                                var perp = (ox * -sy) + (oy * sx);
                                if(0 < (perp * signx * signy)) {
                                    var len = Math.sqrt(ox * ox + oy * oy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        ox /= len;
                                        oy /= len;
                                        obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                } else {
                                    var dp = (ox * sx) + (oy * sy);
                                    var pen = obj.radius - Math.abs(dp);
                                    if(0 < pen) {
                                        obj.reportCollisionVsWorld(sx * pen, sy * pen, t.sx, t.sy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            }
                        }
                    } else if(oV == 0) {
                        obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                        return Phaser.Physics.Circle.COL_AXIS;
                    } else {
                        var vx = t.pos.x + (oH * t.xw);
                        var vy = t.pos.y + (oV * t.yw);
                        var dx = obj.pos.x - vx;
                        var dy = obj.pos.y - vy;
                        var len = Math.sqrt(dx * dx + dy * dy);
                        var pen = obj.radius - len;
                        if(0 < pen) {
                            if(len == 0) {
                                dx = oH / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            } else {
                                dx /= len;
                                dy /= len;
                            }
                            obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                Circle67Deg.CollideB = function CollideB(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var sx;
                    var sy;
                    if(oH == 0) {
                        if(oV == 0) {
                            sx = t.sx;
                            sy = t.sy;
                            var r = obj.radius;
                            var ox = (obj.pos.x - (sx * r)) - (t.pos.x + (signx * t.xw));
                            var oy = (obj.pos.y - (sy * r)) - (t.pos.y - (signy * t.yw));
                            var dp = (ox * sx) + (oy * sy);
                            var lenP;
                            if(dp < 0) {
                                sx *= -dp;
                                sy *= -dp;
                                var lenN = Math.sqrt(sx * sx + sy * sy);
                                if(x < y) {
                                    lenP = x;
                                    y = 0;
                                    if((obj.pos.x - t.pos.x) < 0) {
                                        x *= -1;
                                    }
                                } else {
                                    lenP = y;
                                    x = 0;
                                    if((obj.pos.y - t.pos.y) < 0) {
                                        y *= -1;
                                    }
                                }
                                if(lenP < lenN) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.sx, t.sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            if((signy * oV) < 0) {
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                var ox = obj.pos.x - t.pos.x;
                                var oy = obj.pos.y - (t.pos.y + (signy * t.yw));
                                if((ox * signx) < 0) {
                                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    sx = t.sx;
                                    sy = t.sy;
                                    var perp = (ox * -sy) + (oy * sx);
                                    if(0 < (perp * signx * signy)) {
                                        var len = Math.sqrt(ox * ox + oy * oy);
                                        var pen = obj.radius - len;
                                        if(0 < pen) {
                                            ox /= len;
                                            oy /= len;
                                            obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                            return Phaser.Physics.Circle.COL_OTHER;
                                        }
                                    } else {
                                        var dp = (ox * sx) + (oy * sy);
                                        var pen = obj.radius - Math.abs(dp);
                                        if(0 < pen) {
                                            obj.reportCollisionVsWorld(sx * pen, sy * pen, sx, sy, t);
                                            return Phaser.Physics.Circle.COL_OTHER;
                                        }
                                    }
                                }
                            }
                        }
                    } else if(oV == 0) {
                        if((signx * oH) < 0) {
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        } else {
                            var slen = Math.sqrt(2 * 2 + 1 * 1);
                            var sx = (signx * 2) / slen;
                            var sy = (signy * 1) / slen;
                            var ox = obj.pos.x - (t.pos.x + (signx * t.xw));
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                            var perp = (ox * -sy) + (oy * sx);
                            if((perp * signx * signy) < 0) {
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                var dp = (ox * sx) + (oy * sy);
                                var pen = obj.radius - Math.abs(dp);
                                if(0 < pen) {
                                    obj.reportCollisionVsWorld(sx * pen, sy * pen, t.sx, t.sy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        }
                    } else {
                        if(0 < ((signx * oH) + (signy * oV))) {
                            sx = t.sx;
                            sy = t.sy;
                            var r = obj.radius;
                            var ox = (obj.pos.x - (sx * r)) - (t.pos.x + (signx * t.xw));
                            var oy = (obj.pos.y - (sy * r)) - (t.pos.y - (signy * t.yw));
                            var dp = (ox * sx) + (oy * sy);
                            if(dp < 0) {
                                obj.reportCollisionVsWorld(-sx * dp, -sy * dp, t.sx, t.sy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                            return Phaser.Physics.Circle.COL_NONE;
                        } else {
                            var vx = t.pos.x + (oH * t.xw);
                            var vy = t.pos.y + (oV * t.yw);
                            var dx = obj.pos.x - vx;
                            var dy = obj.pos.y - vy;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var pen = obj.radius - len;
                            if(0 < pen) {
                                if(len == 0) {
                                    dx = oH / Math.SQRT2;
                                    dy = oV / Math.SQRT2;
                                } else {
                                    dx /= len;
                                    dy /= len;
                                }
                                obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return Circle67Deg;
            })();
            Projection.Circle67Deg = Circle67Deg;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var CircleConcave = (function () {
                function CircleConcave() { }
                CircleConcave.Collide = function Collide(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var lenP;
                    if(oH == 0) {
                        if(oV == 0) {
                            var ox = (t.pos.x + (signx * t.xw)) - obj.pos.x;
                            var oy = (t.pos.y + (signy * t.yw)) - obj.pos.y;
                            var twid = t.xw * 2;
                            var trad = Math.sqrt(twid * twid + 0);
                            var len = Math.sqrt(ox * ox + oy * oy);
                            var pen = (len + obj.radius) - trad;
                            if(0 < pen) {
                                if(x < y) {
                                    lenP = x;
                                    y = 0;
                                    if((obj.pos.x - t.pos.x) < 0) {
                                        x *= -1;
                                    }
                                } else {
                                    lenP = y;
                                    x = 0;
                                    if((obj.pos.y - t.pos.y) < 0) {
                                        y *= -1;
                                    }
                                }
                                if(lenP < pen) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            } else {
                                return Phaser.Physics.Circle.COL_NONE;
                            }
                        } else {
                            if((signy * oV) < 0) {
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                var vx = t.pos.x - (signx * t.xw);
                                var vy = t.pos.y + (oV * t.yw);
                                var dx = obj.pos.x - vx;
                                var dy = obj.pos.y - vy;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    if(len == 0) {
                                        dx = 0;
                                        dy = oV;
                                    } else {
                                        dx /= len;
                                        dy /= len;
                                    }
                                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        }
                    } else if(oV == 0) {
                        if((signx * oH) < 0) {
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        } else {
                            var vx = t.pos.x + (oH * t.xw);
                            var vy = t.pos.y - (signy * t.yw);
                            var dx = obj.pos.x - vx;
                            var dy = obj.pos.y - vy;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var pen = obj.radius - len;
                            if(0 < pen) {
                                if(len == 0) {
                                    dx = oH;
                                    dy = 0;
                                } else {
                                    dx /= len;
                                    dy /= len;
                                }
                                obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                    } else {
                        if(0 < ((signx * oH) + (signy * oV))) {
                            return Phaser.Physics.Circle.COL_NONE;
                        } else {
                            var vx = t.pos.x + (oH * t.xw);
                            var vy = t.pos.y + (oV * t.yw);
                            var dx = obj.pos.x - vx;
                            var dy = obj.pos.y - vy;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var pen = obj.radius - len;
                            if(0 < pen) {
                                if(len == 0) {
                                    dx = oH / Math.SQRT2;
                                    dy = oV / Math.SQRT2;
                                } else {
                                    dx /= len;
                                    dy /= len;
                                }
                                obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return CircleConcave;
            })();
            Projection.CircleConcave = CircleConcave;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var CircleConvex = (function () {
                function CircleConvex() { }
                CircleConvex.Collide = function Collide(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var lenP;
                    if(oH == 0) {
                        if(oV == 0) {
                            var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                            var twid = t.xw * 2;
                            var trad = Math.sqrt(twid * twid + 0);
                            var len = Math.sqrt(ox * ox + oy * oy);
                            var pen = (trad + obj.radius) - len;
                            if(0 < pen) {
                                if(x < y) {
                                    lenP = x;
                                    y = 0;
                                    if((obj.pos.x - t.pos.x) < 0) {
                                        x *= -1;
                                    }
                                } else {
                                    lenP = y;
                                    x = 0;
                                    if((obj.pos.y - t.pos.y) < 0) {
                                        y *= -1;
                                    }
                                }
                                if(lenP < pen) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            if((signy * oV) < 0) {
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                                var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                                var twid = t.xw * 2;
                                var trad = Math.sqrt(twid * twid + 0);
                                var len = Math.sqrt(ox * ox + oy * oy);
                                var pen = (trad + obj.radius) - len;
                                if(0 < pen) {
                                    ox /= len;
                                    oy /= len;
                                    obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        }
                    } else if(oV == 0) {
                        if((signx * oH) < 0) {
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        } else {
                            var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                            var twid = t.xw * 2;
                            var trad = Math.sqrt(twid * twid + 0);
                            var len = Math.sqrt(ox * ox + oy * oy);
                            var pen = (trad + obj.radius) - len;
                            if(0 < pen) {
                                ox /= len;
                                oy /= len;
                                obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                    } else {
                        if(0 < ((signx * oH) + (signy * oV))) {
                            var ox = obj.pos.x - (t.pos.x - (signx * t.xw));
                            var oy = obj.pos.y - (t.pos.y - (signy * t.yw));
                            var twid = t.xw * 2;
                            var trad = Math.sqrt(twid * twid + 0);
                            var len = Math.sqrt(ox * ox + oy * oy);
                            var pen = (trad + obj.radius) - len;
                            if(0 < pen) {
                                ox /= len;
                                oy /= len;
                                obj.reportCollisionVsWorld(ox * pen, oy * pen, ox, oy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        } else {
                            var vx = t.pos.x + (oH * t.xw);
                            var vy = t.pos.y + (oV * t.yw);
                            var dx = obj.pos.x - vx;
                            var dy = obj.pos.y - vy;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var pen = obj.radius - len;
                            if(0 < pen) {
                                if(len == 0) {
                                    dx = oH / Math.SQRT2;
                                    dy = oV / Math.SQRT2;
                                } else {
                                    dx /= len;
                                    dy /= len;
                                }
                                obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                return Phaser.Physics.Circle.COL_OTHER;
                            }
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return CircleConvex;
            })();
            Projection.CircleConvex = CircleConvex;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var CircleFull = (function () {
                function CircleFull() { }
                CircleFull.Collide = function Collide(x, y, oH, oV, obj, t) {
                    if(oH == 0) {
                        if(oV == 0) {
                            if(x < y) {
                                var dx = obj.pos.x - t.pos.x;
                                if(dx < 0) {
                                    obj.reportCollisionVsWorld(-x, 0, -1, 0, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(x, 0, 1, 0, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                }
                            } else {
                                var dy = obj.pos.y - t.pos.y;
                                if(dy < 0) {
                                    obj.reportCollisionVsWorld(0, -y, 0, -1, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(0, y, 0, 1, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                }
                            }
                        } else {
                            obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                    } else if(oV == 0) {
                        obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                        return Phaser.Physics.Circle.COL_AXIS;
                    } else {
                        var vx = t.pos.x + (oH * t.xw);
                        var vy = t.pos.y + (oV * t.yw);
                        var dx = obj.pos.x - vx;
                        var dy = obj.pos.y - vy;
                        var len = Math.sqrt(dx * dx + dy * dy);
                        var pen = obj.radius - len;
                        if(0 < pen) {
                            if(len == 0) {
                                dx = oH / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            } else {
                                dx /= len;
                                dy /= len;
                            }
                            obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return CircleFull;
            })();
            Projection.CircleFull = CircleFull;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Physics) {
        (function (Projection) {
            var CircleHalf = (function () {
                function CircleHalf() { }
                CircleHalf.Collide = function Collide(x, y, oH, oV, obj, t) {
                    var signx = t.signx;
                    var signy = t.signy;
                    var celldp = (oH * signx + oV * signy);
                    if(0 < celldp) {
                        return Phaser.Physics.Circle.COL_NONE;
                    } else if(oH == 0) {
                        if(oV == 0) {
                            var r = obj.radius;
                            var ox = (obj.pos.x - (signx * r)) - t.pos.x;
                            var oy = (obj.pos.y - (signy * r)) - t.pos.y;
                            var sx = signx;
                            var sy = signy;
                            var dp = (ox * sx) + (oy * sy);
                            if(dp < 0) {
                                sx *= -dp;
                                sy *= -dp;
                                var lenN = Math.sqrt(sx * sx + sy * sy);
                                var lenP = Math.sqrt(x * x + y * y);
                                if(lenP < lenN) {
                                    obj.reportCollisionVsWorld(x, y, x / lenP, y / lenP, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    obj.reportCollisionVsWorld(sx, sy, t.signx, t.signy);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            if(celldp == 0) {
                                var r = obj.radius;
                                var dx = obj.pos.x - t.pos.x;
                                if((dx * signx) < 0) {
                                    obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                    return Phaser.Physics.Circle.COL_AXIS;
                                } else {
                                    var dy = obj.pos.y - (t.pos.y + oV * t.yw);
                                    var len = Math.sqrt(dx * dx + dy * dy);
                                    var pen = obj.radius - len;
                                    if(0 < pen) {
                                        if(len == 0) {
                                            dx = signx / Math.SQRT2;
                                            dy = oV / Math.SQRT2;
                                        } else {
                                            dx /= len;
                                            dy /= len;
                                        }
                                        obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                        return Phaser.Physics.Circle.COL_OTHER;
                                    }
                                }
                            } else {
                                obj.reportCollisionVsWorld(0, y * oV, 0, oV, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            }
                        }
                    } else if(oV == 0) {
                        if(celldp == 0) {
                            var r = obj.radius;
                            var dy = obj.pos.y - t.pos.y;
                            if((dy * signy) < 0) {
                                obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                                return Phaser.Physics.Circle.COL_AXIS;
                            } else {
                                var dx = obj.pos.x - (t.pos.x + oH * t.xw);
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var pen = obj.radius - len;
                                if(0 < pen) {
                                    if(len == 0) {
                                        dx = signx / Math.SQRT2;
                                        dy = oV / Math.SQRT2;
                                    } else {
                                        dx /= len;
                                        dy /= len;
                                    }
                                    obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                                    return Phaser.Physics.Circle.COL_OTHER;
                                }
                            }
                        } else {
                            obj.reportCollisionVsWorld(x * oH, 0, oH, 0, t);
                            return Phaser.Physics.Circle.COL_AXIS;
                        }
                    } else {
                        var vx = t.pos.x + (oH * t.xw);
                        var vy = t.pos.y + (oV * t.yw);
                        var dx = obj.pos.x - vx;
                        var dy = obj.pos.y - vy;
                        var len = Math.sqrt(dx * dx + dy * dy);
                        var pen = obj.radius - len;
                        if(0 < pen) {
                            if(len == 0) {
                                dx = oH / Math.SQRT2;
                                dy = oV / Math.SQRT2;
                            } else {
                                dx /= len;
                                dy /= len;
                            }
                            obj.reportCollisionVsWorld(dx * pen, dy * pen, dx, dy, t);
                            return Phaser.Physics.Circle.COL_OTHER;
                        }
                    }
                    return Phaser.Physics.Circle.COL_NONE;
                };
                return CircleHalf;
            })();
            Projection.CircleHalf = CircleHalf;            
        })(Physics.Projection || (Physics.Projection = {}));
        var Projection = Physics.Projection;
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Components) {
        var Events = (function () {
            function Events(parent) {
                this.game = parent.game;
                this._parent = parent;
                this.onAddedToGroup = new Phaser.Signal();
                this.onRemovedFromGroup = new Phaser.Signal();
                this.onKilled = new Phaser.Signal();
                this.onRevived = new Phaser.Signal();
                this.onOutOfBounds = new Phaser.Signal();
            }
            return Events;
        })();
        Components.Events = Events;        
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Sprite = (function () {
        function Sprite(game, x, y, key, frame) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof key === "undefined") { key = null; }
            if (typeof frame === "undefined") { frame = null; }
            this.modified = false;
            this.x = 0;
            this.y = 0;
            this.z = -1;
            this.renderOrderID = 0;
            this.game = game;
            this.type = Phaser.Types.SPRITE;
            this.exists = true;
            this.active = true;
            this.visible = true;
            this.alive = true;
            this.x = x;
            this.y = y;
            this.z = -1;
            this.group = null;
            this.name = '';
            this.events = new Phaser.Components.Events(this);
            this.animations = new Phaser.Components.AnimationManager(this);
            this.input = new Phaser.Components.InputHandler(this);
            this.texture = new Phaser.Display.Texture(this);
            this.transform = new Phaser.Components.TransformManager(this);
            if(key !== null) {
                this.texture.loadImage(key, false);
            } else {
                this.texture.opaque = true;
            }
            if(frame !== null) {
                if(typeof frame == 'string') {
                    this.frameName = frame;
                } else {
                    this.frame = frame;
                }
            }
            this.worldView = new Phaser.Rectangle(x, y, this.width, this.height);
            this.cameraView = new Phaser.Rectangle(x, y, this.width, this.height);
            this.transform.setCache();
            this.body = new Phaser.Physics.Body(this, 0);
            this.outOfBounds = false;
            this.outOfBoundsAction = Phaser.Types.OUT_OF_BOUNDS_PERSIST;
            this.scale = this.transform.scale;
            this.alpha = this.texture.alpha;
            this.origin = this.transform.origin;
            this.crop = this.texture.crop;
        }
        Object.defineProperty(Sprite.prototype, "rotation", {
            get: function () {
                return this.transform.rotation;
            },
            set: function (value) {
                this.transform.rotation = this.game.math.wrap(value, 360, 0);
                if(this.body) {
                }
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.bringToTop = function () {
            if(this.group) {
                this.group.bringToTop(this);
            }
        };
        Object.defineProperty(Sprite.prototype, "alpha", {
            get: function () {
                return this.texture.alpha;
            },
            set: function (value) {
                this.texture.alpha = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "frame", {
            get: function () {
                return this.animations.frame;
            },
            set: function (value) {
                this.animations.frame = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "frameName", {
            get: function () {
                return this.animations.frameName;
            },
            set: function (value) {
                this.animations.frameName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "width", {
            get: function () {
                return this.texture.width * this.transform.scale.x;
            },
            set: function (value) {
                this.transform.scale.x = value / this.texture.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "height", {
            get: function () {
                return this.texture.height * this.transform.scale.y;
            },
            set: function (value) {
                this.transform.scale.y = value / this.texture.height;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.preUpdate = function () {
            this.transform.update();
            if(this.transform.scrollFactor.x != 1 && this.transform.scrollFactor.x != 0) {
                this.worldView.x = (this.x * this.transform.scrollFactor.x) - (this.width * this.transform.origin.x);
            } else {
                this.worldView.x = this.x - (this.width * this.transform.origin.x);
            }
            if(this.transform.scrollFactor.y != 1 && this.transform.scrollFactor.y != 0) {
                this.worldView.y = (this.y * this.transform.scrollFactor.y) - (this.height * this.transform.origin.y);
            } else {
                this.worldView.y = this.y - (this.height * this.transform.origin.y);
            }
            this.worldView.width = this.width;
            this.worldView.height = this.height;
            if(this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }
        };
        Sprite.prototype.update = function () {
        };
        Sprite.prototype.postUpdate = function () {
            this.animations.update();
            this.checkBounds();
            if(this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }
        };
        Sprite.prototype.checkBounds = function () {
            if(Phaser.RectangleUtils.intersects(this.worldView, this.game.world.bounds)) {
                this.outOfBounds = false;
            } else {
                if(this.outOfBounds == false) {
                    this.events.onOutOfBounds.dispatch(this);
                }
                this.outOfBounds = true;
                if(this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_KILL) {
                    this.kill();
                } else if(this.outOfBoundsAction == Phaser.Types.OUT_OF_BOUNDS_DESTROY) {
                    this.destroy();
                }
            }
        };
        Sprite.prototype.destroy = function () {
            this.input.destroy();
        };
        Sprite.prototype.kill = function (removeFromGroup) {
            if (typeof removeFromGroup === "undefined") { removeFromGroup = false; }
            this.alive = false;
            this.exists = false;
            if(removeFromGroup && this.group) {
            }
            this.events.onKilled.dispatch(this);
        };
        Sprite.prototype.revive = function () {
            this.alive = true;
            this.exists = true;
            this.events.onRevived.dispatch(this);
        };
        return Sprite;
    })();
    Phaser.Sprite = Sprite;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Components) {
        var TransformManager = (function () {
            function TransformManager(parent) {
                this._dirty = false;
                this.rotationOffset = 0;
                this.rotation = 0;
                this.game = parent.game;
                this.parent = parent;
                this.local = new Phaser.Mat3();
                this.scrollFactor = new Phaser.Vec2(1, 1);
                this.origin = new Phaser.Vec2();
                this.scale = new Phaser.Vec2(1, 1);
                this.skew = new Phaser.Vec2();
                this.center = new Phaser.Point();
                this.upperLeft = new Phaser.Point();
                this.upperRight = new Phaser.Point();
                this.bottomLeft = new Phaser.Point();
                this.bottomRight = new Phaser.Point();
                this._pos = new Phaser.Point();
                this._scale = new Phaser.Point();
                this._size = new Phaser.Point();
                this._halfSize = new Phaser.Point();
                this._offset = new Phaser.Point();
                this._origin = new Phaser.Point();
                this._sc = new Phaser.Point();
                this._scA = new Phaser.Point();
            }
            Object.defineProperty(TransformManager.prototype, "distance", {
                get: function () {
                    return this._distance;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformManager.prototype, "angleToCenter", {
                get: function () {
                    return this._angle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformManager.prototype, "offsetX", {
                get: function () {
                    return this._offset.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformManager.prototype, "offsetY", {
                get: function () {
                    return this._offset.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformManager.prototype, "halfWidth", {
                get: function () {
                    return this._halfSize.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformManager.prototype, "halfHeight", {
                get: function () {
                    return this._halfSize.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformManager.prototype, "sin", {
                get: function () {
                    return this._sc.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformManager.prototype, "cos", {
                get: function () {
                    return this._sc.y;
                },
                enumerable: true,
                configurable: true
            });
            TransformManager.prototype.centerOn = function (x, y) {
                this.parent.x = x + (this.parent.x - this.center.x);
                this.parent.y = y + (this.parent.y - this.center.y);
            };
            TransformManager.prototype.setCache = function () {
                this._pos.x = this.parent.x;
                this._pos.y = this.parent.y;
                this._halfSize.x = this.parent.width / 2;
                this._halfSize.y = this.parent.height / 2;
                this._offset.x = this.origin.x * this.parent.width;
                this._offset.y = this.origin.y * this.parent.height;
                this._angle = Math.atan2(this.halfHeight - this._offset.x, this.halfWidth - this._offset.y);
                this._distance = Math.sqrt(((this._offset.x - this._halfSize.x) * (this._offset.x - this._halfSize.x)) + ((this._offset.y - this._halfSize.y) * (this._offset.y - this._halfSize.y)));
                this._size.x = this.parent.width;
                this._size.y = this.parent.height;
                this._origin.x = this.origin.x;
                this._origin.y = this.origin.y;
                this._scA.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                this._scA.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                this._prevRotation = this.rotation;
                if(this.parent.texture && this.parent.texture.renderRotation) {
                    this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                } else {
                    this._sc.x = 0;
                    this._sc.y = 1;
                }
                this.center.x = this.parent.x + this._distance * this._scA.y;
                this.center.y = this.parent.y + this._distance * this._scA.x;
                this.upperLeft.setTo(this.center.x - this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.upperRight.setTo(this.center.x + this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                this.bottomLeft.setTo(this.center.x - this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                this.bottomRight.setTo(this.center.x + this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                this._pos.x = this.parent.x;
                this._pos.y = this.parent.y;
                this._flippedX = this.parent.texture.flippedX;
                this._flippedY = this.parent.texture.flippedY;
            };
            TransformManager.prototype.update = function () {
                this._dirty = false;
                if(this.parent.width !== this._size.x || this.parent.height !== this._size.y || this.origin.x !== this._origin.x || this.origin.y !== this._origin.y) {
                    this._halfSize.x = this.parent.width / 2;
                    this._halfSize.y = this.parent.height / 2;
                    this._offset.x = this.origin.x * this.parent.width;
                    this._offset.y = this.origin.y * this.parent.height;
                    this._angle = Math.atan2(this.halfHeight - this._offset.y, this.halfWidth - this._offset.x);
                    this._distance = Math.sqrt(((this._offset.x - this._halfSize.x) * (this._offset.x - this._halfSize.x)) + ((this._offset.y - this._halfSize.y) * (this._offset.y - this._halfSize.y)));
                    this._size.x = this.parent.width;
                    this._size.y = this.parent.height;
                    this._origin.x = this.origin.x;
                    this._origin.y = this.origin.y;
                    this._dirty = true;
                }
                if(this.rotation != this._prevRotation || this._dirty) {
                    this._scA.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                    this._scA.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD + this._angle);
                    if(this.parent.texture.renderRotation) {
                        this._sc.x = Math.sin((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                        this._sc.y = Math.cos((this.rotation + this.rotationOffset) * Phaser.GameMath.DEG_TO_RAD);
                    } else {
                        this._sc.x = 0;
                        this._sc.y = 1;
                    }
                    this._prevRotation = this.rotation;
                    this._dirty = true;
                }
                if(this._dirty || this.parent.x != this._pos.x || this.parent.y != this._pos.y) {
                    this.center.x = this.parent.x + this._distance * this._scA.y;
                    this.center.y = this.parent.y + this._distance * this._scA.x;
                    this.upperLeft.setTo(this.center.x - this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                    this.upperRight.setTo(this.center.x + this._halfSize.x * this._sc.y + this._halfSize.y * this._sc.x, this.center.y - this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                    this.bottomLeft.setTo(this.center.x - this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y - this._halfSize.x * this._sc.x);
                    this.bottomRight.setTo(this.center.x + this._halfSize.x * this._sc.y - this._halfSize.y * this._sc.x, this.center.y + this._halfSize.y * this._sc.y + this._halfSize.x * this._sc.x);
                    this._pos.x = this.parent.x;
                    this._pos.y = this.parent.y;
                    this.local.data[2] = this.parent.x;
                    this.local.data[5] = this.parent.y;
                }
                if(this._dirty || this._flippedX != this.parent.texture.flippedX) {
                    this._flippedX = this.parent.texture.flippedX;
                    if(this._flippedX) {
                        this.local.data[0] = this._sc.y * -this.scale.x;
                        this.local.data[3] = (this._sc.x * -this.scale.x) + this.skew.x;
                    } else {
                        this.local.data[0] = this._sc.y * this.scale.x;
                        this.local.data[3] = (this._sc.x * this.scale.x) + this.skew.x;
                    }
                }
                if(this._dirty || this._flippedY != this.parent.texture.flippedY) {
                    this._flippedY = this.parent.texture.flippedY;
                    if(this._flippedY) {
                        this.local.data[4] = this._sc.y * -this.scale.y;
                        this.local.data[1] = -(this._sc.x * -this.scale.y) + this.skew.y;
                    } else {
                        this.local.data[4] = this._sc.y * this.scale.y;
                        this.local.data[1] = -(this._sc.x * this.scale.y) + this.skew.y;
                    }
                }
            };
            return TransformManager;
        })();
        Components.TransformManager = TransformManager;        
    })(Phaser.Components || (Phaser.Components = {}));
    var Components = Phaser.Components;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var ScrollRegion = (function () {
        function ScrollRegion(x, y, width, height, speedX, speedY) {
            this._anchorWidth = 0;
            this._anchorHeight = 0;
            this._inverseWidth = 0;
            this._inverseHeight = 0;
            this.visible = true;
            this._A = new Phaser.Rectangle(x, y, width, height);
            this._B = new Phaser.Rectangle(x, y, width, height);
            this._C = new Phaser.Rectangle(x, y, width, height);
            this._D = new Phaser.Rectangle(x, y, width, height);
            this._scroll = new Phaser.Vec2();
            this._bounds = new Phaser.Rectangle(x, y, width, height);
            this.scrollSpeed = new Phaser.Vec2(speedX, speedY);
        }
        ScrollRegion.prototype.update = function (delta) {
            this._scroll.x += this.scrollSpeed.x;
            this._scroll.y += this.scrollSpeed.y;
            if(this._scroll.x > this._bounds.right) {
                this._scroll.x = this._bounds.x;
            }
            if(this._scroll.x < this._bounds.x) {
                this._scroll.x = this._bounds.right;
            }
            if(this._scroll.y > this._bounds.bottom) {
                this._scroll.y = this._bounds.y;
            }
            if(this._scroll.y < this._bounds.y) {
                this._scroll.y = this._bounds.bottom;
            }
            this._anchorWidth = (this._bounds.width - this._scroll.x) + this._bounds.x;
            this._anchorHeight = (this._bounds.height - this._scroll.y) + this._bounds.y;
            if(this._anchorWidth > this._bounds.width) {
                this._anchorWidth = this._bounds.width;
            }
            if(this._anchorHeight > this._bounds.height) {
                this._anchorHeight = this._bounds.height;
            }
            this._inverseWidth = this._bounds.width - this._anchorWidth;
            this._inverseHeight = this._bounds.height - this._anchorHeight;
            this._A.setTo(this._scroll.x, this._scroll.y, this._anchorWidth, this._anchorHeight);
            this._B.y = this._scroll.y;
            this._B.width = this._inverseWidth;
            this._B.height = this._anchorHeight;
            this._C.x = this._scroll.x;
            this._C.width = this._anchorWidth;
            this._C.height = this._inverseHeight;
            this._D.width = this._inverseWidth;
            this._D.height = this._inverseHeight;
        };
        ScrollRegion.prototype.render = function (context, texture, dx, dy, dw, dh) {
            if(this.visible == false) {
                return;
            }
            this.crop(context, texture, this._A.x, this._A.y, this._A.width, this._A.height, dx, dy, dw, dh, 0, 0);
            this.crop(context, texture, this._B.x, this._B.y, this._B.width, this._B.height, dx, dy, dw, dh, this._A.width, 0);
            this.crop(context, texture, this._C.x, this._C.y, this._C.width, this._C.height, dx, dy, dw, dh, 0, this._A.height);
            this.crop(context, texture, this._D.x, this._D.y, this._D.width, this._D.height, dx, dy, dw, dh, this._C.width, this._A.height);
        };
        ScrollRegion.prototype.crop = function (context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY) {
            offsetX += destX;
            offsetY += destY;
            if(srcW > (destX + destW) - offsetX) {
                srcW = (destX + destW) - offsetX;
            }
            if(srcH > (destY + destH) - offsetY) {
                srcH = (destY + destH) - offsetY;
            }
            srcX = Math.floor(srcX);
            srcY = Math.floor(srcY);
            srcW = Math.floor(srcW);
            srcH = Math.floor(srcH);
            offsetX = Math.floor(offsetX + this._bounds.x);
            offsetY = Math.floor(offsetY + this._bounds.y);
            if(srcW > 0 && srcH > 0) {
                context.drawImage(texture, srcX, srcY, srcW, srcH, offsetX, offsetY, srcW, srcH);
            }
        };
        return ScrollRegion;
    })();
    Phaser.ScrollRegion = ScrollRegion;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var ScrollZone = (function (_super) {
        __extends(ScrollZone, _super);
        function ScrollZone(game, key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
                _super.call(this, game, x, y, key);
            this.type = Phaser.Types.SCROLLZONE;
            this.regions = [];
            if(this.texture.loaded) {
                if(width > this.width || height > this.height) {
                    this.createRepeatingTexture(width, height);
                    this.width = width;
                    this.height = height;
                }
                this.addRegion(0, 0, this.width, this.height);
                if((width < this.width || height < this.height) && width !== 0 && height !== 0) {
                    this.width = width;
                    this.height = height;
                }
            }
        }
        ScrollZone.prototype.addRegion = function (x, y, width, height, speedX, speedY) {
            if (typeof speedX === "undefined") { speedX = 0; }
            if (typeof speedY === "undefined") { speedY = 0; }
            if(x > this.width || y > this.height || x < 0 || y < 0 || (x + width) > this.width || (y + height) > this.height) {
                throw Error('Invalid ScrollRegion defined. Cannot be larger than parent ScrollZone');
                return null;
            }
            this.currentRegion = new Phaser.ScrollRegion(x, y, width, height, speedX, speedY);
            this.regions.push(this.currentRegion);
            return this.currentRegion;
        };
        ScrollZone.prototype.setSpeed = function (x, y) {
            if(this.currentRegion) {
                this.currentRegion.scrollSpeed.setTo(x, y);
            }
            return this;
        };
        ScrollZone.prototype.update = function () {
            for(var i = 0; i < this.regions.length; i++) {
                this.regions[i].update(this.game.time.delta);
            }
        };
        ScrollZone.prototype.createRepeatingTexture = function (regionWidth, regionHeight) {
            var tileWidth = Math.ceil(this.width / regionWidth) * regionWidth;
            var tileHeight = Math.ceil(this.height / regionHeight) * regionHeight;
            var dt = new Phaser.Display.DynamicTexture(this.game, tileWidth, tileHeight);
            dt.context.rect(0, 0, tileWidth, tileHeight);
            dt.context.fillStyle = dt.context.createPattern(this.texture.imageTexture, "repeat");
            dt.context.fill();
            this.texture.loadDynamicTexture(dt);
        };
        return ScrollZone;
    })(Phaser.Sprite);
    Phaser.ScrollZone = ScrollZone;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var GameObjectFactory = (function () {
        function GameObjectFactory(game) {
            this.game = game;
            this._world = this.game.world;
        }
        GameObjectFactory.prototype.camera = function (x, y, width, height) {
            return this._world.cameras.addCamera(x, y, width, height);
        };
        GameObjectFactory.prototype.button = function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof key === "undefined") { key = null; }
            if (typeof callback === "undefined") { callback = null; }
            if (typeof callbackContext === "undefined") { callbackContext = null; }
            if (typeof overFrame === "undefined") { overFrame = null; }
            if (typeof outFrame === "undefined") { outFrame = null; }
            if (typeof downFrame === "undefined") { downFrame = null; }
            return this._world.group.add(new Phaser.UI.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));
        };
        GameObjectFactory.prototype.sprite = function (x, y, key, frame) {
            if (typeof key === "undefined") { key = ''; }
            if (typeof frame === "undefined") { frame = null; }
            return this._world.group.add(new Phaser.Sprite(this.game, x, y, key, frame));
        };
        GameObjectFactory.prototype.audio = function (key, volume, loop) {
            if (typeof volume === "undefined") { volume = 1; }
            if (typeof loop === "undefined") { loop = false; }
            return this.game.sound.add(key, volume, loop);
        };
        GameObjectFactory.prototype.circle = function (x, y, radius) {
            return new Phaser.Physics.Circle(this.game, x, y, radius);
        };
        GameObjectFactory.prototype.aabb = function (x, y, width, height) {
            return new Phaser.Physics.AABB(this.game, x, y, Math.floor(width / 2), Math.floor(height / 2));
        };
        GameObjectFactory.prototype.cell = function (x, y, width, height, state) {
            if (typeof state === "undefined") { state = Phaser.Physics.TileMapCell.TID_FULL; }
            return new Phaser.Physics.TileMapCell(this.game, x, y, width, height).SetState(state);
        };
        GameObjectFactory.prototype.dynamicTexture = function (width, height) {
            return new Phaser.Display.DynamicTexture(this.game, width, height);
        };
        GameObjectFactory.prototype.group = function (maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            return this._world.group.add(new Phaser.Group(this.game, maxSize));
        };
        GameObjectFactory.prototype.scrollZone = function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this._world.group.add(new Phaser.ScrollZone(this.game, key, x, y, width, height));
        };
        GameObjectFactory.prototype.tilemap = function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this._world.group.add(new Phaser.Tilemap(this.game, key, mapData, format, resizeWorld, tileWidth, tileHeight));
        };
        GameObjectFactory.prototype.tween = function (obj, localReference) {
            if (typeof localReference === "undefined") { localReference = false; }
            return this.game.tweens.create(obj, localReference);
        };
        GameObjectFactory.prototype.existingSprite = function (sprite) {
            return this._world.group.add(sprite);
        };
        GameObjectFactory.prototype.existingGroup = function (group) {
            return this._world.group.add(group);
        };
        GameObjectFactory.prototype.existingButton = function (button) {
            return this._world.group.add(button);
        };
        GameObjectFactory.prototype.existingScrollZone = function (scrollZone) {
            return this._world.group.add(scrollZone);
        };
        GameObjectFactory.prototype.existingTilemap = function (tilemap) {
            return this._world.group.add(tilemap);
        };
        GameObjectFactory.prototype.existingTween = function (tween) {
            return this.game.tweens.add(tween);
        };
        return GameObjectFactory;
    })();
    Phaser.GameObjectFactory = GameObjectFactory;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (UI) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof key === "undefined") { key = null; }
                if (typeof callback === "undefined") { callback = null; }
                if (typeof callbackContext === "undefined") { callbackContext = null; }
                if (typeof overFrame === "undefined") { overFrame = null; }
                if (typeof outFrame === "undefined") { outFrame = null; }
                if (typeof downFrame === "undefined") { downFrame = null; }
                        _super.call(this, game, x, y, key, outFrame);
                this._onOverFrameName = null;
                this._onOutFrameName = null;
                this._onDownFrameName = null;
                this._onUpFrameName = null;
                this._onOverFrameID = null;
                this._onOutFrameID = null;
                this._onDownFrameID = null;
                this._onUpFrameID = null;
                this.type = Phaser.Types.BUTTON;
                if(typeof overFrame == 'string') {
                    this._onOverFrameName = overFrame;
                } else {
                    this._onOverFrameID = overFrame;
                }
                if(typeof outFrame == 'string') {
                    this._onOutFrameName = outFrame;
                    this._onUpFrameName = outFrame;
                } else {
                    this._onOutFrameID = outFrame;
                    this._onUpFrameID = outFrame;
                }
                if(typeof downFrame == 'string') {
                    this._onDownFrameName = downFrame;
                } else {
                    this._onDownFrameID = downFrame;
                }
                this.onInputOver = new Phaser.Signal();
                this.onInputOut = new Phaser.Signal();
                this.onInputDown = new Phaser.Signal();
                this.onInputUp = new Phaser.Signal();
                if(callback) {
                    this.onInputUp.add(callback, callbackContext);
                }
                this.input.start(0, false, true);
                this.events.onInputOver.add(this.onInputOverHandler, this);
                this.events.onInputOut.add(this.onInputOutHandler, this);
                this.events.onInputDown.add(this.onInputDownHandler, this);
                this.events.onInputUp.add(this.onInputUpHandler, this);
            }
            Button.prototype.onInputOverHandler = function (pointer) {
                if(this._onOverFrameName != null) {
                    this.frameName = this._onOverFrameName;
                } else if(this._onOverFrameID != null) {
                    this.frame = this._onOverFrameID;
                }
                if(this.onInputOver) {
                    this.onInputOver.dispatch(this, pointer);
                }
            };
            Button.prototype.onInputOutHandler = function (pointer) {
                if(this._onOutFrameName != null) {
                    this.frameName = this._onOutFrameName;
                } else if(this._onOutFrameID != null) {
                    this.frame = this._onOutFrameID;
                }
                if(this.onInputOut) {
                    this.onInputOut.dispatch(this, pointer);
                }
            };
            Button.prototype.onInputDownHandler = function (pointer) {
                if(this._onDownFrameName != null) {
                    this.frameName = this._onDownFrameName;
                } else if(this._onDownFrameID != null) {
                    this.frame = this._onDownFrameID;
                }
                if(this.onInputDown) {
                    this.onInputDown.dispatch(this, pointer);
                }
            };
            Button.prototype.onInputUpHandler = function (pointer) {
                if(this._onUpFrameName != null) {
                    this.frameName = this._onUpFrameName;
                } else if(this._onUpFrameID != null) {
                    this.frame = this._onUpFrameID;
                }
                if(this.onInputUp) {
                    this.onInputUp.dispatch(this, pointer);
                }
            };
            Object.defineProperty(Button.prototype, "priorityID", {
                get: function () {
                    return this.input.priorityID;
                },
                set: function (value) {
                    this.input.priorityID = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "useHandCursor", {
                get: function () {
                    return this.input.useHandCursor;
                },
                set: function (value) {
                    this.input.useHandCursor = value;
                },
                enumerable: true,
                configurable: true
            });
            return Button;
        })(Phaser.Sprite);
        UI.Button = Button;        
    })(Phaser.UI || (Phaser.UI = {}));
    var UI = Phaser.UI;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var CanvasUtils = (function () {
        function CanvasUtils() { }
        CanvasUtils.getAspectRatio = function getAspectRatio(canvas) {
            return canvas.width / canvas.height;
        };
        CanvasUtils.setBackgroundColor = function setBackgroundColor(canvas, color) {
            if (typeof color === "undefined") { color = 'rgb(0,0,0)'; }
            canvas.style.backgroundColor = color;
            return canvas;
        };
        CanvasUtils.setTouchAction = function setTouchAction(canvas, value) {
            if (typeof value === "undefined") { value = 'none'; }
            canvas.style.msTouchAction = value;
            canvas.style['ms-touch-action'] = value;
            canvas.style['touch-action'] = value;
            return canvas;
        };
        CanvasUtils.addToDOM = function addToDOM(canvas, parent, overflowHidden) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof overflowHidden === "undefined") { overflowHidden = true; }
            if((parent !== '' || parent !== null) && document.getElementById(parent)) {
                document.getElementById(parent).appendChild(canvas);
                if(overflowHidden) {
                    document.getElementById(parent).style.overflow = 'hidden';
                }
            } else {
                document.body.appendChild(canvas);
            }
            return canvas;
        };
        CanvasUtils.setTransform = function setTransform(context, translateX, translateY, scaleX, scaleY, skewX, skewY) {
            context.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
            return context;
        };
        CanvasUtils.setSmoothingEnabled = function setSmoothingEnabled(context, value) {
            context['imageSmoothingEnabled'] = value;
            context['mozImageSmoothingEnabled'] = value;
            context['oImageSmoothingEnabled'] = value;
            context['webkitImageSmoothingEnabled'] = value;
            context['msImageSmoothingEnabled'] = value;
            return context;
        };
        CanvasUtils.setImageRenderingCrisp = function setImageRenderingCrisp(canvas) {
            canvas.style['image-rendering'] = 'crisp-edges';
            canvas.style['image-rendering'] = '-moz-crisp-edges';
            canvas.style['image-rendering'] = '-webkit-optimize-contrast';
            canvas.style.msInterpolationMode = 'nearest-neighbor';
            return canvas;
        };
        CanvasUtils.setImageRenderingBicubic = function setImageRenderingBicubic(canvas) {
            canvas.style['image-rendering'] = 'auto';
            canvas.style.msInterpolationMode = 'bicubic';
            return canvas;
        };
        return CanvasUtils;
    })();
    Phaser.CanvasUtils = CanvasUtils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var CircleUtils = (function () {
        function CircleUtils() { }
        CircleUtils.clone = function clone(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Circle(); }
            return out.setTo(a.x, a.y, a.diameter);
        };
        CircleUtils.contains = function contains(a, x, y) {
            if(x >= a.left && x <= a.right && y >= a.top && y <= a.bottom) {
                var dx = (a.x - x) * (a.x - x);
                var dy = (a.y - y) * (a.y - y);
                return (dx + dy) <= (a.radius * a.radius);
            }
            return false;
        };
        CircleUtils.containsPoint = function containsPoint(a, point) {
            return CircleUtils.contains(a, point.x, point.y);
        };
        CircleUtils.containsCircle = function containsCircle(a, b) {
            return true;
        };
        CircleUtils.distanceBetween = function distanceBetween(a, target, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = a.x - target.x;
            var dy = a.y - target.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        CircleUtils.equals = function equals(a, b) {
            return (a.x == b.x && a.y == b.y && a.diameter == b.diameter);
        };
        CircleUtils.intersects = function intersects(a, b) {
            return (Phaser.CircleUtils.distanceBetween(a, b) <= (a.radius + b.radius));
        };
        CircleUtils.circumferencePoint = function circumferencePoint(a, angle, asDegrees, out) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            if(asDegrees === true) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }
            return out.setTo(a.x + a.radius * Math.cos(angle), a.y + a.radius * Math.sin(angle));
        };
        CircleUtils.intersectsRectangle = function intersectsRectangle(c, r) {
            var cx = Math.abs(c.x - r.x - r.halfWidth);
            var xDist = r.halfWidth + c.radius;
            if(cx > xDist) {
                return false;
            }
            var cy = Math.abs(c.y - r.y - r.halfHeight);
            var yDist = r.halfHeight + c.radius;
            if(cy > yDist) {
                return false;
            }
            if(cx <= r.halfWidth || cy <= r.halfHeight) {
                return true;
            }
            var xCornerDist = cx - r.halfWidth;
            var yCornerDist = cy - r.halfHeight;
            var xCornerDistSq = xCornerDist * xCornerDist;
            var yCornerDistSq = yCornerDist * yCornerDist;
            var maxCornerDistSq = c.radius * c.radius;
            return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
        };
        return CircleUtils;
    })();
    Phaser.CircleUtils = CircleUtils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var ColorUtils = (function () {
        function ColorUtils() { }
        ColorUtils.getColor32 = function getColor32(alpha, red, green, blue) {
            return alpha << 24 | red << 16 | green << 8 | blue;
        };
        ColorUtils.getColor = function getColor(red, green, blue) {
            return red << 16 | green << 8 | blue;
        };
        ColorUtils.getHSVColorWheel = function getHSVColorWheel(alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var colors = [];
            for(var c = 0; c <= 359; c++) {
                colors[c] = Phaser.ColorUtils.getWebRGB(Phaser.ColorUtils.HSVtoRGB(c, 1.0, 1.0, alpha));
            }
            return colors;
        };
        ColorUtils.hexToRGB = function hexToRGB(h) {
            var hex16 = (h.charAt(0) == "#") ? h.substring(1, 7) : h;
            var r = parseInt(hex16.substring(0, 2), 16);
            var g = parseInt(hex16.substring(2, 4), 16);
            var b = parseInt(hex16.substring(4, 6), 16);
            return {
                r: r,
                g: g,
                b: b
            };
        };
        ColorUtils.getComplementHarmony = function getComplementHarmony(color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);
            return Phaser.ColorUtils.HSVtoRGB(opposite, 1.0, 1.0);
        };
        ColorUtils.getAnalogousHarmony = function getAnalogousHarmony(color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            if(threshold > 359 || threshold < 0) {
                throw Error("Color Warning: Invalid threshold given to getAnalogousHarmony()");
            }
            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 359 - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, threshold, 359);
            return {
                color1: color,
                color2: Phaser.ColorUtils.HSVtoRGB(warmer, 1.0, 1.0),
                color3: Phaser.ColorUtils.HSVtoRGB(colder, 1.0, 1.0),
                hue1: hsv.hue,
                hue2: warmer,
                hue3: colder
            };
        };
        ColorUtils.getSplitComplementHarmony = function getSplitComplementHarmony(color, threshold) {
            if (typeof threshold === "undefined") { threshold = 30; }
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            if(threshold >= 359 || threshold <= 0) {
                throw Error("Phaser.ColorUtils Warning: Invalid threshold given to getSplitComplementHarmony()");
            }
            var opposite = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 180, 359);
            var warmer = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite - threshold, 359);
            var colder = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, opposite + threshold, 359);
            return {
                color1: color,
                color2: Phaser.ColorUtils.HSVtoRGB(warmer, hsv.saturation, hsv.value),
                color3: Phaser.ColorUtils.HSVtoRGB(colder, hsv.saturation, hsv.value),
                hue1: hsv.hue,
                hue2: warmer,
                hue3: colder
            };
        };
        ColorUtils.getTriadicHarmony = function getTriadicHarmony(color) {
            var hsv = Phaser.ColorUtils.RGBtoHSV(color);
            var triadic1 = Phaser.ColorUtils.game.math.wrapValue(hsv.hue, 120, 359);
            var triadic2 = Phaser.ColorUtils.game.math.wrapValue(triadic1, 120, 359);
            return {
                color1: color,
                color2: Phaser.ColorUtils.HSVtoRGB(triadic1, 1.0, 1.0),
                color3: Phaser.ColorUtils.HSVtoRGB(triadic2, 1.0, 1.0)
            };
        };
        ColorUtils.getColorInfo = function getColorInfo(color) {
            var argb = Phaser.ColorUtils.getRGB(color);
            var hsl = Phaser.ColorUtils.RGBtoHSV(color);
            var result = Phaser.ColorUtils.RGBtoHexstring(color) + "\n";
            result = result.concat("Alpha: " + argb.alpha + " Red: " + argb.red + " Green: " + argb.green + " Blue: " + argb.blue) + "\n";
            result = result.concat("Hue: " + hsl.hue + " Saturation: " + hsl.saturation + " Lightnes: " + hsl.lightness);
            return result;
        };
        ColorUtils.RGBtoHexstring = function RGBtoHexstring(color) {
            var argb = Phaser.ColorUtils.getRGB(color);
            return "0x" + Phaser.ColorUtils.colorToHexstring(argb.alpha) + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };
        ColorUtils.RGBtoWebstring = function RGBtoWebstring(color) {
            var argb = Phaser.ColorUtils.getRGB(color);
            return "#" + Phaser.ColorUtils.colorToHexstring(argb.red) + Phaser.ColorUtils.colorToHexstring(argb.green) + Phaser.ColorUtils.colorToHexstring(argb.blue);
        };
        ColorUtils.colorToHexstring = function colorToHexstring(color) {
            var digits = "0123456789ABCDEF";
            var lsd = color % 16;
            var msd = (color - lsd) / 16;
            var hexified = digits.charAt(msd) + digits.charAt(lsd);
            return hexified;
        };
        ColorUtils.HSVtoRGB = function HSVtoRGB(h, s, v, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var result;
            if(s == 0.0) {
                result = Phaser.ColorUtils.getColor32(alpha, v * 255, v * 255, v * 255);
            } else {
                h = h / 60.0;
                var f = h - Math.floor(h);
                var p = v * (1.0 - s);
                var q = v * (1.0 - s * f);
                var t = v * (1.0 - s * (1.0 - f));
                switch(Math.floor(h)) {
                    case 0:
                        result = Phaser.ColorUtils.getColor32(alpha, v * 255, t * 255, p * 255);
                        break;
                    case 1:
                        result = Phaser.ColorUtils.getColor32(alpha, q * 255, v * 255, p * 255);
                        break;
                    case 2:
                        result = Phaser.ColorUtils.getColor32(alpha, p * 255, v * 255, t * 255);
                        break;
                    case 3:
                        result = Phaser.ColorUtils.getColor32(alpha, p * 255, q * 255, v * 255);
                        break;
                    case 4:
                        result = Phaser.ColorUtils.getColor32(alpha, t * 255, p * 255, v * 255);
                        break;
                    case 5:
                        result = Phaser.ColorUtils.getColor32(alpha, v * 255, p * 255, q * 255);
                        break;
                    default:
                        throw new Error("Phaser.ColorUtils.HSVtoRGB : Unknown color");
                }
            }
            return result;
        };
        ColorUtils.RGBtoHSV = function RGBtoHSV(color) {
            var rgb = Phaser.ColorUtils.getRGB(color);
            var red = rgb.red / 255;
            var green = rgb.green / 255;
            var blue = rgb.blue / 255;
            var min = Math.min(red, green, blue);
            var max = Math.max(red, green, blue);
            var delta = max - min;
            var lightness = (max + min) / 2;
            var hue;
            var saturation;
            if(delta == 0) {
                hue = 0;
                saturation = 0;
            } else {
                if(lightness < 0.5) {
                    saturation = delta / (max + min);
                } else {
                    saturation = delta / (2 - max - min);
                }
                var delta_r = (((max - red) / 6) + (delta / 2)) / delta;
                var delta_g = (((max - green) / 6) + (delta / 2)) / delta;
                var delta_b = (((max - blue) / 6) + (delta / 2)) / delta;
                if(red == max) {
                    hue = delta_b - delta_g;
                } else if(green == max) {
                    hue = (1 / 3) + delta_r - delta_b;
                } else if(blue == max) {
                    hue = (2 / 3) + delta_g - delta_r;
                }
                if(hue < 0) {
                    hue += 1;
                }
                if(hue > 1) {
                    hue -= 1;
                }
            }
            hue *= 360;
            hue = Math.round(hue);
            return {
                hue: hue,
                saturation: saturation,
                lightness: lightness,
                value: lightness
            };
        };
        ColorUtils.interpolateColor = function interpolateColor(color1, color2, steps, currentStep, alpha) {
            if (typeof alpha === "undefined") { alpha = 255; }
            var src1 = Phaser.ColorUtils.getRGB(color1);
            var src2 = Phaser.ColorUtils.getRGB(color2);
            var r = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
            var g = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
            var b = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;
            return Phaser.ColorUtils.getColor32(alpha, r, g, b);
        };
        ColorUtils.interpolateColorWithRGB = function interpolateColorWithRGB(color, r, g, b, steps, currentStep) {
            var src = Phaser.ColorUtils.getRGB(color);
            var or = (((r - src.red) * currentStep) / steps) + src.red;
            var og = (((g - src.green) * currentStep) / steps) + src.green;
            var ob = (((b - src.blue) * currentStep) / steps) + src.blue;
            return Phaser.ColorUtils.getColor(or, og, ob);
        };
        ColorUtils.interpolateRGB = function interpolateRGB(r1, g1, b1, r2, g2, b2, steps, currentStep) {
            var r = (((r2 - r1) * currentStep) / steps) + r1;
            var g = (((g2 - g1) * currentStep) / steps) + g1;
            var b = (((b2 - b1) * currentStep) / steps) + b1;
            return Phaser.ColorUtils.getColor(r, g, b);
        };
        ColorUtils.getRandomColor = function getRandomColor(min, max, alpha) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 255; }
            if (typeof alpha === "undefined") { alpha = 255; }
            if(max > 255) {
                return Phaser.ColorUtils.getColor(255, 255, 255);
            }
            if(min > max) {
                return Phaser.ColorUtils.getColor(255, 255, 255);
            }
            var red = min + Math.round(Math.random() * (max - min));
            var green = min + Math.round(Math.random() * (max - min));
            var blue = min + Math.round(Math.random() * (max - min));
            return Phaser.ColorUtils.getColor32(alpha, red, green, blue);
        };
        ColorUtils.getRGB = function getRGB(color) {
            return {
                alpha: color >>> 24,
                red: color >> 16 & 0xFF,
                green: color >> 8 & 0xFF,
                blue: color & 0xFF
            };
        };
        ColorUtils.getWebRGB = function getWebRGB(color) {
            var alpha = (color >>> 24) / 255;
            var red = color >> 16 & 0xFF;
            var green = color >> 8 & 0xFF;
            var blue = color & 0xFF;
            return 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ',' + alpha.toString() + ')';
        };
        ColorUtils.getAlpha = function getAlpha(color) {
            return color >>> 24;
        };
        ColorUtils.getAlphaFloat = function getAlphaFloat(color) {
            return (color >>> 24) / 255;
        };
        ColorUtils.getRed = function getRed(color) {
            return color >> 16 & 0xFF;
        };
        ColorUtils.getGreen = function getGreen(color) {
            return color >> 8 & 0xFF;
        };
        ColorUtils.getBlue = function getBlue(color) {
            return color & 0xFF;
        };
        return ColorUtils;
    })();
    Phaser.ColorUtils = ColorUtils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var PointUtils = (function () {
        function PointUtils() { }
        PointUtils.add = function add(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x + b.x, a.y + b.y);
        };
        PointUtils.subtract = function subtract(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x - b.x, a.y - b.y);
        };
        PointUtils.multiply = function multiply(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x * b.x, a.y * b.y);
        };
        PointUtils.divide = function divide(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x / b.x, a.y / b.y);
        };
        PointUtils.clamp = function clamp(a, min, max) {
            Phaser.PointUtils.clampX(a, min, max);
            Phaser.PointUtils.clampY(a, min, max);
            return a;
        };
        PointUtils.clampX = function clampX(a, min, max) {
            a.x = Math.max(Math.min(a.x, max), min);
            return a;
        };
        PointUtils.clampY = function clampY(a, min, max) {
            a.y = Math.max(Math.min(a.y, max), min);
            return a;
        };
        PointUtils.clone = function clone(a, output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(a.x, a.y);
        };
        PointUtils.distanceBetween = function distanceBetween(a, b, round) {
            if (typeof round === "undefined") { round = false; }
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            if(round === true) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        PointUtils.equals = function equals(a, b) {
            return (a.x == b.x && a.y == b.y);
        };
        PointUtils.rotate = function rotate(a, x, y, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            if(asDegrees) {
                angle = angle * Phaser.GameMath.DEG_TO_RAD;
            }
            if(distance === null) {
                distance = Math.sqrt(((x - a.x) * (x - a.x)) + ((y - a.y) * (y - a.y)));
            }
            return a.setTo(x + distance * Math.cos(angle), y + distance * Math.sin(angle));
        };
        PointUtils.rotateAroundPoint = function rotateAroundPoint(a, b, angle, asDegrees, distance) {
            if (typeof asDegrees === "undefined") { asDegrees = false; }
            if (typeof distance === "undefined") { distance = null; }
            return Phaser.PointUtils.rotate(a, b.x, b.y, angle, asDegrees, distance);
        };
        return PointUtils;
    })();
    Phaser.PointUtils = PointUtils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var RectangleUtils = (function () {
        function RectangleUtils() { }
        RectangleUtils.getTopLeftAsPoint = function getTopLeftAsPoint(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.x, a.y);
        };
        RectangleUtils.getBottomRightAsPoint = function getBottomRightAsPoint(a, out) {
            if (typeof out === "undefined") { out = new Phaser.Point(); }
            return out.setTo(a.right, a.bottom);
        };
        RectangleUtils.inflate = function inflate(a, dx, dy) {
            a.x -= dx;
            a.width += 2 * dx;
            a.y -= dy;
            a.height += 2 * dy;
            return a;
        };
        RectangleUtils.inflatePoint = function inflatePoint(a, point) {
            return Phaser.RectangleUtils.inflate(a, point.x, point.y);
        };
        RectangleUtils.size = function size(a, output) {
            if (typeof output === "undefined") { output = new Phaser.Point(); }
            return output.setTo(a.width, a.height);
        };
        RectangleUtils.clone = function clone(a, output) {
            if (typeof output === "undefined") { output = new Phaser.Rectangle(); }
            return output.setTo(a.x, a.y, a.width, a.height);
        };
        RectangleUtils.contains = function contains(a, x, y) {
            return (x >= a.x && x <= a.right && y >= a.y && y <= a.bottom);
        };
        RectangleUtils.containsPoint = function containsPoint(a, point) {
            return Phaser.RectangleUtils.contains(a, point.x, point.y);
        };
        RectangleUtils.containsRect = function containsRect(a, b) {
            if(a.volume > b.volume) {
                return false;
            }
            return (a.x >= b.x && a.y >= b.y && a.right <= b.right && a.bottom <= b.bottom);
        };
        RectangleUtils.equals = function equals(a, b) {
            return (a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height);
        };
        RectangleUtils.intersection = function intersection(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
            if(Phaser.RectangleUtils.intersects(a, b)) {
                out.x = Math.max(a.x, b.x);
                out.y = Math.max(a.y, b.y);
                out.width = Math.min(a.right, b.right) - out.x;
                out.height = Math.min(a.bottom, b.bottom) - out.y;
            }
            return out;
        };
        RectangleUtils.intersects = function intersects(a, b, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0; }
            return !(a.left > b.right + tolerance || a.right < b.left - tolerance || a.top > b.bottom + tolerance || a.bottom < b.top - tolerance);
        };
        RectangleUtils.intersectsRaw = function intersectsRaw(a, left, right, top, bottom, tolerance) {
            if (typeof tolerance === "undefined") { tolerance = 0; }
            return !(left > a.right + tolerance || right < a.left - tolerance || top > a.bottom + tolerance || bottom < a.top - tolerance);
        };
        RectangleUtils.union = function union(a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Rectangle(); }
            return out.setTo(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.max(a.right, b.right), Math.max(a.bottom, b.bottom));
        };
        return RectangleUtils;
    })();
    Phaser.RectangleUtils = RectangleUtils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var SpriteUtils = (function () {
        function SpriteUtils() { }
        SpriteUtils.updateCameraView = function updateCameraView(camera, sprite) {
            if(sprite.rotation == 0 || sprite.texture.renderRotation == false) {
                sprite.cameraView.x = Math.floor(sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x) - (sprite.width * sprite.transform.origin.x));
                sprite.cameraView.y = Math.floor(sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y) - (sprite.height * sprite.transform.origin.y));
                sprite.cameraView.width = sprite.width;
                sprite.cameraView.height = sprite.height;
            } else {
                if(sprite.transform.origin.x == 0.5 && sprite.transform.origin.y == 0.5) {
                    Phaser.SpriteUtils._sin = sprite.transform.sin;
                    Phaser.SpriteUtils._cos = sprite.transform.cos;
                    if(Phaser.SpriteUtils._sin < 0) {
                        Phaser.SpriteUtils._sin = -Phaser.SpriteUtils._sin;
                    }
                    if(Phaser.SpriteUtils._cos < 0) {
                        Phaser.SpriteUtils._cos = -Phaser.SpriteUtils._cos;
                    }
                    sprite.cameraView.width = Math.round(sprite.height * Phaser.SpriteUtils._sin + sprite.width * Phaser.SpriteUtils._cos);
                    sprite.cameraView.height = Math.round(sprite.height * Phaser.SpriteUtils._cos + sprite.width * Phaser.SpriteUtils._sin);
                    sprite.cameraView.x = Math.round(sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x) - (sprite.cameraView.width * sprite.transform.origin.x));
                    sprite.cameraView.y = Math.round(sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y) - (sprite.cameraView.height * sprite.transform.origin.y));
                } else {
                    sprite.cameraView.x = Math.min(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x);
                    sprite.cameraView.y = Math.min(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y);
                    sprite.cameraView.width = Math.max(sprite.transform.upperLeft.x, sprite.transform.upperRight.x, sprite.transform.bottomLeft.x, sprite.transform.bottomRight.x) - sprite.cameraView.x;
                    sprite.cameraView.height = Math.max(sprite.transform.upperLeft.y, sprite.transform.upperRight.y, sprite.transform.bottomLeft.y, sprite.transform.bottomRight.y) - sprite.cameraView.y;
                }
            }
            return sprite.cameraView;
        };
        SpriteUtils.getAsPoints = function getAsPoints(sprite) {
            var out = [];
            out.push(new Phaser.Point(sprite.x, sprite.y));
            out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y));
            out.push(new Phaser.Point(sprite.x + sprite.width, sprite.y + sprite.height));
            out.push(new Phaser.Point(sprite.x, sprite.y + sprite.height));
            return out;
        };
        SpriteUtils.overlapsXY = function overlapsXY(sprite, x, y) {
            if(sprite.transform.rotation == 0) {
                return Phaser.RectangleUtils.contains(sprite.worldView, x, y);
            }
            if((x - sprite.transform.upperLeft.x) * (sprite.transform.upperRight.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperLeft.y) * (sprite.transform.upperRight.y - sprite.transform.upperLeft.y) < 0) {
                return false;
            }
            if((x - sprite.transform.upperRight.x) * (sprite.transform.upperRight.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperRight.y) * (sprite.transform.upperRight.y - sprite.transform.upperLeft.y) > 0) {
                return false;
            }
            if((x - sprite.transform.upperLeft.x) * (sprite.transform.bottomLeft.x - sprite.transform.upperLeft.x) + (y - sprite.transform.upperLeft.y) * (sprite.transform.bottomLeft.y - sprite.transform.upperLeft.y) < 0) {
                return false;
            }
            if((x - sprite.transform.bottomLeft.x) * (sprite.transform.bottomLeft.x - sprite.transform.upperLeft.x) + (y - sprite.transform.bottomLeft.y) * (sprite.transform.bottomLeft.y - sprite.transform.upperLeft.y) > 0) {
                return false;
            }
            return true;
        };
        SpriteUtils.overlapsPoint = function overlapsPoint(sprite, point) {
            return Phaser.SpriteUtils.overlapsXY(sprite, point.x, point.y);
        };
        SpriteUtils.onScreen = function onScreen(sprite, camera) {
            if (typeof camera === "undefined") { camera = null; }
            if(camera == null) {
                camera = sprite.game.camera;
            }
            Phaser.SpriteUtils.getScreenXY(sprite, SpriteUtils._tempPoint, camera);
            return (Phaser.SpriteUtils._tempPoint.x + sprite.width > 0) && (Phaser.SpriteUtils._tempPoint.x < camera.width) && (Phaser.SpriteUtils._tempPoint.y + sprite.height > 0) && (Phaser.SpriteUtils._tempPoint.y < camera.height);
        };
        SpriteUtils.getScreenXY = function getScreenXY(sprite, point, camera) {
            if (typeof point === "undefined") { point = null; }
            if (typeof camera === "undefined") { camera = null; }
            if(point == null) {
                point = new Phaser.Point();
            }
            if(camera == null) {
                camera = sprite.game.camera;
            }
            point.x = sprite.x - camera.x * sprite.transform.scrollFactor.x;
            point.y = sprite.y - camera.y * sprite.transform.scrollFactor.y;
            point.x += (point.x > 0) ? 0.0000001 : -0.0000001;
            point.y += (point.y > 0) ? 0.0000001 : -0.0000001;
            return point;
        };
        SpriteUtils.reset = function reset(sprite, x, y) {
            sprite.revive();
            sprite.x = x;
            sprite.y = y;
            return sprite;
        };
        SpriteUtils.setBounds = function setBounds(x, y, width, height) {
        };
        return SpriteUtils;
    })();
    Phaser.SpriteUtils = SpriteUtils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var DebugUtils = (function () {
        function DebugUtils() { }
        DebugUtils.font = '14px Courier';
        DebugUtils.lineHeight = 16;
        DebugUtils.renderShadow = true;
        DebugUtils.start = function start(x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.currentX = x;
            Phaser.DebugUtils.currentY = y;
            Phaser.DebugUtils.currentColor = color;
            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.font = Phaser.DebugUtils.font;
        };
        DebugUtils.line = function line(text, x, y) {
            if (typeof x === "undefined") { x = null; }
            if (typeof y === "undefined") { y = null; }
            if(x !== null) {
                Phaser.DebugUtils.currentX = x;
            }
            if(y !== null) {
                Phaser.DebugUtils.currentY = y;
            }
            if(Phaser.DebugUtils.renderShadow) {
                Phaser.DebugUtils.context.fillStyle = 'rgb(0,0,0)';
                Phaser.DebugUtils.context.fillText(text, Phaser.DebugUtils.currentX + 1, Phaser.DebugUtils.currentY + 1);
                Phaser.DebugUtils.context.fillStyle = Phaser.DebugUtils.currentColor;
            }
            Phaser.DebugUtils.context.fillText(text, Phaser.DebugUtils.currentX, Phaser.DebugUtils.currentY);
            Phaser.DebugUtils.currentY += Phaser.DebugUtils.lineHeight;
        };
        DebugUtils.renderSpriteCorners = function renderSpriteCorners(sprite, color) {
            if (typeof color === "undefined") { color = 'rgb(255,0,255)'; }
            Phaser.DebugUtils.start(0, 0, color);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.upperLeft.x) + ' y: ' + Math.floor(sprite.transform.upperLeft.y), sprite.transform.upperLeft.x, sprite.transform.upperLeft.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.upperRight.x) + ' y: ' + Math.floor(sprite.transform.upperRight.y), sprite.transform.upperRight.x, sprite.transform.upperRight.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.bottomLeft.x) + ' y: ' + Math.floor(sprite.transform.bottomLeft.y), sprite.transform.bottomLeft.x, sprite.transform.bottomLeft.y);
            Phaser.DebugUtils.line('x: ' + Math.floor(sprite.transform.bottomRight.x) + ' y: ' + Math.floor(sprite.transform.bottomRight.y), sprite.transform.bottomRight.x, sprite.transform.bottomRight.y);
        };
        DebugUtils.renderSoundInfo = function renderSoundInfo(sound, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sound: ' + sound.key + ' Locked: ' + sound.game.sound.touchLocked + ' Pending Playback: ' + sound.pendingPlayback);
            Phaser.DebugUtils.line('Decoded: ' + sound.isDecoded + ' Decoding: ' + sound.isDecoding);
            Phaser.DebugUtils.line('Total Duration: ' + sound.totalDuration + ' Playing: ' + sound.isPlaying);
            Phaser.DebugUtils.line('Time: ' + sound.currentTime);
            Phaser.DebugUtils.line('Volume: ' + sound.volume + ' Muted: ' + sound.mute);
            Phaser.DebugUtils.line('WebAudio: ' + sound.usingWebAudio + ' Audio: ' + sound.usingAudioTag);
            if(sound.currentMarker !== '') {
                Phaser.DebugUtils.line('Marker: ' + sound.currentMarker + ' Duration: ' + sound.duration);
                Phaser.DebugUtils.line('Start: ' + sound.markers[sound.currentMarker].start + ' Stop: ' + sound.markers[sound.currentMarker].stop);
                Phaser.DebugUtils.line('Position: ' + sound.position);
            }
        };
        DebugUtils.renderCameraInfo = function renderCameraInfo(camera, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Camera ID: ' + camera.ID + ' (' + camera.screenView.width + ' x ' + camera.screenView.height + ')');
            Phaser.DebugUtils.line('X: ' + camera.x + ' Y: ' + camera.y + ' Rotation: ' + camera.transform.rotation);
            Phaser.DebugUtils.line('WorldView X: ' + camera.worldView.x + ' Y: ' + camera.worldView.y + ' W: ' + camera.worldView.width + ' H: ' + camera.worldView.height);
            Phaser.DebugUtils.line('ScreenView X: ' + camera.screenView.x + ' Y: ' + camera.screenView.y + ' W: ' + camera.screenView.width + ' H: ' + camera.screenView.height);
            if(camera.worldBounds) {
                Phaser.DebugUtils.line('Bounds: ' + camera.worldBounds.width + ' x ' + camera.worldBounds.height);
            }
        };
        DebugUtils.renderPointer = function renderPointer(pointer, hideIfUp, downColor, upColor, color) {
            if (typeof hideIfUp === "undefined") { hideIfUp = false; }
            if (typeof downColor === "undefined") { downColor = 'rgba(0,255,0,0.5)'; }
            if (typeof upColor === "undefined") { upColor = 'rgba(255,0,0,0.5)'; }
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            if(hideIfUp == true && pointer.isUp == true) {
                return;
            }
            Phaser.DebugUtils.context.beginPath();
            Phaser.DebugUtils.context.arc(pointer.x, pointer.y, pointer.circle.radius, 0, Math.PI * 2);
            if(pointer.active) {
                Phaser.DebugUtils.context.fillStyle = downColor;
            } else {
                Phaser.DebugUtils.context.fillStyle = upColor;
            }
            Phaser.DebugUtils.context.fill();
            Phaser.DebugUtils.context.closePath();
            Phaser.DebugUtils.context.beginPath();
            Phaser.DebugUtils.context.moveTo(pointer.positionDown.x, pointer.positionDown.y);
            Phaser.DebugUtils.context.lineTo(pointer.position.x, pointer.position.y);
            Phaser.DebugUtils.context.lineWidth = 2;
            Phaser.DebugUtils.context.stroke();
            Phaser.DebugUtils.context.closePath();
            Phaser.DebugUtils.start(pointer.x, pointer.y - 100, color);
            Phaser.DebugUtils.line('ID: ' + pointer.id + " Active: " + pointer.active);
            Phaser.DebugUtils.line('World X: ' + pointer.worldX + " World Y: " + pointer.worldY);
            Phaser.DebugUtils.line('Screen X: ' + pointer.x + " Screen Y: " + pointer.y);
            Phaser.DebugUtils.line('Duration: ' + pointer.duration + " ms");
        };
        DebugUtils.renderSpriteInputInfo = function renderSpriteInputInfo(sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sprite Input: (' + sprite.width + ' x ' + sprite.height + ')');
            Phaser.DebugUtils.line('x: ' + sprite.input.pointerX().toFixed(1) + ' y: ' + sprite.input.pointerY().toFixed(1));
            Phaser.DebugUtils.line('over: ' + sprite.input.pointerOver() + ' duration: ' + sprite.input.overDuration().toFixed(0));
            Phaser.DebugUtils.line('down: ' + sprite.input.pointerDown() + ' duration: ' + sprite.input.downDuration().toFixed(0));
            Phaser.DebugUtils.line('just over: ' + sprite.input.justOver() + ' just out: ' + sprite.input.justOut());
        };
        DebugUtils.renderInputInfo = function renderInputInfo(x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            if(Phaser.DebugUtils.game.input.camera) {
                Phaser.DebugUtils.line('Input - Camera: ' + Phaser.DebugUtils.game.input.camera.ID);
            } else {
                Phaser.DebugUtils.line('Input - Camera: null');
            }
            Phaser.DebugUtils.line('X: ' + Phaser.DebugUtils.game.input.x + ' Y: ' + Phaser.DebugUtils.game.input.y);
            Phaser.DebugUtils.line('World X: ' + Phaser.DebugUtils.game.input.worldX + ' World Y: ' + Phaser.DebugUtils.game.input.worldY);
            Phaser.DebugUtils.line('Scale X: ' + Phaser.DebugUtils.game.input.scale.x.toFixed(1) + ' Scale Y: ' + Phaser.DebugUtils.game.input.scale.x.toFixed(1));
            Phaser.DebugUtils.line('Screen X: ' + Phaser.DebugUtils.game.input.activePointer.screenX + ' Screen Y: ' + Phaser.DebugUtils.game.input.activePointer.screenY);
        };
        DebugUtils.renderSpriteWorldView = function renderSpriteWorldView(sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sprite World Coords (' + sprite.width + ' x ' + sprite.height + ')');
            Phaser.DebugUtils.line('x: ' + sprite.worldView.x + ' y: ' + sprite.worldView.y);
            Phaser.DebugUtils.line('bottom: ' + sprite.worldView.bottom + ' right: ' + sprite.worldView.right.toFixed(1));
        };
        DebugUtils.renderSpriteWorldViewBounds = function renderSpriteWorldViewBounds(sprite, color) {
            if (typeof color === "undefined") { color = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.renderRectangle(sprite.worldView, color);
        };
        DebugUtils.renderSpriteInfo = function renderSpriteInfo(sprite, x, y, color) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            Phaser.DebugUtils.start(x, y, color);
            Phaser.DebugUtils.line('Sprite: ' + ' (' + sprite.width + ' x ' + sprite.height + ') origin: ' + sprite.transform.origin.x + ' x ' + sprite.transform.origin.y);
            Phaser.DebugUtils.line('x: ' + sprite.x.toFixed(1) + ' y: ' + sprite.y.toFixed(1) + ' rotation: ' + sprite.rotation.toFixed(1));
            Phaser.DebugUtils.line('wx: ' + sprite.worldView.x + ' wy: ' + sprite.worldView.y + ' ww: ' + sprite.worldView.width.toFixed(1) + ' wh: ' + sprite.worldView.height.toFixed(1) + ' wb: ' + sprite.worldView.bottom + ' wr: ' + sprite.worldView.right);
            Phaser.DebugUtils.line('sx: ' + sprite.transform.scale.x.toFixed(1) + ' sy: ' + sprite.transform.scale.y.toFixed(1));
            Phaser.DebugUtils.line('tx: ' + sprite.texture.width.toFixed(1) + ' ty: ' + sprite.texture.height.toFixed(1));
            Phaser.DebugUtils.line('center x: ' + sprite.transform.center.x + ' y: ' + sprite.transform.center.y);
            Phaser.DebugUtils.line('cameraView x: ' + sprite.cameraView.x + ' y: ' + sprite.cameraView.y + ' width: ' + sprite.cameraView.width + ' height: ' + sprite.cameraView.height);
            Phaser.DebugUtils.line('inCamera: ' + Phaser.DebugUtils.game.renderer.spriteRenderer.inCamera(Phaser.DebugUtils.game.camera, sprite));
        };
        DebugUtils.renderSpriteBounds = function renderSpriteBounds(sprite, camera, color) {
            if (typeof camera === "undefined") { camera = null; }
            if (typeof color === "undefined") { color = 'rgba(0,255,0,0.2)'; }
            if(camera == null) {
                camera = Phaser.DebugUtils.game.camera;
            }
            var dx = sprite.worldView.x;
            var dy = sprite.worldView.y;
            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.fillRect(dx, dy, sprite.width, sprite.height);
        };
        DebugUtils.renderPixel = function renderPixel(x, y, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,1)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(x, y, 1, 1);
        };
        DebugUtils.renderPoint = function renderPoint(point, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,1)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(point.x, point.y, 1, 1);
        };
        DebugUtils.renderRectangle = function renderRectangle(rect, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };
        DebugUtils.renderCircle = function renderCircle(circle, fillStyle) {
            if (typeof fillStyle === "undefined") { fillStyle = 'rgba(0,255,0,0.3)'; }
            Phaser.DebugUtils.context.fillStyle = fillStyle;
            Phaser.DebugUtils.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            Phaser.DebugUtils.context.fill();
        };
        DebugUtils.renderText = function renderText(text, x, y, color, font) {
            if (typeof color === "undefined") { color = 'rgb(255,255,255)'; }
            if (typeof font === "undefined") { font = '16px Courier'; }
            Phaser.DebugUtils.context.font = font;
            Phaser.DebugUtils.context.fillStyle = color;
            Phaser.DebugUtils.context.fillText(text, x, y);
        };
        return DebugUtils;
    })();
    Phaser.DebugUtils = DebugUtils;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Headless) {
            var HeadlessRenderer = (function () {
                function HeadlessRenderer(game) {
                    this.game = game;
                }
                HeadlessRenderer.prototype.render = function () {
                };
                HeadlessRenderer.prototype.renderGameObject = function (camera, object) {
                };
                return HeadlessRenderer;
            })();
            Headless.HeadlessRenderer = HeadlessRenderer;            
        })(Renderer.Headless || (Renderer.Headless = {}));
        var Headless = Renderer.Headless;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Canvas) {
            var CameraRenderer = (function () {
                function CameraRenderer(game) {
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._tx = 0;
                    this._ty = 0;
                    this._gac = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                CameraRenderer.prototype.preRender = function (camera) {
                    if(camera.visible == false || camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1) {
                        return false;
                    }
                    if(this.game.device.patchAndroidClearRectBug) {
                        camera.texture.context.fillStyle = 'rgb(0,0,0)';
                        camera.texture.context.fillRect(0, 0, camera.width, camera.height);
                    } else {
                        camera.texture.context.clearRect(0, 0, camera.width, camera.height);
                    }
                    if(camera.texture.alpha !== 1 && camera.texture.context.globalAlpha != camera.texture.alpha) {
                        this._ga = camera.texture.context.globalAlpha;
                        camera.texture.context.globalAlpha = camera.texture.alpha;
                    }
                    if(camera.texture.opaque) {
                        camera.texture.context.fillStyle = camera.texture.backgroundColor;
                        camera.texture.context.fillRect(0, 0, camera.width, camera.height);
                    }
                    if(camera.texture.globalCompositeOperation) {
                        camera.texture.context.globalCompositeOperation = camera.texture.globalCompositeOperation;
                    }
                    camera.plugins.preRender();
                };
                CameraRenderer.prototype.postRender = function (camera) {
                    if(this._ga > -1) {
                        camera.texture.context.globalAlpha = this._ga;
                    }
                    camera.plugins.postRender();
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = camera.width;
                    this._sh = camera.height;
                    this._fx = camera.transform.scale.x;
                    this._fy = camera.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = camera.screenView.x;
                    this._dy = camera.screenView.y;
                    this._dw = camera.width;
                    this._dh = camera.height;
                    this.game.stage.context.save();
                    if(camera.texture.flippedX) {
                        this._fx = -camera.transform.scale.x;
                    }
                    if(camera.texture.flippedY) {
                        this._fy = -camera.transform.scale.y;
                    }
                    if(camera.modified) {
                        if(camera.transform.rotation !== 0 || camera.transform.rotationOffset !== 0) {
                            this._sin = Math.sin(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                            this._cos = Math.cos(camera.game.math.degreesToRadians(camera.transform.rotationOffset + camera.transform.rotation));
                        }
                        this.game.stage.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + camera.transform.skew.x, -(this._sin * this._fy) + camera.transform.skew.y, this._cos * this._fy, this._dx, this._dy);
                        this._dx = camera.transform.origin.x * -this._dw;
                        this._dy = camera.transform.origin.y * -this._dh;
                    } else {
                        this._dx -= (this._dw * camera.transform.origin.x);
                        this._dy -= (this._dh * camera.transform.origin.y);
                    }
                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);
                    if(this._sw <= 0 || this._sh <= 0 || this._dw <= 0 || this._dh <= 0) {
                        this.game.stage.context.restore();
                        return false;
                    }
                    this.game.stage.context.drawImage(camera.texture.canvas, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                    this.game.stage.context.restore();
                };
                return CameraRenderer;
            })();
            Canvas.CameraRenderer = CameraRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Canvas) {
            var GeometryRenderer = (function () {
                function GeometryRenderer(game) {
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                GeometryRenderer.prototype.renderCircle = function (camera, circle, context, outline, fill, lineColor, fillColor, lineWidth) {
                    if (typeof outline === "undefined") { outline = false; }
                    if (typeof fill === "undefined") { fill = true; }
                    if (typeof lineColor === "undefined") { lineColor = 'rgb(0,255,0)'; }
                    if (typeof fillColor === "undefined") { fillColor = 'rgba(0,100,0.0.3)'; }
                    if (typeof lineWidth === "undefined") { lineWidth = 1; }
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = circle.diameter;
                    this._sh = circle.diameter;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = camera.screenView.x + circle.x - camera.worldView.x;
                    this._dy = camera.screenView.y + circle.y - camera.worldView.y;
                    this._dw = circle.diameter;
                    this._dh = circle.diameter;
                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);
                    this.game.stage.saveCanvasValues();
                    context.save();
                    context.lineWidth = lineWidth;
                    context.strokeStyle = lineColor;
                    context.fillStyle = fillColor;
                    context.beginPath();
                    context.arc(this._dx, this._dy, circle.radius, 0, Math.PI * 2);
                    context.closePath();
                    if(outline) {
                    }
                    if(fill) {
                        context.fill();
                    }
                    context.restore();
                    this.game.stage.restoreCanvasValues();
                    return true;
                };
                return GeometryRenderer;
            })();
            Canvas.GeometryRenderer = GeometryRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Canvas) {
            var GroupRenderer = (function () {
                function GroupRenderer(game) {
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                GroupRenderer.prototype.preRender = function (camera, group) {
                    if(group.visible == false || camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1) {
                        return false;
                    }
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = group.texture.width;
                    this._sh = group.texture.height;
                    this._fx = group.transform.scale.x;
                    this._fy = group.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = group.texture.width;
                    this._dh = group.texture.height;
                    if(group.texture.globalCompositeOperation) {
                        group.texture.context.save();
                        group.texture.context.globalCompositeOperation = group.texture.globalCompositeOperation;
                    }
                    if(group.texture.alpha !== 1 && group.texture.context.globalAlpha !== group.texture.alpha) {
                        this._ga = group.texture.context.globalAlpha;
                        group.texture.context.globalAlpha = group.texture.alpha;
                    }
                    if(group.texture.flippedX) {
                        this._fx = -group.transform.scale.x;
                    }
                    if(group.texture.flippedY) {
                        this._fy = -group.transform.scale.y;
                    }
                    if(group.modified) {
                        if(group.transform.rotation !== 0 || group.transform.rotationOffset !== 0) {
                            this._sin = Math.sin(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                            this._cos = Math.cos(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                        }
                        group.texture.context.save();
                        group.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + group.transform.skew.x, -(this._sin * this._fy) + group.transform.skew.y, this._cos * this._fy, this._dx, this._dy);
                        this._dx = -group.transform.origin.x;
                        this._dy = -group.transform.origin.y;
                    } else {
                        if(!group.transform.origin.equals(0)) {
                            this._dx -= group.transform.origin.x;
                            this._dy -= group.transform.origin.y;
                        }
                    }
                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);
                    if(group.texture.opaque) {
                        group.texture.context.fillStyle = group.texture.backgroundColor;
                        group.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
                    }
                    if(group.texture.loaded) {
                        group.texture.context.drawImage(group.texture.texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                    }
                    return true;
                };
                GroupRenderer.prototype.postRender = function (camera, group) {
                    if(group.modified || group.texture.globalCompositeOperation) {
                        group.texture.context.restore();
                    }
                    if(this._ga > -1) {
                        group.texture.context.globalAlpha = this._ga;
                    }
                };
                return GroupRenderer;
            })();
            Canvas.GroupRenderer = GroupRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Canvas) {
            var ScrollZoneRenderer = (function () {
                function ScrollZoneRenderer(game) {
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                ScrollZoneRenderer.prototype.inCamera = function (camera, scrollZone) {
                    if(scrollZone.transform.scrollFactor.equals(0)) {
                        return true;
                    }
                    return true;
                };
                ScrollZoneRenderer.prototype.render = function (camera, scrollZone) {
                    if(scrollZone.transform.scale.x == 0 || scrollZone.transform.scale.y == 0 || scrollZone.texture.alpha < 0.1 || this.inCamera(camera, scrollZone) == false) {
                        return false;
                    }
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = scrollZone.width;
                    this._sh = scrollZone.height;
                    this._fx = scrollZone.transform.scale.x;
                    this._fy = scrollZone.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    this._dx = (camera.screenView.x * scrollZone.transform.scrollFactor.x) + scrollZone.x - (camera.worldView.x * scrollZone.transform.scrollFactor.x);
                    this._dy = (camera.screenView.y * scrollZone.transform.scrollFactor.y) + scrollZone.y - (camera.worldView.y * scrollZone.transform.scrollFactor.y);
                    this._dw = scrollZone.width;
                    this._dh = scrollZone.height;
                    if(scrollZone.texture.alpha !== 1) {
                        this._ga = scrollZone.texture.context.globalAlpha;
                        scrollZone.texture.context.globalAlpha = scrollZone.texture.alpha;
                    }
                    if(scrollZone.texture.flippedX) {
                        this._fx = -scrollZone.transform.scale.x;
                    }
                    if(scrollZone.texture.flippedY) {
                        this._fy = -scrollZone.transform.scale.y;
                    }
                    if(scrollZone.modified) {
                        if(scrollZone.texture.renderRotation == true && (scrollZone.rotation !== 0 || scrollZone.transform.rotationOffset !== 0)) {
                            this._sin = Math.sin(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                            this._cos = Math.cos(scrollZone.game.math.degreesToRadians(scrollZone.transform.rotationOffset + scrollZone.rotation));
                        }
                        scrollZone.texture.context.save();
                        scrollZone.texture.context.setTransform(this._cos * this._fx, (this._sin * this._fx) + scrollZone.transform.skew.x, -(this._sin * this._fy) + scrollZone.transform.skew.y, this._cos * this._fy, this._dx, this._dy);
                        this._dx = -scrollZone.transform.origin.x;
                        this._dy = -scrollZone.transform.origin.y;
                    } else {
                        if(!scrollZone.transform.origin.equals(0)) {
                            this._dx -= scrollZone.transform.origin.x;
                            this._dy -= scrollZone.transform.origin.y;
                        }
                    }
                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);
                    for(var i = 0; i < scrollZone.regions.length; i++) {
                        if(scrollZone.texture.isDynamic) {
                            scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                        } else {
                            scrollZone.regions[i].render(scrollZone.texture.context, scrollZone.texture.texture, this._dx, this._dy, this._dw, this._dh);
                        }
                    }
                    if(scrollZone.modified) {
                        scrollZone.texture.context.restore();
                    }
                    if(this._ga > -1) {
                        scrollZone.texture.context.globalAlpha = this._ga;
                    }
                    this.game.renderer.renderCount++;
                    return true;
                };
                return ScrollZoneRenderer;
            })();
            Canvas.ScrollZoneRenderer = ScrollZoneRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Canvas) {
            var SpriteRenderer = (function () {
                function SpriteRenderer(game) {
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this.game = game;
                }
                SpriteRenderer.prototype.inCamera = function (camera, sprite) {
                    if(sprite.transform.scrollFactor.equals(0)) {
                        return true;
                    }
                    return true;
                };
                SpriteRenderer.prototype.render = function (camera, sprite) {
                    Phaser.SpriteUtils.updateCameraView(camera, sprite);
                    if(sprite.transform.scale.x == 0 || sprite.transform.scale.y == 0 || sprite.texture.alpha < 0.1 || this.inCamera(camera, sprite) == false) {
                        return false;
                    }
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = sprite.texture.width;
                    this._sh = sprite.texture.height;
                    this._dx = sprite.x - (camera.worldView.x * sprite.transform.scrollFactor.x);
                    this._dy = sprite.y - (camera.worldView.y * sprite.transform.scrollFactor.y);
                    this._dw = sprite.texture.width;
                    this._dh = sprite.texture.height;
                    if(sprite.animations.currentFrame !== null) {
                        this._sx = sprite.animations.currentFrame.x;
                        this._sy = sprite.animations.currentFrame.y;
                        if(sprite.animations.currentFrame.trimmed) {
                            this._dx += sprite.animations.currentFrame.spriteSourceSizeX;
                            this._dy += sprite.animations.currentFrame.spriteSourceSizeY;
                            this._sw = sprite.animations.currentFrame.spriteSourceSizeW;
                            this._sh = sprite.animations.currentFrame.spriteSourceSizeH;
                            this._dw = sprite.animations.currentFrame.spriteSourceSizeW;
                            this._dh = sprite.animations.currentFrame.spriteSourceSizeH;
                        }
                    }
                    if(sprite.modified) {
                        camera.texture.context.save();
                        camera.texture.context.setTransform(sprite.transform.local.data[0], sprite.transform.local.data[3], sprite.transform.local.data[1], sprite.transform.local.data[4], this._dx, this._dy);
                        this._dx = sprite.transform.origin.x * -this._dw;
                        this._dy = sprite.transform.origin.y * -this._dh;
                    } else {
                        this._dx -= (this._dw * sprite.transform.origin.x);
                        this._dy -= (this._dh * sprite.transform.origin.y);
                    }
                    if(sprite.crop) {
                        this._sx += sprite.crop.x * sprite.transform.scale.x;
                        this._sy += sprite.crop.y * sprite.transform.scale.y;
                        this._sw = sprite.crop.width * sprite.transform.scale.x;
                        this._sh = sprite.crop.height * sprite.transform.scale.y;
                        this._dx += sprite.crop.x * sprite.transform.scale.x;
                        this._dy += sprite.crop.y * sprite.transform.scale.y;
                        this._dw = sprite.crop.width * sprite.transform.scale.x;
                        this._dh = sprite.crop.height * sprite.transform.scale.y;
                    }
                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);
                    if(this._sw <= 0 || this._sh <= 0 || this._dw <= 0 || this._dh <= 0) {
                        return false;
                    }
                    if(sprite.texture.globalCompositeOperation) {
                        camera.texture.context.save();
                        camera.texture.context.globalCompositeOperation = sprite.texture.globalCompositeOperation;
                    }
                    if(sprite.texture.alpha !== 1 && camera.texture.context.globalAlpha != sprite.texture.alpha) {
                        this._ga = sprite.texture.context.globalAlpha;
                        camera.texture.context.globalAlpha = sprite.texture.alpha;
                    }
                    if(sprite.texture.opaque) {
                        camera.texture.context.fillStyle = sprite.texture.backgroundColor;
                        camera.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
                    }
                    if(sprite.texture.loaded) {
                        camera.texture.context.drawImage(sprite.texture.texture, this._sx, this._sy, this._sw, this._sh, this._dx, this._dy, this._dw, this._dh);
                    }
                    if(sprite.modified || sprite.texture.globalCompositeOperation) {
                        camera.texture.context.restore();
                    }
                    if(this._ga > -1) {
                        camera.texture.context.globalAlpha = this._ga;
                    }
                    sprite.renderOrderID = this.game.renderer.renderCount;
                    this.game.renderer.renderCount++;
                    return true;
                };
                return SpriteRenderer;
            })();
            Canvas.SpriteRenderer = SpriteRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Canvas) {
            var TilemapRenderer = (function () {
                function TilemapRenderer(game) {
                    this._ga = 1;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._tx = 0;
                    this._ty = 0;
                    this._tl = 0;
                    this._maxX = 0;
                    this._maxY = 0;
                    this._startX = 0;
                    this._startY = 0;
                    this.game = game;
                }
                TilemapRenderer.prototype.render = function (camera, tilemap) {
                    this._tl = tilemap.layers.length;
                    for(var i = 0; i < this._tl; i++) {
                        if(tilemap.layers[i].visible == false || tilemap.layers[i].alpha < 0.1) {
                            continue;
                        }
                        var layer = tilemap.layers[i];
                        this._maxX = this.game.math.ceil(camera.width / layer.tileWidth) + 1;
                        this._maxY = this.game.math.ceil(camera.height / layer.tileHeight) + 1;
                        this._startX = this.game.math.floor(camera.worldView.x / layer.tileWidth);
                        this._startY = this.game.math.floor(camera.worldView.y / layer.tileHeight);
                        if(this._startX < 0) {
                            this._startX = 0;
                        }
                        if(this._startY < 0) {
                            this._startY = 0;
                        }
                        if(this._maxX > layer.widthInTiles) {
                            this._maxX = layer.widthInTiles;
                        }
                        if(this._maxY > layer.heightInTiles) {
                            this._maxY = layer.heightInTiles;
                        }
                        if(this._startX + this._maxX > layer.widthInTiles) {
                            this._startX = layer.widthInTiles - this._maxX;
                        }
                        if(this._startY + this._maxY > layer.heightInTiles) {
                            this._startY = layer.heightInTiles - this._maxY;
                        }
                        this._dx = 0;
                        this._dy = 0;
                        this._dx += -(camera.worldView.x - (this._startX * layer.tileWidth));
                        this._dy += -(camera.worldView.y - (this._startY * layer.tileHeight));
                        this._tx = this._dx;
                        this._ty = this._dy;
                        if(layer.texture.alpha !== 1) {
                            this._ga = layer.texture.context.globalAlpha;
                            layer.texture.context.globalAlpha = layer.texture.alpha;
                        }
                        for(var row = this._startY; row < this._startY + this._maxY; row++) {
                            this._columnData = layer.mapData[row];
                            for(var tile = this._startX; tile < this._startX + this._maxX; tile++) {
                                if(layer.tileOffsets[this._columnData[tile]]) {
                                    layer.texture.context.drawImage(layer.texture.texture, layer.tileOffsets[this._columnData[tile]].x, layer.tileOffsets[this._columnData[tile]].y, layer.tileWidth, layer.tileHeight, this._tx, this._ty, layer.tileWidth, layer.tileHeight);
                                }
                                this._tx += layer.tileWidth;
                            }
                            this._tx = this._dx;
                            this._ty += layer.tileHeight;
                        }
                        if(this._ga > -1) {
                            layer.texture.context.globalAlpha = this._ga;
                        }
                    }
                    return true;
                };
                return TilemapRenderer;
            })();
            Canvas.TilemapRenderer = TilemapRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Renderer) {
        (function (Canvas) {
            var CanvasRenderer = (function () {
                function CanvasRenderer(game) {
                    this._c = 0;
                    this.game = game;
                    this.cameraRenderer = new Phaser.Renderer.Canvas.CameraRenderer(game);
                    this.groupRenderer = new Phaser.Renderer.Canvas.GroupRenderer(game);
                    this.spriteRenderer = new Phaser.Renderer.Canvas.SpriteRenderer(game);
                    this.geometryRenderer = new Phaser.Renderer.Canvas.GeometryRenderer(game);
                    this.scrollZoneRenderer = new Phaser.Renderer.Canvas.ScrollZoneRenderer(game);
                    this.tilemapRenderer = new Phaser.Renderer.Canvas.TilemapRenderer(game);
                }
                CanvasRenderer.prototype.render = function () {
                    this._cameraList = this.game.world.getAllCameras();
                    this.renderCount = 0;
                    for(this._c = 0; this._c < this._cameraList.length; this._c++) {
                        if(this._cameraList[this._c].visible) {
                            this.cameraRenderer.preRender(this._cameraList[this._c]);
                            this.game.world.group.render(this._cameraList[this._c]);
                            this.cameraRenderer.postRender(this._cameraList[this._c]);
                        }
                    }
                    this.renderTotal = this.renderCount;
                };
                CanvasRenderer.prototype.renderGameObject = function (camera, object) {
                    if(object.type == Phaser.Types.SPRITE || object.type == Phaser.Types.BUTTON) {
                        this.spriteRenderer.render(camera, object);
                    } else if(object.type == Phaser.Types.SCROLLZONE) {
                        this.scrollZoneRenderer.render(camera, object);
                    } else if(object.type == Phaser.Types.TILEMAP) {
                        this.tilemapRenderer.render(camera, object);
                    }
                };
                return CanvasRenderer;
            })();
            Canvas.CanvasRenderer = CanvasRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var ParticleManager = (function () {
            function ParticleManager(proParticleCount, integrationType) {
                this.PARTICLE_CREATED = 'partilcleCreated';
                this.PARTICLE_UPDATE = 'partilcleUpdate';
                this.PARTICLE_SLEEP = 'particleSleep';
                this.PARTICLE_DEAD = 'partilcleDead';
                this.PROTON_UPDATE = 'protonUpdate';
                this.PROTON_UPDATE_AFTER = 'protonUpdateAfter';
                this.EMITTER_ADDED = 'emitterAdded';
                this.EMITTER_REMOVED = 'emitterRemoved';
                this.emitters = [];
                this.renderers = [];
                this.time = 0;
                this.oldTime = 0;
                this.amendChangeTabsBug = true;
                this.TextureBuffer = {
                };
                this.TextureCanvasBuffer = {
                };
                this.proParticleCount = Particles.ParticleUtils.initValue(proParticleCount, ParticleManager.POOL_MAX);
                this.integrationType = Particles.ParticleUtils.initValue(integrationType, ParticleManager.EULER);
                this.emitters = [];
                this.renderers = [];
                this.time = 0;
                this.oldTime = 0;
                ParticleManager.pool = new Phaser.Particles.ParticlePool(proParticleCount);
                ParticleManager.integrator = new Phaser.Particles.NumericalIntegration(this.integrationType);
            }
            ParticleManager.POOL_MAX = 1000;
            ParticleManager.TIME_STEP = 60;
            ParticleManager.MEASURE = 100;
            ParticleManager.EULER = 'euler';
            ParticleManager.RK2 = 'runge-kutta2';
            ParticleManager.RK4 = 'runge-kutta4';
            ParticleManager.VERLET = 'verlet';
            ParticleManager.prototype.addRender = function (render) {
                render.proton = this;
                this.renderers.push(render.proton);
            };
            ParticleManager.prototype.addEmitter = function (emitter) {
                this.emitters.push(emitter);
                emitter.parent = this;
            };
            ParticleManager.prototype.removeEmitter = function (emitter) {
                var index = this.emitters.indexOf(emitter);
                this.emitters.splice(index, 1);
                emitter.parent = null;
            };
            ParticleManager.prototype.update = function () {
                if(!this.oldTime) {
                    this.oldTime = new Date().getTime();
                }
                var time = new Date().getTime();
                this.elapsed = (time - this.oldTime) / 1000;
                this.oldTime = time;
                if(this.elapsed > 0) {
                    for(var i = 0; i < this.emitters.length; i++) {
                        this.emitters[i].update(this.elapsed);
                    }
                }
            };
            ParticleManager.prototype.amendChangeTabsBugHandler = function () {
                if(this.elapsed > .5) {
                    this.oldTime = new Date().getTime();
                    this.elapsed = 0;
                }
            };
            ParticleManager.prototype.getParticleNumber = function () {
                var total = 0;
                for(var i = 0; i < this.emitters.length; i++) {
                    total += this.emitters[i].particles.length;
                }
                return total;
            };
            ParticleManager.prototype.destroy = function () {
                for(var i = 0; i < this.emitters.length; i++) {
                    this.emitters[i].destory();
                    delete this.emitters[i];
                }
                this.emitters = [];
                this.time = 0;
                this.oldTime = 0;
                ParticleManager.pool.release();
            };
            return ParticleManager;
        })();
        Particles.ParticleManager = ParticleManager;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var Particle = (function () {
            function Particle() {
                this.life = Infinity;
                this.age = 0;
                this.energy = 1;
                this.dead = false;
                this.sleep = false;
                this.target = null;
                this.sprite = null;
                this.parent = null;
                this.mass = 1;
                this.radius = 10;
                this.alpha = 1;
                this.scale = 1;
                this.rotation = 0;
                this.color = null;
                this.easing = Phaser.Easing.Linear.None;
                this.p = new Phaser.Vec2();
                this.v = new Phaser.Vec2();
                this.a = new Phaser.Vec2();
                this.old = {
                    p: new Phaser.Vec2(),
                    v: new Phaser.Vec2(),
                    a: new Phaser.Vec2()
                };
                this.behaviours = [];
                this.id = 'particle_' + Particle.ID++;
                this.reset(true);
            }
            Particle.ID = 0;
            Particle.prototype.getDirection = function () {
                return Math.atan2(this.v.x, -this.v.y) * (180 / Math.PI);
            };
            Particle.prototype.reset = function (init) {
                this.life = Infinity;
                this.age = 0;
                this.energy = 1;
                this.dead = false;
                this.sleep = false;
                this.target = null;
                this.sprite = null;
                this.parent = null;
                this.mass = 1;
                this.radius = 10;
                this.alpha = 1;
                this.scale = 1;
                this.rotation = 0;
                this.color = null;
                this.easing = Phaser.Easing.Linear.None;
                if(init) {
                    this.transform = {
                    };
                    this.p = new Phaser.Vec2();
                    this.v = new Phaser.Vec2();
                    this.a = new Phaser.Vec2();
                    this.old = {
                        p: new Phaser.Vec2(),
                        v: new Phaser.Vec2(),
                        a: new Phaser.Vec2()
                    };
                    this.behaviours = [];
                } else {
                    Particles.ParticleUtils.destroyObject(this.transform);
                    this.p.setTo(0, 0);
                    this.v.setTo(0, 0);
                    this.a.setTo(0, 0);
                    this.old.p.setTo(0, 0);
                    this.old.v.setTo(0, 0);
                    this.old.a.setTo(0, 0);
                    this.removeAllBehaviours();
                }
                this.transform.rgb = {
                    r: 255,
                    g: 255,
                    b: 255
                };
                return this;
            };
            Particle.prototype.update = function (time, index) {
                if(!this.sleep) {
                    this.age += time;
                    var length = this.behaviours.length, i;
                    for(i = 0; i < length; i++) {
                        if(this.behaviours[i]) {
                            this.behaviours[i].applyBehaviour(this, time, index);
                        }
                    }
                }
                if(this.age >= this.life) {
                    this.destroy();
                } else {
                    var scale = this.easing(this.age / this.life);
                    this.energy = Math.max(1 - scale, 0);
                }
            };
            Particle.prototype.addBehaviour = function (behaviour) {
                this.behaviours.push(behaviour);
                if(behaviour.hasOwnProperty('parents')) {
                    behaviour.parents.push(this);
                }
                behaviour.initialize(this);
            };
            Particle.prototype.addBehaviours = function (behaviours) {
                var length = behaviours.length, i;
                for(i = 0; i < length; i++) {
                    this.addBehaviour(behaviours[i]);
                }
            };
            Particle.prototype.removeBehaviour = function (behaviour) {
                var index = this.behaviours.indexOf(behaviour);
                if(index > -1) {
                    var outBehaviour = this.behaviours.splice(index, 1);
                }
            };
            Particle.prototype.removeAllBehaviours = function () {
                Particles.ParticleUtils.destroyArray(this.behaviours);
            };
            Particle.prototype.destroy = function () {
                this.removeAllBehaviours();
                this.energy = 0;
                this.dead = true;
                this.parent = null;
            };
            return Particle;
        })();
        Particles.Particle = Particle;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var Emitter = (function () {
            function Emitter(pObj) {
                this.initializes = [];
                this.particles = [];
                this.behaviours = [];
                this.emitTime = 0;
                this.emitTotalTimes = -1;
                this.initializes = [];
                this.particles = [];
                this.behaviours = [];
                this.emitTime = 0;
                this.emitTotalTimes = -1;
                this.damping = .006;
                this.bindEmitter = true;
                this.rate = new Phaser.Particles.Initializers.Rate(1, .1);
                this.id = 'emitter_' + Emitter.ID++;
            }
            Emitter.ID = 0;
            Emitter.prototype.emit = function (emitTime, life) {
                this.emitTime = 0;
                this.emitTotalTimes = Particles.ParticleUtils.initValue(emitTime, Infinity);
                if(life == true || life == 'life' || life == 'destroy') {
                    if(emitTime == 'once') {
                        this.life = 1;
                    } else {
                        this.life = this.emitTotalTimes;
                    }
                } else if(!isNaN(life)) {
                    this.life = life;
                }
                this.rate.init();
            };
            Emitter.prototype.stopEmit = function () {
                this.emitTotalTimes = -1;
                this.emitTime = 0;
            };
            Emitter.prototype.removeAllParticles = function () {
                for(var i = 0; i < this.particles.length; i++) {
                    this.particles[i].dead = true;
                }
            };
            Emitter.prototype.createParticle = function (initialize, behaviour) {
                if (typeof initialize === "undefined") { initialize = null; }
                if (typeof behaviour === "undefined") { behaviour = null; }
                var particle = Particles.ParticleManager.pool.get();
                this.setupParticle(particle, initialize, behaviour);
                return particle;
            };
            Emitter.prototype.addSelfInitialize = function (pObj) {
                if(pObj['init']) {
                    pObj.init(this);
                } else {
                }
            };
            Emitter.prototype.addInitialize = function () {
                var length = arguments.length, i;
                for(i = 0; i < length; i++) {
                    this.initializes.push(arguments[i]);
                }
            };
            Emitter.prototype.removeInitialize = function (initializer) {
                var index = this.initializes.indexOf(initializer);
                if(index > -1) {
                    this.initializes.splice(index, 1);
                }
            };
            Emitter.prototype.removeInitializers = function () {
                Particles.ParticleUtils.destroyArray(this.initializes);
            };
            Emitter.prototype.addBehaviour = function () {
                var length = arguments.length, i;
                for(i = 0; i < length; i++) {
                    this.behaviours.push(arguments[i]);
                    if(arguments[i].hasOwnProperty("parents")) {
                        arguments[i].parents.push(this);
                    }
                }
            };
            Emitter.prototype.removeBehaviour = function (behaviour) {
                var index = this.behaviours.indexOf(behaviour);
                if(index > -1) {
                    this.behaviours.splice(index, 1);
                }
            };
            Emitter.prototype.removeAllBehaviours = function () {
                Particles.ParticleUtils.destroyArray(this.behaviours);
            };
            Emitter.prototype.integrate = function (time) {
                var damping = 1 - this.damping;
                Particles.ParticleManager.integrator.integrate(this, time, damping);
                var length = this.particles.length, i;
                for(i = 0; i < length; i++) {
                    var particle = this.particles[i];
                    particle.update(time, i);
                    Particles.ParticleManager.integrator.integrate(particle, time, damping);
                }
            };
            Emitter.prototype.emitting = function (time) {
                if(this.emitTotalTimes == 1) {
                    var length = this.rate.getValue(99999), i;
                    for(i = 0; i < length; i++) {
                        this.createParticle();
                    }
                    this.emitTotalTimes = 0;
                } else if(!isNaN(this.emitTotalTimes)) {
                    this.emitTime += time;
                    if(this.emitTime < this.emitTotalTimes) {
                        var length = this.rate.getValue(time), i;
                        for(i = 0; i < length; i++) {
                            this.createParticle();
                        }
                    }
                }
            };
            Emitter.prototype.update = function (time) {
                this.age += time;
                if(this.age >= this.life || this.dead) {
                    this.destroy();
                }
                this.emitting(time);
                this.integrate(time);
                var particle;
                var length = this.particles.length, k;
                for(k = length - 1; k >= 0; k--) {
                    particle = this.particles[k];
                    if(particle.dead) {
                        Particles.ParticleManager.pool.set(particle);
                        this.particles.splice(k, 1);
                    }
                }
            };
            Emitter.prototype.setupParticle = function (particle, initialize, behaviour) {
                var initializes = this.initializes;
                var behaviours = this.behaviours;
                if(initialize) {
                    if(initialize instanceof Array) {
                        initializes = initialize;
                    } else {
                        initializes = [
                            initialize
                        ];
                    }
                }
                if(behaviour) {
                    if(behaviour instanceof Array) {
                        behaviours = behaviour;
                    } else {
                        behaviours = [
                            behaviour
                        ];
                    }
                }
                particle.addBehaviours(behaviours);
                particle.parent = this;
                this.particles.push(particle);
            };
            Emitter.prototype.destroy = function () {
                this.dead = true;
                this.emitTotalTimes = -1;
                if(this.particles.length == 0) {
                    this.removeInitializers();
                    this.removeAllBehaviours();
                    if(this.parent) {
                        this.parent.removeEmitter(this);
                    }
                }
            };
            return Emitter;
        })();
        Particles.Emitter = Emitter;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var ParticlePool = (function () {
            function ParticlePool(num, releaseTime) {
                if (typeof releaseTime === "undefined") { releaseTime = 0; }
                this.poolList = [];
                this.timeoutID = 0;
                this.proParticleCount = Particles.ParticleUtils.initValue(num, 0);
                this.releaseTime = Particles.ParticleUtils.initValue(releaseTime, -1);
                this.poolList = [];
                this.timeoutID = 0;
                for(var i = 0; i < this.proParticleCount; i++) {
                    this.add();
                }
                if(this.releaseTime > 0) {
                    this.timeoutID = setTimeout(this.release, this.releaseTime / 1000);
                }
            }
            ParticlePool.prototype.create = function (newTypeParticleClass) {
                if (typeof newTypeParticleClass === "undefined") { newTypeParticleClass = null; }
                if(newTypeParticleClass) {
                    return new newTypeParticleClass();
                } else {
                    return new Phaser.Particles.Particle();
                }
            };
            ParticlePool.prototype.getCount = function () {
                return this.poolList.length;
            };
            ParticlePool.prototype.add = function () {
                return this.poolList.push(this.create());
            };
            ParticlePool.prototype.get = function () {
                if(this.poolList.length === 0) {
                    return this.create();
                } else {
                    return this.poolList.pop().reset();
                }
            };
            ParticlePool.prototype.set = function (particle) {
                if(this.poolList.length < Particles.ParticleManager.POOL_MAX) {
                    return this.poolList.push(particle);
                }
            };
            ParticlePool.prototype.release = function () {
                for(var i = 0; i < this.poolList.length; i++) {
                    if(this.poolList[i]['destroy']) {
                        this.poolList[i].destroy();
                    }
                    delete this.poolList[i];
                }
                this.poolList = [];
            };
            return ParticlePool;
        })();
        Particles.ParticlePool = ParticlePool;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var ParticleUtils = (function () {
            function ParticleUtils() { }
            ParticleUtils.initValue = function initValue(value, defaults) {
                var value = (value != null && value != undefined) ? value : defaults;
                return value;
            };
            ParticleUtils.isArray = function isArray(value) {
                return typeof value === 'object' && value.hasOwnProperty('length');
            };
            ParticleUtils.destroyArray = function destroyArray(array) {
                array.length = 0;
            };
            ParticleUtils.destroyObject = function destroyObject(obj) {
                for(var o in obj) {
                    delete obj[o];
                }
            };
            ParticleUtils.setSpanValue = function setSpanValue(a, b, c) {
                if (typeof b === "undefined") { b = null; }
                if (typeof c === "undefined") { c = null; }
                if(a instanceof Phaser.Particles.Span) {
                    return a;
                } else {
                    if(!b) {
                        return new Phaser.Particles.Span(a);
                    } else {
                        if(!c) {
                            return new Phaser.Particles.Span(a, b);
                        } else {
                            return new Phaser.Particles.Span(a, b, c);
                        }
                    }
                }
            };
            ParticleUtils.getSpanValue = function getSpanValue(pan) {
                if(pan instanceof Phaser.Particles.Span) {
                    return pan.getValue();
                } else {
                    return pan;
                }
            };
            ParticleUtils.randomAToB = function randomAToB(a, b, INT) {
                if (typeof INT === "undefined") { INT = null; }
                if(!INT) {
                    return a + Math.random() * (b - a);
                } else {
                    return Math.floor(Math.random() * (b - a)) + a;
                }
            };
            ParticleUtils.randomFloating = function randomFloating(center, f, INT) {
                return ParticleUtils.randomAToB(center - f, center + f, INT);
            };
            ParticleUtils.randomZone = function randomZone(display) {
            };
            ParticleUtils.degreeTransform = function degreeTransform(a) {
                return a * Math.PI / 180;
            };
            ParticleUtils.randomColor = function randomColor() {
                return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
            };
            ParticleUtils.setEasingByName = function setEasingByName(name) {
                switch(name) {
                    case 'easeLinear':
                        return Phaser.Easing.Linear.None;
                        break;
                    case 'easeInQuad':
                        return Phaser.Easing.Quadratic.In;
                        break;
                    case 'easeOutQuad':
                        return Phaser.Easing.Quadratic.Out;
                        break;
                    case 'easeInOutQuad':
                        return Phaser.Easing.Quadratic.InOut;
                        break;
                    case 'easeInCubic':
                        return Phaser.Easing.Cubic.In;
                        break;
                    case 'easeOutCubic':
                        return Phaser.Easing.Cubic.Out;
                        break;
                    case 'easeInOutCubic':
                        return Phaser.Easing.Cubic.InOut;
                        break;
                    case 'easeInQuart':
                        return Phaser.Easing.Quartic.In;
                        break;
                    case 'easeOutQuart':
                        return Phaser.Easing.Quartic.Out;
                        break;
                    case 'easeInOutQuart':
                        return Phaser.Easing.Quartic.InOut;
                        break;
                    case 'easeInSine':
                        return Phaser.Easing.Sinusoidal.In;
                        break;
                    case 'easeOutSine':
                        return Phaser.Easing.Sinusoidal.Out;
                        break;
                    case 'easeInOutSine':
                        return Phaser.Easing.Sinusoidal.InOut;
                        break;
                    case 'easeInExpo':
                        return Phaser.Easing.Exponential.In;
                        break;
                    case 'easeOutExpo':
                        return Phaser.Easing.Exponential.Out;
                        break;
                    case 'easeInOutExpo':
                        return Phaser.Easing.Exponential.InOut;
                        break;
                    case 'easeInCirc':
                        return Phaser.Easing.Circular.In;
                        break;
                    case 'easeOutCirc':
                        return Phaser.Easing.Circular.Out;
                        break;
                    case 'easeInOutCirc':
                        return Phaser.Easing.Circular.InOut;
                        break;
                    case 'easeInBack':
                        return Phaser.Easing.Back.In;
                        break;
                    case 'easeOutBack':
                        return Phaser.Easing.Back.Out;
                        break;
                    case 'easeInOutBack':
                        return Phaser.Easing.Back.InOut;
                        break;
                    default:
                        return Phaser.Easing.Linear.None;
                        break;
                }
            };
            return ParticleUtils;
        })();
        Particles.ParticleUtils = ParticleUtils;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var Polar2D = (function () {
            function Polar2D(r, tha) {
                this.r = Math.abs(r) || 0;
                this.tha = tha || 0;
            }
            Polar2D.prototype.set = function (r, tha) {
                this.r = r;
                this.tha = tha;
                return this;
            };
            Polar2D.prototype.setR = function (r) {
                this.r = r;
                return this;
            };
            Polar2D.prototype.setTha = function (tha) {
                this.tha = tha;
                return this;
            };
            Polar2D.prototype.copy = function (p) {
                this.r = p.r;
                this.tha = p.tha;
                return this;
            };
            Polar2D.prototype.toVector = function () {
                return new Phaser.Vec2(this.getX(), this.getY());
            };
            Polar2D.prototype.getX = function () {
                return this.r * Math.sin(this.tha);
            };
            Polar2D.prototype.getY = function () {
                return -this.r * Math.cos(this.tha);
            };
            Polar2D.prototype.normalize = function () {
                this.r = 1;
                return this;
            };
            Polar2D.prototype.equals = function (v) {
                return ((v.r === this.r) && (v.tha === this.tha));
            };
            Polar2D.prototype.toArray = function () {
                return [
                    this.r, 
                    this.tha
                ];
            };
            Polar2D.prototype.clear = function () {
                this.r = 0.0;
                this.tha = 0.0;
                return this;
            };
            Polar2D.prototype.clone = function () {
                return new Polar2D(this.r, this.tha);
            };
            return Polar2D;
        })();
        Particles.Polar2D = Polar2D;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var Span = (function () {
            function Span(a, b, center) {
                if (typeof b === "undefined") { b = null; }
                if (typeof center === "undefined") { center = null; }
                this.isArray = false;
                if(Particles.ParticleUtils.isArray(a)) {
                    this.isArray = true;
                    this.a = a;
                } else {
                    this.a = Particles.ParticleUtils.initValue(a, 1);
                    this.b = Particles.ParticleUtils.initValue(b, this.a);
                    this.center = Particles.ParticleUtils.initValue(center, false);
                }
            }
            Span.prototype.getValue = function (INT) {
                if (typeof INT === "undefined") { INT = null; }
                if(this.isArray) {
                    return this.a[Math.floor(this.a.length * Math.random())];
                } else {
                    if(!this.center) {
                        return Particles.ParticleUtils.randomAToB(this.a, this.b, INT);
                    } else {
                        return Particles.ParticleUtils.randomFloating(this.a, this.b, INT);
                    }
                }
            };
            Span.getSpan = function getSpan(a, b, center) {
                return new Span(a, b, center);
            };
            return Span;
        })();
        Particles.Span = Span;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        var NumericalIntegration = (function () {
            function NumericalIntegration(type) {
                this.type = Particles.ParticleUtils.initValue(type, Particles.ParticleManager.EULER);
            }
            NumericalIntegration.prototype.integrate = function (particles, time, damping) {
                this.eulerIntegrate(particles, time, damping);
            };
            NumericalIntegration.prototype.eulerIntegrate = function (particle, time, damping) {
                if(!particle.sleep) {
                    particle.old.p.copy(particle.p);
                    particle.old.v.copy(particle.v);
                    particle.a.multiplyScalar(1 / particle.mass);
                    particle.v.add(particle.a.multiplyScalar(time));
                    particle.p.add(particle.old.v.multiplyScalar(time));
                    if(damping) {
                        particle.v.multiplyScalar(damping);
                    }
                    particle.a.clear();
                }
            };
            return NumericalIntegration;
        })();
        Particles.NumericalIntegration = NumericalIntegration;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Behaviours) {
            var Behaviour = (function () {
                function Behaviour(life, easing) {
                    this.id = 'Behaviour_' + Behaviour.ID++;
                    this.life = Particles.ParticleUtils.initValue(life, Infinity);
                    this.easing = Particles.ParticleUtils.setEasingByName(easing);
                    this.age = 0;
                    this.energy = 1;
                    this.dead = false;
                    this.parents = [];
                    this.name = 'Behaviour';
                }
                Behaviour.prototype.normalizeForce = function (force) {
                    return force.multiplyScalar(Particles.ParticleManager.MEASURE);
                };
                Behaviour.prototype.normalizeValue = function (value) {
                    return value * Particles.ParticleManager.MEASURE;
                };
                Behaviour.prototype.initialize = function (particle) {
                };
                Behaviour.prototype.applyBehaviour = function (particle, time, index) {
                    this.age += time;
                    if(this.age >= this.life || this.dead) {
                        this.energy = 0;
                        this.dead = true;
                        this.destroy();
                    } else {
                        var scale = this.easing(particle.age / particle.life);
                        this.energy = Math.max(1 - scale, 0);
                    }
                };
                Behaviour.prototype.destroy = function () {
                    var index;
                    var length = this.parents.length, i;
                    for(i = 0; i < length; i++) {
                        this.parents[i].removeBehaviour(this);
                    }
                    this.parents = [];
                };
                return Behaviour;
            })();
            Behaviours.Behaviour = Behaviour;            
        })(Particles.Behaviours || (Particles.Behaviours = {}));
        var Behaviours = Particles.Behaviours;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Behaviours) {
            var RandomDrift = (function (_super) {
                __extends(RandomDrift, _super);
                function RandomDrift(driftX, driftY, delay, life, easing) {
                                _super.call(this, life, easing);
                    this.reset(driftX, driftY, delay);
                    this.time = 0;
                    this.name = "RandomDrift";
                }
                RandomDrift.prototype.reset = function (driftX, driftY, delay, life, easing) {
                    if (typeof life === "undefined") { life = null; }
                    if (typeof easing === "undefined") { easing = null; }
                    this.panFoce = new Phaser.Vec2(driftX, driftY);
                    this.panFoce = this.normalizeForce(this.panFoce);
                    this.delay = delay;
                    if(life) {
                        this.life = Particles.ParticleUtils.initValue(life, Infinity);
                        this.easing = Particles.ParticleUtils.initValue(easing, Phaser.Easing.Linear.None);
                    }
                };
                RandomDrift.prototype.applyBehaviour = function (particle, time, index) {
                    _super.prototype.applyBehaviour.call(this, particle, time, index);
                    this.time += time;
                    if(this.time >= this.delay) {
                        particle.a.addXY(Particles.ParticleUtils.randomAToB(-this.panFoce.x, this.panFoce.x), Particles.ParticleUtils.randomAToB(-this.panFoce.y, this.panFoce.y));
                        this.time = 0;
                    }
                };
                return RandomDrift;
            })(Behaviours.Behaviour);
            Behaviours.RandomDrift = RandomDrift;            
        })(Particles.Behaviours || (Particles.Behaviours = {}));
        var Behaviours = Particles.Behaviours;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Initializers) {
            var Initialize = (function () {
                function Initialize() { }
                Initialize.prototype.initialize = function (target) {
                };
                Initialize.prototype.reset = function (a, b, c) {
                };
                Initialize.prototype.init = function (emitter, particle) {
                    if (typeof particle === "undefined") { particle = null; }
                    if(particle) {
                        this.initialize(particle);
                    } else {
                        this.initialize(emitter);
                    }
                };
                return Initialize;
            })();
            Initializers.Initialize = Initialize;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Initializers) {
            var Life = (function (_super) {
                __extends(Life, _super);
                function Life(a, b, c) {
                                _super.call(this);
                    this.lifePan = Particles.ParticleUtils.setSpanValue(a, b, c);
                }
                Life.prototype.initialize = function (target) {
                    if(this.lifePan.a == Infinity) {
                        target.life = Infinity;
                    } else {
                        target.life = this.lifePan.getValue();
                    }
                };
                return Life;
            })(Initializers.Initialize);
            Initializers.Life = Life;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Initializers) {
            var Mass = (function (_super) {
                __extends(Mass, _super);
                function Mass(a, b, c) {
                                _super.call(this);
                    this.massPan = Particles.ParticleUtils.setSpanValue(a, b, c);
                }
                Mass.prototype.initialize = function (target) {
                    target.mass = this.massPan.getValue();
                };
                return Mass;
            })(Initializers.Initialize);
            Initializers.Mass = Mass;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Initializers) {
            var Position = (function (_super) {
                __extends(Position, _super);
                function Position(zone) {
                                _super.call(this);
                    if(zone != null && zone != undefined) {
                        this.zone = zone;
                    } else {
                        this.zone = new Phaser.Particles.Zones.PointZone();
                    }
                }
                Position.prototype.reset = function (zone) {
                    if(zone != null && zone != undefined) {
                        this.zone = zone;
                    } else {
                        this.zone = new Phaser.Particles.Zones.PointZone();
                    }
                };
                Position.prototype.initialize = function (target) {
                    this.zone.getPosition();
                    target.p.x = this.zone.vector.x;
                    target.p.y = this.zone.vector.y;
                };
                return Position;
            })(Initializers.Initialize);
            Initializers.Position = Position;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Initializers) {
            var Rate = (function (_super) {
                __extends(Rate, _super);
                function Rate(numpan, timepan) {
                                _super.call(this);
                    numpan = Particles.ParticleUtils.initValue(numpan, 1);
                    timepan = Particles.ParticleUtils.initValue(timepan, 1);
                    this.numPan = new Phaser.Particles.Span(numpan);
                    this.timePan = new Phaser.Particles.Span(timepan);
                    this.startTime = 0;
                    this.nextTime = 0;
                    this.init();
                }
                Rate.prototype.init = function () {
                    this.startTime = 0;
                    this.nextTime = this.timePan.getValue();
                };
                Rate.prototype.getValue = function (time) {
                    this.startTime += time;
                    if(this.startTime >= this.nextTime) {
                        this.startTime = 0;
                        this.nextTime = this.timePan.getValue();
                        if(this.numPan.b == 1) {
                            if(this.numPan.getValue(false) > 0.5) {
                                return 1;
                            } else {
                                return 0;
                            }
                        } else {
                            return this.numPan.getValue(true);
                        }
                    }
                    return 0;
                };
                return Rate;
            })(Initializers.Initialize);
            Initializers.Rate = Rate;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Initializers) {
            var Velocity = (function (_super) {
                __extends(Velocity, _super);
                function Velocity(rpan, thapan, type) {
                                _super.call(this);
                    this.rPan = Particles.ParticleUtils.setSpanValue(rpan);
                    this.thaPan = Particles.ParticleUtils.setSpanValue(thapan);
                    this.type = Particles.ParticleUtils.initValue(type, 'vector');
                }
                Velocity.prototype.reset = function (rpan, thapan, type) {
                    this.rPan = Particles.ParticleUtils.setSpanValue(rpan);
                    this.thaPan = Particles.ParticleUtils.setSpanValue(thapan);
                    this.type = Particles.ParticleUtils.initValue(type, 'vector');
                };
                Velocity.prototype.normalizeVelocity = function (vr) {
                    return vr * Particles.ParticleManager.MEASURE;
                };
                Velocity.prototype.initialize = function (target) {
                    if(this.type == 'p' || this.type == 'P' || this.type == 'polar') {
                        var polar2d = new Particles.Polar2D(this.normalizeVelocity(this.rPan.getValue()), this.thaPan.getValue() * Math.PI / 180);
                        target.v.x = polar2d.getX();
                        target.v.y = polar2d.getY();
                    } else {
                        target.v.x = this.normalizeVelocity(this.rPan.getValue());
                        target.v.y = this.normalizeVelocity(this.thaPan.getValue());
                    }
                };
                return Velocity;
            })(Initializers.Initialize);
            Initializers.Velocity = Velocity;            
        })(Particles.Initializers || (Particles.Initializers = {}));
        var Initializers = Particles.Initializers;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Zones) {
            var Zone = (function () {
                function Zone() {
                    this.vector = new Phaser.Vec2();
                    this.random = 0;
                    this.crossType = "dead";
                    this.alert = true;
                }
                return Zone;
            })();
            Zones.Zone = Zone;            
        })(Particles.Zones || (Particles.Zones = {}));
        var Zones = Particles.Zones;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    (function (Particles) {
        (function (Zones) {
            var PointZone = (function (_super) {
                __extends(PointZone, _super);
                function PointZone(x, y) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                                _super.call(this);
                    this.x = x;
                    this.y = y;
                }
                PointZone.prototype.getPosition = function () {
                    return this.vector.setTo(this.x, this.y);
                };
                PointZone.prototype.crossing = function (particle) {
                    if(this.alert) {
                        alert('Sorry PointZone does not support crossing method');
                        this.alert = false;
                    }
                };
                return PointZone;
            })(Zones.Zone);
            Zones.PointZone = PointZone;            
        })(Particles.Zones || (Particles.Zones = {}));
        var Zones = Particles.Zones;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var World = (function () {
        function World(game, width, height) {
            this._groupCounter = 0;
            this.game = game;
            this.cameras = new Phaser.CameraManager(this.game, 0, 0, width, height);
            this.bounds = new Phaser.Rectangle(0, 0, width, height);
        }
        World.prototype.getNextGroupID = function () {
            return this._groupCounter++;
        };
        World.prototype.boot = function () {
            this.group = new Phaser.Group(this.game, 0);
        };
        World.prototype.update = function () {
            this.group.update();
            this.cameras.update();
        };
        World.prototype.postUpdate = function () {
            this.group.postUpdate();
            this.cameras.postUpdate();
        };
        World.prototype.destroy = function () {
            this.group.destroy();
            this.cameras.destroy();
        };
        World.prototype.setSize = function (width, height, updateCameraBounds) {
            if (typeof updateCameraBounds === "undefined") { updateCameraBounds = true; }
            this.bounds.width = width;
            this.bounds.height = height;
            if(updateCameraBounds == true) {
                this.game.camera.setBounds(0, 0, width, height);
            }
        };
        Object.defineProperty(World.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            set: function (value) {
                this.bounds.width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            set: function (value) {
                this.bounds.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(World.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });
        World.prototype.getAllCameras = function () {
            return this.cameras.getAll();
        };
        return World;
    })();
    Phaser.World = World;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Stage = (function () {
        function Stage(game, parent, width, height) {
            var _this = this;
            this._backgroundColor = 'rgb(0,0,0)';
            this.clear = true;
            this.disablePauseScreen = false;
            this.disableBootScreen = false;
            this.disableVisibilityChange = false;
            this.game = game;
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext('2d');
            Phaser.CanvasUtils.addToDOM(this.canvas, parent, true);
            Phaser.CanvasUtils.setTouchAction(this.canvas);
            this.canvas.oncontextmenu = function (event) {
                event.preventDefault();
            };
            this.css3 = new Phaser.Display.CSS3Filters(this.canvas);
            this.scaleMode = Phaser.StageScaleMode.NO_SCALE;
            this.scale = new Phaser.StageScaleMode(this.game, width, height);
            this.getOffset(this.canvas);
            this.bounds = new Phaser.Rectangle(this.offset.x, this.offset.y, width, height);
            this.aspectRatio = width / height;
            document.addEventListener('visibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('webkitvisibilitychange', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('pagehide', function (event) {
                return _this.visibilityChange(event);
            }, false);
            document.addEventListener('pageshow', function (event) {
                return _this.visibilityChange(event);
            }, false);
            window.onblur = function (event) {
                return _this.visibilityChange(event);
            };
            window.onfocus = function (event) {
                return _this.visibilityChange(event);
            };
        }
        Stage.prototype.boot = function () {
            this.bootScreen = new Phaser.BootScreen(this.game);
            this.pauseScreen = new Phaser.PauseScreen(this.game, this.width, this.height);
            this.orientationScreen = new Phaser.OrientationScreen(this.game);
            this.scale.setScreenSize(true);
        };
        Stage.prototype.update = function () {
            this.scale.update();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            if(this.clear || (this.game.paused && this.disablePauseScreen == false)) {
                if(this.game.device.patchAndroidClearRectBug) {
                    this.context.fillStyle = this._backgroundColor;
                    this.context.fillRect(0, 0, this.width, this.height);
                } else {
                    this.context.clearRect(0, 0, this.width, this.height);
                }
            }
            if(this.game.paused && this.scale.incorrectOrientation) {
                this.orientationScreen.update();
                this.orientationScreen.render();
                return;
            }
            if(this.game.isRunning == false && this.disableBootScreen == false) {
                this.bootScreen.update();
                this.bootScreen.render();
            }
            if(this.game.paused && this.disablePauseScreen == false) {
                this.pauseScreen.update();
                this.pauseScreen.render();
            }
        };
        Stage.prototype.visibilityChange = function (event) {
            if(this.disableVisibilityChange) {
                return;
            }
            if(event.type == 'pagehide' || event.type == 'blur' || document['hidden'] == true || document['webkitHidden'] == true) {
                if(this.game.paused == false) {
                    this.pauseGame();
                }
            } else {
                if(this.game.paused == true) {
                    this.resumeGame();
                }
            }
        };
        Stage.prototype.enableOrientationCheck = function (forceLandscape, forcePortrait, imageKey) {
            if (typeof imageKey === "undefined") { imageKey = ''; }
            this.scale.forceLandscape = forceLandscape;
            this.scale.forcePortrait = forcePortrait;
            this.orientationScreen.enable(forceLandscape, forcePortrait, imageKey);
            if(forceLandscape || forcePortrait) {
                if((this.scale.isLandscape && forcePortrait) || (this.scale.isPortrait && forceLandscape)) {
                    this.game.paused = true;
                    this.scale.incorrectOrientation = true;
                } else {
                    this.scale.incorrectOrientation = false;
                }
            }
        };
        Stage.prototype.pauseGame = function () {
            this.game.paused = true;
            if(this.disablePauseScreen == false && this.pauseScreen) {
                this.pauseScreen.onPaused();
            }
            this.saveCanvasValues();
        };
        Stage.prototype.resumeGame = function () {
            if(this.disablePauseScreen == false && this.pauseScreen) {
                this.pauseScreen.onResume();
            }
            this.restoreCanvasValues();
            this.game.paused = false;
        };
        Stage.prototype.getOffset = function (element, populateOffset) {
            if (typeof populateOffset === "undefined") { populateOffset = true; }
            var box = element.getBoundingClientRect();
            var clientTop = element.clientTop || document.body.clientTop || 0;
            var clientLeft = element.clientLeft || document.body.clientLeft || 0;
            var scrollTop = window.pageYOffset || element.scrollTop || document.body.scrollTop;
            var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;
            if(populateOffset) {
                this.offset = new Phaser.Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
                return this.offset;
            } else {
                return new Phaser.Point(box.left + scrollLeft - clientLeft, box.top + scrollTop - clientTop);
            }
        };
        Stage.prototype.saveCanvasValues = function () {
            this.strokeStyle = this.context.strokeStyle;
            this.lineWidth = this.context.lineWidth;
            this.fillStyle = this.context.fillStyle;
        };
        Stage.prototype.restoreCanvasValues = function () {
            this.context.strokeStyle = this.strokeStyle;
            this.context.lineWidth = this.lineWidth;
            this.context.fillStyle = this.fillStyle;
            if(this.game.device.patchAndroidClearRectBug) {
                this.context.fillStyle = this._backgroundColor;
                this.context.fillRect(0, 0, this.width, this.height);
            } else {
                this.context.clearRect(0, 0, this.width, this.height);
            }
        };
        Object.defineProperty(Stage.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (color) {
                this.canvas.style.backgroundColor = color;
                this._backgroundColor = color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "x", {
            get: function () {
                return this.bounds.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "y", {
            get: function () {
                return this.bounds.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "width", {
            get: function () {
                return this.bounds.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "height", {
            get: function () {
                return this.bounds.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "centerX", {
            get: function () {
                return this.bounds.halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "centerY", {
            get: function () {
                return this.bounds.halfHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "randomX", {
            get: function () {
                return Math.round(Math.random() * this.bounds.width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "randomY", {
            get: function () {
                return Math.round(Math.random() * this.bounds.height);
            },
            enumerable: true,
            configurable: true
        });
        return Stage;
    })();
    Phaser.Stage = Stage;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var State = (function () {
        function State(game) {
            this.game = game;
            this.add = game.add;
            this.camera = game.camera;
            this.cache = game.cache;
            this.input = game.input;
            this.load = game.load;
            this.math = game.math;
            this.sound = game.sound;
            this.stage = game.stage;
            this.time = game.time;
            this.tweens = game.tweens;
            this.world = game.world;
        }
        State.prototype.init = function () {
        };
        State.prototype.create = function () {
        };
        State.prototype.update = function () {
        };
        State.prototype.render = function () {
        };
        State.prototype.paused = function () {
        };
        State.prototype.destroy = function () {
        };
        return State;
    })();
    Phaser.State = State;    
})(Phaser || (Phaser = {}));
var Phaser;
(function (Phaser) {
    var Game = (function () {
        function Game(callbackContext, parent, width, height, preloadCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof parent === "undefined") { parent = ''; }
            if (typeof width === "undefined") { width = 800; }
            if (typeof height === "undefined") { height = 600; }
            if (typeof preloadCallback === "undefined") { preloadCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            var _this = this;
            this._loadComplete = false;
            this._paused = false;
            this._pendingState = null;
            this.state = null;
            this.onPreloadCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPreRenderCallback = null;
            this.onLoadUpdateCallback = null;
            this.onLoadRenderCallback = null;
            this.onPausedCallback = null;
            this.onDestroyCallback = null;
            this.isBooted = false;
            this.isRunning = false;
            this.id = Phaser.GAMES.push(this) - 1;
            this.callbackContext = callbackContext;
            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;
            if(document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(function () {
                    return Phaser.GAMES[_this.id].boot(parent, width, height);
                });
            } else {
                document.addEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot(parent, width, height), false);
                window.addEventListener('load', Phaser.GAMES[this.id].boot(parent, width, height), false);
            }
        }
        Game.prototype.boot = function (parent, width, height) {
            var _this = this;
            if(this.isBooted == true) {
                return;
            }
            if(!document.body) {
                setTimeout(function () {
                    return Phaser.GAMES[_this.id].boot(parent, width, height);
                }, 13);
            } else {
                document.removeEventListener('DOMContentLoaded', Phaser.GAMES[this.id].boot);
                window.removeEventListener('load', Phaser.GAMES[this.id].boot);
                this.onPause = new Phaser.Signal();
                this.onResume = new Phaser.Signal();
                this.device = new Phaser.Device();
                this.net = new Phaser.Net(this);
                this.math = new Phaser.GameMath(this);
                this.stage = new Phaser.Stage(this, parent, width, height);
                this.world = new Phaser.World(this, width, height);
                this.add = new Phaser.GameObjectFactory(this);
                this.cache = new Phaser.Cache(this);
                this.load = new Phaser.Loader(this);
                this.time = new Phaser.TimeManager(this);
                this.tweens = new Phaser.TweenManager(this);
                this.input = new Phaser.InputManager(this);
                this.sound = new Phaser.SoundManager(this);
                this.rnd = new Phaser.RandomDataGenerator([
                    (Date.now() * Math.random()).toString()
                ]);
                this.physics = new Phaser.Physics.PhysicsManager(this);
                this.plugins = new Phaser.PluginManager(this, this);
                this.load.onLoadComplete.add(this.loadComplete, this);
                this.setRenderer(Phaser.Types.RENDERER_CANVAS);
                this.world.boot();
                this.stage.boot();
                this.input.boot();
                this.isBooted = true;
                Phaser.DebugUtils.game = this;
                Phaser.ColorUtils.game = this;
                Phaser.DebugUtils.context = this.stage.context;
                if(this.onPreloadCallback == null && this.onCreateCallback == null && this.onUpdateCallback == null && this.onRenderCallback == null && this._pendingState == null) {
                    this._raf = new Phaser.RequestAnimationFrame(this, this.bootLoop);
                } else {
                    this.isRunning = true;
                    this._loadComplete = false;
                    this._raf = new Phaser.RequestAnimationFrame(this, this.loop);
                    if(this._pendingState) {
                        this.switchState(this._pendingState, false, false);
                    } else {
                        this.startState();
                    }
                }
            }
        };
        Game.prototype.loadComplete = function () {
            this._loadComplete = true;
            this.onCreateCallback.call(this.callbackContext);
        };
        Game.prototype.bootLoop = function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
        };
        Game.prototype.pausedLoop = function () {
            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.sound.update();
            if(this.onPausedCallback !== null) {
                this.onPausedCallback.call(this.callbackContext);
            }
        };
        Game.prototype.loop = function () {
            this.plugins.preUpdate();
            this.tweens.update();
            this.input.update();
            this.stage.update();
            this.sound.update();
            this.physics.update();
            this.world.update();
            this.plugins.update();
            if(this._loadComplete && this.onUpdateCallback) {
                this.onUpdateCallback.call(this.callbackContext);
            } else if(this._loadComplete == false && this.onLoadUpdateCallback) {
                this.onLoadUpdateCallback.call(this.callbackContext);
            }
            this.world.postUpdate();
            this.plugins.postUpdate();
            this.plugins.preRender();
            if(this._loadComplete && this.onPreRenderCallback) {
                this.onPreRenderCallback.call(this.callbackContext);
            }
            this.renderer.render();
            this.plugins.render();
            if(this._loadComplete && this.onRenderCallback) {
                this.onRenderCallback.call(this.callbackContext);
            } else if(this._loadComplete == false && this.onLoadRenderCallback) {
                this.onLoadRenderCallback.call(this.callbackContext);
            }
            this.plugins.postRender();
        };
        Game.prototype.startState = function () {
            if(this.onPreloadCallback !== null) {
                this.load.reset();
                this.onPreloadCallback.call(this.callbackContext);
                if(this.load.queueSize == 0) {
                    if(this.onCreateCallback !== null) {
                        this.onCreateCallback.call(this.callbackContext);
                    }
                    this._loadComplete = true;
                } else {
                    this.load.onLoadComplete.add(this.loadComplete, this);
                    this.load.start();
                }
            } else {
                if(this.onCreateCallback !== null) {
                    this.onCreateCallback.call(this.callbackContext);
                }
                this._loadComplete = true;
            }
        };
        Game.prototype.setRenderer = function (renderer) {
            switch(renderer) {
                case Phaser.Types.RENDERER_AUTO_DETECT:
                    this.renderer = new Phaser.Renderer.Headless.HeadlessRenderer(this);
                    break;
                case Phaser.Types.RENDERER_AUTO_DETECT:
                case Phaser.Types.RENDERER_CANVAS:
                    this.renderer = new Phaser.Renderer.Canvas.CanvasRenderer(this);
                    break;
            }
        };
        Game.prototype.setCallbacks = function (preloadCallback, createCallback, updateCallback, renderCallback, destroyCallback) {
            if (typeof preloadCallback === "undefined") { preloadCallback = null; }
            if (typeof createCallback === "undefined") { createCallback = null; }
            if (typeof updateCallback === "undefined") { updateCallback = null; }
            if (typeof renderCallback === "undefined") { renderCallback = null; }
            if (typeof destroyCallback === "undefined") { destroyCallback = null; }
            this.onPreloadCallback = preloadCallback;
            this.onCreateCallback = createCallback;
            this.onUpdateCallback = updateCallback;
            this.onRenderCallback = renderCallback;
            this.onDestroyCallback = destroyCallback;
        };
        Game.prototype.switchState = function (state, clearWorld, clearCache) {
            if (typeof clearWorld === "undefined") { clearWorld = true; }
            if (typeof clearCache === "undefined") { clearCache = false; }
            if(this.isBooted == false) {
                this._pendingState = state;
                return;
            }
            if(this.onDestroyCallback !== null) {
                this.onDestroyCallback.call(this.callbackContext);
            }
            this.input.reset(true);
            if(typeof state === 'function') {
                this.state = new state(this);
            }
            if(this.state['create'] || this.state['update']) {
                this.callbackContext = this.state;
                this.onPreloadCallback = null;
                this.onLoadRenderCallback = null;
                this.onLoadUpdateCallback = null;
                this.onCreateCallback = null;
                this.onUpdateCallback = null;
                this.onRenderCallback = null;
                this.onPreRenderCallback = null;
                this.onPausedCallback = null;
                this.onDestroyCallback = null;
                if(this.state['preload']) {
                    this.onPreloadCallback = this.state['preload'];
                }
                if(this.state['loadRender']) {
                    this.onLoadRenderCallback = this.state['loadRender'];
                }
                if(this.state['loadUpdate']) {
                    this.onLoadUpdateCallback = this.state['loadUpdate'];
                }
                if(this.state['create']) {
                    this.onCreateCallback = this.state['create'];
                }
                if(this.state['update']) {
                    this.onUpdateCallback = this.state['update'];
                }
                if(this.state['preRender']) {
                    this.onPreRenderCallback = this.state['preRender'];
                }
                if(this.state['render']) {
                    this.onRenderCallback = this.state['render'];
                }
                if(this.state['paused']) {
                    this.onPausedCallback = this.state['paused'];
                }
                if(this.state['destroy']) {
                    this.onDestroyCallback = this.state['destroy'];
                }
                if(clearWorld) {
                    this.world.destroy();
                    if(clearCache == true) {
                        this.cache.destroy();
                    }
                }
                this._loadComplete = false;
                this.startState();
            } else {
                throw new Error("Invalid State object given. Must contain at least a create or update function.");
            }
        };
        Game.prototype.destroy = function () {
            this.callbackContext = null;
            this.onPreloadCallback = null;
            this.onLoadRenderCallback = null;
            this.onLoadUpdateCallback = null;
            this.onCreateCallback = null;
            this.onUpdateCallback = null;
            this.onRenderCallback = null;
            this.onPausedCallback = null;
            this.onDestroyCallback = null;
            this.cache = null;
            this.input = null;
            this.load = null;
            this.sound = null;
            this.stage = null;
            this.time = null;
            this.world = null;
            this.isBooted = false;
        };
        Object.defineProperty(Game.prototype, "paused", {
            get: function () {
                return this._paused;
            },
            set: function (value) {
                if(value == true && this._paused == false) {
                    this._paused = true;
                    this.onPause.dispatch();
                    this.sound.pauseAll();
                    this._raf.callback = this.pausedLoop;
                } else if(value == false && this._paused == true) {
                    this._paused = false;
                    this.onResume.dispatch();
                    this.input.reset();
                    this.sound.resumeAll();
                    if(this.isRunning == false) {
                        this._raf.callback = this.bootLoop;
                    } else {
                        this._raf.callback = this.loop;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "camera", {
            get: function () {
                return this.world.cameras.current;
            },
            enumerable: true,
            configurable: true
        });
        return Game;
    })();
    Phaser.Game = Game;    
})(Phaser || (Phaser = {}));
