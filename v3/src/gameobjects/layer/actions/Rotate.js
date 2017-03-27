var Rotate = function (value)
{
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        children[i].rotation += value;
    }

    return this;
};

module.exports = Rotate;
