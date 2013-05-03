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

module Phaser {

    export class AnimationManager {

        /**
         * AnimationManager constructor
         *
         * Create a new <code>AnimationManager</code>.
         *
         * @param parent Owner sprite of this manager.
         */
        constructor(game: Game, parent: Sprite) {

            this._game = game;
            this._parent = parent;
            this._anims = {};

        }

        /**
         * Local private reference to game.
         */
        private _game: Game;
        /**
         * Local private reference to its owner sprite.
         */
        private _parent: Sprite;

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
         * Keeps track of the current animation being played.
         */
        public currentAnim: Animation;
        /**
         * Keeps track of the current frame of animation.
         */
        public currentFrame: Frame = null;

        /**
         * Load animation frame data.
         * @param frameData Data to be loaded.
         */
        public loadFrameData(frameData: FrameData) {

            this._frameData = frameData;

            this.frame = 0;

        }

        /**
         * Add a new animation.
         * @param name      What this animation should be called (e.g. "run").
         * @param frames    An array of numbers/strings indicating what frames to play in what order (e.g. [1, 2, 3] or ['run0', 'run1', run2]).
         * @param frameRate The speed in frames per second that the animation should play at (e.g. 60 fps).
         * @param loop      Whether or not the animation is looped or just plays once.
         * @param useNumericIndex Use number indexes instead of string indexes?
         */
        public add(name: string, frames: any[] = null, frameRate: number = 60, loop: bool = false, useNumericIndex: bool = true) {

            if (this._frameData == null)
            {
                return;
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

            this._anims[name] = new Animation(this._game, this._parent, this._frameData, name, frames, frameRate, loop);

            this.currentAnim = this._anims[name];
            this.currentFrame = this.currentAnim.currentFrame;

        }

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
         * @param name      The string name of the animation you want to play.
         * @param frameRate FrameRate you want to specify instead of using default.
         * @param loop      Whether or not the animation is looped or just plays once.
         */
        public play(name: string, frameRate?: number = null, loop?: bool) {

            if (this._anims[name])
            {
                if (this.currentAnim == this._anims[name])
                {
                    if (this.currentAnim.isPlaying == false)
                    {
                        this.currentAnim.play(frameRate, loop);
                    }
                }
                else
                {
                    this.currentAnim = this._anims[name];
                    this.currentAnim.play(frameRate, loop);
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
                this._parent.bounds.width = this.currentFrame.width;
                this._parent.bounds.height = this.currentFrame.height;
            }

        }

        public get frameData(): FrameData {
            return this._frameData;
        }

        public get frameTotal(): number {
            return this._frameData.total;
        }

        public get frame(): number {
            return this._frameIndex;
        }

        public set frame(value: number) {

            if (this._frameData.getFrame(value) !== null)
            {
                this.currentFrame = this._frameData.getFrame(value);

                this._parent.bounds.width = this.currentFrame.width;
                this._parent.bounds.height = this.currentFrame.height;
                this._frameIndex = value;
            }

        }

        public get frameName(): string {
            return this.currentFrame.name;
        }

        public set frameName(value: string) {

            if (this._frameData.getFrameByName(value) !== null)
            {
                this.currentFrame = this._frameData.getFrameByName(value);

                this._parent.bounds.width = this.currentFrame.width;
                this._parent.bounds.height = this.currentFrame.height;
                this._frameIndex = this.currentFrame.index;
            }

        }

    }

}