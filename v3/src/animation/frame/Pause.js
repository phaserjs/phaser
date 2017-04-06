var Pause = function ()
{
    if (!this._paused)
    {
        this._paused = true;
        this._wasPlaying = this.isPlaying;
        this.isPlaying = false;
    }
    
    return this;
};

module.exports = Pause;
