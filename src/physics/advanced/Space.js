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

function Space() {
	this.bodyArr = [];
	this.bodyHash = {};

	this.jointArr = [];
	this.jointHash = {};
	
	this.numContacts = 0;
	this.contactSolverArr = [];

	this.postSolve = function(arb) {};

	this.gravity = new vec2(0, 0);
	this.damping = 0;

	this.log = [];
}

Space.TIME_TO_SLEEP = 0.5;
Space.SLEEP_LINEAR_TOLERANCE = 0.5;
Space.SLEEP_ANGULAR_TOLERANCE = deg2rad(2);

Space.prototype.clear = function() {
	Shape.id_counter = 0;
    Body.id_counter = 0;
    Joint.id_counter = 0;

	for (var i = 0; i < this.bodyArr.length; i++) {		
		if (this.bodyArr[i]) {
			this.removeBody(this.bodyArr[i]);
		}
	}

	this.bodyArr = [];
	this.bodyHash = {};

	this.jointArr = [];
	this.jointHash = {};

	this.contactSolverArr = [];

	this.stepCount = 0;
}

Space.prototype.toJSON = function(key) {
	var o_bodies = [];
	for (var i = 0; i < this.bodyArr.length; i++) {
		if (this.bodyArr[i]) {
			o_bodies.push(this.bodyArr[i].serialize());
		}
	}

	var o_joints = [];
	for (var i = 0; i < this.jointArr.length; i++) {
		if (this.jointArr[i]) {
			o_joints.push(this.jointHash[i].serialize());
		}
	}

	return {
		bodies: o_bodies,
		joints: o_joints
	};
}

Space.prototype.create = function(text) {
	var config = JSON.parse(text);

	this.clear();

	for (var i = 0; i < config.bodies.length; i++) {
		var config_body = config.bodies[i];
		var type = {"static": Body.Static, "kinetic": Body.KINETIC, "dynamic": Body.DYNAMIC}[config_body.type];
		var body = new Body(type, config_body.position.x, config_body.position.y, config_body.angle);

		for (var j = 0; j < config_body.shapes.length; j++) {
			var config_shape = config_body.shapes[j];
			var shape;

			switch (config_shape.type) {
				case "ShapeCircle":
					shape = new ShapeCircle(config_shape.center.x, config_shape.center.y, config_shape.radius);                
					break;
				case "ShapeSegment":
					shape = new ShapeSegment(config_shape.a, config_shape.b, config_shape.radius);
					break;
				case "ShapePoly":
					shape = new ShapePoly(config_shape.verts);
					break;
			}
			
			shape.e = config_shape.e;
			shape.u = config_shape.u;
			shape.density = config_shape.density;

			body.addShape(shape);
		}
		
		body.resetMassData();
		this.addBody(body);
	}

	for (var i = 0; i < config.joints.length; i++) {
		var config_joint = config.joints[i];
		var body1 = this.bodyArr[this.bodyHash[config_joint.body1]];
		var body2 = this.bodyArr[this.bodyHash[config_joint.body2]];
		var joint;

		switch (config_joint.type) {
		case "AngleJoint":
			joint = new AngleJoint(body1, body2);
			break;
		case "RevoluteJoint":
			joint = new RevoluteJoint(body1, body2, config_joint.anchor);
			joint.enableLimit(config_joint.limitEnabled);
			joint.setLimits(config_joint.limitLowerAngle, config_joint.limitUpperAngle);
			joint.enableMotor(config_joint.motorEnabled);
			joint.setMotorSpeed(config_joint.motorSpeed);
			joint.setMaxMotorTorque(config_joint.maxMotorTorque);
			break;
		case "WeldJoint":
			joint = new WeldJoint(body1, body2, config_joint.anchor);
			joint.setSpringFrequencyHz(config_joint.frequencyHz);
			joint.setSpringDampingRatio(config_joint.dampingRatio);
			break;
		case "WheelJoint":
			joint = new WheelJoint(body1, body2, config_joint.anchor1, config_joint.anchor2);
			joint.enableMotor(config_joint.motorEnabled);
			joint.setMotorSpeed(config_joint.motorSpeed);
			joint.setMaxMotorTorque(config_joint.maxMotorTorque);
			break;
		case "PrismaticJoint":
			joint = new PrismaticJoint(body1, body2, config_joint.anchor1, config_joint.anchor2);
			break;
		case "DistanceJoint":                
			joint = new DistanceJoint(body1, body2, config_joint.anchor1, config_joint.anchor2);
			joint.setSpringFrequencyHz(config_joint.frequencyHz);
			joint.setSpringDampingRatio(config_joint.dampingRatio);
			break;
		case "RopeJoint":                
			joint = new RopeJoint(body1, body2, config_joint.anchor1, config_joint.anchor2);
			break;
		}

		joint.collideConnected = config_joint.collideConnected;
		joint.maxForce = config_joint.maxForce;
		joint.breakable = config_joint.breakable;

		this.addJoint(joint);
	}
}

