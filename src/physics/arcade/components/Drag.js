var Drag = {

    setDrag: function (x, y)
    {
        this.body.drag.set(x, y);

        return this;
    },

    setDragX: function (value)
    {
        this.body.drag.x = value;

        return this;
    },

    setDragY: function (value)
    {
        this.body.drag.y = value;

        return this;
    }

};

module.exports = Drag;
