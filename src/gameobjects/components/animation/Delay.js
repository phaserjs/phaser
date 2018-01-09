//  Gets or sets the amount of time in seconds between repeats.
//  For example, if repeat is 2 and repeatDelay is 1, the animation will play initially,
//  then wait for 1 second before it repeats, then play again, then wait 1 second again
//  before doing its final repeat.

var Delay = function (value)
{
    if (value === undefined)
    {
        return this._delay;
    }
    else
    {
        this._delay = value;

        return this;
    }
};

module.exports = Delay;
