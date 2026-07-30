/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Either sets or creates the Arcade Body Collision object.
 *
 * Sets the `none` property to the value of `noneFlip`. When `noneFlip` is `false`, all four
 * directional flags (`up`, `down`, `left`, `right`) are set to `true`, indicating collision
 * on all sides. When `noneFlip` is `true`, all directional flags are set to `false`.
 *
 * Mostly only used internally.
 *
 * @function Phaser.Physics.Arcade.SetCollisionObject
 * @since 3.70.0
 *
 * @param {boolean} noneFlip - The value to assign to the `none` property. When `false`, all directional collision flags are enabled.
 * @param {Phaser.Types.Physics.Arcade.ArcadeBodyCollision} [data] - The collision data object to populate, or create if not given.
 *
 * @return {Phaser.Types.Physics.Arcade.ArcadeBodyCollision} The collision data.
 */
var SetCollisionObject = function (noneFlip, data)
{
    if (data === undefined) { data = {}; }

    data.none = noneFlip;
    data.up = false;
    data.down = false;
    data.left = false;
    data.right = false;

    if (!noneFlip)
    {
        data.up = true;
        data.down = true;
        data.left = true;
        data.right = true;
    }

    return data;
};

module.exports = SetCollisionObject;
