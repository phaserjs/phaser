/// <reference path="Game.ts" />
/// <reference path="gameobjects/Sprite.ts" />
/// <reference path="system/animation/Animation.ts" />
/// <reference path="system/animation/AnimationLoader.ts" />
/// <reference path="system/animation/Frame.ts" />
/// <reference path="system/animation/FrameData.ts" />
/**
* Phaser - AnimationManager
*
* Any Sprite that has animation contains an instance of the AnimationManager, which is used to add, play and update
* sprite specific animations.
*/
var Phaser;
(function (Phaser) {
    var AnimationManager = (function () {
        function AnimationManager(game, parent) {
            this._frameData = null;
            this.currentFrame = null;
            this._game = game;
            this._parent = parent;
            this._anims = {
            };
        }
        AnimationManager.prototype.loadFrameData = function (frameData) {
            this._frameData = frameData;
            this.frame = 0;
        };
        AnimationManager.prototype.add = function (name, frames, frameRate, loop, useNumericIndex) {
            if (typeof frames === "undefined") { frames = null; }
            if (typeof frameRate === "undefined") { frameRate = 60; }
            if (typeof loop === "undefined") { loop = false; }
            if (typeof useNumericIndex === "undefined") { useNumericIndex = true; }
            if(this._frameData == null) {
                return;
            }
            if(frames == null) {
                frames = this._frameData.getFrameIndexes();
            } else {
                if(this.validateFrames(frames, useNumericIndex) == false) {
                    throw Error('Invalid frames given to Animation ' + name);
                    return;
                }
            }
            if(useNumericIndex == false) {
                frames = this._frameData.getFrameIndexesByName(frames);
            }
            this._anims[name] = new Phaser.Animation(this._game, this._parent, this._frameData, name, frames, frameRate, loop);
            this.currentAnim = this._anims[name];
            this.currentFrame = this.currentAnim.currentFrame;
        };
        AnimationManager.prototype.validateFrames = function (frames, useNumericIndex) {
            for(var i = 0; i < frames.length; i++) {
                if(useNumericIndex == true) {
                    if(frames[i] > this._frameData.total) {
                        return false;
                    }
                } else {
                    if(this._frameData.checkFrameName(frames[i]) == false) {
                        return false;
                    }
                }
            }
            return true;
        };
        AnimationManager.prototype.play = function (name, frameRate, loop) {
            if (typeof frameRate === "undefined") { frameRate = null; }
            if(this._anims[name]) {
                if(this.currentAnim == this._anims[name]) {
                    if(this.currentAnim.isPlaying == false) {
                        this.currentAnim.play(frameRate, loop);
                    }
                } else {
                    this.currentAnim = this._anims[name];
                    this.currentAnim.play(frameRate, loop);
                }
            }
        };
        AnimationManager.prototype.stop = function (name) {
            if(this._anims[name]) {
                this.currentAnim = this._anims[name];
                this.currentAnim.stop();
            }
        };
        AnimationManager.prototype.update = function () {
            if(this.currentAnim && this.currentAnim.update() == true) {
                this.currentFrame = this.currentAnim.currentFrame;
                this._parent.bounds.width = this.currentFrame.width;
                this._parent.bounds.height = this.currentFrame.height;
            }
        };
        Object.defineProperty(AnimationManager.prototype, "frameData", {
            get: function () {
                return this._frameData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationManager.prototype, "frameTotal", {
            get: function () {
                return this._frameData.total;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationManager.prototype, "frame", {
            get: function () {
                return this._frameIndex;
            },
            set: function (value) {
                if(this._frameData.getFrame(value) !== null) {
                    this.currentFrame = this._frameData.getFrame(value);
                    this._parent.bounds.width = this.currentFrame.width;
                    this._parent.bounds.height = this.currentFrame.height;
                    this._frameIndex = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationManager.prototype, "frameName", {
            get: function () {
                return this.currentFrame.name;
            },
            set: function (value) {
                if(this._frameData.getFrameByName(value) !== null) {
                    this.currentFrame = this._frameData.getFrameByName(value);
                    this._parent.bounds.width = this.currentFrame.width;
                    this._parent.bounds.height = this.currentFrame.height;
                    this._frameIndex = this.currentFrame.index;
                }
            },
            enumerable: true,
            configurable: true
        });
        return AnimationManager;
    })();
    Phaser.AnimationManager = AnimationManager;    
})(Phaser || (Phaser = {}));
