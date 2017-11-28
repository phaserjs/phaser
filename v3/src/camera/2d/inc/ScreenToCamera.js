var ScreenToCamera = function (x, y, pointOut)
{
    this.matrix.transformPoint(x, y, pointOut);

    //  Add in the scroll offset
    pointOut.x += this.scrollX;
    pointOut.y += this.scrollY;

    return pointOut;
};

module.exports = ScreenToCamera;
