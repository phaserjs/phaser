/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Body.ts" />
/// <reference path="Shape.ts" />
/// <reference path="ContactSolver.ts" />
/// <reference path="Contact.ts" />
/// <reference path="Collision.ts" />
/// <reference path="joints/IJoint.ts" />

/**
* Phaser - Advanced Physics - Space
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced {

    export class Space {

        constructor() {

            this.bodyArr = [];
            this.bodyHash = {};

            this.jointArr = [];
            this.jointHash = {};

            this.numContacts = 0;
            this.contactSolvers = [];

            //this.postSolve(arb) { };

            this.gravity = new Phaser.Vec2;
            this.damping = 0;

        }

        public static TIME_TO_SLEEP = 0.5;
        public static SLEEP_LINEAR_TOLERANCE = 0.5;
        public static SLEEP_ANGULAR_TOLERANCE = 2 * Phaser.GameMath.DEG_TO_RAD;

        public bodyArr: Body[];
        public bodyHash;
        public jointArr: IJoint[];
        public jointHash;
        public numContacts: number;
        public contactSolvers: ContactSolver[];
        public postSolve;
        public gravity: Phaser.Vec2;
        public damping: number;
        public stepCount: number = 0;

        public clear() {

            Manager.shapeCounter = 0;
            Manager.bodyCounter = 0;
            Manager.jointCounter = 0;

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                if (this.bodyArr[i])
                {
                    this.removeBody(this.bodyArr[i]);
                }
            }

            this.bodyArr = [];
            this.bodyHash = {};

            this.jointArr = [];
            this.jointHash = {};

            this.contactSolvers = [];

            this.stepCount = 0;

        }

        public addBody(body: Body) {

            if (this.bodyHash[body.id] != undefined)
            {
                return;
            }

            var index = this.bodyArr.push(body) - 1;
            this.bodyHash[body.id] = index;

            body.awake(true);
            body.space = this;
            body.cacheData();

        }

        public removeBody(body: Body) {

            if (this.bodyHash[body.id] == undefined)
            {
                return;
            }

            // Remove linked joint
            for (var i = 0; i < body.joints.length; i++)
            {
                if (body.joints[i])
                {
                    this.removeJoint(body.joints[i]);
                }
            }

            body.space = null;

            var index = this.bodyHash[body.id];
            delete this.bodyHash[body.id];
            delete this.bodyArr[index];

        }

        public addJoint(joint: IJoint) {

            if (this.jointHash[joint.id] != undefined)
            {
                return;
            }

            joint.body1.awake(true);
            joint.body2.awake(true);

            var index = this.jointArr.push(joint) - 1;
            this.jointHash[joint.id] = index;

            var index = joint.body1.joints.push(joint) - 1;
            joint.body1.jointHash[joint.id] = index;

            var index = joint.body2.joints.push(joint) - 1;
            joint.body2.jointHash[joint.id] = index;

        }

        public removeJoint(joint: IJoint) {

            if (this.jointHash[joint.id] == undefined)
            {
                return;
            }

            joint.body1.awake(true);
            joint.body2.awake(true);

            var index = joint.body1.jointHash[joint.id];
            delete joint.body1.jointHash[joint.id];
            delete joint.body1.joints[index];

            var index = joint.body2.jointHash[joint.id];
            delete joint.body2.jointHash[joint.id];
            delete joint.body2.joints[index];

            var index = this.jointHash[joint.id];
            delete this.jointHash[joint.id];
            delete this.jointArr[index];

        }

        public findShapeByPoint(p, refShape) {

            var firstShape;

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];

                if (!body)
                {
                    continue;
                }

                for (var j = 0; j < body.shapes.length; j++)
                {
                    var shape = body.shapes[j];

                    if (shape.pointQuery(p))
                    {
                        if (!refShape)
                        {
                            return shape;
                        }

                        if (!firstShape)
                        {
                            firstShape = shape;
                        }

                        if (shape == refShape)
                        {
                            refShape = null;
                        }
                    }
                }
            }

            return firstShape;
        }

        public findBodyByPoint(p, refBody: Body) {

            var firstBody;

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];

                if (!body)
                {
                    continue;
                }

                for (var j = 0; j < body.shapes.length; j++)
                {
                    var shape = body.shapes[j];

                    if (shape.pointQuery(p))
                    {
                        if (!refBody)
                        {
                            return shape.body;
                        }

                        if (!firstBody)
                        {
                            firstBody = shape.body;
                        }

                        if (shape.body == refBody)
                        {
                            refBody = null;
                        }

                        break;
                    }
                }
            }

            return firstBody;

        }

        // TODO: Replace this function to shape hashing
        public shapeById(id) {

            var shape;

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];
                if (!body)
                {
                    continue;
                }

                for (var j = 0; j < body.shapes.length; j++)
                {
                    if (body.shapes[j].id == id)
                    {
                        return body.shapes[j];
                    }
                }
            }

            return null;
        }

        public jointById(id) {

            var index = this.jointHash[id];

            if (index != undefined)
            {
                return this.jointArr[index];
            }

            return null;
        }

        public findVertexByPoint(p, minDist, refVertexId) {

            var firstVertexId = -1;

            refVertexId = refVertexId || -1;

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];

                if (!body)
                {
                    continue;
                }

                for (var j = 0; j < body.shapes.length; j++)
                {
                    var shape = body.shapes[j];
                    var index = shape.findVertexByPoint(p, minDist);

                    if (index != -1)
                    {
                        var vertex = (shape.id << 16) | index;

                        if (refVertexId == -1)
                        {
                            return vertex;
                        }

                        if (firstVertexId == -1)
                        {
                            firstVertexId = vertex;
                        }

                        if (vertex == refVertexId)
                        {
                            refVertexId = -1;
                        }
                    }
                }
            }

            return firstVertexId;

        }

        public findEdgeByPoint(p, minDist, refEdgeId) {

            var firstEdgeId = -1;

            refEdgeId = refEdgeId || -1;

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];

                if (!body)
                {
                    continue;
                }

                for (var j = 0; j < body.shapes.length; j++)
                {
                    var shape = body.shapes[j];

                    if (shape.type != Manager.SHAPE_TYPE_POLY)
                    {
                        continue;
                    }

                    var index = shape.findEdgeByPoint(p, minDist);

                    if (index != -1)
                    {
                        var edge = (shape.id << 16) | index;

                        if (refEdgeId == -1)
                        {
                            return edge;
                        }

                        if (firstEdgeId == -1)
                        {
                            firstEdgeId = edge;
                        }

                        if (edge == refEdgeId)
                        {
                            refEdgeId = -1;
                        }
                    }
                }
            }

            return firstEdgeId;
        }

        public findJointByPoint(p, minDist, refJointId) {

            var firstJointId = -1;

            var dsq = minDist * minDist;

            refJointId = refJointId || -1;

            for (var i = 0; i < this.jointArr.length; i++)
            {
                var joint = this.jointArr[i];

                if (!joint)
                {
                    continue;
                }

                var jointId = -1;

                if (Phaser.Vec2Utils.distanceSq(p, joint.getWorldAnchor1()) < dsq)
                {
                    jointId = (joint.id << 16 | 0);
                }
                else if (Phaser.Vec2Utils.distanceSq(p, joint.getWorldAnchor2()) < dsq)
                {
                    jointId = (joint.id << 16 | 1);
                }

                if (jointId != -1)
                {
                    if (refJointId == -1)
                    {
                        return jointId;
                    }

                    if (firstJointId == -1)
                    {
                        firstJointId = jointId;
                    }

                    if (jointId == refJointId)
                    {
                        refJointId = -1;
                    }
                }
            }

            return firstJointId;
        }

        public findContactSolver(shape1, shape2) {

            for (var i = 0; i < this.contactSolvers.length; i++)
            {
                var contactSolver = this.contactSolvers[i];

                if (shape1 == contactSolver.shape1 && shape2 == contactSolver.shape2)
                {
                    return contactSolver;
                }
            }

            return null;
        }

        public genTemporalContactSolvers() {

            //var t0 = Date.now();

            var newContactSolverArr = [];

            this.numContacts = 0;

            for (var body1_index = 0; body1_index < this.bodyArr.length; body1_index++)
            {
                var body1 = this.bodyArr[body1_index];

                if (!body1)
                {
                    continue;
                }

                body1.stepCount = this.stepCount;

                for (var body2_index = 0; body2_index < this.bodyArr.length; body2_index++)
                {
                    var body2 = this.bodyArr[body2_index];
                    if (!body2)
                    {
                        continue;
                    }

                    if (body1.stepCount == body2.stepCount)
                    {
                        continue;
                    }

                    var active1 = body1.isAwake && !body1.isStatic;
                    var active2 = body2.isAwake && !body2.isStatic;

                    if (!active1 && !active2)
                    {
                        continue;
                    }

                    if (!body1.isCollidable(body2))
                    {
                        continue;
                    }

                    if (!body1.bounds.intersectsBounds(body2.bounds))
                    {
                        continue;
                    }

                    for (var i = 0; i < body1.shapes.length; i++)
                    {
                        for (var j = 0; j < body2.shapes.length; j++)
                        {
                            var shape1 = body1.shapes[i];
                            var shape2 = body2.shapes[j];

                            var contactArr = [];

                            if (!Manager.collision.collide(shape1, shape2, contactArr))
                            {
                                continue;
                            }

                            if (shape1.type > shape2.type)
                            {
                                var temp = shape1;
                                shape1 = shape2;
                                shape2 = temp;
                            }

                            this.numContacts += contactArr.length;

                            var contactSolver = this.findContactSolver(shape1, shape2);

                            if (contactSolver)
                            {
                                contactSolver.update(contactArr);
                                newContactSolverArr.push(contactSolver);
                            }
                            else
                            {
                                body1.awake(true);
                                body2.awake(true);

                                var newContactSolver = new ContactSolver(shape1, shape2);
                                newContactSolver.contacts = contactArr;
                                newContactSolver.elasticity = Math.max(shape1.e, shape2.e);
                                newContactSolver.friction = Math.sqrt(shape1.u * shape2.u);
                                newContactSolverArr.push(newContactSolver);
                            }
                        }
                    }
                }
            }

            //stats.timeCollision = Date.now() - t0;

            return newContactSolverArr;
        }

        public initSolver(dt, dt_inv, warmStarting) {

            //var t0 = Date.now();

            // Initialize contact solvers
            for (var i = 0; i < this.contactSolvers.length; i++)
            {
                this.contactSolvers[i].initSolver(dt_inv);
            }

            // Initialize joint solver
            for (var i = 0; i < this.jointArr.length; i++)
            {
                if (this.jointArr[i])
                {
                    this.jointArr[i].initSolver(dt, warmStarting);
                }
            }

            // Warm starting (apply cached impulse)
            if (warmStarting)
            {
                for (var i = 0; i < this.contactSolvers.length; i++)
                {
                    this.contactSolvers[i].warmStart();
                }
            }

            //stats.timeInitSolver = Date.now() - t0;
        }

        public velocitySolver(iteration) {

            //var t0 = Date.now();

            for (var i = 0; i < iteration; i++)
            {
                for (var j = 0; j < this.jointArr.length; j++)
                {
                    if (this.jointArr[j])
                    {
                        this.jointArr[j].solveVelocityConstraints();
                    }
                }

                for (var j = 0; j < this.contactSolvers.length; j++)
                {
                    this.contactSolvers[j].solveVelocityConstraints();
                }
            }

            //stats.timeVelocitySolver = Date.now() - t0;
        }

        public positionSolver(iteration) {

            //var t0 = Date.now();

            var positionSolved = false;

            //stats.positionIterations = 0;

            for (var i = 0; i < iteration; i++)
            {
                var contactsOk = true;
                var jointsOk = true;

                for (var j = 0; j < this.contactSolvers.length; j++)
                {
                    var contactOk = this.contactSolvers[j].solvePositionConstraints();
                    contactsOk = contactOk && contactsOk;
                }

                for (var j = 0; j < this.jointArr.length; j++)
                {
                    if (this.jointArr[j])
                    {
                        var jointOk = this.jointArr[j].solvePositionConstraints();
                        jointsOk = jointOk && jointsOk;
                    }
                }

                if (contactsOk && jointsOk)
                {
                    // exit early if the position errors are small
                    positionSolved = true;
                    break;
                }

                //stats.positionIterations++;
            }

            //stats.timePositionSolver = Date.now() - t0;

            return positionSolved;

        }

        public step(dt, vel_iteration, pos_iteration, warmStarting, allowSleep) {

            var dt_inv = 1 / dt;

            this.stepCount++;

            // Generate contact & contactSolver
            this.contactSolvers = this.genTemporalContactSolvers();

            // Initialize contacts & joints solver
            this.initSolver(dt, dt_inv, warmStarting);

            // Intergrate velocity
            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];
                if (!body)
                {
                    continue;
                }

                if (body.isDynamic && body.isAwake)
                {
                    body.updateVelocity(this.gravity, dt, this.damping);
                }
            }

            for (var i = 0; i < this.jointArr.length; i++)
            {
                var joint = this.jointArr[i];

                if (!joint)
                {
                    continue;
                }

                var body1 = joint.body1;
                var body2 = joint.body2;

                var awake1 = body1.isAwake && !body1.isStatic;
                var awake2 = body2.isAwake && !body2.isStatic;

                if (awake1 ^ awake2)
                {
                    if (!awake1)
                    {
                        body1.awake(true);
                    }
                    
                    if (!awake2)
                    {
                        body2.awake(true);
                    }
                }
            }

            // Iterative velocity constraints solver
            this.velocitySolver(vel_iteration);

            // Intergrate position
            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];

                if (!body)
                {
                    continue
                }

                if (body.isDynamic && body.isAwake)
                {
                    body.updatePosition(dt);
                }
            }

            // Process breakable joint
            for (var i = 0; i < this.jointArr.length; i++)
            {
                var joint = this.jointArr[i];

                if (!joint)
                {
                    continue;
                }

                if (joint.breakable)
                {
                    if (joint.getReactionForce(dt_inv).lengthsq() >= joint.maxForce * joint.maxForce)
                    {
                        this.removeJoint(joint);
                    }
                }
            }

            // Iterative position constraints solver
            var positionSolved = this.positionSolver(pos_iteration);

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];

                if (!body)
                {
                    continue;
                }

                body.syncTransform();
            }

            // Post solve collision callback
            for (var i = 0; i < this.contactSolvers.length; i++)
            {
                var arb = this.contactSolvers[i];
                this.postSolve(arb);
            }

            for (var i = 0; i < this.bodyArr.length; i++)
            {
                var body = this.bodyArr[i];

                if (!body)
                {
                    continue;
                }

                if (body.isDynamic && body.isAwake)
                {
                    body.cacheData();
                }
            }

            // Process sleeping
            if (allowSleep)
            {
                var minSleepTime = 999999;

                var linTolSqr = Space.SLEEP_LINEAR_TOLERANCE * Space.SLEEP_LINEAR_TOLERANCE;
                var angTolSqr = Space.SLEEP_ANGULAR_TOLERANCE * Space.SLEEP_ANGULAR_TOLERANCE;

                for (var i = 0; i < this.bodyArr.length; i++)
                {
                    var body = this.bodyArr[i];

                    if (!body)
                    {
                        continue;
                    }

                    if (!body.isDynamic)
                    {
                        continue;
                    }

                    if (body.angularVelocity * body.angularVelocity > angTolSqr || body.velocity.dot(body.velocity) > linTolSqr)
                    {
                        body.sleepTime = 0;
                        minSleepTime = 0;
                    }
                    else
                    {
                        body.sleepTime += dt;
                        minSleepTime = Math.min(minSleepTime, body.sleepTime);
                    }
                }

                if (positionSolved && minSleepTime >= Space.TIME_TO_SLEEP)
                {
                    for (var i = 0; i < this.bodyArr.length; i++)
                    {
                        var body = this.bodyArr[i];

                        if (!body)
                        {
                            continue;
                        }

                        body.awake(false);
                    }
                }
            }
        }

    }

}