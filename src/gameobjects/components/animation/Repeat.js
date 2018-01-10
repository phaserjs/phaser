//  Gets or sets the number of times that the animation should repeat
//  after its first iteration. For example, if repeat is 1, the animation will
//  play a total of twice (the initial play plus 1 repeat).
//  To repeat indefinitely, use -1. repeat should always be an integer.

var Repeat = function (value)
{
    if (value === undefined)
    {
        return this._repeat;
    }
    else
    {
        this._repeat = value;
        this.repeatCounter = 0;

        return this;
    }
};

module.exports = Repeat;
