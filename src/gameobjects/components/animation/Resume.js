var Resume = function (fromFrame)
{
    if (this._paused)
    {
        this._paused = false;
        this.isPlaying = this._wasPlaying;
    }

    if (fromFrame !== undefined)
    {
        this.updateFrame(fromFrame);
    }
    
    return this;
};

module.exports = Resume;
