var TWEEN_CONST = require('../const');

//  TweenData has reached the end. Now it needs to decide what action to take.
//  It can either hold, yoyo, repeat or complete.
var ProcessRepeat = function (tween, tweenData, skipHold)
{
    //  Do we hold?
    if (tweenData.hold > 0 && skipHold === false)
    {
        tweenData.elapsed = tweenData.hold;

        return TWEEN_CONST.HOLD;
    }
    else if (tweenData.yoyo && tweenData.state === TWEEN_CONST.PLAYING_FORWARD)
    {
        //  Playing forward and we have a yoyo

        tweenData.elapsed = 0;
        tweenData.progress = 0;

        return TWEEN_CONST.PLAYING_BACKWARD;
    }
    else if (tweenData.repeatCounter > 0)
    {
        //  No hold or yoyo, but we do have a repeat
        tweenData.repeatCounter--;

        //  Reset the elapsed
        tween.current = tween.start;

        tweenData.elapsed = 0;
        tweenData.progress = 0;

        //  Delay?
        if (tweenData.repeatDelay > 0)
        {
            tweenData.elapsed = tweenData.repeatDelay;

            tween.target[tween.key] = tween.current;

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
var UpdateTweenData = function (tween, tweenData, timestep, delta)
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

            var progress = elapsed / duration;
            var v;

            if (tweenData.state === TWEEN_CONST.PLAYING_BACKWARD)
            {
                v = tweenData.ease(1 - progress);
            }
            else
            {
                v = tweenData.ease(progress);
            }

            tween.current = tween.start + ((tween.end - tween.start) * v);

            tween.target[tween.key] = tween.current;

            tweenData.elapsed = elapsed;
            tweenData.progress = progress;

            if (progress === 1)
            {
                tweenData.state = ProcessRepeat(tween, tweenData, false);
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
                tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
                tweenData.state = ProcessRepeat(tween, tweenData, true);
            }

            break;

        case TWEEN_CONST.PENDING_RENDER:

            tween.loadValues();
            tweenData.state = TWEEN_CONST.PLAYING_FORWARD;

            break;
    }

    return (tweenData.state === TWEEN_CONST.COMPLETE);
};

module.exports = UpdateTweenData;
