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

        /*
            The function below is called to get the END value of the TweenData
            bob.x is read to get the START/CACHE value and never read again

            targets: bob,
            x: function () { return 700; },
            onRefresh: function (target, key, previousValue, startOfTween) { return target[key]; },
            ease: 'Sine.easeInOut',
            duration: 2000

         */

        if (resetFromLoop)
        {
            var onRefresh = tween.callbacks.onRefresh;

            if (onRefresh)
            {
                tweenData.startCache = onRefresh.func.call(onRefresh.scope, tweenData.target, tweenData.key, tweenData.startCache, true);
            }

            tweenData.start = tweenData.startCache;

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
