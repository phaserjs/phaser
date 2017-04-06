var Resume = function ()
{
    if (this._paused)
    {
        this._paused = false;
        this.isPlaying = this._wasPlaying;

        if (this.isPlaying)
        {
            this.prevTick = this.mainloop.lastFrameTimeMs;
        }
    }
    
    return this;
};

module.exports = Resume;
