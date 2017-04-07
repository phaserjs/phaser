var Load = function (key, startFrame)
{
    if (startFrame === undefined) { startFrame = 0; }

    if (this.isPlaying)
    {
        this.stop();
    }

    //  Load the new animation in
    this.animationManager.load(this, key, startFrame);

    return this;
};

module.exports = Load;
