var Phaser;
(function (Phaser) {
    /// <reference path="../math/Vec2.ts" />
    /// <reference path="../geom/Point.ts" />
    /// <reference path="../math/Vec2Utils.ts" />
    /// <reference path="../math/Transform.ts" />
    /// <reference path="../math/TransformUtils.ts" />
    /// <reference path="../utils/BodyUtils.ts" />
    /// <reference path="AdvancedPhysics.ts" />
    /// <reference path="joints/Joint.ts" />
    /// <reference path="Bounds.ts" />
    /// <reference path="Space.ts" />
    /// <reference path="shapes/IShape.ts" />
    /// <reference path="shapes/Triangle.ts" />
    /// <reference path="shapes/Circle.ts" />
    /// <reference path="shapes/Box.ts" />
    /// <reference path="shapes/Poly.ts" />
    /// <reference path="shapes/Segment.ts" />
    /**
    * Phaser - Advanced Physics - Body
    *
    * Based on the work Ju Hyung Lee started in JS PhyRus.
    */
    (function (Physics) {
        var Body = (function () {
            function Body(sprite, type, x, y, shapeType) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof shapeType === "undefined") { shapeType = 0; }
                this._tempVec2 = new Phaser.Vec2();
                this._fixedRotation = false;
                //  Shapes
                this.shapes = [];
                //  Joints
                this.joints = [];
                this.jointHash = {
                };
                this.categoryBits = 0x0001;
                this.maskBits = 0xFFFF;
                this.stepCount = 0;
                this._newPosition = new Phaser.Vec2();
                this.id = Phaser.Physics.AdvancedPhysics.bodyCounter++;
                this.name = 'body' + this.id;
                this.type = type;
                if(sprite) {
                    this.sprite = sprite;
                    this.game = sprite.game;
                    this.position = new Phaser.Vec2(Phaser.Physics.AdvancedPhysics.pixelsToMeters(sprite.x), Phaser.Physics.AdvancedPhysics.pixelsToMeters(sprite.y));
                    this.angle = this.game.math.degreesToRadians(sprite.rotation);
                } else {
                    this.position = new Phaser.Vec2(Phaser.Physics.AdvancedPhysics.pixelsToMeters(x), Phaser.Physics.AdvancedPhysics.pixelsToMeters(y));
                    this.angle = 0;
                }
                this.transform = new Phaser.Transform(this.position, this.angle);
                this.centroid = new Phaser.Vec2();
                this.velocity = new Phaser.Vec2();
                this.force = new Phaser.Vec2();
                this.angularVelocity = 0;
                this.torque = 0;
                this.linearDamping = 0;
                this.angularDamping = 0;
                this.sleepTime = 0;
                this.awaked = false;
                this.shapes = [];
                this.joints = [];
                this.jointHash = {
                };
                this.bounds = new Physics.Bounds();
                this.allowCollisions = Phaser.Types.ANY;
                this.categoryBits = 0x0001;
                this.maskBits = 0xFFFF;
                this.stepCount = 0;
                if(sprite) {
                    if(shapeType == 0) {
                        Phaser.BodyUtils.addBox(this, 0, 0, this.sprite.width, this.sprite.height, 1, 1, 1);
                    } else {
                        Phaser.BodyUtils.addCircle(this, Math.max(this.sprite.width, this.sprite.height) / 2, 0, 0, 1, 1, 1);
                    }
                }
            }
            Object.defineProperty(Body.prototype, "rotation", {
                get: /**
                * The rotation of the body in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
                */
                function () {
                    return this.game.math.radiansToDegrees(this.angle);
                },
                set: /**
                * Set the rotation of the body in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
                * The value is automatically wrapped to be between 0 and 360.
                */
                function (value) {
                    this.angle = this.game.math.degreesToRadians(this.game.math.wrap(value, 360, 0));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Body.prototype, "isDisabled", {
                get: function () {
                    return this.type == Phaser.Types.BODY_DISABLED ? true : false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Body.prototype, "isStatic", {
                get: function () {
                    return this.type == Phaser.Types.BODY_STATIC ? true : false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Body.prototype, "isKinetic", {
                get: function () {
                    return this.type == Phaser.Types.BODY_KINETIC ? true : false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Body.prototype, "isDynamic", {
                get: function () {
                    return this.type == Phaser.Types.BODY_DYNAMIC ? true : false;
                },
                enumerable: true,
                configurable: true
            });
            Body.prototype.setType = function (type) {
                if(type == this.type) {
                    return;
                }
                this.force.setTo(0, 0);
                this.velocity.setTo(0, 0);
                this.torque = 0;
                this.angularVelocity = 0;
                this.type = type;
                this.awake(true);
            };
            Body.prototype.addShape = function (shape) {
                //  Check not already part of this body
                shape.body = this;
                this.shapes.push(shape);
                this.shapesLength = this.shapes.length;
                return shape;
            };
            Body.prototype.removeShape = function (shape) {
                var index = this.shapes.indexOf(shape);
                if(index != -1) {
                    this.shapes.splice(index, 1);
                    shape.body = undefined;
                }
                this.shapesLength = this.shapes.length;
            };
            Body.prototype.setMass = function (mass) {
                this.mass = mass;
                this.massInverted = mass > 0 ? 1 / mass : 0;
            };
            Body.prototype.setInertia = function (inertia) {
                this.inertia = inertia;
                this.inertiaInverted = inertia > 0 ? 1 / inertia : 0;
            };
            Body.prototype.setPosition = function (x, y) {
                this._newPosition.setTo(Phaser.Physics.AdvancedPhysics.pixelsToMeters(x), Phaser.Physics.AdvancedPhysics.pixelsToMeters(y));
                this.setTransform(this._newPosition, this.angle);
            };
            Body.prototype.setTransform = function (pos, angle) {
                //  inject the transform into this.position
                this.transform.setTo(pos, angle);
                //Manager.write('setTransform: ' + this.position.toString());
                //Manager.write('centroid: ' + this.centroid.toString());
                Phaser.TransformUtils.transform(this.transform, this.centroid, this.position);
                //Manager.write('post setTransform: ' + this.position.toString());
                //this.position.copyFrom(this.transform.transform(this.centroid));
                this.angle = angle;
            };
            Body.prototype.syncTransform = function () {
                //Manager.write('syncTransform:');
                //Manager.write('p: ' + this.position.toString());
                //Manager.write('centroid: ' + this.centroid.toString());
                //Manager.write('xf: ' + this.transform.toString());
                //Manager.write('a: ' + this.angle);
                this.transform.setRotation(this.angle);
                //  OPTIMISE: Creating new vector
                Phaser.Vec2Utils.subtract(this.position, Phaser.TransformUtils.rotate(this.transform, this.centroid), this.transform.t);
                //Manager.write('--------------------');
                //Manager.write('xf: ' + this.transform.toString());
                //Manager.write('--------------------');
                            };
            Body.prototype.getWorldPoint = function (p) {
                //  OPTIMISE: Creating new vector
                return Phaser.TransformUtils.transform(this.transform, p);
            };
            Body.prototype.getWorldVector = function (v) {
                //  OPTIMISE: Creating new vector
                return Phaser.TransformUtils.rotate(this.transform, v);
            };
            Body.prototype.getLocalPoint = function (p) {
                //  OPTIMISE: Creating new vector
                return Phaser.TransformUtils.untransform(this.transform, p);
            };
            Body.prototype.getLocalVector = function (v) {
                //  OPTIMISE: Creating new vector
                return Phaser.TransformUtils.unrotate(this.transform, v);
            };
            Object.defineProperty(Body.prototype, "fixedRotation", {
                get: function () {
                    return this._fixedRotation;
                },
                set: function (value) {
                    this._fixedRotation = value;
                    this.resetMassData();
                },
                enumerable: true,
                configurable: true
            });
            Body.prototype.resetMassData = function () {
                this.centroid.setTo(0, 0);
                this.mass = 0;
                this.massInverted = 0;
                this.inertia = 0;
                this.inertiaInverted = 0;
                if(this.isDynamic == false) {
                    Phaser.TransformUtils.transform(this.transform, this.centroid, this.position);
                    return;
                }
                var totalMassCentroid = new Phaser.Vec2(0, 0);
                var totalMass = 0;
                var totalInertia = 0;
                for(var i = 0; i < this.shapes.length; i++) {
                    var shape = this.shapes[i];
                    var centroid = shape.centroid();
                    var mass = shape.area() * shape.density;
                    var inertia = shape.inertia(mass);
                    totalMassCentroid.multiplyAddByScalar(centroid, mass);
                    totalMass += mass;
                    totalInertia += inertia;
                }
                Phaser.Vec2Utils.scale(totalMassCentroid, 1 / totalMass, this.centroid);
                this.setMass(totalMass);
                if(!this.fixedRotation) {
                    this.setInertia(totalInertia - totalMass * Phaser.Vec2Utils.dot(this.centroid, this.centroid));
                }
                // Move center of mass
                var oldPosition = Phaser.Vec2Utils.clone(this.position);
                Phaser.TransformUtils.transform(this.transform, this.centroid, this.position);
                // Update center of mass velocity
                oldPosition.subtract(this.position);
                this.velocity.multiplyAddByScalar(Phaser.Vec2Utils.perp(oldPosition, oldPosition), this.angularVelocity);
            };
            Body.prototype.resetJointAnchors = function () {
                for(var i = 0; i < this.joints.length; i++) {
                    var joint = this.joints[i];
                    if(!joint) {
                        continue;
                    }
                    var anchor1 = joint.getWorldAnchor1();
                    var anchor2 = joint.getWorldAnchor2();
                    joint.setWorldAnchor1(anchor1);
                    joint.setWorldAnchor2(anchor2);
                }
            };
            Body.prototype.cacheData = function (source) {
                if (typeof source === "undefined") { source = ''; }
                //Manager.write('cacheData -- start');
                //Manager.write('p: ' + this.position.toString());
                //Manager.write('xf: ' + this.transform.toString());
                this.bounds.clear();
                for(var i = 0; i < this.shapesLength; i++) {
                    var shape = this.shapes[i];
                    shape.cacheData(this.transform);
                    this.bounds.addBounds(shape.bounds);
                }
                //Manager.write('bounds: ' + this.bounds.toString());
                //Manager.write('p: ' + this.position.toString());
                //Manager.write('xf: ' + this.transform.toString());
                //Manager.write('cacheData -- stop');
                            };
            Body.prototype.updateVelocity = function (gravity, dt, damping) {
                Phaser.Vec2Utils.multiplyAdd(gravity, this.force, this.massInverted, this._tempVec2);
                Phaser.Vec2Utils.multiplyAdd(this.velocity, this._tempVec2, dt, this.velocity);
                this.angularVelocity = this.angularVelocity + this.torque * this.inertiaInverted * dt;
                // Apply damping.
                // ODE: dv/dt + c * v = 0
                // Solution: v(t) = v0 * exp(-c * t)
                // Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v * exp(-c * dt)
                // v2 = exp(-c * dt) * v1
                // Taylor expansion:
                // v2 = (1.0f - c * dt) * v1
                this.velocity.scale(this.clamp(1 - dt * (damping + this.linearDamping), 0, 1));
                this.angularVelocity *= this.clamp(1 - dt * (damping + this.angularDamping), 0, 1);
                this.force.setTo(0, 0);
                this.torque = 0;
            };
            Body.prototype.inContact = function (body2) {
                if(!body2 || this.stepCount == body2.stepCount) {
                    return false;
                }
                if(!(this.isAwake && this.isStatic == false) && !(body2.isAwake && body2.isStatic == false)) {
                    return false;
                }
                if(this.isCollidable(body2) == false) {
                    return false;
                }
                if(!this.bounds.intersectsBounds(body2.bounds)) {
                    return false;
                }
                return true;
            };
            Body.prototype.clamp = function (v, min, max) {
                return v < min ? min : (v > max ? max : v);
            };
            Body.prototype.updatePosition = function (dt) {
                this.position.add(Phaser.Vec2Utils.scale(this.velocity, dt, this._tempVec2));
                this.angle += this.angularVelocity * dt;
                if(this.sprite) {
                    this.sprite.x = this.position.x * 50;
                    this.sprite.y = this.position.y * 50;
                    this.sprite.transform.rotation = this.game.math.radiansToDegrees(this.angle);
                }
            };
            Body.prototype.resetForce = function () {
                this.force.setTo(0, 0);
                this.torque = 0;
            };
            Body.prototype.applyForce = function (force, p) {
                if(this.isDynamic == false) {
                    return;
                }
                if(this.isAwake == false) {
                    this.awake(true);
                }
                this.force.add(force);
                Phaser.Vec2Utils.subtract(p, this.position, this._tempVec2);
                this.torque += Phaser.Vec2Utils.cross(this._tempVec2, force);
            };
            Body.prototype.applyForceToCenter = function (force) {
                if(this.isDynamic == false) {
                    return;
                }
                if(this.isAwake == false) {
                    this.awake(true);
                }
                this.force.add(force);
            };
            Body.prototype.applyTorque = function (torque) {
                if(this.isDynamic == false) {
                    return;
                }
                if(this.isAwake == false) {
                    this.awake(true);
                }
                this.torque += torque;
            };
            Body.prototype.applyLinearImpulse = function (impulse, p) {
                if(this.isDynamic == false) {
                    return;
                }
                if(this.isAwake == false) {
                    this.awake(true);
                }
                this.velocity.multiplyAddByScalar(impulse, this.massInverted);
                Phaser.Vec2Utils.subtract(p, this.position, this._tempVec2);
                this.angularVelocity += Phaser.Vec2Utils.cross(this._tempVec2, impulse) * this.inertiaInverted;
            };
            Body.prototype.applyAngularImpulse = function (impulse) {
                if(this.isDynamic == false) {
                    return;
                }
                if(this.isAwake == false) {
                    this.awake(true);
                }
                this.angularVelocity += impulse * this.inertiaInverted;
            };
            Body.prototype.kineticEnergy = function () {
                return 0.5 * (this.mass * this.velocity.dot(this.velocity) + this.inertia * (this.angularVelocity * this.angularVelocity));
            };
            Object.defineProperty(Body.prototype, "isAwake", {
                get: function () {
                    return this.awaked;
                },
                enumerable: true,
                configurable: true
            });
            Body.prototype.awake = function (flag) {
                this.awaked = flag;
                if(flag) {
                    this.sleepTime = 0;
                } else {
                    this.velocity.setTo(0, 0);
                    this.angularVelocity = 0;
                    this.force.setTo(0, 0);
                    this.torque = 0;
                }
            };
            Body.prototype.isCollidable = function (other) {
                if((this.isDynamic == false && other.isDynamic == false) || this == other) {
                    return false;
                }
                if(!(this.maskBits & other.categoryBits) || !(other.maskBits & this.categoryBits)) {
                    return false;
                }
                for(var i = 0; i < this.joints.length; i++) {
                    var joint = this.joints[i];
                    if(!this.joints[i] || (!this.joints[i].collideConnected && other.jointHash[this.joints[i].id] != undefined)) {
                        return false;
                    }
                }
                return true;
            };
            Body.prototype.toString = function () {
                return "[{Body (name=" + this.name + " velocity=" + this.velocity.toString() + " angularVelocity: " + this.angularVelocity + ")}]";
            };
            return Body;
        })();
        Physics.Body = Body;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
