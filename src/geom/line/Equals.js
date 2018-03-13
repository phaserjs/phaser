/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Line.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {Phaser.Geom.Line} toCompare - [description]
 *
 * @return {boolean} [description]
 */
var Equals = function (line, toCompare)
{
    return (
        line.x1 === toCompare.x1 &&
        line.y1 === toCompare.y1 &&
        line.x2 === toCompare.x2 &&
        line.y2 === toCompare.y2
    );
};

module.exports = Equals;
