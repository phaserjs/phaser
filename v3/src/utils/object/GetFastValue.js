//  Source object
//  The key as a string, can only be 1 level deep (no periods), must exist at the top level of the source object
//  The default value to use if the key doesn't exist

var GetFastValue = function (source, key, defaultValue)
{
    if (!source || typeof source === 'number')
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

module.exports = GetFastValue;
