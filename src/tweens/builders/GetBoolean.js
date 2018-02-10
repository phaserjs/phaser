/**
 * [description]
 *
 * @function Phaser.Tweens.Builders.GetBoolean
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string} key - [description]
 * @param {any} defaultValue - [description]
 *
 * @return {any} [description]
 */
var GetBoolean = function (source, key, defaultValue)
{
    if (!source)
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key))
    {
        return source[key];
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetBoolean;
