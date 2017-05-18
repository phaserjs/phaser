//  Calculate the start and end values
//  Store them in the TweenData
//  and also place them into the TweenTarget properties

var LoadValues = function (tweenData)
{
    var targets = this.targets;
    var key = tweenData.key;

    for (var i = 0; i < this.totalTargets; i++)
    {
        var target = targets[i];
        var entry = target.keys[key];

        if (tweenData.startValue === null)
        {
            entry.start = target.ref[key];
            entry.end = tweenData.value(entry.start);

            tweenData.startValue = entry.start;
            tweenData.endValue = entry.end;
        }
        else
        {
            entry.start = tweenData.startValue;
            entry.end = tweenData.endValue;

            target.ref[key] = entry.start;
        }

        entry.current = entry.start;
    }
};

module.exports = LoadValues;
