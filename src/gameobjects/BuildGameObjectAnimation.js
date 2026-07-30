/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetAdvancedValue = require('../utils/object/GetAdvancedValue');

/**
 * Reads the `anims` property from a Game Object configuration object and uses it to
 * configure the animation state of the given Sprite. If the `anims` property is absent,
 * the Sprite is returned unchanged.
 *
 * The `anims` value may be either a string or an object. If it is a string, it is treated
 * as an animation key and the animation is played immediately. If it is an object, the
 * animation key and playback options (such as `delay`, `repeat`, `yoyo`, and `startFrame`)
 * are read from it. Depending on the `play` and `delayedPlay` properties, the animation
 * will be played immediately, played after a delay, or simply loaded ready to play later.
 *
 * @function Phaser.GameObjects.BuildGameObjectAnimation
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Sprite} sprite - The Sprite whose animation state will be configured.
 * @param {object} config - The Game Object configuration object. The `anims` property of this object is used to configure the animation.
 *
 * @return {Phaser.GameObjects.Sprite} The updated Sprite.
 */
var BuildGameObjectAnimation = function (sprite, config)
{
    var animConfig = GetAdvancedValue(config, 'anims', null);

    if (animConfig === null)
    {
        return sprite;
    }

    if (typeof animConfig === 'string')
    {
        //  { anims: 'key' }
        sprite.anims.play(animConfig);
    }
    else if (typeof animConfig === 'object')
    {
        //  { anims: {
        //              key: string
        //              startFrame: [string|number]
        //              delay: [float]
        //              repeat: [integer]
        //              repeatDelay: [float]
        //              yoyo: [boolean]
        //              play: [boolean]
        //              delayedPlay: [boolean]
        //           }
        //  }

        var anims = sprite.anims;

        var key = GetAdvancedValue(animConfig, 'key', undefined);

        if (key)
        {
            var startFrame = GetAdvancedValue(animConfig, 'startFrame', undefined);

            var delay = GetAdvancedValue(animConfig, 'delay', 0);
            var repeat = GetAdvancedValue(animConfig, 'repeat', 0);
            var repeatDelay = GetAdvancedValue(animConfig, 'repeatDelay', 0);
            var yoyo = GetAdvancedValue(animConfig, 'yoyo', false);

            var play = GetAdvancedValue(animConfig, 'play', false);
            var delayedPlay = GetAdvancedValue(animConfig, 'delayedPlay', 0);

            var playConfig = {
                key: key,
                delay: delay,
                repeat: repeat,
                repeatDelay: repeatDelay,
                yoyo: yoyo,
                startFrame: startFrame
            };

            if (play)
            {
                anims.play(playConfig);
            }
            else if (delayedPlay > 0)
            {
                anims.playAfterDelay(playConfig, delayedPlay);
            }
            else
            {
                anims.load(playConfig);
            }
        }
    }

    return sprite;
};

module.exports = BuildGameObjectAnimation;
