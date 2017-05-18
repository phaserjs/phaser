var TWEEN_CONST = require('../const');

var NextTweenData = function (prop)
{
    //  This is the TweenData that has just completed playing
    var tweenData = prop.current;

    if (tweenData.next)
    {
        this.setCurrentTweenData(prop, tweenData.next);
    }
    else if (this.loop)
    {
        //  leaves the state in PENDING_RENDER
        this.setCurrentTweenData(prop, prop.list[0]);

        this.resetTargetsValue(prop.current);

        if (this.loopDelay > 0)
        {
            this.countdown = this.loopDelay;
            this.state = TWEEN_CONST.LOOP_DELAY;
        }
    }
    else if (this.completeDelay > 0)
    {
        this.countdown = this.completeDelay;
        this.state = TWEEN_CONST.COMPLETE_DELAY;
    }
    else
    {
        this.state = TWEEN_CONST.PENDING_REMOVE;
    }
};

module.exports = NextTweenData;
