var Remove = function (event)
{
    if (event === undefined) { event = this.currentAnim; }

    if (this.isPlaying && event.key === this.currentAnim.key)
    {
        console.log('animationRemoved', event.key);

        this.stop();

        var sprite = this.parent;
        var frame = this.currentAnim.frames[0];

        this.currentFrame = frame;

        sprite.texture = frame.frame.texture;
        sprite.frame = frame.frame;
    }
};

module.exports = Remove;
