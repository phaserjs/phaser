var CalcDuration = function ()
{
    var total = 0;

    for (var key in this.data)
    {
        var prop = this.data[key];

        for (var i = 0; i < prop.list.length; i++)
        {
            // var tweenData = prop.list[i];

            //  Duration is derived from:
            //  TweenData.duration
            //  TweenData.delay
            //  TweenData.hold
            //  x TweenData.repeat
        }
    }

    return total;
};

module.exports = CalcDuration;
