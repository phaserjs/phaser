//  Origin Component
//  Values are given in pixels, not percent

var Origin = {

    originX: 0,
    originY: 0,

    setOrigin: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.originX = x;
        this.originY = y;

        return this;
    },

    setOriginToCenter: function ()
    {
        this.originX = this.frame.centerX;
        this.originY = this.frame.centerY;
    }

};

module.exports = Origin;
