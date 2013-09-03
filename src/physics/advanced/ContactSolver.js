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
// Contact Constraint
//
// Non-penetration constraint:
// C = dot(p2 - p1, n)
// Cdot = dot(v2 - v1, n)
// J = [ -n, -cross(r1, n), n, cross(r2, n) ]
//
// impulse = JT * lambda = [ -n * lambda, -cross(r1, n) * lambda, n * lambda, cross(r1, n) * lambda ]
//
// Friction constraint:
// C = dot(p2 - p1, t)
// Cdot = dot(v2 - v1, t)
// J = [ -t, -cross(r1, t), t, cross(r2, t) ]
//
// impulse = JT * lambda = [ -t * lambda, -cross(r1, t) * lambda, t * lambda, cross(r1, t) * lambda ]
//
// NOTE: lambda is an impulse in constraint space.
//-------------------------------------------------------------------------------------------------

function ContactSolver(shape1, shape2) {
	// Contact shapes
	this.shape1 = shape1;
	this.shape2 = shape2;

	// Contact list
	this.contactArr = [];

	// Coefficient of restitution (elasticity)
	this.e = 1; 

	// Frictional coefficient
	this.u = 1;
}

ContactSolver.COLLISION_SLOP = 0.0008;
ContactSolver.BAUMGARTE = 0.28;
ContactSolver.MAX_LINEAR_CORRECTION = 1;//Infinity;

ContactSolver.prototype.update = function(newContactArr) {
	for (var i = 0; i < newContactArr.length; i++) {
		var newContact = newContactArr[i];
		var k = -1;
		for (var j = 0; j < this.contactArr.length; j++) {
			if (newContact.hash == this.contactArr[j].hash) {
				k = j;
				break;
			}
		}

		if (k > -1) {
			newContact.lambda_n_acc = this.contactArr[k].lambda_n_acc;
			newContact.lambda_t_acc = this.contactArr[k].lambda_t_acc;
		}
	}

	this.contactArr = newContactArr;
}

ContactSolver.prototype.initSolver = function(dt_inv) {
	var body1 = this.shape1.body;
	var body2 = this.shape2.body;

	var sum_m_inv = body1.m_inv + body2.m_inv;

	for (var i = 0; i < this.contactArr.length; i++) {
		var con = this.contactArr[i];

		// Transformed r1, r2
		con.r1 = vec2.sub(con.p, body1.p);
		con.r2 = vec2.sub(con.p, body2.p);

		// Local r1, r2
		con.r1_local = body1.xf.unrotate(con.r1);
		con.r2_local = body2.xf.unrotate(con.r2);

		var n = con.n;
		var t = vec2.perp(con.n);

		// invEMn = J * invM * JT
		// J = [ -n, -cross(r1, n), n, cross(r2, n) ]		
		var sn1 = vec2.cross(con.r1, n);
		var sn2 = vec2.cross(con.r2, n);
		var emn_inv = sum_m_inv + body1.i_inv * sn1 * sn1 + body2.i_inv * sn2 * sn2;
		con.emn = emn_inv == 0 ? 0 : 1 / emn_inv;

		// invEMt = J * invM * JT
		// J = [ -t, -cross(r1, t), t, cross(r2, t) ]
		var st1 = vec2.cross(con.r1, t);
		var st2 = vec2.cross(con.r2, t);
		var emt_inv = sum_m_inv + body1.i_inv * st1 * st1 + body2.i_inv * st2 * st2;
		con.emt = emt_inv == 0 ? 0 : 1 / emt_inv;
		
		// Linear velocities at contact point
		// in 2D: cross(w, r) = perp(r) * w
		var v1 = vec2.mad(body1.v, vec2.perp(con.r1), body1.w);
		var v2 = vec2.mad(body2.v, vec2.perp(con.r2), body2.w);

		// relative velocity at contact point
		var rv = vec2.sub(v2, v1);

		// bounce velocity dot n
		con.bounce = vec2.dot(rv, con.n) * this.e;
	}
}

ContactSolver.prototype.warmStart = function() {

	var body1 = this.shape1.body;
	var body2 = this.shape2.body;

	for (var i = 0; i < this.contactArr.length; i++) {
		var con = this.contactArr[i];
		var n = con.n;
		var lambda_n = con.lambda_n_acc;
		var lambda_t = con.lambda_t_acc;

		// Apply accumulated impulses
		//var impulse = vec2.rotate_vec(new vec2(lambda_n, lambda_t), n);
		var impulse = new vec2(lambda_n * n.x - lambda_t * n.y, lambda_t * n.x + lambda_n * n.y);

		body1.v.mad(impulse, -body1.m_inv);
		body1.w -= vec2.cross(con.r1, impulse) * body1.i_inv;

		body2.v.mad(impulse, body2.m_inv);
		body2.w += vec2.cross(con.r2, impulse) * body2.i_inv;
	}
}

