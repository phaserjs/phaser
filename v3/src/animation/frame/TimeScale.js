var TimeScale = function (value)
{
    if (value === undefined)
    {
        return this._timeScale;
    }
    else
    {
        this._timeScale = value;

        return this;
    }
};

module.exports = TimeScale;
