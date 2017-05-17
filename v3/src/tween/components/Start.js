var Start = function ()
{
    if (this.state !== 1)
    {
        return;
    }

    this.setCurrentTweenData(0);

    this.loadValues();
};

module.exports = Start;
