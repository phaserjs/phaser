var Size = {

    setSize: function (width, height, offsetX, offsetY)
    {
        this.body.setSize(width, height, offsetX, offsetY);

        return this;
    },

    setCircle: function (radius, offsetX, offsetY)
    {
        this.body.setCircle(radius, offsetX, offsetY);

        return this;
    }

};

module.exports = Size;
