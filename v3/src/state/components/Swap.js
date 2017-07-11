var Swap = function (from, to)
{
    this.sleep(from);

    if (this.isSleeping(to))
    {
        this.wake(to);
    }
    else
    {
        this.start(to);
    }
};

module.exports = Swap;
