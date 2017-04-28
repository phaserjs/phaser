var Update = function (timestamp, delta)
{
    if (!this.isPlaying)
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
