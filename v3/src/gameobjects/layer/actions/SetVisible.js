var SetVisible = function (value)
{
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        children[i].visible = value;
    }

    return this;
};

module.exports = SetVisible;
