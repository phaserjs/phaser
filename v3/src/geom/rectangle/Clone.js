var Rectangle = require('./Rectangle');

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} source - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var Clone = function (source)
{
    return new Rectangle(source.x, source.y, source.width, source.height);
};

module.exports = Clone;
