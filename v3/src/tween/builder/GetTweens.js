var GetValue = require('../../utils/object/GetValue');

var GetTweens = function (config)
{
    var tweens = GetValue(config, 'tweens', null);

    if (typeof tweens === 'function')
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
