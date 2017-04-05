/**
* The Animation Component.
* Should be as small as possible, really just playhead info.
*
* @class
*/
var Animation = function (parent)
{
    //  Sprite / Game Object
    this.parent = parent;

    this.animationManager = parent.state.sys.anims;

    this.isPlaying = false;

    //  Reference to the Phaser.Animation object
    this.currentAnim = null;

    //  Reference to the Phaser.AnimationFrame object
    this.currentFrame = null;

    //  Scale the time (make it go faster / slower)
    this.timescale = 1;

    //  Playhead values

    //  Move the playhead forward (true) or in reverse (false)
    this.forward = true;

    this.accumulator = 0;

    this.nextTick = 0;

    this.repeatCounter = 0;
};

Animation.prototype.constructor = Animation;

Animation.prototype = {

    updateAnimation: function (animation)
    {
        this.currentAnim = animation;
    },

    updateFrame: function (animationFrame)
    {
        this.currentFrame = animationFrame;

        this.parent.texture = animationFrame.frame.texture;
        this.parent.frame = animationFrame.frame;
    },

    load: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        if (this.isPlaying)
        {
            this.stop();
        }

        //  Load the new animation in
        this.animationManager.load(this, key, startFrame);
    },

    play: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        this.load(key, startFrame);

        //  Move to reset?
        this.accumulator = 0;
        this.nextTick = 0;

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this.currentAnim.repeat === -1) ? Number.MAX_SAFE_INTEGER : this.currentAnim.repeat;

        this.currentAnim.getNextTick(this);

        this.forward = true;
        this.isPlaying = true;
    },

    //  Example data:
    //  timestamp = 2356.534000020474
    //  frameDelta = 17.632333353807383 (diff since last timestamp)
    update: function (timestamp, frameDelta)
    {
        if (this.isPlaying)
        {
            this.accumulator += frameDelta;

            if (this.accumulator >= this.nextTick)
            {
                this.currentAnim.setFrame(this);
            }
        }
    },

    stop: function ()
    {
        this.isPlaying = false;
    }

};

module.exports = Animation;
