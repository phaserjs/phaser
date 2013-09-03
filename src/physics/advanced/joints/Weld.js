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
// Weld Joint
//
// Point-to-Point Constraint:
// C1 = p2 - p1
// Cdot1 = v2 + cross(w2, r2) - v1 - cross(w1, r1)
//       = -v1 + cross(r1, w1) + v2 - cross(r2, w1)
// J1 = [ -I, skew(r1), I, -skew(r2) ]
//
// Angular Constraint:
// C2 = a2 - a1
// C2dot = w2 - w1
// J2 = [ 0, -1, 0, 1 ]
//
// Block Jacobian Matrix:
// J = [ -I, skew(r1), I, -skew(r2) ]
//     [  0,       -1, 0,         1 ]
//
// impulse = JT * lambda = [ -lambda_xy, -(cross(r1, lambda_xy) + lambda_z), lambda_xy, cross(r1, lambda_xy) + lambda_z ]
//-------------------------------------------------------------------------------------------------

WeldJoint = function(body1, body2, anchor) {
	Joint.call(this, Joint.TYPE_WELD, body1, body2, false);
	
	this.anchor1 = this.body1.getLocalPoint(anchor);
	this.anchor2 = this.body2.getLocalPoint(anchor);

	// Soft constraint coefficients
	this.gamma = 0;
	this.beta_c = 0;
	
	// Spring coefficients
	this.frequencyHz = 0;
	this.dampingRatio = 0;

	// Accumulated lambda
	this.lambda_acc = new vec3(0, 0, 0);
}

WeldJoint.prototype = new Joint;
WeldJoint.prototype.constructor = WeldJoint;

WeldJoint.prototype.setWorldAnchor1 = function(anchor1) {
	this.anchor1 = this.body1.getLocalPoint(anchor1);
	this.anchor2 = this.body2.getLocalPoint(anchor1);
}

WeldJoint.prototype.setWorldAnchor2 = function(anchor2) {
	this.anchor1 = this.body1.getLocalPoint(anchor2);
	this.anchor2 = this.body2.getLocalPoint(anchor2);	
}

WeldJoint.prototype.serialize = function() {
	return {
		"type": "WeldJoint",
		"body1": this.body1.id, 
		"body2": this.body2.id,
		"anchor1": this.body1.getWorldPoint(this.anchor1),
		"anchor2": this.body2.getWorldPoint(this.anchor2),
		"collideConnected": this.collideConnected,
		"maxForce": this.maxForce,
		"breakable": this.breakable,
		"frequencyHz": this.frequencyHz,
		"dampingRatio": this.dampingRatio	
	};
}

WeldJoint.prototype.setSpringFrequencyHz = function(frequencyHz) {
	// NOTE: frequencyHz should be limited to under 4 times time steps
	this.frequencyHz = frequencyHz;
}

WeldJoint.prototype.setSpringDampingRatio = function(dampingRatio) {
	this.dampingRatio = dampingRatio;
}

WeldJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// Max impulse
	this.maxImpulse = this.maxForce * dt;
		
	// Transformed r1, r2
	this.r1 = body1.xf.rotate(vec2.sub(this.anchor1, body1.centroid));
	this.r2 = body2.xf.rotate(vec2.sub(this.anchor2, body2.centroid));	
	
	// invEM = J * invM * JT	
	var sum_m_inv = body1.m_inv + body2.m_inv;
	var r1 = this.r1;
	var r2 = this.r2;
	var r1x_i = r1.x * body1.i_inv;
	var r1y_i = r1.y * body1.i_inv;
	var r2x_i = r2.x * body2.i_inv;	
	var r2y_i = r2.y * body2.i_inv;	
	var k11 = sum_m_inv + r1.y * r1y_i + r2.y * r2y_i;	
	var k12 = -r1.x * r1y_i - r2.x * r2y_i;	
	var k13 = -r1y_i - r2y_i;
	var k22 = sum_m_inv + r1.x * r1x_i + r2.x * r2x_i;
	var k23 = r1x_i + r2x_i;
	var k33 = body1.i_inv + body2.i_inv;
	this.em_inv = new mat3(k11, k12, k13, k12, k22, k23, k13, k23, k33);

	// Compute soft constraint parameters
	if (this.frequencyHz > 0) {
		var m = k33 > 0 ? 1 / k33 : 0;

		// Frequency
		var omega = 2 * Math.PI * this.frequencyHz;

		// Spring stiffness
		var k = m * omega * omega;

		// Damping coefficient
		var c = m * 2 * this.dampingRatio * omega;

		// Soft constraint formulas
		// gamma and beta are divided by dt to reduce computation
		this.gamma = (c + k * dt) * dt;
		this.gamma = this.gamma == 0 ? 0 : 1 / this.gamma;
		var beta = dt * k * this.gamma;

		// Position constraint
		var pc = body2.a - body1.a;
		this.beta_c = beta * pc;

		// invEM = invEM + gamma * I (to reduce calculation)
		this.em_inv._33 += this.gamma;
	}
	else {
		this.gamma = 0;
		this.beta_c = 0;
	}
	
	if (warmStarting) {
		// Apply cached constraint impulses
		// V += JT * lambda * invM
		var lambda_xy = new vec2(this.lambda_acc.x, this.lambda_acc.y);
		var lambda_z = this.lambda_acc.z;

		body1.v.mad(lambda_xy, -body1.m_inv);
		body1.w -= (vec2.cross(this.r1, lambda_xy) + lambda_z) * body1.i_inv;

		body2.v.mad(lambda_xy, body2.m_inv);
		body2.w += (vec2.cross(this.r2, lambda_xy) + lambda_z) * body2.i_inv;
	}
	else {
		this.lambda_acc.set(0, 0, 0);
	}
}

WeldJoint.prototype.solveVelocityConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	if (this.frequencyHz > 0) {
		// Compute lambda for angular velocity constraint
		// Solve J2 * invM * J2T * lambda = -(J2 * V + beta * C + gamma * (lambda_acc + lambda))
		var cdot2 = body2.w - body1.w;
		lambda_z = -(cdot2 + this.beta_c + this.gamma * this.lambda_acc.z) / this.em_inv._33;

		// Apply angular constraint impulses
		// V += J2T * lambda * invM
		body1.w -= lambda_z * body1.i_inv;
		body2.w += lambda_z * body2.i_inv;

		// Compute lambda for velocity constraint
		// Solve J1 * invM * J1T * lambda = -J1 * V
		var v1 = vec2.mad(body1.v, vec2.perp(this.r1), body1.w);
	   	var v2 = vec2.mad(body2.v, vec2.perp(this.r2), body2.w);
	   	var cdot1 = vec2.sub(v2, v1);
		var lambda_xy = this.em_inv.solve2x2(cdot1.neg());

		// Accumulate lambda
		this.lambda_acc.x += lambda_xy.x;
		this.lambda_acc.y += lambda_xy.y;
		this.lambda_acc.z += lambda_z;

		// Apply constraint impulses
		// V += J1T * lambda * invM
		body1.v.mad(lambda_xy, -body1.m_inv);
		body1.w -= vec2.cross(this.r1, lambda_xy) * body1.i_inv;

		body2.v.mad(lambda_xy, body2.m_inv);
		body2.w += vec2.cross(this.r2, lambda_xy) * body2.i_inv;
	}
	else {
		// Compute lambda for velocity constraint
		// Solve J * invM * JT * lambda = -J * V
		// in 2D: cross(w, r) = perp(r) * w
		var v1 = vec2.mad(body1.v, vec2.perp(this.r1), body1.w);
	   	var v2 = vec2.mad(body2.v, vec2.perp(this.r2), body2.w);
	   	var cdot1 = vec2.sub(v2, v1);
	   	var cdot2 = body2.w - body1.w;
	   	var cdot = vec3.fromVec2(cdot1, cdot2);
		var lambda = this.em_inv.solve(cdot.neg());	

		// Accumulate lambda
		this.lambda_acc.addself(lambda);

		// Apply constraint impulses
		// V += JT * lambda * invM
		var lambda_xy = new vec2(lambda.x, lambda.y);

		body1.v.mad(lambda_xy, -body1.m_inv);
		body1.w -= (vec2.cross(this.r1, lambda_xy) + lambda.z) * body1.i_inv;

		body2.v.mad(lambda_xy, body2.m_inv);
		body2.w += (vec2.cross(this.r2, lambda_xy) + lambda.z) * body2.i_inv;
	}
}

