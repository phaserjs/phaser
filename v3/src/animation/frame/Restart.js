var Restart = function (includeDelay)
{
    if (includeDelay === undefined) { includeDelay = false; }

    this.currentAnim.getFirstTick(this, includeDelay);

    this.forward = true;
    this.isPlaying = true;
    this.pendingRepeat = false;

    this.prevTick = this.mainloop.lastFrameTimeMs;

    //  Set frame
    this.updateFrame(this.currentAnim.frames[0]);

    return this;
};

module.exports = Restart;
