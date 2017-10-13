var GetFirstTick = function (component, includeDelay)
{
    if (includeDelay === undefined) { includeDelay = true; }

    //  When is the first update due?
    component.accumulator = 0;
    component.nextTick = component.msPerFrame + component.currentFrame.duration;

    if (includeDelay)
    {
        component.nextTick += (component._delay * 1000);
    }
};

module.exports = GetFirstTick;
