//  compare = Object:
//  {
//      scaleX: 0.5,
//      scaleY: 1
//  }

var GetFirst = function (items, compare, index)
{
    for (var i = index; i < items.length; i++)
    {
        var item = items[i];

        var match = true;

        for (var property in compare)
        {
            if (item[property] !== compare[property])
            {
                match = false;
            }
        }

        if (match)
        {
            return item;
        }
    }

    return null;
};

module.exports = GetFirst;
