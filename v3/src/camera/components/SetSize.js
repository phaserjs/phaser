var SetSize = function (width, height)
{
    if (height === undefined) { height = width; }

    this.width = width;
    this.height = height;

    return this;
};

module.exports = SetSize;
