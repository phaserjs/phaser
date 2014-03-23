/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager, consists of Animation.Frame objects and belongs to a single Game Object such as a Sprite.
*
* @class Phaser.Animation
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.Sprite} parent - A reference to the owner of this Animation.
* @param {string} name - The unique name for this animation, used in playback commands.
* @param {Phaser.FrameData} frameData - The FrameData object that contains all frames used by this Animation.
* @param {(Array.<number>|Array.<string>)} frames - An array of numbers or strings indicating which frames to play in which order.
* @param {number} delay - The time between each frame of the animation, given in ms.
* @param {boolean} loop - Should this animation loop when it reaches the end or play through once.
*/
Phaser.Animation = function (game, parent, name, frameData, frames, delay, loop) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {Phaser.Sprite} _parent - A reference to the parent Sprite that owns this Animation.
    * @private
    */
    this._parent = parent;

    /**
    * @property {Phaser.FrameData} _frameData - The FrameData the Animation uses.
    * @private
    */
    this._frameData = frameData;

    /**
    * @property {string} name - The user defined name given to this Animation.
    */
    this.name = name;

    /**
    * @property {array} _frames
    * @private
    */
    this._frames = [];
    this._frames = this._frames.concat(frames);

    /**
    * @property {number} delay - The delay in ms between each frame of the Animation.
    */
    this.delay = 1000 / delay;

    /**
    * @property {boolean} loop - The loop state of the Animation.
    */
    this.loop = loop;

    /**
    * @property {number} loopCount - The number of times the animation has looped since it was last started.
    */
    this.loopCount = 0;

    /**
    * @property {boolean} killOnComplete - Should the parent of this Animation be killed when the animation completes?
    * @default
    */
    this.killOnComplete = false;

    /**
    * @property {boolean} isFinished - The finished state of the Animation. Set to true once playback completes, false during playback.
    * @default
    */
    this.isFinished = false;

    /**
    * @property {boolean} isPlaying - The playing state of the Animation. Set to false once playback completes, true during playback.
    * @default
    */
    this.isPlaying = false;

    /**
    * @property {boolean} isPaused - The paused state of the Animation.
    * @default
    */
    this.isPaused = false;

    /**
    * @property {boolean} _pauseStartTime - The time the animation paused.
    * @private
    * @default
    */
    this._pauseStartTime = 0;

    /**
    * @property {number} _frameIndex
    * @private
    * @default
    */
    this._frameIndex = 0;

    /**
    * @property {number} _frameDiff
    * @private
    * @default
    */
    this._frameDiff = 0;

    /**
    * @property {number} _frameSkip
    * @private
    * @default
    */
    this._frameSkip = 1;

    /**
    * @property {Phaser.Frame} currentFrame - The currently displayed frame of the Animation.
    */
    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

    /**
    * @property {Phaser.Signal} onStart - This event is dispatched when this Animation starts playback.
    */
    this.onStart = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onComplete - This event is dispatched when this Animation completes playback. If the animation is set to loop this is never fired, listen for onAnimationLoop instead.
    */
    this.onComplete = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onLoop - This event is dispatched when this Animation loops.
    */
    this.onLoop = new Phaser.Signal();

    //  Set-up some event listeners
    this.game.onPause.add(this.onPause, this);
    this.game.onResume.add(this.onResume, this);

};

