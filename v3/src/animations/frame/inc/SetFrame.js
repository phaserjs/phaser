var SetFrame = function (component)
{
    //  Work out which frame should be set next on the child, and set it
    if (component.forward)
    {
        this.nextFrame(component);
    }
    else
    {
        this.previousFrame(component);
    }
};

module.exports = SetFrame;
