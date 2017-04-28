var Restart = function (includeDelay)
{
    if (includeDelay === undefined) { includeDelay = false; }

    this.currentAnim.getFirstTick(this, includeDelay);

    this.forward = true;
    this.isPlaying = true;
    this.pendingRepeat = false;

    //  Set frame
    this.updateFrame(this.currentAnim.frames[0]);

    return this;
};

module.exports = Restart;
