/**
 * [description]
 *
 * @function Phaser.Math.Factorial
 * @since 3.0.0
 *
 * @param {number} value - [description]
 *
 * @return {number} [description]
 */
var Factorial = function (value)
{
    if (value === 0)
    {
        return 1;
    }

    var res = value;

    while (--value)
    {
        res *= value;
    }

    return res;
};

module.exports = Factorial;
