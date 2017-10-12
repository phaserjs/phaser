/**
 * [description]
 *
 * @method Phaser.Tweens.Tween#calcDuration
 * @since 3.0.0
 */
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

        if (tweenData.repeat === -1)
        {
            tweenData.totalDuration += (tweenData.t2 * 999999999999);
        }
        else if (tweenData.repeat > 0)
        {
            tweenData.totalDuration += (tweenData.t2 * tweenData.repeat);
        }

        if (tweenData.totalDuration > max)
        {
            //  Get the longest TweenData from the Tween, used to calculate the Tween TD
            max = tweenData.totalDuration;
        }
    }

    //  Excludes loop values
    this.duration = max;

    this.loopCounter = (this.loop === -1) ? 999999999999 : this.loop;

    if (this.loopCounter > 0)
    {
        this.totalDuration = this.duration + this.completeDelay + ((this.duration + this.loopDelay) * this.loopCounter);
    }
    else
    {
        this.totalDuration = this.duration + this.completeDelay;
    }
};

module.exports = CalcDuration;
