var PreRender = function ()
{
    var width = this.width;
    var height = this.height;
    var zoom = this.zoom;
    var matrix = this.matrix;
    var originX = width / 2;
    var originY = height / 2;
    var follow = this._follow;

    if (follow !== null)
    {
        originX = follow.x;
        originY = follow.y;
        
        this.scrollX = originX - width * 0.5;
        this.scrollY = originY - height * 0.5;
    }

    if (this.useBounds)
    {
        var bounds = this._bounds;
        var boundsX = bounds.x;
        var boundsY = bounds.y;
        var boundsR = Math.max(bounds.right - width, width);
        var boundsB = Math.max(bounds.bottom - height, height);

        if (this.scrollX < boundsX)
        {
            this.scrollX = boundsX;
        }
        else if (this.scrollX > boundsR)
        {
            this.scrollX = boundsR;
        }

        if (this.scrollY < boundsY)
        {
            this.scrollY = boundsY;
        }
        else if (this.scrollY > boundsB)
        {
            this.scrollY = boundsB;
        }
    }

    if (this.roundPixels)
    {
        this.scrollX = Math.round(this.scrollX);
        this.scrollY = Math.round(this.scrollY);
    }

    matrix.loadIdentity();
    matrix.translate(this.x + originX, this.y + originY);
    matrix.rotate(this.rotation);
    matrix.scale(zoom, zoom);
    matrix.translate(-originX, -originY);
    matrix.translate(this._shakeOffsetX, this._shakeOffsetY);
};

module.exports = PreRender;