Space.prototype.addBody = function(body) {
	if (this.bodyHash[body.id] != undefined) {
		return;
	}

	var index = this.bodyArr.push(body) - 1;
	this.bodyHash[body.id] = index;
	
	body.awake(true);
	body.space = this;
	body.cacheData();
}

Space.prototype.removeBody = function(body) {
	if (this.bodyHash[body.id] == undefined) {
		return;
	}

	// Remove linked joint
	for (var i = 0; i < body.jointArr.length; i++) {
		if (body.jointArr[i]) {
			this.removeJoint(body.jointArr[i]);
		}
	}

	body.space = null;

	var index = this.bodyHash[body.id];
	delete this.bodyHash[body.id];
	delete this.bodyArr[index];
}

Space.prototype.addJoint = function(joint) {
	if (this.jointHash[joint.id] != undefined) {
		return;
	}

	joint.body1.awake(true);
	joint.body2.awake(true);

	var index = this.jointArr.push(joint) - 1;
	this.jointHash[joint.id] = index;

	var index = joint.body1.jointArr.push(joint) - 1;
	joint.body1.jointHash[joint.id] = index;

	var index = joint.body2.jointArr.push(joint) - 1;
	joint.body2.jointHash[joint.id] = index;
}

Space.prototype.removeJoint = function(joint) {
	if (this.jointHash[joint.id] == undefined) {
		return;
	}

	joint.body1.awake(true);
	joint.body2.awake(true);

	var index = joint.body1.jointHash[joint.id];
	delete joint.body1.jointHash[joint.id];
	delete joint.body1.jointArr[index];
	
	var index = joint.body2.jointHash[joint.id];
	delete joint.body2.jointHash[joint.id];
	delete joint.body2.jointArr[index];

	var index = this.jointHash[joint.id];
	delete this.jointHash[joint.id];
	delete this.jointArr[index];
}

Space.prototype.findShapeByPoint = function(p, refShape) {
	var firstShape;

	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		for (var j = 0; j < body.shapeArr.length; j++) {
			var shape = body.shapeArr[j];

			if (shape.pointQuery(p)) {
				if (!refShape) {
					return shape;
				}

				if (!firstShape) {
					firstShape = shape;
				}

				if (shape == refShape) {
					refShape = null;
				}
			}
		}
	}

	return firstShape;
}

Space.prototype.findBodyByPoint = function(p, refBody) {
	var firstBody;

	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		for (var j = 0; j < body.shapeArr.length; j++) {
			var shape = body.shapeArr[j];

			if (shape.pointQuery(p)) {
				if (!refBody) {
					return shape.body;
				}

				if (!firstBody) {
					firstBody = shape.body;
				}			

				if (shape.body == refBody) {
					refBody = null;
				}			

				break;
			}
		}
	}

	return firstBody;
}

// TODO: Replace this function to shape hashing
Space.prototype.shapeById = function(id) {
	var shape;
	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		for (var j = 0; j < body.shapeArr.length; j++) {
			if (body.shapeArr[j].id == id) {
				return body.shapeArr[j];
			}
		}
	}

	return null;
}

Space.prototype.jointById = function(id) {	
	var index = this.jointHash[id];
	if (index != undefined) {
		return this.jointArr[index];
	}

	return null;
}

