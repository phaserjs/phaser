// var TWEEN_CONST = require('../const');

//  For now progress = 0 to 1
var Seek = function (toPosition)
{
    var data = this.data;

    for (var i = 0; i < this.totalData; i++)
    {
        //  This won't work with loop > 0 yet
        var ms = this.totalDuration * toPosition;

        var tweenData = data[i];
        var progress = 0;
        var elapsed = 0;

        if (ms <= tweenData.delay)
        {
            progress = 0;
            elapsed = 0;
        }
        else if (ms >= tweenData.totalDuration)
        {
            progress = 1;
            elapsed = tweenData.duration;
        }
        else if (ms > tweenData.delay && ms <= tweenData.t1)
        {
            //  Keep it zero bound
            ms = Math.max(0, ms - tweenData.delay);

            //  Somewhere in the first playthru range
            progress = ms / tweenData.t1;
            elapsed = tweenData.duration * progress;
        }
        else if (ms > tweenData.t1 && ms < tweenData.totalDuration)
        {
            //  Somewhere in repeat land
            ms -= tweenData.delay;
            ms -= tweenData.t1;

            var repeats = Math.floor(ms / tweenData.t2);

            //  remainder
            ms = ((ms / tweenData.t2) % 1) * tweenData.t2;

            if (ms > tweenData.repeatDelay)
            {
                progress = ms / tweenData.t1;
                elapsed = tweenData.duration * progress;
            }
        }

        tweenData.progress = progress;
        tweenData.elapsed = elapsed;

        var v = tweenData.ease(tweenData.progress);

        tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);

        // console.log(tweenData.key, 'Seek', tweenData.target[tweenData.key], 'to', tweenData.current, 'pro', tweenData.progress, 'marker', marker, progress);

        tweenData.target[tweenData.key] = tweenData.current;
    }
};

module.exports = Seek;
