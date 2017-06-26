var ScrollFactor = {

    scrollFactorX: 1.0,
    scrollFactorY: 1.0,

    setScrollFactor: function (x, y)
    {
        if (x === undefined) { x = y; }

        this.scrollFactorX = x;
        this.scrollFactorY = y;

        return this;
    }

};

module.exports = ScrollFactor;
