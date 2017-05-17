//  Merge with Backwards and include in update?
var Forward = function (parent, tween, delta)
{
    var elapsed = tween.elapsed;
    var duration = tween.duration;

    elapsed += (parent.useFrames) ? 1 : delta;

    if (elapsed > duration)
    {
        elapsed = duration;
    }

    var progress = elapsed / duration;

    var p = tween.ease(progress);

    //  Optimize
    parent.current = parent.start + ((parent.end - parent.start) * p);

    parent.target[parent.key] = parent.current;

    tween.elapsed = elapsed;
    tween.progress = progress;

    if (progress === 1)
    {
        //  Tween has reached end
        //  Do we yoyo or repeat?

        tween.state = ProcessRepeat(parent, tween);
    }
};

var Backward = function (parent, tween, delta)
{
    var elapsed = tween.elapsed;
    var duration = tween.duration;

    elapsed += (parent.useFrames) ? 1 : delta;

    if (elapsed > duration)
    {
        elapsed = duration;
    }

    var progress = elapsed / duration;

    var p = tween.ease(1 - progress);

    //  Optimize
    parent.current = parent.start + ((parent.end - parent.start) * p);

    parent.target[parent.key] = parent.current;

    tween.elapsed = elapsed;
    tween.progress = progress;

    if (progress === 1)
    {
        //  Tween has reached start
        //  Do we yoyo or repeat?

        tween.state = ProcessRepeat(parent, tween);
    }
};

var ProcessRepeat = function (parent, tween)
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
        parent.current = parent.start;

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

var UpdateTweenData = function (parent, tween, timestep, delta)
{
    if (tween.state === 2)
    {
        //  Waiting for delay to expire
        tween.countdown -= (parent.useFrames) ? 1 : delta;

        if (tween.countdown <= 0)
        {
            tween.state = 3;
        }
    }

    if (tween.state === 3)
    {
        //  Playing forwards
        Forward(parent, tween, delta);
    }
    else if (tween.state === 4)
    {
        //  Playing backwards
        Backward(parent, tween, delta);
    }

    //  Complete?
    return (tween.state === 5);
};

module.exports = UpdateTweenData;
