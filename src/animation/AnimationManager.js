/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Animation Manager is used to add, play and update Phaser Animations.
* Any Game Object such as Phaser.Sprite that supports animation contains a single AnimationManager instance.
*
* @class Phaser.AnimationManager
* @constructor
* @param {Phaser.Sprite} sprite - A reference to the Game Object that owns this AnimationManager.
*/
Phaser.AnimationManager = function (sprite) {

    /**
    * @property {Phaser.Sprite} sprite - A reference to the parent Sprite that owns this AnimationManager.
    */
    this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = sprite.game;

    /**
    * @property {Phaser.Frame} currentFrame - The currently displayed Frame of animation, if any.
    * @default
    */
    this.currentFrame = null;

    /**
    * @property {Phaser.Animation} currentAnim - The currently displayed animation, if any.
    * @default
    */
    this.currentAnim = null;

    /**
    * @property {boolean} updateIfVisible - Should the animation data continue to update even if the Sprite.visible is set to false.
    * @default
    */
    this.updateIfVisible = true;

    /**
    * @property {boolean} isLoaded - Set to true once animation data has been loaded.
    * @default
    */
    this.isLoaded = false;

    /**
    * @property {Phaser.FrameData} _frameData - A temp. var for holding the currently playing Animations FrameData.
    * @private
    * @default
    */
    this._frameData = null;

    /**
    * @property {object} _anims - An internal object that stores all of the Animation instances.
    * @private
    */
    this._anims = {};

    /**
    * @property {object} _outputFrames - An internal object to help avoid gc.
    * @private
    */
    this._outputFrames = [];

};

