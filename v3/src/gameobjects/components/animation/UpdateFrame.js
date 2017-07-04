var UpdateFrame = function (animationFrame)
{
    var sprite = this.parent;

    this.currentFrame = animationFrame;

    sprite.texture = animationFrame.frame.texture;
    sprite.frame = animationFrame.frame;

    if (this.isPlaying)
    {
        if (animationFrame.setAlpha)
        {
            sprite.alpha = animationFrame.alpha;
        }

        var anim = this.currentAnim;

        if (anim.onUpdate)
        {
            anim.onUpdate.apply(anim.callbackScope, this._updateParams);
        }

        if (animationFrame.onUpdate)
        {
            animationFrame.onUpdate(sprite, animationFrame);
        }
    }
};

module.exports = UpdateFrame;
