/// <reference path="Game.ts" />
/// <reference path="geom/Vector2.ts" />
/// <reference path="verlet/Composite.ts" />
/// <reference path="verlet/Particle.ts" />
/// <reference path="verlet/DistanceConstraint.ts" />
/// <reference path="verlet/PinConstraint.ts" />
/// <reference path="verlet/AngleConstraint.ts" />

/**
* Phaser - Verlet
*
* Based on verlet-js by Sub Protocol released under MIT
*/

module Phaser.Verlet {

    export class VerletManager {

        /**
        * Creates a new Vector2 object.
        * @class Vector2
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {Vector2} This object
        **/
        constructor(game: Game, width: number, height: number) {

            this._game = game;
            this.width = width;
            this.height = height;
            this.gravity = new Vector2(0, 0.2);
            this.friction = 0.99;
            this.groundFriction = 0.8;

            this.canvas = game.stage.canvas;
            this.context = game.stage.context;

            this._game.input.onDown.add(this.mouseDownHandler, this);
            this._game.input.onUp.add(this.mouseUpHandler, this);

        }

        private _game: Game;
        private _v = new Phaser.Vector2;

        public composites = [];

        public width: number;
        public height: number;
        public step: number = 16;
        public gravity: Vector2;
        public friction: number;
        public groundFriction: number;
        public selectionRadius: number = 20;
        public draggedEntity = null;
        public highlightColor = '#4f545c';

        /**
         * A reference to the canvas this renders to
         * @type {HTMLCanvasElement}
         */
        public canvas: HTMLCanvasElement;

        /**
         * A reference to the context this renders to
         * @type {CanvasRenderingContext2D}
         */
        public context: CanvasRenderingContext2D;

        /**
        * Computes time of intersection of a particle with a wall
        *
        * @param {Vec2} line    walls root position
        * @param {Vec2} p       particle position
        * @param {Vec2} dir     walls direction
        * @param {Vec2} v       particles velocity
        */
        public intersectionTime(wall, p, dir, v) {

            if (dir.x != 0)
            {
                var denominator = v.y - dir.y * v.x / dir.x;
                if (denominator == 0) return undefined; // Movement is parallel to wall
                var numerator = wall.y + dir.y * (p.x - wall.x) / dir.x - p.y;
                return numerator / denominator;
            }
            else
            {
                if (v.x == 0) return undefined; // parallel again
                var denominator = v.x;
                var numerator = wall.x - p.x;
                return numerator / denominator;
            }

        }

        public intersectionPoint(wall, p, dir, v) {
            var t = this.intersectionTime(wall, p, dir, v);
            return new Phaser.Vector2(p.x + v.x * t, p.y + v.y * t);
        }

        public bounds(particle: Phaser.Verlet.Particle) {

            this._v.mutableSet(particle.pos);
            this._v.mutableSub(particle.lastPos);

            if (particle.pos.y > this.height - 1)
            {
                particle.pos.mutableSet(this.intersectionPoint(new Phaser.Vector2(0, this.height - 1), particle.lastPos, new Phaser.Vector2(1, 0), this._v));
            }

            if (particle.pos.x < 0)
            {
                particle.pos.mutableSet(this.intersectionPoint(new Phaser.Vector2(0, 0), particle.pos, new Phaser.Vector2(0, 1), this._v));
            }

            if (particle.pos.x > this.width - 1)
            {
                particle.pos.mutableSet(this.intersectionPoint(new Phaser.Vector2(this.width - 1, 0), particle.pos, new Phaser.Vector2(0, 1), this._v));
            }
        }

        public createPoint(pos: Vector2) {

            var composite = new Phaser.Verlet.Composite(this._game);

            composite.particles.push(new Phaser.Verlet.Particle(pos));

            this.composites.push(composite);

            return composite;

        }

        public createLineSegments(vertices, stiffness) {

            var composite = new Phaser.Verlet.Composite(this._game);
            var i;

            for (i in vertices)
            {
                composite.particles.push(new Phaser.Verlet.Particle(vertices[i]));

                if (i > 0)
                {
                    composite.constraints.push(new Phaser.Verlet.DistanceConstraint(composite.particles[i], composite.particles[i - 1], stiffness));
                }
            }

            this.composites.push(composite);

            return composite;

        }

        public createCloth(origin, width, height, segments, pinMod, stiffness) {

            var composite = new Phaser.Verlet.Composite(this._game);

            var xStride = width / segments;
            var yStride = height / segments;

            var x;
            var y;

            for (y = 0; y < segments; ++y)
            {
                for (x = 0; x < segments; ++x)
                {
                    var px = origin.x + x * xStride - width / 2 + xStride / 2;
                    var py = origin.y + y * yStride - height / 2 + yStride / 2;

                    composite.particles.push(new Phaser.Verlet.Particle(new Vector2(px, py)));

                    if (x > 0)
                    {
                        composite.constraints.push(new Phaser.Verlet.DistanceConstraint(composite.particles[y * segments + x], composite.particles[y * segments + x - 1], stiffness));
                    }

                    if (y > 0)
                    {
                        composite.constraints.push(new Phaser.Verlet.DistanceConstraint(composite.particles[y * segments + x], composite.particles[(y - 1) * segments + x], stiffness));
                    }
                }
            }

            for (x = 0; x < segments; ++x)
            {
                if (x % pinMod == 0)
                {
                    composite.pin(x);
                }
            }

            this.composites.push(composite);

            return composite;

        }

