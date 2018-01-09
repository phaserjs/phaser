var Circle = require('./Circle');

/**
 * [description]
 *
 * @function Phaser.Geom.Circle.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} source - The Circle to be cloned.
 *
 * @return {Phaser.Geom.Circle} A clone of the source Circle.
 */
var Clone = function (source)
{
    return new Circle(source.x, source.y, source.radius);
};

module.exports = Clone;
