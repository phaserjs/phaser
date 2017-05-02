var GetNextTick = function (component)
{
    //  When is the next update due?
    component.accumulator -= component.nextTick;
    component.nextTick = component.msPerFrame + component.currentFrame.duration;
};

module.exports = GetNextTick;
