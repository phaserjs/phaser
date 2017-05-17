//  Merge with Backwards and include in update?
var Forward = function (tween, delta)
{
    var elapsed = tween.elapsed;
    var duration = tween.duration;

    elapsed += (this.useFrames) ? 1 : delta;

    if (elapsed > duration)
    {
        elapsed = duration;
    }

    var progress = elapsed / duration;

    var p = tween.ease(progress);

    //  Optimize
    this.current = this.start + ((this.end - this.start) * p);

    this.target[this.key] = this.current;

    tween.elapsed = elapsed;
    tween.progress = progress;

    if (progress === 1)
    {
        //  Tween has reached end
        //  Do we yoyo or repeat?

        tween.state = ProcessRepeat(tween);
    }
};

var Backward = function (tween, delta)
{
    var elapsed = tween.elapsed;
    var duration = tween.duration;

    elapsed += (this.useFrames) ? 1 : delta;

    if (elapsed > duration)
    {
        elapsed = duration;
    }

    var progress = elapsed / duration;

    var p = tween.ease(1 - progress);

    //  Optimize
    this.current = this.start + ((this.end - this.start) * p);

    this.target[this.key] = this.current;

    tween.elapsed = elapsed;
    tween.progress = progress;

    if (progress === 1)
    {
        //  Tween has reached start
        //  Do we yoyo or repeat?

        tween.state = ProcessRepeat(tween);
    }
};

var ProcessRepeat = function (tween)
{
    //  Playing forward, and Yoyo is enabled?
    if (tween.state === 3 && tween.yoyo)
    {
        //  Play backwards
        tween.elapsed = 0;
        tween.progress = 0;

        return 4;
    }
    else if (tween.repeatCounter > 0)
    {
        tween.repeatCounter--;

        //  Reset the elapsed
        this.current = this.start;
        tween.elapsed = 0;
        tween.progress = 0;

        //  Delay?
        if (tween.repeatDelay > 0)
        {
            tween.countdown = tween.repeatDelay;

            return 2;
        }
        else
        {
            return 3;
        }
    }

    return 5;
};

var UpdateTweenData = function (tween, timestep, delta)
{
    if (tween.state === 2)
    {
        //  Waiting for delay to expire
        tween.countdown -= (this.useFrames) ? 1 : delta;

        if (tween.countdown <= 0)
        {
            tween.state = 3;
        }
    }

    if (tween.state === 3)
    {
        //  Playing forwards
        Forward(tween, delta);
    }
    else if (tween.state === 4)
    {
        //  Playing backwards
        Backward(tween, delta);
    }

    //  Complete?
    return (tween.state !== 5);
};

module.exports = UpdateTweenData;
