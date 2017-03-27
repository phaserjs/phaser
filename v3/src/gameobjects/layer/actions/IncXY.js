var IncXY = function (x, y)
{
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        children[i].x += x;
        children[i].y += y;
    }

    return this;
};

module.exports = IncXY;
