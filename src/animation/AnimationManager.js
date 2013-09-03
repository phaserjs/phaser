/**
* AnimationManager
*
* Any Game Object that supports animation contains a single AnimationManager instance. It is used to add,
* play and update Phaser.Animation objects.
*
* @package    Phaser.Components.AnimationManager
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
Phaser.AnimationManager = function (parent) {

	/**
	* Data contains animation frames.
	* @type {FrameData}
	*/
	this._frameData = null;

	/**
	* Keeps track of the current frame of the animation.
	*/
	this.currentFrame = null;

	this._parent = parent;

	this.game = parent.game;

	this._anims = {};

};

Phaser.AnimationManager.prototype = {

	updateIfVisible: true,

	/**
	* Load animation frame data.
	* @param frameData Data to be loaded.
	*/
	loadFrameData: function (frameData) {

		this._frameData = frameData;
		this.frame = 0;

	},

	/**
	* Add a new animation.
	* @param name {string} What this animation should be called (e.g. "run").
	* @param frames {any[]} An array of numbers/strings indicating what frames to play in what order (e.g. [1, 2, 3] or ['run0', 'run1', run2]).
	* @param frameRate {number} The speed in frames per second that the animation should play at (e.g. 60 fps).
	* @param loop {bool} Whether or not the animation is looped or just plays once.
	* @param useNumericIndex {bool} Use number indexes instead of string indexes?
	* @return {Animation} The Animation that was created
	*/
	add: function (name, frames, frameRate, loop, useNumericIndex) {

		frames = frames || null;
		frameRate = frameRate || 60;
		loop = loop || false;
		useNumericIndex = useNumericIndex || true;

		if (this._frameData == null)
		{
			console.warn('No frameData available for Phaser.Animation ' + name);
			return;
		}

		//  Create the signals the AnimationManager will emit
		// if (this._parent.events.onAnimationStart == null)
		// {
			// this._parent.events.onAnimationStart = new Phaser.Signal();
			// this._parent.events.onAnimationComplete = new Phaser.Signal();
			// this._parent.events.onAnimationLoop = new Phaser.Signal();
		// }

		if (frames == null)
		{
			frames = this._frameData.getFrameIndexes();
		}
		else
		{
			if (this.validateFrames(frames, useNumericIndex) == false)
			{
				console.warn('Invalid frames given to Phaser.Animation ' + name);
				return;
			}
		}

		if (useNumericIndex == false)
		{
			frames = this._frameData.getFrameIndexesByName(frames);
		}

		this._anims[name] = new Phaser.Animation(this.game, this._parent, this._frameData, name, frames, frameRate, loop);
		this.currentAnim = this._anims[name];
		this.currentFrame = this.currentAnim.currentFrame;
		this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

		return this._anims[name];

	},

	/**
	* Check whether the frames is valid.
	* @param frames {any[]} Frames to be validated.
	* @param useNumericIndex {bool} Does these frames use number indexes or string indexes?
	* @return {bool} True if they're valid, otherwise return false.
	*/
	validateFrames: function (frames, useNumericIndex) {

		for (var i = 0; i < frames.length; i++)
		{
			if (useNumericIndex == true)
			{
				if (frames[i] > this._frameData.total)
				{
					return false;
				}
			}
			else
			{
				if (this._frameData.checkFrameName(frames[i]) == false)
				{
					return false;
				}
			}
		}

		return true;

	},

	/**
	* Play animation with specific name.
	* @param name {string} The string name of the animation you want to play.
	* @param frameRate {number} FrameRate you want to specify instead of using default.
	* @param loop {bool} Whether or not the animation is looped or just plays once.
	*/
	play: function (name, frameRate, loop) {

		frameRate = frameRate || null;
		loop = loop || null;
		
		if (this._anims[name])
		{
			if (this.currentAnim == this._anims[name])
			{
				if (this.currentAnim.isPlaying == false)
				{
					return this.currentAnim.play(frameRate, loop);
				}
			}
			else
			{
				this.currentAnim = this._anims[name];
				return this.currentAnim.play(frameRate, loop);
			}
		}

	},

	/**
	* Stop animation by name.
	* Current animation will be automatically set to the stopped one.
	*/
	stop: function (name) {

		if (this._anims[name])
		{
			this.currentAnim = this._anims[name];
			this.currentAnim.stop();
		}

	},

	/**
	* Update animation and parent sprite's bounds.
	* Returns true if a new frame has been set, otherwise false.
	*/
	update: function () {

		if (this.updateIfVisible && this._parent.visible == false)
		{
			return false;
		}

		if (this.currentAnim && this.currentAnim.update() == true)
		{
			this.currentFrame = this.currentAnim.currentFrame;
			this._parent.currentFrame = this.currentFrame;
			return true;
		}

		return false;

	},

	/**
    * Removes all related references
    */
    destroy: function () {

        this._anims = {};
        this._frameData = null;
        this._frameIndex = 0;
        this.currentAnim = null;
        this.currentFrame = null;

    }

};

Object.defineProperty(Phaser.AnimationManager.prototype, "frameData", {

    get: function () {
        return this._frameData;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.AnimationManager.prototype, "frameTotal", {

    get: function () {

        if (this._frameData)
        {
            return this._frameData.total;
        }
        else
        {
            return -1;
        }
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.AnimationManager.prototype, "frame", {

    get: function () {

    	if (this.currentFrame)
    	{
	        return this._frameIndex;
	    }
	    
    },

	/**
    *
    * @param value
    */
    set: function (value) {

        if (this._frameData && this._frameData.getFrame(value) !== null)
        {
            this.currentFrame = this._frameData.getFrame(value);
            this._frameIndex = value;
            this._parent.currentFrame = this.currentFrame;
			this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }

    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.AnimationManager.prototype, "frameName", {

    get: function () {

    	if (this.currentFrame)
    	{
	        return this.currentFrame.name;
    	}

    },

    set: function (value) {

        if (this._frameData && this._frameData.getFrameByName(value))
        {
            this.currentFrame = this._frameData.getFrameByName(value);
            this._frameIndex = this.currentFrame.index;
            this._parent.currentFrame = this.currentFrame;
			this._parent.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);
        }
        else
        {
            console.warn("Cannot set frameName: " + value);
        }
    },

    enumerable: true,
    configurable: true
});
