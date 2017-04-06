var DelayedPlay = function (delay, key, startFrame)
{
    this.play(key, startFrame);

    this.nextTick += (delay * 1000);

    return this;
};

module.exports = DelayedPlay;
