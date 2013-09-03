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
// Distance Joint
//
// d = p2 - p1
// u = d / norm(d)
// C = norm(d) - l
// C = sqrt(dot(d, d)) - l
// Cdot = dot(u, v2 + cross(w2, r2) - v1 - cross(w1, r1))
//      = -dot(u, v1) - dot(w1, cross(r1, u)) + dot(u, v2) + dot(w2, cross(r2, u))
// J = [ -u, -cross(r1, u), u, cross(r2, u) ]
//
// impulse = JT * lambda = [ -u * lambda, -cross(r1, u) * lambda, u * lambda, cross(r1, u) * lambda ]
//-------------------------------------------------------------------------------------------------

DistanceJoint = function(body1, body2, anchor1, anchor2) {
	Joint.call(this, Joint.TYPE_DISTANCE, body1, body2, true);

	// Local anchor points
	this.anchor1 = this.body1.getLocalPoint(anchor1);
	this.anchor2 = this.body2.getLocalPoint(anchor2);

	// Rest length
	this.restLength = vec2.dist(anchor1, anchor2);

	// Soft constraint coefficients
	this.gamma = 0;
	this.beta_c = 0;

	// Spring coefficients
	this.frequencyHz = 0;
	this.dampingRatio = 0;

	// Accumulated impulse
	this.lambda_acc = 0;
}

DistanceJoint.prototype = new Joint;
DistanceJoint.prototype.constructor = DistanceJoint;

DistanceJoint.prototype.setWorldAnchor1 = function(anchor1) {
	this.anchor1 = this.body1.getLocalPoint(anchor1);

	this.restLength = vec2.dist(anchor1, this.getWorldAnchor2());
}

DistanceJoint.prototype.setWorldAnchor2 = function(anchor2) {
	this.anchor2 = this.body2.getLocalPoint(anchor2);

	this.restLength = vec2.dist(anchor2, this.getWorldAnchor1());
}

DistanceJoint.prototype.serialize = function() {
	return {
		"type": "DistanceJoint",
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

DistanceJoint.prototype.setSpringFrequencyHz = function(frequencyHz) {
	// NOTE: frequencyHz should be limited to under 4 times time steps
	this.frequencyHz = frequencyHz;
}

DistanceJoint.prototype.setSpringDampingRatio = function(dampingRatio) {
	this.dampingRatio = dampingRatio;
}

DistanceJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// Max impulse
	this.maxImpulse = this.maxForce * dt;

	// Transformed r1, r2
	this.r1 = body1.xf.rotate(vec2.sub(this.anchor1, body1.centroid));
	this.r2 = body2.xf.rotate(vec2.sub(this.anchor2, body2.centroid));

	// Delta vector between two world anchors
	var d = vec2.sub(vec2.add(body2.p, this.r2), vec2.add(body1.p, this.r1));

	// Distance between two anchors
	var dist = d.length();

	// Unit delta vector
	if (dist > Joint.LINEAR_SLOP) {
		this.u = vec2.scale(d, 1 / dist);
	}
	else {
		this.u = vec2.zero;
	}
	
	// s1, s2
	this.s1 = vec2.cross(this.r1, this.u);
	this.s2 = vec2.cross(this.r2, this.u);
		
	// invEM = J * invM * JT
	var em_inv = body1.m_inv + body2.m_inv + body1.i_inv * this.s1 * this.s1 + body2.i_inv * this.s2 * this.s2;
	this.em = em_inv == 0 ? 0 : 1 / em_inv;	

	// Compute soft constraint parameters
	if (this.frequencyHz > 0) {		
		// Frequency
		var omega = 2 * Math.PI * this.frequencyHz;

		// Spring stiffness
		var k = this.em * omega * omega;

		// Damping coefficient
		var c = this.em * 2 * this.dampingRatio * omega;

		// Soft constraint formulas
		// gamma and beta are divided by dt to reduce computation
		this.gamma = (c + k * dt) * dt;
		this.gamma = this.gamma == 0 ? 0 : 1 / this.gamma;
		var beta = dt * k * this.gamma;

		// Position constraint
		var pc = dist - this.restLength;
		this.beta_c = beta * pc;

		// invEM = invEM + gamma * I (to reduce calculation)
		em_inv = em_inv + this.gamma;
		this.em = em_inv == 0 ? 0 : 1 / em_inv;
	}
	else {
		this.gamma = 0;
		this.beta_c = 0;
	}

	if (warmStarting) {
		// linearImpulse = JT * lambda
		var impulse = vec2.scale(this.u, this.lambda_acc);

		// Apply cached constraint impulses
		// V += JT * lambda * invM
		body1.v.mad(impulse, -body1.m_inv);
		body1.w -= this.s1 * this.lambda_acc * body1.i_inv;

		body2.v.mad(impulse, body2.m_inv);
		body2.w += this.s2 * this.lambda_acc * body2.i_inv;
	}
	else {
		this.lambda_acc = 0;
	}
}

DistanceJoint.prototype.solveVelocityConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	// Compute lambda for velocity constraint
	// Solve J * invM * JT * lambda = -(J * V + beta * C + gamma * (lambda_acc + lambda))
	var cdot = this.u.dot(vec2.sub(body2.v, body1.v)) + this.s2 * body2.w - this.s1 * body1.w;
	var soft = this.beta_c + this.gamma * this.lambda_acc;
	var lambda = -this.em * (cdot + soft);

	// Accumulate lambda
	this.lambda_acc += lambda;

	// linearImpulse = JT * lambda
	var impulse = vec2.scale(this.u, lambda);

	// Apply constraint impulses
	// V += JT * lambda * invM
	body1.v.mad(impulse, -body1.m_inv);
	body1.w -= this.s1 * lambda * body1.i_inv;

	body2.v.mad(impulse, body2.m_inv);
	body2.w += this.s2 * lambda * body2.i_inv;
}

