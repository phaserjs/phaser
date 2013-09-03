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
// Revolute Joint
//
// Point-to-Point Constraint:
// C1 = p2 - p1
// C1dot = v2 + cross(w2, r2) - v1 - cross(w1, r1)
//      = -v1 + cross(r1, w1) + v2 - cross(r2, w1)
// J1 = [ -I, skew(r1), I, -skew(r2) ]
//
// Angular Constraint (for angle limit):
// C2 = a2 - a1 - refAngle
// C2dot = w2 - w1
// J2 = [ 0, -1, 0, 1 ]
//
// Block Jacobian Matrix:
// J = [ -I, skew(r1), I, -skew(r2) ]
//     [  0,       -1, 0,         1 ]
//
// impulse = JT * lambda = [ -lambda_xy, -(cross(r1, lambda_xy) + lambda_z), lambda_xy, cross(r1, lambda_xy) + lambda_z ]
//-------------------------------------------------------------------------------------------------

RevoluteJoint = function(body1, body2, anchor) {
	Joint.call(this, Joint.TYPE_REVOLUTE, body1, body2, false);	

	this.anchor1 = this.body1.getLocalPoint(anchor);
	this.anchor2 = this.body2.getLocalPoint(anchor);

	// Initial angle difference
	this.refAngle = body2.a - body1.a;

	// Accumulated lambda
	this.lambda_acc = new vec3(0, 0, 0);
	this.motorLambda_acc = 0;

	// Angle limit
	this.limitEnabled = false;
	this.limitLowerAngle = 0;
	this.limitUpperAngle = 0;
	this.limitState = Joint.LIMIT_STATE_INACTIVE;

	// Motor
	this.motorEnabled = false;
	this.motorSpeed = 0;
	this.maxMotorTorque = 0;
}

RevoluteJoint.prototype = new Joint;
RevoluteJoint.prototype.constructor = RevoluteJoint;

RevoluteJoint.prototype.setWorldAnchor1 = function(anchor1) {
	this.anchor1 = this.body1.getLocalPoint(anchor1);
	this.anchor2 = this.body2.getLocalPoint(anchor1);
}

RevoluteJoint.prototype.setWorldAnchor2 = function(anchor2) {
	this.anchor1 = this.body1.getLocalPoint(anchor2);
	this.anchor2 = this.body2.getLocalPoint(anchor2);	
}

RevoluteJoint.prototype.serialize = function() {
	return {
		"type": "RevoluteJoint",
		"body1": this.body1.id,
		"body2": this.body2.id,
		"anchor": this.body1.getWorldPoint(this.anchor1),
		"collideConnected": this.collideConnected,
		"maxForce": this.maxForce,
		"breakable": this.breakable,
		"limitEnabled": this.limitEnabled,
		"limitLowerAngle": this.limitLowerAngle,
		"limitUpperAngle": this.limitUpperAngle,
		"motorEnabled": this.motorEnabled,
		"motorSpeed": this.motorSpeed,
		"maxMotorTorque": this.maxMotorTorque
	};
}

RevoluteJoint.prototype.enableMotor = function(flag) {
	this.motorEnabled = flag;
}

RevoluteJoint.prototype.setMotorSpeed = function(speed) {
	this.motorSpeed = speed;
}

RevoluteJoint.prototype.setMaxMotorTorque = function(torque) {
	this.maxMotorTorque = torque;
}

RevoluteJoint.prototype.enableLimit = function(flag) {
	this.limitEnabled = flag;
}

RevoluteJoint.prototype.setLimits = function(lower, upper) {
	this.limitLowerAngle = lower;
	this.limitUpperAngle = upper;
}

