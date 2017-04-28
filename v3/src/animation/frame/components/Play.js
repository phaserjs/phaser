var Play = function (key, startFrame)
{
    if (startFrame === undefined) { startFrame = 0; }

    this.load(key, startFrame);

    var anim = this.currentAnim;

    //  Should give us 9,007,199,254,740,991 safe repeats
    this.repeatCounter = (this._repeat === -1) ? Number.MAX_SAFE_INTEGER : this._repeat;

    anim.getFirstTick(this);

    this.forward = true;
    this.isPlaying = true;
    this.pendingRepeat = false;

    if (anim.showOnStart)
    {
        this.parent.visible = true;
    }

    if (anim.onStart)
    {
        anim.onStart.apply(anim.callbackScope, this._callbackArgs.concat(anim.onStartParams));
    }

    return this;
};

module.exports = Play;