DistanceJoint.prototype.solvePositionConstraints = function() {
	// There is no position correction for soft constraints
	if (this.frequencyHz > 0) {
		return true;
	}

	var body1 = this.body1;
	var body2 = this.body2;

	// Transformed r1, r2
	var r1 = vec2.rotate(vec2.sub(this.anchor1, body1.centroid), body1.a);
	var r2 = vec2.rotate(vec2.sub(this.anchor2, body2.centroid), body2.a);

	// Delta vector between two anchors
	var d = vec2.sub(vec2.add(body2.p, r2), vec2.add(body1.p, r1));

	// Distance between two anchors
	var dist = d.length();

	// Unit delta vector
	var u = vec2.scale(d, 1 / dist);

	// Position constraint
	var c = dist - this.restLength;
	var correction = Math.clamp(c, -Joint.MAX_LINEAR_CORRECTION, Joint.MAX_LINEAR_CORRECTION);

	// Compute lambda for correction
	// Solve J * invM * JT * lambda = -C / dt
	var s1 = vec2.cross(r1, u);
	var s2 = vec2.cross(r2, u);
	var em_inv = body1.m_inv + body2.m_inv + body1.i_inv * s1 * s1 + body2.i_inv * s2 * s2;
	var lambda_dt = em_inv == 0 ? 0 : -correction / em_inv;
	
	// Apply constraint impulses
	// impulse = JT * lambda
	// X += impulse * invM * dt
	var impulse_dt = vec2.scale(u, lambda_dt);

	body1.p.mad(impulse_dt, -body1.m_inv);
	body1.a -= s1 * lambda_dt * body1.i_inv;

	body2.p.mad(impulse_dt, body2.m_inv);
	body2.a += s2 * lambda_dt * body2.i_inv;

	return Math.abs(c) < Joint.LINEAR_SLOP;
}

DistanceJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.scale(this.u, this.lambda_acc * dt_inv);
}

