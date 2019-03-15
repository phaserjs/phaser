/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks if two rectangle bodies are intersecting, either with or without the optional padding.
 *
 * @function Phaser.Physics.Arcade.IntersectsRect
 * @since 3.17.0
 *
 * @param {Phaser.Physics.Arcade.Body} body1 - The first Body to separate.
 * @param {Phaser.Physics.Arcade.Body} body2 - The second Body to separate.
 * @param {number} [padding] - 
 *
 * @return {boolean} 
 */
var IntersectsRect = function (body1, body2, padding)
{
    if (padding === undefined) { padding = 0; }

    if (padding === 0)
    {
        return !(
            body1.right <= body2.x ||
            body1.bottom <= body2.y ||
            body1.x >= body2.right ||
            body1.y >= body2.bottom
        );
    }
    else
    {
        //  Rect vs. Rect with extra padding for touching / blocked checks
        var b1r = body1.right + padding;
        var b1b = body1.bottom + padding;
        var b1x = body1.x - padding;
        var b1y = body1.y - padding;

        var b2r = body2.right + padding;
        var b2b = body2.bottom + padding;
        var b2x = body2.x - padding;
        var b2y = body2.y - padding;

        return !(
            b1r <= b2x ||
            b1b <= b2y ||
            b1x >= b2r ||
            b1y >= b2b
        );
    }
};

module.exports = IntersectsRect;
