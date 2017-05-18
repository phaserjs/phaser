var TWEEN_CONST = require('../const');

//  Was PLAYING_FORWARD and has hit the end
var SetStateFromEnd = function (tween, tweenData)
{
    if (tweenData.yoyo)
    {
        //  Playing forward and we have a yoyo

        tweenData.elapsed = 0;
        tweenData.progress = 0;

        return TWEEN_CONST.PLAYING_BACKWARD;
    }
    else if (tweenData.repeatCounter > 0)
    {
        tweenData.repeatCounter--;

        tweenData.elapsed = 0;
        tweenData.progress = 0;

        //  Delay?
        if (tweenData.repeatDelay > 0)
        {
            tweenData.elapsed = tweenData.repeatDelay;

            tween.resetTargetsValue(tweenData);

            return TWEEN_CONST.REPEAT_DELAY;
        }
        else
        {
            return TWEEN_CONST.PLAYING_FORWARD;
        }
    }

    return TWEEN_CONST.COMPLETE;
};

//  Was PLAYING_BACKWARD and has hit the start
var SetStateFromStart = function (tween, tweenData)
{
    if (tweenData.repeatCounter > 0)
    {
        tweenData.repeatCounter--;

        tweenData.elapsed = 0;
        tweenData.progress = 0;

        //  Delay?
        if (tweenData.repeatDelay > 0)
        {
            tweenData.elapsed = tweenData.repeatDelay;

            tween.resetTargetsValue(tweenData);

            return TWEEN_CONST.REPEAT_DELAY;
        }
        else
        {
            return TWEEN_CONST.PLAYING_FORWARD;
        }
    }

    return TWEEN_CONST.COMPLETE;
};

//  Delta is either a value in ms, or 1 if Tween.useFrames is true
var UpdateTweenData = function (tween, tweenData, delta)
{
    switch (tweenData.state)
    {
        case TWEEN_CONST.PLAYING_FORWARD:
        case TWEEN_CONST.PLAYING_BACKWARD:

            var elapsed = tweenData.elapsed;
            var duration = tweenData.duration;

            elapsed += delta;

            if (elapsed > duration)
            {
                elapsed = duration;
            }

            var forward = (tweenData.state === TWEEN_CONST.PLAYING_FORWARD);
            var progress = elapsed / duration;
            var v;

            if (forward)
            {
                v = tweenData.ease(progress);
            }
            else
            {
                v = tweenData.ease(1 - progress);
            }

            tween.calcTargetsValue(tweenData, v);

            tweenData.elapsed = elapsed;
            tweenData.progress = progress;

            if (progress === 1)
            {
                if (forward)
                {
                    //  Do we hold?
                    if (tweenData.hold > 0)
                    {
                        tweenData.elapsed = tweenData.hold;

                        tweenData.state = TWEEN_CONST.HOLD;
                    }
                    else
                    {
                        tweenData.state = SetStateFromEnd(tween, tweenData);
                    }
                }
                else
                {
                    tweenData.state = SetStateFromStart(tween, tweenData);
                }
            }

            break;

        case TWEEN_CONST.DELAY:

            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                //  TODO - Move elapsed block below switch statement
                //  so that calls to render and play happen this frame, not the next one?
                tweenData.elapsed = 0;
                tweenData.state = TWEEN_CONST.PENDING_RENDER;
            }

            break;

        case TWEEN_CONST.REPEAT_DELAY:

            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                tweenData.elapsed = 0;
                tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
            }

            break;

        case TWEEN_CONST.HOLD:

            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                tweenData.state = SetStateFromEnd(tween, tweenData);
            }

            break;

        case TWEEN_CONST.PENDING_RENDER:

            tween.loadValues(tweenData);

            tweenData.state = TWEEN_CONST.PLAYING_FORWARD;

            break;
    }

    return (tweenData.state === TWEEN_CONST.COMPLETE);
};

module.exports = UpdateTweenData;
