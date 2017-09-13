var Frame = function (textureKey, textureFrame, index, frame)
{
    //  The keys into the Texture Manager of the texture + frame this uses
    this.textureKey = textureKey;
    this.textureFrame = textureFrame;

    //  The index of this frame within the Animation.frames array
    this.index = index;

    //  Texture Frame
    this.frame = frame;

    //  Read-only
    this.isFirst = false;

    //  Read-only
    this.isLast = false;

    //  The frame that comes before this one in the animation (if any)
    //  Read-only
    this.prevFrame = null;

    //  The frame that comes after this one in the animation (if any)
    //  Read-only
    this.nextFrame = null;

    //   Additional time (in ms) this frame should appear for - added onto the msPerFrame
    this.duration = 0;

    //   What % through the animation progress is this frame?
    //  Read-only
    this.progress = 0;

    //  Callback if this frame gets displayed
    this.onUpdate = null;

    //  When this frame hits, set sprite.visible to this
    this.setVisible = false;

    this.visible = false;
};

Frame.prototype.constructor = Frame;

Frame.prototype = {

    toJSON: function ()
    {
        return {
            key: this.textureKey,
            frame: this.textureFrame,
            duration: this.duration,
            visible: this.visible
        };
    },

    destroy: function ()
    {
        this.frame = undefined;
        this.onUpdate = undefined;
    }

};

module.exports = Frame;
