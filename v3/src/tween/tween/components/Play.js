var TWEEN_CONST = require('../const');

var Play = function (resetFromTimeline)
{
    if (this.state === TWEEN_CONST.ACTIVE)
    {
        return;
    }
    else if (this.state === TWEEN_CONST.PENDING_REMOVE || this.state === TWEEN_CONST.REMOVED)
    {
        this.init();
        this.parent.makeActive(this);
    }

    var onStart = this.callbacks.onStart;

    if (this.parentIsTimeline)
    {
        this.resetTweenData(resetFromTimeline);

        if (this.calculatedOffset === 0)
        {
            if (onStart)
            {
                onStart.params[1] = this.targets;

                onStart.func.apply(onStart.scope, onStart.params);
            }

            this.state = TWEEN_CONST.ACTIVE;
        }
        else
        {
            this.countdown = this.calculatedOffset;

            this.state = TWEEN_CONST.OFFSET_DELAY;
        }
    }
    else if (this.paused)
    {
        this.paused = false;
    
        this.parent.makeActive(this);

        return;
    }
    else
    {
        this.resetTweenData(false);

        this.state = TWEEN_CONST.ACTIVE;

        if (onStart)
        {
            onStart.params[1] = this.targets;

            onStart.func.apply(onStart.scope, onStart.params);
        }
    }
};

module.exports = Play;