Space.prototype.findVertexByPoint = function(p, minDist, refVertexId) {
	var firstVertexId = -1;

	refVertexId = refVertexId || -1;

	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		for (var j = 0; j < body.shapeArr.length; j++) {
			var shape = body.shapeArr[j];
			var index = shape.findVertexByPoint(p, minDist);
			if (index != -1) {
				var vertex = (shape.id << 16) | index;
				if (refVertexId == -1) {
					return vertex;
				}

				if (firstVertexId == -1) {
					firstVertexId = vertex;
				}

				if (vertex == refVertexId) {
					refVertexId = -1;
				}		
			}
		}
	}

	return firstVertexId;
}

Space.prototype.findEdgeByPoint = function(p, minDist, refEdgeId) {
	var firstEdgeId = -1;

	refEdgeId = refEdgeId || -1;

	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		for (var j = 0; j < body.shapeArr.length; j++) {
			var shape = body.shapeArr[j];
			if (shape.type != Shape.TYPE_POLY) {
				continue;
			}

			var index = shape.findEdgeByPoint(p, minDist);
			if (index != -1) {
				var edge = (shape.id << 16) | index;
				if (refEdgeId == -1) {
					return edge;
				}

				if (firstEdgeId == -1) {
					firstEdgeId = edge;
				}

				if (edge == refEdgeId) {
					refEdgeId = -1;
				}		
			}
		}
	}

	return firstEdgeId;	
}

Space.prototype.findJointByPoint = function(p, minDist, refJointId) {
	var firstJointId = -1;

	var dsq = minDist * minDist;

	refJointId = refJointId || -1;

	for (var i = 0; i < this.jointArr.length; i++) {
		var joint = this.jointArr[i];
		if (!joint) {
			continue;
		}

		var jointId = -1;

		if (vec2.distsq(p, joint.getWorldAnchor1()) < dsq) {
			jointId = (joint.id << 16 | 0);
		}
		else if (vec2.distsq(p, joint.getWorldAnchor2()) < dsq) {
			jointId = (joint.id << 16 | 1);
		}

		if (jointId != -1) {
			if (refJointId == -1) {
				return jointId;
			}

			if (firstJointId == -1) {
				firstJointId = jointId;
			}

			if (jointId == refJointId) {
				refJointId = -1;
			}
		}
	}

	return firstJointId;
}

Space.prototype.findContactSolver = function(shape1, shape2) {

	for (var i = 0; i < this.contactSolverArr.length; i++) {
		var contactSolver = this.contactSolverArr[i];
		if (shape1 == contactSolver.shape1 && shape2 == contactSolver.shape2) {
			return contactSolver;
		}
	}

	return null;
}

Space.dump = function (phase, body) {

	var s = "\n\nPhase: " + phase + "\n";
	s += "Position: " + body.p.toString() + "\n";
	s += "Velocity: " + body.v.toString() + "\n";
	s += "Angle: " + body.a + "\n";
	s += "Force: " + body.f.toString() + "\n";
	s += "Torque: " + body.t + "\n";
    s += "Bounds: " + body.bounds.toString() + "\n";
	s += "Shape ***\n";
	s += "Vert 0: " + body.shapeArr[0].verts[0].toString() + "\n";
	s += "Vert 1: " + body.shapeArr[0].verts[1].toString() + "\n";
	s += "Vert 2: " + body.shapeArr[0].verts[2].toString() + "\n";
	s += "Vert 3: " + body.shapeArr[0].verts[3].toString() + "\n";
	s += "TVert 0: " + body.shapeArr[0].tverts[0].toString() + "\n";
	s += "TVert 1: " + body.shapeArr[0].tverts[1].toString() + "\n";
	s += "TVert 2: " + body.shapeArr[0].tverts[2].toString() + "\n";
	s += "TVert 3: " + body.shapeArr[0].tverts[3].toString() + "\n";
	s += "Plane 0: " + body.shapeArr[0].planes[0].n.toString() + "\n";
	s += "Plane 1: " + body.shapeArr[0].planes[1].n.toString() + "\n";
	s += "Plane 2: " + body.shapeArr[0].planes[2].n.toString() + "\n";
	s += "Plane 3: " + body.shapeArr[0].planes[3].n.toString() + "\n";
	s += "TPlane 0: " + body.shapeArr[0].tplanes[0].n.toString() + "\n";
	s += "TPlane 1: " + body.shapeArr[0].tplanes[1].n.toString() + "\n";
	s += "TPlane 2: " + body.shapeArr[0].tplanes[2].n.toString() + "\n";
	s += "TPlane 3: " + body.shapeArr[0].tplanes[3].n.toString() + "\n";

	this.log.push(s);

}

