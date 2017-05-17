var Start = function ()
{
    if (this.state !== 1)
    {
        return;
    }

    this.setCurrentTweenData(this.data[0]);
};

module.exports = Start;