RevoluteJoint.prototype.initSolver = function(dt, warmStarting) {
	var body1 = this.body1;
	var body2 = this.body2;

	// Max impulse
	this.maxImpulse = this.maxForce * dt;

	if (!this.motorEnabled) {
		this.motorLambda_acc = 0;
	}
	else {
		this.maxMotorImpulse = this.maxMotorTorque * dt;
	}

	if (this.limitEnabled) {
		var da = body2.a - body1.a - this.refAngle;

		if (Math.abs(this.limitUpperAngle - this.limitLowerAngle) < Joint.ANGULAR_SLOP) {
			this.limitState = Joint.LIMIT_STATE_EQUAL_LIMITS;
		}
		else if (da <= this.limitLowerAngle) {
			if (this.limitState != Joint.LIMIT_STATE_AT_LOWER) {
				this.lambda_acc.z = 0;
			}
			this.limitState = Joint.LIMIT_STATE_AT_LOWER;
		}
		else if (da >= this.limitUpperAngle) {
			if (this.limitState != Joint.LIMIT_STATE_AT_UPPER) {
				this.lambda_acc.z = 0;
			}
			this.limitState = Joint.LIMIT_STATE_AT_UPPER;
		}
		else {
			this.limitState = Joint.LIMIT_STATE_INACTIVE;
			this.lambda_acc.z = 0;
		}
	}
	else {
		this.limitState = Joint.LIMIT_STATE_INACTIVE;
	}	

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

	// K2 = J2 * invM * J2T
	if (k33 != 0) {
		this.em2 = 1 / k33;
	}
	
	if (warmStarting) {
		// Apply cached constraint impulses
		// V += JT * lambda
		var lambda_xy = new vec2(this.lambda_acc.x, this.lambda_acc.y);
		var lambda_z = this.lambda_acc.z + this.motorLambda_acc;

		body1.v.mad(lambda_xy, -body1.m_inv);
		body1.w -= (vec2.cross(this.r1, lambda_xy) + lambda_z) * body1.i_inv;

		body2.v.mad(lambda_xy, body2.m_inv);
		body2.w += (vec2.cross(this.r2, lambda_xy) + lambda_z) * body2.i_inv;
	}
	else {
		this.lambda_acc.set(0, 0, 0);
		this.motorLambda_acc = 0;
	}
}

RevoluteJoint.prototype.solveVelocityConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	// Solve motor constraint
	if (this.motorEnabled && this.limitState != Joint.LIMIT_STATE_EQUAL_LIMITS) {
		// Compute motor impulse
		var cdot = body2.w - body1.w - this.motorSpeed;
		var lambda = -this.em2 * cdot;
		var motorLambdaOld = this.motorLambda_acc;
		this.motorLambda_acc = Math.clamp(this.motorLambda_acc + lambda, -this.maxMotorImpulse, this.maxMotorImpulse);
		lambda = this.motorLambda_acc - motorLambdaOld;

		// Apply motor constraint impulses
		body1.w -= lambda * body1.i_inv;
		body2.w += lambda * body2.i_inv;
	}

	// Solve point-to-point constraint with angular limit
	if (this.limitEnabled && this.limitState != Joint.LIMIT_STATE_INACTIVE) {
		// Compute lambda for velocity constraint
		// Solve J * invM * JT * lambda = -J * V
		// in 2D: cross(w, r) = perp(r) * w
		var v1 = vec2.mad(body1.v, vec2.perp(this.r1), body1.w);
   		var v2 = vec2.mad(body2.v, vec2.perp(this.r2), body2.w);
   		var cdot1 = vec2.sub(v2, v1);
   		var cdot2 = body2.w - body1.w;
   		var cdot = vec3.fromVec2(cdot1, cdot2);
		var lambda = this.em_inv.solve(cdot.neg());

		if (this.limitState == Joint.LIMIT_STATE_EQUAL_LIMITS) {
			// Accumulate lambda
			this.lambda_acc.addself(lambda);
		}
		else if (this.limitState == Joint.LIMIT_STATE_AT_LOWER || this.limitState == Joint.LIMIT_STATE_AT_UPPER) {
			// Accumulated new lambda.z
			var newLambda_z = this.lambda_acc.z + lambda.z;

			var lowerLimited = this.limitState == Joint.LIMIT_STATE_AT_LOWER && newLambda_z < 0;
			var upperLimited = this.limitState == Joint.LIMIT_STATE_AT_UPPER && newLambda_z > 0;

			if (lowerLimited || upperLimited) {
				// Modify last equation to get lambda_acc.z to 0
				// That is, lambda.z have to be equal -lambda_acc.z
				// rhs = -J * V - (K_13, K_23, K_33) * (lambda.z + lambda_acc.z)
				// Solve J * invM * JT * reduced_lambda = rhs				
				var rhs = vec2.add(cdot1, vec2.scale(new vec2(this.em_inv._13, this.em_inv._23), newLambda_z));
				var reduced = this.em_inv.solve2x2(rhs.neg());
				lambda.x = reduced.x;
				lambda.y = reduced.y;
				lambda.z = -this.lambda_acc.z;
				
				// Accumulate lambda
				this.lambda_acc.x += lambda.x;
				this.lambda_acc.y += lambda.y;
				this.lambda_acc.z = 0;
			}
			else {
				// Accumulate lambda
				this.lambda_acc.addself(lambda);
			}
		}

		// Apply constraint impulses
		// V += JT * lambda * invM
		var lambda_xy = new vec2(lambda.x, lambda.y);

		body1.v.mad(lambda_xy, -body1.m_inv);
		body1.w -= (vec2.cross(this.r1, lambda_xy) + lambda.z) * body1.i_inv;

		body2.v.mad(lambda_xy, body2.m_inv);
		body2.w += (vec2.cross(this.r2, lambda_xy) + lambda.z) * body2.i_inv;
	}
	// Solve point-to-point constraint
	else {
		// Compute lambda for velocity constraint
		// Solve J1 * invM * J1T * lambda = -J1 * V
		// in 2D: cross(w, r) = perp(r) * w
		var v1 = vec2.mad(body1.v, vec2.perp(this.r1), body1.w);
   		var v2 = vec2.mad(body2.v, vec2.perp(this.r2), body2.w);   		
   		var cdot = vec2.sub(v2, v1);
		var lambda = this.em_inv.solve2x2(cdot.neg());

		// Accumulate lambda
		this.lambda_acc.addself(vec3.fromVec2(lambda, 0));

		// Apply constraint impulses
		// V += J1T * lambda * invM
		body1.v.mad(lambda, -body1.m_inv);
		body1.w -= vec2.cross(this.r1, lambda) * body1.i_inv;

		body2.v.mad(lambda, body2.m_inv);
		body2.w += vec2.cross(this.r2, lambda) * body2.i_inv;
	}
}

