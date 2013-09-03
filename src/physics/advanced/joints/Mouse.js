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
// Mouse Joint
//
// p = attached point, m = mouse point (constant)
// C = p - m
// Cdot = v + cross(w, r)
// J = [ I, -skew(r) ]
//
// impulse = JT * lambda = [ lambda, cross(r2, lambda) ]
//-------------------------------------------------------------------------------------------------

MouseJoint = function(mouseBody, body, anchor) {
	if (arguments.length == 0)
		return;

	Joint.call(this, Joint.TYPE_MOUSE, mouseBody, body, true);

	// Local anchor points
	this.anchor1 = this.body1.getLocalPoint(anchor);
	this.anchor2 = this.body2.getLocalPoint(anchor);
	
	// Soft constraint coefficients
	this.gamma = 0;
	this.beta_c = 0;
	
	// Spring coefficients
	this.frequencyHz = 5;
	this.dampingRatio = 0.9;

	// Accumulated impulse
	this.lambda_acc = new vec2(0, 0);
}

MouseJoint.prototype = new Joint;
MouseJoint.prototype.constructor = MouseJoint;

MouseJoint.prototype.setSpringFrequencyHz = function(frequencyHz) {
	this.frequencyHz = frequencyHz;
}

MouseJoint.prototype.setSpringDampingRatio = function(dampingRatio) {
	this.dampingRatio = dampingRatio;
}

MouseJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// Max impulse
	this.maxImpulse = this.maxForce * dt;		

	// Frequency
	var omega = 2 * Math.PI * this.frequencyHz;

	// Spring stiffness
	var k = body2.m * (omega * omega);

	// Damping coefficient
	var d = body2.m * 2 * this.dampingRatio * omega;

	// Soft constraint formulas
	// gamma and beta are divided by dt to reduce computation
	this.gamma = (d + k * dt) * dt;
	this.gamma = this.gamma == 0 ? 0 : 1 / this.gamma;
	var beta = dt * k * this.gamma;

	// Transformed r
	this.r2 = body2.xf.rotate(vec2.sub(this.anchor2, body2.centroid));	
		
	// invEM = J * invM * JT
	var r2 = this.r2;
	var r2y_i = r2.y * body2.i_inv;
	var k11 = body2.m_inv + r2.y * r2y_i + this.gamma;
	var k12 = -r2.x * r2y_i;
	var k22 = body2.m_inv + r2.x * r2.x * body2.i_inv + this.gamma;
	this.em_inv = new mat2(k11, k12, k12, k22);

	// Position constraint
	var c = vec2.sub(vec2.add(body2.p, this.r2), body1.p);
	this.beta_c = vec2.scale(c, beta);

	body2.w *= 0.98;	

	if (warmStarting) {
		// Apply cached constraint impulse
		// V += JT * lambda * invM
		body2.v.mad(this.lambda_acc, body2.m_inv);
		body2.w += vec2.cross(this.r2, this.lambda_acc) * body2.i_inv;		
	}
	else {
		this.lambda_acc.set(0, 0);
	}
}

MouseJoint.prototype.solveVelocityConstraints = function() {
	var body2 = this.body2;

	// Compute lambda for velocity constraint
	// Solve J * invM * JT * lambda = -(J * V + beta * C + gamma * (lambda_acc + lambda))
	// in 2D: cross(w, r) = perp(r) * w
   	var cdot = vec2.mad(body2.v, vec2.perp(this.r2), body2.w);
   	var soft = vec2.mad(this.beta_c, this.lambda_acc, this.gamma);
	var lambda = this.em_inv.solve(vec2.add(cdot, soft).neg());	

	// Accumulate lambda
	var lambda_old = this.lambda_acc.duplicate();
	this.lambda_acc.addself(lambda);
	var lsq = this.lambda_acc.lengthsq();
	if (lsq > this.maxImpulse * this.maxImpulse) {
		this.lambda_acc.scale(this.maxImpulse / Math.sqrt(lsq));
	}
	lambda = vec2.sub(this.lambda_acc, lambda_old);	

	// Apply constraint impulse
	// V += JT * lambda * invM
	body2.v.mad(lambda, body2.m_inv);	
	body2.w += vec2.cross(this.r2, lambda) * body2.i_inv;
}

MouseJoint.prototype.solvePositionConstraints = function() {
	return true;
}

MouseJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.scale(this.lambda_acc, dt_inv);
}

MouseJoint.prototype.getReactionTorque = function(dt_inv) {
	return 0;
}

