var SetCurrentTweenData = function (tween)
{
    tween.progress = 0;
    tween.elapsed = 0;

    tween.repeatCounter = (tween.repeat === -1) ? Number.MAX_SAFE_INTEGER : tween.repeat;

    if (tween.delay > 0)
    {
        tween.countdown = tween.delay;
        tween.state = 1;
    }
    else
    {
        tween.state = 2;
    }

    this.tween = tween;
};

module.exports = SetCurrentTweenData;
