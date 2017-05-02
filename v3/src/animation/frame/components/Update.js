var Update = function (timestamp, delta)
{
    if (!this.isPlaying || this.currentAnim.paused)
    {
        return;
    }

    this.accumulator += delta * this._timeScale;

    if (this.accumulator >= this.nextTick)
    {
        this.currentAnim.setFrame(this);
    }
};

module.exports = Update;
