/// <reference path="../_definitions.ts" />
/**
* Animation
*
* An Animation instance contains a single animation and the controls to play it.
* It is created by the AnimationManager and belongs to Game Objects such as Sprite.
*
* @package    Phaser.Animation
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Animation = (function () {
        /**
        * Animation constructor
        * Create a new <code>Animation</code>.
        *
        * @param parent {Sprite} Owner sprite of this animation.
        * @param frameData {FrameData} The FrameData object contains animation data.
        * @param name {string} Unique name of this animation.
        * @param frames {number[]/string[]} An array of numbers or strings indicating what frames to play in what order.
        * @param delay {number} Time between frames in ms.
        * @param looped {bool} Whether or not the animation is looped or just plays once.
        */
        function Animation(game, parent, frameData, name, frames, delay, looped) {
            this.game = game;
            this._parent = parent;
            this._frames = frames;
            this._frameData = frameData;
            this.name = name;
            this.delay = 1000 / delay;
            this.looped = looped;
            this.isFinished = false;
            this.isPlaying = false;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        }
        Object.defineProperty(Animation.prototype, "frameTotal", {
            get: function () {
                return this._frames.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "frame", {
            get: function () {
                if(this.currentFrame !== null) {
                    return this.currentFrame.index;
                } else {
                    return this._frameIndex;
                }
            },
            set: function (value) {
                this.currentFrame = this._frameData.getFrame(value);
                if(this.currentFrame !== null) {
                    this._parent.texture.width = this.currentFrame.width;
                    this._parent.texture.height = this.currentFrame.height;
                    this._frameIndex = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.play = /**
        * Play this animation.
        * @param frameRate {number} FrameRate you want to specify instead of using default.
        * @param loop {bool} Whether or not the animation is looped or just plays once.
        */
        function (frameRate, loop) {
            if (typeof frameRate === "undefined") { frameRate = null; }
            if (typeof loop === "undefined") { loop = null; }
            if(frameRate !== null) {
                this.delay = 1000 / frameRate;
            }
            if(loop !== null) {
                //  If they set a new loop value then use it, otherwise use the default set on creation
                this.looped = loop;
            }
            this.isPlaying = true;
            this.isFinished = false;
            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
            this._parent.events.onAnimationStart.dispatch(this._parent, this);
            return this;
        };
        Animation.prototype.restart = /**
        * Play this animation from the first frame.
        */
        function () {
            this.isPlaying = true;
            this.isFinished = false;
            this._timeLastFrame = this.game.time.now;
            this._timeNextFrame = this.game.time.now + this.delay;
            this._frameIndex = 0;
            this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
        };
        Animation.prototype.stop = /**
        * Stop playing animation and set it finished.
        */
        function () {
            this.isPlaying = false;
            this.isFinished = true;
        };
        Animation.prototype.update = /**
        * Update animation frames.
        */
        function () {
            if(this.isPlaying == true && this.game.time.now >= this._timeNextFrame) {
                this._frameIndex++;
                if(this._frameIndex == this._frames.length) {
                    if(this.looped) {
                        this._frameIndex = 0;
                        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                        this._parent.events.onAnimationLoop.dispatch(this._parent, this);
                    } else {
                        this.onComplete();
                    }
                } else {
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                }
                this._timeLastFrame = this.game.time.now;
                this._timeNextFrame = this.game.time.now + this.delay;
                return true;
            }
            return false;
        };
        Animation.prototype.destroy = /**
        * Clean up animation memory.
        */
        function () {
            this.game = null;
            this._parent = null;
            this._frames = null;
            this._frameData = null;
            this.currentFrame = null;
            this.isPlaying = false;
        };
        Animation.prototype.onComplete = /**
        * Animation complete callback method.
        */
        function () {
            this.isPlaying = false;
            this.isFinished = true;
            this._parent.events.onAnimationComplete.dispatch(this._parent, this);
        };
        return Animation;
    })();
    Phaser.Animation = Animation;    
})(Phaser || (Phaser = {}));
