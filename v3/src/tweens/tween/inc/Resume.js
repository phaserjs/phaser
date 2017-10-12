var TWEEN_CONST = require('../const');

var Pause = function ()
{
    if (this.state === TWEEN_CONST.PAUSED)
    {
        this.paused = false;

        this.state = this._pausedState;
    }

    return this;
};

module.exports = Pause;
