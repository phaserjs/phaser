//  config = Array of Animation config objects, like:
//  [
//      { key: 'gems', frame: 'diamond0001', [duration], [visible], [onUpdate] }
//  ]

//  Add frames to the end of the animation
var AddFrame = function (config)
{
    return this.addFrameAt(this.frames.length, config);
};

module.exports = AddFrame;
