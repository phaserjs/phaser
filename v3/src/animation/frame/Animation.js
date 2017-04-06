var GetObjectValue = require('../../utils/object/GetObjectValue');
var GetFrames = require('./GetFrames');

var Animation = function (manager, key, config)
{
    this.manager = manager;

    this.key = key;

    //  Extract all the frame data into the frames array
    this.frames = GetFrames(manager.textureManager, GetObjectValue(config, 'frames', []));

    //  The frame rate of playback in frames per second (default 24 if duration is null)
    this.frameRate = GetObjectValue(config, 'framerate', null);

    //  How long the animation should play for. If frameRate is set it overrides this value
    //  otherwise frameRate is derived from duration
    this.duration = GetObjectValue(config, 'duration', null);

    if (this.duration === null && this.frameRate === null)
    {
        this.frameRate = 24;
        this.duration = this.frameRate / this.frames.length;
    }
    else if (this.duration && this.frameRate === null)
    {
        //  Duration given but no frameRate, so set the frameRate based on duration
        //  I.e. 12 frames in the animation, duration = 4 (4000 ms)
        //  So frameRate is 12 / 4 = 3 fps
        this.frameRate = this.frames.length / this.duration;
    }
    else
    {
        //  No duration, so derive from the frameRate
        //  I.e. 15 frames in the animation, frameRate = 30 fps
        //  So duration is 15 / 30 = 0.5 (half a second)
        this.duration = this.frames.length / this.frameRate;
    }

    //  ms per frame (without including frame specific modifiers)
    this.msPerFrame = 1000 / this.frameRate;

    //  Skip frames if the time lags, or always advanced anyway?
    this.skipMissedFrames = GetObjectValue(config, 'skipMissedFrames', true);

    //  Delay before starting playback (in seconds)
    this.delay = GetObjectValue(config, 'delay', 0);

    //  Number of times to repeat the animation (-1 for infinity)
    this.repeat = GetObjectValue(config, 'repeat', 0);

    //  Delay before the repeat starts (in seconds)
    this.repeatDelay = GetObjectValue(config, 'repeatDelay', 0);

    //  Should the animation yoyo? (reverse back down to the start) before repeating?
    this.yoyo = GetObjectValue(config, 'yoyo', false);

    //  Callbacks (swap for Events?)
    this.onStart = GetObjectValue(config, 'onStart', false);
    this.onRepeat = GetObjectValue(config, 'onRepeat', false);
    this.onComplete = GetObjectValue(config, 'onComplete', false);
    this.onStop = GetObjectValue(config, 'onStop', false);
};

Animation.prototype.constructor = Animation;

Animation.prototype = {

    load: function (component, startFrame)
    {
        if (startFrame >= this.frames.length)
        {
            startFrame = 0;
        }

        if (component.currentAnim !== this)
        {
            component.currentAnim = this;

            component.timeScale = 1;
            component.frameRate = this.frameRate;
            component.duration = this.duration;
            component.msPerFrame = this.msPerFrame;
            component.skipMissedFrames = this.skipMissedFrames;
            component._delay = this.delay;
            component._repeat = this.repeat;
            component._repeatDelay = this.repeatDelay;
            component._yoyo = this.yoyo;
        }

        component.updateFrame(this.frames[startFrame]);
    },

    checkFrame: function (index)
    {
        return (index < this.frames.length);
    },

    getFirstTick: function (component, includeDelay)
    {
        if (includeDelay === undefined) { includeDelay = true; }

        //  When is the first update due?
        component.accumulator = 0;
        component.nextTick = component.msPerFrame + component.currentFrame.duration;

        if (includeDelay)
        {
            component.nextTick += (component._delay * 1000);
        }
    },

    getNextTick: function (component)
    {
        //  When is the next update due?
        component.accumulator -= component.nextTick;
        component.nextTick = component.msPerFrame + component.currentFrame.duration;
    },

    nextFrame: function (component)
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
                //  OnComplete
                component.stop();
            }
        }
        else
        {
            component.updateFrame(frame.nextFrame);

            this.getNextTick(component);
        }
    },

    previousFrame: function (component)
    {
        var frame = component.currentFrame;

        //  TODO: Add frame skip support

        if (frame.isFirst)
        {
            //  We're at the start of the animation

            if (component.repeatCounter > 0)
            {
                //  Repeat (happens before complete)
                this.repeatAnimation(component);
            }
            else
            {
                //  OnComplete
                component.stop();
            }
        }
        else
        {
            component.updateFrame(frame.prevFrame);

            this.getNextTick(component);
        }
    },

    repeatAnimation: function (component)
    {
        if (component._repeatDelay > 0 && component.pendingRepeat === false)
        {
            component.pendingRepeat = true;
            component.accumulator -= component.nextTick;
            component.nextTick += (component._repeatDelay * 1000);
        }
        else
        {
            component.repeatCounter--;

            component.forward = true;

            component.updateFrame(component.currentFrame.nextFrame);

            this.getNextTick(component);

            component.pendingRepeat = false;
    
            //  OnRepeat
        }
    },

    setFrame: function (component)
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
    },

    destroy: function ()
    {

    }
};

module.exports = Animation;
