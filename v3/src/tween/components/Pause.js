var TWEEN_CONST = require('../const');

var Pause = function ()
{
    if (this.state === TWEEN_CONST.PAUSED)
    {
        return;
    }

    this.paused = true;

    this._pausedState = this.state;

    this.state = TWEEN_CONST.PAUSED;

    return this;
};

module.exports = Pause;
