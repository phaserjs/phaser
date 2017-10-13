/**
 * [description]
 *
 * @method Phaser.Animations.Animation#removeFrameAt
 * @since 3.0.0
 *
 * @param {integer} index - [description]
 *
 * @return {Phaser.Animations.Animation} [description]
 */
var RemoveFrameAt = function (index)
{
    this.frames.splice(index, 1);

    this.updateFrameSequence();

    return this;
};

module.exports = RemoveFrameAt;