Space.prototype.genTemporalContactSolvers = function() {

	var t0 = Date.now();
	var newContactSolverArr = [];

	this.numContacts = 0;

	for (var body1_index = 0; body1_index < this.bodyArr.length; body1_index++) {
		var body1 = this.bodyArr[body1_index];
		if (!body1) {
			continue;
		}
		
		body1.stepCount = this.stepCount;

		for (var body2_index = 0; body2_index < this.bodyArr.length; body2_index++) {
			var body2 = this.bodyArr[body2_index];
			if (!body2) {
				continue;
			}

			if (body1.stepCount == body2.stepCount) {
				continue;
			}

			var active1 = body1.isAwake() && !body1.isStatic();
			var active2 = body2.isAwake() && !body2.isStatic();

			if (!active1 && !active2) {
				continue;
			}
						
			if (!body1.isCollidable(body2)) {
				continue;
			}
		
			if (!body1.bounds.intersectsBounds(body2.bounds)) {
				continue;
			}

			for (var i = 0; i < body1.shapeArr.length; i++) {
				for (var j = 0; j < body2.shapeArr.length; j++) {
					var shape1 = body1.shapeArr[i];
					var shape2 = body2.shapeArr[j];
								
					var contactArr = [];
					if (!collision.collide(shape1, shape2, contactArr)) {
						continue;
					}

					if (shape1.type > shape2.type) {
						var temp = shape1;
						shape1 = shape2;
						shape2 = temp;
					}

					this.numContacts += contactArr.length;

					var contactSolver = this.findContactSolver(shape1, shape2);

					if (contactSolver) {
						contactSolver.update(contactArr);
						newContactSolverArr.push(contactSolver);
					}
					else {
						body1.awake(true);
						body2.awake(true);

						var newContactSolver = new ContactSolver(shape1, shape2);
						newContactSolver.contactArr = contactArr;
						newContactSolver.e = Math.max(shape1.e, shape2.e);
						newContactSolver.u = Math.sqrt(shape1.u * shape2.u);
						newContactSolverArr.push(newContactSolver);
					}
				}
			}
		}
	}

	stats.timeCollision = Date.now() - t0;

	return newContactSolverArr;
}

Space.prototype.initSolver = function(dt, dt_inv, warmStarting) {

	var t0 = Date.now();

	// Initialize contact solvers
	for (var i = 0; i < this.contactSolverArr.length; i++) {
		this.contactSolverArr[i].initSolver(dt_inv);
	}

	// Initialize joint solver
	for (var i = 0; i < this.jointArr.length; i++) {
		if (this.jointArr[i]) {
			this.jointArr[i].initSolver(dt, warmStarting);
		}
	}

	// Warm starting (apply cached impulse)
	if (warmStarting) {
		for (var i = 0; i < this.contactSolverArr.length; i++) {
			this.contactSolverArr[i].warmStart();
		}
	}

	stats.timeInitSolver = Date.now() - t0;
}

Space.prototype.velocitySolver = function(iteration) {

	var t0 = Date.now();
	
	for (var i = 0; i < iteration; i++) {
		for (var j = 0; j < this.jointArr.length; j++) {
			if (this.jointArr[j]) {
				this.jointArr[j].solveVelocityConstraints();
			}
		}

		for (var j = 0; j < this.contactSolverArr.length; j++) {
			this.contactSolverArr[j].solveVelocityConstraints();
		}
	}

	stats.timeVelocitySolver = Date.now() - t0;
}

