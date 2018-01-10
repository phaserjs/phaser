var Point = require('./Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} source - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Clone = function (source)
{
    return new Point(source.x, source.y);
};

module.exports = Clone;
