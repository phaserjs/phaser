var SetScroll = function (x, y)
{
    if (y === undefined) { y = x; }

    this.scrollX = x;
    this.scrollY = y;

    return this;
};

module.exports = SetScroll;
