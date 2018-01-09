/**
 * [description]
 *
 * @function Phaser.Geom.Line.CopyFrom
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} source - [description]
 * @param {Phaser.Geom.Line} dest - [description]
 *
 * @return {Phaser.Geom.Line} [description]
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x1, source.y1, source.x2, source.y2);
};

module.exports = CopyFrom;
