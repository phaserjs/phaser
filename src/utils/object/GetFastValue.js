//  Source object
//  The key as a string, can only be 1 level deep (no periods), must exist at the top level of the source object
//  The default value to use if the key doesn't exist

/**
 * [description]
 *
 * @function Phaser.Utils.Object.GetFastValue
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string} key - [description]
 * @param {any} defaultValue - [description]
 *
 * @return {any} [description]
 */
var GetFastValue = function (source, key, defaultValue)
{
    var t = typeof(source);

    if (!source || t === 'number' || t === 'string')
    {
        return defaultValue;
    }
    else if (source.hasOwnProperty(key) && source[key] !== undefined)
    {
        return source[key];
    }
    else
    {
        return defaultValue;
    }
};

module.exports = GetFastValue;
