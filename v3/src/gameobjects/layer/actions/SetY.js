var SetY = function (value)
{
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        children[i].y = value;
    }

    return this;
};

module.exports = SetY;
