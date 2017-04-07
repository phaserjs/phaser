var UpdateFrame = function (animationFrame)
{
    var sprite = this.parent;

    this.currentFrame = animationFrame;

    sprite.texture = animationFrame.frame.texture;
    sprite.frame = animationFrame.frame;

    if (animationFrame.setAlpha)
    {
        sprite.alpha = animationFrame.alpha;
    }

    if (animationFrame.setVisible)
    {
        sprite.visible = animationFrame.visible;
    }

    if (animationFrame.onUpdate)
    {
        animationFrame.onUpdate(sprite, animationFrame);
    }
};

module.exports = UpdateFrame;
