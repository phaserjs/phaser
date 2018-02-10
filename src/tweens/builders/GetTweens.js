var GetValue = require('../../utils/object/GetValue');

/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetTweens
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {array} [description]
 */
var GetTweens = function (config)
{
    var tweens = GetValue(config, 'tweens', null);

    if (tweens === null)
    {
        return [];
    }
    else if (typeof tweens === 'function')
    {
        tweens = tweens.call();
    }

    if (!Array.isArray(tweens))
    {
        tweens = [ tweens ];
    }

    return tweens;
};

module.exports = GetTweens;
