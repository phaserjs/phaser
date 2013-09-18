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
* @class Animation
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
* @param {Phaser.Sprite} parent A reference to the owner of this Animation.
* @param {String} name The unique name for this animation, used in playback commands.
* @param {Phaser.Animation.FrameData} frameData The FrameData object that contains all frames used by this Animation.
* @param {Mixed} frames An array of numbers or strings indicating which frames to play in which order.
* @param {Number} delay The time between each frame of the animation, given in ms.
* @param {Boolean} looped Should this animation loop or play through once.
*/
Phaser.Animation = function (game, parent, name, frameData, frames, delay, looped) {

    /**
    * A reference to the currently running Game.
    * @property game
    * @public
    * @type {Phaser.Game}
    */
	this.game = game;

    /**
    * A reference to the parent Sprite that owns this Animation.
    * @property _parent
    * @private
    * @type {Phaser.Sprite}
    */
	this._parent = parent;

    /**
    * The FrameData the Animation uses.
    * @property _frameData
    * @private
    * @type {Phaser.FrameData}
    */
    this._frameData = frameData;

    /**
    * The user defined name given to this Animation.
    * @property name
    * @public
    * @type {String}
    */
    this.name = name;

    /**
    * @property _frames
    * @private
    * @type {Object}
    */
	this._frames = frames;

    /**
    * The delay in ms between each frame of the Animation.
    * @property delay
    * @public
    * @type {Number}
    */
	this.delay = 1000 / delay;

    /**
    * The loop state of the Animation.
    * @property looped
    * @public
    * @type {Boolean}
    */
	this.looped = looped;

    /**
    * The finished state of the Animation. Set to true once playback completes, false during playback.
    * @property isFinished
    * @public
    * @type {Boolean}
    * default true
    */
	this.isFinished = false;

    /**
    * The playing state of the Animation. Set to false once playback completes, true during playback.
    * @property isPlaying
    * @public
    * @type {Boolean}
    * default false
    */
	this.isPlaying = false;

    /**
    * @property _frameIndex
    * @private
    * @type {Number}
    * default 0
    */
	this._frameIndex = 0;

    /**
    * The currently displayed frame of the Animation.
    * @property currentFrame
    * @public
    * @type {Phaser.Animation.Frame}
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

        frameRate = frameRate || null;
        loop = loop || null;

        if (frameRate !== null)
        {
            // this.delay = 1000 / frameRate;
            this.delay = frameRate;
        }

        if (loop !== null)
        {
            //  If they set a new loop value then use it, otherwise use the default set on creation
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

        if (this.isPlaying == true && this.game.time.now >= this._timeNextFrame)
        {
            this._frameIndex++;

            if (this._frameIndex == this._frames.length)
            {
                if (this.looped)
                {
                    this._frameIndex = 0;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                    this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
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

            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;

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

Object.defineProperty(Phaser.Animation.prototype, "frameTotal", {

    /**
    * @method frameTotal
    * @return {Number} The total number of frames in this animation.
    */
    get: function () {
        return this._frames.length;
    }

});

Object.defineProperty(Phaser.Animation.prototype, "frame", {

    /**
    * @method frame
    * @return {Animation.Frame} Returns the current frame, or if not set the index of the most recent frame.
    */
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

    /**
    * @method frame
    * @return {Number} Sets the current frame to the given frame index and updates the texture cache.
    */
    set: function (value) {

        this.currentFrame = this._frameData.getFrame(value);

        if (this.currentFrame !== null)
        {
            this._frameIndex = value;
			this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }

    }

});
