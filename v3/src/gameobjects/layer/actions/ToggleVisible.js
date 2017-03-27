var ToggleVisible = function ()
{
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        children[i].visible = !children[i].visible;
    }

    return this;
};

module.exports = ToggleVisible;
