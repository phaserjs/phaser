var GetFrames = require('./GetFrames');

//  config = Array of Animation config objects, like:
//  [
//      { key: 'gems', frame: 'diamond0001', [duration], [visible], [onUpdate] }
//  ]

//  Add frame/s into the animation
var AddFrameAt = function (index, config)
{
    if (index === undefined) { index = 0; }

    var newFrames = GetFrames(this.manager.textureManager, config);

    if (newFrames.length > 0)
    {
        if (index === 0)
        {
            this.frames = newFrames.concat(this.frames);
        }
        else if (index === this.frames.length)
        {
            this.frames = this.frames.concat(newFrames);
        }
        else
        {
            var pre = this.frames.slice(0, index);
            var post = this.frames.slice(index);

            this.frames = pre.concat(newFrames, post);
        }

        this.updateFrameSequence();
    }

    return this;
};

module.exports = AddFrameAt;
