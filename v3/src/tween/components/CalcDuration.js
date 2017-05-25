var CalcDuration = function ()
{
    var max = 0;

    var data = this.data;

    for (var i = 0; i < this.totalData; i++)
    {
        var tweenData = data[i];

        //  Set t1 (duration + hold + yoyo)
        tweenData.t1 = tweenData.duration + tweenData.hold;

        if (tweenData.yoyo)
        {
            tweenData.t1 += tweenData.duration;
        }

        //  Set t2 (repeatDelay + duration + hold + yoyo)
        tweenData.t2 = tweenData.t1 + tweenData.repeatDelay;

        //  Total Duration
        tweenData.totalDuration = tweenData.delay + tweenData.t1;

        tweenData.totalDuration += tweenData.t2 * (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;

        if (tweenData.totalDuration > max)
        {
            max = tweenData.totalDuration;
        }
    }

    //  Excludes loop values
    this.duration = max;

    this.loopCounter = (this.loop === -1) ? 999999999999 : this.loop;

    this.totalDuration = ((this.duration + this.loopDelay) * this.loopCounter) + this.completeDelay;
};

module.exports = CalcDuration;
