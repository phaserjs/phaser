var Play = function (key, startFrame)
{
    if (startFrame === undefined) { startFrame = 0; }

    this.load(key, startFrame);

    //  Should give us 9,007,199,254,740,991 safe repeats
    this.repeatCounter = (this._repeat === -1) ? Number.MAX_SAFE_INTEGER : this._repeat;

    this.currentAnim.getFirstTick(this);

    this.forward = true;
    this.isPlaying = true;
    this.pendingRepeat = false;

    this.prevTick = this.mainloop.lastFrameTimeMs;

    if (currentAnim.showOnStart)
    {
        this.parent.visible = true;
    }

    return this;
};

module.exports = Play;
