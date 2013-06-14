/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="../../math/Transform.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Joint.ts" />
/// <reference path="Bounds.ts" />
/// <reference path="Space.ts" />

/**
* Phaser - Advanced Physics - Body
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced {

    export class Body {

        constructor(sprite: Phaser.Sprite, type: number, x?: number = 0, y?: number = 0) {

            this.id = Phaser.Physics.Advanced.Manager.bodyCounter++;
            this.name = 'body' + this.id;
            this.type = type;

            if (sprite)
            {
                this.sprite = sprite;
                this.game = sprite.game;
                this.position = new Phaser.Vec2(sprite.x, sprite.y);
                this.angle = sprite.rotation;
            }
            else
            {
                this.position = new Phaser.Vec2(x, y);
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

            this.fixedRotation = false;

            this.categoryBits = 0x0001;
            this.maskBits = 0xFFFF;

            this.stepCount = 0;

        }

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

        //  Shapes
        public shapes = [];

        //  Joints
        public joints = [];
        public jointHash = {};

	    // Bounds of all shapes
	    public bounds;

	    public fixedRotation = false;
	    public categoryBits = 0x0001;
	    public maskBits = 0xFFFF;
	    public stepCount = 0;
	    public space: Space;

        /*
	    public duplicate() {

	        var body = new Body(this.type, this.transform.t, this.angle);
	        
            for (var i = 0; i < this.shapes.length; i++)
	        {
	            body.addShape(this.shapes[i].duplicate());
	        }

	        body.resetMassData();

	        return body;

	    }
        */

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

	    public addShape(shape) {

            //  Check not already part of this body
	        shape.body = this;
	        this.shapes.push(shape);

	    }

	    public removeShape(shape) {

	        var index = this.shapes.indexOf(shape);

	        if (index != -1)
	        {
	            this.shapes.splice(index, 1);
	            shape.body = undefined;
	        }

	    }

	    public mass: number;
	    public massInverted: number;
	    public inertia: number;
	    public inertiaInverted: number;

	    private setMass(mass) {

	        this.mass = mass;
	        this.massInverted = mass > 0 ? 1 / mass : 0;

	    }

	    private setInertia(inertia) {

	        this.inertia = inertia;
	        this.inertiaInverted = inertia > 0 ? 1 / inertia : 0;

	    }

	    public setTransform(pos, angle) {

            this.transform.setTo(pos, angle)
            this.position = this.transform.transform(this.centroid);
	        this.angle = angle;

	    }

	    public syncTransform() {

            this.transform.setRotation(this.angle);
            //  this.transform.setPosition(vec2.sub(this.position, this.transform.rotate(this.centroid)));
            Phaser.Vec2Utils.subtract(this.position, this.transform.rotate(this.centroid), this.transform.t);

	    }

	    public getWorldPoint(p:Phaser.Vec2) {
            //  This is returning a new vector - check it's actually used in that way
            return this.transform.transform(p)
	    }

	    public getWorldVector(v) {
            return this.transform.rotate(v)
	    }

	    public getLocalPoint(p) {
            return this.transform.untransform(p)
	    }

	    public getLocalVector(v) {
            return this.transform.unrotate(v)
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
	            this.position.copyFrom(this.transform.transform(this.centroid));
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

	            console.log('rmd', centroid, shape);

                totalMassCentroid.multiplyAddByScalar(centroid, mass);
	            totalMass += mass;
	            totalInertia += inertia;
	        }

	        //this.centroid.copy(vec2.scale(totalMassCentroid, 1 / totalMass));
	        Phaser.Vec2Utils.scale(totalMassCentroid, 1 / totalMass, this.centroid);

	        this.setMass(totalMass);

	        if (!this.fixedRotation)
	        {
	            //this.setInertia(totalInertia - totalMass * vec2.dot(this.centroid, this.centroid));
	            this.setInertia(totalInertia - totalMass * Phaser.Vec2Utils.dot(this.centroid, this.centroid));
	        }

	        //console.log("mass = " + this.m + " inertia = " + this.i);

	        // Move center of mass
	        var oldPosition: Phaser.Vec2 =  Phaser.Vec2Utils.clone(this.position);
	        this.position = this.transform.transform(this.centroid);

	        // Update center of mass velocity

	        //this.velocity.mad(vec2.perp(vec2.sub(this.position, old_p)), this.angularVelocity);
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

	    public cacheData() {
	        this.bounds.clear();

	        for (var i = 0; i < this.shapes.length; i++)
	        {
	            var shape = this.shapes[i];
	            shape.cacheData(this.transform);
	            this.bounds.addBounds(shape.bounds);
	        }

	    }

	    private _tempVec2: Phaser.Vec2 = new Phaser.Vec2;

	    public updateVelocity(gravity, dt, damping) {

            // this.velocity = vec2.mad(this.velocity, vec2.mad(gravity, this.force, this.massInverted), dt);
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
	        this.velocity.scale(this.game.math.clamp(1 - dt * (damping + this.linearDamping), 0, 1));
	        this.angularVelocity *= this.game.math.clamp(1 - dt * (damping + this.angularDamping), 0, 1);

	        this.force.setTo(0, 0);
	        this.torque = 0;

	    }

	    public updatePosition(dt) {

	        //this.position.addself(vec2.scale(this.velocity, dt));
	        this.position.add(Phaser.Vec2Utils.scale(this.velocity, dt, this._tempVec2));

	        this.angle += this.angularVelocity * dt;

	    }

	    public resetForce() {
	        this.force.setTo(0, 0);
	        this.torque = 0;
	    }

	    public applyForce(force, p) {

	        if (this.isDynamic == false)
	        {
	            return;
	        }

	        if (this.isAwake == false)
	        {
	            this.awake(true);
	        }

	        this.force.add(force);

        	//  this.f.addself(force);
	        //  this.torque += vec2.cross(vec2.sub(p, this.p), force);

            Phaser.Vec2Utils.subtract(p, this.position, this._tempVec2);
            this.torque += Phaser.Vec2Utils.cross(this._tempVec2, force);

	    }

	    public applyForceToCenter(force) {

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

	    public applyTorque(torque) {

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

	    public applyLinearImpulse(impulse, p) {

	        if (this.isDynamic == false)
	        {
	            return;
	        }

	        if (this.isAwake == false)
	        {
	            this.awake(true);
	        }

            this.velocity.multiplyAddByScalar(impulse, this.massInverted);

	        //  this.angularVelocity += vec2.cross(vec2.sub(p, this.position), impulse) * this.inertiaInverted;

            Phaser.Vec2Utils.subtract(p, this.position, this._tempVec2);
	        this.angularVelocity += Phaser.Vec2Utils.cross(this._tempVec2, impulse) * this.inertiaInverted;

	    }

	    public applyAngularImpulse(impulse) {

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

	    public isCollidable(other) {

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

	            if (!joint)
	            {
	                continue;
	            }

	            if (!joint.collideConnected && other.jointHash[joint.id] != undefined)
	            {
	                return false;
	            }
	        }

	        return true;

	    }

    }

}