var Factorial = require('./Factorial');

/**
 * [description]
 *
 * @function Phaser.Math.Bernstein
 * @since 3.0.0
 *
 * @param {number} n - [description]
 * @param {number} i - [description]
 *
 * @return {number} [description]
 */
var Bernstein = function (n, i)
{
    return Factorial(n) / Factorial(i) / Factorial(n - i);
};

module.exports = Bernstein;
