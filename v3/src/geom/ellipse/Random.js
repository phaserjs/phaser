var Point = require('../point/Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Ellipse.Random
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var Random = function (ellipse, out)
{
    if (out === undefined) { out = new Point(); }

    var p = Math.random() * Math.PI * 2;
    var s = Math.sqrt(Math.random());

    out.x = ellipse.x + ((s * Math.cos(p)) * ellipse.width / 2);
    out.y = ellipse.y + ((s * Math.sin(p)) * ellipse.height / 2);

    return out;
};

module.exports = Random;
