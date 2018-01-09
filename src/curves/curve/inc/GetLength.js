// Get total curve arc length

/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getLength
 * @since 3.0.0
 *
 * @return {number} [description]
 */
var GetLength = function ()
{
    var lengths = this.getLengths();

    return lengths[lengths.length - 1];
};

module.exports = GetLength;
