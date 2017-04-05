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

    this.prevTick = 0;
    this.nextTick = 0;

    this.repeatCounter = 0;

    this.pendingRepeat = false;
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

    delayedPlay: function (delay, key, startFrame)
    {
        this.play(key, startFrame);

        this.nextTick += (delay * 1000);

        return this.parent;
    },

    play: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        this.load(key, startFrame);

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this.currentAnim.repeat === -1) ? Number.MAX_SAFE_INTEGER : this.currentAnim.repeat;

        this.currentAnim.getFirstTick(this);

        this.forward = true;
        this.isPlaying = true;
        this.pendingRepeat = false;

        this.prevTick = this.parent.state.game.mainloop.lastFrameTimeMs;

        return this.parent;
    },

    //  Example data:
    //  timestamp = 2356.534000020474
    //  frameDelta = 17.632333353807383 (diff since last timestamp?)
    update: function (timestamp)
    {
        if (this.isPlaying)
        {
            this.accumulator += (timestamp - this.prevTick) * this.timescale;

            this.prevTick = timestamp;

            if (this.accumulator >= this.nextTick)
            {
                this.currentAnim.setFrame(this);
            }
        }
    },

    stop: function ()
    {
        this.isPlaying = false;

        return this.parent;
    },

    //  How far through the current animation are we?
    //  Value between 0 and 1
    //  I.e. [a,b,c,d,e,f] if on frame c progress would be 0.5

    //  TODO: Add value argument
    progress: function ()
    {
        var p = this.currentFrame.progress;

        if (!this.forward)
        {
            p = 1 - p;
        }

        return p;
    }

};

Object.defineProperties(Animation.prototype, {

    totalFrames: {

        enumerable: true,

        get: function ()
        {
            return this.currentAnim.frames.length;
        }

    }

});

module.exports = Animation;
