/**
 * [description]
 *
 * @function Phaser.Geom.Point.CopyFrom
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} source - [description]
 * @param {Phaser.Geom.Point} dest - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y);
};

module.exports = CopyFrom;
