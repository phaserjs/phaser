// var TWEEN_CONST = require('../const');

//  For now progress = 0 to 1
var Seek = function (progress)
{
    var marker = this.totalDuration * progress;

    var data = this.data;

    //  Now works on multi-property tweens with varying durations, but doesn't yet factor in delays
    for (var i = 0; i < this.totalData; i++)
    {
        var tweenData = data[i];

        if (marker >= tweenData.duration)
        {
            tweenData.progress = 1;
            tweenData.elapsed = tweenData.duration;
        }
        else
        {
            tweenData.progress = marker / tweenData.duration;
            tweenData.elapsed = marker;
        }

        var v = tweenData.ease(tweenData.progress);

        tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);

        // console.log(tweenData.key, 'Seek', tweenData.target[tweenData.key], 'to', tweenData.current, 'pro', tweenData.progress, 'marker', marker, progress);

        tweenData.target[tweenData.key] = tweenData.current;
    }
};

module.exports = Seek;
