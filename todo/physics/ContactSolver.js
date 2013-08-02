var Phaser;
(function (Phaser) {
    /// <reference path="../math/Vec2.ts" />
    /// <reference path="../geom/Point.ts" />
    /// <reference path="../math/Vec2Utils.ts" />
    /// <reference path="AdvancedPhysics.ts" />
    /// <reference path="Body.ts" />
    /// <reference path="shapes/Shape.ts" />
    /// <reference path="Contact.ts" />
    /**
    * Phaser - Advanced Physics - ContactSolver
    *
    * Based on the work Ju Hyung Lee started in JS PhyRus.
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
    (function (Physics) {
        var ContactSolver = (function () {
            function ContactSolver(shape1, shape2) {
                this.shape1 = shape1;
                this.shape2 = shape2;
                this.contacts = [];
                this.elasticity = 1;
                this.friction = 1;
            }
            ContactSolver.prototype.update = function (newContactArr) {
                for(var i = 0; i < newContactArr.length; i++) {
                    var newContact = newContactArr[i];
                    var k = -1;
                    for(var j = 0; j < this.contacts.length; j++) {
                        if(newContact.hash == this.contacts[j].hash) {
                            k = j;
                            break;
                        }
                    }
                    if(k > -1) {
                        newContact.lambdaNormal = this.contacts[k].lambdaNormal;
                        newContact.lambdaTangential = this.contacts[k].lambdaTangential;
                    }
                }
                this.contacts = newContactArr;
            };
            ContactSolver.prototype.initSolver = function (dt_inv) {
                var body1 = this.shape1.body;
                var body2 = this.shape2.body;
                var sum_m_inv = body1.massInverted + body2.massInverted;
                for(var i = 0; i < this.contacts.length; i++) {
                    var con = this.contacts[i];
                    //console.log('initSolver con');
                    //console.log(con);
                    // Transformed r1, r2
                    Phaser.Vec2Utils.subtract(con.point, body1.position, con.r1);
                    Phaser.Vec2Utils.subtract(con.point, body2.position, con.r2);
                    //con.r1 = vec2.sub(con.point, body1.p);
                    //con.r2 = vec2.sub(con.point, body2.p);
                    // Local r1, r2
                    Phaser.TransformUtils.unrotate(body1.transform, con.r1, con.r1_local);
                    Phaser.TransformUtils.unrotate(body2.transform, con.r2, con.r2_local);
                    //con.r1_local = body1.transform.unrotate(con.r1);
                    //con.r2_local = body2.transform.unrotate(con.r2);
                    var n = con.normal;
                    var t = Phaser.Vec2Utils.perp(con.normal);
                    // invEMn = J * invM * JT
                    // J = [ -n, -cross(r1, n), n, cross(r2, n) ]
                    var sn1 = Phaser.Vec2Utils.cross(con.r1, n);
                    var sn2 = Phaser.Vec2Utils.cross(con.r2, n);
                    var emn_inv = sum_m_inv + body1.inertiaInverted * sn1 * sn1 + body2.inertiaInverted * sn2 * sn2;
                    con.emn = emn_inv == 0 ? 0 : 1 / emn_inv;
                    // invEMt = J * invM * JT
                    // J = [ -t, -cross(r1, t), t, cross(r2, t) ]
                    var st1 = Phaser.Vec2Utils.cross(con.r1, t);
                    var st2 = Phaser.Vec2Utils.cross(con.r2, t);
                    var emt_inv = sum_m_inv + body1.inertiaInverted * st1 * st1 + body2.inertiaInverted * st2 * st2;
                    con.emt = emt_inv == 0 ? 0 : 1 / emt_inv;
                    // Linear velocities at contact point
                    // in 2D: cross(w, r) = perp(r) * w
                    var v1 = new Phaser.Vec2();
                    var v2 = new Phaser.Vec2();
                    Phaser.Vec2Utils.multiplyAdd(body1.velocity, Phaser.Vec2Utils.perp(con.r1), body1.angularVelocity, v1);
                    Phaser.Vec2Utils.multiplyAdd(body2.velocity, Phaser.Vec2Utils.perp(con.r2), body2.angularVelocity, v2);
                    //var v1 = vec2.mad(body1.v, vec2.perp(con.r1), body1.w);
                    //var v2 = vec2.mad(body2.v, vec2.perp(con.r2), body2.w);
                    // relative velocity at contact point
                    var rv = new Phaser.Vec2();
                    Phaser.Vec2Utils.subtract(v2, v1, rv);
                    //var rv = vec2.sub(v2, v1);
                    // bounce velocity dot n
                    con.bounce = Phaser.Vec2Utils.dot(rv, con.normal) * this.elasticity;
                }
            };
            ContactSolver.prototype.warmStart = function () {
                var body1 = this.shape1.body;
                var body2 = this.shape2.body;
                for(var i = 0; i < this.contacts.length; i++) {
                    var con = this.contacts[i];
                    var n = con.normal;
                    var lambda_n = con.lambdaNormal;
                    var lambda_t = con.lambdaTangential;
                    // Apply accumulated impulses
                    //var impulse = vec2.rotate_vec(new vec2(lambda_n, lambda_t), n);
                    //var impulse = new vec2(lambda_n * n.x - lambda_t * n.y, lambda_t * n.x + lambda_n * n.y);
                    var impulse = new Phaser.Vec2(lambda_n * n.x - lambda_t * n.y, lambda_t * n.x + lambda_n * n.y);
                    //console.log('phaser warmStart impulse ' + i + ' = ' + impulse.toString());
                    body1.velocity.multiplyAddByScalar(impulse, -body1.massInverted);
                    //body1.v.mad(impulse, -body1.m_inv);
                    body1.angularVelocity -= Phaser.Vec2Utils.cross(con.r1, impulse) * body1.inertiaInverted;
                    //body1.w -= vec2.cross(con.r1, impulse) * body1.i_inv;
                    body2.velocity.multiplyAddByScalar(impulse, body2.massInverted);
                    //body2.v.mad(impulse, body2.m_inv);
                    body2.angularVelocity += Phaser.Vec2Utils.cross(con.r2, impulse) * body2.inertiaInverted;
                    //body2.w += vec2.cross(con.r2, impulse) * body2.i_inv;
                                    }
            };
            ContactSolver.prototype.solveVelocityConstraints = function () {
                var body1 = this.shape1.body;
                var body2 = this.shape2.body;
                Physics.AdvancedPhysics.write('solveVelocityConstraints. Body1: ' + body1.name + ' Body2: ' + body2.name);
                Physics.AdvancedPhysics.write('Shape 1: ' + this.shape1.type + ' Shape 2: ' + this.shape2.type);
                var m1_inv = body1.massInverted;
                var i1_inv = body1.inertiaInverted;
                var m2_inv = body2.massInverted;
                var i2_inv = body2.inertiaInverted;
                Physics.AdvancedPhysics.write('m1_inv: ' + m1_inv);
                Physics.AdvancedPhysics.write('i1_inv: ' + i1_inv);
                Physics.AdvancedPhysics.write('m2_inv: ' + m2_inv);
                Physics.AdvancedPhysics.write('i2_inv: ' + i2_inv);
                for(var i = 0; i < this.contacts.length; i++) {
                    Physics.AdvancedPhysics.write('------------ solve con ' + i);
                    var con = this.contacts[i];
                    var n = con.normal;
                    var t = Phaser.Vec2Utils.perp(n);
                    var r1 = con.r1;
                    var r2 = con.r2;
                    // Linear velocities at contact point
                    // in 2D: cross(w, r) = perp(r) * w
                    var v1 = new Phaser.Vec2();
                    var v2 = new Phaser.Vec2();
                    Phaser.Vec2Utils.multiplyAdd(body1.velocity, Phaser.Vec2Utils.perp(r1), body1.angularVelocity, v1);
                    //var v1 = vec2.mad(body1.v, vec2.perp(r1), body1.w);
                    Physics.AdvancedPhysics.write('v1 ' + v1.toString());
                    Phaser.Vec2Utils.multiplyAdd(body2.velocity, Phaser.Vec2Utils.perp(r2), body2.angularVelocity, v2);
                    //var v2 = vec2.mad(body2.v, vec2.perp(r2), body2.w);
                    Physics.AdvancedPhysics.write('v2 ' + v2.toString());
                    // Relative velocity at contact point
                    var rv = new Phaser.Vec2();
                    Phaser.Vec2Utils.subtract(v2, v1, rv);
                    //var rv = vec2.sub(v2, v1);
                    Physics.AdvancedPhysics.write('rv ' + rv.toString());
                    // Compute normal constraint impulse + adding bounce as a velocity bias
                    // lambda_n = -EMn * J * V
                    var lambda_n = -con.emn * (Phaser.Vec2Utils.dot(n, rv) + con.bounce);
                    Physics.AdvancedPhysics.write('lambda_n: ' + lambda_n);
                    // Accumulate and clamp
                    var lambda_n_old = con.lambdaNormal;
                    con.lambdaNormal = Math.max(lambda_n_old + lambda_n, 0);
                    //con.lambdaNormal = this.clamp(lambda_n_old + lambda_n, 0);
                    lambda_n = con.lambdaNormal - lambda_n_old;
                    Physics.AdvancedPhysics.write('lambda_n clamped: ' + lambda_n);
                    // Compute frictional constraint impulse
                    // lambda_t = -EMt * J * V
                    var lambda_t = -con.emt * Phaser.Vec2Utils.dot(t, rv);
                    // Max friction constraint impulse (Coulomb's Law)
                    var lambda_t_max = con.lambdaNormal * this.friction;
                    // Accumulate and clamp
                    var lambda_t_old = con.lambdaTangential;
                    con.lambdaTangential = this.clamp(lambda_t_old + lambda_t, -lambda_t_max, lambda_t_max);
                    lambda_t = con.lambdaTangential - lambda_t_old;
                    // Apply the final impulses
                    //var impulse = vec2.rotate_vec(new vec2(lambda_n, lambda_t), n);
                    var impulse = new Phaser.Vec2(lambda_n * n.x - lambda_t * n.y, lambda_t * n.x + lambda_n * n.y);
                    Physics.AdvancedPhysics.write('impulse: ' + impulse.toString());
                    body1.velocity.multiplyAddByScalar(impulse, -m1_inv);
                    //body1.v.mad(impulse, -m1_inv);
                    body1.angularVelocity -= Phaser.Vec2Utils.cross(r1, impulse) * i1_inv;
                    //body1.w -= vec2.cross(r1, impulse) * i1_inv;
                    body2.velocity.multiplyAddByScalar(impulse, m2_inv);
                    //body2.v.mad(impulse, m2_inv);
                    body2.angularVelocity += Phaser.Vec2Utils.cross(r2, impulse) * i2_inv;
                    //body2.w += vec2.cross(r2, impulse) * i2_inv;
                    Physics.AdvancedPhysics.write('body1: ' + body1.toString());
                    Physics.AdvancedPhysics.write('body2: ' + body2.toString());
                }
            };
            ContactSolver.prototype.solvePositionConstraints = function () {
                var body1 = this.shape1.body;
                var body2 = this.shape2.body;
                Physics.AdvancedPhysics.write('solvePositionConstraints');
                var m1_inv = body1.massInverted;
                var i1_inv = body1.inertiaInverted;
                var m2_inv = body2.massInverted;
                var i2_inv = body2.inertiaInverted;
                var sum_m_inv = m1_inv + m2_inv;
                var max_penetration = 0;
                for(var i = 0; i < this.contacts.length; i++) {
                    Physics.AdvancedPhysics.write('------------- solvePositionConstraints ' + i);
                    var con = this.contacts[i];
                    var n = con.normal;
                    var r1 = new Phaser.Vec2();
                    var r2 = new Phaser.Vec2();
                    // Transformed r1, r2
                    Phaser.Vec2Utils.rotate(con.r1_local, body1.angle, r1);
                    Phaser.Vec2Utils.rotate(con.r2_local, body2.angle, r2);
                    Physics.AdvancedPhysics.write('r1_local.x = ' + con.r1_local.x + ' r1_local.y = ' + con.r1_local.y + ' angle: ' + body1.angle);
                    Physics.AdvancedPhysics.write('r1 rotated: r1.x = ' + r1.x + ' r1.y = ' + r1.y);
                    Physics.AdvancedPhysics.write('r2_local.x = ' + con.r2_local.x + ' r2_local.y = ' + con.r2_local.y + ' angle: ' + body2.angle);
                    Physics.AdvancedPhysics.write('r2 rotated: r2.x = ' + r2.x + ' r2.y = ' + r2.y);
                    // Contact points (corrected)
                    var p1 = new Phaser.Vec2();
                    var p2 = new Phaser.Vec2();
                    Phaser.Vec2Utils.add(body1.position, r1, p1);
                    Phaser.Vec2Utils.add(body2.position, r2, p2);
                    Physics.AdvancedPhysics.write('body1.pos.x=' + body1.position.x + ' y=' + body1.position.y);
                    Physics.AdvancedPhysics.write('body2.pos.x=' + body2.position.x + ' y=' + body2.position.y);
                    // Corrected delta vector
                    var dp = new Phaser.Vec2();
                    Phaser.Vec2Utils.subtract(p2, p1, dp);
                    // Position constraint
                    var c = Phaser.Vec2Utils.dot(dp, n) + con.depth;
                    var correction = this.clamp(Physics.AdvancedPhysics.CONTACT_SOLVER_BAUMGARTE * (c + Physics.AdvancedPhysics.CONTACT_SOLVER_COLLISION_SLOP), -Physics.AdvancedPhysics.CONTACT_SOLVER_MAX_LINEAR_CORRECTION, 0);
                    if(correction == 0) {
                        continue;
                    }
                    // We don't need max_penetration less than or equal slop
                    max_penetration = Math.max(max_penetration, -c);
                    // Compute lambda for position constraint
                    // Solve (J * invM * JT) * lambda = -C / dt
                    var sn1 = Phaser.Vec2Utils.cross(r1, n);
                    var sn2 = Phaser.Vec2Utils.cross(r2, n);
                    var em_inv = sum_m_inv + body1.inertiaInverted * sn1 * sn1 + body2.inertiaInverted * sn2 * sn2;
                    var lambda_dt = em_inv == 0 ? 0 : -correction / em_inv;
                    // Apply correction impulses
                    var impulse_dt = new Phaser.Vec2();
                    Phaser.Vec2Utils.scale(n, lambda_dt, impulse_dt);
                    body1.position.multiplyAddByScalar(impulse_dt, -m1_inv);
                    body1.angle -= sn1 * lambda_dt * i1_inv;
                    body2.position.multiplyAddByScalar(impulse_dt, m2_inv);
                    body2.angle += sn2 * lambda_dt * i2_inv;
                    Physics.AdvancedPhysics.write('body1.pos.x=' + body1.position.x + ' y=' + body1.position.y);
                    Physics.AdvancedPhysics.write('body2.pos.x=' + body2.position.x + ' y=' + body2.position.y);
                }
                Physics.AdvancedPhysics.write('max_penetration: ' + max_penetration);
                return max_penetration <= Physics.AdvancedPhysics.CONTACT_SOLVER_COLLISION_SLOP * 3;
            };
            ContactSolver.prototype.clamp = function (v, min, max) {
                return v < min ? min : (v > max ? max : v);
            };
            return ContactSolver;
        })();
        Physics.ContactSolver = ContactSolver;        
    })(Phaser.Physics || (Phaser.Physics = {}));
    var Physics = Phaser.Physics;
})(Phaser || (Phaser = {}));
