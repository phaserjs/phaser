/**
 * [description]
 *
 * @function Phaser.Math.Average
 * @since 3.0.0
 *
 * @param {number[]} values - [description]
 *
 * @return {number} [description]
 */
var Average = function (values)
{
    var sum = 0;

    for (var i = 0; i < values.length; i++)
    {
        sum += (+values[i]);
    }

    return sum / values.length;
};

module.exports = Average;
