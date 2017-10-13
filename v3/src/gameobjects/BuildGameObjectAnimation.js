var GetAdvancedValue = require('../utils/object/GetAdvancedValue');

var BuildGameObjectAnimation = function (sprite, config)
{
    var animConfig = GetAdvancedValue(config, 'anims', null);

    if (animConfig === null)
    {
        return sprite;
    }

    if (typeof animConfig === 'object')
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

        var delay = GetAdvancedValue(animConfig, 'delay', 0);
        var repeat = GetAdvancedValue(animConfig, 'repeat', 0);
        var repeatDelay = GetAdvancedValue(animConfig, 'repeatDelay', 0);
        var yoyo = GetAdvancedValue(animConfig, 'yoyo', false);
        
        var play = GetAdvancedValue(animConfig, 'play', false);
        var delayedPlay = GetAdvancedValue(animConfig, 'delayedPlay', 0);

        anims.delay(delay);
        anims.repeat(repeat);
        anims.repeatDelay(repeatDelay);
        anims.yoyo(yoyo);

        if (play)
        {
            anims.play(key, startFrame);
        }
        else if (delayedPlay > 0)
        {
            anims.delayedPlay(delayedPlay, key, startFrame);
        }
        else
        {
            anims.load(key);
        }
    }
    else
    {
        //  { anims: 'key' }
        sprite.anims.play(animConfig);
    }

    return sprite;
};

module.exports = BuildGameObjectAnimation;
