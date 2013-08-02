var Phaser;
(function (Phaser) {
    /// <reference path="../Game.ts" />
    /// <reference path="Body.ts" />
    /// <reference path="joints/Joint.ts" />
    /// <reference path="Space.ts" />
    /**
    * Phaser - Physics Manager
    *
    * The Physics Manager is responsible for looking after, creating and colliding
    * all of the physics bodies and joints in the world.
    */
    (function (Physics) {
        var AdvancedPhysics = (function () {
            function AdvancedPhysics(game) {
                this.lastTime = Date.now();
                this.frameRateHz = 60;
                this.timeDelta = 0;
                this.paused = false;
                this.step = false;
                // step through the simulation (i.e. per click)
                //public paused: bool = true;
                //public step: bool = false; // step through the simulation (i.e. per click)
                this.velocityIterations = 8;
                this.positionIterations = 4;
                this.allowSleep = true;
                this.warmStarting = true;
                this.game = game;
                this.gravity = new Phaser.Vec2();
                this.space = new Physics.Space(this);
                this.collision = new Physics.Collision();
            }
            AdvancedPhysics.clear = function clear() {
                //Manager.debug.textContent = "";
                Physics.Manager.log = [];
            };
            AdvancedPhysics.write = function write(s) {
                //Manager.debug.textContent += s + "\n";
                            };
            AdvancedPhysics.writeAll = function writeAll() {
                for(var i = 0; i < Physics.Manager.log.length; i++) {
                    //Manager.debug.textContent += Manager.log[i];
                                    }
            };
            AdvancedPhysics.log = [];
            AdvancedPhysics.dump = function dump(phase, body) {
                /*
                var s = "\n\nPhase: " + phase + "\n";
                s += "Position: " + body.position.toString() + "\n";
                s += "Velocity: " + body.velocity.toString() + "\n";
                s += "Angle: " + body.angle + "\n";
                s += "Force: " + body.force.toString() + "\n";
                s += "Torque: " + body.torque + "\n";
                s += "Bounds: " + body.bounds.toString() + "\n";
                s += "Shape ***\n";
                s += "Vert 0: " + body.shapes[0].verts[0].toString() + "\n";
                s += "Vert 1: " + body.shapes[0].verts[1].toString() + "\n";
                s += "Vert 2: " + body.shapes[0].verts[2].toString() + "\n";
                s += "Vert 3: " + body.shapes[0].verts[3].toString() + "\n";
                s += "TVert 0: " + body.shapes[0].tverts[0].toString() + "\n";
                s += "TVert 1: " + body.shapes[0].tverts[1].toString() + "\n";
                s += "TVert 2: " + body.shapes[0].tverts[2].toString() + "\n";
                s += "TVert 3: " + body.shapes[0].tverts[3].toString() + "\n";
                s += "Plane 0: " + body.shapes[0].planes[0].normal.toString() + "\n";
                s += "Plane 1: " + body.shapes[0].planes[1].normal.toString() + "\n";
                s += "Plane 2: " + body.shapes[0].planes[2].normal.toString() + "\n";
                s += "Plane 3: " + body.shapes[0].planes[3].normal.toString() + "\n";
                s += "TPlane 0: " + body.shapes[0].tplanes[0].normal.toString() + "\n";
                s += "TPlane 1: " + body.shapes[0].tplanes[1].normal.toString() + "\n";
                s += "TPlane 2: " + body.shapes[0].tplanes[2].normal.toString() + "\n";
                s += "TPlane 3: " + body.shapes[0].tplanes[3].normal.toString() + "\n";
                
                Manager.log.push(s);
                */
                            };
            AdvancedPhysics.SHAPE_TYPE_CIRCLE = 0;
            AdvancedPhysics.SHAPE_TYPE_SEGMENT = 1;
            AdvancedPhysics.SHAPE_TYPE_POLY = 2;
            AdvancedPhysics.SHAPE_NUM_TYPES = 3;
            AdvancedPhysics.JOINT_TYPE_ANGLE = 0;
            AdvancedPhysics.JOINT_TYPE_REVOLUTE = 1;
            AdvancedPhysics.JOINT_TYPE_WELD = 2;
            AdvancedPhysics.JOINT_TYPE_WHEEL = 3;
            AdvancedPhysics.JOINT_TYPE_PRISMATIC = 4;
            AdvancedPhysics.JOINT_TYPE_DISTANCE = 5;
            AdvancedPhysics.JOINT_TYPE_ROPE = 6;
            AdvancedPhysics.JOINT_TYPE_MOUSE = 7;
            AdvancedPhysics.JOINT_LINEAR_SLOP = 0.0008;
            AdvancedPhysics.JOINT_ANGULAR_SLOP = 2 * 0.017453292519943294444444444444444;
            AdvancedPhysics.JOINT_MAX_LINEAR_CORRECTION = 0.5;
            AdvancedPhysics.JOINT_MAX_ANGULAR_CORRECTION = 8 * 0.017453292519943294444444444444444;
            AdvancedPhysics.JOINT_LIMIT_STATE_INACTIVE = 0;
            AdvancedPhysics.JOINT_LIMIT_STATE_AT_LOWER = 1;
            AdvancedPhysics.JOINT_LIMIT_STATE_AT_UPPER = 2;
            AdvancedPhysics.JOINT_LIMIT_STATE_EQUAL_LIMITS = 3;
            AdvancedPhysics.CONTACT_SOLVER_COLLISION_SLOP = 0.0008;
            AdvancedPhysics.CONTACT_SOLVER_BAUMGARTE = 0.28;
            AdvancedPhysics.CONTACT_SOLVER_MAX_LINEAR_CORRECTION = 1;
            AdvancedPhysics.bodyCounter = 0;
            AdvancedPhysics.jointCounter = 0;
            AdvancedPhysics.shapeCounter = 0;
            AdvancedPhysics.prototype.update = function () {
                //  Get these from Phaser.Time instead
                var time = Date.now();
                var frameTime = (time - this.lastTime) / 1000;
                this.lastTime = time;
                //  if rAf - why?
                frameTime = Math.floor(frameTime * 60 + 0.5) / 60;
                //if (!mouseDown)
                //{
                //    var p = canvasToWorld(mousePosition);
                //    var body = space.findBodyByPoint(p);
                //    //domCanvas.style.cursor = body ? "pointer" : "default";
                //}
                if(!this.paused || this.step) {
                    Physics.Manager.clear();
                    var h = 1 / this.frameRateHz;
                    this.timeDelta += frameTime;
                    if(this.step) {
                        this.step = false;
                        this.timeDelta = h;
                    }
                    for(var maxSteps = 4; maxSteps > 0 && this.timeDelta >= h; maxSteps--) {
                        this.space.step(h, this.velocityIterations, this.positionIterations, this.warmStarting, this.allowSleep);
                        this.timeDelta -= h;
                    }
                    if(this.timeDelta > h) {
                        this.timeDelta = 0;
                    }
                }
                //frameCount++;
                            };
            AdvancedPhysics.prototype.addBody = function (body) {
                this.space.addBody(body);
            };
            AdvancedPhysics.prototype.removeBody = function (body) {
                this.space.removeBody(body);
            };
            AdvancedPhysics.prototype.addJoint = function (joint) {
                this.space.addJoint(joint);
            };
            AdvancedPhysics.prototype.removeJoint = function (joint) {
                this.space.removeJoint(joint);
            };
            AdvancedPhysics.prototype.pixelsToMeters = function (value) {
                return value * 0.02;
            };
            AdvancedPhysics.prototype.metersToPixels = function (value) {
                return value * 50;
            };
            AdvancedPhysics.pixelsToMeters = function pixelsToMeters(value) {
                return value * 0.02;
            };
            AdvancedPhysics.metersToPixels = function metersToPixels(value) {
                return value * 50;
            };
            AdvancedPhysics.p2m = function p2m(value) {
                return value * 0.02;
            };
            AdvancedPhysics.m2p = function m2p(value) {
                return value * 50;
            };
            AdvancedPhysics.areaForCircle = function areaForCircle(radius_outer, radius_inner) {
                return Math.PI * (radius_outer * radius_outer - radius_inner * radius_inner);
            };
            AdvancedPhysics.inertiaForCircle = function inertiaForCircle(mass, center, radius_outer, radius_inner) {
                return mass * ((radius_outer * radius_outer + radius_inner * radius_inner) * 0.5 + center.lengthSq());
            };
            AdvancedPhysics.areaForSegment = function areaForSegment(a, b, radius) {
                return radius * (Math.PI * radius + 2 * Phaser.Vec2Utils.distance(a, b));
            };
            AdvancedPhysics.centroidForSegment = function centroidForSegment(a, b) {
                return Phaser.Vec2Utils.scale(Phaser.Vec2Utils.add(a, b), 0.5);
            };
            AdvancedPhysics.inertiaForSegment = function inertiaForSegment(mass, a, b) {
                var distsq = Phaser.Vec2Utils.distanceSq(b, a);
                var offset = Phaser.Vec2Utils.scale(Phaser.Vec2Utils.add(a, b), 0.5);
                return mass * (distsq / 12 + offset.lengthSq());
            };
            AdvancedPhysics.areaForPoly = function areaForPoly(verts) {
                var area = 0;
                for(var i = 0; i < verts.length; i++) {
                    area += Phaser.Vec2Utils.cross(verts[i], verts[(i + 1) % verts.length]);
                }
                return area / 2;
            };
            AdvancedPhysics.centroidForPoly = function centroidForPoly(verts) {
                var area = 0;
                var vsum = new Phaser.Vec2();
                for(var i = 0; i < verts.length; i++) {
                    var v1 = verts[i];
                    var v2 = verts[(i + 1) % verts.length];
                    var cross = Phaser.Vec2Utils.cross(v1, v2);
                    area += cross;
                    //  SO many vecs created here - unroll these bad boys
                    vsum.add(Phaser.Vec2Utils.scale(Phaser.Vec2Utils.add(v1, v2), cross));
                }
                return Phaser.Vec2Utils.scale(vsum, 1 / (3 * area));
            };
            AdvancedPhysics.inertiaForPoly = function inertiaForPoly(mass, verts, offset) {
                var sum1 = 0;
                var sum2 = 0;
                for(var i = 0; i < verts.length; i++) {
                    var v1 = Phaser.Vec2Utils.add(verts[i], offset);
                    var v2 = Phaser.Vec2Utils.add(verts[(i + 1) % verts.length], offset);
                    var a = Phaser.Vec2Utils.cross(v2, v1);
                    var b = Phaser.Vec2Utils.dot(v1, v1) + Phaser.Vec2Utils.dot(v1, v2) + Phaser.Vec2Utils.dot(v2, v2);
                    sum1 += a * b;
                    sum2 += a;
                }
                return (mass * sum1) / (6 * sum2);
            };
            AdvancedPhysics.inertiaForBox = function inertiaForBox(mass, w, h) {
                return mass * (w * w + h * h) / 12;
            };
            AdvancedPhysics.createConvexHull = // Create the convex hull using the Gift wrapping algorithm (http://en.wikipedia.org/wiki/Gift_wrapping_algorithm)
            function createConvexHull(points) {
                // Find the right most point on the hull
                var i0 = 0;
                var x0 = points[0].x;
                for(var i = 1; i < points.length; i++) {
                    var x = points[i].x;
                    if(x > x0 || (x == x0 && points[i].y < points[i0].y)) {
                        i0 = i;
                        x0 = x;
                    }
                }
                var n = points.length;
                var hull = [];
                var m = 0;
                var ih = i0;
                while(1) {
                    hull[m] = ih;
                    var ie = 0;
                    for(var j = 1; j < n; j++) {
                        if(ie == ih) {
                            ie = j;
                            continue;
                        }
                        var r = Phaser.Vec2Utils.subtract(points[ie], points[hull[m]]);
                        var v = Phaser.Vec2Utils.subtract(points[j], points[hull[m]]);
                        var c = Phaser.Vec2Utils.cross(r, v);
                        if(c < 0) {
                            ie = j;
                        }
                        // Collinearity check
                        if(c == 0 && v.lengthSq() > r.lengthSq()) {
                            ie = j;
                        }
                    }
                    m++;
                    ih = ie;
                    if(ie == i0) {
                        break;
                    }
                }
                // Copy vertices
                var newPoints = [];
                for(var i = 0; i < m; ++i) {
                    newPoints.push(points[hull[i]]);
                }
                return newPoints;
            };
            return AdvancedPhysics;
        })();
        Physics.AdvancedPhysics = AdvancedPhysics;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
