var TWEEN_CONST = require('../const');

var ResetTweenData = function (resetFromLoop)
{
    var data = this.data;

    for (var i = 0; i < this.totalData; i++)
    {
        var tweenData = data[i];

        tweenData.progress = 0;
        tweenData.elapsed = 0;

        tweenData.repeatCounter = (tweenData.repeat === -1) ? 999999999999 : tweenData.repeat;

        if (resetFromLoop)
        {
            var onRefresh = this.callbacks.onRefresh;

            if (onRefresh)
            {
                tweenData.start = onRefresh.func.call(onRefresh.scope, tweenData.target, tweenData.key, tweenData.start, true);
            }

            tweenData.current = tweenData.start;

            tweenData.end = tweenData.value(tweenData.start, tweenData.target, tweenData.key);

            tweenData.state = TWEEN_CONST.PLAYING_FORWARD;
        }
        else if (tweenData.delay > 0)
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
