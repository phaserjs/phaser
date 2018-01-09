/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.CopyFrom
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} source - [description]
 * @param {Phaser.Geom.Rectangle} dest - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y, source.width, source.height);
};

module.exports = CopyFrom;
