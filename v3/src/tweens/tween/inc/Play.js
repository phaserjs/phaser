var TWEEN_CONST = require('../const');

/**
 * [description]
 *
 * @method Phaser.Tweens.Tween#play
 * @since 3.0.0
 *
 * @param {boolean} resetFromTimeline - [description]
 */
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
        resetFromTimeline = true;
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
    }
    else
    {
        this.resetTweenData(resetFromTimeline);

        this.state = TWEEN_CONST.ACTIVE;

        if (onStart)
        {
            onStart.params[1] = this.targets;

            onStart.func.apply(onStart.scope, onStart.params);
        }
    }
};

module.exports = Play;
