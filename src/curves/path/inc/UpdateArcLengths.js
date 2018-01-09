// cacheLengths must be recalculated.

/**
 * [description]
 *
 * @method Phaser.Curves.Path#updateArcLengths
 * @since 3.0.0
 */
var UpdateArcLengths = function ()
{
    this.cacheLengths = [];

    this.getCurveLengths();
};

module.exports = UpdateArcLengths;
