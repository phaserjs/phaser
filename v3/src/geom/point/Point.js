var Point = function (x, y)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = x; }

    this.x = x;

    this.y = y;
};

Point.prototype.constructor = Point;

Point.prototype = {

    setTo: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

};

module.exports = Point;
