//  Remove frame if it matches the given frame
/**
 * [description]
 *
 * @method Phaser.Animations.Animation#removeFrame
 * @since 3.0.0
 *
 * @param {Phaser.Animations.AnimationFrame} frame - [description]
 *
 * @return {Phaser.Animations.Animation} [description]
 */
var RemoveFrame = function (frame)
{
    var index = this.frames.indexOf(frame);

    if (index !== -1)
    {
        this.removeFrameAt(index);
    }

    return this;
};

module.exports = RemoveFrame;
