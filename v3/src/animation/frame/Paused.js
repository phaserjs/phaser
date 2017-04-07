var Paused = function (value)
{
    if (value !== undefined)
    {
        //  Setter
        if (value)
        {
            return this.pause();
        }
        else
        {
            return this.resume();
        }
    }
    else
    {
        return this._paused;
    }
};

module.exports = Paused;
