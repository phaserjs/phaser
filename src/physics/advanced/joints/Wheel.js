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
// Wheel Joint
//
// Point-to-Line constraint:
// d = p2 - p1
// n = normalize(perp(d))
// C = dot(n, d)
// Cdot = dot(d, dn/dt) + dot(n dd/dt)
//      = dot(d, cross(w1, n)) + dot(n, v2 + cross(w2, r2) - v1 - cross(w1, r1))
//      = dot(d, cross(w1, n)) + dot(n, v2) + dot(n, cross(w2, r2)) - dot(n, v1) - dot(n, cross(w1, r1))
//      = -dot(n, v1) - dot(cross(d + r1, n), w1) + dot(n, v2) + dot(cross(r2, n), w2)
// J = [ -n, -sn1, n, sn2 ]
// sn1 = cross(r1 + d, n)
// sn2 = cross(r2, n)
//
// impulse = JT * lambda = [ -n * lambda, -(sn1 * lambda), n * lambda, sn2 * lambda ]
//
// Spring constraint:
// u = normalize(d)
// C = dot(u, d)
// Cdot = -dot(u, v1) - dot(cross(d + r1, u), w1) + dot(u, v2) + dot(cross(r2, u), w2)
// J = [ -u, -su1, u, su2 ]
// su1 = cross(r1 + d, u)
// su2 = cross(r2, u)
//
// impulse = JT * lambda = [ -u * lambda, -(su1 * lambda), u * lambda, su2 * lambda ]
//
// Motor rotational constraint:
// Cdot = w2 - w1
// J = [ 0, -1, 0, 1 ]
//-------------------------------------------------------------------------------------------------

WheelJoint = function(body1, body2, anchor1, anchor2) {
	Joint.call(this, Joint.TYPE_WHEEL, body1, body2, true);

	// Local anchor points
	this.anchor1 = this.body1.getLocalPoint(anchor1);
	this.anchor2 = this.body2.getLocalPoint(anchor2);

	var d = vec2.sub(anchor2, anchor1);

	// Rest length
	this.restLength = d.length();

	// Body1's local axis
	this.u_local = this.body1.getLocalVector(vec2.normalize(d));
	this.n_local = vec2.perp(this.u_local);
	
	// Accumulated impulse
	this.lambda_acc = 0;
	this.motorLambda_acc = 0;
	this.springLambda_acc = 0;	

	// Motor
	this.motorEnabled = false;
	this.motorSpeed = 0;
	this.maxMotorTorque = 0;

	// Soft constraint coefficients
	this.gamma = 0;
	this.beta_c = 0;

	// Spring coefficients
	this.frequencyHz = 0;
	this.dampingRatio = 0;
}

WheelJoint.prototype = new Joint;
WheelJoint.prototype.constructor = WheelJoint;

WheelJoint.prototype.setWorldAnchor1 = function(anchor1) {
	this.anchor1 = this.body1.getLocalPoint(anchor1);

	var d = vec2.sub(this.getWorldAnchor2(), anchor1);

	this.u_local = this.body1.getLocalVector(vec2.normalize(d));	
	this.n_local = vec2.perp(this.u_local);
}

WheelJoint.prototype.setWorldAnchor2 = function(anchor2) {
	this.anchor2 = this.body2.getLocalPoint(anchor2);

	var d = vec2.sub(anchor2, this.getWorldAnchor1());

	this.u_local = this.body1.getLocalVector(vec2.normalize(d));	
	this.n_local = vec2.perp(this.u_local);
}

WheelJoint.prototype.serialize = function() {
	return {
		"type": "WheelJoint",
		"body1": this.body1.id, 
		"body2": this.body2.id,
		"anchor1": this.body1.getWorldPoint(this.anchor1),
		"anchor2": this.body2.getWorldPoint(this.anchor2),
		"collideConnected": this.collideConnected,
		"maxForce": this.maxForce,
		"breakable": this.breakable,
		"motorEnabled": this.motorEnabled,
		"motorSpeed": this.motorSpeed,
		"maxMotorTorque": this.maxMotorTorque,
		"frequencyHz": this.frequencyHz,
		"dampingRatio": this.dampingRatio	
	};
}

WheelJoint.prototype.setSpringFrequencyHz = function(frequencyHz) {
	// NOTE: frequencyHz should be limited to under 4 times time steps
	this.frequencyHz = frequencyHz;
}

WheelJoint.prototype.setSpringDampingRatio = function(dampingRatio) {
	this.dampingRatio = dampingRatio;
}

