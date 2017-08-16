var Offset = {

    setOffset: function (x, y, width, height)
    {
        this.body.offset.x = x;
        this.body.offset.y = y;

        if (width)
        {
            this.body.size.x = width;
            this.body.size.y = (height) ? height : width;
        }

        return this;
    }

};

module.exports = Offset;
