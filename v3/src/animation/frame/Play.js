var Play = function (key, startFrame)
{
    if (startFrame === undefined) { startFrame = 0; }

    this.load(key, startFrame);

    //  Should give us 9,007,199,254,740,991 safe repeats
    this.repeatCounter = (this.repeat === -1) ? Number.MAX_SAFE_INTEGER : this.repeat;

    this.currentAnim.getFirstTick(this);

    this.forward = true;
    this.isPlaying = true;
    this.pendingRepeat = false;

    this.prevTick = this.mainloop.lastFrameTimeMs;

    return this.parent;
};

module.exports = Play;
