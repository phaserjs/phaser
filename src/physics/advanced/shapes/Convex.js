var Shape = require('./Shape')
,   vec2 = require('../math/vec2')
,   polyk = require('../math/polyk')

module.exports = Convex;

/**
 * Convex shape class.
 * @class Convex
 * @constructor
 * @extends {Shape}
 * @param {Array} vertices An array of Float32Array vertices that span this shape. Vertices are given in counter-clockwise (CCW) direction.
 */
function Convex(vertices){

    /**
    * Vertices defined in the local frame.
    * @property vertices
    * @type {Array}
    */
    this.vertices = vertices || [];

    /**
    * The center of mass of the Convex
    * @property centerOfMass
    * @type {Float32Array}
    */
    this.centerOfMass = vec2.fromValues(0,0);

    /**
    * Triangulated version of this convex. The structure is Array of 3-Arrays, and each subarray contains 3 integers, referencing the vertices.
    * @property triangles
    * @type {Array}
    */
    this.triangles = [];

    if(this.vertices.length){
        this.updateTriangles();
        this.updateCenterOfMass();
    }

    /**
    * The bounding radius of the convex
    * @property boundingRadius
    * @type {Number}
    */
    this.boundingRadius = 0;
    this.updateBoundingRadius();

    Shape.call(this,Shape.CONVEX);
};
Convex.prototype = new Shape();

Convex.prototype.updateTriangles = function(){

    this.triangles.length = 0;

    // Rewrite on polyk notation, array of numbers
    var polykVerts = [];
    for(var i=0; i<this.vertices.length; i++){
        var v = this.vertices[i];
        polykVerts.push(v[0],v[1]);
    }

    // Triangulate
    var triangles = polyk.Triangulate(polykVerts);

    // Loop over all triangles, add their inertia contributions to I
    for(var i=0; i<triangles.length; i+=3){
        var id1 = triangles[i],
            id2 = triangles[i+1],
            id3 = triangles[i+2];

        // Add to triangles
        this.triangles.push([id1,id2,id3]);
    }
};

var updateCenterOfMass_centroid = vec2.create(),
    updateCenterOfMass_centroid_times_mass = vec2.create(),
    updateCenterOfMass_a = vec2.create(),
    updateCenterOfMass_b = vec2.create(),
    updateCenterOfMass_c = vec2.create(),
    updateCenterOfMass_ac = vec2.create(),
    updateCenterOfMass_ca = vec2.create(),
    updateCenterOfMass_cb = vec2.create(),
    updateCenterOfMass_n = vec2.create();
Convex.prototype.updateCenterOfMass = function(){
    var triangles = this.triangles,
        verts = this.vertices,
        cm = this.centerOfMass,
        centroid = updateCenterOfMass_centroid,
        n = updateCenterOfMass_n,
        a = updateCenterOfMass_a,
        b = updateCenterOfMass_b,
        c = updateCenterOfMass_c,
        ac = updateCenterOfMass_ac,
        ca = updateCenterOfMass_ca,
        cb = updateCenterOfMass_cb,
        centroid_times_mass = updateCenterOfMass_centroid_times_mass;

    vec2.set(cm,0,0);

    for(var i=0; i<triangles.length; i++){
        var t = triangles[i],
            a = verts[t[0]],
            b = verts[t[1]],
            c = verts[t[2]];

        vec2.centroid(centroid,a,b,c);

        vec2.sub(ca, c, a);
        vec2.sub(cb, c, b);

        // Get mass for the triangle (density=1 in this case)
        // http://math.stackexchange.com/questions/80198/area-of-triangle-via-vectors
        var m = 0.5 * vec2.crossLength(ca,cb);

        // Add to center of mass
        vec2.scale(centroid_times_mass, centroid, m);
        vec2.add(cm, cm, centroid_times_mass);
    }
};

/**
 * Compute the mass moment of inertia of the Convex.
 * @method conputeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 * @todo  should use .triangles
 */
Convex.prototype.computeMomentOfInertia = function(mass){

    // In short: Triangulate the Convex, compute centroid and inertia of
    // each sub-triangle. Add up to total using parallel axis theorem.

    var I = 0;

    // Rewrite on polyk notation, array of numbers
    var polykVerts = [];
    for(var i=0; i<this.vertices.length; i++){
        var v = this.vertices[i];
        polykVerts.push(v[0],v[1]);
    }

    // Triangulate
    var triangles = polyk.Triangulate(polykVerts);

    // Get total convex area and density
    var area = polyk.GetArea(polykVerts);
    var density = mass / area;

    // Temp vectors
    var a = vec2.create(),
        b = vec2.create(),
        c = vec2.create(),
        centroid = vec2.create(),
        n = vec2.create(),
        ac = vec2.create(),
        ca = vec2.create(),
        cb = vec2.create(),
        centroid_times_mass = vec2.create();

    // Loop over all triangles, add their inertia contributions to I
    for(var i=0; i<triangles.length; i+=3){
        var id1 = triangles[i],
            id2 = triangles[i+1],
            id3 = triangles[i+2];

        // a,b,c are triangle corners
        vec2.set(a, polykVerts[2*id1], polykVerts[2*id1+1]);
        vec2.set(b, polykVerts[2*id2], polykVerts[2*id2+1]);
        vec2.set(c, polykVerts[2*id3], polykVerts[2*id3+1]);

        vec2.centroid(centroid, a, b, c);

        vec2.sub(ca, c, a);
        vec2.sub(cb, c, b);

        var area_triangle = 0.5 * vec2.crossLength(ca,cb);
        var base = vec2.length(ca);
        var height = 2*area_triangle / base; // a=b*h/2 => h=2*a/b

        // Get inertia for this triangle: http://answers.yahoo.com/question/index?qid=20080721030038AA3oE1m
        var I_triangle = (base * (Math.pow(height,3))) / 36;

        // Get mass for the triangle
        var m = base*height/2 * density;

        // Add to total inertia using parallel axis theorem
        var r2 = vec2.squaredLength(centroid);
        I += I_triangle + m*r2;
    }

    return I;
};

/**
 * Updates the .boundingRadius property
 * @method updateBoundingRadius
 */
Convex.prototype.updateBoundingRadius = function(){
    var verts = this.vertices,
        r2 = 0;

    for(var i=0; i!==verts.length; i++){
        var l2 = vec2.squaredLength(verts[i]);
        if(l2 > r2) r2 = l2;
    }

    this.boundingRadius = Math.sqrt(r2);
};

