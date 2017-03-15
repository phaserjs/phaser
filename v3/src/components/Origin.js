//  Origin Component
//  Values are given in pixels, not percent

var Origin = {

    originX: 0.5,
    originY: 0.5,

    //  READ ONLY
    displayOriginX: 0,
    displayOriginY: 0,

    setOrigin: function (x, y)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this.originX = x;
        this.originY = y;

        this.displayOriginX = x * this.width;
        this.displayOriginY = y * this.height;

        return this;
    },

    setOriginToCenter: function ()
    {
        this.setOrigin(0.5);
    }

};

module.exports = Origin;
