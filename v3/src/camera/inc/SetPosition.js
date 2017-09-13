var SetPosition = function (x, y)
{
    if (y === undefined) { y = x; }

    this.x = x;
    this.y = y;

    return this;
};

module.exports = SetPosition;
