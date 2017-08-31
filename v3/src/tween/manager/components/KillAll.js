var KillAll = function ()
{
    var tweens = this.getAllTweens();

    for (var i = 0; i < tweens.length; i++)
    {
        tweens[i].stop();
    }

    return this;
};

module.exports = KillAll;
