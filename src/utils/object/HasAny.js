var HasAny = function (source, keys)
{
    for (var i = 0; i < keys.length; i++)
    {
        if (source.hasOwnProperty(keys[i]))
        {
            return true;
        }
    }

    return false;
};

module.exports = HasAny;
