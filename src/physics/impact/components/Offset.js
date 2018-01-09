var Offset = {

    setOffset: function (x, y, width, height)
    {
        this.body.offset.x = x;
        this.body.offset.y = y;

        if (width)
        {
            this.setBodySize(width, height);
        }

        return this;
    }

};

module.exports = Offset;