WheelJoint.prototype.enableMotor = function(flag) {
	this.motorEnabled = flag;
}

WheelJoint.prototype.setMotorSpeed = function(speed) {
	this.motorSpeed = speed;
}

WheelJoint.prototype.setMaxMotorTorque = function(torque) {
	this.maxMotorTorque = torque;
}

WheelJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// Max impulse
	this.maxImpulse = this.maxForce * dt;	
		
	// Transformed r1, r2
	this.r1 = body1.xf.rotate(vec2.sub(this.anchor1, body1.centroid));
	this.r2 = body2.xf.rotate(vec2.sub(this.anchor2, body2.centroid));	

	// World anchor points
	var p1 = vec2.add(body1.p, this.r1);
	var p2 = vec2.add(body2.p, this.r2);

	// Delta vector between world anchor points
	var d = vec2.sub(p2, p1);

	// r1 + d
	this.r1_d = vec2.add(this.r1, d);

	// World line normal
	this.n = vec2.rotate(this.n_local, body1.a);
	
	// sn1, sn2
	this.sn1 = vec2.cross(this.r1_d, this.n);
	this.sn2 = vec2.cross(this.r2, this.n);

	// invEM = J * invM * JT
	var em_inv = body1.m_inv + body2.m_inv + body1.i_inv * this.sn1 * this.sn1 + body2.i_inv * this.sn2 * this.sn2;    
	this.em = em_inv > 0 ? 1 / em_inv : em_inv;

	// Compute soft constraint parameters
	if (this.frequencyHz > 0) {
		// World delta axis
		this.u = vec2.rotate(this.u_local, body1.a);

		// su1, su2
		this.su1 = vec2.cross(this.r1_d, this.u);
		this.su2 = vec2.cross(this.r2, this.u);
			
		// invEM = J * invM * JT
		var springEm_inv = body1.m_inv + body2.m_inv + body1.i_inv * this.su1 * this.su1 + body2.i_inv * this.su2 * this.su2;
		springEm = springEm_inv == 0 ? 0 : 1 / springEm_inv;

		// Frequency
		var omega = 2 * Math.PI * this.frequencyHz;

		// Spring stiffness
		var k = springEm * omega * omega;

		// Damping coefficient
		var c = springEm * 2 * this.dampingRatio * omega;

		// Soft constraint formulas
		// gamma and beta are divided by dt to reduce computation
		this.gamma = (c + k * dt) * dt;
		this.gamma = this.gamma == 0 ? 0 : 1 / this.gamma;
		var beta = dt * k * this.gamma;

		// Position constraint
		var pc = vec2.dot(d, this.u) - this.restLength;
		this.beta_c = beta * pc;

		// invEM = invEM + gamma * I (to reduce calculation)
		springEm_inv = springEm_inv + this.gamma;
		this.springEm = springEm_inv == 0 ? 0 : 1 / springEm_inv;
	}
	else {
		this.gamma = 0;
		this.beta_c = 0;
		this.springLambda_acc = 0;
	}

	if (this.motorEnabled) {
		this.maxMotorImpulse = this.maxMotorTorque * dt;

		// invEM2 = J2 * invM * J2T
		var motorEm_inv = body1.i_inv + body2.i_inv;
		this.motorEm = motorEm_inv > 0 ? 1 / motorEm_inv : motorEm_inv;
	}
	else {
		this.motorEm = 0;
		this.motorLambda_acc = 0;
	}
	
	if (warmStarting) {
		// impulse = JT * lambda
		var linearImpulse = vec2.scale(this.n, this.lambda_acc);
		var angularImpulse1 = this.sn1 * this.lambda_acc + this.motorLambda_acc;
		var angularImpulse2 = this.sn2 * this.lambda_acc + this.motorLambda_acc;

		if (this.frequencyHz > 0) {
			linearImpulse.addself(vec2.scale(this.u, this.springLambda_acc));
			angularImpulse1 += this.su1 * this.springLambda_acc;
			angularImpulse2 += this.su2 * this.springLambda_acc;			
		}

		// Apply cached constraint impulses
		// V += JT * lambda * invM
		body1.v.mad(linearImpulse, -body1.m_inv);
		body1.w -= angularImpulse1 * body1.i_inv;

		body2.v.mad(linearImpulse, body2.m_inv);
		body2.w += angularImpulse2 * body2.i_inv;
	}
	else {
		this.lambda_acc = 0;
		this.springLambda_acc = 0;
		this.motorLambda_acc = 0;
	}
}

