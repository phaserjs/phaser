/// <reference path="../math/Vec2.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../math/Vec2Utils.ts" />
/// <reference path="../math/Transform.ts" />
/// <reference path="../math/TransformUtils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="joints/Joint.ts" />
/// <reference path="Bounds.ts" />
/// <reference path="Space.ts" />
/// <reference path="shapes/IShape.ts" />
/// <reference path="shapes/Triangle.ts" />
/// <reference path="shapes/Circle.ts" />
/// <reference path="shapes/Box.ts" />
/// <reference path="shapes/Poly.ts" />
/// <reference path="shapes/Segment.ts" />

/**
* Phaser - Advanced Physics - Body
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics {

    export class Body {

        constructor(sprite: Phaser.Sprite, type: number, x?: number = 0, y?: number = 0, shapeType?: number = 0) {

            this.id = Phaser.Physics.Manager.bodyCounter++;
            this.name = 'body' + this.id;
            this.type = type;

            if (sprite)
            {
                this.sprite = sprite;
                this.game = sprite.game;
                this.position = new Phaser.Vec2(Phaser.Physics.Manager.pixelsToMeters(sprite.x), Phaser.Physics.Manager.pixelsToMeters(sprite.y));
                this.angle = sprite.rotation;
            }
            else
            {
                this.position = new Phaser.Vec2(Phaser.Physics.Manager.pixelsToMeters(x), Phaser.Physics.Manager.pixelsToMeters(y));
                this.angle = 0;
            }

            this.transform = new Phaser.Transform(this.position, this.angle);
            this.centroid = new Phaser.Vec2;
            this.velocity = new Phaser.Vec2;
            this.force = new Phaser.Vec2;
            this.angularVelocity = 0;
            this.torque = 0;
            this.linearDamping = 0;
            this.angularDamping = 0;
            this.sleepTime = 0;
            this.awaked = false;

            this.shapes = [];
            this.joints = [];
            this.jointHash = {};

            this.bounds = new Bounds;

            this.allowCollisions = Phaser.Types.ANY;
            this.fixedRotation = false;

            this.categoryBits = 0x0001;
            this.maskBits = 0xFFFF;

            this.stepCount = 0;

            if (sprite)
            {
                if (shapeType == 0)
                {
                    this.addBox(0, 0, this.sprite.width, this.sprite.height, 1, 1, 1);
                }
                else
                {
                    this.addCircle(Math.max(this.sprite.width, this.sprite.height) / 2, 0, 0, 1, 1, 1);
                }
            }

        }

        public toString(): string {
            return "[{Body (name=" + this.name + " velocity=" + this.velocity.toString() + " angularVelocity: " + this.angularVelocity + ")}]";
        }

	    private _tempVec2: Phaser.Vec2 = new Phaser.Vec2;

        /**
         * Reference to Phaser.Game
         */
        public game: Game;

        /**
         * Reference to the parent Sprite
         */
        public sprite: Phaser.Sprite;

        /**
         * The Body ID
         */
        public id: number;

        /**
         * The Body name
         */
        public name: string;

        /**
         * The type of Body (disabled, dynamic, static or kinematic)
         * Disabled = skips all physics operations / tests (default)
         * Dynamic = gives and receives impacts
         * Static = gives but doesn't receive impacts, cannot be moved by physics
         * Kinematic = gives impacts, but never receives, can be moved by physics
         * @type {number}
         */
        public type: number;

        public angle: number;

        //  Local to world transform
        public transform: Phaser.Transform;

        //  Local center of mass
        public centroid: Phaser.Vec2;

        //  World position of centroid
        public position: Phaser.Vec2;

        //  Velocity
        public velocity: Phaser.Vec2;

        //  Force
        public force: Phaser.Vec2;

        //  Angular velocity
        public angularVelocity: number;

        //  Torque
        public torque: number;

        //  Linear damping
        public linearDamping: number;

        //  Angular damping
        public angularDamping: number;

        //  Sleep time
        public sleepTime: number;

        //  Awaked
        public awaked: bool;

        //  Allow Collisions
        public allowCollisions: number;

        //  Shapes
        public shapes: IShape[] = [];

        //  Length of the shapes array
        public shapesLength: number;

        //  Joints
        public joints: IJoint[] = [];
        public jointHash = {};

	    // Bounds of all shapes
	    public bounds: Bounds;

	    public mass: number;
	    public massInverted: number;
	    public inertia: number;
	    public inertiaInverted: number;

	    public fixedRotation = false;
	    public categoryBits = 0x0001;
	    public maskBits = 0xFFFF;
	    public stepCount = 0;
	    public space: Space;

	    public duplicate() {

	        console.log('body duplicate called');

	        //var body = new Body(this.type, this.transform.t, this.angle);
	        
            //for (var i = 0; i < this.shapes.length; i++)
	        //{
	        //    body.addShape(this.shapes[i].duplicate());
	        //}

	        //body.resetMassData();

	        //return body;

	    }

	    public get isDisabled(): bool {
	        return this.type == Phaser.Types.BODY_DISABLED ? true : false;
	    }

	    public get isStatic(): bool {
	        return this.type == Phaser.Types.BODY_STATIC ? true : false;
	    }

	    public get isKinetic(): bool {
	        return this.type == Phaser.Types.BODY_KINETIC ? true : false;
	    }

	    public get isDynamic(): bool {
	        return this.type == Phaser.Types.BODY_DYNAMIC ? true : false;
	    }

	    public setType(type: number) {

	        if (type == this.type)
	        {
	            return;
	        }

	        this.force.setTo(0, 0);
	        this.velocity.setTo(0, 0);
	        this.torque = 0;
	        this.angularVelocity = 0;
	        this.type = type;

	        this.awake(true);

	    }

	    public addPoly(verts, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Poly {

	        var poly: Phaser.Physics.Shapes.Poly = new Phaser.Physics.Shapes.Poly(verts);
	        poly.elasticity = elasticity;
	        poly.friction = friction;
	        poly.density = density;

	        this.addShape(poly);
	        this.resetMassData();

	        return poly;

	    }

	    public addTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Triangle {

	        var tri: Phaser.Physics.Shapes.Triangle = new Phaser.Physics.Shapes.Triangle(x1, y1, x2, y2, x3, y3);
	        tri.elasticity = elasticity;
	        tri.friction = friction;
	        tri.density = density;

	        this.addShape(tri);
	        this.resetMassData();

	        return tri;

	    }

	    public addBox(x: number, y: number, width: number, height: number, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Box {

	        var box: Phaser.Physics.Shapes.Box = new Phaser.Physics.Shapes.Box(x, y, width, height);
	        box.elasticity = elasticity;
	        box.friction = friction;
	        box.density = density;

	        this.addShape(box);
	        this.resetMassData();

	        return box;

	    }

	    public addCircle(radius: number, x?: number = 0, y?: number = 0, elasticity?: number = 1, friction?: number = 1, density?: number = 1): Phaser.Physics.Shapes.Circle {

	        var circle: Phaser.Physics.Shapes.Circle = new Phaser.Physics.Shapes.Circle(radius, x, y);
	        circle.elasticity = elasticity;
	        circle.friction = friction;
	        circle.density = density;

	        this.addShape(circle);
	        this.resetMassData();

	        return circle;

	    }

	    public addShape(shape) {

            //  Check not already part of this body
	        shape.body = this;

	        this.shapes.push(shape);

	        this.shapesLength = this.shapes.length;

	        return shape;

	    }

	    public removeShape(shape) {

	        var index = this.shapes.indexOf(shape);

	        if (index != -1)
	        {
	            this.shapes.splice(index, 1);
	            shape.body = undefined;
	        }

	        this.shapesLength = this.shapes.length;

	    }

	    private setMass(mass) {

	        this.mass = mass;
	        this.massInverted = mass > 0 ? 1 / mass : 0;

	    }

	    private setInertia(inertia) {

	        this.inertia = inertia;
	        this.inertiaInverted = inertia > 0 ? 1 / inertia : 0;

	    }

	    public setTransform(pos, angle) {

            //  inject the transform into this.position
	        this.transform.setTo(pos, angle);
	        Manager.write('setTransform: ' + this.position.toString());
        	Manager.write('centroid: ' + this.centroid.toString());
            Phaser.TransformUtils.transform(this.transform, this.centroid, this.position);
	        Manager.write('post setTransform: ' + this.position.toString());
            //this.position.copyFrom(this.transform.transform(this.centroid));
	        this.angle = angle;

	    }

	    public syncTransform() {

	        Manager.write('syncTransform:');
	        Manager.write('p: ' + this.position.toString());
	        Manager.write('centroid: ' + this.centroid.toString());
	        Manager.write('xf: ' + this.transform.toString());
	        Manager.write('a: ' + this.angle);
            this.transform.setRotation(this.angle);
            //  OPTIMISE: Creating new vector
            Phaser.Vec2Utils.subtract(this.position, Phaser.TransformUtils.rotate(this.transform, this.centroid), this.transform.t);
	        Manager.write('--------------------');
	        Manager.write('xf: ' + this.transform.toString());
	        Manager.write('--------------------');

	    }

	    public getWorldPoint(p:Phaser.Vec2) {
            //  OPTIMISE: Creating new vector
	        return Phaser.TransformUtils.transform(this.transform, p);
	    }

	    public getWorldVector(v:Phaser.Vec2) {
            //  OPTIMISE: Creating new vector
	        return Phaser.TransformUtils.rotate(this.transform, v);
	    }

	    public getLocalPoint(p:Phaser.Vec2) {
            //  OPTIMISE: Creating new vector
	        return Phaser.TransformUtils.untransform(this.transform, p);
	    }

	    public getLocalVector(v:Phaser.Vec2) {
            //  OPTIMISE: Creating new vector
	        return Phaser.TransformUtils.unrotate(this.transform, v);
	    }

	    public setFixedRotation(flag) {
	        this.fixedRotation = flag;
	        this.resetMassData();
	    }

	    public resetMassData() {

	        this.centroid.setTo(0, 0);
	        this.mass = 0;
	        this.massInverted = 0;
	        this.inertia = 0;
	        this.inertiaInverted = 0;

	        if (this.isDynamic == false)
	        {
	            Phaser.TransformUtils.transform(this.transform, this.centroid, this.position);
	            //this.position.copyFrom(this.transform.transform(this.centroid));
	            return;
	        }

	        var totalMassCentroid = new Phaser.Vec2(0, 0);
	        var totalMass = 0;
	        var totalInertia = 0;

	        for (var i = 0; i < this.shapes.length; i++)
	        {
	            var shape = this.shapes[i];
	            var centroid = shape.centroid();
	            var mass = shape.area() * shape.density;
	            var inertia = shape.inertia(mass);

	            //console.log('rmd', centroid, shape);

                totalMassCentroid.multiplyAddByScalar(centroid, mass);
	            totalMass += mass;
	            totalInertia += inertia;
	        }

	        //this.centroid.copy(vec2.scale(totalMassCentroid, 1 / totalMass));
	        Phaser.Vec2Utils.scale(totalMassCentroid, 1 / totalMass, this.centroid);

	        this.setMass(totalMass);

	        if (!this.fixedRotation)
	        {
	            this.setInertia(totalInertia - totalMass * Phaser.Vec2Utils.dot(this.centroid, this.centroid));
	        }

	        // Move center of mass
	        var oldPosition: Phaser.Vec2 =  Phaser.Vec2Utils.clone(this.position);
            Phaser.TransformUtils.transform(this.transform, this.centroid, this.position);

	        // Update center of mass velocity
	        oldPosition.subtract(this.position);
	        this.velocity.multiplyAddByScalar(Phaser.Vec2Utils.perp(oldPosition, oldPosition), this.angularVelocity);

	    }

	    public resetJointAnchors() {

	        for (var i = 0; i < this.joints.length; i++)
	        {
	            var joint = this.joints[i];

	            if (!joint)
	            {
	                continue;
	            }

	            var anchor1 = joint.getWorldAnchor1();
	            var anchor2 = joint.getWorldAnchor2();

	            joint.setWorldAnchor1(anchor1);
	            joint.setWorldAnchor2(anchor2);
	        }
	    }

	    public cacheData(source:string = '') {

	        Manager.write('cacheData -- start');
	        Manager.write('p: ' + this.position.toString());
	        Manager.write('xf: ' + this.transform.toString());

	        this.bounds.clear();

	        for (var i = 0; i < this.shapes.length; i++)
	        {
	            var shape: IShape = this.shapes[i];
	            shape.cacheData(this.transform);
	            this.bounds.addBounds(shape.bounds);
	        }

	        Manager.write('bounds: ' + this.bounds.toString());

	        Manager.write('p: ' + this.position.toString());
	        Manager.write('xf: ' + this.transform.toString());
	        Manager.write('cacheData -- stop');

	    }

	    public updateVelocity(gravity, dt, damping) {

            Phaser.Vec2Utils.multiplyAdd(gravity, this.force, this.massInverted, this._tempVec2);
            Phaser.Vec2Utils.multiplyAdd(this.velocity, this._tempVec2, dt, this.velocity);

	        this.angularVelocity = this.angularVelocity + this.torque * this.inertiaInverted * dt;

	        // Apply damping.
	        // ODE: dv/dt + c * v = 0
	        // Solution: v(t) = v0 * exp(-c * t)
	        // Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v * exp(-c * dt)
	        // v2 = exp(-c * dt) * v1
	        // Taylor expansion:
	        // v2 = (1.0f - c * dt) * v1
	        this.velocity.scale(this.clamp(1 - dt * (damping + this.linearDamping), 0, 1));
	        this.angularVelocity *= this.clamp(1 - dt * (damping + this.angularDamping), 0, 1);

	        this.force.setTo(0, 0);
	        this.torque = 0;

	    }

	    public inContact(body2: Body): bool {

	        if (!body2 || this.stepCount == body2.stepCount)
	        {
	            return false;
	        }

	        if (!(this.isAwake && this.isStatic == false) && !(body2.isAwake && body2.isStatic == false))
	        {
	            return false;
	        }

	        if (this.isCollidable(body2) == false)
	        {
	            return false;
	        }

            if (!this.bounds.intersectsBounds(body2.bounds))
            {
                return false;
            }

            return true;

	    }

        public clamp(v, min, max) {
            return v < min ? min : (v > max ? max : v);
        }

	    public updatePosition(dt:number) {

	        this.position.add(Phaser.Vec2Utils.scale(this.velocity, dt, this._tempVec2));

	        this.angle += this.angularVelocity * dt;

	        if (this.sprite)
	        {
	            this.sprite.x = this.position.x * 50;
	            this.sprite.y = this.position.y * 50;
                //  Obey fixed rotation?
	            this.sprite.rotation = this.game.math.radiansToDegrees(this.angle);
	        }

	    }

	    public resetForce() {
	        this.force.setTo(0, 0);
	        this.torque = 0;
	    }

	    public applyForce(force:Phaser.Vec2, p:Phaser.Vec2) {

	        if (this.isDynamic == false)
	        {
	            return;
	        }

	        if (this.isAwake == false)
	        {
	            this.awake(true);
	        }

	        this.force.add(force);

            Phaser.Vec2Utils.subtract(p, this.position, this._tempVec2);

            this.torque += Phaser.Vec2Utils.cross(this._tempVec2, force);

	    }

	    public applyForceToCenter(force:Phaser.Vec2) {

	        if (this.isDynamic == false)
	        {
	            return;
	        }

	        if (this.isAwake == false)
	        {
	            this.awake(true);
	        }

	        this.force.add(force);

	    }

	    public applyTorque(torque:number) {

	        if (this.isDynamic == false)
	        {
	            return;
	        }

	        if (this.isAwake == false)
	        {
	            this.awake(true);
	        }

	        this.torque += torque;

	    }

	    public applyLinearImpulse(impulse:Phaser.Vec2, p:Phaser.Vec2) {

	        if (this.isDynamic == false)
	        {
	            return;
	        }

	        if (this.isAwake == false)
	        {
	            this.awake(true);
	        }

            this.velocity.multiplyAddByScalar(impulse, this.massInverted);

            Phaser.Vec2Utils.subtract(p, this.position, this._tempVec2);

	        this.angularVelocity += Phaser.Vec2Utils.cross(this._tempVec2, impulse) * this.inertiaInverted;

	    }

	    public applyAngularImpulse(impulse: number) {

	        if (this.isDynamic == false)
	        {
	            return;
	        }

	        if (this.isAwake == false)
	        {
	            this.awake(true);
	        }

	        this.angularVelocity += impulse * this.inertiaInverted;

	    }

	    public kineticEnergy() {

	        var vsq = this.velocity.dot(this.velocity);
	        var wsq = this.angularVelocity * this.angularVelocity;
	        
            return 0.5 * (this.mass * vsq + this.inertia * wsq);

	    }

	    public get isAwake(): bool {
	        return this.awaked;
	    }

	    public awake(flag) {

	        this.awaked = flag;

	        if (flag)
	        {
	            this.sleepTime = 0;
	        }
	        else
	        {
	            this.velocity.setTo(0, 0);
	            this.angularVelocity = 0;
	            this.force.setTo(0, 0);
	            this.torque = 0;
	        }

	    }

	    public isCollidable(other:Body) {

	        if (this == other)
	        {
	            return false;
	        }

	        if (this.isDynamic == false && other.isDynamic == false)
	        {
	            return false;
	        }

	        if (!(this.maskBits & other.categoryBits) || !(other.maskBits & this.categoryBits))
	        {
	            return false;
	        }

	        for (var i = 0; i < this.joints.length; i++)
	        {
	            var joint = this.joints[i];

	            if (!this.joints[i] || (!this.joints[i].collideConnected && other.jointHash[this.joints[i].id] != undefined))
	            {
	                return false;
	            }
	        }

	        return true;

	    }

    }

}