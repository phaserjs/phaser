var ScrollFactor = {

    scrollFactorX: 1,
    scrollFactorY: 1,

    setScrollFactor: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.scrollFactorX = x;
        this.scrollFactorY = y;

        return this;
    }

};

module.exports = ScrollFactor;
