/// <reference path="../../Game.ts" />
/// <reference path="Body.ts" />
/// <reference path="Joint.ts" />

/**
* Phaser - Advanced Physics Manager
*
* Your game only has one PhysicsManager instance and it's responsible for looking after, creating and colliding
* all of the physics objects in the world.
*/

module Phaser.Physics.Advanced {

    export class Manager {

        constructor(game: Game) {

            this.game = game;

            this.space = new Space();

            Manager.collision = new Collision();

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        public static collision: Collision;

        public static SHAPE_TYPE_CIRCLE: number = 0;
        public static SHAPE_TYPE_SEGMENT: number = 1;
        public static SHAPE_TYPE_POLY: number = 2;
        public static SHAPE_NUM_TYPES: number = 3;

        public static JOINT_TYPE_ANGLE: number = 0;
        public static JOINT_TYPE_REVOLUTE: number = 1;
        public static JOINT_TYPE_WELD: number = 2;
        public static JOINT_TYPE_WHEEL: number = 3;
        public static JOINT_TYPE_PRISMATIC: number = 4;
        public static JOINT_TYPE_DISTANCE: number = 5;
        public static JOINT_TYPE_ROPE: number = 6;
        public static JOINT_TYPE_MOUSE: number = 7;

        public static JOINT_LINEAR_SLOP: number = 0.0008;
        public static JOINT_ANGULAR_SLOP: number = 2 * Phaser.GameMath.DEG_TO_RAD;
        public static JOINT_MAX_LINEAR_CORRECTION: number = 0.5;
        public static JOINT_MAX_ANGULAR_CORRECTION: number = 8 * Phaser.GameMath.DEG_TO_RAD;

        public static JOINT_LIMIT_STATE_INACTIVE: number = 0;
        public static JOINT_LIMIT_STATE_AT_LOWER: number = 1;
        public static JOINT_LIMIT_STATE_AT_UPPER: number = 2;
        public static JOINT_LIMIT_STATE_EQUAL_LIMITS: number = 3;

        public static CONTACT_SOLVER_COLLISION_SLOP: number = 0.0008;
        public static CONTACT_SOLVER_BAUMGARTE: number = 0.28;
        public static CONTACT_SOLVER_MAX_LINEAR_CORRECTION: number = 1;//Infinity;

        public static bodyCounter: number = 0;
        public static jointCounter: number = 0;
        public static shapeCounter: number = 0;

        public space: Space;
        public lastTime: number = 0;
        public frameRateHz: number = 60;
        public timeDelta: number = 0;
        public paused: bool = false;
        public step: bool = false; // step through the simulation (i.e. per click)
        public velocityIterations: number = 8;
        public positionIterations: number = 4;
        public allowSleep: bool = true;
        public warmStarting: bool = true;

        public update() {

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

            if (!this.paused || this.step)
            {
                var h = 1 / this.frameRateHz;

                this.timeDelta += frameTime;

                if (this.step)
                {
                    this.step = false;
                    this.timeDelta = h;
                }

                for (var maxSteps = 4; maxSteps > 0 && this.timeDelta >= h; maxSteps--)
                {
                    this.space.step(h, this.velocityIterations, this.positionIterations, this.warmStarting, this.allowSleep);
                    this.timeDelta -= h;
                }

                if (this.timeDelta > h)
                {
                    this.timeDelta = 0;
                }

                //if (sceneIndex < demoArr.length)
                //{
                //    demo = demoArr[sceneIndex];
                //    demo.runFrame();
                //}
            }

            //frameCount++;

        }


























        public static pixelsToMeters(value: number): number {
            return value * 0.02;
        }

        public static metersToPixels(value: number): number {
            return value * 50;
        }

        public static p2m(value: number): number {
            return value * 0.02;
        }

        public static m2p(value: number): number {
            return value * 50;
        }

        public static areaForCircle(radius_outer, radius_inner) {
            return Math.PI * (radius_outer * radius_outer - radius_inner * radius_inner);
        }

        public static inertiaForCircle(mass, center, radius_outer, radius_inner) {
            return mass * ((radius_outer * radius_outer + radius_inner * radius_inner) * 0.5 + center.lengthSq());
        }

        public static areaForSegment(a, b, radius) {
            return radius * (Math.PI * radius + 2 * Phaser.Vec2Utils.distance(a, b));
        }

        public static centroidForSegment(a, b) {
            return Phaser.Vec2Utils.scale(Phaser.Vec2Utils.add(a, b), 0.5);
        }

        public static inertiaForSegment(mass, a, b) {

            var distsq = Phaser.Vec2Utils.distanceSq(b, a);
            var offset: Phaser.Vec2 = Phaser.Vec2Utils.scale(Phaser.Vec2Utils.add(a, b), 0.5);

            return mass * (distsq / 12 + offset.lengthSq());
        }

        public static areaForPoly(verts) {

            var area = 0;

            for (var i = 0; i < verts.length; i++)
            {
                area += Phaser.Vec2Utils.cross(verts[i], verts[(i + 1) % verts.length]);
            }

            return area / 2;
        }

        public static centroidForPoly(verts) {

            var area = 0;
            var vsum = new Phaser.Vec2;

            for (var i = 0; i < verts.length; i++)
            {
                var v1 = verts[i];
                var v2 = verts[(i + 1) % verts.length];
                var cross = Phaser.Vec2Utils.cross(v1, v2);

                area += cross;

                //  SO many vecs created here - unroll these bad boys
                vsum.add(Phaser.Vec2Utils.scale(Phaser.Vec2Utils.add(v1, v2), cross));
            }

            return Phaser.Vec2Utils.scale(vsum, 1 / (3 * area));
        }

        public static inertiaForPoly(mass, verts, offset) {

            var sum1 = 0;
            var sum2 = 0;

            for (var i = 0; i < verts.length; i++)
            {
                var v1 = Phaser.Vec2Utils.add(verts[i], offset);
                var v2 = Phaser.Vec2Utils.add(verts[(i + 1) % verts.length], offset);

                var a = Phaser.Vec2Utils.cross(v2, v1);
                var b = Phaser.Vec2Utils.dot(v1, v1) + Phaser.Vec2Utils.dot(v1, v2) + Phaser.Vec2Utils.dot(v2, v2);

                sum1 += a * b;
                sum2 += a;
            }

            return (mass * sum1) / (6 * sum2);
        }

        public static inertiaForBox(mass, w, h) {
            return mass * (w * w + h * h) / 12;
        }

        // Create the convex hull using the Gift wrapping algorithm (http://en.wikipedia.org/wiki/Gift_wrapping_algorithm)
        public static createConvexHull(points) {

            // Find the right most point on the hull
            var i0 = 0;
            var x0 = points[0].x;

            for (var i = 1; i < points.length; i++)
            {
                var x = points[i].x;

                if (x > x0 || (x == x0 && points[i].y < points[i0].y))
                {
                    i0 = i;
                    x0 = x;
                }
            }

            var n = points.length;
            var hull = [];
            var m = 0;
            var ih = i0;

            while (1)
            {
                hull[m] = ih;

                var ie = 0;

                for (var j = 1; j < n; j++)
                {
                    if (ie == ih)
                    {
                        ie = j;
                        continue;
                    }

                    var r = Phaser.Vec2Utils.subtract(points[ie], points[hull[m]]);
                    var v = Phaser.Vec2Utils.subtract(points[j], points[hull[m]]);
                    var c = Phaser.Vec2Utils.cross(r, v);

                    if (c < 0)
                    {
                        ie = j;
                    }

                    // Collinearity check
                    if (c == 0 && v.lengthSq() > r.lengthSq())
                    {
                        ie = j;
                    }
                }

                m++;
                ih = ie;

                if (ie == i0)
                {
                    break;
                }
            }

            // Copy vertices
            var newPoints = [];

            for (var i = 0; i < m; ++i)
            {
                newPoints.push(points[hull[i]]);
            }

            return newPoints;
        }

    }

}