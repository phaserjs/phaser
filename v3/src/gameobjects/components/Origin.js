//  Origin Component
//  Values are normalized, given in the range 0 to 1.
//  Display values contain the calculated pixel values.

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

        return this.updateOrigin();
    },

    setDisplayOrigin: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.displayOriginX = x;
        this.displayOriginY = y;

        this.originX = this.width / x;
        this.originY = this.height / y;

        return this;
    },

    updateOrigin: function ()
    {
        this.displayOriginX = Math.round(this.originX * this.width);
        this.displayOriginY = Math.round(this.originY * this.height);

        return this;
    }

};

module.exports = Origin;
