/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Play an animation with the given key, starting at the given startFrame on all Game Objects in items.
 *
 * @function Phaser.Actions.PlayAnimation
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {string} key - The name of the animation to play.
 * @param {(string|number)} [startFrame] - The starting frame of the animation with the given key.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlayAnimation = function (items, key, startFrame)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].anims.play(key, startFrame);
    }

    return items;
};

module.exports = PlayAnimation;
