//  Single Target or an Array of targets
var KillTweensOf = function (target)
{
    var tweens = this.getTweensOf(target);

    for (var i = 0; i < tweens.length; i++)
    {
        tweens[i].stop();
    }

    return this;
};

module.exports = KillTweensOf;
