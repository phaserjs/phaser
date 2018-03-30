/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Easing.Sine.Out
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var Out = function (v)
{
    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        return Math.sin(v * Math.PI / 2);
    }
};

module.exports = Out;
