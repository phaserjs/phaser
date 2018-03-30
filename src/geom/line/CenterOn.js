/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */


/**
 * [description]
 *
 * @function Phaser.Geom.Line.CenterOn
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Line} [description]
 */
var CenterOn = function (line, x, y)
{
    var tx = x - ((line.x1 + line.x2) / 2);
    var ty = y - ((line.y1 + line.y2) / 2);

    line.x1 += tx;
    line.y1 += ty;

    line.x2 += tx;
    line.y2 += ty;

    return line;
};

module.exports = CenterOn;
