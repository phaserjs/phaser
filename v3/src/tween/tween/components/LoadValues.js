//  Calculate the start and end values and store them into the TweenTarget objects

var LoadValues = function (tweenData)
{
    var targets = this.targets;
    var prop = tweenData.key;

    // console.log('--> LoadValues', prop);

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
        var keys = targets[i].keys;
        var entry = keys[prop];
        var gameObject = targets[i].ref;

        if (entry.startCache === null)
        {
            entry.start = gameObject[prop];
            entry.current = entry.start;
            entry.end = tweenData.value(entry.start);

            //  Cache the start and end values so we only do this once (needed?)
            entry.startCache = entry.start;
            entry.endCache = entry.end;
        }
        else
        {
            entry.start = entry.startCache;
            entry.current = entry.start;
            entry.end = entry.endCache;

            gameObject[prop] = entry.start;
        }

        // console.log('target', gameObject.name, 'key', prop, 'start', entry.start, 'end', entry.end);
    }
};

module.exports = LoadValues;
