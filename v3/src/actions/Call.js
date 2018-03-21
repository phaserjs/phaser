var Call = function (items, callback, thisArg)
{
    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        callback.call(thisArg, item);
    }

    return items;
};

module.exports = Call;
