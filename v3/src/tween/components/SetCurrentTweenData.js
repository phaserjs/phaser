var SetCurrentTweenData = function (index)
{
    var tween = this.data[index];

    tween.repeatCounter = (tween.loop) ? Number.MAX_SAFE_INTEGER : tween.repeat;

    if (tween.delay > 0)
    {
        tween.countdown = tween.delay;
        tween.state = 2;
    }
    else
    {
        tween.state = 3;
    }

    this.tween = tween;
};

module.exports = SetCurrentTweenData;
