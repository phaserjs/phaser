var DelayedPlay = function (delay, key, startFrame)
{
    this.play(key, true, startFrame);

    this.nextTick += (delay * 1000);

    return this;
};

module.exports = DelayedPlay;
