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

    //  Timing playhead values
    this.accumulator = 0;
    this.nextTick = 0;
};

Animation.prototype.constructor = Animation;

Animation.prototype = {

    load: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        if (this.isPlaying)
        {
            this.stop();
        }

        //  Load the new animation in
        this.animationManager.load(this, key, startFrame);

        this.updateFrame();
    },

    play: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        this.load(key, startFrame);

        this.accumulator = 0;

        this.currentAnim.getNextTick(this);

        this.isPlaying = true;
    },

    stop: function ()
    {
        this.isPlaying = false;
    },

    updateFrame: function ()
    {
        this.parent.texture = this.currentFrame.frame.texture;
        this.parent.frame = this.currentFrame.frame;
    },

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
    }

};

module.exports = Animation;
