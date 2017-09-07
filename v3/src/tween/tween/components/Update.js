var TWEEN_CONST = require('../const');
var UpdateTweenData = require('./UpdateTweenData');

//  Returns 'true' if this Tween has finished and should be removed from the Tween Manager
//  Otherwise, returns false
var Update = function (timestamp, delta)
{
    if (this.state === TWEEN_CONST.PAUSED)
    {
        return false;
    }

    if (this.useFrames)
    {
        delta = 1 * this.parent.timeScale;
    }

    delta *= this.timeScale;

    this.elapsed += delta;
    this.progress = Math.min(this.elapsed / this.duration, 1);

    this.totalElapsed += delta;
    this.totalProgress = Math.min(this.totalElapsed / this.totalDuration, 1);

    switch (this.state)
    {
        case TWEEN_CONST.ACTIVE:

            var stillRunning = false;

            for (var i = 0; i < this.totalData; i++)
            {
                if (UpdateTweenData(this, this.data[i], delta))
                {
                    stillRunning = true;
                }
            }

            //  Anything still running? If not, we're done
            if (!stillRunning)
            {
                this.nextState();
            }

            break;

        case TWEEN_CONST.LOOP_DELAY:

            this.countdown -= delta;

            if (this.countdown <= 0)
            {
                this.state = TWEEN_CONST.ACTIVE;
            }

            break;

        case TWEEN_CONST.OFFSET_DELAY:

            this.countdown -= delta;

            if (this.countdown <= 0)
            {
                var onStart = this.callbacks.onStart;

                if (onStart)
                {
                    onStart.params[1] = this.targets;

                    onStart.func.apply(onStart.scope, onStart.params);
                }

                this.state = TWEEN_CONST.ACTIVE;
            }

            break;

        case TWEEN_CONST.COMPLETE_DELAY:

            this.countdown -= delta;

            if (this.countdown <= 0)
            {
                var onComplete = this.callbacks.onComplete;

                if (onComplete)
                {
                    onComplete.func.apply(onComplete.scope, onComplete.params);
                }

                this.state = TWEEN_CONST.PENDING_REMOVE;
            }

            break;
    }

    return (this.state === TWEEN_CONST.PENDING_REMOVE);
};

module.exports = Update;
