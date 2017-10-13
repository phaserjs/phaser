var NextFrame = function (component)
{
    var frame = component.currentFrame;

    //  TODO: Add frame skip support

    if (frame.isLast)
    {
        //  We're at the end of the animation

        //  Yoyo? (happens before repeat)
        if (this.yoyo)
        {
            component.forward = false;

            component.updateFrame(frame.prevFrame);

            //  Delay for the current frame
            this.getNextTick(component);
        }
        else if (component.repeatCounter > 0)
        {
            //  Repeat (happens before complete)
            this.repeatAnimation(component);
        }
        else
        {
            this.completeAnimation(component);
        }
    }
    else
    {
        component.updateFrame(frame.nextFrame);

        this.getNextTick(component);
    }
};

module.exports = NextFrame;
