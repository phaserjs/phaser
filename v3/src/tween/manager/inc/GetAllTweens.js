var GetAllTweens = function ()
{
    var list = this._active;
    var output = [];

    for (var i = 0; i < list.length; i++)
    {
        output.push(list[i]);
    }

    return output;
};

module.exports = GetAllTweens;
