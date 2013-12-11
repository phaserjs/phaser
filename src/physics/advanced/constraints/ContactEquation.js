var Equation = require("./Equation"),
    vec2 = require('../math/vec2'),
    mat2 = require('../math/mat2');

module.exports = ContactEquation;

/**
 * Non-penetration constraint equation. Tries to make the ri and rj vectors the same point.
 *
 * @class ContactEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 */
function ContactEquation(bi,bj){
    Equation.call(this,bi,bj,0,Number.MAX_VALUE);

    /**
     * Vector from body i center of mass to the contact point.
     * @property ri
     * @type {Array}
     */
    this.ri = vec2.create();
    this.penetrationVec = vec2.create();

    /**
     * Vector from body j center of mass to the contact point.
     * @property rj
     * @type {Array}
     */
    this.rj = vec2.create();

    /**
     * The normal vector, pointing out of body i
     * @property ni
     * @type {Array}
     */
    this.ni = vec2.create();

    /**
     * The restitution to use. 0=no bounciness, 1=max bounciness.
     * @property restitution
     * @type {Number}
     */
    this.restitution = 0;

    /**
     * Set to true if this is the first impact between the bodies (not persistant contact).
     * @property firstImpact
     * @type {Boolean}
     */
    this.firstImpact = false;

    /**
     * The shape in body i that triggered this contact.
     * @property shapeA
     * @type {Shape}
     */
    this.shapeA = null;

    /**
     * The shape in body j that triggered this contact.
     * @property shapeB
     * @type {Shape}
     */
    this.shapeB = null;
};
ContactEquation.prototype = new Equation();
ContactEquation.prototype.constructor = ContactEquation;
ContactEquation.prototype.computeB = function(a,b,h){
    var bi = this.bi,
        bj = this.bj,
        ri = this.ri,
        rj = this.rj,
        xi = bi.position,
        xj = bj.position;

    var penetrationVec = this.penetrationVec,
        n = this.ni,
        G = this.G;

    // Caluclate cross products
    var rixn = vec2.crossLength(ri,n),
        rjxn = vec2.crossLength(rj,n);

    // G = [-n -rixn n rjxn]
    G[0] = -n[0];
    G[1] = -n[1];
    G[2] = -rixn;
    G[3] = n[0];
    G[4] = n[1];
    G[5] = rjxn;

    // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
    vec2.add(penetrationVec,xj,rj);
    vec2.sub(penetrationVec,penetrationVec,xi);
    vec2.sub(penetrationVec,penetrationVec,ri);

    // Compute iteration
    var GW, Gq;
    if(this.firstImpact && this.restitution !== 0){
        Gq = 0;
        GW = (1/b)*(1+this.restitution) * this.computeGW();
    } else {
        GW = this.computeGW();
        Gq = vec2.dot(n,penetrationVec);
    }

    var GiMf = this.computeGiMf();
    var B = - Gq * a - GW * b - h*GiMf;

    return B;
};