RevoluteJoint.prototype.solvePositionConstraints = function() {
	var body1 = this.body1;
	var body2 = this.body2;

	var angularError = 0;
	var positionError = 0;

	// Solve limit constraint
	if (this.limitEnabled && this.limitState != Joint.LIMIT_STATE_INACTIVE) {
		var da = body2.a - body1.a - this.refAngle;

		// angular lambda = -EM * C / dt
		var angularImpulseDt = 0;
		
		if (this.limitState == Joint.LIMIT_STATE_EQUAL_LIMITS) {
			var c = Math.clamp(da - this.limitLowerAngle, -Joint.MAX_ANGULAR_CORRECTION, Joint.MAX_ANGULAR_CORRECTION);

			angularError = Math.abs(c);
			angularImpulseDt = -this.em2 * c;
		}
		else if (this.limitState == Joint.LIMIT_STATE_AT_LOWER) {
			var c = da - this.limitLowerAngle;
			
			angularError = -c;
			c = Math.clamp(c + Joint.ANGULAR_SLOP, -Joint.MAX_ANGULAR_CORRECTION, 0);
			angularImpulseDt = -this.em2 * c;
		}
		else if (this.limitState == Joint.LIMIT_STATE_AT_UPPER) {
			var c = da - this.limitUpperAngle;

			angularError = c;
			c = Math.clamp(c - Joint.ANGULAR_SLOP, 0, Joint.MAX_ANGULAR_CORRECTION);
			angularImpulseDt = -this.em2 * c;
		}

		body1.a -= angularImpulseDt * body1.i_inv;
		body2.a += angularImpulseDt * body2.i_inv;
	}

	// Solve point-to-point constraint
	{
		// Transformed r1, r2
		var r1 = vec2.rotate(vec2.sub(this.anchor1, body1.centroid), body1.a);
		var r2 = vec2.rotate(vec2.sub(this.anchor2, body2.centroid), body2.a);

		// Position constraint
		var c = vec2.sub(vec2.add(body2.p, r2), vec2.add(body1.p, r1));
		var correction = vec2.truncate(c, Joint.MAX_LINEAR_CORRECTION);
		positionError = correction.length();

		// Compute lambda for position constraint
		// Solve J1 * invM * J1T * lambda = -C / dt
		var sum_m_inv = body1.m_inv + body2.m_inv;
		var r1y_i = r1.y * body1.i_inv;
		var r2y_i = r2.y * body2.i_inv;
		var k11 = sum_m_inv + r1.y * r1y_i + r2.y * r2y_i;
		var k12 = -r1.x * r1y_i - r2.x * r2y_i;
		var k22 = sum_m_inv + r1.x * r1.x * body1.i_inv + r2.x * r2.x * body2.i_inv;
		var em_inv = new mat2(k11, k12, k12, k22);
		var lambda_dt = em_inv.solve(correction.neg());
	
		// Apply constraint impulses
		// impulse = J1T * lambda
		// X += impulse * invM * dt
		body1.p.mad(lambda_dt, -body1.m_inv);
		body1.a -= vec2.cross(r1, lambda_dt) * body1.i_inv;

		body2.p.mad(lambda_dt, body2.m_inv);
		body2.a += vec2.cross(r2, lambda_dt) * body2.i_inv;
	}

	return positionError < Joint.LINEAR_SLOP && angularError < Joint.ANGULAR_SLOP;
}

RevoluteJoint.prototype.getReactionForce = function(dt_inv) {
	return vec2.scale(this.lambda_acc, dt_inv);
}

RevoluteJoint.prototype.getReactionTorque = function(dt_inv) {
	return 0;
}