DistanceJoint.prototype.getReactionTorque = function(dt_inv) {
	return 0;
}
/*
//------------------------------------------
// MaxDistance Joint
//------------------------------------------

MaxDistanceJoint = function(body1, body2, anchor1, anchor2, minDist, maxDist) {
	Joint.call(this, body1, body2, true);

	// Local anchor points
	this.anchor1 = body1.getLocalPoint(anchor1);
	this.anchor2 = body2.getLocalPoint(anchor2);

	this.minDist = minDist || 0;
	this.maxDist = maxDist;

	if (maxDist == undefined) {
		var p1 = vec2.add(vec2.rotate(vec2.sub(this.anchor1, body1.centroid), body1.a), body1.p);
		var p2 = vec2.add(vec2.rotate(vec2.sub(this.anchor2, body2.centroid), body2.a), body2.p);

		this.maxDist = vec2.dist(p1, p2);
	}

	// accumulated impulse
	this.lambda_acc = 0;
}

MaxDistanceJoint.prototype = new Joint;
MaxDistanceJoint.prototype.constructor = MaxDistanceJoint;

MaxDistanceJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// max impulse
	this.maxImpulse = this.maxForce * dt;

	// transformed r1, r2	
	this.r1 = body1.xf.rotate(vec2.sub(this.anchor1, body1.centroid));
	this.r2 = body2.xf.rotate(vec2.sub(this.anchor2, body2.centroid));

	// delta vector between two anchors
	var d = vec2.sub(vec2.add(body2.p, this.r2), vec2.add(body1.p, this.r1));

	// distance between two anchors
	var dist = d.length();

	// unit delta vector
	this.u = vec2.scale(d, 1 / dist);

	// s1, s2
	this.s1 = vec2.cross(this.r1, this.u);
	this.s2 = vec2.cross(this.r2, this.u);

	// invEM = J * invM * JT
	var em_inv = body1.m_inv + body2.m_inv + body1.i_inv * this.s1 * this.s1 + body2.i_inv * this.s2 * this.s2;
	this.em = em_inv == 0 ? 0 : 1 / em_inv;

	// initial error
	this.initial_err = 0;
	if (dist < this.minDist) {
		this.initial_err = dist - this.minDist;
	}
	else if (dist > this.maxDist) {
		this.initial_err = dist - this.maxDist;
	}

	if (this.initial_err == 0) {
		this.lambda_acc = 0;
	}

	if (warmStarting) {
		// apply cached impulses
		// V += JT * lambda
		var impulse = vec2.scale(this.u, this.lambda_acc);
	
		body1.v.mad(impulse, -body1.m_inv);
		body1.w -= this.s1 * this.lambda_acc * body1.i_inv;

		body2.v.mad(impulse, body2.m_inv);
		body2.w += this.s2 * this.lambda_acc * body2.i_inv;
	}
	else {
		this.lambda_acc = 0;
	}
}

MaxDistanceJoint.prototype.solveVelocityConstraints = function() {
	if (this.initial_err == 0)
		return;

	var body1 = this.body1;
	var body2 = this.body2;

	// compute lambda for velocity constraint	
	// solve J * invM * JT * lambda = -J * V
	var cdot = this.u.dot(vec2.sub(body2.v, body1.v)) + this.s2 * body2.w - this.s1 * body1.w;
	var lambda = -this.em * cdot;

	// accumulate lambda for velocity constraint
	this.lambda_acc += lambda;

	// apply impulses
	// V += JT * lambda
	var impulse = vec2.scale(this.u, lambda);
	
	body1.v.mad(impulse, -body1.m_inv);
	body1.w -= this.s1 * lambda * body1.i_inv;

	body2.v.mad(impulse, body2.m_inv);
	body2.w += this.s2 * lambda * body2.i_inv;
}

MaxDistanceJoint.prototype.solvePositionConstraints = function() {
	if (this.initial_err == 0)
		return;

	var body1 = this.body1;
	var body2 = this.body2;

	// transformed r1, r2	
	var r1 = vec2.rotate(vec2.sub(this.anchor1, body1.centroid), body1.a);
	var r2 = vec2.rotate(vec2.sub(this.anchor2, body2.centroid), body2.a);

	// World Center points
	var pc1 = vec2.add(body1.p, body1.centroid);
	var pc2 = vec2.add(body2.p, body2.centroid);

	// delta vector between two anchors
	var d = vec2.sub(vec2.add(pc2, r2), vec2.add(pc1, r1));

	// distance between two anchors
	var dist = d.length();

	// unit delta vector
	u = vec2.scale(d, 1 / dist);
	
	// position constraint
	var c = 0;
	if (dist < this.minDist) {
		c = dist - this.minDist;
	}
	else if (dist > this.maxDist) {
		c = dist - this.maxDist;
	}
	var correction = Math.clamp(c, -Joint.MAX_LINEAR_CORRECTION, Joint.MAX_LINEAR_CORRECTION);

	// compute lambda for position constraint	
	// solve J * invM * JT * lambda = -C / dt
	var s1 = vec2.cross(r1, u);
	var s2 = vec2.cross(r2, u);
	var em_inv = body1.m_inv + body2.m_inv + body1.i_inv * s1 * s1 + body2.i_inv * s2 * s2;		
	var lambda_dt = em_inv == 0 ? 0 : -correction / em_inv;	

	// apply impulses
	// X += JT * lambda * dt
	var impulse_dt = vec2.scale(u, lambda_dt);

	body1.p.mad(impulse_dt, -body1.m_inv);
	body1.a -= s1 * lambda_dt * body1.i_inv;

	body2.p.mad(impulse_dt, body2.m_inv);
	body2.a += s2 * lambda_dt * body2.i_inv;

	return Math.abs(c) < Joint.LINEAR_SLOP;
}

MaxDistanceJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.scale(this.u, this.lambda_acc * dt_inv);
}

MaxDistanceJoint.prototype.getReactionTorque = function(dt_inv) {
	return 0;
}

//------------------------------------------
// Damped Spring (Deprecated)
//------------------------------------------

SpringJoint = function(body1, body2, anchor1, anchor2, restLength, stiffness, damping) {
	Joint.call(this, body1, body2, true);

	// local anchor points
	this.anchor1 = anchor1;
	this.anchor2 = anchor2;	

	this.restLength = restLength;
	this.stiffness = stiffness;
	this.damping = damping;
}

SpringJoint.prototype = new Joint;
SpringJoint.prototype.constructor = SpringJoint;

SpringJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// transformed r1, r2
	this.r1 = body1.xf.rotate(vec2.sub(this.anchor1, body2.centroid));
	this.r2 = body2.xf.rotate(vec2.sub(this.anchor2, body2.centroid));

	var d = vec2.sub(vec2.add(body2.p, this.r2), vec2.add(body1.p, this.r1));
	var dist = d.length();

	this.u = vec2.scale(d, 1 / dist);

	// s1, s2
	this.s1 = vec2.cross(this.r1, this.u);
	this.s2 = vec2.cross(this.r2, this.u);
	
	// invEM = J * invM * JT
	var em_inv = body1.m_inv + body2.m_inv + body1.i_inv * this.s1 * this.s1 + body2.i_inv * this.s2 * this.s2;
	this.em = em_inv == 0 ? 0 : 1 / em_inv;
	
	//
	this.target_rnv = 0;
	this.v_coeff = 1.0 - Math.exp(-this.damping * dt * em_inv);

	// apply spring force
	var spring_f = (this.restLength - dist) * this.stiffness;
	this.spring_impulse = spring_f * dt;

	// apply impulses
	// V += JT * lambda
	var impulse = vec2.scale(this.u, this.spring_impulse);
	
	body1.v.mad(impulse, -body1.m_inv);
	body1.w -= this.s1 * this.spring_impulse * body1.i_inv;

	body2.v.mad(impulse, body2.m_inv);
	body2.w += this.s2 * this.spring_impulse * body2.i_inv;
}

SpringJoint.prototype.solveVelocityConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;
	
	// compute lambda for velocity constraint	
	// solve J * invM * JT * lambda = -J * V
	var cdot = this.u.dot(vec2.sub(body2.v, body1.v)) + this.s2 * body2.w - this.s1 * body1.w;
	var rnv = cdot + this.target_rnv;

	// compute velocity loss from drag
	var v_damp = rnv * this.v_coeff;
	this.target_rnv = -rnv + v_damp;
	var lambda = -this.em * v_damp;

	// apply impulses
	// V += JT * lambda
	var impulse = vec2.scale(this.u, lambda);

	body1.v.mad(impulse, -body1.m_inv);
	body1.w -= this.s1 * lambda * body1.i_inv;

	body2.v.mad(impulse, body2.m_inv);
	body2.w += this.s2 * lambda * body2.i_inv;
}

SpringJoint.prototype.solvePositionConstraints = function() {
	return true;
}

SpringJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.scale(this.u, this.spring_impulse * dt_inv);
}

SpringJoint.prototype.getReactionTorque = function(dt_inv) {
	return 0;
}*/
