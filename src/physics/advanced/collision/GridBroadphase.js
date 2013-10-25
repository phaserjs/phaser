var Circle = require('../shapes/Circle')
,   Plane = require('../shapes/Plane')
,   Particle = require('../shapes/Particle')
,   Broadphase = require('../collision/Broadphase')
,   vec2 = require('../math/vec2')

module.exports = GridBroadphase;

/**
 * Broadphase that uses axis-aligned bins.
 * @class GridBroadphase
 * @constructor
 * @extends Broadphase
 * @param {number} xmin Lower x bound of the grid
 * @param {number} xmax Upper x bound
 * @param {number} ymin Lower y bound
 * @param {number} ymax Upper y bound
 * @param {number} nx Number of bins along x axis
 * @param {number} ny Number of bins along y axis
 * @todo test
 */
function GridBroadphase(xmin,xmax,ymin,ymax,nx,ny){
    Broadphase.apply(this);

    nx = nx || 10;
    ny = ny || 10;

    this.binsizeX = (xmax-xmin) / nx;
    this.binsizeY = (ymax-ymin) / ny;
    this.nx = nx;
    this.ny = ny;
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
};
GridBroadphase.prototype = new Broadphase();

/**
 * Get a bin index given a world coordinate
 * @method getBinIndex
 * @param  {Number} x
 * @param  {Number} y
 * @return {Number} Integer index
 */
GridBroadphase.prototype.getBinIndex = function(x,y){
    var nx = this.nx,
        ny = this.ny,
        xmin = this.xmin,
        ymin = this.ymin,
        xmax = this.xmax,
        ymax = this.ymax;

    var xi = Math.floor(nx * (x - xmin) / (xmax-xmin));
    var yi = Math.floor(ny * (y - ymin) / (ymax-ymin));
    return xi*ny + yi;
}

/**
 * Get collision pairs.
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
GridBroadphase.prototype.getCollisionPairs = function(world){
    var result = [],
        collidingBodies = world.bodies,
        Ncolliding = Ncolliding=collidingBodies.length,
        binsizeX = this.binsizeX,
        binsizeY = this.binsizeY;

    var bins=[], Nbins=nx*ny;
    for(var i=0; i<Nbins; i++)
        bins.push([]);

    var xmult = nx / (xmax-xmin);
    var ymult = ny / (ymax-ymin);

    // Put all bodies into bins
    for(var i=0; i!==Ncolliding; i++){
        var bi = collidingBodies[i];
        var si = bi.shape;
        if (si === undefined) {
            continue;
        } else if(si instanceof Circle){
            // Put in bin
            // check if overlap with other bins
            var x = bi.position[0];
            var y = bi.position[1];
            var r = si.radius;

            var xi1 = Math.floor(xmult * (x-r - xmin));
            var yi1 = Math.floor(ymult * (y-r - ymin));
            var xi2 = Math.floor(xmult * (x+r - xmin));
            var yi2 = Math.floor(ymult * (y+r - ymin));

            for(var j=xi1; j<=xi2; j++){
                for(var k=yi1; k<=yi2; k++){
                    var xi = j;
                    var yi = k;
                    if(xi*(ny-1) + yi >= 0 && xi*(ny-1) + yi < Nbins)
                        bins[ xi*(ny-1) + yi ].push(bi);
                }
            }
        } else if(si instanceof Plane){
            // Put in all bins for now
            if(bi.angle == 0){
                var y = bi.position[1];
                for(var j=0; j!==Nbins && ymin+binsizeY*(j-1)<y; j++){
                    for(var k=0; k<nx; k++){
                        var xi = k;
                        var yi = Math.floor(ymult * (binsizeY*j - ymin));
                        bins[ xi*(ny-1) + yi ].push(bi);
                    }
                }
            } else if(bi.angle == Math.PI*0.5){
                var x = bi.position[0];
                for(var j=0; j!==Nbins && xmin+binsizeX*(j-1)<x; j++){
                    for(var k=0; k<ny; k++){
                        var yi = k;
                        var xi = Math.floor(xmult * (binsizeX*j - xmin));
                        bins[ xi*(ny-1) + yi ].push(bi);
                    }
                }
            } else {
                for(var j=0; j!==Nbins; j++)
                    bins[j].push(bi);
            }
        } else {
            throw new Error("Shape not supported in GridBroadphase!");
        }
    }

    // Check each bin
    for(var i=0; i!==Nbins; i++){
        var bin = bins[i];

        for(var j=0, NbodiesInBin=bin.length; j!==NbodiesInBin; j++){
            var bi = bin[j];
            var si = bi.shape;

            for(var k=0; k!==j; k++){
                var bj = bin[k];
                var sj = bj.shape;

                if(si instanceof Circle){
                         if(sj instanceof Circle)   c=Broadphase.circleCircle  (bi,bj);
                    else if(sj instanceof Particle) c=Broadphase.circleParticle(bi,bj);
                    else if(sj instanceof Plane)    c=Broadphase.circlePlane   (bi,bj);
                } else if(si instanceof Particle){
                         if(sj instanceof Circle)   c=Broadphase.circleParticle(bj,bi);
                } else if(si instanceof Plane){
                         if(sj instanceof Circle)   c=Broadphase.circlePlane   (bj,bi);
                }
            }
        }
    }
    return result;
};