Phaser.AnimationManager.prototype = {

    /**
    * Loads FrameData into the internal temporary vars and resets the frame index to zero.
    * This is called automatically when a new Sprite is created.
    *
    * @method Phaser.AnimationManager#loadFrameData
    * @private
    * @param {Phaser.FrameData} frameData - The FrameData set to load.
    * @param {string|number} frame - The frame to default to.
    * @return {boolean} Returns `true` if the frame data was loaded successfully, otherwise `false`
    */
    loadFrameData: function (frameData, frame) {

        if (this.isLoaded)
        {
            //   We need to update the frameData that the animations are using
            for (var anim in this._anims)
            {
                this._anims[anim].updateFrameData(frameData);
            }
        }

        this._frameData = frameData;

        if (typeof frame === 'undefined' || frame === null)
        {
            this.frame = 0;
        }
        else
        {
            if (typeof frame === 'string')
            {
                this.frameName = frame;
            }
            else
            {
                this.frame = frame;
            }
        }

        this.isLoaded = true;

        if (this._frameData)
        {
            return true;
        }
        else
        {
            return false;
        }

    },

    /**
    * Adds a new animation under the given key. Optionally set the frames, frame rate and loop.
    * Animations added in this way are played back with the play function.
    *
    * @method Phaser.AnimationManager#add
    * @param {string} name - The unique (within this Sprite) name for the animation, i.e. "run", "fire", "walk".
    * @param {Array} [frames=null] - An array of numbers/strings that correspond to the frames to add to this animation and in which order. e.g. [1, 2, 3] or ['run0', 'run1', run2]). If null then all frames will be used.
    * @param {number} [frameRate=60] - The speed at which the animation should play. The speed is given in frames per second.
    * @param {boolean} [loop=false] - Whether or not the animation is looped or just plays once.
    * @param {boolean} [useNumericIndex=true] - Are the given frames using numeric indexes (default) or strings?
    * @return {Phaser.Animation} The Animation object that was created.
    */
    add: function (name, frames, frameRate, loop, useNumericIndex) {

        if (this._frameData === null)
        {
            console.warn('No FrameData available for Phaser.Animation ' + name);
            return;
        }

        frames = frames || [];
        frameRate = frameRate || 60;

        if (typeof loop === 'undefined') { loop = false; }

        //  If they didn't set the useNumericIndex then let's at least try and guess it
        if (typeof useNumericIndex === 'undefined')
        {
            if (frames && typeof frames[0] === 'number')
            {
                useNumericIndex = true;
            }
            else
            {
                useNumericIndex = false;
            }
        }

        //  Create the signals the AnimationManager will emit
        if (this.sprite.events.onAnimationStart === null)
        {
            this.sprite.events.onAnimationStart = new Phaser.Signal();
            this.sprite.events.onAnimationComplete = new Phaser.Signal();
            this.sprite.events.onAnimationLoop = new Phaser.Signal();
        }

        this._outputFrames.length = 0;

        this._frameData.getFrameIndexes(frames, useNumericIndex, this._outputFrames);

        this._anims[name] = new Phaser.Animation(this.game, this.sprite, name, this._frameData, this._outputFrames, frameRate, loop);

        this.currentAnim = this._anims[name];
        this.currentFrame = this.currentAnim.currentFrame;

        // this.sprite.setFrame(this.currentFrame);

        //  CHECK WE STILL NEED THIS - PRETTY SURE IT DOESN'T ACTUALLY DO ANYTHING!
        if (this.sprite.__tilePattern)
        {
            // this.__tilePattern = false;
            this.sprite.__tilePattern = false;
            this.tilingTexture = false;
        }

        return this._anims[name];

    },

    /**
    * Check whether the frames in the given array are valid and exist.
    *
    * @method Phaser.AnimationManager#validateFrames
    * @param {Array} frames - An array of frames to be validated.
    * @param {boolean} [useNumericIndex=true] - Validate the frames based on their numeric index (true) or string index (false)
    * @return {boolean} True if all given Frames are valid, otherwise false.
    */
    validateFrames: function (frames, useNumericIndex) {

        if (typeof useNumericIndex == 'undefined') { useNumericIndex = true; }

        for (var i = 0; i < frames.length; i++)
        {
            if (useNumericIndex === true)
            {
                if (frames[i] > this._frameData.total)
                {
                    return false;
                }
            }
            else
            {
                if (this._frameData.checkFrameName(frames[i]) === false)
                {
                    return false;
                }
            }
        }

        return true;

    },

    /**
    * Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
    * If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
    *
    * @method Phaser.AnimationManager#play
    * @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
    * @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
    * @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
    * @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
    * @return {Phaser.Animation} A reference to playing Animation instance.
    */
    play: function (name, frameRate, loop, killOnComplete) {

        if (this._anims[name])
        {
            if (this.currentAnim === this._anims[name])
            {
                if (this.currentAnim.isPlaying === false)
                {
                    this.currentAnim.paused = false;
                    return this.currentAnim.play(frameRate, loop, killOnComplete);
                }
                return this.currentAnim;
            }
            else
            {
                if (this.currentAnim && this.currentAnim.isPlaying)
                {
                    this.currentAnim.stop();
                }

                this.currentAnim = this._anims[name];
                this.currentAnim.paused = false;
                this.currentFrame = this.currentAnim.currentFrame;
                return this.currentAnim.play(frameRate, loop, killOnComplete);
            }
        }

    },

    /**
    * Stop playback of an animation. If a name is given that specific animation is stopped, otherwise the current animation is stopped.
    * The currentAnim property of the AnimationManager is automatically set to the animation given.
    *
    * @method Phaser.AnimationManager#stop
    * @param {string} [name=null] - The name of the animation to be stopped, e.g. "fire". If none is given the currently running animation is stopped.
    * @param {boolean} [resetFrame=false] - When the animation is stopped should the currentFrame be set to the first frame of the animation (true) or paused on the last frame displayed (false)
    */
    stop: function (name, resetFrame) {

        if (typeof resetFrame == 'undefined') { resetFrame = false; }

        if (typeof name == 'string')
        {
            if (this._anims[name])
            {
                this.currentAnim = this._anims[name];
                this.currentAnim.stop(resetFrame);
            }
        }
        else
        {
            if (this.currentAnim)
            {
                this.currentAnim.stop(resetFrame);
            }
        }

    },

    /**
    * The main update function is called by the Sprites update loop. It's responsible for updating animation frames and firing related events.
    *
    * @method Phaser.AnimationManager#update
    * @protected
    * @return {boolean} True if a new animation frame has been set, otherwise false.
    */
    update: function () {

        if (this.updateIfVisible && !this.sprite.visible)
        {
            return false;
        }

        if (this.currentAnim && this.currentAnim.update() === true)
        {
            this.currentFrame = this.currentAnim.currentFrame;
            return true;
        }

        return false;

    },

    /**
    * Advances by the given number of frames in the current animation, taking the loop value into consideration.
    *
    * @method Phaser.AnimationManager#next
    * @param {number} [quantity=1] - The number of frames to advance.
    */
    next: function (quantity) {

        if (this.currentAnim)
        {
            this.currentAnim.next(quantity);
            this.currentFrame = this.currentAnim.currentFrame;
        }

    },

    /**
    * Moves backwards the given number of frames in the current animation, taking the loop value into consideration.
    *
    * @method Phaser.AnimationManager#previous
    * @param {number} [quantity=1] - The number of frames to move back.
    */
    previous: function (quantity) {

        if (this.currentAnim)
        {
            this.currentAnim.previous(quantity);
            this.currentFrame = this.currentAnim.currentFrame;
        }

    },

    /**
    * Returns an animation that was previously added by name.
    *
    * @method Phaser.AnimationManager#getAnimation
    * @param {string} name - The name of the animation to be returned, e.g. "fire".
    * @return {Phaser.Animation} The Animation instance, if found, otherwise null.
    */
    getAnimation: function (name) {

        if (typeof name === 'string')
        {
            if (this._anims[name])
            {
                return this._anims[name];
            }
        }

        return null;

    },

    /**
    * Refreshes the current frame data back to the parent Sprite and also resets the texture data.
    *
    * @method Phaser.AnimationManager#refreshFrame
    */
    refreshFrame: function () {

        this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);

        if (this.sprite.__tilePattern)
        {
            this.__tilePattern = false;
            this.tilingTexture = false;
        }

    },

    /**
    * Destroys all references this AnimationManager contains.
    * Iterates through the list of animations stored in this manager and calls destroy on each of them.
    *
    * @method Phaser.AnimationManager#destroy
    */
    destroy: function () {

        var anim = null;

        for (var anim in this._anims)
        {
            if (this._anims.hasOwnProperty(anim))
            {
                this._anims[anim].destroy();
            }
        }

        this._anims = {};
        this._frameData = null;
        this._frameIndex = 0;
        this.currentAnim = null;
        this.currentFrame = null;

    }

};

