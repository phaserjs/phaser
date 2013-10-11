var vec2 = require('../math/vec2')
,   Shape = require('./Shape')
,   Convex = require('./Convex')

module.exports = Rectangle;

/**
 * Rectangle shape class.
 * @class Rectangle
 * @constructor
 * @extends {Convex}
 */
function Rectangle(w,h){
    var verts = [   vec2.fromValues(-w/2, -h/2),
                    vec2.fromValues( w/2, -h/2),
                    vec2.fromValues( w/2,  h/2),
                    vec2.fromValues(-w/2,  h/2)];

    this.width = w;
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

Rectangle.prototype.updateBoundingRadius = function(){
    var w = this.width,
        h = this.height;
    this.boundingRadius = Math.sqrt(w*w + h*h) / 2;
};

