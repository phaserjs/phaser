/*
* Copyright (c) 2012 Ju Hyung Lee
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
* and associated documentation files (the "Software"), to deal in the Software without 
* restriction, including without limitation the rights to use, copy, modify, merge, publish, 
* distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or 
* substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
* BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

Body = function(type, pos, angle) {
	if (Body.id_counter == undefined) {
		Body.id_counter = 0;
	}

	this.id = Body.id_counter++;

	// Identifier
	this.name = "body" + this.id;

	// STATIC or DYNAMIC
	this.type = type;

	// Default values
	pos = pos || new vec2(0, 0);
	angle = angle || 0;

	// Local to world transform
	this.xf = new Transform(pos, angle);

	// Local center of mass
	this.centroid = new vec2(0, 0);

	// World position of centroid
	this.p = new vec2(pos.x, pos.y);
	
	// Velocity
	this.v = new vec2(0, 0);

	// Force
	this.f = new vec2(0, 0);

	// Orientation (angle)
	this.a = angle;

	// Angular velocity
	this.w = 0;    

	// Torque
	this.t = 0;

	// Linear damping
	this.linearDamping = 0;

	// Angular damping
	this.angularDamping = 0;

	// Sleep time
	this.sleepTime = 0;

	// Awaked flag
	this.awaked = false;

	// Shape list for this body
	this.shapeArr = [];

	// Joint hash for this body
	this.jointArr = [];
	this.jointHash = {};

	// Bounds of all shapes
	this.bounds = new Bounds;

	this.fixedRotation = false;

	this.categoryBits = 0x0001;
	this.maskBits = 0xFFFF;

	this.stepCount = 0;
}

Body.STATIC = 0;
Body.KINETIC = 1;
Body.DYNAMIC = 2;

Body.prototype.duplicate = function() {
	var body = new Body(this.type, this.xf.t, this.a);
	for (var i = 0; i < this.shapeArr.length; i++) {
		body.addShape(this.shapeArr[i].duplicate());
	}
	body.resetMassData();

	return body;
}

Body.prototype.serialize = function() {
	var shapes = [];
	for (var i = 0; i < this.shapeArr.length; i++) {
		var obj = this.shapeArr[i].serialize();
		shapes.push(obj);
	}

	return {
		"type": ["static", "kinetic", "dynamic"][this.type],
		"name": this.name,
		"position": this.xf.t,
		"angle": this.xf.a,
		"shapes": shapes
	};
}

Body.prototype.toString = function() {
	return "[{Body (name=" + this.name + " velocity=" + this.v.toString() + " angularVelocity: " + this.w + ")}]";
}

Body.prototype.isStatic = function() {
	return this.type == Body.STATIC ? true : false;
}

Body.prototype.isDynamic = function() {
	return this.type == Body.DYNAMIC ? true : false;
}

Body.prototype.isKinetic = function() {
	return this.type == Body.KINETIC ? true : false;
}

Body.prototype.setType = function(type) {
	if (type == this.type) {
		return;
	}

	this.f.set(0, 0);
	this.v.set(0, 0);
	this.t = 0;
	this.w = 0;	
	this.type = type;

	this.awake(true);
}

Body.prototype.addShape = function(shape) {
	shape.body = this;
	this.shapeArr.push(shape);
}

Body.prototype.removeShape = function(shape) {
	var index = this.shapeArr.indexOf(shape);
	if (index != -1) {
		this.shapeArr.splice(index, 1);
		shape.body = undefined;
	}
}

// Internal function
Body.prototype.setMass = function(mass) {
	this.m = mass;
	this.m_inv = mass > 0 ? 1 / mass : 0;
}

// Internal function
Body.prototype.setInertia = function(inertia) {
	this.i = inertia;	
	this.i_inv = inertia > 0 ? 1 / inertia : 0;
}

Body.prototype.setTransform = function(pos, angle) {
	this.xf.set(pos, angle);
	this.p = this.xf.transform(this.centroid);
	this.a = angle;	
}

Body.prototype.syncTransform = function() {
	this.xf.setRotation(this.a);
	this.xf.setPosition(vec2.sub(this.p, this.xf.rotate(this.centroid)));
}

Body.prototype.getWorldPoint = function(p) {
	return this.xf.transform(p);
}

Body.prototype.getWorldVector = function(v) {
	return this.xf.rotate(v);
}

Body.prototype.getLocalPoint = function(p) {
	return this.xf.untransform(p);
}

Body.prototype.getLocalVector = function(v) {
	return this.xf.unrotate(v);
}

Body.prototype.setFixedRotation = function(flag) {
	this.fixedRotation = flag;
	this.resetMassData();
}

Body.prototype.resetMassData = function() {
	this.centroid.set(0, 0);
	this.m = 0;
	this.m_inv = 0;
	this.i = 0;
	this.i_inv = 0;

	if (!this.isDynamic()) {
		this.p = this.xf.transform(this.centroid);
		return;
	}
	
	var totalMassCentroid = new vec2(0, 0);
	var totalMass = 0;
	var totalInertia = 0;

	for (var i = 0; i < this.shapeArr.length; i++) {
		var shape = this.shapeArr[i];
		var centroid = shape.centroid();
		var mass = shape.area() * shape.density;
		var inertia = shape.inertia(mass);

		totalMassCentroid.mad(centroid, mass);
		totalMass += mass;
		totalInertia += inertia;
	}
	
	this.centroid.copy(vec2.scale(totalMassCentroid, 1 / totalMass));
	this.setMass(totalMass);

	if (!this.fixedRotation) {	
		this.setInertia(totalInertia - totalMass * vec2.dot(this.centroid, this.centroid));
	}

	// Move center of mass
	var old_p = this.p;
	this.p = this.xf.transform(this.centroid);	

	// Update center of mass velocity ??
	this.v.mad(vec2.perp(vec2.sub(this.p, old_p)), this.w);	
}

Body.prototype.resetJointAnchors = function() {
	for (var i = 0; i < this.jointArr.length; i++) {
		var joint = this.jointArr[i];
		if (!joint) {
			continue;
		}

		var anchor1 = joint.getWorldAnchor1();
		var anchor2 = joint.getWorldAnchor2();

		joint.setWorldAnchor1(anchor1);
		joint.setWorldAnchor2(anchor2);
	}
}

Body.prototype.cacheData = function() {	

	this.bounds.clear();
	
	for (var i = 0; i < this.shapeArr.length; i++) {
		var shape = this.shapeArr[i];
		shape.cacheData(this.xf);
		this.bounds.addBounds(shape.bounds);
	}

}

Body.prototype.updateVelocity = function(gravity, dt, damping) {
	this.v = vec2.mad(this.v, vec2.mad(gravity, this.f, this.m_inv), dt);		
	this.w = this.w + this.t * this.i_inv * dt;	

	// Apply damping.
	// ODE: dv/dt + c * v = 0
	// Solution: v(t) = v0 * exp(-c * t)
	// Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v * exp(-c * dt)
	// v2 = exp(-c * dt) * v1
	// Taylor expansion:
	// v2 = (1.0f - c * dt) * v1
	this.v.scale(Math.clamp(1 - dt * (damping + this.linearDamping), 0, 1));
	this.w *= Math.clamp(1 - dt * (damping + this.angularDamping), 0, 1);

	this.f.set(0, 0);
	this.t = 0;
}

Body.prototype.updatePosition = function(dt) {
	this.p.addself(vec2.scale(this.v, dt));
	this.a += this.w * dt;
}

Body.prototype.resetForce = function() {
	this.f.set(0, 0);
	this.t = 0;
}

Body.prototype.applyForce = function(force, p) {
	if (!this.isDynamic())
		return;

	if (!this.isAwake())
		this.awake(true);
	
	this.f.addself(force);
	this.t += vec2.cross(vec2.sub(p, this.p), force);
}

Body.prototype.applyForceToCenter = function(force) {
	if (!this.isDynamic())
		return;

	if (!this.isAwake())
		this.awake(true);
	
	this.f.addself(force);
}

Body.prototype.applyTorque = function(torque) {
	if (!this.isDynamic())
		return;

	if (!this.isAwake())
		this.awake(true);
	
	this.t += torque;
}

Body.prototype.applyLinearImpulse = function(impulse, p) {
	if (!this.isDynamic())
		return;

	if (!this.isAwake()) 
		this.awake(true);

	this.v.mad(impulse, this.m_inv);
	this.w += vec2.cross(vec2.sub(p, this.p), impulse) * this.i_inv;
}

Body.prototype.applyAngularImpulse = function(impulse) {
	if (!this.isDynamic())
		return;

	if (!this.isAwake()) 
		this.awake(true);

	this.w += impulse * this.i_inv;
}

Body.prototype.kineticEnergy = function() {
	var vsq = this.v.dot(this.v);
	var wsq = this.w * this.w;
	return 0.5 * (this.m * vsq + this.i * wsq);
}

Body.prototype.isAwake = function() {
	return this.awaked;
}

Body.prototype.awake = function(flag) {
	this.awaked = flag;
	if (flag) {
		this.sleepTime = 0;
	} 
	else {
		this.v.set(0, 0);
		this.w = 0;
		this.f.set(0, 0);
		this.t = 0;
	}
}

Body.prototype.isCollidable = function(other) {
	if (this == other)
		return false;

	if (!this.isDynamic() && !other.isDynamic())
		return false;

	if (!(this.maskBits & other.categoryBits) || !(other.maskBits & this.categoryBits))
		return false;

	for (var i = 0; i < this.jointArr.length; i++) {
		var joint = this.jointArr[i];
		if (!joint) {
			continue;
		}

		if (!joint.collideConnected && other.jointHash[joint.id] != undefined) {
			return false;
		}
	}

	return true;
}