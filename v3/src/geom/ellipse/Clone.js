var Ellipse = require('./Ellipse');

/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.Clone
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} source - [description]
 *
 * @return {Phaser.Geom.Ellipse} [description]
 */
var Clone = function (source)
{
    return new Ellipse(source.x, source.y, source.width, source.height);
};

module.exports = Clone;
