/**
* Checks if two values are within the given tolerance of each other.
*
* @param {number} a - The first number to check
* @param {number} b - The second number to check
* @param {number} tolerance - The tolerance. Anything equal to or less than this is considered within the range.
* @return {boolean} True if a is <= tolerance of b.
*/
var Within = function (a, b, tolerance)
{
    return (Math.abs(a - b) <= tolerance);
};

module.exports = Within;
