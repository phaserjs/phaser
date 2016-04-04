/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Animation instance contains a single animation and the controls to play it.
* 
* It is created by the AnimationManager, consists of Animation.Frame objects and belongs to a single Game Object such as a Sprite.
*
* @class Phaser.Animation
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.Sprite} parent - A reference to the owner of this Animation.
* @param {string} name - The unique name for this animation, used in playback commands.
* @param {Phaser.FrameData} frameData - The FrameData object that contains all frames used by this Animation.
* @param {number[]|string[]} frames - An array of numbers or strings indicating which frames to play in which order.
* @param {number} [frameRate=60] - The speed at which the animation should play. The speed is given in frames per second.
* @param {boolean} [loop=false] - Whether or not the animation is looped or just plays once.
*/
Phaser.Animation = function (game, parent, name, frameData, frames, frameRate, loop) {

    if (loop === undefined) { loop = false; }

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
    * @property {number} delay - The delay in ms between each frame of the Animation, based on the given frameRate.
    */
    this.delay = 1000 / frameRate;

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
    * This event is dispatched when the Animation changes frame. 
    * By default this event is disabled due to its intensive nature. Enable it with: `Animation.enableUpdate = true`.
    * Note that the event is only dispatched with the current frame. In a low-FPS environment Animations
    * will automatically frame-skip to try and claw back time, so do not base your code on expecting to 
    * receive a perfectly sequential set of frames from this event.
    * @property {Phaser.Signal|null} onUpdate
    * @default
    */
    this.onUpdate = null;

    /**
    * @property {Phaser.Signal} onComplete - This event is dispatched when this Animation completes playback. If the animation is set to loop this is never fired, listen for onLoop instead.
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

        this._timeLastFrame = this.game.time.time;
        this._timeNextFrame = this.game.time.time + this.delay;

        this._frameIndex = 0;
        this.updateCurrentFrame(false, true);

        this._parent.events.onAnimationStart$dispatch(this._parent, this);

        this.onStart.dispatch(this._parent, this);

        this._parent.animations.currentAnim = this;
        this._parent.animations.currentFrame = this.currentFrame;

        return this;

    },

    /**
    * Sets this animation back to the first frame and restarts the animation.
    *
    * @method Phaser.Animation#restart
    */
    restart: function () {

        this.isPlaying = true;
        this.isFinished = false;
        this.paused = false;
        this.loopCount = 0;

        this._timeLastFrame = this.game.time.time;
        this._timeNextFrame = this.game.time.time + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

        this._parent.setFrame(this.currentFrame);

        this._parent.animations.currentAnim = this;
        this._parent.animations.currentFrame = this.currentFrame;

        this.onStart.dispatch(this._parent, this);

    },

    /**
    * Sets this animations playback to a given frame with the given ID.
    *
    * @method Phaser.Animation#setFrame
    * @param {string|number} [frameId] - The identifier of the frame to set. Can be the name of the frame, the sprite index of the frame, or the animation-local frame index.
    * @param {boolean} [useLocalFrameIndex=false] - If you provide a number for frameId, should it use the numeric indexes of the frameData, or the 0-indexed frame index local to the animation.
    */
    setFrame: function(frameId, useLocalFrameIndex) {

        var frameIndex;

        if (useLocalFrameIndex === undefined)
        {
            useLocalFrameIndex = false;
        }

        //  Find the index to the desired frame.
        if (typeof frameId === "string")
        {
            for (var i = 0; i < this._frames.length; i++)
            {
                if (this._frameData.getFrame(this._frames[i]).name === frameId)
                {
                    frameIndex = i;
                }
            }
        }
        else if (typeof frameId === "number")
        {
            if (useLocalFrameIndex)
            {
                frameIndex = frameId;
            }
            else
            {
                for (var i = 0; i < this._frames.length; i++)
                {
                    if (this._frames[i] === frameIndex)
                    {
                        frameIndex = i;
                    }
                }
            }
        }

        if (frameIndex)
        {
            //  Set the current frame index to the found index. Subtract 1 so that it animates to the desired frame on update.
            this._frameIndex = frameIndex - 1;

            //  Make the animation update at next update
            this._timeNextFrame = this.game.time.time;

            this.update();
        }

    },

    /**
    * Stops playback of this animation and set it to a finished state. If a resetFrame is provided it will stop playback and set frame to the first in the animation.
    * If `dispatchComplete` is true it will dispatch the complete events, otherwise they'll be ignored.
    *
    * @method Phaser.Animation#stop
    * @param {boolean} [resetFrame=false] - If true after the animation stops the currentFrame value will be set to the first frame in this animation.
    * @param {boolean} [dispatchComplete=false] - Dispatch the Animation.onComplete and parent.onAnimationComplete events?
    */
    stop: function (resetFrame, dispatchComplete) {

        if (resetFrame === undefined) { resetFrame = false; }
        if (dispatchComplete === undefined) { dispatchComplete = false; }

        this.isPlaying = false;
        this.isFinished = true;
        this.paused = false;

        if (resetFrame)
        {
            this.currentFrame = this._frameData.getFrame(this._frames[0]);
            this._parent.setFrame(this.currentFrame);
        }

        if (dispatchComplete)
        {
            this._parent.events.onAnimationComplete$dispatch(this._parent, this);
            this.onComplete.dispatch(this._parent, this);
        }

    },

    /**
    * Called when the Game enters a paused state.
    *
    * @method Phaser.Animation#onPause
    */
    onPause: function () {

        if (this.isPlaying)
        {
            this._frameDiff = this._timeNextFrame - this.game.time.time;
        }

    },

    /**
    * Called when the Game resumes from a paused state.
    *
    * @method Phaser.Animation#onResume
    */
    onResume: function () {

        if (this.isPlaying)
        {
            this._timeNextFrame = this.game.time.time + this._frameDiff;
        }

    },

    /**
    * Updates this animation. Called automatically by the AnimationManager.
    *
    * @method Phaser.Animation#update
    */
    update: function () {

        if (this.isPaused)
        {
            return false;
        }

        if (this.isPlaying && this.game.time.time >= this._timeNextFrame)
        {
            this._frameSkip = 1;

            //  Lagging?
            this._frameDiff = this.game.time.time - this._timeNextFrame;

            this._timeLastFrame = this.game.time.time;

            if (this._frameDiff > this.delay)
            {
                //  We need to skip a frame, work out how many
                this._frameSkip = Math.floor(this._frameDiff / this.delay);
                this._frameDiff -= (this._frameSkip * this.delay);
            }

            //  And what's left now?
            this._timeNextFrame = this.game.time.time + (this.delay - this._frameDiff);

            this._frameIndex += this._frameSkip;

            if (this._frameIndex >= this._frames.length)
            {
                if (this.loop)
                {
                    // Update current state before event callback
                    this._frameIndex %= this._frames.length;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

                    //  Instead of calling updateCurrentFrame we do it here instead
                    if (this.currentFrame)
                    {
                        this._parent.setFrame(this.currentFrame);
                    }

                    this.loopCount++;
                    this._parent.events.onAnimationLoop$dispatch(this._parent, this);
                    this.onLoop.dispatch(this._parent, this);

                    if (this.onUpdate)
                    {
                        this.onUpdate.dispatch(this, this.currentFrame);

                        // False if the animation was destroyed from within a callback
                        return !!this._frameData;
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    this.complete();
                    return false;
                }
            }
            else
            {
                return this.updateCurrentFrame(true);
            }
        }

        return false;

    },

    /**
    * Changes the currentFrame per the _frameIndex, updates the display state,
    * and triggers the update signal.
    *
    * Returns true if the current frame update was 'successful', false otherwise.
    *
    * @method Phaser.Animation#updateCurrentFrame
    * @private
    * @param {boolean} signalUpdate - If true the `Animation.onUpdate` signal will be dispatched.
    * @param {boolean} fromPlay - Was this call made from the playing of a new animation?
    * @return {boolean} True if the current frame was updated, otherwise false.
    */
    updateCurrentFrame: function (signalUpdate, fromPlay) {

        if (fromPlay === undefined) { fromPlay = false; }

        if (!this._frameData)
        {
            // The animation is already destroyed, probably from a callback
            return false;
        }
            
        //  Previous index
        var idx = this.currentFrame.index;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

        if (this.currentFrame && (fromPlay || (!fromPlay && idx !== this.currentFrame.index)))
        {
            this._parent.setFrame(this.currentFrame);
        }

        if (this.onUpdate && signalUpdate)
        {
            this.onUpdate.dispatch(this, this.currentFrame);

            // False if the animation was destroyed from within a callback
            return !!this._frameData;
        }
        else
        {
            return true;
        }

    },

    /**
    * Advances by the given number of frames in the Animation, taking the loop value into consideration.
    *
    * @method Phaser.Animation#next
    * @param {number} [quantity=1] - The number of frames to advance.
    */
    next: function (quantity) {

        if (quantity === undefined) { quantity = 1; }

        var frame = this._frameIndex + quantity;

        if (frame >= this._frames.length)
        {
            if (this.loop)
            {
                frame %= this._frames.length;
            }
            else
            {
                frame = this._frames.length - 1;
            }
        }

        if (frame !== this._frameIndex)
        {
            this._frameIndex = frame;
            this.updateCurrentFrame(true);
        }

    },

    /**
    * Moves backwards the given number of frames in the Animation, taking the loop value into consideration.
    *
    * @method Phaser.Animation#previous
    * @param {number} [quantity=1] - The number of frames to move back.
    */
    previous: function (quantity) {

        if (quantity === undefined) { quantity = 1; }

        var frame = this._frameIndex - quantity;

        if (frame < 0)
        {
            if (this.loop)
            {
                frame = this._frames.length + frame;
            }
            else
            {
                frame++;
            }
        }

        if (frame !== this._frameIndex)
        {
            this._frameIndex = frame;
            this.updateCurrentFrame(true);
        }

    },

    /**
    * Changes the FrameData object this Animation is using.
    *
    * @method Phaser.Animation#updateFrameData
    * @param {Phaser.FrameData} frameData - The FrameData object that contains all frames used by this Animation.
    */
    updateFrameData: function (frameData) {

        this._frameData = frameData;
        this.currentFrame = this._frameData ? this._frameData.getFrame(this._frames[this._frameIndex % this._frames.length]) : null;

    },

    /**
    * Cleans up this animation ready for deletion. Nulls all values and references.
    *
    * @method Phaser.Animation#destroy
    */
    destroy: function () {

        if (!this._frameData)
        {
            // Already destroyed
            return;
        }

        this.game.onPause.remove(this.onPause, this);
        this.game.onResume.remove(this.onResume, this);

        this.game = null;
        this._parent = null;
        this._frames = null;
        this._frameData = null;
        this.currentFrame = null;
        this.isPlaying = false;

        this.onStart.dispose();
        this.onLoop.dispose();
        this.onComplete.dispose();

        if (this.onUpdate)
        {
            this.onUpdate.dispose();
        }

    },

    /**
    * Called internally when the animation finishes playback.
    * Sets the isPlaying and isFinished states and dispatches the onAnimationComplete event if it exists on the parent and local onComplete event.
    *
    * @method Phaser.Animation#complete
    */
    complete: function () {

        this._frameIndex = this._frames.length - 1;
        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

        this.isPlaying = false;
        this.isFinished = true;
        this.paused = false;

        this._parent.events.onAnimationComplete$dispatch(this._parent, this);

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
            this._pauseStartTime = this.game.time.time;
        }
        else
        {
            //  Un-paused
            if (this.isPlaying)
            {
                this._timeNextFrame = this.game.time.time + this.delay;
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
            this._parent.setFrame(this.currentFrame);

            if (this.onUpdate)
            {
                this.onUpdate.dispatch(this, this.currentFrame);
            }
        }

    }

});

