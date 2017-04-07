var Pause = function (atFrame)
{
    if (!this._paused)
    {
        this._paused = true;
        this._wasPlaying = this.isPlaying;
        this.isPlaying = false;
    }

    if (atFrame !== undefined)
    {
        this.updateFrame(atFrame);
    }
    
    return this;
};

module.exports = Pause;
