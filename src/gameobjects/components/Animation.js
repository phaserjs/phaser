var Class = require('../../utils/Class');

//  Game Object Animation Controller

//  Phaser.GameObjects.Components.Animation

var Animation = new Class({

    initialize:

    function Animation (parent)
    {
        //  Sprite / Game Object
        this.parent = parent;

        this.animationManager = parent.scene.sys.anims;

        this.animationManager.once('remove', this.remove, this);

        this.isPlaying = false;

        //  Reference to the Phaser.Animation object
        this.currentAnim = null;

        //  Reference to the Phaser.AnimationFrame object
        this.currentFrame = null;

        //  Animation specific values
        //  -------------------------

        //  Scale the time (make it go faster / slower)
        //  Factor that's used to scale time where 1 = normal speed (the default), 0.5 = half speed, 2 = double speed, etc.
        this._timeScale = 1;

        //  The frame rate of playback in frames per second (default 24 if duration is null)
        this.frameRate = 0;

        //  How long the animation should play for. If frameRate is set it overrides this value
        //  otherwise frameRate is derived from duration
        this.duration = 0;

        //  ms per frame (without including frame specific modifiers)
        this.msPerFrame = 0;

        //  Skip frames if the time lags, or always advanced anyway?
        this.skipMissedFrames = true;

        //  Delay before starting playback (in seconds)
        this._delay = 0;

        //  Number of times to repeat the animation (-1 for infinity)
        this._repeat = 0;

        //  Delay before the repeat starts (in seconds)
        this._repeatDelay = 0;

        //  Should the animation yoyo? (reverse back down to the start) before repeating?
        this._yoyo = false;

        //  Playhead values
        //  ---------------

        //  Move the playhead forward (true) or in reverse (false)
        this.forward = true;

        this.accumulator = 0;
        this.nextTick = 0;

        this.repeatCounter = 0;

        this.pendingRepeat = false;

        this._paused = false;
        this._wasPlaying = false;

        this._callbackArgs = [ parent, null ];
        this._updateParams = [];
    },

    //  Gets or sets the amount of time in seconds between repeats.
    //  For example, if repeat is 2 and repeatDelay is 1, the animation will play initially,
    //  then wait for 1 second before it repeats, then play again, then wait 1 second again
    //  before doing its final repeat.

    delay: function (value)
    {
        if (value === undefined)
        {
            return this._delay;
        }
        else
        {
            this._delay = value;

            return this;
        }
    },

    delayedPlay: function (delay, key, startFrame)
    {
        this.play(key, true, startFrame);

        this.nextTick += (delay * 1000);

        return this;
    },

    getCurrentKey: function ()
    {
        if (this.currentAnim)
        {
            return this.currentAnim.key;
        }
    },

    load: function (key, startFrame)
    {
        if (startFrame === undefined) { startFrame = 0; }

        if (this.isPlaying)
        {
            this.stop();
        }

        //  Load the new animation in
        this.animationManager.load(this, key, startFrame);

        return this;
    },

    pause: function (atFrame)
    {
        if (!this._paused)
        {
            this._paused = true;
            this._wasPlaying = this.isPlaying;
            this.isPlaying = false;
        }

        if (atFrame !== undefined)
        {
            this.updateFrame(atFrame);
        }
        
        return this;
    },

    paused: function (value)
    {
        if (value !== undefined)
        {
            //  Setter
            if (value)
            {
                return this.pause();
            }
            else
            {
                return this.resume();
            }
        }
        else
        {
            return this._paused;
        }
    },

    play: function (key, ignoreIfPlaying, startFrame)
    {
        if (ignoreIfPlaying === undefined) { ignoreIfPlaying = false; }
        if (startFrame === undefined) { startFrame = 0; }

        if (ignoreIfPlaying && this.isPlaying && this.currentAnim.key === key)
        {
            return this;
        }

        this.load(key, startFrame);

        var anim = this.currentAnim;

        //  Should give us 9,007,199,254,740,991 safe repeats
        this.repeatCounter = (this._repeat === -1) ? Number.MAX_SAFE_INTEGER : this._repeat;

        anim.getFirstTick(this);

        this.forward = true;
        this.isPlaying = true;
        this.pendingRepeat = false;

        if (anim.showOnStart)
        {
            this.parent.visible = true;
        }

        if (anim.onStart)
        {
            anim.onStart.apply(anim.callbackScope, this._callbackArgs.concat(anim.onStartParams));
        }

        return this;
    },

    //  Value between 0 and 1. How far this animation is through, ignoring repeats and yoyos.
    //  If the animation has a non-zero repeat defined, progress and totalProgress will be different
    //  because progress doesn't include any repeats or repeatDelays whereas totalProgress does.
    progress: function (value)
    {
        if (value === undefined)
        {
            var p = this.currentFrame.progress;

            if (!this.forward)
            {
                p = 1 - p;
            }

            return p;
        }
        else
        {
            //  TODO: Set progress

            return this;
        }
    },

    remove: function (event)
    {
        if (event === undefined) { event = this.currentAnim; }

        if (this.isPlaying && event.key === this.currentAnim.key)
        {
            this.stop();

            var sprite = this.parent;
            var frame = this.currentAnim.frames[0];

            this.currentFrame = frame;

            sprite.texture = frame.frame.texture;
            sprite.frame = frame.frame;
        }
    },

    //  Gets or sets the number of times that the animation should repeat
    //  after its first iteration. For example, if repeat is 1, the animation will
    //  play a total of twice (the initial play plus 1 repeat).
    //  To repeat indefinitely, use -1. repeat should always be an integer.

    repeat: function (value)
    {
        if (value === undefined)
        {
            return this._repeat;
        }
        else
        {
            this._repeat = value;
            this.repeatCounter = 0;

            return this;
        }
    },

    //  Gets or sets the amount of time in seconds between repeats.
    //  For example, if repeat is 2 and repeatDelay is 1, the animation will play initially,
    //  then wait for 1 second before it repeats, then play again, then wait 1 second again
    //  before doing its final repeat.

    repeatDelay: function (value)
    {
        if (value === undefined)
        {
            return this._repeatDelay;
        }
        else
        {
            this._repeatDelay = value;

            return this;
        }
    },

    restart: function (includeDelay)
    {
        if (includeDelay === undefined) { includeDelay = false; }

        this.currentAnim.getFirstTick(this, includeDelay);

        this.forward = true;
        this.isPlaying = true;
        this.pendingRepeat = false;
        this._paused = false;

        //  Set frame
        this.updateFrame(this.currentAnim.frames[0]);

        return this;
    },

    resume: function (fromFrame)
    {
        if (this._paused)
        {
            this._paused = false;
            this.isPlaying = this._wasPlaying;
        }

        if (fromFrame !== undefined)
        {
            this.updateFrame(fromFrame);
        }
        
        return this;
    },

    stop: function (dispatchCallbacks)
    {
        if (dispatchCallbacks === undefined) { dispatchCallbacks = false; }

        this.isPlaying = false;

        var anim = this.currentAnim;

        if (dispatchCallbacks && anim.onComplete)
        {
            anim.onComplete.apply(anim.callbackScope, this._callbackArgs.concat(anim.onCompleteParams));
        }

        return this;
    },

    timeScale: function (value)
    {
        if (value === undefined)
        {
            return this._timeScale;
        }
        else
        {
            this._timeScale = value;

            return this;
        }
    },

    totalFrames: function ()
    {
        return this.currentAnim.frames.length;
    },

    //  Value between 0 and 1. How far this animation is through, including things like delays
    //  repeats, custom frame durations, etc. If the animation is set to repeat -1 it can never
    //  have a duration, therefore this will return -1.
    totalProgres: function ()
    {
        // TODO
    },

    update: function (timestamp, delta)
    {
        if (!this.isPlaying || this.currentAnim.paused)
        {
            return;
        }

        this.accumulator += delta * this._timeScale;

        if (this.accumulator >= this.nextTick)
        {
            this.currentAnim.setFrame(this);
        }
    },

    updateFrame: function (animationFrame)
    {
        var sprite = this.parent;

        this.currentFrame = animationFrame;

        sprite.texture = animationFrame.frame.texture;
        sprite.frame = animationFrame.frame;

        if (this.isPlaying)
        {
            if (animationFrame.setAlpha)
            {
                sprite.alpha = animationFrame.alpha;
            }

            var anim = this.currentAnim;

            if (anim.onUpdate)
            {
                anim.onUpdate.apply(anim.callbackScope, this._updateParams);
            }

            if (animationFrame.onUpdate)
            {
                animationFrame.onUpdate(sprite, animationFrame);
            }
        }
    },

    yoyo: function (value)
    {
        if (value === undefined)
        {
            return this._yoyo;
        }
        else
        {
            this._yoyo = value;

            return this;
        }
    },

    destroy: function ()
    {
        //  TODO
    }

});

module.exports = Animation;
