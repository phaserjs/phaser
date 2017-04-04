var AnimationFrame = function (frame, duration, onUpdate)
{
    //  Texture Frame
    this.frame = frame;

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
