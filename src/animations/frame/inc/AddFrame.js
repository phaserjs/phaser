//  config = Array of Animation config objects, like:
//  [
//      { key: 'gems', frame: 'diamond0001', [duration], [visible], [onUpdate] }
//  ]

//  Add frames to the end of the animation

/**
 * [description]
 *
 * @method Phaser.Animations.Animation#addFrame
 * @since 3.0.0
 *
 * @param {[type]} config - [description]
 *
 * @return {Phaser.Animations.Animation} [description]
 */
var AddFrame = function (config)
{
    return this.addFrameAt(this.frames.length, config);
};

module.exports = AddFrame;
