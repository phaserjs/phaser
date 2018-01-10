/**
 * [description]
 *
 * @method Phaser.Curves.Path#getLength
 * @since 3.0.0
 *
 * @return {number} [description]
 */
var GetLength = function ()
{
    var lens = this.getCurveLengths();

    return lens[lens.length - 1];
};

module.exports = GetLength;
