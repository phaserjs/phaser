module.exports = Equation;

/**
 * Base class for constraint equations.
 * @class Equation
 * @constructor
 * @param {Body} bi First body participating in the equation
 * @param {Body} bj Second body participating in the equation
 * @param {number} minForce Minimum force to apply. Default: -1e6
 * @param {number} maxForce Maximum force to apply. Default: 1e6
 */
function Equation(bi,bj,minForce,maxForce){

    /**
     * Minimum force to apply when solving
     * @property minForce
     * @type {Number}
     */
    this.minForce = typeof(minForce)=="undefined" ? -1e6 : minForce;

    /**
     * Max force to apply when solving
     * @property maxForce
     * @type {Number}
     */
    this.maxForce = typeof(maxForce)=="undefined" ? 1e6 : maxForce;

    /**
     * First body participating in the constraint
     * @property bi
     * @type {Body}
     */
    this.bi = bi;

    /**
     * Second body participating in the constraint
     * @property bj
     * @type {Body}
     */
    this.bj = bj;

    /**
     * The stiffness of this equation. Typically chosen to a large number (~1e7), but can be chosen somewhat freely to get a stable simulation.
     * @property stiffness
     * @type {Number}
     */
    this.stiffness = 1e6;

    /**
     * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = 4;

    this.a = 0;
    this.b = 0;
    this.eps = 0;
    this.h = 0;
    this.updateSpookParams(1/60);
};
Equation.prototype.constructor = Equation;

/**
 * Update SPOOK parameters .a, .b and .eps according to the given time step. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
 * @method updateSpookParams
 * @param  {number} timeStep
 */
Equation.prototype.updateSpookParams = function(timeStep){
    var k = this.stiffness,
        d = this.relaxation,
        h = timeStep;
    this.a = 4.0 / (h * (1 + 4 * d));
    this.b = (4.0 * d) / (1 + 4 * d);
    this.eps = 4.0 / (h * h * k * (1 + 4 * d));
    this.h = timeStep;
};
