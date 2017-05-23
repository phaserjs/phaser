var TWEEN_CONST = require('../const');

var ResetTweenData = function ()
{
    for (var key in this.data)
    {
        var tweenData = this.data[key];

        tweenData.progress = 0;
        tweenData.elapsed = 0;

        tweenData.repeatCounter = (tweenData.repeat === -1) ? Number.MAX_SAFE_INTEGER : tweenData.repeat;

        if (tweenData.delay > 0)
        {
            tweenData.elapsed = tweenData.delay;
            tweenData.state = TWEEN_CONST.DELAY;
        }
        else
        {
            tweenData.state = TWEEN_CONST.PENDING_RENDER;
        }
    }
};

module.exports = ResetTweenData;
