/**
 * [description]
 *
 * @function Phaser.Math.IsEvenStrict
 * @since 3.0.0
 *
 * @param {number} value - [description]
 *
 * @return {boolean} [description]
 */
var IsEvenStrict = function (value)
{
    // Use strict equality === for "is number" test
    return (value === parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEvenStrict;
