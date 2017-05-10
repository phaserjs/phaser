//  Creates a new Object using all values from obj1 and obj2.
//  If a value exists in both obj1 and obj2, the value in obj1 is used.

var Clone = require('./Clone');

var Merge = function (obj1, obj2)
{
    var clone = Clone(obj1);

    for (var key in obj2)
    {
        if (!clone.hasOwnProperty(key))
        {
            clone[key] = obj2[key];
        }
    }

    return clone;
};

module.exports = Merge;
