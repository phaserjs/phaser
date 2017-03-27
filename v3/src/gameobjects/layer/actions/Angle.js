var Angle = function (value)
{
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        children[i].angle += value;
    }

    return this;
};

module.exports = Angle;
