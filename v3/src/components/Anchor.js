var Anchor = function (x, y)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = x; }

    this.x = x;
    this.y = y;
};

Anchor.prototype.constructor = Anchor;

Anchor.prototype = {

    getX: function ()
    {
        return this.x;
    },

    getY: function ()
    {
        return this.y;
    },

    set: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;
    },

    setX: function (value)
    {
        this.x = value;
    },

    setY: function (value)
    {
        this.y = value;
    }

};

module.exports = Anchor;