        public createTire(origin, radius, segments, spokeStiffness, treadStiffness) {

            var stride = (2 * Math.PI) / segments;
            var i;

            var composite = new Phaser.Verlet.Composite(this._game);

            // particles
            for (i = 0; i < segments; ++i)
            {
                var theta = i * stride;
                composite.particles.push(new Particle(new Vector2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius)));
            }

            var center = new Particle(origin);
            composite.particles.push(center);

            // constraints
            for (i = 0; i < segments; ++i)
            {
                composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i + 1) % segments], treadStiffness));
                composite.constraints.push(new DistanceConstraint(composite.particles[i], center, spokeStiffness))
                composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i + 5) % segments], treadStiffness));
            }

            this.composites.push(composite);

            return composite;
        }

        public update() {

            if (this.composites.length == 0)
            {
                return;
            }

            var i, j, c;

            for (c in this.composites)
            {
                for (i in this.composites[c].particles)
                {
                    var particles = this.composites[c].particles;

                    // calculate velocity
                    var velocity = particles[i].pos.sub(particles[i].lastPos).scale(this.friction);

                    // ground friction
                    if (particles[i].pos.y >= this.height - 1 && velocity.length2() > 0.000001)
                    {
                        var m = velocity.length();
                        velocity.x /= m;
                        velocity.y /= m;
                        velocity.mutableScale(m * this.groundFriction);
                    }

                    // save last good state
                    particles[i].lastPos.mutableSet(particles[i].pos);

                    // gravity
                    particles[i].pos.mutableAdd(this.gravity);

                    // inertia	
                    particles[i].pos.mutableAdd(velocity);
                }
            }

            // handle dragging of entities
            if (this.draggedEntity)
            {
                this.draggedEntity.pos.mutableSet(this._game.input.position);
            }

            // relax
            var stepCoef = 1 / this.step;

            for (c in this.composites)
            {
                var constraints = this.composites[c].constraints;

                for (i = 0; i < this.step; ++i)
                {
                    for (j in constraints)
                    {
                        constraints[j].relax(stepCoef);
                    }
                }
            }

            // bounds checking
            for (c in this.composites)
            {
                var particles = this.composites[c].particles;

                for (i in particles)
                {
                    this.bounds(particles[i]);
                }
            }

        }

        private mouseDownHandler() {

            var nearest = this.nearestEntity();

            if (nearest)
            {
                this.draggedEntity = nearest;
            }
        }

        private mouseUpHandler() {
            this.draggedEntity = null;
        }

        public nearestEntity() {

            var c, i;
            var d2Nearest = 0;
            var entity = null;
            var constraintsNearest = null;

            // find nearest point
            for (c in this.composites)
            {
                var particles = this.composites[c].particles;

                for (i in particles)
                {
                    var d2 = particles[i].pos.distance2(this._game.input.position);

                    if (d2 <= this.selectionRadius * this.selectionRadius && (entity == null || d2 < d2Nearest))
                    {
                        entity = particles[i];
                        constraintsNearest = this.composites[c].constraints;
                        d2Nearest = d2;
                    }
                }
            }

            // search for pinned constraints for this entity
            for (i in constraintsNearest)
            {
                if (constraintsNearest[i] instanceof PinConstraint && constraintsNearest[i].a == entity)
                {
                    entity = constraintsNearest[i];
                }
            }

            return entity;

        }

        public hideNearestEntityCircle: bool = false;

        public render() {

            var i, c;

            for (c in this.composites)
            {
                // draw constraints
                if (this.composites[c].drawConstraints)
                {
                    this.composites[c].drawConstraints(this.context, this.composites[c]);
                }
                else
                {
                    var constraints = this.composites[c].constraints;

                    for (i in constraints)
                    {
                        constraints[i].render(this.context);
                    }
                }

                // draw particles
                if (this.composites[c].drawParticles)
                {
                    this.composites[c].drawParticles(this.context, this.composites[c]);
                }
                else
                {
                    var particles = this.composites[c].particles;

                    for (i in particles)
                    {
                        particles[i].render(this.context);
                    }
                }
            }

            // highlight nearest / dragged entity
            var nearest = this.draggedEntity || this.nearestEntity();

            if (nearest && this.hideNearestEntityCircle == false)
            {
                this.context.beginPath();
                this.context.arc(nearest.pos.x, nearest.pos.y, 8, 0, 2 * Math.PI);
                this.context.strokeStyle = this.highlightColor;
                this.context.stroke();
                this.context.closePath();
            }
        }

    }

}
