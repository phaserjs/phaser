var AnimationFrame = function (index, frame, duration, onUpdate)
{
    //  The index of this frame within the Animation.frames array
    this.index = index;

    //  Texture Frame
    this.frame = frame;

    this.isFirst = false;
    this.isLast = false;

    //  The frame that comes before this one in the animation (if any)
    this.prevFrame = null;

    //  The frame that comes after this one in the animation (if any)
    this.nextFrame = null;

    //   Additional time (in ms) this frame should appear for - added onto the msPerFrame
    this.duration = duration;

    //  Callback if this frame gets displayed
    this.onUpdate = onUpdate;
};

AnimationFrame.prototype.constructor = AnimationFrame;

AnimationFrame.prototype = {

    destroy: function ()
    {
        this.frame = undefined;
        this.onUpdate = undefined;
    }

};

module.exports = AnimationFrame;