WeldJoint.prototype.solvePositionConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	// Transformed r1, r2
	var r1 = vec2.rotate(vec2.sub(this.anchor1, body1.centroid), body1.a);
	var r2 = vec2.rotate(vec2.sub(this.anchor2, body2.centroid), body2.a);
	
	// Compute J * invM * JT
	var sum_m_inv = body1.m_inv + body2.m_inv;
	var r1x_i = r1.x * body1.i_inv;
	var r1y_i = r1.y * body1.i_inv;
	var r2x_i = r2.x * body2.i_inv;	
	var r2y_i = r2.y * body2.i_inv;
	var k11 = sum_m_inv + r1.y * r1y_i + r2.y * r2y_i;
	var k12 = -r1.x * r1y_i - r2.x * r2y_i;		
	var k13 = -r1y_i - r2y_i;
	var k22 = sum_m_inv + r1.x * r1x_i + r2.x * r2x_i;
	var k23 = r1x_i + r2x_i;
	var k33 = body1.i_inv + body2.i_inv;
	var em_inv = new mat3(k11, k12, k13, k12, k22, k23, k13, k23, k33);

	if (this.frequencyHz > 0) {
		// Position constraint
		var c1 = vec2.sub(vec2.add(body2.p, r2), vec2.add(body1.p, r1));
		var c2 = 0;
		var correction = vec2.truncate(c1, Joint.MAX_LINEAR_CORRECTION);

		// Compute lambda for position constraint
		// Solve J1 * invM * J1T * lambda = -C / dt
		var lambda_dt_xy = em_inv.solve2x2(correction.neg());

		// Apply constraint impulses
		// impulse = J1T * lambda
		// X += impulse * invM * dt
		body1.p.mad(lambda_dt_xy, -body1.m_inv);
		body1.a -= vec2.cross(r1, lambda_dt_xy) * body1.i_inv;

		body2.p.mad(lambda_dt_xy, body2.m_inv);
		body2.a += vec2.cross(r2, lambda_dt_xy) * body2.i_inv;
	}
	else {
		// Position constraint
		var c1 = vec2.sub(vec2.add(body2.p, r2), vec2.add(body1.p, r1));
		var c2 = body2.a - body1.a;
		var correction = vec3.fromVec2(
			vec2.truncate(c1, Joint.MAX_LINEAR_CORRECTION), 
			Math.clamp(c2, -Joint.MAX_ANGULAR_CORRECTION, Joint.MAX_ANGULAR_CORRECTION));

		// Compute lambda for position constraint
		// Solve J * invM * JT * lambda = -C / dt
		var lambda_dt = em_inv.solve(correction.neg());
		
		// Apply constraint impulses
		// impulse = JT * lambda
		// X += impulse * invM * dt
		var lambda_dt_xy = new vec2(lambda_dt.x, lambda_dt.y);

		body1.p.mad(lambda_dt_xy, -body1.m_inv);
		body1.a -= (vec2.cross(r1, lambda_dt_xy) + lambda_dt.z) * body1.i_inv;

		body2.p.mad(lambda_dt_xy, body2.m_inv);
		body2.a += (vec2.cross(r2, lambda_dt_xy) + lambda_dt.z) * body2.i_inv;
	}

	return c1.length() < Joint.LINEAR_SLOP && Math.abs(c2) <= Joint.ANGULAR_SLOP;
}

WeldJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.scale(this.lambda_acc.toVec2(), dt_inv);
}

WeldJoint.prototype.getReactionTorque = function(dt_inv) {
	return this.lambda_acc.z * dt_inv;
}