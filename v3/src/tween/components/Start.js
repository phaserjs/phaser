var TWEEN_CONST = require('../const');

var Start = function ()
{
    if (this.state === TWEEN_CONST.ACTIVE)
    {
        return;
    }

    this.state = TWEEN_CONST.ACTIVE;

    this.setCurrentTweenData(this.data[0]);
};

module.exports = Start;
