var TWEEN_CONST = require('../const');

//  Return true if this Tween should be moved from the pending list to the active list
var Init = function ()
{
    if (this.paused)
    {
        this.state = TWEEN_CONST.PAUSED;

        return false;
    }
    else
    {
        return true;
    }
};

module.exports = Init;
