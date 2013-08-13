/// <reference path="../_definitions.ts" />

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

module Phaser.Components {

    export class AnimationManager {

        /**
         * AnimationManager constructor
         * Create a new <code>AnimationManager</code>.
         *
         * @param parent {Sprite} Owner sprite of this manager.
         */
        constructor(parent: Phaser.Sprite) {

            this._parent = parent;
            this.game = parent.game;
            this._anims = {};

        }

        /**
         * Reference to Phaser.Game
         */
        public game: Phaser.Game;

        /**
         * Local private reference to its parent game object.
         */
        private _parent: Phaser.Sprite;

        /**
         * Animation key-value container.
         */
        private _anims: {};

        /**
         * Index of current frame.
         * @type {number}
         */
        private _frameIndex: number;

        /**
         * Data contains animation frames.
         * @type {FrameData}
         */
        private _frameData: FrameData = null;

        /**
         * When an animation frame changes you can choose to automatically update the physics bounds of the parent Sprite
         * to the width and height of the new frame. If you've set a specific physics bounds that you don't want changed during
         * animation then set this to false, otherwise leave it set to true.
         * @type {bool}
         */
        public autoUpdateBounds: bool = true;

        /**
         * Keeps track of the current animation being played.
         */
        public currentAnim: Phaser.Animation;

        /**
         * Keeps track of the current frame of animation.
         */
        public currentFrame: Phaser.Frame = null;

        /**
         * Load animation frame data.
         * @param frameData Data to be loaded.
         */
        public loadFrameData(frameData: Phaser.FrameData) {

            this._frameData = frameData;

            this.frame = 0;

        }

        /**
         * Add a new animation.
         * @param name {string} What this animation should be called (e.g. "run").
         * @param frames {any[]} An array of numbers/strings indicating what frames to play in what order (e.g. [1, 2, 3] or ['run0', 'run1', run2]).
         * @param frameRate {number} The speed in frames per second that the animation should play at (e.g. 60 fps).
         * @param loop {bool} Whether or not the animation is looped or just plays once.
         * @param useNumericIndex {bool} Use number indexes instead of string indexes?
         * @return {Animation} The Animation that was created
         */
        public add(name: string, frames: any[] = null, frameRate: number = 60, loop: bool = false, useNumericIndex: bool = true): Phaser.Animation {

            if (this._frameData == null)
            {
                return;
            }

            //  Create the signals the AnimationManager will emit
            if (this._parent.events.onAnimationStart == null)
            {
                this._parent.events.onAnimationStart = new Phaser.Signal;
                this._parent.events.onAnimationComplete = new Phaser.Signal;
                this._parent.events.onAnimationLoop = new Phaser.Signal;
            }

            if (frames == null)
            {
                frames = this._frameData.getFrameIndexes();
            }
            else
            {
                if (this.validateFrames(frames, useNumericIndex) == false)
                {
                    throw Error('Invalid frames given to Animation ' + name);
                    return;
                }
            }

            if (useNumericIndex == false)
            {
                frames = this._frameData.getFrameIndexesByName(frames);
            }

            this._anims[name] = new Animation(this.game, this._parent, this._frameData, name, frames, frameRate, loop);

            this.currentAnim = this._anims[name];
            this.currentFrame = this.currentAnim.currentFrame;

            return this._anims[name];

        }

        /**
         * Check whether the frames is valid.
         * @param frames {any[]} Frames to be validated.
         * @param useNumericIndex {bool} Does these frames use number indexes or string indexes?
         * @return {bool} True if they're valid, otherwise return false.
         */
        private validateFrames(frames: any[], useNumericIndex: bool): bool {

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

        }

        /**
         * Play animation with specific name.
         * @param name {string} The string name of the animation you want to play.
         * @param frameRate {number} FrameRate you want to specify instead of using default.
         * @param loop {bool} Whether or not the animation is looped or just plays once.
         */
        public play(name: string, frameRate: number = null, loop: bool = false): Animation {

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

        }

        /**
         * Stop animation by name.
         * Current animation will be automatically set to the stopped one.
         */
        public stop(name: string) {

            if (this._anims[name])
            {
                this.currentAnim = this._anims[name];
                this.currentAnim.stop();
            }

        }

        /**
         * Update animation and parent sprite's bounds.
         */
        public update() {

            if (this.currentAnim && this.currentAnim.update() == true)
            {
                this.currentFrame = this.currentAnim.currentFrame;
                this._parent.texture.width = this.currentFrame.width;
                this._parent.texture.height = this.currentFrame.height;
            }

        }

        public get frameData(): FrameData {
            return this._frameData;
        }

        public get frameTotal(): number {

            if (this._frameData)
            {
                return this._frameData.total;
            }
            else
            {
                return -1;
            }
        }

        public get frame(): number {
            return this._frameIndex;
        }

        /**
         *
         * @param value
         */
        public set frame(value: number) {

            if (this._frameData && this._frameData.getFrame(value) !== null)
            {
                this.currentFrame = this._frameData.getFrame(value);

                this._parent.texture.width = this.currentFrame.width;
                this._parent.texture.height = this.currentFrame.height;

                if (this.autoUpdateBounds && this._parent['body'])
                {
                    this._parent.body.bounds.width = this.currentFrame.width;
                    this._parent.body.bounds.height = this.currentFrame.height;
                }

                this._frameIndex = value;
            }

        }

        public get frameName(): string {
            return this.currentFrame.name;
        }

        public set frameName(value: string) {

            if (this._frameData && this._frameData.getFrameByName(value))
            {
                this.currentFrame = this._frameData.getFrameByName(value);

                this._parent.texture.width = this.currentFrame.width;
                this._parent.texture.height = this.currentFrame.height;

                this._frameIndex = this.currentFrame.index;
            }
            else
            {
                throw new Error("Cannot set frameName: " + value);
            }

        }

        /**
         * Removes all related references
         */
        public destroy() {

            this._anims = {};
            this._frameData = null;
            this._frameIndex = 0;
            this.currentAnim = null;
            this.currentFrame = null;

        }

    }

}