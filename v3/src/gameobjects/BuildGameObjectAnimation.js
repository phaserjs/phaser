var GetAdvancedValue = require('../utils/object/GetAdvancedValue');

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
        //              startFrame: [string|integer]
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
        var startFrame = GetAdvancedValue(animConfig, 'startFrame', undefined);

        anims.load(key);

        var delay = GetAdvancedValue(animConfig, 'delay', 0);
        var repeat = GetAdvancedValue(animConfig, 'repeat', 0);
        var repeatDelay = GetAdvancedValue(animConfig, 'repeatDelay', 0);
        var yoyo = GetAdvancedValue(animConfig, 'yoyo', false);

        anims.delay(delay);
        anims.repeat(repeat);
        anims.repeatDelay(repeatDelay);
        anims.yoyo(yoyo);

        if (GetAdvancedValue(animConfig, 'play', false))
        {
            anims.play(key, startFrame);
        }
        else
        {
            var d = GetAdvancedValue(animConfig, 'delayedPlay', 0);

            if (d > 0)
            {
                anims.delayedPlay(d, key, startFrame);
            }
        }
    }

    return sprite;
};

module.exports = BuildGameObjectAnimation;
