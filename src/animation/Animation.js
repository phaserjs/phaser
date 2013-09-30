/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Animation
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
* @param {Phaser.Animation.FrameData} frameData - The FrameData object that contains all frames used by this Animation.
* @param {(Array.<number>|Array.<string>)} frames - An array of numbers or strings indicating which frames to play in which order.
* @param {number} delay - The time between each frame of the animation, given in ms.
* @param {boolean} looped - Should this animation loop or play through once.
*/
Phaser.Animation = function (game, parent, name, frameData, frames, delay, looped) {

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
    * @property {object} _frames
    * @private
    */
	this._frames = [];
    this._frames = this._frames.concat(frames);

    /**
    * @property {number} delay - The delay in ms between each frame of the Animation.
    */
	this.delay = 1000 / delay;

    /**
    * @property {boolean} looped - The loop state of the Animation.
    */
	this.looped = looped;

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

    this._frameDiff = 0;
    this._frameSkip = 1;

    /**
    * @property {Phaser.Animation.Frame} currentFrame - The currently displayed frame of the Animation.
    */
	this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
	
};

Phaser.Animation.prototype = {

    /**
    * Plays this animation.
    *
    * @method play
    * @param {Number} [frameRate=null] The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
    * @param {Boolean} [loop=null] Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
    * @return {Phaser.Animation} A reference to this Animation instance.
    */
    play: function (frameRate, loop) {

        if (typeof frameRate === 'number')
        {
            //  If they set a new frame rate then use it, otherwise use the one set on creation
            this.delay = 1000 / frameRate;
        }

        if (typeof loop === 'boolean')
        {
            //  If they set a new loop value then use it, otherwise use the one set on creation
            this.looped = loop;
        }

        this.isPlaying = true;
        this.isFinished = false;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
		this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

        if (this._parent.events)
        {
            this._parent.events.onAnimationStart.dispatch(this._parent, this);
        }

        return this;

    },

    /**
    * Sets this animation back to the first frame and restarts the animation.
    *
    * @method restart
    */
    restart: function () {

        this.isPlaying = true;
        this.isFinished = false;

        this._timeLastFrame = this.game.time.now;
        this._timeNextFrame = this.game.time.now + this.delay;

        this._frameIndex = 0;

        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

    },

    /**
    * Stops playback of this animation and set it to a finished state. If a resetFrame is provided it will stop playback and set frame to the first in the animation.
    *
    * @method stop
    * @param {Boolean} [resetFrame=false] If true after the animation stops the currentFrame value will be set to the first frame in this animation.
    */
    stop: function (resetFrame) {

        if (typeof resetFrame === 'undefined') { resetFrame = false; }

        this.isPlaying = false;
        this.isFinished = true;

        if (resetFrame)
        {
            this.currentFrame = this._frameData.getFrame(this._frames[0]);
        }

    },

    /**
    * Updates this animation. Called automatically by the AnimationManager.
    *
    * @method update
    */
    update: function () {

        if (this.isPaused)
        {
            return false;
        }

        if (this.isPlaying == true && this.game.time.now >= this._timeNextFrame)
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
                if (this.looped)
                {
                    this._frameIndex %= this._frames.length;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

                    if (this.currentFrame)
                    {
                        this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
                    }
                    
                    this._parent.events.onAnimationLoop.dispatch(this._parent, this);
                }
                else
                {
                    this.onComplete();
                }
            }
            else
            {
                this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
				this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
            }

            return true;
        }

        return false;

    },

    /**
    * Cleans up this animation ready for deletion. Nulls all values and references.
    *
    * @method destroy
    */
    destroy: function () {

        this.game = null;
        this._parent = null;
        this._frames = null;
        this._frameData = null;
        this.currentFrame = null;
        this.isPlaying = false;

    },

    /**
    * Called internally when the animation finishes playback. Sets the isPlaying and isFinished states and dispatches the onAnimationComplete event if it exists on the parent.
    *
    * @method onComplete
    */
    onComplete: function () {

        this.isPlaying = false;
        this.isFinished = true;

        if (this._parent.events)
        {
            this._parent.events.onAnimationComplete.dispatch(this._parent, this);
        }

    }

};

/**
 */
Object.defineProperty(Phaser.Animation.prototype, "paused", {

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

Object.defineProperty(Phaser.Animation.prototype, "frameTotal", {

    /**
    * @method frameTotal
    * @return {Number} The total number of frames in this animation.
    */
    get: function () {
        return this._frames.length;
    }

});

/**
 * Sets the current frame to the given frame index and updates the texture cache.
 * @param {number} value - The frame to display
 *
 *//**
 *
 * Returns the current frame, or if not set the index of the most recent frame.
 * @returns {Animation.Frame}
 *
 */
Object.defineProperty(Phaser.Animation.prototype, "frame", {

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

        this.currentFrame = this._frameData.getFrame(value);

        if (this.currentFrame !== null)
        {
            this._frameIndex = value;
			this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }

    }

});

/*
 * Really handy function for when you are creating arrays of animation data but it's using frame names and not numbers.
 * For example imagine you've got 30 frames named: 'explosion_0001-large' to 'explosion_0030-large'
 * You could use this function to generate those by doing: Phaser.Animation.generateFrameNames('explosion_', 1, 30, '-large', 4);
 * The zeroPad value dictates how many zeroes to add in front of the numbers (if any)
 */
Phaser.Animation.generateFrameNames = function (prefix, min, max, suffix, zeroPad) {

    if (typeof suffix == 'undefined') { suffix = ''; }

    var output = [];
    var frame = '';

    for (var i = min; i <= max; i++)
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

    return output;

}
