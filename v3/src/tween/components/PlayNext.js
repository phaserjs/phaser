var TWEEN_CONST = require('../const');

var PlayNext = function ()
{
    //  This is the TweenData that has just completed playing
    var tweenData = this.currentTweenData;

    if (tweenData.next)
    {
        console.log('next');

        this.setCurrentTweenData(tweenData.next);
    }
    else if (this.loop)
    {
        console.log('loop', this.loopDelay);

        //  leaves the state in PENDING_RENDER
        this.setCurrentTweenData(this.data[0]);

        this.target[this.key] = this.currentTweenData.startValue;

        if (this.loopDelay > 0)
        {
            this.countdown = this.loopDelay;
            this.state = TWEEN_CONST.LOOP_DELAY;
        }
    }
    else if (this.completeDelay > 0)
    {
        console.log('completeDelay');

        this.countdown = this.completeDelay;
        this.state = TWEEN_CONST.COMPLETE_DELAY;
    }
    else
    {
        console.log('complete');

        this.state = TWEEN_CONST.PENDING_REMOVE;
    }
};

module.exports = PlayNext;
