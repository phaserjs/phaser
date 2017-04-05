var GetObjectValue = require('../../utils/object/GetObjectValue');
var GetFrames = require('./GetFrames');

var Animation = function (manager, key, config)
{
    this.manager = manager;

    this.key = key;

    //      frames: [
    //          { key: textureKey, frame: textureFrame },
    //          { key: textureKey, frame: textureFrame, duration: float },
    //          { key: textureKey, frame: textureFrame, onUpdate: function }
    //      ],
    //      framerate: integer,
    //      duration: float (seconds, optional, ignored if framerate is set),
    //      skipMissedFrames: boolean,
    //      delay: integer
    //      repeat: -1 = forever, otherwise integer
    //      repeatDelay: integer
    //      yoyo: boolean,
    //      onStart: function
    //      onRepeat: function
    //      onComplete: function,

    //  Extract all the frame data into the frames array
    this.frames = GetFrames(manager.textureManager, GetObjectValue(config, 'frames', []));

    //  Scale the time (make it go faster / slower) >>> move to Animation Component?
    this.timeScale = 1;

    //  The frame rate of playback in frames per second (default 24 if duration is null)
    this.framerate = GetObjectValue(config, 'framerate', null);

    //  How long the animation should play for. If framerate is set it overrides this value
    //  otherwise framerate is derived from duration
    this.duration = GetObjectValue(config, 'duration', null);

    if (this.duration === null && this.framerate === null)
    {
        this.framerate = 24;
        this.duration = this.framerate / this.frames.length;
    }
    else if (this.duration && this.framerate === null)
    {
        //  Duration given but no framerate, so set the framerate based on duration
        //  I.e. 12 frames in the animation, duration = 4 (4000 ms)
        //  So framerate is 12 / 4 = 3 fps
        this.framerate = this.frames.length / this.duration;
    }
    else
    {
        //  No duration, so derive from the framerate
        //  I.e. 15 frames in the animation, framerate = 30 fps
        //  So duration is 15 / 30 = 0.5 (half a second)
        this.duration = this.frames.length / this.framerate;
    }

    //  ms per frame (without including frame specific modifiers)
    this.msPerFrame = 1000 / this.framerate;

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

        component.currentAnim = this;
        component.currentFrame = this.frames[startFrame];
    },

    checkFrame: function (index)
    {
        return (index < this.frames.length);
    },

    getNextTick: function (component)
    {
        //  When is the next update due?
        var frame = component.currentFrame;

        component.nextTick = this.msPerFrame + frame.duration;
    },

    setFrame: function (component)
    {
        //  Example data:
        //  timestamp = 2356.534000020474
        //  frameDelta = 17.632333353807383 (diff since last timestamp)

        //  Work out which frame should be set next on the child, and set it

        var frame = component.currentFrame;

        var diff = component.accumulator - component.nextTick;

        if (frame.nextFrame)
        {
            component.currentFrame = frame.nextFrame;

            component.updateFrame();

            component.accumulator = diff;

            this.getNextTick(component);
        }
        else
        {
            //  We're at the end of the animation
            component.stop();
        }
    },

    destroy: function ()
    {

    }
};

module.exports = Animation;
