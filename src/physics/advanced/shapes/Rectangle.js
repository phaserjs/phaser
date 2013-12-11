var vec2 = require('../math/vec2')
,   Shape = require('./Shape')
,   Convex = require('./Convex')

module.exports = Rectangle;

/**
 * Rectangle shape class.
 * @class Rectangle
 * @constructor
 * @param {Number} w Width
 * @param {Number} h Height
 * @extends {Convex}
 */
function Rectangle(w,h){
    var verts = [   vec2.fromValues(-w/2, -h/2),
                    vec2.fromValues( w/2, -h/2),
                    vec2.fromValues( w/2,  h/2),
                    vec2.fromValues(-w/2,  h/2)];

    /**
     * Total width of the rectangle
     * @property width
     * @type {Number}
     */
    this.width = w;

    /**
     * Total height of the rectangle
     * @property height
     * @type {Number}
     */
    this.height = h;

    Convex.call(this,verts);
};
Rectangle.prototype = new Convex();

/**
 * Compute moment of inertia
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Rectangle.prototype.computeMomentOfInertia = function(mass){
    var w = this.width,
        h = this.height;
    return mass * (h*h + w*w) / 12;
};

/**
 * Update the bounding radius
 * @method updateBoundingRadius
 */
Rectangle.prototype.updateBoundingRadius = function(){
    var w = this.width,
        h = this.height;
    this.boundingRadius = Math.sqrt(w*w + h*h) / 2;
};

