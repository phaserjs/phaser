/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Factorial = require('./Factorial');

/**
 * Calculates a Bernstein basis polynomial coefficient, used as a weighting factor
 * in Bezier curve calculations. The result is the binomial coefficient n! / (i! * (n - i)!),
 * which determines how much influence control point `i` has on a degree-`n` Bezier curve.
 *
 * @function Phaser.Math.Bernstein
 * @since 3.0.0
 *
 * @param {number} n - The degree of the Bernstein polynomial.
 * @param {number} i - The index of the basis function.
 *
 * @return {number} The Bernstein basis coefficient: Factorial(n) / Factorial(i) / Factorial(n - i).
 */
var Bernstein = function (n, i)
{
    return Factorial(n) / Factorial(i) / Factorial(n - i);
};

module.exports = Bernstein;