Phaser.Animation.prototype = {

    /**
    * Plays this animation.
    *
    * @method Phaser.Animation#play
    * @memberof Phaser.Animation
    * @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
    * @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
    * @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
    * @return {Phaser.Animation} - A reference to this Animation instance.
    */
    play: function (frameRate, loop, killOnComplete) {

        if (typeof frameRate === 'number')
        {
            //  If they set a new frame rate then use it, otherwise use the one set on creation
            this.delay = 1000 / frameRate;
        }

        if (typeof loop === 'boolean')
        {
            //  If they set a new loop value then use it, otherwise use the one set on creation
            this.loop = loop;
        }

        if (typeof killOnComplete !== 'undefined')
        {
            //  Remove the parent sprite once the animation has finished?
            this.killOnComplete = killOnComplete;
        }

        this.isPlaying = true;
        this.isFinished = false;
        this.paused = false;
        this.loopCount = 0;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

        //  TODO: Double check if required
        if (this._parent.__tilePattern)
        {
            this._parent.__tilePattern = false;
            this._parent.tilingTexture = false;
        }

        this._parent.events.onAnimationStart.dispatch(this._parent, this);
        this.onStart.dispatch(this._parent, this);

        return this;

    },

    /**
    * Sets this animation back to the first frame and restarts the animation.
    *
    * @method Phaser.Animation#restart
    * @memberof Phaser.Animation
    */
    restart: function () {

        this.isPlaying = true;
        this.isFinished = false;
        this.paused = false;
        this.loopCount = 0;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

        this.onStart.dispatch(this._parent, this);

    },

    /**
    * Stops playback of this animation and set it to a finished state. If a resetFrame is provided it will stop playback and set frame to the first in the animation.
    * If `dispatchComplete` is true it will dispatch the complete events, otherwise they'll be ignored.
    *
    * @method Phaser.Animation#stop
    * @memberof Phaser.Animation
    * @param {boolean} [resetFrame=false] - If true after the animation stops the currentFrame value will be set to the first frame in this animation.
    * @param {boolean} [dispatchComplete=false] - Dispatch the Animation.onComplete and parent.onAnimationComplete events?
    */
    stop: function (resetFrame, dispatchComplete) {

        if (typeof resetFrame === 'undefined') { resetFrame = false; }
        if (typeof dispatchComplete === 'undefined') { dispatchComplete = false; }

        this.isPlaying = false;
        this.isFinished = true;
        this.paused = false;

        if (resetFrame)
        {
            this.currentFrame = this._frameData.getFrame(this._frames[0]);
        }

        if (dispatchComplete)
        {
            this._parent.events.onAnimationComplete.dispatch(this._parent, this);
            this.onComplete.dispatch(this._parent, this);
        }

    },

    /**
    * Called when the Game enters a paused state.
    *
    * @method Phaser.Animation#onPause
    * @memberof Phaser.Animation
    */
    onPause: function () {

        if (this.isPlaying)
        {
            this._frameDiff = this._timeNextFrame - this.game.time.now;
        }

    },

    /**
    * Called when the Game resumes from a paused state.
    *
    * @method Phaser.Animation#onResume
    * @memberof Phaser.Animation
    */
    onResume: function () {

        if (this.isPlaying)
        {
            this._timeNextFrame = this.game.time.now + this._frameDiff;
        }

    },

    /**
    * Updates this animation. Called automatically by the AnimationManager.
    *
    * @method Phaser.Animation#update
    * @memberof Phaser.Animation
    */
    update: function () {

        if (this.isPaused)
        {
            return false;
        }

        if (this.isPlaying === true && this.game.time.now >= this._timeNextFrame)
        {
            this._frameSkip = 1;

            //  Lagging?
            this._frameDiff = this.game.time.now - this._timeNextFrame;

            this._timeLastFrame = this.game.time.now;

            if (this._frameDiff > this.delay)
            {
                //  We need to skip a frame, work out how many
                this._frameSkip = Math.floor(this._frameDiff / this.delay);

                this._frameDiff -= (this._frameSkip * this.delay);
            }

            //  And what's left now?
            this._timeNextFrame = this.game.time.now + (this.delay - this._frameDiff);

            this._frameIndex += this._frameSkip;

            if (this._frameIndex >= this._frames.length)
            {
                if (this.loop)
                {
                    this._frameIndex %= this._frames.length;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

                    if (this.currentFrame)
                    {
                        this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

                        if (this._parent.__tilePattern)
                        {
                            this._parent.__tilePattern = false;
                            this._parent.tilingTexture = false;
                        }
                    }

                    this.loopCount++;
                    this._parent.events.onAnimationLoop.dispatch(this._parent, this);
                    this.onLoop.dispatch(this._parent, this);
                }
                else
                {
                    this.complete();
                }
            }
            else
            {
                this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

                if (this.currentFrame)
                {
                    this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

                    if (this._parent.__tilePattern)
                    {
                        this._parent.__tilePattern = false;
                        this._parent.tilingTexture = false;
                    }
                }
            }

            return true;
        }

        return false;

    },

    /**
    * Cleans up this animation ready for deletion. Nulls all values and references.
    *
    * @method Phaser.Animation#destroy
    * @memberof Phaser.Animation
    */
    destroy: function () {

        this.game = null;
        this._parent = null;
        this._frames = null;
        this._frameData = null;
        this.currentFrame = null;
        this.isPlaying = false;

        this.onStart.destroy();
        this.onLoop.destroy();
        this.onComplete.destroy();

        this.game.onPause.remove(this.onPause, this);
        this.game.onResume.remove(this.onResume, this);

    },

    /**
    * Called internally when the animation finishes playback.
    * Sets the isPlaying and isFinished states and dispatches the onAnimationComplete event if it exists on the parent and local onComplete event.
    *
    * @method Phaser.Animation#complete
    * @memberof Phaser.Animation
    */
    complete: function () {

        this.isPlaying = false;
        this.isFinished = true;
        this.paused = false;

        this._parent.events.onAnimationComplete.dispatch(this._parent, this);

        this.onComplete.dispatch(this._parent, this);

        if (this.killOnComplete)
        {
            this._parent.kill();
        }

    }

};

