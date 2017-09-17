var SetBounds = function (x, y, width, height)
{
    this._bounds.setTo(x, y, width, height);

    this.useBounds = true;

    return this;
};

module.exports = SetBounds;
