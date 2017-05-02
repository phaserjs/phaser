var Load = function (component, startFrame)
{
    if (startFrame >= this.frames.length)
    {
        startFrame = 0;
    }

    if (component.currentAnim !== this)
    {
        component.currentAnim = this;

        component._timeScale = 1;
        component.frameRate = this.frameRate;
        component.duration = this.duration;
        component.msPerFrame = this.msPerFrame;
        component.skipMissedFrames = this.skipMissedFrames;
        component._delay = this.delay;
        component._repeat = this.repeat;
        component._repeatDelay = this.repeatDelay;
        component._yoyo = this.yoyo;
        component._callbackArgs[1] = this;
        component._updateParams = component._callbackArgs.concat(this.onUpdateParams);
    }

    component.updateFrame(this.frames[startFrame]);
};

module.exports = Load;
