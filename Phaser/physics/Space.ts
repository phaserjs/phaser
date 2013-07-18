/// <reference path="../math/Vec2.ts" />
/// <reference path="../math/Vec2Utils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Body.ts" />
/// <reference path="shapes/Shape.ts" />
/// <reference path="ContactSolver.ts" />
/// <reference path="Contact.ts" />
/// <reference path="Collision.ts" />
/// <reference path="joints/IJoint.ts" />

/**
* Phaser - Advanced Physics - Space
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics {

    export class Space {

        constructor(manager: Phaser.Physics.Manager) {

            this._manager = manager;

            this.bodies = [];
            this.bodyHash = {};

            this.joints = [];
            this.jointHash = {};

            this.numContacts = 0;
            this.contactSolvers = [];

            this.gravity = this._manager.gravity;
            this.damping = 0;

            this._linTolSqr = Space.SLEEP_LINEAR_TOLERANCE * Space.SLEEP_LINEAR_TOLERANCE;
            this._angTolSqr = Space.SLEEP_ANGULAR_TOLERANCE * Space.SLEEP_ANGULAR_TOLERANCE;

        }

        private _manager: Phaser.Physics.Manager;

        //  Delta Timer
        private _delta: number;
        private _deltaInv: number;

        //  Body array length
        private _bl: number;

        //  Joints array length
        private _jl: number;

        //  Contact Solvers array length
        private _cl: number;

        private _linTolSqr: number;
        private _angTolSqr: number;

        //  Minimum sleep time (used in the sleep process solver)
        private _minSleepTime: number;

        private _positionSolved: bool;

        private _shape1: IShape;
        private _shape2: IShape;
        private _contactsOk: bool;
        private _jointsOk: bool;

        private bodyHash;
        private jointHash;

        public static TIME_TO_SLEEP = 0.5;
        public static SLEEP_LINEAR_TOLERANCE = 0.5;
        public static SLEEP_ANGULAR_TOLERANCE = 2 * 0.017453292519943294444444444444444;

        public bodies: Body[];
        public joints: IJoint[];
        public numContacts: number;
        public contactSolvers: ContactSolver[];
        public postSolve = null;
        public gravity: Phaser.Vec2;
        public damping: number;
        public stepCount: number = 0;

        public clear() {

            Manager.shapeCounter = 0;
            Manager.bodyCounter = 0;
            Manager.jointCounter = 0;

            for (var i = 0; i < this.bodies.length; i++)
            {
                if (this.bodies[i])
                {
                    this.removeBody(this.bodies[i]);
                }
            }

            this.bodies = [];
            this.bodyHash = {};

            this.joints = [];
            this.jointHash = {};

            this.contactSolvers = [];

            this.stepCount = 0;

        }

        public addBody(body: Body) {

            if (this.bodyHash[body.id] != undefined)
            {
                return;
            }

            var index = this.bodies.push(body) - 1;
            this.bodyHash[body.id] = index;

            body.awake(true);
            body.space = this;
            body.cacheData('addBody');

        }

        public removeBody(body: Body) {

            if (this.bodyHash[body.id] == undefined)
            {
                return;
            }

            // Remove linked joints
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
            delete this.bodies[index];

        }

        public addJoint(joint: IJoint) {

            if (this.jointHash[joint.id] != undefined)
            {
                return;
            }

            joint.body1.awake(true);
            joint.body2.awake(true);

            var index = this.joints.push(joint) - 1;
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
            delete this.joints[index];

        }

        public findShapeByPoint(p, refShape) {

            var firstShape;

            for (var i = 0; i < this.bodies.length; i++)
            {
                var body = this.bodies[i];

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

            for (var i = 0; i < this.bodies.length; i++)
            {
                var body = this.bodies[i];

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

        public shapeById(id) {

            var shape;

            for (var i = 0; i < this.bodies.length; i++)
            {
                var body: Body = this.bodies[i];

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
                return this.joints[index];
            }

            return null;
        }

        public findVertexByPoint(p, minDist, refVertexId) {

            var firstVertexId = -1;

            refVertexId = refVertexId || -1;

            for (var i = 0; i < this.bodies.length; i++)
            {
                var body = this.bodies[i];

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

            for (var i = 0; i < this.bodies.length; i++)
            {
                var body = this.bodies[i];

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

            for (var i = 0; i < this.joints.length; i++)
            {
                var joint = this.joints[i];

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

        private findContactSolver(shape1:IShape, shape2:IShape):ContactSolver {

            Manager.write('findContactSolver. Length: ' + this._cl);

            for (var i = 0; i < this._cl; i++)
            {
                var contactSolver: ContactSolver = this.contactSolvers[i];

                if (shape1 == contactSolver.shape1 && shape2 == contactSolver.shape2)
                {
                    return contactSolver;
                }
            }

            return null;

        }

        private genTemporalContactSolvers() {

            Manager.write('genTemporalContactSolvers');

            this._cl = 0;
            this.contactSolvers.length = 0;
            this.numContacts = 0;

            for (var body1Index = 0; body1Index < this._bl; body1Index++)
            {
                if (!this.bodies[body1Index])
                {
                    continue;
                }

                this.bodies[body1Index].stepCount = this.stepCount;

                for (var body2Index = 0; body2Index < this._bl; body2Index++)
                {
                    if (this.bodies[body1Index].inContact(this.bodies[body2Index]) == false)
                    {
                        continue;
                    }

                    Manager.write('body1 and body2 intersect');

                    for (var i = 0; i < this.bodies[body1Index].shapesLength; i++)
                    {
                        for (var j = 0; j < this.bodies[body2Index].shapesLength; j++)
                        {
                            this._shape1 = this.bodies[body1Index].shapes[i];
                            this._shape2 = this.bodies[body2Index].shapes[j];

                            var contactArr = [];

                            if (!Manager.collision.collide(this._shape1, this._shape2, contactArr))
                            {
                                continue;
                            }

                            if (this._shape1.type > this._shape2.type)
                            {
                                var temp = this._shape1;
                                this._shape1 = this._shape2;
                                this._shape2 = temp;
                            }

                            this.numContacts += contactArr.length;

                            //  Result stored in this._contactSolver (see what we can do about generating some re-usable solvers)
                            var contactSolver: ContactSolver = this.findContactSolver(this._shape1, this._shape2);

                            Manager.write('findContactSolver result: ' + contactSolver);

                            if (contactSolver)
                            {
                                contactSolver.update(contactArr);
                                this.contactSolvers.push(contactSolver);
                            }
                            else
                            {
                                Manager.write('awake both bodies');

                                this.bodies[body1Index].awake(true);
                                this.bodies[body2Index].awake(true);

                                var newContactSolver = new ContactSolver(this._shape1, this._shape2);
                                newContactSolver.contacts = contactArr;
                                newContactSolver.elasticity = Math.max(this._shape1.elasticity, this._shape2.elasticity);
                                newContactSolver.friction = Math.sqrt(this._shape1.friction * this._shape2.friction);

                                this.contactSolvers.push(newContactSolver);
                                Manager.write('new contact solver');
                            }
                        }
                    }
                }
            }

            this._cl = this.contactSolvers.length;

        }

        private initSolver(warmStarting) {

            Manager.write('initSolver');
            Manager.write('contactSolvers.length: ' + this._cl);

            // Initialize contact solvers
            for (var c = 0; c < this._cl; c++)
            {
                this.contactSolvers[c].initSolver(this._deltaInv);

                // Warm starting (apply cached impulse)
                if (warmStarting)
                {
                    this.contactSolvers[c].warmStart();
                }

            }

            // Initialize joint solver
            for (var j = 0; j < this.joints.length; j++)
            {
                if (this.joints[j])
                {
                    this.joints[j].initSolver(this._delta, warmStarting);
                }
            }

            // Warm starting (apply cached impulse)
            /*
            if (warmStarting)
            {
                for (var c = 0; c < this._cl; c++)
                {
                    this.contactSolvers[c].warmStart();
                }
            }
            */

        }

        private velocitySolver(iterations:number) {

            Manager.write('velocitySolver, iterations: ' + iterations + ' csa len: ' + this._cl);

            for (var i = 0; i < iterations; i++)
            {
                for (var j = 0; j < this._jl; j++)
                {
                    if (this.joints[j])
                    {
                        this.joints[j].solveVelocityConstraints();
                    }
                }

                for (var c = 0; c < this._cl; c++)
                {
                    this.contactSolvers[c].solveVelocityConstraints();
                }
            }

        }

        private positionSolver(iterations:number):bool {

            this._positionSolved = false;

            for (var i = 0; i < iterations; i++)
            {
                this._contactsOk = true;
                this._jointsOk = true;

                for (var c = 0; c < this._cl; c++)
                {
                    this._contactsOk = this.contactSolvers[c].solvePositionConstraints() && this._contactsOk;
                }

                for (var j = 0; j < this._jl; j++)
                {
                    if (this.joints[j])
                    {
                        this._jointsOk = this.joints[j].solvePositionConstraints() && this._jointsOk;
                    }
                }

                if (this._contactsOk && this._jointsOk)
                {
                    // exit early if the position errors are small
                    this._positionSolved = true;
                    break;
                }
            }

            return this._positionSolved;

        }

        //  Step through the physics simulation
        public step(dt: number, velocityIterations: number, positionIterations: number, warmStarting: bool, allowSleep: bool) {

            Manager.clear();
            Manager.write('Space step ' + this.stepCount);

            this._delta = dt;
            this._deltaInv = 1 / dt;
            this._bl = this.bodies.length;
            this._jl = this.joints.length;

            this.stepCount++;

            //  1) Generate Contact Solvers (into the this.contactSolvers array)
            this.genTemporalContactSolvers();

            Manager.dump("Contact Solvers", this.bodies[1]);

            //  2) Initialize the Contact Solvers
            this.initSolver(warmStarting);

            Manager.dump("Init Solver", this.bodies[1]);

            //  3) Intergrate velocity
            for (var i = 0; i < this._bl; i++)
            {
                if (this.bodies[i] && this.bodies[i].isDynamic && this.bodies[i].isAwake)
                {
                    this.bodies[i].updateVelocity(this.gravity, this._delta, this.damping);
                }
            }

            Manager.dump("Update Velocity", this.bodies[1]);

            //  4) Awaken bodies via joints
            for (var j = 0; i < this._jl; j++)
            {
                if (!this.joints[j])
                {
                    continue;
                }

                //  combine
                var awake1 = this.joints[j].body1.isAwake && !this.joints[j].body1.isStatic;
                var awake2 = this.joints[j].body2.isAwake && !this.joints[j].body2.isStatic;

                if (awake1 ^ awake2)
                {
                    if (!awake1)
                    {
                        this.joints[j].body1.awake(true);
                    }

                    if (!awake2)
                    {
                        this.joints[j].body2.awake(true);
                    }
                }
            }

            //  5) Iterative velocity constraints solver
            this.velocitySolver(velocityIterations);

            Manager.dump("Velocity Solvers", this.bodies[1]);

            // 6) Integrate position
            for (var i = 0; i < this._bl; i++)
            {
                if (this.bodies[i] && this.bodies[i].isDynamic && this.bodies[i].isAwake)
                {
                    this.bodies[i].updatePosition(this._delta);
                }
            }

            Manager.dump("Update Position", this.bodies[1]);

            //  7) Process breakable joint
            for (var i = 0; i < this._jl; i++)
            {
                if (this.joints[i] && this.joints[i].breakable && (this.joints[i].getReactionForce(this._deltaInv).lengthSq() >= this.joints[i].maxForce * this.joints[i].maxForce))
                {
                    this.removeJoint(this.joints[i]);
                }
            }

            // 8) Iterative position constraints solver (result stored in this._positionSolved)
            this.positionSolver(positionIterations);

            Manager.dump("Position Solver", this.bodies[1]);

            // 9) Sync the Transforms
            for (var i = 0; i < this._bl; i++)
            {
                if (this.bodies[i])
                {
                    this.bodies[i].syncTransform();
                }
            }

            Manager.dump("Sync Transform", this.bodies[1]);

            // 10) Post solve collision callback
            if (this.postSolve)
            {
                for (var i = 0; i < this._cl; i++)
                {
                    this.postSolve(this.contactSolvers[i]);
                }
            }

            // 11) Cache Body Data
            for (var i = 0; i < this._bl; i++)
            {
                if (this.bodies[i] && this.bodies[i].isDynamic && this.bodies[i].isAwake)
                {
                    this.bodies[i].cacheData('post solve collision callback');
                }
            }

            Manager.dump("Cache Data", this.bodies[1]);

            Manager.writeAll();

            //  12) Process sleeping
            if (allowSleep)
            {
                this._minSleepTime = 999999;

                for (var i = 0; i < this._bl; i++)
                {
                    if (!this.bodies[i] || this.bodies[i].isDynamic == false)
                    {
                        continue;
                    }

                    if (this.bodies[i].angularVelocity * this.bodies[i].angularVelocity > this._angTolSqr || this.bodies[i].velocity.dot(this.bodies[i].velocity) > this._linTolSqr)
                    {
                        this.bodies[i].sleepTime = 0;
                        this._minSleepTime = 0;
                    }
                    else
                    {
                        this.bodies[i].sleepTime += this._delta;
                        this._minSleepTime = Math.min(this._minSleepTime, this.bodies[i].sleepTime);
                    }
                }

                if (this._positionSolved && this._minSleepTime >= Space.TIME_TO_SLEEP)
                {
                    for (var i = 0; i < this._bl; i++)
                    {
                        if (this.bodies[i])
                        {
                            this.bodies[i].awake(false);
                        }
                    }
                }
            }
        }

    }

}