var Yoyo = function (value)
{
    if (value === undefined)
    {
        return this.yoyo;
    }
    else
    {
        this.yoyo = value;

        return this;
    }
};

module.exports = Yoyo;
