//  Creates a new Object using all values from obj1.
//  
//  Then scans obj2. If a property is found in obj2 that *also* exists in obj1,
//  the value from obj2 is used, otherwise the property is skipped.

var Clone = require('./Clone');

var MergeRight = function (obj1, obj2)
{
    var clone = Clone(obj1);

    for (var key in obj2)
    {
        if (clone.hasOwnProperty(key))
        {
            clone[key] = obj2[key];
        }
    }

    return clone;
};

module.exports = MergeRight;
