var TWEEN_CONST = require('../const');

//  For now progress = 0 to 1
//  Needs to be normalized with the total Tween duration, not the tweenData durations
var Seek = function (progress)
{
    var data = this.data;

    for (var i = 0; i < this.totalData; i++)
    {
        var tweenData = data[i];

        tweenData.progress = progress;

        tweenData.elapsed = tweenData.duration * progress;

        // var forward = (tweenData.state === TWEEN_CONST.PLAYING_FORWARD);
        var v;

        // if (forward)
        // {
            v = tweenData.ease(progress);
        // }
        // else
        // {
        //     v = tweenData.ease(1 - progress);
        // }

        tweenData.current = tweenData.start + ((tweenData.end - tweenData.start) * v);

        // console.log('Seek', tweenData.target[tweenData.key], 'to', tweenData.current);

        tweenData.target[tweenData.key] = tweenData.current;
    }
};

module.exports = Seek;
