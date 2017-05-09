var GetNextTick = function (component)
{
    // accumulator += delta * _timeScale
    // after a large delta surge (perf issue for example) we need to adjust for it here

    //  When is the next update due?
    component.accumulator -= component.nextTick;

    component.nextTick = component.msPerFrame + component.currentFrame.duration;
};

module.exports = GetNextTick;
