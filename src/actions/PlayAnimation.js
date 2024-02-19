/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Play an animation on all Game Objects in the array that have an Animation component.
 *
 * You can pass either an animation key, or an animation configuration object for more control over the playback.
 *
 * @function Phaser.Actions.PlayAnimation
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
 * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
var PlayAnimation = function (items, key, ignoreIfPlaying)
{
    for (var i = 0; i < items.length; i++)
    {
        var gameObject = items[i];

        if (gameObject.anims)
        {
            gameObject.anims.play(key, ignoreIfPlaying);
        }
    }

    return items;
};

module.exports = PlayAnimation;
