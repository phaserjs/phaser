var Size = {

    setOffset: function (x, y)
    {
        this.body.setOffset(x, y);

        return this;
    },

    setSize: function (width, height, center)
    {
        this.body.setSize(width, height, center);

        return this;
    },

    setCircle: function (radius, offsetX, offsetY)
    {
        this.body.setCircle(radius, offsetX, offsetY);

        return this;
    }

};

module.exports = Size;
