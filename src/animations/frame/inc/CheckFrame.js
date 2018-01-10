/**
 * [description]
 *
 * @method Phaser.Animations.Animation#checkFrame
 * @since 3.0.0
 *
 * @param {integer} index - [description]
 *
 * @return {boolean} [description]
 */
var CheckFrame = function (index)
{
    return (index < this.frames.length);
};

module.exports = CheckFrame;