ContactSolver.prototype.solveVelocityConstraints = function() {

	var body1 = this.shape1.body;
	var body2 = this.shape2.body;

	var m1_inv = body1.m_inv;
	var i1_inv = body1.i_inv;
	var m2_inv = body2.m_inv;
	var i2_inv = body2.i_inv;

	for (var i = 0; i < this.contactArr.length; i++) {

		var con = this.contactArr[i];
		var n = con.n;
		var t = vec2.perp(n);
		var r1 = con.r1;
		var r2 = con.r2;

		// Linear velocities at contact point
		// in 2D: cross(w, r) = perp(r) * w
		var v1 = vec2.mad(body1.v, vec2.perp(r1), body1.w);
		var v2 = vec2.mad(body2.v, vec2.perp(r2), body2.w);

		// Relative velocity at contact point
		var rv = vec2.sub(v2, v1);

		// Compute normal constraint impulse + adding bounce as a velocity bias
		// lambda_n = -EMn * J * V
		var lambda_n = -con.emn * (vec2.dot(n, rv) + con.bounce);

		// Accumulate and clamp
		var lambda_n_old = con.lambda_n_acc;
		con.lambda_n_acc = Math.max(lambda_n_old + lambda_n, 0);
		lambda_n = con.lambda_n_acc - lambda_n_old;		

		// Compute frictional constraint impulse
		// lambda_t = -EMt * J * V
		var lambda_t = -con.emt * vec2.dot(t, rv);

		// Max friction constraint impulse (Coulomb's Law)
		var lambda_t_max = con.lambda_n_acc * this.u;

		// Accumulate and clamp
		var lambda_t_old = con.lambda_t_acc;
		con.lambda_t_acc = Math.clamp(lambda_t_old + lambda_t, -lambda_t_max, lambda_t_max);
		lambda_t = con.lambda_t_acc - lambda_t_old;

		// Apply the final impulses
		//var impulse = vec2.rotate_vec(new vec2(lambda_n, lambda_t), n);
		var impulse = new vec2(lambda_n * n.x - lambda_t * n.y, lambda_t * n.x + lambda_n * n.y);

		body1.v.mad(impulse, -m1_inv);
		body1.w -= vec2.cross(r1, impulse) * i1_inv;

		body2.v.mad(impulse, m2_inv);
		body2.w += vec2.cross(r2, impulse) * i2_inv;

	}   
}

ContactSolver.prototype.solvePositionConstraints = function() {

	var body1 = this.shape1.body;
	var body2 = this.shape2.body;

	var m1_inv = body1.m_inv;
	var i1_inv = body1.i_inv;
	var m2_inv = body2.m_inv;
	var i2_inv = body2.i_inv;
	var sum_m_inv = m1_inv + m2_inv;

	var max_penetration = 0;

	for (var i = 0; i < this.contactArr.length; i++) {

		var con = this.contactArr[i];
		var n = con.n;

		// Transformed r1, r2
		var r1 = vec2.rotate(con.r1_local, body1.a);
		var r2 = vec2.rotate(con.r2_local, body2.a);

		// Contact points (corrected)
		var p1 = vec2.add(body1.p, r1);
		var p2 = vec2.add(body2.p, r2);

		// Corrected delta vector
		var dp = vec2.sub(p2, p1);

		// Position constraint
		var c = vec2.dot(dp, n) + con.d;
		var correction = Math.clamp(ContactSolver.BAUMGARTE * (c + ContactSolver.COLLISION_SLOP), -ContactSolver.MAX_LINEAR_CORRECTION, 0);

		if (correction == 0) {
			continue;
		}

		// We don't need max_penetration less than or equal slop
		max_penetration = Math.max(max_penetration, -c);

		// Compute lambda for position constraint
		// Solve (J * invM * JT) * lambda = -C / dt
		var sn1 = vec2.cross(r1, n);
		var sn2 = vec2.cross(r2, n);
		var em_inv = sum_m_inv + body1.i_inv * sn1 * sn1 + body2.i_inv * sn2 * sn2;
		var lambda_dt = em_inv == 0 ? 0 : -correction / em_inv;
		
		// Apply correction impulses
		var impulse_dt = vec2.scale(n, lambda_dt);

		body1.p.mad(impulse_dt, -m1_inv);
		body1.a -= sn1 * lambda_dt * i1_inv;
		
		body2.p.mad(impulse_dt, m2_inv);
		body2.a += sn2 * lambda_dt * i2_inv;
	}

	return max_penetration <= ContactSolver.COLLISION_SLOP * 3;
}
