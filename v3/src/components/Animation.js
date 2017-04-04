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

    //  References to the data stored in the Phaser.Animation class
    this.currentAnim = null;
    this.currentFrame = null;

    this.nextTick = 0;
};

Animation.prototype.constructor = Animation;

Animation.prototype = {

    load: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        //  Load the new animation in
        this.animationManager.loadAnimation(this, key, startFrame);

        this.parent.texture = this.currentFrame.frame.texture;
        this.parent.frame = this.currentFrame.frame;
    },

    play: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        if (this.isPlaying)
        {
            this.stop();
        }

        this.load(key, startFrame);

        this.isPlaying = true;

        //  Calculate next tick
        // this.nextTick = (1000 / this.framerate) + this.currentFrame.
    },

    stop: function ()
    {
        this.isPlaying = false;
    },

    update: function (timestamp, frameDelta)
    {
        if (!this.isPlaying)
        {
            return;
        }
    }

};

module.exports = Animation;
