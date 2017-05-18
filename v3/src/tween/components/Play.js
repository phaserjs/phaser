var TWEEN_CONST = require('../const');

var Play = function ()
{
    if (this.state === TWEEN_CONST.ACTIVE)
    {
        return;
    }

    if (this.paused)
    {
        this.paused = false;
    
        this.manager.makeActive(this);
    }
    else
    {
        //  Reset the TweenData
        this.resetTweenData();

        if (this.startDelay > 0)
        {
            this.countdown = this.startDelay;
            this.state = TWEEN_CONST.START_DELAY;
        }
        else
        {
            this.state = TWEEN_CONST.ACTIVE;
        }
    }
};

module.exports = Play;
