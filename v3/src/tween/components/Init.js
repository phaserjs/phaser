var TWEEN_CONST = require('../const');

//  Return true if this Tween should be moved from the pending list to the active list
var Init = function ()
{
    var data = this.data;
    var totalTargets = this.totalTargets;

    for (var i = 0; i < this.totalData; i++)
    {
        var tweenData = data[i];
        var target = tweenData.target;
        var gen = tweenData.gen;

        tweenData.delay = gen.delay(i, totalTargets, target);
        tweenData.duration = gen.duration(i, totalTargets, target);
        tweenData.hold = gen.hold(i, totalTargets, target);
        tweenData.repeat = gen.repeat(i, totalTargets, target);
        tweenData.repeatDelay = gen.repeatDelay(i, totalTargets, target);
    }

    this.totalDuration = this.calcDuration();

    console.log('Tween totalDuration', this.totalDuration);

    if (this.paused)
    {
        this.state = TWEEN_CONST.PAUSED;

        return false;
    }
    else
    {
        return true;
    }
};

module.exports = Init;
