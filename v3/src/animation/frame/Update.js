var Update = function (timestamp)
{
    if (!this.isPlaying)
    {
        return;
    }

    this.accumulator += (timestamp - this.prevTick) * this._timeScale;

    this.prevTick = timestamp;

    if (this.accumulator >= this.nextTick)
    {
        this.currentAnim.setFrame(this);
    }
};

module.exports = Update;
