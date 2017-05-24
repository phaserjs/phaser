var CalcTargetsValue = function (tweenData, v)
{
    // var targets = this.targets;
    var prop = tweenData.key;

    //  Targets array:
    //  0:
    //      ref: GameObject,
    //      keys: {
    //          x: {
    //              start,
    //              current,
    //              end,
    //              startCache,
    //              endCache
    //          },
    //          y: {
    //              start,
    //              current,
    //              end,
    //              startCache,
    //              endCache
    //          }
    //      }

    for (var i = 0; i < this.totalTargets; i++)
    {
        var target = this.targets[i];
        var entry = target.keys[prop];

        entry.current = entry.start + ((entry.end - entry.start) * v);

        target.ref[prop] = entry.current;
    }
};

module.exports = CalcTargetsValue;
