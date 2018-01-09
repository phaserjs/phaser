/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.CopyFrom
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} source - [description]
 * @param {Phaser.Geom.Ellipse} dest - [description]
 *
 * @return {Phaser.Geom.Ellipse} [description]
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y, source.width, source.height);
};

module.exports = CopyFrom;