Space.prototype.positionSolver = function(iteration) {
	var t0 = Date.now();    

	var positionSolved = false;

	stats.positionIterations = 0;
	
	for (var i = 0; i < iteration; i++) {
		var contactsOk = true;
		var jointsOk = true;

		for (var j = 0; j < this.contactSolverArr.length; j++) {
			var contactOk = this.contactSolverArr[j].solvePositionConstraints();
			contactsOk = contactOk && contactsOk;
		}

		for (var j = 0; j < this.jointArr.length; j++) {
			if (this.jointArr[j]) {
				var jointOk = this.jointArr[j].solvePositionConstraints();
				jointsOk = jointOk && jointsOk;
			}
		}
		
		if (contactsOk && jointsOk) {
			// exit early if the position errors are small
			positionSolved = true;
			break;
		}

		stats.positionIterations++;
	}

	stats.timePositionSolver = Date.now() - t0;

	return positionSolved;
}

Space.prototype.step = function(dt, vel_iteration, pos_iteration, warmStarting, allowSleep) {

	var dt_inv = 1 / dt; 

	this.stepCount++;
	
	// Generate contact & contactSolver
	this.contactSolverArr = this.genTemporalContactSolvers();

	// Initialize contacts & joints solver
	this.initSolver(dt, dt_inv, warmStarting);    

	// Intergrate velocity
	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		if (body.isDynamic() && body.isAwake()) {
			body.updateVelocity(this.gravity, dt, this.damping);
		}
	}

	for (var i = 0; i < this.jointArr.length; i++) {
		var joint = this.jointArr[i];
		if (!joint) {
			continue;
		}

		var body1 = joint.body1;
		var body2 = joint.body2;

		var awake1 = body1.isAwake() && !body1.isStatic();
		var awake2 = body2.isAwake() && !body2.isStatic();

		if (awake1 ^ awake2) {
			if (!awake1)
				body1.awake(true);
			if (!awake2)
				body2.awake(true);
		}
	}

	// Iterative velocity constraints solver
	this.velocitySolver(vel_iteration);

	// Intergrate position
	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue
		}

		if (body.isDynamic() && body.isAwake()) {
			body.updatePosition(dt);
		}
	}

	// Process breakable joint
	for (var i = 0; i < this.jointArr.length; i++) {
		var joint = this.jointArr[i];
		if (!joint) {
			continue;
		}

		if (joint.breakable) {
			if (joint.getReactionForce(dt_inv).lengthsq() >= joint.maxForce * joint.maxForce)
				this.removeJoint(joint);
		}
	}

	// Iterative position constraints solver
	var positionSolved = this.positionSolver(pos_iteration);

	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		body.syncTransform();
	}

	// Post solve collision callback
	for (var i = 0; i < this.contactSolverArr.length; i++) {
		var arb = this.contactSolverArr[i];
		//this.postSolve(arb);
	}

	for (var i = 0; i < this.bodyArr.length; i++) {
		var body = this.bodyArr[i];
		if (!body) {
			continue;
		}

		if (body.isDynamic() && body.isAwake()) {
			body.cacheData();
		}
	}

	// Process sleeping
	if (allowSleep) {
		var minSleepTime = 999999;

		var linTolSqr = Space.SLEEP_LINEAR_TOLERANCE * Space.SLEEP_LINEAR_TOLERANCE;
		var angTolSqr = Space.SLEEP_ANGULAR_TOLERANCE * Space.SLEEP_ANGULAR_TOLERANCE;

		for (var i = 0; i < this.bodyArr.length; i++) {
		   	var body = this.bodyArr[i];
		   	if (!body) {
		   		continue;
		   	}
		   
			if (!body.isDynamic()) {
				continue;
			}

			if (body.w * body.w > angTolSqr || body.v.dot(body.v) > linTolSqr) {
				body.sleepTime = 0;
				minSleepTime = 0;
			}
			else {
				body.sleepTime += dt;
				minSleepTime = Math.min(minSleepTime, body.sleepTime);
			}
		}

		if (positionSolved && minSleepTime >= Space.TIME_TO_SLEEP) {
			for (var i = 0; i < this.bodyArr.length; i++) {
				var body = this.bodyArr[i];
				if (!body) {
					continue;
				}

				body.awake(false);
			}
		}
	}	
	
}

