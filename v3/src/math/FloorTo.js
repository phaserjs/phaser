/**
 * [description]
 *
 * @function Phaser.Math.FloorTo
 * @since 3.0.0
 *
 * @param {number} value - [description]
 * @param {integer} [place=0 - [description]
 * @param {integer} [base=10] - [description]
 *
 * @return {number} [description]
 */
var FloorTo = function (value, place, base)
{
    if (place === undefined) { place = 0; }
    if (base === undefined) { base = 10; }

    var p = Math.pow(base, -place);

    return Math.floor(value * p) / p;
};

module.exports = FloorTo;
