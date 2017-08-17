var Offset = {

    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.body.size.x = Math.round(width);
        this.body.size.y = Math.round(height);

        return this;
    },

    setOffset: function (x, y, width, height)
    {
        this.body.offset.x = x;
        this.body.offset.y = y;

        if (width)
        {
            this.setSize(width, height);
        }

        return this;
    }

};

module.exports = Offset;
