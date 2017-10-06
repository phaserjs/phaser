/**
 * [description]
 *
 * @function Phaser.Math.IsEven
 * @since 3.0.0
 *
 * @param {number} value - [description]
 *
 * @return {boolean} [description]
 */
var IsEven = function (value)
{
    // Use abstract equality == for "is number" test
    return (value == parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEven;