Phaser.AnimationManager.prototype.constructor = Phaser.AnimationManager;

/**
* @name Phaser.AnimationManager#frameData
* @property {Phaser.FrameData} frameData - The current animations FrameData.
* @readonly
*/
Object.defineProperty(Phaser.AnimationManager.prototype, 'frameData', {

    get: function () {
        return this._frameData;
    }

});

/**
* @name Phaser.AnimationManager#frameTotal
* @property {number} frameTotal - The total number of frames in the currently loaded FrameData, or -1 if no FrameData is loaded.
* @readonly
*/
Object.defineProperty(Phaser.AnimationManager.prototype, 'frameTotal', {

    get: function () {

        if (this._frameData)
        {
            return this._frameData.total;
        }
        else
        {
            return -1;
        }
    }

});

/**
* @name Phaser.AnimationManager#paused
* @property {boolean} paused - Gets and sets the paused state of the current animation.
*/
Object.defineProperty(Phaser.AnimationManager.prototype, 'paused', {

    get: function () {

        return this.currentAnim.isPaused;

    },

    set: function (value) {

        this.currentAnim.paused = value;

    }

});

/**
* @name Phaser.AnimationManager#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.AnimationManager.prototype, 'frame', {

    get: function () {

        if (this.currentFrame)
        {
            return this._frameIndex;
        }

    },

    set: function (value) {

        if (typeof value === 'number' && this._frameData && this._frameData.getFrame(value) !== null)
        {
            this.currentFrame = this._frameData.getFrame(value);

            if (this.currentFrame)
            {
                this._frameIndex = value;

                this.sprite.setFrame(this.currentFrame);

                if (this.sprite.__tilePattern)
                {
                    this.__tilePattern = false;
                    this.tilingTexture = false;
                }
            }
        }

    }

});

/**
* @name Phaser.AnimationManager#frameName
* @property {string} frameName - Gets or sets the current frame name and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.AnimationManager.prototype, 'frameName', {

    get: function () {

        if (this.currentFrame)
        {
            return this.currentFrame.name;
        }

    },

    set: function (value) {

        if (typeof value === 'string' && this._frameData && this._frameData.getFrameByName(value) !== null)
        {
            this.currentFrame = this._frameData.getFrameByName(value);

            if (this.currentFrame)
            {
                this._frameIndex = this.currentFrame.index;

                this.sprite.setFrame(this.currentFrame);

                if (this.sprite.__tilePattern)
                {
                    this.__tilePattern = false;
                    this.tilingTexture = false;
                }
            }
        }
        else
        {
            console.warn('Cannot set frameName: ' + value);
        }
    }

});
