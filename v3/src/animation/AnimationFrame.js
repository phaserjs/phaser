var AnimationFrame = function (frame, duration, onUpdate)
{
    //  Texture Frame
    this.frame = frame;

    //  The frame that comes before this one in the animation (if any)
    this.prevFrame = null;

    //  The frame that comes after this one in the animation (if any)
    this.nextFrame = null;

    //   Duration this frame should appear for (modifier to fps rate)
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
