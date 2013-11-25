var vec2 = require('../math/vec2'),
    Solver = require('./Solver');

module.exports = GSSolver;

var ARRAY_TYPE = Float32Array || Array;

/**
 * Iterative Gauss-Seidel constraint equation solver.
 *
 * @class GSSolver
 * @constructor
 * @extends Solver
 * @param {Object} [options]
 * @param {Number} options.iterations
 * @param {Number} options.timeStep
 * @param {Number} options.stiffness
 * @param {Number} options.relaxation
 * @param {Number} options.tolerance
 */
function GSSolver(options){
    Solver.call(this);
    options = options || {};
    this.iterations = options.iterations || 10;
    this.tolerance = options.tolerance || 0;
    this.debug = options.debug || false;
    this.arrayStep = 30;
    this.lambda = new ARRAY_TYPE(this.arrayStep);
    this.Bs =     new ARRAY_TYPE(this.arrayStep);
    this.invCs =  new ARRAY_TYPE(this.arrayStep);

    /**
    * Whether to use .stiffness and .relaxation parameters from the Solver instead of each Equation individually.
    * @type {Boolean}
    * @property useGlobalEquationParameters
    */
    this.useGlobalEquationParameters = true;

    /**
    * Global equation stiffness.
    * @property stiffness
    * @type {Number}
    */
    this.stiffness = 1e6;

    /**
    * Global equation relaxation.
    * @property relaxation
    * @type {Number}
    */
    this.relaxation = 4;

    /**
    * Set to true to set all right hand side terms to zero when solving. Can be handy for a few applications.
    * @property useZeroRHS
    * @type {Boolean}
    */
    this.useZeroRHS = false;
};
GSSolver.prototype = new Solver();

/**
 * Set stiffness parameters
 *
 * @method setSpookParams
 * @param  {number} k
 * @param  {number} d
 * @deprecated
 */
GSSolver.prototype.setSpookParams = function(k,d){
    this.stiffness = k;
    this.relaxation = d;
};

/**
 * Solve the system of equations
 * @method solve
 * @param  {Number}  dt       Time step
 * @param  {World}   world    World to solve
 */
GSSolver.prototype.solve = function(dt,world){
    var iter = 0,
        maxIter = this.iterations,
        tolSquared = this.tolerance*this.tolerance,
        equations = this.equations,
        Neq = equations.length,
        bodies = world.bodies,
        Nbodies = world.bodies.length,
        h = dt,
        d = this.relaxation,
        k = this.stiffness,
        eps = 4.0 / (h * h * k * (1 + 4 * d)),
        a = 4.0 / (h * (1 + 4 * d)),
        b = (4.0 * d) / (1 + 4 * d),
        useGlobalParams = this.useGlobalEquationParameters,
        add = vec2.add,
        set = vec2.set,
        useZeroRHS = this.useZeroRHS;

    // Things that does not change during iteration can be computed once
    if(this.lambda.length < Neq){
        this.lambda = new ARRAY_TYPE(Neq + this.arrayStep);
        this.Bs =     new ARRAY_TYPE(Neq + this.arrayStep);
        this.invCs =  new ARRAY_TYPE(Neq + this.arrayStep);
    }
    var invCs = this.invCs,
        Bs = this.Bs,
        lambda = this.lambda;
    for(var i=0; i!==Neq; i++){
        var c = equations[i];
        lambda[i] = 0.0;

        var _a = a,
            _b = b,
            _eps = eps;
        if(!useGlobalParams){
            if(h !== c.h) c.updateSpookParams(h);
            _a = c.a;
            _b = c.b;
            _eps = c.eps;
        }
        Bs[i] = c.computeB(_a,_b,h);
        invCs[i] = 1.0 / c.computeC(_eps);
    }

    var q, B, c, invC, deltalambda, deltalambdaTot, GWlambda, lambdaj;

    if(Neq !== 0){
        var i,j, minForce, maxForce, lambdaj_plus_deltalambda;

        // Reset vlambda
        for(i=0; i!==Nbodies; i++){
            var b=bodies[i], vlambda=b.vlambda;
            set(vlambda,0,0);
            b.wlambda = 0;
        }

        // Iterate over equations
        for(iter=0; iter!==maxIter; iter++){

            // Accumulate the total error for each iteration.
            deltalambdaTot = 0.0;

            for(j=0; j!==Neq; j++){

                c = equations[j];

                var _eps = useGlobalParams ? eps : c.eps;

                // Compute iteration
                maxForce = c.maxForce;
                minForce = c.minForce;

                B = Bs[j];
                invC = invCs[j];
                lambdaj = lambda[j];
                GWlambda = c.computeGWlambda(_eps);

                if(useZeroRHS) B = 0;

                deltalambda = invC * ( B - GWlambda - _eps * lambdaj );

                // Clamp if we are not within the min/max interval
                lambdaj_plus_deltalambda = lambdaj + deltalambda;
                if(lambdaj_plus_deltalambda < minForce){
                    deltalambda = minForce - lambdaj;
                } else if(lambdaj_plus_deltalambda > maxForce){
                    deltalambda = maxForce - lambdaj;
                }
                lambda[j] += deltalambda;

                deltalambdaTot += Math.abs(deltalambda);

                c.addToWlambda(deltalambda);
            }

            // If the total error is small enough - stop iterate
            if(deltalambdaTot*deltalambdaTot <= tolSquared) break;
        }

        // Add result to velocity
        for(i=0; i!==Nbodies; i++){
            var b=bodies[i], v=b.velocity;
            add( v, v, b.vlambda);
            b.angularVelocity += b.wlambda;
        }
    }
    errorTot = deltalambdaTot;
};

