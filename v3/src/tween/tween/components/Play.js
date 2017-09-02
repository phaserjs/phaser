var TWEEN_CONST = require('../const');

var Play = function (resetFromTimeline)
{
    if (this.state === TWEEN_CONST.ACTIVE)
    {
        return;
    }

    if (this.timeline)
    {
        this.resetTweenData(resetFromTimeline);

        if (this.calculatedOffset === 0)
        {
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
    
        this.manager.makeActive(this);

        return;
    }
    else
    {
        this.resetTweenData();

        this.state = TWEEN_CONST.ACTIVE;
    }

    var onStart = this.callbacks.onStart;

    if (onStart)
    {
        onStart.func.apply(onStart.scope, onStart.params);
    }
};

module.exports = Play;