Phaser.Animation.prototype.constructor = Phaser.Animation;

/**
* @name Phaser.Animation#paused
* @property {boolean} paused - Gets and sets the paused state of this Animation.
*/
Object.defineProperty(Phaser.Animation.prototype, 'paused', {

    get: function () {

        return this.isPaused;

    },

    set: function (value) {

        this.isPaused = value;

        if (value)
        {
            //  Paused
            this._pauseStartTime = this.game.time.now;
        }
        else
        {
            //  Un-paused
            if (this.isPlaying)
            {
                this._timeNextFrame = this.game.time.now + this.delay;
            }
        }

    }

});

/**
* @name Phaser.Animation#frameTotal
* @property {number} frameTotal - The total number of frames in the currently loaded FrameData, or -1 if no FrameData is loaded.
* @readonly
*/
Object.defineProperty(Phaser.Animation.prototype, 'frameTotal', {

    get: function () {
        return this._frames.length;
    }

});

/**
* @name Phaser.Animation#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.Animation.prototype, 'frame', {

    get: function () {

        if (this.currentFrame !== null)
        {
            return this.currentFrame.index;
        }
        else
        {
            return this._frameIndex;
        }

    },

    set: function (value) {

        this.currentFrame = this._frameData.getFrame(this._frames[value]);

        if (this.currentFrame !== null)
        {
            this._frameIndex = value;
            this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }

    }

});

/**
* @name Phaser.Animation#speed
* @property {number} speed - Gets or sets the current speed of the animation, the time between each frame of the animation, given in ms. Takes effect from the NEXT frame. Minimum value is 1.
*/
Object.defineProperty(Phaser.Animation.prototype, 'speed', {

    get: function () {

        return Math.round(1000 / this.delay);

    },

    set: function (value) {

        if (value >= 1)
        {
            this.delay = 1000 / value;
        }

    }

});

/**
* Really handy function for when you are creating arrays of animation data but it's using frame names and not numbers.
* For example imagine you've got 30 frames named: 'explosion_0001-large' to 'explosion_0030-large'
* You could use this function to generate those by doing: Phaser.Animation.generateFrameNames('explosion_', 1, 30, '-large', 4);
*
* @method Phaser.Animation.generateFrameNames
* @param {string} prefix - The start of the filename. If the filename was 'explosion_0001-large' the prefix would be 'explosion_'.
* @param {number} start - The number to start sequentially counting from. If your frames are named 'explosion_0001' to 'explosion_0034' the start is 1.
* @param {number} stop - The number to count to. If your frames are named 'explosion_0001' to 'explosion_0034' the stop value is 34.
* @param {string} [suffix=''] - The end of the filename. If the filename was 'explosion_0001-large' the prefix would be '-large'.
* @param {number} [zeroPad=0] - The number of zeroes to pad the min and max values with. If your frames are named 'explosion_0001' to 'explosion_0034' then the zeroPad is 4.
*/
Phaser.Animation.generateFrameNames = function (prefix, start, stop, suffix, zeroPad) {

    if (typeof suffix == 'undefined') { suffix = ''; }

    var output = [];
    var frame = '';

    if (start < stop)
    {
        for (var i = start; i <= stop; i++)
        {
            if (typeof zeroPad == 'number')
            {
                //  str, len, pad, dir
                frame = Phaser.Utils.pad(i.toString(), zeroPad, '0', 1);
            }
            else
            {
                frame = i.toString();
            }

            frame = prefix + frame + suffix;

            output.push(frame);
        }
    }
    else
    {
        for (var i = start; i >= stop; i--)
        {
            if (typeof zeroPad == 'number')
            {
                //  str, len, pad, dir
                frame = Phaser.Utils.pad(i.toString(), zeroPad, '0', 1);
            }
            else
            {
                frame = i.toString();
            }

            frame = prefix + frame + suffix;

            output.push(frame);
        }
    }

    return output;

};
