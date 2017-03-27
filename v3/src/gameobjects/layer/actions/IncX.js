var IncX = function (value)
{
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        children[i].x += value;
    }

    return this;
};

module.exports = IncX;
