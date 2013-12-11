var Constraint = require('./Constraint')
,   vec2 = require('../math/vec2')
,   Equation = require('./Equation')

module.exports = LockConstraint;

/**
 * Locks the relative position between two bodies.
 *
 * @class LockConstraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Object} [options]
 * @param {Array}  [options.localOffsetB] The offset of bodyB in bodyA's frame.
 * @param {number} [options.localAngleB]  The angle of bodyB in bodyA's frame.
 * @param {number} [options.maxForce]
 * @extends {Constraint}
 */
function LockConstraint(bodyA,bodyB,options){
    Constraint.call(this,bodyA,bodyB);
    var maxForce = ( typeof(options.maxForce)=="undefined" ? Number.MAX_VALUE : options.maxForce );
    var localOffsetB = options.localOffsetB || vec2.fromValues(0,0);
    localOffsetB = vec2.fromValues(localOffsetB[0],localOffsetB[1]);

    var localAngleB = options.localAngleB || 0;

    // Use 3 equations:
    // gx =   (xj - xi - l) * xhat = 0
    // gy =   (xj - xi - l) * yhat = 0
    // gr =   (xi - xj + r) * that = 0
    //
    // ...where:
    //   l is the localOffsetB vector rotated to world in bodyA frame
    //   r is the same vector but reversed and rotated from bodyB frame
    //   xhat, yhat are world axis vectors
    //   that is the tangent of r
    //
    // For the first two constraints, we get
    // G*W = (vj - vi - ldot  ) * xhat
    //     = (vj - vi - wi x l) * xhat
    //
    // Since (wi x l) * xhat = (l x xhat) * wi, we get
    // G*W = [ -1   0   (-l x xhat)  1   0   0] * [vi wi vj wj]
    //
    // The last constraint gives
    // GW = (vi - vj + wj x r) * that
    //    = [  that   0  -that  (r x t) ]

    var x =     new Equation(bodyA,bodyB,-maxForce,maxForce),
        y =     new Equation(bodyA,bodyB,-maxForce,maxForce),
        rot =   new Equation(bodyA,bodyB,-maxForce,maxForce);

    var l = vec2.create(),
        g = vec2.create();
    x.computeGq = function(){
        vec2.rotate(l,localOffsetB,bodyA.angle);
        vec2.sub(g,bodyB.position,bodyA.position);
        vec2.sub(g,g,l);
        return g[0];
    }
    y.computeGq = function(){
        vec2.rotate(l,localOffsetB,bodyA.angle);
        vec2.sub(g,bodyB.position,bodyA.position);
        vec2.sub(g,g,l);
        return g[1];
    };
    var r = vec2.create(),
        t = vec2.create();
    rot.computeGq = function(){
        vec2.rotate(r,localOffsetB,bodyB.angle - localAngleB);
        vec2.scale(r,r,-1);
        vec2.sub(g,bodyA.position,bodyB.position);
        vec2.add(g,g,r);
        vec2.rotate(t,r,-Math.PI/2);
        vec2.normalize(t,t);
        return vec2.dot(g,t);
    };

    this.localOffsetB = localOffsetB;
    this.localAngleB =  localAngleB;
    this.maxForce = maxForce;

    var eqs = this.equations = [ x, y, rot ];
}
LockConstraint.prototype = new Constraint();

var l = vec2.create();
var r = vec2.create();
var t = vec2.create();
var xAxis = vec2.fromValues(1,0);
var yAxis = vec2.fromValues(0,1);
LockConstraint.prototype.update = function(){
    var x =   this.equations[0],
        y =   this.equations[1],
        rot = this.equations[2],
        bodyA = this.bodyA,
        bodyB = this.bodyB;

    vec2.rotate(l,this.localOffsetB,bodyA.angle);
    vec2.rotate(r,this.localOffsetB,bodyB.angle - this.localAngleB);
    vec2.scale(r,r,-1);

    vec2.rotate(t,r,Math.PI/2);
    vec2.normalize(t,t);

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2.crossLength(l,xAxis);
    x.G[3] =  1;

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2.crossLength(l,yAxis);
    y.G[4] =  1;

    rot.G[0] =  -t[0];
    rot.G[1] =  -t[1];
    rot.G[3] =  t[0];
    rot.G[4] =  t[1];
    rot.G[5] =  vec2.crossLength(r,t);
};
