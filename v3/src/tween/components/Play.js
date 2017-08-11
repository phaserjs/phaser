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

        return;
    }
    else
    {
        //  Reset the TweenData
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
