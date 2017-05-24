var CalcDuration = function ()
{
    var max = 0;

    var data = this.data;

    //  Duration is derived from:
    //  TweenData.duration
    //  TweenData.delay
    //  TweenData.hold
    //  x TweenData.repeat

    for (var i = 0; i < this.totalData; i++)
    {
        var tweenData = data[i];

        var total = tweenData.delay;

        var single = tweenData.duration;

        if (tweenData.yoyo)
        {
            single *= 2;
        }

        single += tweenData.hold;

        var totalRepeats = (tweenData.repeat === -1) ? Number.MAX_SAFE_INTEGER : tweenData.repeat;

        single += single * totalRepeats;

        single += tweenData.repeatDelay * totalRepeats;

        total += single;

        if (total > max)
        {
            max = total;
        }
    }

    return max;
};

module.exports = CalcDuration;
