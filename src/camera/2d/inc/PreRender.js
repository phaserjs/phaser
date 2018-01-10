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

        var bw = Math.max(0, bounds.right - width);
        var bh = Math.max(0, bounds.bottom - height);

        if (this.scrollX < bounds.x)
        {
            this.scrollX = bounds.x;
        }
        else if (this.scrollX > bw)
        {
            this.scrollX = bw;
        }

        if (this.scrollY < bounds.y)
        {
            this.scrollY = bounds.y;
        }
        else if (this.scrollY > bh)
        {
            this.scrollY = bh;
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
