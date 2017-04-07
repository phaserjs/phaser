var Yoyo = function (value)
{
    if (value === undefined)
    {
        return this._yoyo;
    }
    else
    {
        this._yoyo = value;

        return this;
    }
};

module.exports = Yoyo;