WheelJoint.prototype.solveVelocityConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	// Solve spring constraint
	if (this.frequencyHz > 0) {
		// Compute lambda for velocity constraint
		// Solve J * invM * JT * lambda = -(J * V + beta * C + gamma * (lambda_acc + lambda))
		var cdot = this.u.dot(vec2.sub(body2.v, body1.v)) + this.su2 * body2.w - this.su1 * body1.w;
		var soft = this.beta_c + this.gamma * this.springLambda_acc;
		var lambda = -this.springEm * (cdot + soft);

		// Accumulate lambda
		this.springLambda_acc += lambda;

		// linearImpulse = JT * lambda
		var impulse = vec2.scale(this.u, lambda);

		// Apply constraint impulses
		// V += JT * lambda * invM
		body1.v.mad(impulse, -body1.m_inv);
		body1.w -= this.su1 * lambda * body1.i_inv;

		body2.v.mad(impulse, body2.m_inv);
		body2.w += this.su2 * lambda * body2.i_inv;
	}

	// Solve motor constraint
	if (this.motorEnabled) {
		// Compute motor impulse
		var cdot = body2.w - body1.w - this.motorSpeed;
		var lambda = -this.motorEm * cdot;

		var motorLambdaOld = this.motorLambda_acc;
		this.motorLambda_acc = Math.clamp(this.motorLambda_acc + lambda, -this.maxMotorImpulse, this.maxMotorImpulse);
		lambda = this.motorLambda_acc - motorLambdaOld;

		// Apply motor impulses
		body1.w -= lambda * body1.i_inv;
		body2.w += lambda * body2.i_inv;
	}

	// Compute lambda for velocity constraint
	// Solve J * invM * JT * lambda = -J * V
	var cdot = this.n.dot(vec2.sub(body2.v, body1.v)) + this.sn2 * body2.w - this.sn1 * body1.w;
	var lambda = -this.em * cdot;

	// Accumulate lambda
	this.lambda_acc += lambda;

	// linearImpulse = JT * lambda
	var impulse = vec2.scale(this.n, lambda);
	
	// Apply constraint impulses
	// V += JT * lambda * invM
	body1.v.mad(impulse, -body1.m_inv);
	body1.w -= this.sn1 * lambda * body1.i_inv;

	body2.v.mad(impulse, body2.m_inv);
	body2.w += this.sn2 * lambda * body2.i_inv;
}

WheelJoint.prototype.solvePositionConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	// Transformed r1, r2
	var r1 = vec2.rotate(vec2.sub(this.anchor1, body1.centroid), body1.a);
	var r2 = vec2.rotate(vec2.sub(this.anchor2, body2.centroid), body2.a);

	// World anchor points
	var p1 = vec2.add(body1.p, r1);
	var p2 = vec2.add(body2.p, r2);

	// Delta vector between world anchor points
	var d = vec2.sub(p2, p1);

	// r1 + d
	var r1_d = vec2.add(r1, d);

	// World line normal
	var n = vec2.rotate(this.n_local, body1.a);

	// Position constraint
	var c = vec2.dot(n, d);
	var correction = Math.clamp(c, -Joint.MAX_LINEAR_CORRECTION, Joint.MAX_LINEAR_CORRECTION);
	
	// Compute lambda for position constraint
	// Solve J * invM * JT * lambda = -C / dt
	var s1 = vec2.cross(r1_d, n);
	var s2 = vec2.cross(r2, n);
	var em_inv = body1.m_inv + body2.m_inv + body1.i_inv * s1 * s1 + body2.i_inv * s2 * s2;
	var k_inv = em_inv == 0 ? 0 : 1 / em_inv;
	var lambda_dt = k_inv * (-correction);

	// Apply constraint impulses
	// impulse = JT * lambda
	// X += impulse * invM * dt
	var impulse_dt = vec2.scale(n, lambda_dt);

	body1.p.mad(impulse_dt, -body1.m_inv);
	body1.a -= s1 * lambda_dt * body1.i_inv;

	body2.p.mad(impulse_dt, body2.m_inv);
	body2.a += s2 * lambda_dt * body2.i_inv;

	return Math.abs(c) < Joint.LINEAR_SLOP;
}

WheelJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.scale(this.n, this.lambda_acc * dt_inv);
}

WheelJoint.prototype.getReactionTorque = function(dt_inv) {
	return 0;
}

