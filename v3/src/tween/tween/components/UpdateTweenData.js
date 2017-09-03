var TWEEN_CONST = require('../const');

var SetStateFromEnd = function (tween, tweenData)
{
    if (tweenData.yoyo)
    {
        //  Playing forward and we have a yoyo

        tweenData.progress = 0;
        tweenData.elapsed = 0;

        if (tweenData.flipX)
        {
            tweenData.target.toggleFlipX();
        }

        //  Problem: The flip and callback and so on gets called for every TweenData that triggers it at the same time.
        //  If you're tweening several properties it can fire for all of them, at once.

        if (tweenData.flipY)
        {
            tweenData.target.toggleFlipY();
        }

        var onYoyo = tween.callbacks.onYoyo;

        if (onYoyo)
        {
            //  Element 1 is reserved for the target of the yoyo (and needs setting here)
            onYoyo.params[1] = tweenData.target;

            onYoyo.func.apply(onYoyo.scope, onYoyo.params);
        }

        return TWEEN_CONST.PLAYING_BACKWARD;
    }
    else if (tweenData.repeatCounter > 0)
    {
        tweenData.repeatCounter--;

        tweenData.elapsed = 0;
        tweenData.progress = 0;

        if (tweenData.flipX)
        {
            tweenData.target.toggleFlipX();
        }

        if (tweenData.flipY)
        {
            tweenData.target.toggleFlipY();
        }

        //  Reset the destination value, in case it's dynamic
        tweenData.end = tweenData.value(tweenData.startCache);

        var onRepeat = tween.callbacks.onRepeat;

        if (onRepeat)
        {
            //  Element 1 is reserved for the target of the repeat (and needs setting here)
            onRepeat.params[1] = tweenData.target;

            onRepeat.func.apply(onRepeat.scope, onRepeat.params);
        }

        //  Delay?
        if (tweenData.repeatDelay > 0)
        {
            tweenData.elapsed = tweenData.repeatDelay;

            tweenData.current = tweenData.start;

            tweenData.target[tweenData.key] = tweenData.current;

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

        if (tweenData.flipX)
        {
            tweenData.target.toggleFlipX();
        }

        if (tweenData.flipY)
        {
            tweenData.target.toggleFlipY();
        }

        //  Reset the destination value, in case it's dynamic
        tweenData.end = tweenData.value(tweenData.startCache);

        var onRepeat = tween.callbacks.onRepeat;

        if (onRepeat)
        {
            //  Element 1 is reserved for the target of the repeat (and needs setting here)
            onRepeat.params[1] = tweenData.target;

            onRepeat.func.apply(onRepeat.scope, onRepeat.params);
        }

        //  Delay?
        if (tweenData.repeatDelay > 0)
        {
            tweenData.elapsed = tweenData.repeatDelay;

            tweenData.current = tweenData.start;

            tweenData.target[tweenData.key] = tweenData.current;

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

            tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);

            tweenData.target[tweenData.key] = tweenData.current;

            tweenData.elapsed = elapsed;
            tweenData.progress = progress;

            var onUpdate = tween.callbacks.onUpdate;

            if (onUpdate)
            {
                onUpdate.func.apply(onUpdate.scope, onUpdate.params);
            }

            if (progress === 1)
            {
                if (forward)
                {
                    if (tweenData.hold > 0)
                    {
                        tweenData.elapsed = tweenData.hold;

                        tweenData.state = TWEEN_CONST.HOLD_DELAY;
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
                tweenData.elapsed = Math.abs(tweenData.elapsed);

                tweenData.state = TWEEN_CONST.PENDING_RENDER;
            }

            break;

        case TWEEN_CONST.REPEAT_DELAY:

            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                tweenData.elapsed = Math.abs(tweenData.elapsed);
                tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
            }

            break;

        case TWEEN_CONST.HOLD_DELAY:

            tweenData.elapsed -= delta;

            if (tweenData.elapsed <= 0)
            {
                tweenData.state = SetStateFromEnd(tween, tweenData);
            }

            break;

        case TWEEN_CONST.PENDING_RENDER:

            //  Swap for function
            tweenData.start = tweenData.target[tweenData.key];

            tweenData.current = tweenData.start;
            tweenData.end = tweenData.value(tweenData.start);
            
            tweenData.startCache = tweenData.start;

            tweenData.target[tweenData.key] = tweenData.current;

            tweenData.state = TWEEN_CONST.PLAYING_FORWARD;

            break;
    }

    //  Return TRUE if this TweenData still playing, otherwise return FALSE
    return (tweenData.state !== TWEEN_CONST.COMPLETE);
};

module.exports = UpdateTweenData;