/**
* @name Phaser.Animation#speed
* @property {number} speed - Gets or sets the current speed of the animation in frames per second. Changing this in a playing animation will take effect from the next frame. Minimum value is 1.
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
* @name Phaser.Animation#enableUpdate
* @property {boolean} enableUpdate - Gets or sets if this animation will dispatch the onUpdate events upon changing frame.
*/
Object.defineProperty(Phaser.Animation.prototype, 'enableUpdate', {

    get: function () {

        return (this.onUpdate !== null);

    },

    set: function (value) {

        if (value && this.onUpdate === null)
        {
            this.onUpdate = new Phaser.Signal();
        }
        else if (!value && this.onUpdate !== null)
        {
            this.onUpdate.dispose();
            this.onUpdate = null;
        }

    }

});

/**
* Really handy function for when you are creating arrays of animation data but it's using frame names and not numbers.
* For example imagine you've got 30 frames named: 'explosion_0001-large' to 'explosion_0030-large'
* You could use this function to generate those by doing: Phaser.Animation.generateFrameNames('explosion_', 1, 30, '-large', 4);
*
* @method Phaser.Animation.generateFrameNames
* @static
* @param {string} prefix - The start of the filename. If the filename was 'explosion_0001-large' the prefix would be 'explosion_'.
* @param {number} start - The number to start sequentially counting from. If your frames are named 'explosion_0001' to 'explosion_0034' the start is 1.
* @param {number} stop - The number to count to. If your frames are named 'explosion_0001' to 'explosion_0034' the stop value is 34.
* @param {string} [suffix=''] - The end of the filename. If the filename was 'explosion_0001-large' the prefix would be '-large'.
* @param {number} [zeroPad=0] - The number of zeros to pad the min and max values with. If your frames are named 'explosion_0001' to 'explosion_0034' then the zeroPad is 4.
* @return {string[]} An array of framenames.
*/
Phaser.Animation.generateFrameNames = function (prefix, start, stop, suffix, zeroPad) {

    if (suffix === undefined) { suffix = ''; }

    var output = [];
    var frame = '';

    if (start < stop)
    {
        for (var i = start; i <= stop; i++)
        {
            if (typeof zeroPad === 'number')
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
            if (typeof zeroPad === 'number')
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
