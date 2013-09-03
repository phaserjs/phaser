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

//-------------------------------------------------------------------------------------------------
// Angle Joint
//
// C = a2 - a1 - refAngle
// Cdot = w2 - w1
// J = [0, -1, 0, 1]
//
// impulse = JT * lambda = [ 0, -lambda, 0, lambda ]
//-------------------------------------------------------------------------------------------------

AngleJoint = function(body1, body2) {
	Joint.call(this, Joint.TYPE_ANGLE, body1, body2, true);

	this.anchor1 = new vec2(0, 0);
	this.anchor2 = new vec2(0, 0);

	// Initial angle difference
	this.refAngle = body2.a - body1.a;

	// Accumulated lambda for angular velocity constraint
	this.lambda_acc = 0;
}

AngleJoint.prototype = new Joint;
AngleJoint.prototype.constructor = AngleJoint;

AngleJoint.prototype.setWorldAnchor1 = function(anchor1) {
	this.anchor1 = new vec2(0, 0);
}

AngleJoint.prototype.setWorldAnchor2 = function(anchor2) {	
	this.anchor2 = new vec2(0, 0);
}

AngleJoint.prototype.serialize = function() {
	return {
		"type": "AngleJoint",
		"body1": this.body1.id,
		"body2": this.body2.id,
		"collideConnected": this.collideConnected
	};
}

AngleJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// Max impulse
	this.maxImpulse = this.maxForce * dt;

	// invEM = J * invM * JT
	var em_inv = body1.i_inv + body2.i_inv;
	this.em = em_inv == 0 ? 0 : 1 / em_inv;

	if (warmStarting) {
		// Apply cached constraint impulses
		// V += JT * lambda	* invM	
		body1.w -= this.lambda_acc * body1.i_inv;
		body2.w += this.lambda_acc * body2.i_inv;
	}
	else {
		this.lambda_acc = 0;
	}
}

AngleJoint.prototype.solveVelocityConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	// Compute lambda for velocity constraint
	// Solve J * invM * JT * lambda = -J * V
	var cdot = body2.w - body1.w;
	var lambda = -this.em * cdot;

	// Accumulate lambda
	this.lambda_acc += lambda;

	// Apply constraint impulses	
	// V += JT * lambda * invM
	body1.w -= lambda * body1.i_inv;
	body2.w += lambda * body2.i_inv;
}

AngleJoint.prototype.solvePositionConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	// Position (angle) constraint
	var c = body2.a - body1.a - this.refAngle;
	var correction = Math.clamp(c, -Joint.MAX_ANGULAR_CORRECTION, Joint.MAX_ANGULAR_CORRECTION);

	// Compute lambda for position (angle) constraint
	// Solve J * invM * JT * lambda = -C / dt
	var lambda_dt = this.em * (-correction);

	// Apply constraint impulses
	// impulse = JT * lambda
	// X += impulse * invM * dt
	body1.a -= lambda_dt * body1.i_inv;
	body2.a += lambda_dt * body2.i_inv;

	return Math.abs(c) < Joint.ANGULAR_SLOP;
}

AngleJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.zero;
}

AngleJoint.prototype.getReactionTorque = function(dt_inv) {
	return this.lambda_acc * dt_inv;
}