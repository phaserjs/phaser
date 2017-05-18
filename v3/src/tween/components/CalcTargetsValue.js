var CalcTargetsValue = function (tweenData, v)
{
    var targets = this.targets;
    var key = tweenData.key;

    for (var i = 0; i < this.totalTargets; i++)
    {
        var target = targets[i];
        var entry = target.keys[key];

        entry.current = entry.start + ((entry.end - entry.start) * v);

        target.ref[key] = entry.current;
    }
};

module.exports = CalcTargetsValue;
