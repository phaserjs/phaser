var Start = function ()
{
    if (this.state !== 1)
    {
        return;
    }

    this.loadValues();

    if (this.delay > 0)
    {
        this.countdown = this.delay;
        this.state = 2;
    }
};

module.exports = Start;
