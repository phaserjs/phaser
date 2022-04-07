/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetAdvancedValue = require('../utils/object/GetAdvancedValue');

/**
 * Adds an Animation component to a Sprite and populates it based on the given config.
 *
 * @function Phaser.GameObjects.BuildGameObjectAnimation
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Sprite} sprite - The sprite to add an Animation component to.
 * @param {object} config - The animation config.
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
