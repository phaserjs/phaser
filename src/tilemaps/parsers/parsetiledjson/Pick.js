var HasValue = require('../../../../utils/object/HasValue');

var pick = function (object, keys)
{
    var obj = {};

    for (var i = 0; i < keys.length; i++)
    {
        var key = keys[i];
        if (HasValue(object, key))
        {
            obj[key] = object[key];
        }
    }

    return obj;
};

module.exports = pick;
