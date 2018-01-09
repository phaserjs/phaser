var HasAll = function (source, keys)
{
    for (var i = 0; i < keys.length; i++)
    {
        if (!source.hasOwnProperty(keys[i]))
        {
            return false;
        }
    }

    return true;
};

module.exports = HasAll;
