var TWEEN_CONST = require('../const');

var NextState = function ()
{
    if (this.loopCounter > 0)
    {
        this.resetTweenData(true);

        this.elapsed = 0;
        this.progress = 0;
        this.loopCounter--;

        var onLoop = this.callbacks.onLoop;

        if (onLoop)
        {
            onLoop.func.apply(onLoop.scope, onLoop.params);
        }

        if (this.loopDelay > 0)
        {
            this.countdown = this.loopDelay;
            this.state = TWEEN_CONST.LOOP_DELAY;
        }
        else
        {
            this.state = TWEEN_CONST.ACTIVE;
        }
    }
    else if (this.completeDelay > 0)
    {
        this.countdown = this.completeDelay;
        this.state = TWEEN_CONST.COMPLETE_DELAY;
    }
    else
    {
        var onComplete = this.callbacks.onComplete;

        if (onComplete)
        {
            onComplete.func.apply(onComplete.scope, onComplete.params);
        }

        this.state = TWEEN_CONST.PENDING_REMOVE;
    }
};

module.exports = NextState;
